import { post } from "@/app/helpers/fetchOptions";

export const getDescription = async (name: string) => {
  const endpoint = '/api/getDescription';
  console.log('get description: ', name);
  
  let tempResult: string = '';
  try {
    const response = await fetch(endpoint, post(name));
    tempResult = await response.json();
  } catch (e) {
    console.log('error:', e);
  }

  return tempResult;
}
