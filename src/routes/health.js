const { Router } = require('express');

const router = new Router();

router.get('/', (_, res) => {
    res.status(200).json({ message: 'service is up and running' });
});

module.exports = router;
