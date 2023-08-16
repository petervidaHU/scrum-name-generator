import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { versionIds } = req.body;
  
  const result = await v.getVersions(versionIds);
  
  res.status(200).json(result);
  }
