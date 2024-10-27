import axios from 'axios';
import { BaseApi } from '../../constants/constant';

export const fetchAppointments = async (ordinationId) => {
    const response = await axios.get(`${BaseApi}/appointments/all/${ordinationId}`); 
    return response.data;
};

export const fetchAppointmentById = async (appointmentId) => {
    try {
        const response = await axios.get(`${BaseApi}/appointments/${appointmentId}`);
        return response.data; 
    } catch (error) {
        console.error("Greška pri dohvatanju termina:", error);
        throw error; 
    }
};