const UserModel = require('../models/UserModel');
const MatchModel = require('../models/MatchModel');
const QuestionModel = require('../models/QuestionModel');
const WaitingMatchModel = require('../models/WaitingMatch');
const dateTime = require('../utils/dateTime');
const DMYdate = require('../utils/DMYdate');

exports.createMatch = async (req, res) => {
    const data = new Date()
    const dataTime = dateTime(data);
    const DMYdata = DMYdate(data);
    try {
        const User = await UserModel.findById(req.body._id);
        if(User === null) {
            return res.status(404).json({ error: "user not found" });
        }
        const questionsaArray = [];

        for(let i = 0; i < req.body.questions.length; i++) {
            for(let j = 0; j < User.questions.length; j++) {
                const questionFor = User.questions[j];
                const idString = questionFor._id.toString();
                if( req.body.questions[i] === idString ) {
                    questionsaArray.push(User.questions[j]);
                }
            }
        }
        const match = await MatchModel(
            {
                name: req.body.name,
                description: req.body.description,
                question_times: req.body.question_times,
                chat_availability: req.body.chat_availability,
                semester: req.body.semester,
                data: DMYdata,
                time: dataTime,
                name_host: User.name + " " + User.surname,
                questions: questionsaArray,
                pin: Math.floor(Math.random() * 900000) + 100000
            }
        );
        await match.save();

        const matchUser = await UserModel.findByIdAndUpdate(
            req.body._id, { $push: { created_matches: match }}, { new: true }
        );

        if(req.body._id_waiting_match) {
            const deleteWaitingMatch = await WaitingMatchModel.findByIdAndDelete(req.body._id_waiting_match);
            const removeWaitingMatch = await UserModel.findByIdAndUpdate(
                req.body._id, { $pull: { waiting_matches: req.body._id_waiting_match }}
            )
        }
     
        return res.status(201).json(
            { 
                "status": "match created",
                "id_match": match._id,
            }
        );	
    } catch (err) {
        if(err.path === '_id') {
            return res.status(404).json({ error: "user not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.enterMatch = async (req, res) => {
    try {
        const match = await MatchModel.findOne({ pin: req.params.pin });

        if(match === null) {
            return res.status(404).json({ error: "match not found" });
        } else if(match.status === "WAITING") {
            return res.status(200).json({ "status": "match found", "id_match": match._id });
        } 

        return res.status(409).json({ error: "match found but in progress or finished" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.findMatch = async (req, res) => {
    try {
        const match = await MatchModel.findById(req.params.idMatch);

        for(let i = 0; i < match.questions.length; i++) {
            const question = await QuestionModel.findById(match.questions[i]);
            match.questions[i] = question;
        }

        return res.status(200).json(match);
    } catch (err) {
        if(err.path === "_id") {
            return res.status(404).json({ error: "match not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.findMatchesHistory = async (req, res) => {
    try {
        let createdMatches = [];
        let participatedMatches = [];
        const matchesHistory = await UserModel.findById(req.params.id).select('created_matches').select('participated_matches');
        
        for(let i = 0; i < matchesHistory.created_matches.length; i++) {
            const match = await MatchModel.findById(matchesHistory.created_matches[i]);
            createdMatches.push(match);
        }

        for(let i = 0; i < matchesHistory.participated_matches.length; i++) {
            const match = await MatchModel.findById(matchesHistory.participated_matches[i]);
            for(let j = 0; j < match.players.length; j++) {
               if(match.players[j]._id === req.params.id) {
                    match.players = match.players[j] 
                    participatedMatches.push(match);
                }
            }
        }

        res.status(200).json({ "created_matches": createdMatches, "participated_matches": participatedMatches });
    } catch (err) {
        if(err.messageFormat === undefined) {
            res.status(404).json({ error: "user not found" });
        } else{
            res.status(500).json({ error: err.message });
        }
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const changeStatus = await MatchModel.findByIdAndUpdate(
            req.body._id_match, { status: req.body.status },
        )
        if(changeStatus === null) {
            return res.status(404).json({ error: "match not found" });
        }
        return res.status(200).json({ "status": "status changed" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.finishedMatch = async (req, res) => {
    try {
        const players = []
        let player = {}

        for(let i = 0; i < req.body.players.length; i++) {
            const user = await UserModel.findByIdAndUpdate(
                req.body.players[i]._id, { $push: { participated_matches: req.body._id_match }}
            )
            player = {
                _id: req.body.players[i]._id,
                name: user.name,
                last_name: user.last_name,
                rank_position: req.body.players[i].rank_position,
                score: req.body.players[i].score,
                profile_photo: user.profile_photo,
                answers: req.body.players[i].answers
            }
            players.push(player);
        };

        const match = await MatchModel.findByIdAndUpdate(
            req.body._id_match,
            { 
                status: "FINISHED",
                players: players
            }
        )

        for(let i = 0; i < match.questions.length; i++) {
            const user = await QuestionModel.findByIdAndUpdate(
                match.questions[i]._id,
                 { 
                    $set: { editable: false },
                    $push: { used_matches : match.name } 
                }
            )
        }

        return res.status(200).json({ "status": "match finished" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getRank = async (req, res) => {
    try {
        const idMatch = req.params.id;
        const match = await MatchModel.findById(idMatch);
        const players = match.players;

        players.sort((a, b) => {
            return a.rank_position - b.rank_position;
        });

        return res.status(200).json(players);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}