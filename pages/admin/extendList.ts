import axios from 'axios';
import { post } from "@/app/helpers/fetchOptions";
import { centralizedAPICall, iResult, iResultWithTags } from "@/app/types/nameTypes";
import { extendResultListDatabase } from "./extendResultListDatabase";
import { axiosWithNotificationInstance } from '@/app/axios/axiosWithNotification';

export const extendList = async (proposedList: (iResult | iResultWithTags)[]): centralizedAPICall => {
  
  // TODO: refactor with a scalable solution. 
  // TODO: involve the original topic for generating description, to be sure about the original context cause words could have multiple meanings.
  
  const nextStep = !proposedList[0]?.description ? extendResultListDatabase.description : extendResultListDatabase.tags;
  const endpoint = '/api/extendList';
  
  let tempResult: iResultWithTags[] = [];
  const data = {
    names: proposedList,
    property: nextStep,
  }

  try {
    const response = await axiosWithNotificationInstance(endpoint, post(data));
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
