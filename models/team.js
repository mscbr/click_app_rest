const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    team: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    sessions: {
        type: [
            {
                _id: false,
                session: { type: String },
                session_clicks: { type: Number, default: 0 }
            }
        ]
    }
});

module.exports = mongoose.model('Team', teamSchema);
