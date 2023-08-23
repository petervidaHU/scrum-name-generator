import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { versionResult } = req.body;
  console.log('versionResult in API:::', versionResult);
  const result = await v.saveResult(versionResult);
  
  res.status(200).json(result);
  }
