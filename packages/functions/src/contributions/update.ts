import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { UpdateContributionInput, Contribution } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

interface DynamoDBContribution extends Omit<Contribution, "isAnonymous"> {
  isAnonymous: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const contributionId = event.pathParameters?.contributionId;

    if (!contributionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Contribution ID is required" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: UpdateContributionInput = JSON.parse(event.body);

    // Get current contribution
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

    const currentContribution = result.Item as DynamoDBContribution;
    const updatedContribution: DynamoDBContribution = {
      ...currentContribution,
      ...input,
      isAnonymous: input.isAnonymous?.toString() ?? currentContribution.isAnonymous,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: process.env.CONTRIBUTIONS_TABLE_NAME!,
        Item: updatedContribution,
      })
      .promise();

    const responseContribution: Contribution = {
      ...updatedContribution,
      isAnonymous: updatedContribution.isAnonymous === "true",
    };

    return {
      statusCode: 200,
      body: JSON.stringify(responseContribution),
    };
  } catch (error) {
    console.error("Error updating contribution:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 