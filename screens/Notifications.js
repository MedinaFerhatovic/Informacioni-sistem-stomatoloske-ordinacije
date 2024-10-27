import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { BaseApi } from "../constants/constant";

const registerForPushNotificationsAsync = async (userId) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    // Pravi promenu ovde
    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId: 'e10a3ab8-4b7c-4f42-b405-6688be04df22' });
    const token = tokenResponse.data; // Ne uklanjaj ExponentPushToken prefik    


    // Slanje push tokena na backend
    try {
        await axios.post(`${BaseApi}/reservations/${userId}/expo-token`, { Token: token } );
        console.log('Token successfully sent to the backend');
        console.log(`Sending token for user ID: ${userId}, token: ${token}`);
    } catch (error) {
        console.log(`Sending token for user ID: ${userId}, token: ${token}`);
        console.error('Error sending token to the backend:', error);
    }
};

export default registerForPushNotificationsAsync;
