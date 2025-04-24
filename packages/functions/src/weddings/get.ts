import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Wedding } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const weddingId = event.pathParameters?.weddingId;

    if (!weddingId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Wedding ID is required" }),
      };
    }

    const result = await dynamoDb
      .get({
        TableName: process.env.WEDDINGS_TABLE_NAME!,
        Key: { weddingId },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Wedding not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item as Wedding),
    };
  } catch (error) {
    console.error("Error getting wedding:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 