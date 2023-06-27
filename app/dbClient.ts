import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dbClientType } from "./types/databaseAbstaraction";

export const dbClient = () => new DynamoDBClient({ region: process.env.AWS_REGION});

