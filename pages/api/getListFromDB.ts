import { NextApiRequest, NextApiResponse } from 'next';
import { database } from "@/app/database";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let tempResult: any[] = [];
  try {
    tempResult = await database.getAllItems()
  } catch (error) {
    res.status(500).json(error)
  }
  res.status(200).json(tempResult);
};
