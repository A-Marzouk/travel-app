const request = require('supertest')
const app = require('../src/server')
describe('Location Info', () => {
    it('Should post location data and get back information about this location', async () => {
        const res = await request(app)
            .post('/location-info')
            .send({
                locationInput: 'London',
                dateInput: '08/10/2020',
                endDateInput:'08/11/2020' // one day difference
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.duration).toEqual(1);
    })
})