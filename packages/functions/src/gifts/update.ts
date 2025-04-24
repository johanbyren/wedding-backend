import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { UpdateGiftInput, Gift } from "./types";

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

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: UpdateGiftInput = JSON.parse(event.body);

    // Get current gift
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

    const currentGift = result.Item as Gift;
    const updatedGift: Gift = {
      ...currentGift,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: process.env.GIFT_REGISTRY_TABLE_NAME!,
        Item: updatedGift,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedGift),
    };
  } catch (error) {
    console.error("Error updating gift:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 