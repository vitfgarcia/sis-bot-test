const mongoose = require('mongoose');
const axios = require('axios');

const server = require('../../src/server');
const Bot = require('../../src/models/Bot');

const {
    PORT,
    DB_CONNECTION
} = process.env;

describe('/bots integration tests', () => {
    const endpoint = `http://localhost:${PORT}/bots`;

    let api;
    beforeAll(async done => {
        await mongoose.connect(DB_CONNECTION, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        await Bot.deleteMany({});

        api = server.listen(PORT, done);
    });

    afterAll(async done => {
        await Bot.deleteMany({});
        await mongoose.connection.close();

        if (!api) {
            return done();
        }

        api.close(done);
    });

    describe('POST /bots', () => {
        afterAll(async done => {
            await Bot.deleteMany({});
            done();
        });

        test('Should create a bot with success', async () => {
            const bot = {
                id: '36b9f842-ee97-11e8-9443-0242ac120002',
                name: 'bot de teste'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(`${endpoint}`, bot, params);

            expect(response.status).toEqual(201);
            expect(response.data).toEqual(expect.objectContaining(bot));
        });

        test('Should respond with error when try to create a bot without required fields', async () => {
            const bot = {
                id: '36b9f842-ee97-11e8-9443-0242ac120002'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            };

            try {
                await axios.post(endpoint, bot, params);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.response.status).toEqual(400);
                expect(err.response.data.message).toEqual(expect.stringContaining('Bot name is required'));
            }
        });
    });

    describe('GET /bots/:id', () => {
        let bot;

        afterAll(async done => {
            await Bot.deleteMany({});
            done();
        });

        beforeAll(async done => {
            bot = {
                _id: '36b9f842-ee97-11e8-9443-0242ac120002',
                name: 'bot de teste'
            };

            await new Bot(bot).save();
            done();
        });

        test('Should return the bot for a valid id', async () => {
            const url = `${endpoint}/${bot._id}`;
            const expectedBot = { id: bot._id, name: bot.name };

            const response = await axios.get(url);

            expect(response.status).toEqual(200);
            expect(response.data).toMatchObject(expectedBot);
        });

        test('Should return 404 for invalid id', async () => {
            const url = `${endpoint}/1234`;
            try {
                await axios.get(url);
            } catch (err) {
                expect(err.response.status).toEqual(404);
            }
        });
    });

    describe('PUT /bots/:id', () => {
        let bot;

        afterAll(async done => {
            await Bot.deleteMany({});
            done();
        });

        beforeAll(async done => {
            bot = {
                _id: '36b9f842-ee97-11e8-9443-0242ac120002',
                name: 'bot de teste'
            };

            await new Bot(bot).save();
            done();
        });

        test('Should return the updated bot for a valid id', async () => {
            const url = `${endpoint}/${bot._id}`;

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const data = {
                name: 'bot de teste alterado'
            };

            const expectedBot = { ...data, id: bot._id };

            const response = await axios.put(url, data, config);

            expect(response.status).toEqual(200);
            expect(response.data).toMatchObject(expectedBot);
        });

        test('Should return 404 for invalid id', async () => {
            const url = `${endpoint}/1234`;
            try {
                await axios.get(url);
            } catch (err) {
                expect(err.response.status).toEqual(404);
            }
        });
    });

    describe('DELETE /bots/:id', () => {
        let bots;

        afterAll(async done => {
            await Bot.deleteMany({});
            done();
        });

        beforeAll(async done => {
            bots = [
                {
                    _id: '36b9f842-ee97-11e8-9443-0242ac120002',
                    name: 'bot de teste'
                },
                {
                    _id: 'bb810492-bf95-11e9-9cb5-2a2ae2dbcce4',
                    name: 'bot de teste 2'
                }
            ];

            await Bot.insertMany(bots);
            done();
        });

        test('Should delete the bot for a valid id', async () => {
            const id = bots[0]._id;
            const url = `${endpoint}/${id}`;

            const response = await axios.delete(url);
            console.log(response);
            expect(response.status).toEqual(204);
        });

        test('Should return 404 for invalid id', async () => {
            const url = `${endpoint}/1234`;
            try {
                await axios.delete(url);
            } catch (err) {
                expect(err.response.status).toEqual(404);
            }
        });
    });
});
