# Serverless API with AWS Lambda

A scalable, serverless REST API built with AWS Lambda, API Gateway, and DynamoDB.

## Architecture

This project implements a serverless architecture using AWS Lambda functions for business logic, API Gateway for HTTP request handling, and DynamoDB for data storage.

## Features

- Serverless REST API with AWS Lambda
- API Gateway for request routing and throttling
- DynamoDB for data persistence
- CloudWatch for monitoring and logging
- AWS X-Ray for distributed tracing
- Infrastructure as Code using AWS SAM

## Prerequisites

- AWS CLI configured with appropriate permissions
- AWS SAM CLI installed
- Node.js 14.x or later
- Python 3.8 or later (for some Lambda functions)

## Project Structure

```
├── src/
│   ├── functions/
│   │   ├── create-item/
│   │   ├── get-item/
│   │   ├── list-items/
│   │   └── delete-item/
│   └── layers/
│       └── common/
├── template.yaml
├── tests/
├── docs/
└── scripts/
```

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Start local API
sam local start-api
```

### Deploy to AWS

```bash
# Build the application
sam build

# Deploy to AWS
sam deploy --guided
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /items   | List all items |
| GET    | /items/{id} | Get a specific item |
| POST   | /items   | Create a new item |
| DELETE | /items/{id} | Delete an item |

## Monitoring and Observability

- CloudWatch Logs for Lambda function logs
- CloudWatch Metrics for API Gateway and Lambda metrics
- X-Ray for tracing requests through the system

## Security

- API Gateway authorization with AWS Cognito
- IAM roles with least privilege principle
- Secrets stored in AWS Secrets Manager

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.