import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, newPrompt } = req.body;
  
  const result = await v.savePromptVersion(id, newPrompt);
  
  console.log('in save prompt API: ', result);
  res.status(200).json(result);
  }
