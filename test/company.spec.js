const chai = require('chai');
const expect = chai.expect;
const requester = require('../test/config/requester.test');
const constants = require('../src/config/constants');
const database = require('../src/database/mysql.dao');
const bcrypt = require('bcryptjs');

describe("Company endpoint tests", () => {
    beforeEach((done) => {
        const query =
            `INSERT INTO \`fjQh5Ejw6Y\`.\`Company\`
                (\`Name\`,
                \`Domain\`)
            VALUES
                ('Avans',
                '.avans.nl');`;

        database.executeQuery(query, (err, rows) => {
            if (err) {
                console.log('providing data in tables failed: ');
            }
            if (rows) {
                console.log('tables are filled');
            }
            done();
        })
    });

    it('GET /api/company/domains should return an array of all the Domain names', async () => {
        const result = await requester.get('/api/company/domains');

        expect(result).to.have.status(200);
        expect(result.body).to.have.property('result');
        expect(result.body.result).to.be.an('array');
        expect(result.body.result[0]).to.have.property('Domain').equal('.avans.nl');
        expect(result.body).to.not.have.property('token');
    });
})
