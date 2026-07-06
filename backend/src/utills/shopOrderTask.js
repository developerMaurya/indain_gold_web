import ShopModel from '../models/shopModel.js';
import { sendPushNotification, sendOrderConfirmationNotification } from './notificationHelper.js';
import { getConnection } from '../config/db.config.js';
import { DateTimeService } from '../utills/datetime.js';

export const performShopOrderClosing = async (lockObject) => {
    // Separate lock for shop processing to avoid blocking user migration
    if (lockObject.isShopProcessing) {
        console.log("⚠️ Skipping Shop Orders - already processing");
        return;
    }
    
    lockObject.isShopProcessing = true;
    
    const processedIds = new Set();
    
    try {
        while (true) {
            const tempResults = await ShopModel.getShopOrdersTemp();
            
            if (!tempResults || tempResults.length === 0 || tempResults[0]?.ret <= 0) {
                console.log("🏁 No more shop orders to process");
                break;
            }

            let progressMade = false;

            for (const row of tempResults) {
                if (row.ret > 0 && row.JsonData) {
                    try {
                        const orderDataArray = JSON.parse(row.JsonData);
                        
                        for (const orderData of orderDataArray) {
                            const orderId = orderData.OrderId;

                            if (processedIds.has(orderId)) continue;

                            if (orderId) {
                                processedIds.add(orderId);
                                progressMade = true;
                                
                                const result = await ShopModel.closeShopOrder(orderId);
                                console.log("result...", result);
                                
                                // Process notification if successful OR already generated
                                if (result.ret > 0) {
                                    console.log(`✅ Shop Order ${orderId} handled (${result.Message})`);
                                    
                                    try {
                                        const targetUserId = result.UserId;
                                        
                                        console.log("targetUserId for notification...", targetUserId);
                                        if (targetUserId) {
                                            const pool = await getConnection();
                                            
                                            // Fetch user profile to get Mobile, Email, CallingCode for notification
                                            const profileResult = await pool.request()
                                                .input("UserID", targetUserId)
                                                .execute("UserProfileGet");
                                                
                                            const profileRecord = profileResult.recordset?.[0];
                                            const profileData = profileRecord?.ret > 0 && profileRecord.JsonData
                                                ? JSON.parse(profileRecord.JsonData)?.[0]
                                                : null;
                                            
                                            await sendOrderConfirmationNotification(pool, targetUserId, {
                                                Mobile: profileData?.Mobile || null,
                                                Email: profileData?.Email || null,
                                                CountryCode: profileData?.CountryCode || "IN", // req.body doesn't exist here in cron
                                                CallingCode: profileData?.CallingCode || null,
                                                InvoiceNo: result.InvoiceNo || null,
                                                GrandTotal: result.GrandTotal || null,
                                                OrderDate: DateTimeService.getCurrentDateTime(),
                                                PaymentMode: result.PaymentMode || null,
                                            });
                                                await sendPushNotification(
                                                    targetUserId, 
                                                    "Order Status!", 
                                                    `Your Shop Order #${orderId} is now generated.`
                                                );
                                            }
                                        } catch (e) {
                                            console.error("❌ Error parsing user data for notification");
                                        }
                                } else {
                                    console.log(`❌ Shop Order ${orderId} failed: ${result?.Message || 'Unknown error'}`);
                                }
                            }
                        }
                    } catch (err) {
                        console.error('❌ Error parsing Shop Order JsonData:', err.message);
                    }
                }
            }

            if (!progressMade) break;
        }
    } catch (error) {
        console.error('❌ Shop Order Task Error:', error.message);
    } finally {
        lockObject.isShopProcessing = false;
    }
};
