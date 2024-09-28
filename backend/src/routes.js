const { Router } = require('express');
const controllers = require('./controllers/Controllers');
const userController = require('./controllers/UserController');
const questionController = require('./controllers/QuestionController');
const matchConController = require('./controllers/MatchCotroller');
const waitingMatchController = require('./controllers/WaitingMatchController');

const routes = new Router();
const upload = require('./middleware/upload');

routes.get('/', (req, res) => {
    var status = {
        status: "ok"
    }
    res.send(JSON.stringify(status));
});

//User
routes.post('/signup', userController.createUser);
routes.post('/login', userController.findUser);
routes.post('/user', userController.getUser);
routes.put('/user', userController.chargeUser);
routes.put('/change-profile-photo/:id', upload.single('profile-photo'), userController.changeProfilePhoto);
routes.get('/profile-photo/:id', userController.profilePhoto);
routes.delete('/user/:id', userController.deleteUser);

//Question
routes.post('/question', questionController.createQuestion);
routes.get('/question/:id', questionController.findQuestions);
routes.put('/question/', questionController.updateQuestion);
routes.post('/duplicate-question', questionController.duplicateQuestion);
routes.get('/question/find/:idquestion', questionController.getQuestionByID);
routes.delete('/question/:iduser/:idquestion', questionController.deleteQuestion);

//Match
routes.post('/match', matchConController.createMatch);
routes.put('/match/status', matchConController.changeStatus);
routes.put('/match/finished', matchConController.finishedMatch);
routes.get('/match/history/:id', matchConController.findMatchesHistory);
routes.get('/match/:idMatch', matchConController.findMatch);
routes.get('/match/enter/:pin', matchConController.enterMatch);
routes.get('/match/rank/:id', matchConController.getRank);

//Waiting Match
routes.post('/waiting-match', waitingMatchController.createWaitingMatch);
routes.get('/waiting-match/:id', waitingMatchController.getWaitingMatch);
routes.get('/waiting-match/history/:id', waitingMatchController.getAllWaitingMatches);
routes.post('/waiting-match/duplicate', waitingMatchController.duplicateWaitingMatch);
routes.put('/waiting-match/update', waitingMatchController.updateWaitingMatch); 
routes.delete('/waiting-match/:id/:idwaiting', waitingMatchController.deleteWaitingMatch);

//Default
routes.get('/findbyID/:id', controllers.findbyID);
routes.delete('/deletebyID/:id', controllers.deletebyID);
routes.delete('/delete-all', controllers.deleteALL);
routes.delete('/delete-all-questions', controllers.deleteAllQuestions);
routes.delete('/delete-all-match', controllers.deleteAllMatches);
routes.delete('/delete-all-waiting-match', controllers.deleteWaitingMatche);
routes.get('/find-all', controllers.findAllUser);
routes.get('/find-all-waiting-matches', controllers.getWaitingMatches);
routes.get('/find-all-questions', controllers.findAllQuestions);
routes.get('/find-all-matches', controllers.findAllMatches);
routes.delete('/deletebyIDCreatedMatches/:iduser/:idmache', controllers.deleteCreatedMatches);

module.exports = routes;
