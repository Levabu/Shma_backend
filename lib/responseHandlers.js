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
const noMatch = (message) => new ResponseHandler(403, false, message).createResponseFormat();
const userConflictErr = () => new ResponseHandler(409, false, "There is already an account with this user name - if this is you then login. If not, then please choose a different user name!").createResponseFormat();
const errSchema = (message) => new ResponseHandler(422, false, message).createResponseFormat();
const serverError = (err) => new ResponseHandler(500, false, err).createResponseFormat();

module.exports = { validResponse, createdResponse, noMatch, userConflictErr, errSchema, serverError };