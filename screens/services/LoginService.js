import axios from 'axios';
import { BaseApi } from '../../constants/constant'  

export const loginUser = async (email, password) => {
    try {
        const response = await axios.get(`${BaseApi}/users/login/${email}/${password}`);
        if (response.status === 200) {
            return response.data.user;
        } else {
            throw new Error('Neuspjela prijava.');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Došlo je do greške pri prijavi.');
    }
};
