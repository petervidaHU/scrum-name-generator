import { axiosWithNotificationInstance } from "@/app/axios/axiosWithNotification";

export const getList = async () => {
  const endpoint = '/api/getListFromDB';

  let tempResult: any[] = [];
  
  try {
    const response = await axiosWithNotificationInstance(endpoint);
    tempResult = await response.data;
  } catch (e) {
    return {
      error: 'errrrrrrr',
    };
  }

  return {
    result: tempResult,
  };
}