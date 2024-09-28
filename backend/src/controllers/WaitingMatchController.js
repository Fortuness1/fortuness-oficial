const UserModel = require('../models/UserModel');
const WaitingMatchModel = require('../models/WaitingMatch');
const QuestionModel = require('../models/QuestionModel');
const dateTime = require('../utils/dateTime');
const DMYdate = require('../utils/DMYdate');

exports.createWaitingMatch = async (req, res) => {
    try {
        const data = new Date()
        const dataTime = dateTime(data);
        const DMYdata = DMYdate(data);

        const User = await UserModel.findById(req.body._id);

        for(let i = 0; i <  req.body.questions.length; i++) {
            const question = await QuestionModel.findById(req.body.questions[i]);
            if(question === null) {
                return res.status(404).json({ error: "question not found" });
            }
        }

        const WaitingMatch = new WaitingMatchModel({
            name: req.body.name,
            description: req.body.description,
            semester: req.body.semester,
            chat_availability: req.body.chat_availability,
            data: DMYdata,
            time: dataTime,
            question_times: req.body.question_times,
            questions: req.body.questions
        });

        const saveWaitingMatch = await WaitingMatch.save();

        const Usersave = await UserModel.findByIdAndUpdate(
            req.body._id, { $push: { waiting_matches: WaitingMatch }}
        );
        
        return res.status(201).json({ "status": "waiting match created" });
    } catch (err) {
        console.log(err);
        if(err.path == '_id'){
            return res.status(404).json({ error: "user or questions not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.getWaitingMatch = async (req, res) => {
    try {
        const questions = [];
        const WaitingMatch = await WaitingMatchModel.findById(req.params.id);

        for(let i = 0; i < WaitingMatch.questions.length; i++) {
            const question = await QuestionModel.findById(WaitingMatch.questions[i]);
            if(question === null) {
                return res.status(404).json({ error: "question not found" });
            }
            questions.push(question);
        }

        const WaitingMatchTem = new WaitingMatchModel(WaitingMatch).toObject();

        WaitingMatchTem.questions = questions;
        
        return res.status(200).json(WaitingMatchTem);
    } catch (err) {
        if(err.path == '_id'){
            return res.status(404).json({ error: "waiting match not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.getAllWaitingMatches = async (req, res) => {
    try {
        let responseWaitingMatches = [];
        const waitingMatchesUser = await UserModel.findById(req.params.id).select('waiting_matches');

        for(let i = 0; i < waitingMatchesUser.waiting_matches.length; i++) {
            const WaitingMatchTem = await WaitingMatchModel.findById(waitingMatchesUser.waiting_matches[i]);
            responseWaitingMatches.push(WaitingMatchTem);
        }

        return res.status(200).json(responseWaitingMatches);
    } catch (err) {
        if(err.path == '_id'){
            return res.status(404).json({ error: "waiting match not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.deleteWaitingMatch = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        const waitingMatch = await WaitingMatchModel.findById(req.params.idwaiting);

        if (waitingMatch == null) {
            return res.status(404).json({ error: "waiting match not found" });
        }
        
        const removeWaitingMatch = await UserModel.findByIdAndUpdate(
            req.params.id, 
            { $pull: { waiting_matches: req.params.idwaiting } },
        );

        const deleteWaitingMatch = await WaitingMatchModel.findByIdAndDelete(req.params.idwaiting);

        return res.status(200).json({ status: "waiting match deleted" });
    } catch (err) {
        if(err.path == '_id'){
            return res.status(404).json({ error: "user or waiting match not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.updateWaitingMatch = async (req, res) => {
    try {
        const data = new Date()
        const dataTime = dateTime(data);
        const DMYdata = DMYdate(data);

        const updateWaitingMatch = await WaitingMatchModel.findByIdAndUpdate(
            req.body._id,
            {   $set: {
                    name: req.body.name,
                    description: req.body.description,
                    semester: req.body.semester,
                    chat_availability: req.body.chat_availability,
                    data: DMYdata,
                    time: dataTime,
                    question_times: req.body.question_times,
                    questions: req.body.questions
                }
            },
        );

        return res.status(200).json({ status: "waiting match updated" });
    } catch (err) {
        if(err.path == '_id'){
            return res.status(404).json({ error: "waiting match not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.duplicateWaitingMatch = async (req, res) => {
    try {
        const data = new Date()
        const dataTime = dateTime(data);
        const DMYdata = DMYdate(data);

        const WaitingMatch = await WaitingMatchModel.findById(req.body._id_waiting_match);

        if(WaitingMatch === null) {
            return res.status(404).json({ error: "waiting match not found" });
        }

        const WaitingMatchDuplicate = new WaitingMatchModel({
            name: req.body.name,
            description: WaitingMatch.description,
            semester: WaitingMatch.semester,
            chat_availability: WaitingMatch.chat_availability,
            data: DMYdata,
            time: dataTime,
            question_times: WaitingMatch.question_times,
            questions: WaitingMatch.questions
        });

        const saveWaitingMatch = await WaitingMatchDuplicate.save();

        const Usersave = await UserModel.findByIdAndUpdate(
            req.body._id, { $push: { waiting_matches: WaitingMatchDuplicate }}
        );
        
        return res.status(201).json({ "status": "waiting match duplicated" });
    } catch (err) {
        if(err.path == '_id'){
            return res.status(404).json({ error: "user or waiting match not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}