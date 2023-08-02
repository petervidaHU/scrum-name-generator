import { GetItemCommand, ScanCommand, BatchWriteItemCommand, DeleteItemCommand, AttributeValue, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from "@aws-sdk/util-dynamodb";
import { DatabaseAbstraction, createItemsReturnValue, dbClientType, deleteItemReturnValue, getAllItemsReturnValue, getItemReturnValue } from './types/databaseAbstaraction';
import { iNameItemComplete } from './types/nameTypes';

type normalizedTagsObject = { [key: string]: string[] };
type DynamoDBItem = Record<string, AttributeValue>;
type tagsTwinPeaks = { itemsToUpdate: DynamoDBItem[]; itemsToCreate: DynamoDBItem[] }

export class AWSDynamoDatabase implements DatabaseAbstraction {
  namesTable: string;
  tagsTable: string;

  constructor(
    private client: dbClientType
  ) {
    this.namesTable = process.env.SCRUM_NAMES_TABLE || '';
    this.tagsTable = process.env.TAGS_NAMES_TABLE || '';
  }

  async getItem(itemId: string): getItemReturnValue {
    const params = {
      TableName: process.env.SCRUM_NAMES_TABLE,
      Key: {
        name: { S: itemId },
      },
    };

    try {
      const command = new GetItemCommand(params);
      const result = await this.client.send(command);
      return result.Item;
    } catch (error) {
      console.error('Error retrieving item from DynamoDB:', error);
      throw error;
    }
  }

  async getAllItems(): getAllItemsReturnValue {
    const itemsPerPage = 25;
    let lastEvaluatedKey: any = null;
    let items;
    try {
      const params = {
        TableName: this.namesTable,
        Limit: itemsPerPage,
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const command = new ScanCommand(params);
      const response = await this.client.send(command);
      items = response.Items;
      lastEvaluatedKey = response.LastEvaluatedKey;
    } catch (error) {
      console.error('Error fetching items:', error);
    }
    return items ? items : [];
  }

  private normalizedTags(items: iNameItemComplete[]) {
    return items.reduce((acc, item): normalizedTagsObject => {
      item.tags.forEach(tag => {
        if (acc[tag] && !acc[tag].includes(item.name)) {
          acc[tag].push(item.name);
        } else {
          acc = {
            ...acc,
            [tag]: [item.name],
          }
        }
      })
      return acc;
    }, {} as normalizedTagsObject)
  }

  private async separateNewOrUpdate(list: normalizedTagsObject): Promise<tagsTwinPeaks> {
    return Object.entries(list).reduce(
      async (accPromise: Promise<tagsTwinPeaks>, [tagName, tagItems]) => {
        const acc = await accPromise;

        const getItemCommand = new GetItemCommand({
          TableName: this.tagsTable,
          Key: {
            tagName: { S: tagName },
            status: { S: 'active' } || { S: 'inactive' },
          },
        });

        const existingTag = await this.client.send(getItemCommand);

        if (existingTag.Item) {
          return {
            ...acc,
            itemsToUpdate: [...acc.itemsToUpdate, existingTag.Item],
          };
        } else {
          const convertedItem: DynamoDBItem = {
            tagName: { S: tagName },
            status: { S: 'active' },
            items: { SS: tagItems },
          };
          return {
            ...acc,
            itemsToCreate: [...acc.itemsToCreate, convertedItem],
          };
        }
      },
      Promise.resolve({ itemsToUpdate: [], itemsToCreate: [] })
    );
  }

  private async createNewTags(tagsToCreate: DynamoDBItem[]) {
    let newTagsResponse: string;
    console.log('tagsToCreate: ', tagsToCreate)

    const params = {
      RequestItems: {
        [this.tagsTable]: tagsToCreate.map(item => ({
          PutRequest: { Item: item },
        })),
      },
      ConditionExpression: 'attribute_not_exists(#n)',
      ExpressionAttributeNames: {
        '#n': 'tagName',
      },
    };
    const command = new BatchWriteItemCommand(params);
    await this.client.send(command);

    return 'new tags created ok';
  }

  private async updateTags(itemsToUpdate: DynamoDBItem[]) {
    for (const itemFocused of itemsToUpdate) {
      console.log('it: ', itemFocused)
      const paramsUpdate = {
        TableName: this.tagsTable,
        Key: {
          tagName: itemFocused.tagName,
          status: itemFocused.status,
        },
        UpdateExpression: 'ADD #items :newItem',
        ExpressionAttributeNames: {
          '#items': 'items',
        },
        ExpressionAttributeValues: {
          ':newItem': itemFocused.items,
        },
        ConditionExpression: 'NOT contains(#items, :newItem)',
      };

      const commandUpdate = new UpdateItemCommand(paramsUpdate);
      await this.client.send(commandUpdate);
    }

    return 'tags updated successfully';
  }

  private async handleTags(items: iNameItemComplete[]) {
    const { itemsToUpdate, itemsToCreate } = await this.separateNewOrUpdate(
      this.normalizedTags(items)
    );
    if (itemsToCreate.length) {
      await this.createNewTags(itemsToCreate);
    }
    if (itemsToUpdate.length) {
      await this.updateTags(itemsToUpdate);
    }

    return 'tags ok';
  }

  private async createNewNames(items: iNameItemComplete[]) {
    const putRequestsName = items.map((item) => {
      const convertedItem: DynamoDBItem = {
        name: { S: item.name },
        description: { S: item.description },
        status: { S: 'active' },
      }
      return ({
        PutRequest: { Item: convertedItem },
      })
    });

    const params = {
      RequestItems: {
        [this.namesTable]: putRequestsName,
      },
      ConditionExpression: 'attribute_not_exists(#n)',
      ExpressionAttributeNames: {
        '#n': 'name'
      }
    };

    const command = new BatchWriteItemCommand(params);
    await this.client.send(command);
  }

  async createItem(items: iNameItemComplete[]): Promise<string> {
    if (!this.namesTable || !this.tagsTable) return 'no table';

    try {
      // await this.createNewNames(items);
      await this.handleTags(items);
      return 'Items created successfully';
    } catch (err) {
      console.log('Error creating items:', err);
      return 'Error creating items';
    }
  }

  async deleteItem(itemId: string): deleteItemReturnValue {
    const params = {
      TableName: process.env.SCRUM_NAMES_TABLE,
      Key: {
        name: { S: itemId },
      },
    };

    try {
      const command = new DeleteItemCommand(params);
      const result = await this.client.send(command);
      return result.Attributes;
    } catch (error) {
      console.error('Error deleting item from DynamoDB:', error);
      throw error;
    }
  }
}
