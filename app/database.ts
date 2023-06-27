import { GetItemCommand, ScanCommand, PutItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { DatabaseAbstraction, Item, createItemReturnValue, dbClientType, deleteItemReturnValue, getAllItemsReturnValue, getItemReturnValue } from './types/databaseAbstaraction';

class Database implements DatabaseAbstraction {
  constructor(private client: dbClientType) {}

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

  async createItem(item: Item): createItemReturnValue {
    const params = {
      TableName: process.env.SCRUM_NAMES_TABLE,
      Item: {
        name: { S: item.name },
        tags: { SS: item.tags },
      },
    };

    try {
      const command = new PutItemCommand(params);
      await this.client.send(command);
      console.log('Item created successfully');
      return item;
    } catch (error) {
      console.error('Error creating item in DynamoDB:', error);
      throw error;
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