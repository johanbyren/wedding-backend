import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Gift } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const giftId = event.pathParameters?.giftId;

    if (!giftId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Gift ID is required" }),
      };
    }

    const result = await dynamoDb
      .get({
        TableName: process.env.GIFT_REGISTRY_TABLE_NAME!,
        Key: { giftId },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Gift not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item as Gift),
    };
  } catch (error) {
    console.error("Error getting gift:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 