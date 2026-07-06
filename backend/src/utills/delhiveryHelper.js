import axios from 'axios';
import { getConnection } from '../config/db.config.js';

/**
 * Automatically creates a Delhivery shipment for a confirmed order and updates its waybill in the DB.
 * 
 * @param {string} finalOrderKey - The order key from the DB to fetch invoice details
 * @param {string|number} orderId - Fallback Order ID for logging and mapping
 */
export const createDelhiveryShipment = async (finalOrderKey, orderId, invoiceNo = null) => {
    if (!finalOrderKey && !invoiceNo) {
        console.warn("WARNING: Cannot initiate Delhivery shipment - missing OrderKey and InvoiceNo.");
        return;
    }

    try {
        console.log(`[Delhivery Helper] Fetching details for OrderKey: ${finalOrderKey || 'N/A'}, InvoiceNo: ${invoiceNo || 'N/A'}`);
        const pool = await getConnection();

        const orderResult = await pool.request()
            .input('OrderKey', finalOrderKey || null)
            .input('InvoiceNo', invoiceNo || null)
            .execute('ShopOrderInvoiceGet');

        const dbRecord = orderResult.recordset?.[0];
        console.log("[Delhivery Helper] db record data..", dbRecord);

        if (!dbRecord) {
            console.warn("[Delhivery Helper] WARNING: No record returned from ShopOrderInvoiceGet!");
            return;
        }

        let order = null;
        if (dbRecord.JsonData) {
            try {
                const parsed = JSON.parse(dbRecord.JsonData);
                order = Array.isArray(parsed) ? parsed[0] : parsed;
            } catch (parseErr) {
                console.error("[Delhivery Helper] Failed to parse JsonData from ShopOrderInvoiceGet:", parseErr.message);
            }
        } else {
            order = dbRecord;
        }

        if (!order) {
            console.warn("[Delhivery Helper] WARNING: Could not parse order object.");
            return;
        }

        console.log("[Delhivery Helper] ShopOrderInvoiceGet dynamic order payload loaded successfully!");

        // 1. Map dynamic customer delivery details from ShipTo (or BillTo)
        const shipTo = order.ShipTo?.[0] || order.BillTo?.[0] || {};
        const name = shipTo.FullName || order.Name || "";
        const fullCustomerAddress = [shipTo.AddressLine1, shipTo.AddressLine2, shipTo.Landmark]
            .filter(Boolean)
            .map(x => String(x).trim())
            .filter(Boolean)
            .join(', ');
        const add = fullCustomerAddress || "";
        const pin = shipTo.PinCode ? String(shipTo.PinCode) : "";
        const city = shipTo.City || "";
        const state = shipTo.State || "";
        const phone = shipTo.Mobile || shipTo.MobileNo || order.MobileNo || order.Mobile || "";

        // 2. Map dynamic pickup location from BillFrom
        const billFrom = order.BillFrom?.[0] || {};
        const pickupLocation = {
            name: billFrom.FranchiseCode,
            add: [billFrom.AddressLine1, billFrom.AddressLine2, billFrom.Landmark].filter(Boolean).map(x => String(x).trim()).filter(Boolean).join(', ') || "",
            city: billFrom.City || "",
            pin_code: billFrom.PinCode ? parseInt(billFrom.PinCode) : null,
            phone: billFrom.Mobile || "",
            country: billFrom.Country || "India"
        };

        const isCOD = String(order.PaymentMode || "").toUpperCase() === 'COD';
        const paymentMode = isCOD ? "COD" : "Pre-paid";
        const codAmount = isCOD ? String(order.GrandTotal || 0) : "0";
        const totalQty = String(order.TotalQty || 0);
        const grandTotal = String(order.GrandTotal || 0);

        const productNames = (order.OrderDetails || [])
            .map(p => p.ProductName)
            .filter(Boolean)
            .map(x => String(x).trim())
            .filter(Boolean)
            .join(', ');
        const productsDesc = productNames || "";

        const shipmentPayload = {
            shipments: [
                {
                    name: name,
                    add: add,
                    pin: pin,
                    city: city,
                    state: state,
                    country: "India",
                    phone: phone,
                    order: order.InvoiceNo || invoiceNo || String(orderId),
                    payment_mode: paymentMode,
                    return_pin: "",
                    return_city: "",
                    return_phone: "",
                    return_add: "",
                    return_state: "",
                    return_country: "",
                    products_desc: productsDesc,
                    hsn_code: "",
                    cod_amount: codAmount,
                    order_date: null,
                    total_amount: grandTotal,
                    seller_add: pickupLocation.add || "",
                    seller_name: pickupLocation.name || "",
                    seller_inv: order.InvoiceNo || invoiceNo || String(orderId),
                    quantity: totalQty,
                    waybill: "",
                    shipment_width: "2",
                    shipment_height: "1",
                    weight: "100",
                    seller_gst_tin: "",
                    shipping_mode: "Surface",
                    address_type: "home"
                }
            ],
            pickup_location: pickupLocation
        };

        const isProduction = process.env.DELHIVERY_ENV === 'production';
        const baseUrl = isProduction ? process.env.DELHIVERY_PRODUCTION_URL : process.env.DELHIVERY_STAGING_URL;
        const baseDomain = baseUrl ? baseUrl.replace(/\/$/, '') : '';
        const apiToken = process.env.DELHIVERY_API_TOKEN;

        if (baseDomain && apiToken) {
            const targetUrl = `${baseDomain}/cmu/create.json`;
            const payloadString = `format=json&data=${encodeURIComponent(JSON.stringify(shipmentPayload))}`;

            console.log("----------------- DELHIvery Shipment Tracking Initiated -----------------");
            console.log("Target URL:", targetUrl);
            console.log("Shipment Payload:", JSON.stringify(shipmentPayload, null, 2));

            const response = await axios.post(targetUrl, payloadString, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${apiToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const delhiveryData = response?.data;
            console.log("Delhivery Shipment API Full Response:", JSON.stringify(delhiveryData, null, 2));

            if (delhiveryData && Array.isArray(delhiveryData.packages) && delhiveryData.packages.length > 0) {
                const firstPkg = delhiveryData.packages[0];
                if (firstPkg.waybill) {
                    console.log("SUCCESS: Delhivery Waybill Generated:", firstPkg.waybill);

                    // Update the order's TrackNo/AWBCode in the database using the stored procedure
                    console.log("Updating TrackNo in DB using ShopOrderUpdateAWBCode stored procedure for OrderKey:", finalOrderKey);
                    await pool.request()
                        .input('OrderKey', finalOrderKey)
                        .input('AWBCode', firstPkg.waybill)
                        .execute('ShopOrderUpdateAWBCode');
                    console.log("DB UPDATE SUCCESS: Waybill updated in DB via ShopOrderUpdateAWBCode!");
                } else {
                    console.warn("WARNING: Waybill was not generated for the package!");
                    console.warn("Package Status:", firstPkg.status);
                    console.warn("Serviceable:", firstPkg.serviceable);
                    console.warn("Detailed Package Remarks:", JSON.stringify(firstPkg.remarks, null, 2));
                }
            } else {
                console.warn("WARNING: No package data returned from Delhivery response!");
            }
            console.log("----------------- DELHIvery Shipment Tracking Completed -----------------");
        } else {
            console.warn("WARNING: Delhivery baseDomain or apiToken is missing from environment variables!");
        }

    } catch (error) {
        console.error("Auto shipment creation FAILED for Order:", orderId);
        console.error("Error Message:", error.message);
        if (error.response && error.response.data) {
            console.error("Delhivery API Error Response:", JSON.stringify(error.response.data, null, 2));
        }
    }
};
