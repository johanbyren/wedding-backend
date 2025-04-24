import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Settings, SettingsResponse } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

const convertStringToBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') return value;
  return value === 'true';
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = event.pathParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }

    const result = await dynamoDb
      .get({
        TableName: process.env.SETTINGS_TABLE_NAME!,
        Key: { userId },
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Settings not found" }),
      };
    }

    const settings = result.Item as Settings;
    
    // Convert string boolean values to actual booleans
    const convertedSettings: SettingsResponse = {
      ...settings,
      notifyOnContribution: convertStringToBoolean(settings.notifyOnContribution),
      autoThankYou: convertStringToBoolean(settings.autoThankYou),
      emailNotifications: convertStringToBoolean(settings.emailNotifications),
      contributionAlerts: convertStringToBoolean(settings.contributionAlerts),
      weeklyDigest: convertStringToBoolean(settings.weeklyDigest),
      marketingEmails: convertStringToBoolean(settings.marketingEmails),
      showContributorNames: convertStringToBoolean(settings.showContributorNames),
      showContributionAmounts: convertStringToBoolean(settings.showContributionAmounts),
      allowGuestComments: convertStringToBoolean(settings.allowGuestComments),
      showRegistry: convertStringToBoolean(settings.showRegistry),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(convertedSettings),
    };
  } catch (error) {
    console.error("Error getting settings:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 