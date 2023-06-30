import axios from 'axios';
import { addNotification } from '../features/notifications/notifications.slice';
import { store } from '@/redux/store'

export const axiosWithNotificationInstance = axios.create();
const { dispatch } = store;

axiosWithNotificationInstance.interceptors.response.use(
  (response) => {
    const status = response.status;
    switch (status) {
      case 200:
        dispatch(
          addNotification({
            message: 'Request Completed',
            type: 'success',
          })
        )
        break;
      default:
        break;
    }
    console.log("in axios interceptor: ", response);
    return response;
  },
  (error) => {
    const status = error.response.status;
    switch (status) {
      case 400:
      case 404:
        dispatch(
          addNotification({
            message: `Error in request - 400 or 404: ${error.message}, code: ${error.code}`,
            type: 'error',
            autoHideDuration: 10000,
          })
        )
        break;
      case 500:
        dispatch(
          addNotification({
            message: `Error in request - 500: ${error.message}, code: ${error.code}`,
            type: 'error',
            autoHideDuration: 10000,
          })
        )
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);
