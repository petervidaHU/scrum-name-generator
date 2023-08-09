import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.query;

  if (typeof prompt !== 'string') {
    res.status(400).json({ message: 'no prompt id' })
  } else {
    const result = await v.getOnePromptCollection(prompt);
    res.status(200).json(result);
  }
}
