import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const DentalRecordDetailScreen = ({ route, navigation }) => {
    const { record, ordinationName } = route.params;

    const data = [
        {
            key: 'record',
            header: 'Stomatološki Karton',
            content: [
                { label: 'Broj stomatološkog kartona:', value: record.number },
                { label: 'Ordinacija:', value: ordinationName }
            ]
        },
        {
            key: 'patient',
            header: 'Podaci o pacijentu',
            content: [
                { label: 'Ime pacijenta:', value: record.patientFirstName || 'N/A' },
                { label: 'Prezime pacijenta:', value: record.patientLastName || 'N/A' },
                { label: 'Email pacijenta:', value: record.patientEmail || 'N/A' }
            ]
        },
        {
            key: 'visit',
            header: 'Detalji pregleda',
            content: [
                { label: 'Datum pregleda:', value: record.visitDate ? new Date(record.visitDate).toLocaleDateString() : 'N/A' },
                { label: 'Opis pregleda:', value: record.examination || 'N/A' },
                { label: 'Terapija:', value: record.recipe || 'N/A' },
                { label: 'Dodatne napomene:', value: record.addition || 'N/A' }
            ]
        }
    ];

    if (record.visits && record.visits.length > 0) {
        record.visits.forEach((visit, index) => {
            data.push({
                key: `visit_${index}`,
                header: `Dodatni pregledi ${index + 1}`,
                content: [
                    { label: 'Datum pregleda:', value: visit.visitDate ? new Date(visit.visitDate).toLocaleDateString() : 'N/A' },
                    { label: 'Opis pregleda:', value: visit.examination || 'N/A' },
                    { label: 'Terapija:', value: visit.recipe || 'N/A' },
                    { label: 'Dodatne napomene:', value: visit.addition || 'N/A' }
                ]
            });
        });
    }

    const renderSection = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.header}>{item.header}</Text>
            {item.content.map((contentItem, idx) => (
                <View key={idx}>
                    <Text style={styles.label}>{contentItem.label}</Text>
                    <Text style={styles.value}>{contentItem.value}</Text>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderSection}
                keyExtractor={(item) => item.key}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Text style={styles.closeButtonText}>Zatvori</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f9fc',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#004aad',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        backgroundColor: '#e8f0fe',
        padding: 10,
        borderRadius: 8,
    },
    closeButton: {
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DentalRecordDetailScreen;
