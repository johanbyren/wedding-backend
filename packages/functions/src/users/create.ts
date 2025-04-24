import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateUserInput, User } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: CreateUserInput = JSON.parse(event.body);
    const now = new Date().toISOString();
    const userId = uuidv4();

    const user: User = {
      userId,
      ...input,
      createdAt: now,
      updatedAt: now,
      emailIndex: input.email.toLowerCase(), // Store email in lowercase for case-insensitive lookups
    };

    await dynamoDb
      .put({
        TableName: process.env.USERS_TABLE_NAME!,
        Item: user,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 