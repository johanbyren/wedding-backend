import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

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

    // Check if gift exists
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

    // Delete gift
    await dynamoDb
      .delete({
        TableName: process.env.GIFT_REGISTRY_TABLE_NAME!,
        Key: { giftId },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Gift deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting gift:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 