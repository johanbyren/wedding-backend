import { StackContext, Table, Bucket, Api } from "sst/constructs";

export function WeddingStack({ stack }: StackContext) {
  // Create Users table
  const usersTable = new Table(stack, "UsersTable", {
    fields: {
      userId: "string",
      email: "string",
      name: "string",
      createdAt: "string",
      updatedAt: "string",
      emailIndex: "string"
    },
    primaryIndex: { partitionKey: "userId" },
    globalIndexes: {
      emailIndex: { partitionKey: "emailIndex" }
    }
  });

  // Create Weddings table
  const weddingsTable = new Table(stack, "WeddingsTable", {
    fields: {
      weddingId: "string",
      userId: "string",
      title: "string",
      date: "string",
      location: "string",
      story: "string",
      coverPhotoUrl: "string",
      additionalPhotos: "string",
      visibility: "string",
      customUrl: "string",
      theme: "string",
      primaryColor: "string",
      createdAt: "string",
      updatedAt: "string"
    },
    primaryIndex: { partitionKey: "weddingId" },
    globalIndexes: {
      userIdIndex: { partitionKey: "userId" }
    }
  });

  // Create Gift Registry table
  const giftRegistryTable = new Table(stack, "GiftRegistryTable", {
    fields: {
      giftId: "string",
      weddingId: "string",
      name: "string",
      description: "string",
      price: "number",
      imageUrl: "string",
      status: "string",
      createdAt: "string",
      updatedAt: "string"
    },
    primaryIndex: { partitionKey: "giftId" },
    globalIndexes: {
      weddingIdIndex: { partitionKey: "weddingId" }
    }
  });

  // Create Contributions table
  const contributionsTable = new Table(stack, "ContributionsTable", {
    fields: {
      contributionId: "string",
      weddingId: "string",
      userId: "string",
      amount: "number",
      message: "string",
      isAnonymous: "string",
      createdAt: "string",
      updatedAt: "string"
    },
    primaryIndex: { partitionKey: "contributionId" },
    globalIndexes: {
      weddingIdIndex: { partitionKey: "weddingId" },
      userIdIndex: { partitionKey: "userId" }
    }
  });

  // Create Settings table
  const settingsTable = new Table(stack, "SettingsTable", {
    fields: {
      userId: "string",
      name: "string",
      email: "string",
      
      // Wedding Page Settings
      pageVisibility: "string",
      customUrl: "string",
      theme: "string",
      primaryColor: "string",
      
      // Payment Settings
      paymentMethod: "string",
      accountEmail: "string",
      notifyOnContribution: "string",
      autoThankYou: "string",
      
      // Notification Settings
      emailNotifications: "string",
      contributionAlerts: "string",
      weeklyDigest: "string",
      marketingEmails: "string",
      
      // Privacy Settings
      showContributorNames: "string",
      showContributionAmounts: "string",
      allowGuestComments: "string",
      showRegistry: "string",
      
      createdAt: "string",
      updatedAt: "string"
    },
    primaryIndex: { partitionKey: "userId" }
  });

  // Create S3 bucket for storing wedding assets
  const bucket = new Bucket(stack, "WeddingAssets", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
  });

  // Create API Gateway with Lambda functions
  const api = new Api(stack, "WeddingApi", {
    defaults: {
      function: {
        bind: [usersTable, weddingsTable, giftRegistryTable, contributionsTable, settingsTable, bucket],
        environment: {
          USERS_TABLE_NAME: usersTable.tableName,
          WEDDINGS_TABLE_NAME: weddingsTable.tableName,
          GIFT_REGISTRY_TABLE_NAME: giftRegistryTable.tableName,
          CONTRIBUTIONS_TABLE_NAME: contributionsTable.tableName,
          SETTINGS_TABLE_NAME: settingsTable.tableName,
          BUCKET_NAME: bucket.bucketName,
        },
      },
    },
    routes: {
      // User routes
      "POST /users": "packages/functions/src/users/create.handler",
      "GET /users/{userId}": "packages/functions/src/users/get.handler",
      "PUT /users/{userId}": "packages/functions/src/users/update.handler",
      "DELETE /users/{userId}": "packages/functions/src/users/delete.handler",
      
      // Wedding routes
      "POST /weddings": "packages/functions/src/weddings/create.handler",
      "GET /weddings/{weddingId}": "packages/functions/src/weddings/get.handler",
      "GET /weddings/user/{userId}": "packages/functions/src/weddings/listByUser.handler",
      "PUT /weddings/{weddingId}": "packages/functions/src/weddings/update.handler",
      "DELETE /weddings/{weddingId}": "packages/functions/src/weddings/delete.handler",
      
      // Gift registry routes
      "POST /gifts": "packages/functions/src/gifts/create.handler",
      "GET /gifts/{giftId}": "packages/functions/src/gifts/get.handler",
      "GET /gifts/wedding/{weddingId}": "packages/functions/src/gifts/listByWedding.handler",
      "PUT /gifts/{giftId}": "packages/functions/src/gifts/update.handler",
      "DELETE /gifts/{giftId}": "packages/functions/src/gifts/delete.handler",

      // Contribution routes
      "POST /contributions": "packages/functions/src/contributions/create.handler",
      "GET /contributions/{contributionId}": "packages/functions/src/contributions/get.handler",
      "GET /contributions/wedding/{weddingId}": "packages/functions/src/contributions/listByWedding.handler",
      "GET /contributions/user/{userId}": "packages/functions/src/contributions/listByUser.handler",
      "PUT /contributions/{contributionId}": "packages/functions/src/contributions/update.handler",
      "DELETE /contributions/{contributionId}": "packages/functions/src/contributions/delete.handler",

      // Settings routes
      "GET /settings/{userId}": "packages/functions/src/settings/get.handler",
      "PUT /settings/{userId}": "packages/functions/src/settings/update.handler",
    },
  });

  // Output the API endpoint
  stack.addOutputs({
    ApiEndpoint: api.url,
    UsersTableName: usersTable.tableName,
    WeddingsTableName: weddingsTable.tableName,
    GiftRegistryTableName: giftRegistryTable.tableName,
    ContributionsTableName: contributionsTable.tableName,
    SettingsTableName: settingsTable.tableName,
  });
} 