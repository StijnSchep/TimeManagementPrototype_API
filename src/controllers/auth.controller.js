const logger = require('../config/appconfig').logger
const jwt = require('jsonwebtoken');
const secretkey = require('../assets/variables').secretkey;

module.exports = {
    validateToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res
                .status(401)
                .json({ message: 'No authorization header' })
                .end();
            return;
        }
        let token = authHeader.substring(7, authHeader.length);

        token = refreshToken(token);
        validateToken(token)
            .then(data => {
                req.userid = data.userid;
                req.username = data.username;
                req.token = token;
                next();
            })
            .catch((err) => {
                res
                    .status(401)
                    .json({ message: 'Not a valid auth token' })
                    .end();
                return;
            });
    },
    funcRefreshToken(token) {
        // container function to test refreshToken function
        return refreshToken(token);
    },
    validateTokenEnd: (req, res, next) => {
        res.status(200).json({ token: req.token });
    }
}

const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretkey, (err, payload) => {
            if (err) reject(err);
            resolve(payload);
        });
    });
}

function refreshToken(token) {
    const decode = jwt.decode(token, secretkey)
    if(decode) {
        const exp = decode.exp;
        let todayTime = new Date().getTime();
        let expTime = new Date(exp * 1000).getTime();

        // Token is expired
        if(todayTime - expTime > 60 * 60 * 24 * 1000) {
            // Token has been expired for more than a day
            return token;
        }

        const payload = { 
            username: decode.username, 
            userid: decode.userid
        };

        return jwt.sign(payload, secretkey, {expiresIn: "14d"})
    }

    return token;
}
