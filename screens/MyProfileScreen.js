import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { fetchUserProfile } from './services/UserService'; 
import { resetUserPassword } from './services/PasswordService'; 
import { Ionicons } from 'react-native-vector-icons';
import styles from './styles/MyProfileScreenStyle'; 

const MyProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUser(userProfile);
        setEmail(userProfile.email); 
      } catch (error) {
        Alert.alert('Greška', 'Nije moguće učitati profil korisnika');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Greška', 'Molimo unesite novu lozinku i potvrdu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Greška', 'Lozinke se ne podudaraju.');
      return;
    }

    try {
      const response = await resetUserPassword(email, newPassword);
      Alert.alert('Uspješno', response.data.message);
      setModalVisible(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Greška', 'Nije moguće resetovati lozinku');
      console.error(error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#004aad" style={styles.loadingIndicator} />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Nema dostupnih podataka o korisniku</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={100} color="#004aad" />
        <Text style={styles.nameText}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.emailText}>{user.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="#004aad" />
          <Text style={styles.infoText}>Ime: {user.firstName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={24} color="#004aad" />
          <Text style={styles.infoText}>Prezime: {user.lastName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={24} color="#004aad" />
          <Text style={styles.infoText}>Email: {user.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.changePasswordButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="key-outline" size={24} color="#fff" />
        <Text style={styles.changePasswordButtonText}>Promijeni lozinku</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Resetuj lozinku</Text>
            
            <View style={styles.emailContainer}>
              <TextInput
                value={email}
                style={styles.input}
                editable={false}
                selectTextOnFocus={false}
                placeholder="Email"
              />
            </View>

            <TextInput
              placeholder="Unesite novu lozinku"
              secureTextEntry
              onChangeText={setNewPassword}
              style={styles.input}
            />
            
            <TextInput
              placeholder="Potvrdite novu lozinku"
              secureTextEntry
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
              <Text style={styles.modalButtonText}>Resetuj lozinku</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle-outline" size={24} color="#ff4444" />
              <Text style={styles.modalCancelButtonText}>Otkaži</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MyProfileScreen;
