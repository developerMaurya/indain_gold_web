import MessageModel from '../models/messageModel.js';
import { SmsService } from '../services/smsService.js';
import { OtpService } from '../services/otpService.js';
import { StringCipher } from './stringCipher.js';
import { getSettingBoolean } from './settingHelper.js';
import { STATUS_CODES } from './statusCodes.js';
import { messaging } from '../config/firebase.js';
import { getConnection } from '../config/db.config.js';

export const handleRegistrationOTP = async (pool, resolvedWebID, userObj) => {
    const { Mobile, Email, CountryCode, CallingCode } = userObj;
    let sendSmsOTP = false;
    let sendEmailOTP = false;
    let sendWhatsappOTP = false;

    try {
        const settingResult = await pool.request()
            .input("SettingKey", "RegisterOTP,RegistrationWhatsappOTP,RegistrationEmailOTP")
            .input("WebID", resolvedWebID || null)
            .execute("WebSettingGet");
        const settingRecord = settingResult.recordset?.[0];
        if (settingRecord?.ret > 0 && settingRecord.JsonData) {
            const parsedSettings = JSON.parse(settingRecord.JsonData);
            sendSmsOTP = getSettingBoolean(parsedSettings, "RegisterOTP");
            sendEmailOTP = getSettingBoolean(parsedSettings, "RegistrationEmailOTP");
            sendWhatsappOTP = getSettingBoolean(parsedSettings, "RegistrationWhatsappOTP");
        }
    } catch (err) {
        console.error("Error fetching RegisterOTP setting:", err);
    }

    const isOtpRequired = sendSmsOTP || sendEmailOTP || sendWhatsappOTP;
    
    if (!isOtpRequired) {
        return { isOtpRequired: false };
    }

    let otpResultMsg = "OTP Generated Successfully";
    let otpStatus = STATUS_CODES.SUCCESS;
    let encryptedOtp = null;
    let plainOtp = null;
    let isSuccess = false;
    let responseData = [];

    if (sendSmsOTP) {
        const otpResult = await OtpService.sendOtpService(Mobile, sendSmsOTP);
        isSuccess = otpResult.status === STATUS_CODES.SUCCESS || otpResult.status === 200;
        otpResultMsg = otpResult.message;
        otpStatus = otpResult.status;
        if (isSuccess && otpResult.data) {
            try {
                encryptedOtp = otpResult.data.encryptedOtp || otpResult.data[0]?.encryptedOtp;
                if (encryptedOtp) {
                    const decryptedString = StringCipher.decrypt(encryptedOtp);
                    plainOtp = JSON.parse(decryptedString).otp;
                }
                responseData = Array.isArray(otpResult.data) ? otpResult.data : [otpResult.data];
            } catch (e) {
                console.error("Failed to decrypt OTP:", e);
            }
        }
    } else {
         isSuccess = true;
         const isLive = process.env.SEND_OTP === "true";
         plainOtp = isLive ? Math.floor(100000 + Math.random() * 900000) : 888841;
         const expiry = isLive ? Date.now() + 5 * 60 * 1000 : 2524608000000;
         const payloadObj = { otp: plainOtp, expiry, mobile: Mobile };
         encryptedOtp = StringCipher.encrypt(JSON.stringify(payloadObj));
         responseData = [{ mobile: Mobile, encryptedOtp }];
    }

    if (sendEmailOTP && plainOtp) {
        try {
            if (Email) {
                await MessageModel.sendBulkEmailAction(
                    Email, 
                    "Your Registration OTP", 
                    `Dear Customer,\n\n Your OTP for login is ${plainOtp}.\n\n Please do not share it with anyone.\n\n Best regards,\n\n Team McZEN`
                );
            }
        } catch (e) {
            console.error("Failed to send Email OTP:", e);
        }
    }

    if (sendWhatsappOTP && plainOtp) {
        try {
            if (Mobile) {
                const formattedMobile = CountryCode && CallingCode ? `${CallingCode}${Mobile}` : Mobile;
                await MessageModel.sendBulkWhatsappAction(
                    formattedMobile, 
                    `Dear Customer,\n\n Your OTP for login is ${plainOtp}.\n\n Please do not share it with anyone.\n\n Best regards,\n\n Team McZEN`
                );
            }
        } catch (e) {
            console.error("Failed to send WhatsApp OTP:", e);
        }
    }

    return {
        isOtpRequired: true,
        isSuccess,
        otpResultMsg,
        otpStatus,
        responseData
    };
};

export const sendWelcomeNotifications = async (pool, resolvedWebID, userObj) => {
    console.log("welcom response here...",userObj)
    const { Name, SpUsername, Password, Mobile, Email, CountryCode, CallingCode } = userObj;
    
    let sendSmsNotification = false;
    let sendEmailNotification = false;
    let sendWhatsappNotification = false;
console.log("a....")
console.log("resolvedWebID for setting",resolvedWebID)
    try {
        const settingResult = await pool.request()
            .input("SettingKey", "WhatsappNotification,EmailNotification,SmsNotification")
            .input("WebID",  null)
            .execute("WebSettingGet");
        
        const settingRecord = settingResult.recordset?.[0];
        console.log("settingRecord",settingRecord)
        if (settingRecord?.ret > 0 && settingRecord.JsonData) {
            const parsedSettings = JSON.parse(settingRecord.JsonData);
            sendSmsNotification = getSettingBoolean(parsedSettings, "SmsNotification");
            sendEmailNotification = getSettingBoolean(parsedSettings, "EmailNotification");
            sendWhatsappNotification = getSettingBoolean(parsedSettings, "WhatsappNotification");
        }
    } catch (err) {
        console.error("Error fetching Notification settings:", err);
    }

    console.log("sendSmsNotification",sendSmsNotification)
    console.log("sendEmailNotification",sendEmailNotification)
    console.log("sendWhatsappNotification",sendWhatsappNotification)
    // --- Send Welcome Messages ---
    if (sendSmsNotification || sendEmailNotification || sendWhatsappNotification) {
        console.log("inside the welcome message")
        // const welcomeMsg = `Dear ${Name},\n\nYour registration has been completed successfully.\n\nHere are your account details:\n• User ID: ${SpUsername}\n• Password: ${Password}\n• Login Link: https://mczen.in/login\n\nFor security purposes, we recommend changing your password after your first login.\n\nBest regards,\nTeam McZEN`;
        const welcomeMsg=`Dear Customer,\n\n Your registration is complete. \n\n User ID: ${SpUsername}, \n\n Password: ${Password}. \n\n Login here: https://mczen.in/login. \n\n Access your account using these credentials. \n\n Best regards, \n\n Team McZEN.`
        if (sendSmsNotification && Mobile) {
            try {
                console.log("inside the sms message")
                await SmsService.sendSMS(Mobile, welcomeMsg);
                console.log("Welcome SMS sent successfully")
            } catch (e) {
                console.error("Failed to send Welcome SMS:", e);
            }
        }

        if (sendEmailNotification && Email) {
            try {
                console.log("inside the email message")
                const emailHtml = welcomeMsg.replace(/\n/g, "<br>");
                await MessageModel.sendBulkEmailAction(Email, "Registration Complete", emailHtml);
            } catch (e) {
                console.error("Failed to send Welcome Email:", e);
            }
        }

        if (sendWhatsappNotification && Mobile) {
            try {
                console.log("inside the whatsapp message")
                const formattedMobile = CountryCode && CallingCode ? `${CallingCode}${Mobile}` : Mobile;
                await MessageModel.sendBulkWhatsappAction(formattedMobile, welcomeMsg);
            } catch (e) {
                console.error("Failed to send Welcome WhatsApp:", e);
            }
        }
    }
};

export const sendOrderConfirmationNotification = async (pool, resolvedWebID, orderData) => {
    console.log("Enter in send order confirmation function")
    const { Name, Mobile, Email, CountryCode, CallingCode, InvoiceNo, OrderDate, GrandTotal, PaymentMode } = orderData;
    console.log("orderData",orderData)
    let sendSmsNotification = false;
    let sendEmailNotification = false;
    let sendWhatsappNotification = false;

    try {
        const settingResult = await pool.request()
            .input("SettingKey", "WhatsappNotification,EmailNotification,SmsNotification")
            .input("WebID", resolvedWebID || null)
            .execute("WebSettingGet");
        console.log("settingResult",settingResult)

        const settingRecord = settingResult.recordset?.[0];
        if (settingRecord?.ret > 0 && settingRecord.JsonData) {
            const parsedSettings = JSON.parse(settingRecord.JsonData);
            sendSmsNotification = getSettingBoolean(parsedSettings, "SmsNotification");
            sendEmailNotification = getSettingBoolean(parsedSettings, "EmailNotification");
            sendWhatsappNotification = getSettingBoolean(parsedSettings, "WhatsappNotification");
        }
    } catch (err) {
        console.error("Error fetching Notification settings for order confirmation:", err);
    }

    if (sendSmsNotification || sendEmailNotification || sendWhatsappNotification) {
        console.log("notification is true ")
        // const orderMsg = `Dear Customer,\n\nYour order is confirmed!\n\nInvoice: ${InvoiceNo || "N/A"}\nDate: ${OrderDate || "N/A"}\nAmount: ${GrandTotal || "N/A"}\nPayment: ${PaymentMode || "N/A"}\n\nThank you for your purchase! We'll update you on the delivery status.\n\nBest regards,\nTeam McZEN.`;
        const orderMsg=`Dear Customer,\n\n Your order is confirmed! \n\n Invoice: ${InvoiceNo}, \n\n Date: ${OrderDate}, \n\n Amount: ${GrandTotal}, \n\n Payment: ${PaymentMode}. \n\n Thank you for your purchase! We'll update you on the delivery status. \n\n Best regards, \n\n Team McZEN.`
        console.log("orderMsg",orderMsg)
        if (sendSmsNotification && Mobile) {
            try {
                await SmsService.sendSMS(Mobile, orderMsg);
            } catch (e) {
                console.error("Failed to send Order Confirmation SMS:", e);
            }
        }

        if (sendEmailNotification && Email) {
            try {
                const emailHtml = orderMsg.replace(/\n/g, "<br>");
                await MessageModel.sendBulkEmailAction(Email, "Order Confirmed", emailHtml);
            } catch (e) {
                console.error("Failed to send Order Confirmation Email:", e);
            }
        }

        if (sendWhatsappNotification && Mobile) {
            try {
                const formattedMobile = CountryCode && CallingCode ? `${CallingCode}${Mobile}` : Mobile;
                await MessageModel.sendBulkWhatsappAction(formattedMobile, orderMsg);
            } catch (e) {
                console.error("Failed to send Order Confirmation WhatsApp:", e);
            }
        }
    }
};


// export const sendPushNotification = async (userId, title, body, imageUrl = null) => {
//     console.log("Enter in send push notification function")
//     try {
//         if (!userId) return;
//         console.log("userId is ...",userId)
//         // Safety check if Firebase failed to initialize
//         if (!messaging) {
//             console.warn(`⚠️ Cannot send push notification to User ${userId}: Firebase Messaging is not initialized.`);
//             return;
//         }

//         const pool = await getConnection();
//         const result = await pool.request()
//             .input("UserId", userId)
//             .execute("UserDeviceGet");
//         console.log("result",result)

//         const deviceRecords = result.recordset || [];
//         console.log("deviceRecords",deviceRecords)
//         if (deviceRecords.length === 0) {
//             console.log(`ℹ️ No device tokens found for UserId: ${userId}`);
//             return;
//         }

//         const tokens = [];
//         deviceRecords.forEach(record => {
//             if (record.JsonData) {
//                 try {
//                     const parsed = JSON.parse(record.JsonData);
//                     if (Array.isArray(parsed)) {
//                         parsed.forEach(item => {
//                             if (item.DeviceToken) tokens.push(item.DeviceToken);
//                         });
//                     } else if (parsed && parsed.DeviceToken) {
//                         tokens.push(parsed.DeviceToken);
//                     }
//                 } catch (e) {
//                     console.error("❌ Error parsing Device JsonData for user:", userId);
//                 }
//             } else if (record.DeviceToken) {
//                 // Fallback for non-JSON records
//                 tokens.push(record.DeviceToken);
//             }
//         });

//         console.log("Found device tokens:", tokens);
//         if (tokens.length === 0) return;

//         const messagePayload = {
//             notification: {
//                 title: title,
//                 body: body,
//                 ...(imageUrl && { image: imageUrl })
//             }
//         };
//         console.log("messagePayload",messagePayload)

//         // Sending to each registered device
//         const sendPromises = tokens.map(token => {
//             return messaging.send({
//                 ...messagePayload,
//                 token: token
//             });
//         });
//         console.log("sendPromises",sendPromises)

//         const results = await Promise.allSettled(sendPromises);
//         console.log("results final",results)
//         console.log(`✅ Push notifications processed for UserId ${userId}. Success: ${results.filter(r => r.status === 'fulfilled').length}/${tokens.length}`);
//     } catch (error) {
//         console.error("❌ Error in sendPushNotification:", error.message);
//     }
// };


const addTokenToPlatform = (token, platform, android, web, ios) => {
    console.log("token platform", token, platform)
    if (!token) return;
    const p = (platform || 'android').toString().toLowerCase();
    if (p.includes('web')) {
        web.push(token);
    } else if (p.includes('ios')|| p.includes('iOS') || p.includes('apple') || p.includes('iphone')) {
        ios.push(token);
    } else {
        android.push(token);
    }
};

export const sendPushNotification = async (userId, title, body, imageUrl = null, data = null) => {
    console.log("Enter in send push notification function");
    console.log("userid title body ", userId, title, body)
    
    try {
        if (!userId) {
            console.log("❌ No userId provided");
            return;
        }
        
        console.log("userId is ...", userId);
        
        // Safety check if Firebase failed to initialize
        if (!messaging) {
            console.warn(`⚠️ Cannot send push notification to User ${userId}: Firebase Messaging is not initialized.`);
            return;
        }

        // Get device tokens from database
        const pool = await getConnection();
        const result = await pool.request()
            .input("UserId", userId)
            .execute("UserDeviceGet");
        
        console.log("Database result:", result);

        const deviceRecords = result.recordset || [];
        console.log("Device records:", deviceRecords);
        
        if (deviceRecords.length === 0) {
            console.log(`ℹ️ No device tokens found for UserId: ${userId}`);
            return;
        }

        // Separate tokens by platform
        const androidTokens = [];
        const webTokens = [];
        const iosTokens = [];
        
        deviceRecords.forEach(record => {
            if (record.JsonData) {
                try {
                    const parsed = JSON.parse(record.JsonData);
                    const items = Array.isArray(parsed) ? parsed : [parsed];
                    
                    items.forEach(item => {
                        if (item.DeviceToken) {
                            const platform = item.Platform || item.DeviceType || record.Platform || 'android';
                            addTokenToPlatform(item.DeviceToken, platform, androidTokens, webTokens, iosTokens);
                        }
                    });
                } catch (e) {
                    console.error("❌ Error parsing Device JsonData for user:", userId, e);
                }
            } else if (record.DeviceToken) {
                const platform = record.Platform || 'android';
                addTokenToPlatform(record.DeviceToken, platform, androidTokens, webTokens, iosTokens);
            }
        });

        console.log(`📱 Android tokens: ${androidTokens.length}`);
        console.log(`🌐 Web tokens: ${webTokens.length}`);
        console.log(`🍎 iOS tokens: ${iosTokens.length}`);

        // Build notification payload
        const notificationPayload = {
            notification: {
                title: title,
                body: body,
                ...(imageUrl && { imageUrl: imageUrl })
            }
        };
console.log("notification payload..",notificationPayload)
        // Add data payload if provided
        if (data) {
            notificationPayload.data = data;
        }

        // Send notifications to all platforms
        const sendPromises = [];

        // Send to Android (FCM)
        androidTokens.forEach(token => {
            sendPromises.push(
                messaging.send({
                    ...notificationPayload,
                    token: token,
                    android: {
                        priority: 'high',
                        notification: {
                            channelId: 'default_channel', // Create this in your Android app
                            ...(imageUrl && { imageUrl: imageUrl })
                        }
                    }
                }).then(() => ({ success: true, platform: 'android', token }))
                .catch(err => ({ success: false, platform: 'android', token, error: err.message }))
            );
        });

        // Send to Web (with webpush specific config)
        webTokens.forEach(token => {
            sendPromises.push(
                messaging.send({
                    ...notificationPayload,
                    token: token,
                    webpush: {
                        headers: {
                            Urgency: 'high'
                        },
                        notification: {
                            title: title,
                            body: body,
                            icon: imageUrl || '/favicon.ico',
                            badge: '/badge.png',
                            vibrate: [200, 100, 200],
                            requireInteraction: true,
                            silent: false,
                            ...(imageUrl && { image: imageUrl })
                        },
                        fcmOptions: {
                            link: data?.clickUrl || process.env.WEB_APP_URL || 'https://yourwebsite.com'
                        }
                    }
                }).then(() => ({ success: true, platform: 'web', token }))
                .catch(err => ({ success: false, platform: 'web', token, error: err.message }))
            );
        });

        // Send to iOS (APNs via FCM)
        iosTokens.forEach(token => {
            sendPromises.push(
                messaging.send({
                    ...notificationPayload,
                    token: token,
                    apns: {
                        payload: {
                            aps: {
                                alert: {
                                    title: title,
                                    body: body
                                },
                                sound: 'default',
                                badge: 1
                            }
                        },
                        ...(imageUrl && {
                            fcm_options: {
                                image: imageUrl
                            }
                        })
                    }
                }).then(() => ({ success: true, platform: 'ios', token }))
                .catch(err => ({ success: false, platform: 'ios', token, error: err.message }))
            );
        });

        if (sendPromises.length === 0) {
            console.log(`⚠️ No valid tokens found for UserId: ${userId}`);
            return;
        }

        // Execute all push notifications
        const results = await Promise.allSettled(sendPromises);
        
        // Log results
        results.forEach((res, index) => {
            if (res.status === 'fulfilled') {
                const val = res.value;
                if (val.success) {
                    console.log(`   ✅ [${val.platform.toUpperCase()}] Success | Token: ${val.token.substring(0, 15)}...`);
                } else {
                    let errorMsg = val.error;
                    if (errorMsg.includes('SenderId mismatch')) {
                        errorMsg += " (Check if this token belongs to a different Firebase project version)";
                    }
                    console.log(`   ❌ [${val.platform.toUpperCase()}] Failed: ${errorMsg} | Token: ${val.token.substring(0, 15)}...`);
                }
            } else {
                console.log(`   ❌ [UNKNOWN] Rejected: ${res.reason}`);
            }
        });

        const successfulCount = results.filter(r => r.status === 'fulfilled' && r.value?.success === true).length;
        console.log(`✅ Push notifications processed for UserId ${userId}. Success: ${successfulCount}/${sendPromises.length}`);
        
        return { success: true, successfulCount, totalCount: sendPromises.length };
        
    } catch (error) {
        console.error("❌ Error in sendPushNotification:", error.message);
        console.error("Stack trace:", error.stack);
        return { success: false, error: error.message };
    }
};