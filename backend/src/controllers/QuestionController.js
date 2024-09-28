const UserModel = require('../models/UserModel');
const QuestionModel = require('../models/QuestionModel');

const dateTime = require('../utils/dateTime');
const DMYdate = require('../utils/DMYdate');

exports.createQuestion = async (req, res) => {
    const data = new Date()
    const dataTime = dateTime(data);
    const DMYdata = DMYdate(data);
    try {
        const idUSer = req.body._id;

        const iexists = await UserModel.findById(idUSer);
        
        if (!iexists) {
            return res.status(404).json({ error: "user not found" });
        }
      
        const questions = new QuestionModel(
            {
                type: req.body.type,
                question: req.body.question,
                item: req.body.item,
                correct_item: req.body.correct_item,
                tags: req.body.tags,
                data: DMYdata,
                time: dataTime
            }
        );

        await questions.save();

        await UserModel.updateOne(
            { _id: idUSer },
            { $push: { questions: questions } }
        )

        return res.status(200).json({ status: "question created" });
    } catch (err) {
        if(err.path === '_id') {
            return res.status(404).json({ error: "user not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.findQuestions = async (req, res) => {
    try {
        let questionsOBJ = []
        const allQuestions = await UserModel.findById(req.params.id).select('questions');
        for (let i = 0; i < allQuestions.questions.length; i++) {
            const teste = await QuestionModel.findById(allQuestions.questions[i])
            questionsOBJ.push(teste);
        }
        return res.status(200).json({ questions: questionsOBJ });
    } catch (err) {
        if(err.path === '_id') {
            return res.status(404).json({ error: "user not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const data = new Date()
        const dataTime = dateTime(data);
        const DMYdata = DMYdate(data);

        const user = await UserModel.findById(req.body._id);

        const updateQuestion = await QuestionModel.findByIdAndUpdate(
            req.body._id_question,
            { $set: {
                type: req.body.type,
                question: req.body.question,
                item: req.body.item,
                correct_item: req.body.correct_item,
                tags: req.body.tags,
                data: DMYdata,
                time: dataTime
            }},
        )
        

        return res.status(200).json({ status: "question updated" });
    } catch (err) {
        if(err.path == '_id'){
            return res.status(404).json({ error: "user or question not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.duplicateQuestion = async (req, res) => {
    try {
        const data = new Date()
        const dataTime = dateTime(data);
        const DMYdata = DMYdate(data);

        const user = await UserModel.findById(req.body._id);

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        const question = await QuestionModel.findById(req.body._id_question);

        if (!question) {
            return res.status(404).json({ error: "question not found" });
        }

        const copyQuestion = new QuestionModel({
            type: question.type,
            question: question.question,
            item: question.item,
            correct_item: question.correct_item,
            tags: question.tags,
            data: DMYdata,
            time: dataTime
        });

        const duplicateQuestion = await copyQuestion.save();
        
        const duplicateQuestionUser =  await UserModel.updateOne(
            { _id: req.body._id },
            { $push: { questions: copyQuestion } }
        )

        return res.status(200).json({ status: "question duplicated" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


exports.deleteQuestion = async (req, res) => {
    try {
        var idUser = req.params.iduser;
        var idQuestion = req.params.idquestion;
        var idUserString = idUser.toString();
        const deleteQuestionUser = await UserModel.findByIdAndUpdate(
            idUserString,
            { $pull: { questions: idQuestion } }
        );
        return res.status(200).json({ status: "question deleted" });
    } catch (err) {
        console.log(err)
        if(err.path == '_id'){
            return res.status(404).json({ error: "user not found" });
        } else if(err.path == 'questions'){
            return res.status(404).json({ error: "question not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.getQuestionByID = async (req, res) => {
    try {
        var idQuestion = req.params.idquestion;
        
        const question = await QuestionModel.findById(idQuestion);

        return res.status(200).json(question);
    } catch (err) {
        console.log(err)
        if(err.path == 'questions'){
            return res.status(404).json({ error: "question not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};