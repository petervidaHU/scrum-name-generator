import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../pVersioning/versioner';
import { ResultObject } from '@/pVersioning/versionTypes';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('in results api:', req.method)
  switch (req.method) {
    case 'GET':
      const { idtoget } = req.query;
        const result = await getParameters(idtoget);
        res.status(200).json(result);
      break;

    default:
      res.status(405).end();
      break;
  }
}

async function getParameters(id?: string | Array<string>) {
  console.log('get parameter list: ', id)
  return id
    ? await v.getOneParameter(id)
    : await v.getParametersList();

}
