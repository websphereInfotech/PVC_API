const { email, password, username } = require("./validation")

module.exports.validation = function(method) {
    switch (method) {
        case "usersignup": 
            return [ email,password ]
        case "userLogin" :
            return [ email, password ]
        default :
        throw new Error('Invalid validation method')
    }
}