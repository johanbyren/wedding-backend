import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const contributionId = event.pathParameters?.contributionId;

    if (!contributionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Contribution ID is required" }),
      };
    }

    // Check if contribution exists
    const result = await dynamoDb
      .get({
        TableName: process.env.CONTRIBUTIONS_TABLE_NAME!,
        Key: { contributionId },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Contribution not found" }),
      };
    }

    // Delete contribution
    await dynamoDb
      .delete({
        TableName: process.env.CONTRIBUTIONS_TABLE_NAME!,
        Key: { contributionId },
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Contribution deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting contribution:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 