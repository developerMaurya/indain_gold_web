// Import required modules
const admin = require('firebase-admin');
const { getConnection } = require('./database'); // Your DB connection

// Initialize Firebase Admin SDK (if not already done)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(require('./firebase-service-account.json'))
        // No need for databaseURL for FCM
    });
}

const messaging = admin.messaging();

export const sendPushNotification = async (userId, title, body, imageUrl = null, data = null) => {
    console.log("Enter in send push notification function");
    
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
            let platform = record.Platform || 'android'; // Default to android
            let deviceToken = null;
            
            if (record.JsonData) {
                try {
                    const parsed = JSON.parse(record.JsonData);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(item => {
                            if (item.DeviceToken) {
                                deviceToken = item.DeviceToken;
                                platform = item.Platform || platform;
                                addTokenToPlatform(deviceToken, platform, androidTokens, webTokens, iosTokens);
                            }
                        });
                    } else if (parsed && parsed.DeviceToken) {
                        deviceToken = parsed.DeviceToken;
                        platform = parsed.Platform || platform;
                        addTokenToPlatform(deviceToken, platform, androidTokens, webTokens, iosTokens);
                    }
                } catch (e) {
                    console.error("❌ Error parsing Device JsonData for user:", userId, e);
                }
            } else if (record.DeviceToken) {
                deviceToken = record.DeviceToken;
                platform = record.Platform || 'android';
                addTokenToPlatform(deviceToken, platform, androidTokens, webTokens, iosTokens);
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
        const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success === true);
        const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value?.success === false));
        
        console.log(`✅ Push notifications processed for UserId ${userId}`);
        console.log(`📊 Success: ${successful.length}/${sendPromises.length}`);
        
        if (failed.length > 0) {
            console.log(`❌ Failed: ${failed.length}`);
            failed.forEach(f => {
                const error = f.status === 'rejected' ? f.reason : f.value?.error;
                console.log(`   - ${error}`);
            });
        }
        
        return { success: true, successfulCount: successful.length, totalCount: sendPromises.length };
        
    } catch (error) {
        console.error("❌ Error in sendPushNotification:", error.message);
        console.error("Stack trace:", error.stack);
        return { success: false, error: error.message };
    }
};

// Helper function to add token to appropriate platform array
function addTokenToPlatform(token, platform, androidTokens, webTokens, iosTokens) {
    if (!token || token.trim() === '') return;
    
    platform = platform.toLowerCase();
    if (platform === 'android') {
        if (!androidTokens.includes(token)) androidTokens.push(token);
    } else if (platform === 'web') {
        if (!webTokens.includes(token)) webTokens.push(token);
    } else if (platform === 'ios') {
        if (!iosTokens.includes(token)) iosTokens.push(token);
    } else {
        // Default to android if platform unknown
        if (!androidTokens.includes(token)) androidTokens.push(token);
    }
}