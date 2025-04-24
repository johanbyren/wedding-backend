# Wedding Backend

A serverless backend for a wedding platform built with AWS Lambda, API Gateway, and DynamoDB using SST (Serverless Stack).

## Features

- User Management
- Wedding Page Management
- Gift Registry
- Monetary Contributions
- User Settings
- Asset Storage (S3)

## Tech Stack

- TypeScript
- AWS Lambda
- API Gateway
- DynamoDB
- S3
- SST (Serverless Stack)

## Project Structure

```
wedding-backend/
├── packages/
│   └── functions/
│       └── src/
│           ├── users/         # User management
│           ├── weddings/      # Wedding page management
│           ├── gifts/         # Gift registry
│           ├── contributions/ # Monetary contributions
│           └── settings/      # User settings
├── stacks/                    # SST stack definitions
└── sst.config.ts             # SST configuration
```

## Getting Started

### Prerequisites

- Node.js
- AWS CLI configured with appropriate credentials
- SST CLI (`npm install -g sst`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development environment:
   ```bash
   npm run dev
   ```

## API Documentation

### Users

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

#### Get User
```http
GET /users/{userId}
```

#### Update User
```http
PUT /users/{userId}
Content-Type: application/json

{
  "email": "new@example.com",
  "name": "New Name"
}
```

#### Delete User
```http
DELETE /users/{userId}
```

### Weddings

#### Create Wedding
```http
POST /weddings
Content-Type: application/json

{
  "userId": "user-id",
  "title": "Our Wedding",
  "date": "2024-12-31",
  "location": "Venue Name",
  "story": "Our love story...",
  "coverPhotoUrl": "https://...",
  "additionalPhotos": ["url1", "url2"],
  "visibility": "public",
  "customUrl": "our-wedding",
  "theme": "modern",
  "primaryColor": "#FF0000"
}
```

#### Get Wedding
```http
GET /weddings/{weddingId}
```

#### List User's Weddings
```http
GET /weddings/user/{userId}
```

#### Update Wedding
```http
PUT /weddings/{weddingId}
Content-Type: application/json

{
  "title": "Updated Title",
  ...
}
```

#### Delete Wedding
```http
DELETE /weddings/{weddingId}
```

### Gift Registry

#### Create Gift
```http
POST /gifts
Content-Type: application/json

{
  "weddingId": "wedding-id",
  "name": "Gift Name",
  "description": "Gift Description",
  "price": 100,
  "imageUrl": "https://...",
  "status": "available"
}
```

#### Get Gift
```http
GET /gifts/{giftId}
```

#### List Wedding's Gifts
```http
GET /gifts/wedding/{weddingId}
```

#### Update Gift
```http
PUT /gifts/{giftId}
Content-Type: application/json

{
  "name": "Updated Name",
  ...
}
```

#### Delete Gift
```http
DELETE /gifts/{giftId}
```

### Contributions

#### Create Contribution
```http
POST /contributions
Content-Type: application/json

{
  "weddingId": "wedding-id",
  "userId": "user-id",
  "amount": 100,
  "message": "Congratulations!",
  "isAnonymous": false
}
```

#### Get Contribution
```http
GET /contributions/{contributionId}
```

#### List Wedding's Contributions
```http
GET /contributions/wedding/{weddingId}
```

#### List User's Contributions
```http
GET /contributions/user/{userId}
```

#### Update Contribution
```http
PUT /contributions/{contributionId}
Content-Type: application/json

{
  "amount": 150,
  "message": "Updated message"
}
```

#### Delete Contribution
```http
DELETE /contributions/{contributionId}
```

### Settings

#### Get Settings
```http
GET /settings/{userId}
```

#### Update Settings
```http
PUT /settings/{userId}
Content-Type: application/json

{
  "pageVisibility": "public",
  "customUrl": "my-wedding",
  "theme": "modern",
  "primaryColor": "#FF0000",
  "paymentMethod": "stripe",
  "accountEmail": "payment@example.com",
  "notifyOnContribution": true,
  "autoThankYou": true,
  "emailNotifications": true,
  "contributionAlerts": true,
  "weeklyDigest": true,
  "marketingEmails": false,
  "showContributorNames": true,
  "showContributionAmounts": true,
  "allowGuestComments": true,
  "showRegistry": true
}
```

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Deploying
```bash
npm run deploy
```

## License

This project is licensed under the MIT License. 