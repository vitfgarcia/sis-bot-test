const mongoose = require('mongoose');
const { Schema } = mongoose;

const definition = {
    _id: {
        type: String,
        required: [true, 'Bot id is required']
    },
    name: {
        type: String,
        required: [true, 'Bot name is required']
    }
};

const schema = new Schema(definition, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model('Bot', schema, 'Bot');
