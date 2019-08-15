const MongoConnection = require('./MongoConnection');
const Bot = require('../models/Bot');

class BotRepository {
    constructor() {
        MongoConnection.connect();
    }

    async getBotById(id) {
        const bot = await Bot.findOne({ _id: id });

        if (!bot) {
            throw new Error(`Bot with id ${id} not found`);
        }

        return {
            id: bot._id,
            name: bot.name
        };
    }

    async createBot(bot) {
        bot._id = bot.id;
        delete bot.id;

        const created = await new Bot(bot).save();

        return {
            id: created._id,
            name: created.name
        };
    }

    async updateBot(id, newBot) {
        const bot = await Bot.findOneAndUpdate({ _id: id }, newBot);

        if (!bot) {
            throw new Error(`Bot with id ${id} not found`);
        }

        const updatedBot = await this.getBotById(id);
        return updatedBot;
    }

    async deleteBotById(id) {
        const bot = await Bot.findOneAndRemove({ _id: id });

        if (!bot) {
            throw new Error(`Bot with id ${id} not found`);
        }
    }
}

module.exports = BotRepository;
