import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { UpdateWeddingInput, Wedding } from "./types";

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

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: UpdateWeddingInput = JSON.parse(event.body);

    // Get current wedding
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

    const currentWedding = result.Item as Wedding;
    const updatedWedding: Wedding = {
      ...currentWedding,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: process.env.WEDDINGS_TABLE_NAME!,
        Item: updatedWedding,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedWedding),
    };
  } catch (error) {
    console.error("Error updating wedding:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 