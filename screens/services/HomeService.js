import axios from 'axios';
import { BaseApi } from '../../constants/constant'  

export const fetchOrdinations = async () => {
    try {
        const response = await axios.get(`${BaseApi}/ordinations`);
        return response.data; 
    } catch (error) {
        throw new Error('Greška pri dohvatanju ordinacija.');
    }
};

export const fetchOrdinationsByLocation = async (latitude, longitude, radiusKm) => {
    try {
        const response = await fetch(`${BaseApi}/ordinations/search?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Greška pri dohvatanju ordinacija po lokaciji:', error);
        throw error;
    }
};

export const fetchOrdinationById = async (ordinationId) => {
    try {
        const response = await axios.get(`${BaseApi}/ordinations/${ordinationId}`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching ordination:", error);
        throw error;
    }
};

