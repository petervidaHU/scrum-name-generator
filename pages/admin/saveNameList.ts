import { post } from "@/app/helpers/fetchOptions";
import { iResult, iResultWithTags, statusType } from "@/app/types/nameTypes";

export const saveNameList = async (result: string | (iResult | iResultWithTags)[]): Promise<iResult[]> => {
  const endpoint = '/api/saveNames';

  const activ: statusType = true;
    const data = {
      names: result,
      instantActivate: activ,
    };

    let tempResult: iResult[] = [];
    try {
      const response = await fetch(endpoint, post(data));
      tempResult = await response.json();
    } catch (e) {
      console.log('error:', e);
    }

    console.log('save names result: ', tempResult);
    return tempResult;
}