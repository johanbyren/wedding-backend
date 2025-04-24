import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Gift } from "./types";

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
      .query({
        TableName: process.env.GIFT_REGISTRY_TABLE_NAME!,
        IndexName: "weddingIdIndex",
        KeyConditionExpression: "weddingId = :weddingId",
        ExpressionAttributeValues: {
          ":weddingId": weddingId,
        },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items as Gift[]),
    };
  } catch (error) {
    console.error("Error listing gifts:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 