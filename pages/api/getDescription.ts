import { NextApiRequest, NextApiResponse } from 'next';
import { openAIClient } from '../../app/openAIClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const name = req.body;
  if (!name) return res.status(400).json('no name');
  
  const openai = openAIClient();

  let textDesc = '';
  try {
    const desc = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a one sentences long description about this: ${name}.`,
      max_tokens: 100,
      temperature: 0.8,
    });

    if (!desc.data.choices[0].text) throw new Error('No response, we are alone');
    textDesc = desc.data.choices[0].text;

  } catch (err) {
    throw new Error(`Chaos AD, Tanks on the street... ${err}`);
  }
  res.status(200).json(textDesc);
};
