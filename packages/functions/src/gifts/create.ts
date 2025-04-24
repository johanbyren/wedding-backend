import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateGiftInput, Gift } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: CreateGiftInput = JSON.parse(event.body);
    const now = new Date().toISOString();
    const giftId = uuidv4();

    const gift: Gift = {
      giftId,
      ...input,
      status: input.status || "available",
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: process.env.GIFT_REGISTRY_TABLE_NAME!,
        Item: gift,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(gift),
    };
  } catch (error) {
    console.error("Error creating gift:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 