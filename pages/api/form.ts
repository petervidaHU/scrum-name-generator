import { iResult } from "@/app/types/nameTypes";
import { generalPrinciples, exploreNewTopic, formatArray, PCCheck, formatYNReaseon } from "@/prompts/newTopic";

export default async function handler(req: any, res: any) {
  const { topic, desc } = req.body;
  let resData: iResult;
  if (!topic) {
    resData = {
      message: 'error',
      data: ['topic not found'],
    }
    return res.status(400).json(resData);
  }

  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let textSwear;
  try {
    const swearingPreCheck = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Evaulate this topic: ${topic}. ${PCCheck}. ${formatYNReaseon}`,
      max_tokens: 100,
      temperature: 0.1,
    });
    textSwear = JSON.parse(swearingPreCheck.data.choices[0].text);
  } catch (err) {
    throw new Error(`Chaos AD, Tanks on the street... ${err}`);
  }

  if (textSwear.a == 'yes') {
    resData = {
      message: 'error',
      data: [textSwear.r],
    }
    return res.status(200).json(resData);
  }

  let text;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${exploreNewTopic} ${topic}. ${generalPrinciples} ${formatArray}`,
      max_tokens: 100,
      temperature: 1,
    });
    text = response.data.choices[0].text;
  } catch (err) {
    throw new Error(`Chaos AD, Tanks on the street... ${err}`);
  }

  resData = {
    message: 'ok',
    data: text.split(","),
  }
  res.status(200).json(resData);
}