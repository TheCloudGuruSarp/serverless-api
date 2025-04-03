const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

// Enable X-Ray tracing
const AWSXRay = require('aws-xray-sdk');
const XRayAWS = AWSXRay.captureAWS(AWS);

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    // Parse request body
    const requestBody = JSON.parse(event.body);
    
    // Validate request
    if (!requestBody.name) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name is required' })
      };
    }
    
    // Create item object
    const timestamp = new Date().toISOString();
    const item = {
      id: uuidv4(),
      name: requestBody.name,
      description: requestBody.description || '',
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    // Save to DynamoDB
    await dynamoDB.put({
      TableName: tableName,
      Item: item
    }).promise();
    
    // Return success response
    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Could not create item' })
    };
  }
};