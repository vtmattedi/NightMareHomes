import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing data
const storeData = async (key, value) => {
    try {
        value = String(value);
        await AsyncStorage.setItem(key, value);
        console.log('Data stored successfully.');
        return true;
    } catch (error) {
        console.log('Error storing data:', error);
        return false;
    }
};

// Retrieving data
const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            console.log('Retrieved data:', value);
        } else {
            console.log('No data found for the given key.');
        }
        return value;
    } catch (error) {
        console.log('Error retrieving data:', error);
        return null;
    }
};

export { storeData, getData };