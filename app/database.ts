import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AWSDynamoDatabase } from "./AWSDynamoDatabase";
import { DatabaseAbstraction } from "./types/databaseAbstaraction";

export const dbClient = () => new DynamoDBClient({ region: process.env.AWS_REGION });

export const database: DatabaseAbstraction = new AWSDynamoDatabase(dbClient());
