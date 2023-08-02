import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { newText } = req.body;
  
  const r = v.createNewPrompt(newText);
  
  console.log('inAPOI: ' + r);
  res.status(200).json(r);
  }
