const { Router } = require('express');
const MessageRepository = require('../repository/MessageRepository');

const router = new Router();
const messageRepository = new MessageRepository();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const message = await messageRepository.getMessageById(id);
        return res.status(200).json(message);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { conversationId } = req.query;
        const messages = await messageRepository.getMessagesByConversation(conversationId);
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const created = await messageRepository.createMessage(req.body);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

module.exports = router;
