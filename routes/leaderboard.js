const express = require('express');
const { check } = require('express-validator');
const leaderboardController = require('../controllers/leaderboard');

const router = express.Router();

router.get('/leaderboard', leaderboardController.getLeaderBoard);
router.post(
    '/click',
    [
        check('team')
            .not()
            .isEmpty()
    ],
    leaderboardController.click
);

module.exports = router;
