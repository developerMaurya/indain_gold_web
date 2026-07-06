export const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    FAILED: 'failed',
    PENDING: 'pending',
    COMPLETED: 'completed'
};
export const ActionStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    MAINTENANCE: 'maintenance'
};


export const BookingStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
};

export const PaymentStatus = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};
export const VALIDATION_KEYS = {
    USERNAME: 'Username',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    FIRST_NAME: 'FirstName',
    LAST_NAME: 'LastName',
    REFRESH_TOKEN: 'RefreshToken',
    OLD_PASSWORD: 'OldPassword',
    NEW_PASSWORD: 'NewPassword',
    TOKEN: 'Token'
};

export const ROLES = {
    ADMIN: 'Admin',  // DB returns Role = "1", mapped to "admin" in token
    USER: 'User',
};

export const DeliveryStatus = {
    ORDER_PLACED: 0,
    CANCELLED: -1,
    ORDER_PACKED: 1,
    AWAITING_SHIPMENT: 2,
    AWAITING_PICKUP: 3,
    SHIPPED: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
    DELIVERY_FAILED: 7
};

export const getDeliveryStatusLabel = (status) => {
    const labels = {
        [DeliveryStatus.ORDER_PLACED]: "Order Placed",
        [DeliveryStatus.CANCELLED]: "Cancelled",
        [DeliveryStatus.ORDER_PACKED]: "Order Packed",
        [DeliveryStatus.AWAITING_SHIPMENT]: "Awaiting Shipment",
        [DeliveryStatus.AWAITING_PICKUP]: "Awaiting Pickup",
        [DeliveryStatus.SHIPPED]: "Shipped",
        [DeliveryStatus.OUT_FOR_DELIVERY]: "Out For Delivery",
        [DeliveryStatus.DELIVERED]: "Delivered",
        [DeliveryStatus.DELIVERY_FAILED]: "Delivery Failed"
    };
    // Ensure numeric comparison works by casting input to number
    return labels[Number(status)] || "Processed";
};

export const getDeliveryStatusNotification = (status) => {
    console.log("status", status);
    switch (Number(status)) {
        case DeliveryStatus.ORDER_PLACED: // 0
            return {
                title: "Order Confirmed! 🎉",
                body: "We've received your order. Thanks for shopping with us!"
            };
        case DeliveryStatus.ORDER_PACKED: // 1
            return {
                title: "Packed & Ready! 📦",
                body: "Your items have been carefully packed and are ready to move."
            };
        case DeliveryStatus.AWAITING_SHIPMENT: // 2
            return {
                title: "Ready for Dispatch 🚚",
                body: "Your package is being handed over to our shipping partner."
            };
        case DeliveryStatus.AWAITING_PICKUP: // 3
            return {
                title: "Pick-up in Progress 📍",
                body: "Our courier partner is arriving soon to pick up your order."
            };
        case DeliveryStatus.SHIPPED: // 4
            return {
                title: "On Its Way! ✈️",
                body: "Your order has been shipped. Track it to see its real-time progress."
            };
        case DeliveryStatus.OUT_FOR_DELIVERY: // 5
            return {
                title: "Arriving Today! 🏠",
                body: "Get ready! Our delivery hero is out and will reach you shortly."
            };
        case DeliveryStatus.DELIVERED: // 6
            return {
                title: "Order Delivered! 🎁",
                body: "Enjoy your purchase! We'd love to hear your feedback."
            };
        case DeliveryStatus.DELIVERY_FAILED: // 7
            return {
                title: "Delivery Attempt Failed ⚠️",
                body: "We couldn't deliver your order. Please contact support to reschedule."
            };
        case DeliveryStatus.CANCELLED: // -1
            return {
                title: "Order Cancelled ❌",
                body: "Your order has been successfully cancelled. We hope to see you soon again!"
            };
        default:
            return {
                title: "Update Available",
                body: "Your order status has been updated."
            };
    }
};


