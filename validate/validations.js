const { errSchema } = require("../lib/responseHandlers");
const { object, string } = require('yup');

const validateDto = (schema) => {
    return (req, res, next) => {
        const info = req.body;
        schema.validate(info).then(() => {
            next()
        }).catch((err) => {
            return res.customSend(errSchema(err.errors))
        })
    }
}

const signUpSchema = object({
    userName:  string().required(),
    password: string().required(),
    firstName: string().required(),
    lastName: string().required(),
});

const loginSchema = object({
    email: string().required(),
    password: string().required()
});

module.exports = { validateDto, signUpSchema, loginSchema }