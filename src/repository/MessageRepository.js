const MongoConnection = require('./MongoConnection');
const Message = require('../models/Message');

class MessageRepository {
    constructor() {
        MongoConnection.connect();
    }

    async getMessageById(id) {
        const message = await Message.findOne({ _id: id });

        if (!message) {
            throw new Error(`Message with id ${id} does not exists`);
        }

        return {
            id: message._id,
            conversationId: message.conversationId,
            from: message.from,
            to: message.to,
            text: message.text,
            timestamp: message.timestamp
        };
    }

    async getMessagesByConversation(conversationId) {
        const messages = await Message.find({ conversationId: conversationId });
        return messages
            .map(m => ({
                id: m._id,
                conversationId: m.conversationId,
                from: m.from,
                to: m.to,
                text: m.text,
                timestamp: m.timestamp
            }));
    }

    async createMessage(message) {
        const created = await new Message(message).save();
        return {
            id: created._id,
            conversationId: created.conversationId,
            from: created.from,
            to: created.to,
            text: created.text,
            timestamp: created.timestamp
        };
    }
}

module.exports = MessageRepository;
