import { NextApiRequest, NextApiResponse } from 'next';
import { iNameItem } from "@/app/types/nameTypes";
import { generalPrinciples, exploreNewTopic, formatArray, PCCheck, formatYNReaseon } from "@/prompts/newTopic";
import { openAIClient } from '../../app/openAIClient';
import { mergeVariablesIntoPrompt } from '@/pVersioning/promptVersionerUtils';
import { PVersion } from '@/pVersioning/versioner';
import { promptVersionType } from '@/pVersioning/versionTypes';

const v = new PVersion;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topic, desc, prompt }: {topic: string, desc: string, prompt: promptVersionType} = req.body;
  const openai = openAIClient();

  if (!topic) return res.status(400).json('topic not found');
  if (!prompt.params) return res.status(400).json('parameters of prompt not found');

  let textSwear;
  try {
    const swearingPreCheck = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Evaulate this topic: ${topic}. ${PCCheck}. ${formatYNReaseon}`,
      max_tokens: 100,
      temperature: 0.1,
    });
    console.log('checking', swearingPreCheck);
    if (!swearingPreCheck.data.choices[0].text) throw new Error('No response, we are alone');
    textSwear = JSON.parse(swearingPreCheck.data.choices[0].text);

  } catch (err) {
    throw new Error(`Chaos AD, Tanks on the street... ${err}`);
  }

  if (textSwear.a == 'yes') return res.status(200).json(textSwear.r);

  const vari = {
    NUM_OF_ANSWERS: '4',
    TOPIC: topic,
  };

  const finalPromptText = mergeVariablesIntoPrompt(prompt.promptText, vari);
  const parameters = await v.getParameter(prompt.params)
  console.log('parameters::::::::::::::::::::::::::::::::::', parameters);

  console.log('finalPromptText::::::::::::::::::::::::::::::::::::::::', finalPromptText);

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

  const resData: iNameItem[] = text.split(",").map((splitted: string): iNameItem => ({ name: splitted.trim() }));

  res.status(200).json(resData);
}