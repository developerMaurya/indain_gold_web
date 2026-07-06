export const getSettingBoolean = (settingsArray, key, trueValue = "yes") => {
    if (!settingsArray || !Array.isArray(settingsArray)) return false;
    const setting = settingsArray.find(s => s.SettingKey === key);
    return setting && setting.SettingValue?.toLowerCase() === trueValue.toLowerCase();
};
