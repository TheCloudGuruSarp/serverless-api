/**
 * Common utility functions for Lambda handlers
 */

/**
 * Creates a standardized API response
 * 
 * @param {number} statusCode - HTTP status code
 * @param {object|string} body - Response body
 * @param {object} headers - Additional headers
 * @returns {object} - API Gateway response object
 */
const createResponse = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
};

/**
 * Parses and validates event body
 * 
 * @param {object} event - Lambda event
 * @param {object} schema - Joi schema for validation
 * @returns {object} - Parsed and validated body or error
 */
const parseBody = (event, schema = null) => {
  try {
    const body = JSON.parse(event.body || '{}');
    
    if (schema) {
      const { error, value } = schema.validate(body);
      if (error) {
        return { error: error.details[0].message };
      }
      return { body: value };
    }
    
    return { body };
  } catch (error) {
    return { error: 'Invalid request body' };
  }
};

/**
 * Handles common errors in Lambda functions
 * 
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message
 * @returns {object} - Standardized error response
 */
const handleError = (error, defaultMessage = 'An error occurred') => {
  console.error('Error:', error);
  
  // Check for specific error types
  if (error.name === 'ValidationError') {
    return createResponse(400, { error: error.message });
  }
  
  if (error.name === 'ConditionalCheckFailedException') {
    return createResponse(404, { error: 'Resource not found' });
  }
  
  if (error.name === 'ResourceNotFoundException') {
    return createResponse(404, { error: 'Resource not found' });
  }
  
  // Default server error
  return createResponse(500, { error: defaultMessage });
};

module.exports = {
  createResponse,
  parseBody,
  handleError
};