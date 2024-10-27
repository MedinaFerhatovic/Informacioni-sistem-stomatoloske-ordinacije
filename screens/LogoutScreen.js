import React, { useEffect } from 'react'; 
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const handleLogout = async (navigation) => {
    try {
        await AsyncStorage.removeItem('userEmail');  
        Alert.alert('Odjava', 'Uspješno ste se odjavili.');
        navigation.navigate('Login');  
    } catch (error) {
        Alert.alert('Greška', 'Došlo je do greške pri odjavi.');
    }
};

const LogoutScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        handleLogout(navigation);  
    }, [navigation]);

    return null; 
};

export default LogoutScreen;