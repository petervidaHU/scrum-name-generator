import { post } from "@/app/helpers/fetchOptions";
import { iResult, iResultWithTags } from "@/app/types/nameTypes";
import { extendResultListDatabase } from "./extendResultListDatabase";

export const extendList = async (proposedList: (iResult | iResultWithTags)[]): Promise<(iResult | iResultWithTags)[]> => {
  const nextStep = !proposedList[0]?.description ? extendResultListDatabase.description : extendResultListDatabase.tags;
  const endpoint = '/api/extendList';
  let tempResult: iResultWithTags[] = [];

  console.log('nextstep: ', nextStep);

  const data = {
    names: proposedList,
    property: nextStep,
  }
  try {
    const response = await fetch(endpoint, post(data));
    tempResult = await response.json();
  } catch (e) {
    console.log('error:', e);
  }
  console.log('extend list result: ', tempResult);

  return tempResult;
}
