import axios from 'axios';
import { BaseApi } from '../../constants/constant' 

export const fetchUserProfile = async () => {
  const response = await axios.get(`${BaseApi}/users/profile`, { withCredentials: true });
  return response.data;
};

