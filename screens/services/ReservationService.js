import axios from 'axios';
import { BaseApi } from "../../constants/constant";

export const createReservation = async (reservationData) => {
    try {
        const response = await axios.post(`${BaseApi}/reservations`, reservationData);
        return response.data;
    } catch (error) {
        console.error('Greška prilikom kreiranja rezervacije:', error);
        throw error; 
    }
};

export const updateAppointmentAvailability = async (appointmentId) => {
    try {
        const response = await axios.put(`${BaseApi}/appointments/toggle-availability/${appointmentId}`);
        if (response.status !== 204) { 
            throw new Error('Failed to update appointment availability');
        }
    } catch (error) {
        console.error('Greška prilikom ažuriranja dostupnosti termina:', error);
        throw error;
    }
};

export const getUserReservations = async (userId) => {
    return await axios.get(`${BaseApi}/reservations/user/${userId}`);
};

export const deleteReservation = async (reservationId) => {
    return await axios.delete(`${BaseApi}/reservations/${reservationId}`);
};
