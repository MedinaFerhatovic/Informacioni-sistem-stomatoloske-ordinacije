import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { fetchAppointments } from './services/AppointmentsService';
import { createReservation, updateAppointmentAvailability } from './services/ReservationService';
import { fetchUserProfile } from './services/UserService'; 
import styles from './styles/AppointmentsScreenStyle';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native';


const AppointmentsScreen = ({ route, navigation }) => {
    const { ordinationId, ordinationName } = route.params;
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', age: '', phoneNumber: '', description: '' });
    const [searchDate, setSearchDate] = useState('');
    const [searchTime, setSearchTime] = useState('');

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const data = await fetchAppointments(ordinationId);
                const availableAppointments = data.filter(appointment => appointment.available && !appointment.reserved);
                const groupedAppointments = availableAppointments.reduce((acc, appointment) => {
                    const dateKey = new Date(appointment.date).toLocaleDateString();
                    if (!acc[dateKey]) {
                        acc[dateKey] = [];
                    }
                    acc[dateKey].push(appointment);
                    return acc;
                }, {});

                const appointmentsArray = Object.keys(groupedAppointments).map(date => ({
                    date,
                    appointments: groupedAppointments[date]
                }));

                setAppointments(appointmentsArray);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setErrorMessage('Ova ordinacija trenutno nema slobodnih termina.');
                } else {
                    console.error('Greška pri dohvatanju termina:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        const getUserProfile = async () => {
            try {
                const userProfile = await fetchUserProfile();
                setFormData(prev => ({
                    ...prev,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    email: userProfile.email
                }));
            } catch (error) {
                console.error('Greška pri dohvatanju korisničkog profila:', error);
            }
        };

        getAppointments();
        getUserProfile(); 
    }, [ordinationId]);

    const formatTime = (time) => {
        if (!time) {
            return "Nepoznata vreme";
        }
        return time.slice(0, 5);
    };

    const handleSelectAppointment = (appointment, date) => {
        setSelectedAppointment(appointment);
        setSelectedDate(date);
    };

    const handleReserve = async () => {
        if (!selectedAppointment) return;

        const reservationData = {
            OrdinationID: ordinationId,
            AppointmentID: selectedAppointment.appointmentId,
            FirstName: formData.firstName,
            LastName: formData.lastName,
            Email: formData.email,
            Age: parseInt(formData.age),
            PhoneNumber: formData.phoneNumber,
            Description: formData.description,
            ReservationDate: new Date().toISOString(),
        };

        try {
            await createReservation(reservationData);
            await updateAppointmentAvailability(selectedAppointment.appointmentId);

            setAppointments(prevAppointments => {
                return prevAppointments.map(dateGroup => {
                    return {
                        ...dateGroup,
                        appointments: dateGroup.appointments.filter(appointment => appointment.appointmentId !== selectedAppointment.appointmentId)
                    };
                }).filter(dateGroup => dateGroup.appointments.length > 0); 
            });

            Alert.alert('Uspešno', 'Termin je rezervisan.');
            setModalVisible(false);
            setFormData({ firstName: '', lastName: '', email: '', age: '', phoneNumber: '', description: '' });
        } catch (error) {
            Alert.alert('Greška', 'Došlo je do greške prilikom rezervacije.');
            console.error('Greška prilikom rezervacije:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#004aad" />
            </View>
        );
    }

    if (errorMessage) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.ordinationTitle}>{ordinationName}</Text>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
        );
    }

    if (appointments.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noAppointmentsText}>Ova ordinacija trenutno nema slobodnih termina.</Text>
            </View>
        );
    }

    // Filter appointments based on search inputs
    const filteredAppointments = appointments.map(dateGroup => {
        const filteredAppointments = dateGroup.appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date).toLocaleDateString();
            const appointmentStartTime = formatTime(appointment.startTime);
            const matchesDate = searchDate ? appointmentDate.includes(searchDate) : true;
            const matchesTime = searchTime ? appointmentStartTime.includes(searchTime) : true;

            return matchesDate && matchesTime;
        });

        return { date: dateGroup.date, appointments: filteredAppointments };
    }).filter(dateGroup => dateGroup.appointments.length > 0); // Remove empty groups

    const renderItem = ({ item }) => (
        <View style={styles.appointmentCard}>
            <Text style={styles.header}>{item.date}</Text>
            {item.appointments && item.appointments.length > 0 ? (
                item.appointments.map(appointment => (
                    <TouchableOpacity
                        key={appointment.appointmentId}
                        style={[styles.appointmentItem, selectedAppointment && selectedAppointment.appointmentId === appointment.appointmentId ? styles.selected : null]}
                        onPress={() => handleSelectAppointment(appointment, item.date)}
                    >
                        <Text style={styles.appointmentTime}>
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </Text>
                        <Ionicons name="time-outline" size={20} color="#004aad" />
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noAvailableAppointments}>Nema dostupnih termina za ovaj datum.</Text>
            )}
            <TouchableOpacity 
                style={[styles.reserveButton, !selectedAppointment && styles.disabledButton]} 
                onPress={() => setModalVisible(true)} 
                disabled={!selectedAppointment}
            >
                <Text style={styles.reserveButtonText}>Rezerviši</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.ordinationTitle}>{ordinationName}</Text>
            <View style={styles.searchInput}>
                <Icon name="search" size={24} color="#a9a9a9" style={styles.searchIcon} />
                <TextInput
                   style={{ flex: 1, height: '100%', paddingLeft: 40 }}
                   placeholder="Pretraži po datumu..."
                   value={searchDate}
                   onChangeText={setSearchDate}
                />
            </View>
            <View style={styles.searchInput}>
                 <Icon name="search" size={24} color="#a9a9a9" style={styles.searchIcon} />
                 <TextInput
                    style={{ flex: 1, height: '100%', paddingLeft: 40 }}
                    placeholder="Pretraži po vremenu..."
                    value={searchTime}
                    onChangeText={setSearchTime}
                 />
            </View>
            <FlatList
                style={{ marginTop: 20 }} 
                data={filteredAppointments}
                renderItem={renderItem}
                keyExtractor={item => item.date}
            />
            <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalContainer}>
        <View style={styles.modalCard}>
            {/* Close Button */}
            <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeIconWrapper}
            >
                <Ionicons name="close-circle" size={28} color="#555" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>Rezervacija termina</Text>

            {selectedAppointment ? (
                <>
                    <Text style={styles.modalSubTitle}>
                        {ordinationName}
                        {'\n'}Izabrani termin: {formatTime(selectedAppointment.startTime)} -{' '}
                        {formatTime(selectedAppointment.endTime)}
                        {'\n'}Datum: {selectedDate}
                    </Text>

                    {/* Scrollable Input fields */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ime:</Text>
                            <TextInput
                                value={formData.firstName}
                                editable={false}
                                style={styles.inputField}
                            />

                            <Text style={styles.label}>Prezime:</Text>
                            <TextInput
                                value={formData.lastName}
                                editable={false}
                                style={styles.inputField}
                            />

                            <Text style={styles.label}>Email:</Text>
                            <TextInput
                                value={formData.email}
                                editable={false}
                                style={styles.inputField}
                            />

                            <Text style={styles.label}>Broj godina:</Text>
                            <TextInput
                                placeholder="Unesite koliko godina imate"
                                value={formData.age}
                                onChangeText={(text) => setFormData({ ...formData, age: text })}
                                keyboardType="numeric"
                                style={styles.inputField}
                            />

                            <Text style={styles.label}>Broj telefona:</Text>
                            <TextInput
                                placeholder="Unesite telefon"
                                value={formData.phoneNumber}
                                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                                style={styles.inputField}
                            />

                            <Text style={styles.label}>Opišite ukratko zašto trebate termin?</Text>
                            <TextInput
                                placeholder="Unesite opis"
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                style={styles.inputField}
                                multiline={true}
                            />
                        </View>
                    
                </>
            ) : (
                <Text>Izaberite termin za rezervaciju.</Text>
            )}
            

            {/* Reserve Button */}
            <TouchableOpacity
                style={[styles.actionButton, !selectedAppointment && styles.disabledButton]}
                onPress={handleReserve}
                disabled={!selectedAppointment}
            >
                <Text style={styles.actionButtonText}>Rezerviši</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    </View>
</Modal>

        </View>
    );
};

export default AppointmentsScreen;
