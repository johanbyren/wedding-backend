import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { Settings, UpdateSettingsInput } from "./types";

const dynamoDb = new DynamoDB.DocumentClient();

const convertBooleanToString = (value: boolean | string): string => {
  if (typeof value === 'string') return value;
  return value ? 'true' : 'false';
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = event.pathParameters?.userId;
    const body = event.body ? JSON.parse(event.body) : null;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User ID is required" }),
      };
    }

    if (!body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const input = body as UpdateSettingsInput;

    // Get current settings
    const currentResult = await dynamoDb
      .get({
        TableName: process.env.SETTINGS_TABLE_NAME!,
        Key: { userId },
      })
      .promise();

    if (!currentResult.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Settings not found" }),
      };
    }

    const currentSettings = currentResult.Item as Settings;
    
    // Convert boolean values to strings for DynamoDB
    const updatedSettings: Settings = {
      ...currentSettings,
      ...input,
      notifyOnContribution: convertBooleanToString(input.notifyOnContribution ?? currentSettings.notifyOnContribution),
      autoThankYou: convertBooleanToString(input.autoThankYou ?? currentSettings.autoThankYou),
      emailNotifications: convertBooleanToString(input.emailNotifications ?? currentSettings.emailNotifications),
      contributionAlerts: convertBooleanToString(input.contributionAlerts ?? currentSettings.contributionAlerts),
      weeklyDigest: convertBooleanToString(input.weeklyDigest ?? currentSettings.weeklyDigest),
      marketingEmails: convertBooleanToString(input.marketingEmails ?? currentSettings.marketingEmails),
      showContributorNames: convertBooleanToString(input.showContributorNames ?? currentSettings.showContributorNames),
      showContributionAmounts: convertBooleanToString(input.showContributionAmounts ?? currentSettings.showContributionAmounts),
      allowGuestComments: convertBooleanToString(input.allowGuestComments ?? currentSettings.allowGuestComments),
      showRegistry: convertBooleanToString(input.showRegistry ?? currentSettings.showRegistry),
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb
      .put({
        TableName: process.env.SETTINGS_TABLE_NAME!,
        Item: updatedSettings,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(updatedSettings),
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}; 