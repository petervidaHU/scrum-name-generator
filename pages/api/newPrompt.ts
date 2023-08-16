import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { newName, newDesc, defaultParametersId } = req.body;
  
  const result = v.initializePromp(newName, newDesc, defaultParametersId);
  
  res.status(200).json(result);
  }
