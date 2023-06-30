import { GetItemCommand, ScanCommand, PutItemCommand, BatchWriteItemCommand, DeleteItemCommand, AttributeValue } from '@aws-sdk/client-dynamodb';
import { DatabaseAbstraction, Item, createItemsReturnValue, dbClientType, deleteItemReturnValue, getAllItemsReturnValue, getItemReturnValue } from './types/databaseAbstaraction';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dbClient = () => new DynamoDBClient({ region: process.env.AWS_REGION });

class AWWSDynamoDatabase implements DatabaseAbstraction {
  table: string;

  constructor(
    private client: dbClientType
  ) {
    this.table = process.env.SCRUM_NAMES_TABLE || '';
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
    const params = {
      TableName: process.env.SCRUM_NAMES_TABLE,
    };

    try {
      const command = new ScanCommand(params);
      const result = await this.client.send(command);
      return result.Items;
    } catch (error) {
      console.error('Error retrieving items from DynamoDB:', error);
      throw error;
    }
  }

  async createItem(items: Item[]): createItemsReturnValue {
    if (!this.table) return 'no table';

    const putRequests = items.map((item) => {
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
        [this.table]: putRequests,
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

export const database = new AWWSDynamoDatabase(dbClient());
