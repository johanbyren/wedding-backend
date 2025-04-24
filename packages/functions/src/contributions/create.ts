import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateContributionInput, Contribution } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input: CreateContributionInput = JSON.parse(event.body);
    const now = new Date().toISOString();
    const contributionId = uuidv4();

    const contribution: Contribution = {
      contributionId,
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: process.env.CONTRIBUTIONS_TABLE_NAME!,
        Item: {
          ...contribution,
          isAnonymous: contribution.isAnonymous.toString(), // Convert boolean to string for DynamoDB
        },
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(contribution),
    };
  } catch (error) {
    console.error("Error creating contribution:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 