import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateWeddingInput, Wedding } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: CreateWeddingInput = JSON.parse(event.body);
    const now = new Date().toISOString();
    const weddingId = uuidv4();

    const wedding: Wedding = {
      weddingId,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: process.env.WEDDINGS_TABLE_NAME!,
        Item: wedding,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(wedding),
    };
  } catch (error) {
    console.error("Error creating wedding:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 