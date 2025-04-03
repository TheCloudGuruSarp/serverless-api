#!/bin/bash

# Deploy the serverless application to AWS

# Set default environment if not provided
ENV=${1:-dev}

# Validate environment
if [[ "$ENV" != "dev" && "$ENV" != "test" && "$ENV" != "prod" ]]; then
  echo "Error: Environment must be one of: dev, test, prod"
  exit 1
fi

echo "Deploying to $ENV environment..."

# Build the application
echo "Building application..."
sam build || { echo "Build failed"; exit 1; }

# Deploy with appropriate parameters
echo "Deploying application..."
sam deploy \
  --stack-name "serverless-api-$ENV" \
  --parameter-overrides "Environment=$ENV" \
  --capabilities CAPABILITY_IAM \
  --no-fail-on-empty-changeset \
  --s3-bucket "serverless-deployments-$ENV" \
  --s3-prefix "serverless-api-$ENV" \
  --tags "Environment=$ENV" "Project=ServerlessAPI" "Owner=DevOps"

# Get the API endpoint URL
API_URL=$(aws cloudformation describe-stacks \
  --stack-name "serverless-api-$ENV" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

echo "Deployment complete!"
echo "API Endpoint: $API_URL"