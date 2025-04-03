const { expect } = require('chai');
const sinon = require('sinon');
const AWS = require('aws-sdk');
const { handler } = require('../src/functions/create-item/index');

describe('Create Item Lambda Function', () => {
  let dynamoDbStub;
  
  beforeEach(() => {
    // Mock DynamoDB
    dynamoDbStub = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'put');
    dynamoDbStub.returns({
      promise: sinon.stub().resolves({})
    });
    
    // Set environment variables
    process.env.TABLE_NAME = 'test-items';
  });
  
  afterEach(() => {
    // Restore stubs
    dynamoDbStub.restore();
  });
  
  it('should create an item successfully', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        name: 'Test Item',
        description: 'This is a test item'
      })
    };
    
    // Act
    const response = await handler(event);
    const body = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).to.equal(201);
    expect(body).to.have.property('id');
    expect(body.name).to.equal('Test Item');
    expect(body.description).to.equal('This is a test item');
    expect(body).to.have.property('createdAt');
    expect(body).to.have.property('updatedAt');
    
    // Verify DynamoDB was called correctly
    expect(dynamoDbStub.calledOnce).to.be.true;
    const putParams = dynamoDbStub.firstCall.args[0];
    expect(putParams.TableName).to.equal('test-items');
    expect(putParams.Item.name).to.equal('Test Item');
  });
  
  it('should return 400 when name is missing', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        description: 'This is a test item without a name'
      })
    };
    
    // Act
    const response = await handler(event);
    const body = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).to.equal(400);
    expect(body.error).to.equal('Name is required');
    
    // Verify DynamoDB was not called
    expect(dynamoDbStub.called).to.be.false;
  });
  
  it('should return 500 when DynamoDB fails', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        name: 'Test Item',
        description: 'This is a test item'
      })
    };
    
    // Make DynamoDB throw an error
    dynamoDbStub.returns({
      promise: sinon.stub().rejects(new Error('DynamoDB error'))
    });
    
    // Act
    const response = await handler(event);
    const body = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).to.equal(500);
    expect(body.error).to.equal('Could not create item');
  });
});