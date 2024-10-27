import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from './services/RegisterService'; 
import styles from './styles/RegisterScreenStyle'; 

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({});
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    const errors = {};

    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Greška', 'Sva polja moraju biti popunjena.');
      return;
    }

    if (!validateEmail(email)) {
      errors.email = 'Email nije ispravnog formata.';
    }

    if (password.length < 8) {
      errors.password = 'Lozinka mora imati najmanje 8 karaktera.';
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
      return;
    }

    try {
      const user = {
        firstName,
        lastName,
        email,
        password,
        role: 'pacijent',  
      };

      await registerUser(user);
      Alert.alert('Uspjeh', 'Registracija uspješna! Možete se prijaviti.', [
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
        placeholder="Ime"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Prezime"
        value={lastName}
        onChangeText={setLastName}
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
        placeholder="Lozinka"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessages.password && (
        <Text style={{ color: 'red' }}>{errorMessages.password}</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Registruj se" onPress={handleRegister} color="#004aad" />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerLink}>Već imate račun? Prijavite se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;
