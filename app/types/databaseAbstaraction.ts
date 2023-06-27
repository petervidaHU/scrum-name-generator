import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export type getItemReturnValue = Promise<Record<string, AttributeValue> | undefined>;
export type getAllItemsReturnValue = Promise<Record<string, AttributeValue>[] | undefined>;
export type createItemReturnValue = Promise<Item>;
export type deleteItemReturnValue = Promise<Record<string, AttributeValue> | undefined>;

export interface DatabaseAbstraction {
  getItem(itemId: string): getItemReturnValue;
  getAllItems(): getAllItemsReturnValue;
  createItem(item: Item): createItemReturnValue;
  deleteItem(itemId: string): deleteItemReturnValue;
}

export interface Item {
  name: string;
  tags: string[];
}

export type dbClientType = DynamoDBClient;
