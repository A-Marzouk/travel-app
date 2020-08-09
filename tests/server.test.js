const request = require('supertest')
const app = require('../src/server')
describe('Homepage', () => {
    it('Should get homepage', async () => {
        const res = await request(app)
            .get('/');
        expect(res.statusCode).toEqual(200);
    })
})