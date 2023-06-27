import { post } from "@/app/helpers/fetchOptions";
import { iResult } from "@/app/types/nameTypes";
import { FormEvent } from "react";

export const createRequestForNames = async (event: FormEvent<HTMLFormElement>): Promise<{tempResult: iResult[], tempError: string}> => {
 
  const fakeresponse: iResult[] = [
    {name: 'fake name1'}, {name: 'fake name2'}, {name: 'fakdedname3'}, {name: 'fake naffme4'}, {name: 'faffke name5'},
  ];

  return {
    tempResult: fakeresponse,
    tempError: '',
  };

  const endpoint = '/api/form';

  const target = event.target as HTMLFormElement;
  const data = {
    topic: target.topic.value,
    desc: target.description.value,
  };

  let tempResult: iResult[] = [];
  try {
    const response = await fetch(endpoint, post(data));
    tempResult = await response.json();
  } catch (e) {
    console.log('error:', e);
  }

  return  {
    tempResult: fakeresponse,
    tempError: '',
  };

};
