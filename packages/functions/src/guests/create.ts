import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateGuestInput, Guest } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: CreateGuestInput = JSON.parse(event.body);
    const now = new Date().toISOString();

    const guest: Guest = {
      id: uuidv4(),
      ...input,
      rsvp: false,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: process.env.TABLE_NAME!,
        Item: {
          pk: `GUEST#${guest.id}`,
          sk: `GUEST#${guest.id}`,
          ...guest,
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(guest),
    };
  } catch (error) {
    console.error("Error creating guest:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 