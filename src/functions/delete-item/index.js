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
    
    // Check if item exists before deleting
    const getResult = await dynamoDB.get({
      TableName: tableName,
      Key: { id }
    }).promise();
    
    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Item not found' })
      };
    }
    
    // Delete item from DynamoDB
    await dynamoDB.delete({
      TableName: tableName,
      Key: { id }
    }).promise();
    
    // Return success response
    return {
      statusCode: 204,
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not delete item' })
    };
  }
};