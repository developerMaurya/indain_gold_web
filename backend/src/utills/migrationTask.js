import UserModel from '../models/userModel.js';
import { sendPushNotification } from './notificationHelper.js';
import { sendWelcomeNotifications } from '../utills/notificationHelper.js';
import { getConnection } from '../config/db.config.js';


export const performUserMigration = async (lockObject) => {
    console.log("enter in corn job ...")
    if (lockObject.isProcessing) {
        console.log("⚠️ Skipping - already processing");
        return;
    }

    lockObject.isProcessing = true;
    console.log("start performusermigration...")

    try {
        while (true) {
            const tempResults = await UserModel.getUsersTemp();
            console.log("tempresult..", tempResults)

            if (!tempResults || tempResults.length === 0 || tempResults[0]?.ret <= 0) {
                console.log("🏁 No more records to process");
                break;
            }
            const pool = await getConnection();
            console.log("start processing tempresult..")
            for (const row of tempResults) {
                if (row.ret > 0 && row.JsonData) {
                    try {
                        const userDataArray = JSON.parse(row.JsonData);
                        for (const userData of userDataArray) {
                            const result = await UserModel.insertUserModel({
                                SpUsername: userData.Sponsor,
                                Name: userData.Name,
                                Username: userData.Username,
                                Password: userData.Password,
                                CountryCode: userData.CountryCode || '',
                                CallingCode: userData.CallingCode || '',
                                Country: userData.Country || '',
                                State: userData.States || '',
                                City: userData.City || '',
                                Mobile: userData.Mobile,
                                Email: userData.Email || '',
                                GroupNo: userData.GroupNo,
                                UserStatus: 1,
                                DOB: userData.DOB || ""
                            });

                            // Send Push Notification
                            console.log("result is uiui...", result)
                            if (result.ret > 0) {
                                const userId = result.ret;
                                const resolvedWebID = userId || null;
                                console.log("resolvedWebID....", resolvedWebID)

                                console.log("result.json as ...", result.JsonData)
                                let parsedResult = {};
                                if (result.JsonData) {
                                    try {
                                        // Sometimes SQL returns array of 1 object, sometimes just the object
                                        const parsed = JSON.parse(result.JsonData);
                                        parsedResult = Array.isArray(parsed) ? (parsed[0] || {}) : parsed;
                                    } catch (e) {
                                        console.error("Failed to parse result.JsonData:", e.message);
                                    }
                                }

                                // Map fields using the parsed response from the database where the actual generated Username lives
                                const newUserObj = {
                                    Name: parsedResult.Name || result.Name || userData.Name,
                                    // SpUsername: parsedResult.Username || result.Username || userData.Sponsor, // The generated User ID!
                                    SpUsername: userData.Sponsor || result.Sponsor, // The generated User ID!
                                    Username: userData.Username || result.Username || parsedResult.Username,
                                    Password: parsedResult.Password || result.Password || userData.Mobile,
                                    Mobile: parsedResult.Mobile || result.Mobile || userData.Mobile,
                                    Email: parsedResult.Email || result.Email || userData.Email,
                                    CountryCode: userData.CountryCode || '',
                                    CallingCode: userData.CallingCode || '',
                                    DOB: userData.DOB || ""
                                };
                                console.log("resolvedWebID", resolvedWebID)
                                console.log("send welcom message...", newUserObj)
                                await sendWelcomeNotifications(pool, resolvedWebID, newUserObj);
                                console.log("sendng push notificaiton...")

                                if (userId) {
                                    await sendPushNotification(
                                        userId,
                                        `Welcome ${userData.Name}!`,
                                        "Your account has been successfully migrated to McZEN."
                                    );
                                }
                            }
                        }
                    } catch (err) {
                        console.error(`❌ Migration Error for Sponsor: ${row.Sponsor || 'Unknown'}:`, err.message);
                        // Break out of the loop completely to avoid spamming the database with infinite failing loops
                        break;
                    }
                }
            }
            // If we caught an error and broke out of the for-loop, we should also break the while loop
            break;
        }
    } catch (error) {
        console.error('❌ Migration Error:', error.message);
    } finally {
        lockObject.isProcessing = false;
    }
};
