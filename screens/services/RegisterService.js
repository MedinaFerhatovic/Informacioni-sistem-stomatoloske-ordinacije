import { BaseApi } from '../../constants/constant';
import axios from 'axios';

export const registerUser = async (user) => {
  const response = await axios.post(`${BaseApi}/users/register`, user);
  return response.data;
};
