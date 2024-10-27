import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetUserPassword } from './services/PasswordService';
import styles from './styles/LoginScreenStyle'; 

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState({});
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async () => {
        const errors = {};
        
        if (!validateEmail(email)) {
            errors.email = 'Email nije ispravnog formata.';
        }

        if (newPassword.length < 8) {
            errors.newPassword = 'Lozinka mora imati najmanje 8 karaktera.';
        }

        if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Lozinke se ne slažu.';
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        try {
            await resetUserPassword(email, newPassword);
            Alert.alert('Uspjeh', 'Lozinka je uspješno resetovana! Možete se prijaviti.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
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
            {errorMessages.email && (
                <Text style={{ color: 'red' }}>{errorMessages.email}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder="Nova lozinka"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            {errorMessages.newPassword && (
                <Text style={{ color: 'red' }}>{errorMessages.newPassword}</Text>
            )}
            <TextInput
                style={styles.input}
                placeholder="Potvrdite novu lozinku"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            {errorMessages.confirmPassword && (
                <Text style={{ color: 'red' }}>{errorMessages.confirmPassword}</Text>
            )}
            <View style={styles.buttonContainer}>
                <Button title="Resetuj lozinku" onPress={handleResetPassword} color="#004aad" />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>Povratak na prijavu</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPasswordScreen;
