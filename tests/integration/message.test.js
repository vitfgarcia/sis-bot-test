const mongoose = require('mongoose');
const axios = require('axios');

const server = require('../../src/server');
const Message = require('../../src/models/Message');

const {
    PORT,
    DB_CONNECTION
} = process.env;

describe('/messages integration tests', () => {
    const endpoint = `http://localhost:${PORT}/messages`;

    let api;
    beforeAll(async done => {
        await mongoose.connect(DB_CONNECTION, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        await Message.deleteMany({});

        api = server.listen(PORT, done);
    });

    afterAll(async done => {
        await Message.deleteMany({});
        await mongoose.connection.close();

        if (!api) {
            return done();
        }

        api.close(done);
    });

    describe('POST /messages', () => {
        afterAll(async done => {
            await Message.deleteMany({});
            done();
        });

        test('Should create a message with success', async () => {
            const message = {
                conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                timestamp: '2018-11-16T23:30:52.6917722Z',
                from: '36b9f842-ee97-11e8-9443-0242ac120002',
                to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                text: 'Oi! Como posso te ajudar?'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(`${endpoint}`, message, params);

            expect(response.status).toEqual(201);
            expect(response.data).toEqual(expect.objectContaining(message));
        });

        test('Should respond with error when try to create message without required fields', async () => {
            const message = {
                timestamp: '2018-11-16T23:30:52.6917722Z',
                from: '36b9f842-ee97-11e8-9443-0242ac120002',
                to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                text: 'Oi! Como posso te ajudar?'
            };

            const params = {
                headers: {
                    'Content-Type': 'application/javascript'
                }
            };

            try {
                await axios.post(endpoint, message, params);
                throw new Error('Unexpected result');
            } catch (err) {
                expect(err.response.status).toEqual(400);
                expect(err.response.data.message).toEqual(expect.stringContaining('Conversation Id is required'));
            }
        });
    });

    describe('GET /messages', () => {
        afterAll(async done => {
            await Message.deleteMany({});
            done();
        });

        beforeAll(async done => {
            const messages = [
                {
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:30:55.6917722Z',
                    from: '36b9f842-ee97-11e8-9443-0242ac120002',
                    to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    text: 'Oi! Como posso te ajudar?'
                },
                {
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:31:59.6917722Z',
                    from: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    to: '36b9f842-ee97-11e8-9443-0242ac120002',
                    text: 'Poderia tirar uma duvida em relação a um pagamento?'
                },
                {
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:32:52.6917722Z',
                    from: '36b9f842-ee97-11e8-9443-0242ac120002',
                    to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    text: 'Claro, pode me passaor o código de identificação do pagamento?'
                }
            ];

            await Message.insertMany(messages);
            done();
        });

        test('Should return list of messages', async () => {
            const config = {
                params: {
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1'
                }
            };

            const response = await axios.get(endpoint, config);

            expect(response.status).toEqual(200);
            expect(response.data).toHaveLength(3);
        });

        test('Should return an empty list for invalid conversationId', async () => {
            const config = {
                params: {
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a3'
                }
            };

            const response = await axios.get(endpoint, config);

            expect(response.status).toEqual(200);
            expect(response.data).toHaveLength(0);
        });
    });

    describe('GET /messages/:id', () => {
        let id;
        let messages;

        afterAll(async done => {
            await Message.deleteMany({});
            done();
        });

        beforeAll(async done => {
            messages = [
                {
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:30:55.6917722Z',
                    from: '36b9f842-ee97-11e8-9443-0242ac120002',
                    to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    text: 'Oi! Como posso te ajudar?'
                }
            ];

            const [result] = await Message.insertMany(messages);
            id = result._id;
            done();
        });

        test('Should return the message for a valid id', async () => {
            const url = `${endpoint}/${id}`;
            const expectedMessage = { ...messages[0], id };

            const response = await axios.get(url);

            expect(response.status).toEqual(200);
            expect(response.data).toMatchObject(expectedMessage);
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
});
