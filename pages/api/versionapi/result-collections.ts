import { NextApiRequest, NextApiResponse } from 'next';
import { PVersion } from '../../../pVersioning/versioner';

const v = new PVersion();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('in results api:', req.method)
  switch (req.method) {
    case 'GET':
      const { idToGet } = req.query;
        const result = await getResultCollection(idToGet);
        res.status(200).json(result);
      break;

 /*    case 'POST':
      const { versionResult } = req.body;
      const savedResult = await saveOneResultCollection(versionResult);
      res.status(201).json(savedResult);
      break; */

/*     case 'DELETE':
      const { idToDelete } = req.query;
      if (idToDelete && idToDelete !== '') {
        const deletedName = await deleteOneResultCollection(idToDelete);
        res.status(200).json(deletedName);
      } else {
        res.status(500).json({ message: 'no id to delete????' });
      }
      break;
 */
    default:
      res.status(405).end();
      break;
  }
}

async function getResultCollection(id?: string | Array<string>) {
  console.log('get result list: ', id)
  return id
    ? await v.getOneResultCollection(id)
    : await v.getResultCollectionList();

}

/* async function saveOneResultCollection(versionResult: ResultObject) {
  return await v.saveResult(versionResult);
} */

/* async function deleteOneResultCollection(id: string | Array<string>) {
  console.log('delete: ', id)
}
 */