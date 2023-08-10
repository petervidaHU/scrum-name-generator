import { NextApiRequest, NextApiResponse } from 'next';
import { openAIClient } from "@/app/openAIClient";
import { iNameItem } from "@/app/types/nameTypes";
import { promptPropertiesType, promtGenerationForExtendList } from '../admin/create-new/extendResultListDatabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   const { names, property: {maxToken, temperature, pName} }: {names: iNameItem[], property: promptPropertiesType} = req.body;
   const openai = openAIClient();

  let responseFromAI: iNameItem[] = [];
  for (const nameObject of names) {
    const promptFunc = promtGenerationForExtendList[pName];
    if (!promptFunc) throw new Error('Can not create prompt, missing function');

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: promptFunc(nameObject.name),
        max_tokens: maxToken,
        temperature: temperature,
      });

      if (!response.data.choices[0].text) {
        throw new Error('No response, we are alone');
      }
      // TODO: forget JSON format, use plain object with axios
      const { answer } = JSON.parse(response.data.choices[0].text);

      responseFromAI.push({
        ...nameObject,
        [pName]: answer,
      });
    } catch (err) {
      throw new Error(`An error from AI: ${err}`);
    }
  }
  res.status(200).json(responseFromAI);
};
