import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

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

    // Check if wedding exists
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

    // Delete wedding
    await dynamoDb
      .delete({
        TableName: process.env.WEDDINGS_TABLE_NAME!,
        Key: { weddingId },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Wedding deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting wedding:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 