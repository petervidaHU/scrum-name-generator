import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { statusType } from "./nameTypes";

export type getItemReturnValue = Promise<Record<string, AttributeValue> | undefined>;
export type getAllItemsReturnValue = Promise<Record<string, AttributeValue>[]>;
export type createItemsReturnValue = Promise<string>;
export type deleteItemReturnValue = Promise<Record<string, AttributeValue> | undefined>;

export interface DatabaseAbstraction {
  getItem(itemId: string): getItemReturnValue;
  getAllItems(): getAllItemsReturnValue;
  createItem(items: Item[]): createItemsReturnValue;
  deleteItem(itemId: string): deleteItemReturnValue;
}

export interface Item {
  name: string,
  status: statusType,
  description: string,
}

export type dbClientType = DynamoDBClient;
