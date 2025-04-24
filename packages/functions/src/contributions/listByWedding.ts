import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Contribution } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

interface DynamoDBContribution extends Omit<Contribution, "isAnonymous"> {
  isAnonymous: string;
}

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
        TableName: process.env.CONTRIBUTIONS_TABLE_NAME!,
        IndexName: "weddingIdIndex",
        KeyConditionExpression: "weddingId = :weddingId",
        ExpressionAttributeValues: {
          ":weddingId": weddingId,
        },
      })
      .promise();

    const contributions: Contribution[] = (result.Items as DynamoDBContribution[]).map(
      (item) => ({
        ...item,
        isAnonymous: item.isAnonymous === "true",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(contributions),
    };
  } catch (error) {
    console.error("Error listing contributions:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 