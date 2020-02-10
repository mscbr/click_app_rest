const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Team = require('../models/team');

exports.getLeaderBoard = async (req, res) => {
    const teams = await Team.find().sort({ clicks: -1 });
    res.status(200).json(
        teams.map((team, i) => ({
            order: i + 1,
            team: team.team,
            clicks: team.clicks
        }))
    );
};

exports.click = async (req, res, next) => {
    console.log('click body', req.body);
    // if the body {team, session} was passed
    const errors = validationResult(req);
    if (!errors.isEmpty())
        next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );

    const { team, session } = req.body;

    // check if team already exists
    let targetTeam;
    targetTeam = await Team.findOne({ team: team });

    // if team doesn't exist - create one
    if (!targetTeam) {
        const createdTeam = new Team({
            team,
            clicks: 0,
            sesions: []
        });
        try {
            await createdTeam.save();
        } catch (err) {
            const error = new HttpError(
                'Creating team failed, please try again.',
                500
            );
            return next(error);
        }
        // assign created team
        targetTeam = await Team.findOne({ team: team });
    }

    // session update/create
    let targetSession = targetTeam.sessions.find(
        item => item.session === session
    );
    if (targetSession) {
        targetSession.session_clicks++;
        targetTeam.clicks++;
    } else {
        targetSession = { session, session_clicks: 1 };
        targetTeam.sessions.push(targetSession);
        targetTeam.clicks++;
    }

    // saving
    try {
        await targetTeam.save();
    } catch (err) {
        return next(
            new HttpError('Something went wrong, could not update team.', 500)
        );
    }

    res.status(200).json({
        your_clicks: targetSession.session_clicks,
        team_clicks: targetTeam.clicks
    });
};
