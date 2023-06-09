import openAIClient from "@/app/openAIClient";
import { iResultWithTags } from "@/app/types/nameTypes";

export default async function handler(req: any, res: any) {
   const { names } = req.body;
   const { openai } = openAIClient();

  let responseWithTags: iResultWithTags[] = [];
  for (const { name } of names) {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create tags for this topic: ${name}. Answer with a JSON object with this schema: {"tags":["tag1", "tag2", "tag3", "tag4"]}`,
        max_tokens: 100,
        temperature: 1,
      });

      if (!response.data.choices[0].text) throw new Error('No response, we are alone');
      const { tags } = JSON.parse(response.data.choices[0].text);
      
      responseWithTags.push({
        name: name,
        tags: tags,
      });
    } catch (err) {
      throw new Error(`Chaos AD, Tanks on the street... ${err}`);
    }
  }
  res.status(200).json(responseWithTags);
};
