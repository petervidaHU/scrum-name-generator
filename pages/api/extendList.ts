import { openAIClient } from "@/app/openAIClient";
import { iResult } from "@/app/types/nameTypes";
import { promptPropertiesType, promtGenerationForExtendList } from "../admin/extendResultListDatabase";

export default async function handler(req: any, res: any) {
   const { names, property: {maxToken, temperature, pName} }: {names: iResult[], property: promptPropertiesType} = req.body;
   const openai = openAIClient();

  let responseFromAI: iResult[] = [];
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
