const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

// Enable X-Ray tracing
const AWSXRay = require('aws-xray-sdk');
const XRayAWS = AWSXRay.captureAWS(AWS);

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 50;
    const lastEvaluatedKey = queryParams.nextToken 
      ? JSON.parse(Buffer.from(queryParams.nextToken, 'base64').toString()) 
      : undefined;
    
    // Query parameters for DynamoDB
    const params = {
      TableName: tableName,
      Limit: limit
    };
    
    // Add pagination token if provided
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }
    
    // Get items from DynamoDB
    const result = await dynamoDB.scan(params).promise();
    
    // Prepare response
    const response = {
      items: result.Items,
      count: result.Count
    };
    
    // Add pagination token if more results exist
    if (result.LastEvaluatedKey) {
      response.nextToken = Buffer.from(
        JSON.stringify(result.LastEvaluatedKey)
      ).toString('base64');
    }
    
    // Return items
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not list items' })
    };
  }
};