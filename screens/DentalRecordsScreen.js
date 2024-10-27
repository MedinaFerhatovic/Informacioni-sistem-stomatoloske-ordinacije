import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from './styles/DentalRecordStyle';
import { fetchDentalRecords } from './services/DentalRecordService';

const DentalRecordsScreen = ({ navigation }) => {
    const [dentalRecords, setDentalRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ordinationName, setOrdinationName] = useState('');

    useEffect(() => {
        loadDentalRecords();
    }, []);

    const loadDentalRecords = async () => {
        try {
            const { records, ordinationName } = await fetchDentalRecords();
            setDentalRecords(records);
            setOrdinationName(ordinationName);
            if (records.length === 0) {
                setError('Trenutno nemate stomatoloških kartona za pregled.');
            } else {
                setError(null); 
            }
        } catch (err) {
            if (err.message.includes('404')) {
                setError('Trenutno nemate stomatoloških kartona za pregled.');
            } else {
                setError('Greška pri dohvatu dentalnih kartona.');
            }
        } finally {
            setLoading(false);
        }
    };

    const renderDentalRecordItem = ({ item }) => {
        if (!item) return null;
        return (
            <View style={styles.item}>
                <Text style={styles.title}>Broj kartona: {item.number}</Text>
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => {
                        navigation.navigate('DentalRecordDetailScreen', { record: item, ordinationName });
                    }}
                >
                    <Text style={styles.customButtonText}>Pogledaj karton</Text>
                </TouchableOpacity>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#004aad" />
                <Text style={{ color: '#333' }}>Učitavanje...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.noResults}>
                <Text style={styles.noResultsText}>Trenutno nemate stomatoloških kartona za pregled.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={dentalRecords}
                keyExtractor={(item) => item.dentalRecordId.toString()}
                renderItem={renderDentalRecordItem}
                contentContainerStyle={styles.flatListContent}
                ListEmptyComponent={
                    <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>Trenutno nemate stomatoloških kartona za pregled.</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default DentalRecordsScreen;
