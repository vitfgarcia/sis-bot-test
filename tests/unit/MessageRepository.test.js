const MessageRepository = require('../../src/repository/MessageRepository');
const Message = require('../../src/models/Message');

jest.mock('../../src/repository/MongoConnection');

describe('Bot Unit Tests', () => {
    let messageRepository;

    beforeAll(() => {
        messageRepository = new MessageRepository();
    });

    describe('Get Messages By Id', () => {
        test('Should return message for valid Id', async () => {
            const foundMessage = {
                _id: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                timestamp: '2018-11-16T23:30:52.6917722Z',
                from: '36b9f842-ee97-11e8-9443-0242ac120002',
                to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                text: 'Oi! Como posso te ajudar?'
            };

            const expectedMessage = { ...foundMessage, id: foundMessage._id };
            delete expectedMessage._id;

            const findSpy = jest
                .spyOn(Message, 'findOne')
                .mockResolvedValue(foundMessage);

            const message = await messageRepository
                .getMessageById(foundMessage._id);

            expect(findSpy).toHaveBeenCalledWith({ _id: foundMessage._id });
            expect(message).toMatchObject(expectedMessage);
        });

        test('Should throw error for invalid Id', async () => {
            const id = '16edd3b3-3f75-40df-af07-2a3813a79ce9';
            const expectedMessage = `Message with id ${id} does not exists`;

            const findSpy = jest
                .spyOn(Message, 'findOne')
                .mockResolvedValue(null);

            try {
                await messageRepository
                    .getMessageById(id);
                throw new Error('Expected Find to throw error when item is not found');
            } catch (err) {
                expect(findSpy).toHaveBeenCalledWith({ _id: id });
                expect(err.message).toMatch(expectedMessage);
            }
        });
    });

    describe('Get Messages By Conversation', () => {
        test('Should return bot for valid Id', async () => {
            const conversationId = '7665ada8-3448-4acd-a1b7-d688e68fe9a1';

            const foundMessages = [
                {
                    _id: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:30:52.6917722Z',
                    from: '36b9f842-ee97-11e8-9443-0242ac120002',
                    to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    text: 'Oi! Como posso te ajudar?'
                },
                {
                    _id: '16edd3b3-3f75-40df-af07-2a3813a79ce8',
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:31:52.6917722Z',
                    from: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    to: '36b9f842-ee97-11e8-9443-0242ac120002',
                    text: 'Poderia tirar uma duvida em relação a um pagamento?'
                },
                {
                    _id: '16edd3b3-3f75-40df-af07-2a3813a79ce7',
                    conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                    timestamp: '2018-11-16T23:32:52.6917722Z',
                    from: '36b9f842-ee97-11e8-9443-0242ac120002',
                    to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                    text: 'Claro, pode me passaor o código de identificação do pagamento?'
                }
            ];

            const expectedMessages = foundMessages.map(m => ({
                id: m._id,
                conversationId: m.conversationId,
                timestamp: m.timestamp,
                from: m.from,
                to: m.to,
                text: m.text
            }));

            const findSpy = jest
                .spyOn(Message, 'find')
                .mockResolvedValue(foundMessages);

            const messages = await messageRepository
                .getMessagesByConversation(conversationId);

            expect(findSpy).toHaveBeenCalledWith(conversationId);
            expect(messages).toMatchObject(expectedMessages);
        });

        test('Should return empty if conversationId does not exists', async () => {
            const conversationId = '7665ada8-3448-4acd-a1b7-d688e68fe4a9';
            const expectedMessages = [];

            const findSpy = jest
                .spyOn(Message, 'find')
                .mockResolvedValue(expectedMessages);

            const messages = await messageRepository
                .getMessagesByConversation(conversationId);

            expect(findSpy).toHaveBeenCalledWith(conversationId);
            expect(messages).toMatchObject(expectedMessages);
        });
    });

    describe('Create Message', () => {
        test('Should create a bot with success', async () => {
            const recievedMessage = {
                conversationId: '7665ada8-3448-4acd-a1b7-d688e68fe9a1',
                timestamp: '2018-11-16T23:30:52.6917722Z',
                from: '36b9f842-ee97-11e8-9443-0242ac120002',
                to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                text: 'Oi! Como posso te ajudar?'
            };

            const savedMessage = { ...recievedMessage, _id: '46746016-bf42-11e9-9cb5-3a3ae2dbcce4' };
            const expectedMessage = { ...recievedMessage, id: '46746016-bf42-11e9-9cb5-3a3ae2dbcce4' };

            const saveSpy = jest
                .spyOn(Message.prototype, 'save')
                .mockResolvedValue(savedMessage);

            const created = await messageRepository.createMessage(recievedMessage);

            expect(saveSpy).toHaveBeenCalled();
            expect(created).toMatchObject(expectedMessage);
        });

        test('Should throw error with missing required field', async () => {
            const recievedMessage = {
                timestamp: '2018-11-16T23:30:52.6917722Z',
                from: '36b9f842-ee97-11e8-9443-0242ac120002',
                to: '16edd3b3-3f75-40df-af07-2a3813a79ce9',
                text: 'Oi! Como posso te ajudar?'
            };

            const errorMessage = 'Conversation Id is required';

            const saveSpy = jest
                .spyOn(Message.prototype, 'save')
                .mockImplementation(() => {
                    throw new Error(errorMessage);
                });

            try {
                await messageRepository.createMessage(recievedMessage);
                throw new Error('Expected Create to throw error for missing fields');
            } catch (err) {
                expect(saveSpy).toHaveBeenCalled();
                expect(err.message).toMatch(errorMessage);
            }
        });
    });
});
