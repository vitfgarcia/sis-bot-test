const BotRepository = require('../../src/repository/BotRepository');
const Bot = require('../../src/models/Bot');

jest.mock('../../src/repository/MongoConnection');

describe('Bot Unit Tests', () => {
    let botRepository;

    beforeAll(() => {
        botRepository = new BotRepository();
    });

    describe('Get Bot By Id', () => {
        test('Should return bot for valid Id', async () => {
            const botFound = {
                _id: '46746016-bf42-11e9-9cb5-2a2ae2dbcce4',
                name: 'Bot de Teste'
            };

            const expectedBot = { ...botFound, id: botFound._id };
            delete expectedBot._id;

            const findSpy = jest
                .spyOn(Bot, 'findOne')
                .mockResolvedValue(botFound);

            const bot = await botRepository
                .getBotById(botFound._id);

            expect(findSpy).toHaveBeenCalledWith({ _id: botFound._id });

            expect(bot).toMatchObject(expectedBot);
        });

        test('Should throw error for invalid Id', async () => {
            const id = '1234';
            const expectedMessage = `Bot with id ${id} not found`;

            const findSpy = jest
                .spyOn(Bot, 'findOne')
                .mockResolvedValue(null);

            try {
                await botRepository
                    .getBotById(id);
                throw new Error('Expected Find to throw error when item is not found');
            } catch (err) {
                expect(findSpy).toHaveBeenCalledWith({ _id: id });
                expect(err.message).toMatch(expectedMessage);
            }
        });
    });

    describe('Create Bot', () => {
        test('Should create a bot with success', async () => {
            const savedBot = {
                _id: '46746016-bf42-11e9-9cb5-2a2ae2dbcce4',
                name: 'Bot de Teste'
            };

            const expectedBot = { ...savedBot, id: savedBot._id };
            delete expectedBot._id;

            const saveSpy = jest
                .spyOn(Bot.prototype, 'save')
                .mockResolvedValue(savedBot);

            const created = await botRepository.createBot(expectedBot);

            expect(saveSpy).toHaveBeenCalled();
            expect(created).toMatchObject(expectedBot);
        });

        test('Should throw error with missing required field', async () => {
            const bot = {
                name: 'Bot de Teste'
            };

            const errorMessage = 'Bot id is required';

            const saveSpy = jest
                .spyOn(Bot.prototype, 'save')
                .mockImplementation(() => {
                    throw new Error(errorMessage);
                });

            try {
                await botRepository.createBot(bot);
                throw new Error('Expected Create to throw error for missing fields');
            } catch (err) {
                expect(saveSpy).toHaveBeenCalled();
                expect(err.message).toMatch(errorMessage);
            }
        });
    });

    describe('Update Bot', () => {
        test('Should update a bot with success', async () => {
            const updatedBot = {
                _id: '46746016-bf42-11e9-9cb5-2a2ae2dbcce4',
                name: 'Bot de Teste'
            };

            const expectedBot = { ...updatedBot, id: updatedBot._id };
            delete expectedBot._id;

            const updateSpy = jest
                .spyOn(Bot, 'findOneAndUpdate')
                .mockResolvedValue(updatedBot);

            const findSpy = jest
                .spyOn(Bot, 'findOne')
                .mockResolvedValue(updatedBot);

            const updated = await botRepository.updateBot(updatedBot._id, updatedBot);

            expect(updateSpy).toHaveBeenCalled();
            expect(findSpy).toHaveBeenCalled();
            expect(updated).toMatchObject(expectedBot);
        });

        test('Should throw an error for invalid ids', async () => {
            const updateSpy = jest
                .spyOn(Bot, 'findOneAndUpdate')
                .mockResolvedValue(null);

            const id = '46746016-bf42-11e9-9cb5-2a2ae2dbcce4';
            const errorMessage = `Bot with id ${id} not found`;

            try {
                await botRepository.updateBot(id, {});
                throw new Error('Expected Update to throw error when id was not found');
            } catch (err) {
                expect(updateSpy).toHaveBeenCalled();
                expect(err.message).toMatch(errorMessage);
            }
        });
    });

    describe('Delete Bot', () => {
        test('Should delete a bot with success', async () => {
            const deletedBot = {
                _id: '46746016-bf42-11e9-9cb5-2a2ae2dbcce4',
                name: 'Bot de Teste'
            };

            const deleteSpy = jest
                .spyOn(Bot, 'findOneAndRemove')
                .mockResolvedValue(deletedBot);

            await botRepository.deleteBotById(deletedBot._id);

            expect(deleteSpy).toHaveBeenCalledWith({ _id: deletedBot._id });
        });

        test('Should throw error for invalid ids', async () => {
            const id = '46746016-bf42-11e9-9cb5-2a2ae2dbcce4';
            const errorMessage = `Bot with id ${id} not found`;

            const deleteSpy = jest
                .spyOn(Bot, 'findOneAndRemove')
                .mockResolvedValue(null);

            try {
                await botRepository.deleteBotById(id);
                throw new Error('Expected Delete to throw error for invalid id');
            } catch (err) {
                expect(deleteSpy).toHaveBeenCalledWith({ _id: id });
                expect(err.message).toMatch(errorMessage);
            }
        });
    });
});
