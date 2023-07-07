import { NextApiRequest, NextApiResponse } from 'next';
import { iNameItem, iNameItemComplete, iNameItemWithTags, statusType } from "@/app/types/nameTypes";
import { database } from "@/app/database";

/* const checkNames = async (names: iResult[], client: DbClientType) => {
  const tableName = 'scrumNames1';
  const namesToCheck = names.map((n: iResult) => n.name);;

  const promises = namesToCheck.map(async (name: string) => {
    const params = {
      TableName: tableName,
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': { S: name }
      }
    };

    const command = new ScanCommand(params);
    const { Items } = await client.send(command);
    return (Items && Items?.length > 0) ? name : '';
  });

  try {
    const results = await Promise.all(promises);
    return results;
  } catch (err) {
    console.log('Error:', err);
  }
}; */

const saveItems = async (names: any) => {
  const result = await database.createItem(names);
  console.log('after saving items: ', result);
}

const filterOutExistingNames = (names: iNameItemWithTags[], existingNames: string[]) => {
  return names.filter((n: iNameItemWithTags) => !existingNames?.includes(n.name));
}

const createOptions = (names: iNameItemWithTags[], instantActivate: statusType) => {
  return names
    .map((n: iNameItemWithTags): any => ({
      ...n,
      status: 'active',
    }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log('req: ', req.body)
  const { names } = req.body;

  // let existingNames = await checkNames(names, client) || [];
  let existingNames = names || [];
  const filteredList = filterOutExistingNames(names, existingNames)
  // const finalList = createOptions(filteredList, instantActivate);

  await saveItems(filteredList);

};
