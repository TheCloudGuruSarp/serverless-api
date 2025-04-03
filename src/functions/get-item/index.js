const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

// Enable X-Ray tracing
const AWSXRay = require('aws-xray-sdk');
const XRayAWS = AWSXRay.captureAWS(AWS);

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Get item ID from path parameters
    const id = event.pathParameters.id;
    
    // Validate ID
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Item ID is required' })
      };
    }
    
    // Get item from DynamoDB
    const result = await dynamoDB.get({
      TableName: tableName,
      Key: { id }
    }).promise();
    
    // Check if item exists
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Item not found' })
      };
    }
    
    // Return item
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not retrieve item' })
    };
  }
};