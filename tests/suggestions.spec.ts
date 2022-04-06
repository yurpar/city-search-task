import { MongoMemoryServer } from 'mongodb-memory-server';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { Connection } from "mongoose";

import { app } from '../src/app'
import { connectDb } from "../src/db";
import CityModel from "../src/models/city";

const { testCities } = require('./testCities')

const { expect } = chai;
let mongod: MongoMemoryServer;
let connection: Connection;

const server = app;


chai.use(chaiHttp)
chai.should();

describe('Suggestions', () => {

    before(async () => {
        let uri;
        if (process.env.NODE_ENV === 'test') {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
        }
        connection = await connectDb(uri)

        await CityModel.insertMany(testCities)
    })

    after(async () => {
        if (mongod) {
            await mongod.stop()
        }
        connection.close()
    })

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
                    const cityJson = JSON.stringify(city, null, 2)

                    city.should.have.property('name').that.is.a('string', cityJson)
                    city.should.have.property('latitude').that.is.a('number', cityJson)
                    city.should.have.property('longitude').that.is.a('number', cityJson)
                    city.should.have.property('distance').that.is.a('number', cityJson).and.lte(radius)
                    done();
                });
        })

        describe('Check IP limits', () => {
            it('should return 1st OK response', (done) => {
                chai.request(server)
                    .get('/suggestions')
                    .set({ 'X-Client-IP': '127.1.1.1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('suggestions').with.lengthOf(0);
                        done();
                    });
            })
            it('should return 2nd OK response', (done) => {
                chai.request(server)
                    .get('/suggestions')
                    .set({ 'X-Client-IP': '127.1.1.1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('suggestions').with.lengthOf(0);
                        done();
                    });
            })
            it('should return 3rd OK response', (done) => {
                chai.request(server)
                    .get('/suggestions')
                    .set({ 'X-Client-IP': '127.1.1.1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('suggestions').with.lengthOf(0);
                        done();
                    });
            })

            it('should return 4th OK response ', (done) => {
                chai.request(server)
                    .get('/suggestions')
                    .set({ 'X-Client-IP': '127.1.1.1' })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('suggestions').with.lengthOf(0);
                        done();
                    });
            })

            it('should limit ip with "Too Many Requests" error', (done) => {
                chai.request(server)
                    .get('/suggestions')
                    .set({ 'X-Client-IP': '127.1.1.1' })
                    .end((err, res) => {
                        res.should.have.status(429);
                        done();
                    });
            })
        })
    })
})
