import { post } from "@/app/helpers/fetchOptions";
import { centralizedAPICall, iNameItem } from "@/app/types/nameTypes";
import { PromptVersionType } from "@/pVersioning/versionTypes";
import axios from "axios";
import { FormEvent } from "react";

export const createRequestForNames = async (event: FormEvent<HTMLFormElement>, prompt: PromptVersionType, paramId: string): /* centralizedAPICall */Promise<any> => {
  const endpoint = '/api/createTopic';
  const target = event.target as HTMLFormElement;
  const data = {
    topic: target.topic.value,
    desc: target.description.value,
    paramId,
    prompt,
  };

  console.log('paramId: ', paramId);

  let tempResult: any;
  try {
    const response = await axios(endpoint, post(data));
    tempResult = await response.data;
  } catch (e) {
    console.log('error:', e);
    return {
      error: 'error catched in client side catch for create names',
    }
  }
  return {
    result: tempResult,
  };

};
