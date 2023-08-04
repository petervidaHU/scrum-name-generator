import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { newName, newDesc } = req.body;
  
  const result = v.initializePromp(newName, newDesc);
  
  console.log('inAPOI: ' + result);
  res.status(200).json(result);
  }
