import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const result = await v.getParametersList();
  
  res.status(200).json(result);
  }
