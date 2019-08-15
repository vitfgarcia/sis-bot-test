const { Router } = require('express');
const BotRepository = require('../repository/BotRepository');

const router = new Router();
const botRepository = new BotRepository();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bot = await botRepository.getBotById(id);
        return res.status(200).json(bot);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const created = await botRepository.createBot(req.body);
        return res.status(201).json(created);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await botRepository.updateBot(id, req.body);
        return res.status(200).json(updated);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await botRepository.deleteBotById(id);
        return res.sendStatus(204);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

module.exports = router;
