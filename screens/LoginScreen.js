import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from './services/LoginService';
import styles from './styles/LoginScreenStyle';  

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const loadStoredCredentials = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('userEmail');
                const storedPassword = await AsyncStorage.getItem('userPassword');
                const storedRememberMe = await AsyncStorage.getItem('rememberMe');

                if (storedEmail && storedPassword && storedRememberMe === 'true') {
                    setEmail(storedEmail);
                    setPassword(storedPassword);
                    setRememberMe(true);
                }
            } catch (error) {
                console.error('Error loading stored credentials:', error);
            }
        };

        loadStoredCredentials();
    }, []);

    const handleLogin = async () => {
        try {
            const user = await loginUser(email, password);
            console.log(user);
            await AsyncStorage.setItem('userEmail', user.email);
            await AsyncStorage.setItem('userId', user.userId.toString());
            const storedUserId = await AsyncStorage.getItem('userId');
            console.log('Sačuvani userId:', storedUserId);
            if (rememberMe) {
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userPassword', password);
                await AsyncStorage.setItem('rememberMe', 'true');
            } else {
                await AsyncStorage.removeItem('userEmail');
                await AsyncStorage.removeItem('userPassword');
                await AsyncStorage.setItem('rememberMe', 'false');
            }

            navigation.navigate('HomeDrawer');
        } catch (error) {
            Alert.alert('Greška', error.message || 'Došlo je do greške.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('./../assets/logo.png')}
                style={styles.logo}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Lozinka"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.row}>
                <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
                    <Icon name={rememberMe ? "check-box" : "check-box-outline-blank"} size={24} color="#004aad" />
                    <Text style={styles.rememberMeText}>Zapamti me</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>Zaboravljena lozinka?</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Prijavi se" onPress={handleLogin} color="#004aad" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Nemaš račun? Registruj se</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;
