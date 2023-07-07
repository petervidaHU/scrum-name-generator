import { NextApiRequest, NextApiResponse } from 'next';
import { iNameItem } from "@/app/types/nameTypes";
import { generalPrinciples, exploreNewTopic, formatArray, PCCheck, formatYNReaseon } from "@/prompts/newTopic";
import { openAIClient } from '../../app/openAIClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topic, desc } = req.body;
  const openai = openAIClient();

  if (!topic) return res.status(400).json('topic not found');

  let textSwear;
  try {
    const swearingPreCheck = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Evaulate this topic: ${topic}. ${PCCheck}. ${formatYNReaseon}`,
      max_tokens: 100,
      temperature: 0.1,
    });

    if (!swearingPreCheck.data.choices[0].text) throw new Error('No response, we are alone');
    textSwear = JSON.parse(swearingPreCheck.data.choices[0].text);

  } catch (err) {
    throw new Error(`Chaos AD, Tanks on the street... ${err}`);
  }

  if (textSwear.a == 'yes') return res.status(200).json(textSwear.r);

  let text;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${exploreNewTopic} ${topic}. ${generalPrinciples} ${formatArray}`,
      max_tokens: 100,
      temperature: 1,
    });

    if (!response.data.choices[0].text) throw new Error('No response, we are alone');
    text = response.data.choices[0].text;

  } catch (err) {
    throw new Error(`Chaos AD, Tanks on the street... ${err}`);
  }

  const temp = text.split(",").map((splitted: string): iNameItem => ({name: splitted}));

  const resData: iNameItem[] = temp;
  res.status(200).json(resData);
}