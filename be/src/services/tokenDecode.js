const jwt = require('jsonwebtoken');

module.exports = {
    decodeToken: (token) => {
        function decode(token) {
            const decode = jwt.decode(token);
            return decode
        }
        return decode(token);
    }
}
