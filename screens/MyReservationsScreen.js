import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserReservations, deleteReservation } from './services/ReservationService';
import { fetchAppointmentById } from './services/AppointmentsService';
import { fetchOrdinationById } from './services/HomeService';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles/ReservationScreenStyle';

const MyReservationsScreen = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refreshInterval = 5000; 

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    throw new Error('Korisnički ID nije pronađen.');
                }

                const response = await getUserReservations(userId);

                if (!response.data || response.data.length === 0) {
                    setReservations([]);
                    return;
                }

                const reservationsWithAppointments = await Promise.all(response.data.map(async (reservation) => {
                    const appointmentData = await fetchAppointmentById(reservation.appointmentId);
                    const ordinationData = await fetchOrdinationById(appointmentData.ordinationId);
                    return {
                        ...reservation,
                        appointment: appointmentData,
                        ordination: ordinationData
                    };
                }));

                setReservations(reservationsWithAppointments);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setReservations([]);
                } else {
                    setError(err.message || 'Greška pri dohvatu rezervacija.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
        
        const intervalId = setInterval(() => {
            fetchReservations();
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, []);

    const handleCancelReservation = async (reservationId) => {
        try {
            await deleteReservation(reservationId);
            setReservations((prev) => prev.filter((item) => item.reservationId !== reservationId));
            Alert.alert('Uspjeh', 'Rezervacija je otkazana.');
        } catch (error) {
            Alert.alert('Greška', 'Došlo je do greške prilikom otkazivanja rezervacije.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'odobrena':
                return { color: 'green' };
            case 'odbijena':
                return { color: 'red' };
            case 'na cekanju':
                return { color: 'orange' };
            default:
                return { color: 'black' };
        }
    };

    const ReservationItem = ({ item }) => (
        <View style={styles.reservationContainer}>
            {item.appointment && (
                <>
                    <Text style={styles.ordinationName}>Ordinacija: {item.ordination.name}</Text>
                    <Text style={styles.appointmentTitle}>Informacije o terminu:</Text>
                    <View style={styles.detailContainer}>
                        <MaterialIcons name="date-range" size={20} color="#6c757d" />
                        <Text style={styles.appointmentDate}>Datum: {new Date(item.appointment.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <MaterialIcons name="access-time" size={20} color="#6c757d" />
                        <Text style={styles.appointmentTime}>Početak: {formatTime(item.appointment.startTime)}</Text>
                    </View>
                    <View style={styles.detailContainer}>
                        <MaterialIcons name="access-time" size={20} color="#6c757d" />
                        <Text style={styles.appointmentTime}>Kraj: {formatTime(item.appointment.endTime)}</Text>
                    </View>
                </>
            )}
            <Text style={styles.reservationTitle}>Informacije o rezervaciji:</Text>
            <View style={styles.detailContainer}>
                <MaterialIcons name="info" size={20} color="#6c757d" />
                <Text style={[styles.status, getStatusStyle(item.status)]}>Status rezervacije: {item.status}</Text>
            </View>
            <View style={styles.detailContainer}>
                <MaterialIcons name="calendar-today" size={20} color="#6c757d" />
                <Text style={styles.reservationDate}>Datum rezervacije: {new Date(item.reservationDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detailContainer}>
                <MaterialIcons name="phone" size={20} color="#6c757d" />
                <Text style={styles.phone}>Kontakt telefon: {item.phoneNumber}</Text>
            </View>
            <View style={styles.detailContainer}>
                <MaterialIcons name="face" size={20} color="#6c757d" />
                <Text style={styles.age}>Broj godina pacijenta: {item.age}</Text>
            </View>
            <View style={styles.detailContainer}>
                <MaterialIcons name="description" size={20} color="#6c757d" />
                <Text style={styles.description}>Kratki opis razloga rezervacije: {item.description}</Text>
            </View>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                    Alert.alert(
                        'Potvrda',
                        'Da li ste sigurni da želite otkazati ovu rezervaciju?',
                        [
                            { text: 'Odustani', style: 'cancel' },
                            { text: 'Otkaži', onPress: () => handleCancelReservation(item.reservationId) }
                        ]
                    );
                }}
            >
                <Text style={styles.cancelButtonText}>Otkaži rezervaciju</Text>
            </TouchableOpacity>
        </View>
    );

    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hours, minutes] = time.split(':');
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    if (reservations.length === 0 && !error) {
        return (
            <View style={styles.container}>
                <Text style={styles.noReservationsText}>Trenutno nemate dostupnih rezervacija.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                keyExtractor={(item) => item.reservationId.toString()}
                renderItem={({ item }) => <ReservationItem item={item} />}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default MyReservationsScreen;
