import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

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

    // First check if the user exists
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

    await dynamoDb
      .delete({
        TableName: process.env.USERS_TABLE_NAME!,
        Key: { userId },
      })
      .promise();

    return {
      statusCode: 204,
      body: "",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 