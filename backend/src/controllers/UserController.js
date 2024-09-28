const UserModel = require('../models/UserModel');
const path = require('path');

exports.createUser = async (req, res) => {
    try {
        const email = req.body.email
        let occupation = "TEACHER"

        if(email.endsWith("@alu.ufc.br")){
            occupation = "STUDENT"
        }

        const newUser = new UserModel({
            name: req.body.name,
            last_name: req.body.last_name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            occupation: occupation
        });
        
        await newUser.save();      
        return res.status(201).json({ _id: newUser._id, occupation:  newUser.occupation });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.email === 1) {
            return res.status(409).json({ error: 'email already registered' });
        } else if(err.code === 11000 && err.keyPattern.surname === 1){
            return res.status(409).json({ error: 'surname already registered' });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.findUser = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await UserModel.findOne({  email: email, password: password, });
        if (user == null) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }
        return res.status(200).json({_id: user._id, occupation: user.occupation});
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body._id);
        return res.status(200).json({name: user.name, last_name: user.last_name ,surname: user.surname, email: user.email, password: user.password});
    } catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(400).json({ error: "user not found" })
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};

exports.chargeUser = async (req, res) => {
    try {
         
        const findUser = await UserModel.find({
            $or: [{ email: req.body.email }, { surname: req.body.surname }],
        });

        if(findUser != null){
            for (let i = 0; i < findUser.length; i++) {
                if(findUser[i]._id != req.body._id){
                    if(findUser[i].email === req.body.email){
                        return res.status(409).json({ error: 'email already registered' });
                    } else {
                        return res.status(409).json({ error: 'surname already registered' });
                    }
                }
            }
        }

        const chargeUser =  await UserModel.findByIdAndUpdate(req.body._id, 
            { 
                $set: { 
                    name: req.body.name,
                    last_name: req.body.last_name,
                    surname: req.body.surname,
                    email: req.body.email, 
                    password: req.body.password, 
                }
            }
        );

        return res.status(200).json({ status: "user updated" });
    }catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(404).json({ error: "user not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.changeProfilePhoto = async (req, res) => {
    try {
        const pathFile = req.file.filename;
        const questionBank = await UserModel.findById(req.params.id).select('profile_photo');

        if (questionBank.profile_photo == pathFile){
            return res.status(409).json({ error: "photo already exists" });
        }

        await UserModel.findByIdAndUpdate(
            req.params.id, { $set: { profile_photo: pathFile } },
        );

        return res.status(200).json({ status: "photo saved" });

    } catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(400).json({ error: "user not found" });
        } else{
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.profilePhoto = async (req, res) => {
    try {
        const questionBank = await UserModel.findById(req.params.id).select('profile_photo');
        return res.sendFile(path.join(__dirname, '../uploads/'+ questionBank.profile_photo));
    } catch (err) {
        if(err.kind == "ObjectId"){
            return res.status(400).json({ error: "user not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const users = await UserModel.deleteOne({ _id: req.params.id });
        if (users.deletedCount == 0) {
            return res.status(404).json({ error: 'user not found' });
        }
        return res.status(200).json({ status: "user deleted" });
    } catch (err) {
        console.log(err);
        if(err.path == '_id'){
            return res.status(404).json({ error: "user not found" });
        } else {
            return res.status(500).json({ error: err.message });
        }
    }
};