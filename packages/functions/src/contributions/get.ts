import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Contribution } from "./types";

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

    const dynamoContribution = result.Item as DynamoDBContribution;
    const contribution: Contribution = {
      ...dynamoContribution,
      isAnonymous: dynamoContribution.isAnonymous === "true",
    };

    return {
      statusCode: 200,
      body: JSON.stringify(contribution),
    };
  } catch (error) {
    console.error("Error getting contribution:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 