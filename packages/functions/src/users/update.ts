import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { UpdateUserInput, User } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: UpdateUserInput = JSON.parse(event.body);
    const now = new Date().toISOString();

    // First get the current user to ensure it exists
    const getResult = await dynamoDb
      .get({
        TableName: process.env.USERS_TABLE_NAME!,
        Key: { userId },
      })
      .promise();

    if (!getResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const currentUser = getResult.Item as User;
    const updatedUser: User = {
      ...currentUser,
      ...input,
      updatedAt: now,
      emailIndex: input.email ? input.email.toLowerCase() : currentUser.emailIndex,
    };

    await dynamoDb
      .put({
        TableName: process.env.USERS_TABLE_NAME!,
        Item: updatedUser,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 