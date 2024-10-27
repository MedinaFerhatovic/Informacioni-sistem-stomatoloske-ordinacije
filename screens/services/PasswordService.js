import axios from 'axios';
import { BaseApi } from '../../constants/constant' 

export const resetUserPassword = async (email, newPassword) => {
  return await axios.post(`${BaseApi}/users/resetPassword`, {
    email: email,
    newPassword: newPassword,
  });
};
