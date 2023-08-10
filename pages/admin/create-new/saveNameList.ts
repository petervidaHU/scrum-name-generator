import { post } from "@/app/helpers/fetchOptions";
import { iNameItem, iNameItemWithTags, statusType } from "@/app/types/nameTypes";
import axios from "axios";

export const saveNameList = async (result: string | (iNameItem | iNameItemWithTags)[]): Promise<iNameItem[]> => {
  const endpoint = '/api/saveNames';

  const data = {
    names: result,
  };

  let tempResult: iNameItem[] = [];
  try {
    const response = await axios(endpoint, post(data));
    tempResult = await response.data;
  } catch (e) {
    console.log('error:', e);
  }

  console.log('save names result: ', tempResult);
  return tempResult;
}