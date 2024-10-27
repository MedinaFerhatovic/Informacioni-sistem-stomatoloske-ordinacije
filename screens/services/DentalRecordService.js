import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseApi } from '../../constants/constant'; 
import { fetchOrdinationById } from './HomeService'; 

export const fetchDentalRecords = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
            throw new Error('Korisnički ID nije pronađen.');
        }

        const response = await axios.get(`${BaseApi}/dentalRecord/user/${userId}`);
        if (response.status === 404) {
            return { records: [], ordinationName: '' };
        }

        const records = response.data;

        let ordinationName = '';
        if (records.length > 0) {
            const ordinationId = records[0].ordinationId;
            const ordination = await fetchOrdinationById(ordinationId);
            ordinationName = ordination.name;
        }

        return { records, ordinationName };
    } catch (err) {
        throw new Error('Greška pri dohvatu dentalnih kartona.');
    }
};
