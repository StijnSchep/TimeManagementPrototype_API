const jwt = require('jsonwebtoken');
const chai = require('chai');
const expect = chai.expect;
const requester = require('../test/config/requester.test');
const authController = require('../src/controllers/auth.controller');

describe('Refresh token', function() {
    let activeToken;

    let extendableToken;

    let expiredToken;
    let expiredIat

    beforeEach(async function() {
        const payload = { 
            username: 'user', 
            userid: 1
        };

        activeToken = jwt.sign(payload, "secret", { expiresIn: "3d" });

        payload.iat = Math.floor(new Date().getTime() / 1000) - (60 * 60 * 24 * 3) - 60 * 60;
        extendableToken = jwt.sign(payload, "secret", { expiresIn: "3d" })

        payload.iat = Math.floor(new Date().getTime() / 1000) - (60 * 60 * 24 * 4) - 60 * 60;
        expiredIat = payload.iat
        expiredToken = jwt.sign(payload, "secret", { expiresIn: "3d" })
    })

    it('should return a new token when token is extendable', function() {
        const token = authController.funcRefreshToken(extendableToken);
        const decoded = jwt.decode(token, "secret");

        expect(decoded).to.exist;
        expect(token).to.not.equal(extendableToken);

        // Token time should now be 14 days
        expect(decoded.exp - decoded.iat).to.equal(60 * 60 * 24 * 14)
    })

    it('should return the same token if token cannot be extended', function() {
        const token = authController.funcRefreshToken(expiredToken);
        const decoded = jwt.decode(token, "secret");

        expect(decoded).to.exist;
        expect(token).to.equal(expiredToken);

        // Token time should still be 3 days
        expect(decoded.exp - decoded.iat).to.equal(60 * 60 * 24 * 3);
        expect(decoded.iat).to.equal(expiredIat);
    })

    it('should return new token when validating the token through endpoint', async () => {
        const resValidate = await requester.get('/api/auth/validateToken').set("Authorization", `Bearer ${activeToken}`);

        const token = resValidate.body.token;
        const decoded = jwt.decode(token, 'secret');

        expect(decoded).to.exist;
        expect(token).to.not.equal(activeToken);
    });

    it('should return 401 when auth header is missing', async () => {
        const resValidate = await requester.get('/api/auth/validateToken');

        expect(resValidate).to.have.status(401);
        expect(resValidate.body).to.have.property(
            'message',
            'No authorization header'
        );
    })

    it('should return 401 if token cannot be extended through endpoint', async () => {
        const resValidate = await requester.get('/api/auth/validateToken').set("Authorization", `Bearer ${expiredToken}`);

        expect(resValidate).to.have.status(401);
        expect(resValidate.body).to.have.property(
            'message',
            'Not a valid auth token'
        );
    })

})
