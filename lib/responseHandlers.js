class ResponseHandler {
    constructor(status, success, data) {
        this.status = status;
        this.success = success;
        this.data = data;
    }
    createResponseFormat = () => {
        return {
            status: this.status,
            payload: {
                success: this.success,
                [this.success ? 'data' : 'message']: this.data
            }
        }
    }    
}

const validResponse = (data) => new ResponseHandler(200, true, data).createResponseFormat();
const createdResponse = (value) => new ResponseHandler(201, true, value).createResponseFormat();
const missingParams = (message) => new ResponseHandler(400, false, message).createResponseFormat();
const noMatch = (message) => new ResponseHandler(403, false, message).createResponseFormat();
const invalidUserName = (message) => new ResponseHandler(409, false, message).createResponseFormat();
const errSchema = (message) => new ResponseHandler(422, false, message).createResponseFormat();
const serverError = (err) => new ResponseHandler(500, false, err).createResponseFormat();

module.exports = { validResponse, createdResponse, missingParams, noMatch, invalidUserName, errSchema, serverError };