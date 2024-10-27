import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { fetchOrdinations, fetchOrdinationsByLocation } from './services/HomeService';
import styles from './styles/HomeScreenStyle';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
    const [ordinations, setOrdinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationSearch, setLocationSearch] = useState(false);
    const [noResults, setNoResults] = useState(false);  

    const loadOrdinations = async () => {
        try {
            const data = await fetchOrdinations();
            setOrdinations(data);
        } catch (error) {
            console.error('Greška pri dohvatanju ordinacija:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrdinations();
    }, []);

    const handleLocationSearch = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Dozvola za pristup lokaciji je odbijena');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        try {
            const nearbyOrdinations = await fetchOrdinationsByLocation(latitude, longitude, 5);
            if (nearbyOrdinations.length === 0) {
                setNoResults(true); 
                setTimeout(() => {
                    setNoResults(false); 
                    loadOrdinations(); 
                }, 3000); 
            } else {
                setOrdinations(nearbyOrdinations);
                setLocationSearch(true);
            }
        } catch (error) {
            console.error('Greška pri pretraživanju ordinacija po lokaciji:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const filteredOrdinations = ordinations.filter(ordination => {
        const query = searchQuery.toLowerCase();
        return (
            ordination.name.toLowerCase().includes(query) ||
            ordination.address.toLowerCase().includes(query)
        );
    });

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.infoContainer}>
                <Icon name="place" size={20} color="#004aad" style={styles.icon} />
                <Text style={styles.subtitle}>{item.address}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Icon name="phone" size={20} color="#004aad" style={styles.icon} />
                <Text style={styles.subtitle}>{item.phoneNumber}</Text>
            </View>
            <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Appointments', { ordinationId: item.ordinationId, ordinationName: item.name })}>
                <Text style={styles.customButtonText}>Pregledaj termine</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchInput}>
                <Icon name="search" size={24} color="#a9a9a9" style={styles.searchIcon} />
                <TextInput
                    style={{ flex: 1, height: '100%', paddingLeft: 40 }}
                    placeholder="Pretraži po nazivu ili adresi..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <TouchableOpacity style={styles.locationButton} onPress={handleLocationSearch}>
                <Icon name="my-location" size={20} color="#fff" style={styles.locationIcon} />
                <Text style={styles.locationButtonText}>Pretraži po lokaciji</Text>
            </TouchableOpacity>

            {noResults ? (  
                <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>Nema ordinacija u blizini. Pokušajte ponovo. </Text>

                </View>
            ) : (
                <FlatList
                    data={filteredOrdinations}
                    renderItem={renderItem}
                    keyExtractor={item => item.ordinationId.toString()}
                />
            )}
        </View>
    );
};

export default HomeScreen;
