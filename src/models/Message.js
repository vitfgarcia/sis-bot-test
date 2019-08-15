const mongoose = require('mongoose');
const { Schema } = mongoose;
const uuid = require('uuid/v4');

const definition = {
    _id: {
        type: String,
        default: uuid
    },
    conversationId: {
        type: String,
        required: [true, 'Conversation Id is required']
    },
    from: {
        type: String,
        required: [true, 'From is required']
    },
    to: {
        type: String,
        required: [true, 'To is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    timestamp: {
        type: String,
        default: new Date().toISOString()
    }
};

const schema = new Schema(definition);

module.exports = mongoose.model('Messages', schema, 'Messages');
