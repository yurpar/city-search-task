import 'mocha';
import * as chai from 'chai';

import chaiHttp = require('chai-http');

import { app } from '../src/app'

const server = app;

chai.use(chaiHttp)
chai.should();

describe('Suggestions', () => {
    describe('GET /suggestions', () => {
        it('should return empty list', (done) => {
            chai.request(server)
                .get('/suggestions')
                .end((err, res) => {
                    console.log({ body: res.body})
                    res.should.have.status(200);
                    res.body.should.have.property('suggestions').with.lengthOf(0);
                    done();
                });
        })
    })
})
