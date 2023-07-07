import { GetItemCommand, ScanCommand, PutItemCommand, BatchWriteItemCommand, DeleteItemCommand, AttributeValue } from '@aws-sdk/client-dynamodb';
import { DatabaseAbstraction, Item, createItemsReturnValue, dbClientType, deleteItemReturnValue, getAllItemsReturnValue, getItemReturnValue } from './types/databaseAbstaraction';
import { iNameItemComplete } from './types/nameTypes';
import { stringify } from 'querystring';

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

  private handleTags(items: iNameItemComplete[]) {
    type normalizedTagsObject = { [key: string]: string[] };
    
    const nomalizedTags: any = items.reduce((acc, item): normalizedTagsObject => {
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

    console.log('nomalizedTags: ', nomalizedTags);

    // return
  }

  async createItem(items: iNameItemComplete[]): createItemsReturnValue {
    if (!this.namesTable) return 'no table';

    this.handleTags(items);

    const putRequestsName = items.map((item) => {
      const convertedItem: Record<string, AttributeValue> = {
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
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      ConditionExpression: 'attribute_not_exists(#n)',
      ExpressionAttributeNames: {
        '#n': 'name'
      }
    };
    const command = new BatchWriteItemCommand(params);

    try {
      const response = await this.client.send(command);
      console.log('Items created successfully:', response);
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
