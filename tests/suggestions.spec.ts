import 'mocha';
import * as chai from 'chai';

import chaiHttp = require('chai-http');

import { app } from '../src/app'
import { expect } from "chai";
import { connectDb } from "../src/main";

before(connectDb)

const server = app;


chai.use(chaiHttp)
chai.should();

describe('Suggestions', () => {
    describe('GET /suggestions', () => {
        it('should return empty list', (done) => {
            chai.request(server)
                .get('/suggestions')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('suggestions').with.lengthOf(0);
                    done();
                });
        })

        it('should return a list of suggestions', (done) => {
            const radius = 700;
            chai.request(server)
                .get('/suggestions')
                .query({
                    q: 'Londo',
                    latitude: 43.70011,
                    longitude: -79.4163,
                    radius: 700,
                    sort: 'distance',
                })
                .end((err, res) => {
                    expect(res).have.status(200);
                    expect(res.body).have.property('suggestions').that.is.not.empty;
                    expect(res.body.suggestions).have.lengthOf(4);
                    const city = res.body.suggestions[0]
                    city.should.have.property('name').that.is.a('string')
                    city.should.have.property('latitude').that.is.a('number')
                    city.should.have.property('longitude').that.is.a('number')
                    city.should.have.property('distance').that.is.a('number').and.lte(radius)
                    done();
                });
        }).timeout('10s')
    })
})
