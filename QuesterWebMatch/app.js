const { WebSocketServer } = require("ws")

const wss = new WebSocketServer({ port: 8080 })

let MatcheData

class Player {
    constructor(_id, name, last_name, user, profile_photo) {
        this._id = _id;
        this.name = name;
        this.last_name = last_name;
        this.surname = user;
        this.profile_photo = profile_photo;
        this.answers = [];
        this.rank_position = 0;
        this.score = 0;
    }

    updatePoints(points) {
        this.score += points;
    }

    saveAnswer(iRight, answerPosition, points) {
        this.answers[answerPosition] = iRight;
        this.updatePoints(points);
    }

    updateRank(rankPosition) {
        this.rank_position = rankPosition;
    }
}

class Match {
    constructor(_id, name, time, questions) {
        this._id = _id;
        this.name = name;
        this.time = time;
        this.questions = questions || [];
        this.totalPlayers = 0;
        this.status = "WAITING";
        this.currentPlayers = 0;
        this.currentQuestion = 0;
        this.timeInitLastQuestion = new Date();
        this.passFistQuestion = false;
        this.maxPoints = 10;
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
        this.currentPlayers++;
        this.totalPlayers++;
    }

    removePlayer(idPlayer) {
        this.currentPlayers--;
        this.players = this.players.filter(player => player._id !== idPlayer);
    }

    updateStatus(status) {
        this.status = status;
        this.updateStatusFetch(status);
    }

    async updateStatusFetch(status) {
        await fetch(`http://localhost:3000/match/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id_match: this._id, status: status }),
        })
    }

    passingResponseTime(){
        if(this.status === "PROGRESS") {
            const timer = setInterval(() => {
                this.updateCurrentQuestion(timer)
            }, this.time * 1000);
            if(this.currentQuestion === 0 && !this.passFistQuestion) {
                wss.clients.forEach((client) => client.send(JSON.stringify({ type: "passQuestion", value: this.currentQuestion })))
                this.timeInitLastQuestion = new Date();
                this.passFistQuestion = true;
            }
        }
    }

    updateCurrentQuestion(interval) {
        if(this.currentQuestion === this.questions.length - 1) {
            this.updateStatus("FINISHED");
            this.finishCurrentMatch();
            this.sendRank()
            clearInterval(interval);
            this.finishMatch()
        } else {
            this.noneAnswer(this.currentQuestion);
            this.sendRank()
            this.currentQuestion++;
            this.timeInitLastQuestion = new Date();
            wss.clients.forEach((client) => client.send(JSON.stringify({ type: "passQuestion", value: this.currentQuestion})))
        }
    }

    noneAnswer(currentQuestion) {
        this.players.forEach(player => {
            if(player.answers[currentQuestion] === undefined) {
                player.saveAnswer(false, currentQuestion, 0);
            }
        })
    }

    sendRank() {
        let rank = this.players.sort((a, b) => b.score - a.score);
        rank.forEach((player, index) => {
            player.updateRank(index + 1);
        })
        wss.clients.forEach((client) => client.send(JSON.stringify({ type: "rank", value: rank })))
    }

    saveAnswer(idPlayer, answer) {
        let player = new Player()
        const timeCurrent = new Date();
        let points = this.questions[this.currentQuestion].correct_item === answer ? this.setPoints(this.timeInitLastQuestion, timeCurrent) : 0;

        player = this.players.find(player => player._id === idPlayer);
        player.saveAnswer(
            (this.questions[this.currentQuestion].correct_item === answer),
            this.currentQuestion,
            points
        );

        this.sendResponseQuestion(
            idPlayer,
            (this.questions[this.currentQuestion].correct_item === answer),
            answer
        );
    }

    sendResponseQuestion(idPlayer, correct, answer) {
        const player = this.players.find(player => player._id === idPlayer);

        const response = {
            type: "responseQuestion",
            value: {
                user: player.surname,
                correct: correct,
                answer: answer,
            }
        }
        wss.clients.forEach((client) => client.send(JSON.stringify(response)))
    }

    setPoints(timeInit, timeCurrent) {
        const timeInitTransform = this.transformTime(timeInit);
        const timeCurrentTransform = this.transformTime(timeCurrent);
        const timeFinalTransform = timeInitTransform + (this.time * 1000);
        
        const points = this.maxPoints - ((timeCurrentTransform - timeInitTransform ) / (timeFinalTransform - timeInitTransform) ) * this.maxPoints;
        return Math.round(points);
    }

    transformTime(time) {
        const horaAtual = time.getHours() * 3600000;
        const minutoAtual = time.getMinutes() * 60000;
        const segundoAtual = time.getSeconds() * 1000;
        let points = horaAtual + minutoAtual + segundoAtual;
        return points;
    }

    finishCurrentMatch() {
        if(this.status === "FINISHED") {
            wss.clients.forEach((client) => client.send(JSON.stringify({ type: "finishMatch", value: true })))
            MatcheData = new Match();
        }
    }

    async finishMatch(){
        let reponse = {
            _id_match: this._id,
            players: []
        }

        this.players.forEach(player => {
            reponse.players.push({
                _id: player._id,
                score: player.score,
                rank_position: player.rank_position,
                answers: player.answers
            })
        })


        await fetch(`http://localhost:3000/match/finished`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reponse),
        })
    }
}

MatcheData = new Match();

wss.on("connection", (ws) => {
  ws.on("error", console.error)

  ws.on("message", (data) => {
    try {
        const mensagem = JSON.parse(data);
        switch (mensagem.type) {
            case "start":
                const fetchMatch = setMatch(mensagem.value).then((dataMatch) => {
                    MatcheData = new Match(
                        dataMatch._id, 
                        dataMatch.name, 
                        dataMatch.question_times, 
                        dataMatch.questions
                    );
                })
                console.log("start")
                break
            case "enter":
                    const newPlayer = new Player(
                        mensagem.value._id,
                        mensagem.value.name,
                        mensagem.value.last_name,
                        mensagem.value.surname,
                        mensagem.value.profile_photo
                    )
                    MatcheData.addPlayer(newPlayer);
                    wss.clients.forEach((client) => client.send(
                        JSON.stringify({ type: "newPlayer", value: MatcheData.players })
                    ))
                    wss.clients.forEach((client) => client.send(
                        JSON.stringify({ type: "totalPlayer", value: MatcheData.totalPlayers })
                    ))
                break
            case "init":
                if(MatcheData._id !== undefined) {
                    MatcheData.updateStatus("PROGRESS");
                    MatcheData.passingResponseTime();
                }
                break
            case "chat":
                wss.clients.forEach((client) => client.send(JSON.stringify({ type: "chat", value: { user: mensagem.value.user, mensagem: mensagem.value.message } })))
                break
            case "answer":
                MatcheData.saveAnswer(mensagem.value._id, mensagem.value.mensage);
                break
            case "disconnect":
                MatcheData.removePlayer(mensagem.value);
                wss.clients.forEach((client) => client.send(
                    JSON.stringify({ type: "disconnectPlayer", value: mensagem.value })
                ))
                break

            default:
                console.log(mensagem)
      }

    } catch (error) {
        console.error('Erro ao analisar a mensagem JSON:', error);
    }
  })

    ws.on('close', function () {
        MatcheData = new Match();
    });

})

const setMatch = async (_idMatch) => {
    const response = await fetch(`http://localhost:3000/match/${_idMatch}`)
    .then(response => response.json())
    return MatcheData = response;
}
