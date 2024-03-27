const Joi = require('joi');

exports.email = function (req, res, next) {
    const { email } = req.body;
    // console.log("email",req.body.email);
    const emailSchema = Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] }})
    .messages({
        "string.base": "Email Must Be A String",
        "string.email": "Invalid Email Format",
        "any.required": "Required field: Email",
        "string.empty": "Email Cannot be Empty"
    });
    const { error } = emailSchema.validate(email); 

    if (error) {
        return res.status(400).json({
            message: error.message,
        });
    };
    next();
};
exports.password = function (req, res, next) {
    const { password } = req.body;

    const passwordSchema = Joi.string()
    .required()
    .messages({
        "string.empty": "Password Cannot Be A Empty",
        "any.required" : "Required feild : Password"
    });
    const { error } = passwordSchema.validate(password);

    if(error) {
        return res.status(400).json({
            message : error.message,
        })
    }
    next();
}
// exports.username = function (req, res, next) {
//     const { username } = req.body;

//     const usernameSchema = Joi.string()
//     .required()
//     .messages({
//         "string.empty" : "User Name Cannot Be A Empty",
//         "any.required" : "Required feild : UserName"
//     });
//     const { error } = usernameSchema.validate(username);

//     if(error) {
//         return res.status(400).json({
//             message : error.message
//         })
//     };
//     next();
// }
// exports.confirmpassword = function (req, res, next) {
//     const { confirmpassword } = req.body;

//     const confirmpasswordSchema = Joi.string()
//     .required()
//     .messages({
//         "string.empty" : "ConfirmPassword Cannot Be A Empty",
//         "any.required" : "Required feild : ConfirmPassword"
//     });
//     const { error } = confirmpasswordSchema.validate(confirmpassword);

//     if(error) {
//         return res.status(400).json({
//             message : error.message
//         })
//     }
// }