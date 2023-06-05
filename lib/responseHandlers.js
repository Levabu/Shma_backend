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
const noMatch = (message) => new ResponseHandler(204, false, message).createResponseFormat();
// bug with noMatch - doesn't send back any content (but it does send back status 204)
const serverError = (err) => new ResponseHandler(500, false, err).createResponseFormat();

module.exports = { validResponse, createdResponse, noMatch, serverError };