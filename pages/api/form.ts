import { NextApiRequest, NextApiResponse } from 'next';
import { iNameItem } from "@/app/types/nameTypes";
import { generalPrinciples, exploreNewTopic, formatArray, PCCheck, formatYNReaseon } from "@/prompts/newTopic";
import { openAIClient } from '../../app/openAIClient';
import { createResult, mergeVariablesIntoPrompt } from '@/pVersioning/promptVersionerUtils';
import { PVersion } from '@/pVersioning/versioner';
import { parameterPropertiesType, parameterType, promptVersionType } from '@/pVersioning/versionTypes';

const v = new PVersion;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topic, desc, prompt, paramId }: { topic: string, desc: string, prompt: promptVersionType, paramId: string } = req.body;
  const openai = openAIClient();

  
  if (!topic) return res.status(400).json('topic not found');
  if (paramId === '') return res.status(400).json('parameters of prompt not found');
  let p: parameterType;
  try {
    p = await v.getParameter(paramId)
  } catch {
    return res.status(400).json('parameters of prompt could not fetched');
  }
  
  let textSwear;
  try {
    const swearingPreCheck = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Evaulate this topic: ${topic}. ${PCCheck}. ${formatYNReaseon}`,
      max_tokens: 100,
      temperature: 0.1,
    });
    // console.log('checking', swearingPreCheck);
    if (!swearingPreCheck.data.choices[0].text) throw new Error('No response, we are alone');
    textSwear = JSON.parse(swearingPreCheck.data.choices[0].text);
    
  } catch (err) {
    throw new Error(`Error in SWEARCHECK ${err}`);
  }
  
  if (textSwear.a == 'yes') return res.status(200).json(textSwear.r);
  
  const variables = {
    NUM_OF_ANSWERS: '4',
    TOPIC: topic,
  };
  
  const finalPromptText = mergeVariablesIntoPrompt(prompt.promptText, variables);
  let text;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: finalPromptText,
      max_tokens: 200,
      // max_tokens: p.parameters.max_tokens,
      temperature: p.parameters.temperature,
    });

    if (!response.data.choices[0].text) throw new Error('No response, we are alone');
    text = response.data.choices[0].text;
    
  } catch (err) {
    throw new Error(`Error in CREATE TOPIC ${err}`);
  }
  
  const resultConnection = await v.createConnection(prompt.id, paramId);
  const resultText: iNameItem[] = text.split(",").map((splitted: string): iNameItem => ({ name: splitted.trim() }));
  const resultData = {
    resultText,
    resultId: resultConnection, 
  }
console.log('in forms:', resultData)
  res.status(200).json(resultData);
}