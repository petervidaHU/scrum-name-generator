import { openAIClient } from "@/app/openAIClient";
import { iResult } from "@/app/types/nameTypes";

export default async function handler(req: any, res: any) {
   const { names, property } = req.body;
   const openai = openAIClient();

  let responseFromAI: iResult[] = [];
  for (const { name } of names) {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: property.prompt(name),
        max_tokens: property.maxToken,
        temperature: property.temperature,
      });

      if (!response.data.choices[0].text) throw new Error('No response, we are alone');
      const { answer } = JSON.parse(response.data.choices[0].text);

      responseFromAI.push({
        name: name,
        [property.propertyName]: answer,
      });
    } catch (err) {
      throw new Error(`Chaos AD, Tanks on the street... ${err}`);
    }
  }
  res.status(200).json(responseFromAI);
};
