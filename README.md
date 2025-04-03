# Serverless API with AWS Lambda

A highly scalable, event-driven REST API architecture implemented using AWS Lambda, API Gateway, and DynamoDB, designed for optimal performance and cost efficiency.

## ✨ Developed by Sarper ✨

---

![DevOps Pipeline](https://img.shields.io/badge/DevOps-Pipeline-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-brightgreen)
![Terraform](https://img.shields.io/badge/Infrastructure-Terraform-purple)
![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus-orange)

## Architecture

This project implements a sophisticated serverless architecture following event-driven design principles. It utilizes AWS Lambda functions for stateless business logic processing, API Gateway for secure HTTP request handling with throttling capabilities, and DynamoDB for highly available, low-latency data persistence with automatic scaling.

## Features

- Fully serverless REST API implementation with AWS Lambda for compute workloads
- API Gateway with custom domain, request validation, and intelligent throttling mechanisms
- DynamoDB with on-demand capacity mode and global secondary indexes for efficient queries
- Comprehensive observability through CloudWatch metrics, logs, and custom dashboards
- End-to-end distributed tracing with AWS X-Ray for performance optimization
- Infrastructure as Code using AWS SAM templates with cross-stack references
- Automated CI/CD pipeline for continuous deployment and testing

## Prerequisites

- AWS CLI (v2.0+) configured with appropriate IAM permissions for resource creation
- AWS SAM CLI (v1.33.0+) installed for local development and deployment
- Node.js 14.x or later for JavaScript/TypeScript Lambda functions
- Python 3.8 or later for Python-based Lambda functions
- Docker installed locally for testing Lambda functions in containers
- jq utility for JSON processing in deployment scripts

## Project Structure

```
├── src/
│   ├── functions/                 # Lambda function implementations
│   │   ├── create-item/           # POST /items endpoint handler
│   │   ├── get-item/              # GET /items/{id} endpoint handler
│   │   ├── list-items/            # GET /items endpoint handler
│   │   ├── update-item/           # PUT /items/{id} endpoint handler
│   │   └── delete-item/           # DELETE /items/{id} endpoint handler
│   ├── layers/                    # Shared Lambda layers
│   │   ├── common-utils/          # Utility functions and middleware
│   │   └── data-access/           # Database access patterns
│   └── models/                    # Data models and validation schemas
├── template.yaml                  # SAM template for AWS resources
├── tests/                         # Test suite
│   ├── unit/                      # Unit tests for functions
│   └── integration/               # API integration tests
├── docs/                          # API documentation
│   ├── api-spec.yaml              # OpenAPI specification
│   └── architecture-diagram.png   # System architecture diagram
└── scripts/                       # Deployment and utility scripts
    ├── deploy.sh                  # Deployment automation
    └── seed-data.js               # Database seeding script
```

## Deployment

### Local Development Environment

```bash
# Install dependencies for all functions
npm run install:all

# Run unit tests
npm test

# Start local API for development (with hot-reloading)
sam local start-api --warm-containers EAGER

# Invoke a specific function locally
sam local invoke GetItemFunction --event events/get-item.json
```

### Deployment to AWS Environments

```bash
# Build the application with optimized settings
sam build --use-container --parallel

# Run the deployment validation tests
npm run test:deployment-validation

# Deploy to development environment
./scripts/deploy.sh dev

# Deploy to production environment with specific parameters
./scripts/deploy.sh prod --parameter-overrides "EnvironmentType=production ApiDomainName=api.example.com"
```

## API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | /items   | Retrieve a paginated list of items with optional filtering | API Key |
| GET    | /items/{id} | Retrieve a specific item by its unique identifier | API Key |
| POST   | /items   | Create a new item with validation | JWT Token |
| PUT    | /items/{id} | Update an existing item with validation | JWT Token |
| DELETE | /items/{id} | Remove an item from the database | JWT Token |
| GET    | /health  | System health check and status | None |
| GET    | /metrics | Operational metrics for monitoring | Internal API Key |

## Monitoring and Observability

The solution implements a comprehensive observability strategy with multiple layers:

- **Logging**: Structured JSON logs in CloudWatch Logs with correlation IDs for request tracking
- **Metrics**: Custom CloudWatch metrics with dimensions for business and technical KPIs
- **Dashboards**: Pre-configured CloudWatch dashboards for real-time system monitoring
- **Alerting**: CloudWatch Alarms configured for critical thresholds with SNS notifications
- **Tracing**: End-to-end distributed tracing with AWS X-Ray for performance analysis
- **Error Tracking**: Centralized error aggregation with automatic notification workflows

## Security

The API implements a defense-in-depth security approach:

- **Authentication**: Multi-tier authentication using API keys for public endpoints and JWT tokens (via Amazon Cognito) for privileged operations
- **Authorization**: Fine-grained access control with custom authorizers and resource-based policies
- **Data Protection**: Encryption in transit (TLS 1.3) and at rest (AWS KMS) for all sensitive data
- **Identity Management**: Integration with Amazon Cognito User Pools for identity federation
- **Least Privilege**: Granular IAM roles following the principle of least privilege for all components
- **Secret Management**: Secure storage of credentials and secrets in AWS Secrets Manager with automatic rotation
- **Input Validation**: Request validation using JSON Schema at the API Gateway level
- **Rate Limiting**: Throttling and quota mechanisms to prevent abuse and DoS attacks

## Contributing

We welcome contributions to enhance this serverless API solution. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-capability`)
3. Implement your changes with appropriate tests
4. Ensure all tests pass (`npm test`)
5. Update documentation as needed
6. Commit your changes following conventional commit format
7. Push to your branch (`git push origin feature/new-capability`)
8. Create a Pull Request with a comprehensive description

Please review our contribution guidelines in the CONTRIBUTING.md file for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.