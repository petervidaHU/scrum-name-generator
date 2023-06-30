import { iResult, iResultComplete, iResultWithTags, statusType } from "@/app/types/nameTypes";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "@/app/dbClient";
import { DbClientType } from "@/app/types/dbTypes";
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

const saveItems = async (names: any, client: DbClientType) => {
  const result = await database.createItem(names);
  console.log('after saving items: ', result);
}

const filterOutExistingNames = (names: iResultWithTags[], existingNames: string[]) => {
  return names.filter((n: iResultWithTags) => !existingNames?.includes(n.name));
}

const createOptions = (names: iResultWithTags[], instantActivate: statusType) => {
  return names
    .map((n: iResultWithTags): any => ({
      ...n,
      status: 'active',
    }));
}

export default async function handler(req: any, res: any) {
  console.log('req: ', req.body)
  const { names } = req.body;
  const client: DbClientType = dbClient();

  // let existingNames = await checkNames(names, client) || [];
  let existingNames = names || [];
  const filteredList = filterOutExistingNames(names, existingNames)
  // const finalList = createOptions(filteredList, instantActivate);

  await saveItems(filteredList, client);

};
