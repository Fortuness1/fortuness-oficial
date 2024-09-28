
![Logo-Quester](https://github.com/user-attachments/assets/ca7f3b26-62f3-47ce-ac13-0838167d2d74)

<h4>
  Sumário: 
 <a href="#sobre">Sobre</a> • 
 <a href="#equipe">Equipe</a> • 
 <a href="#como-rodar">Como rodar</a> •
 <a href="#requisitos">Requisitos funcionais</a> •
 <a href="#documento">Relatório e Apresentação</a> •
</h4>

<a name="sobre"></a>

## :computer: Sobre

Uma aplicação web que permite que usuários criem partidas, criando perguntas e respostas para testar os conhecimentos de outros usuários. Um sistema intuitivo, seguro, rápido e adaptado às necessidades dos alunos e professores, proporcionando experiências de aprendizado e avaliação satisfatórias.

<a name="equipe"></a>

## :busts_in_silhouette: Equipe Fortuness

|  NOME                           |  FUNÇÃO                    |
|  ----------------------------   |  --------------------------|
|  Ana Valeska Ribeiro            |  UX Designer               | 
|  Davi Calô Nogueira da Cruz     |  Líder & Backend           |
|  Francisco Renan Cruz Borges    |  Frontend                  |
|  Marcos Vinicius Costa Souza    |  Conteudista & Frontend    |
|  Nicole Amanda Do Nascimento Damacena   |  UI Designer       |

<a name="como-rodar"></a>

## :grey_question: Como rodar

Link para o video: https://www.youtube.com/watch?v=oUJcEhyHbFM

### Clonando o repositório

```shell
git clone https://github.com/Fortuness1/fortuness-oficial.git
```

### Ligando o servidor Backend
Abra o arquivo clonado no Visual Studio e abra a linha de comando na raiz do projeto e digite o comando.

```shell
cd .\backend\
npm install
```
Depois procure pelo arquivo 'app.js' seguindo esse caminho 'backend/src/app.js'. Ao encontra o arquivo 'app.js' utilize o icone de play da extensão Code Runner para rodar o servidor.

### Ligando o servidor WebSocket
Abra o shell na raiz do projeto para digitar o seguinte comando.

```shell
cd .\QuesterWebMatch\
npm install
npm start
```

### Frontend
Abra o arquivo index.html para ver a primeira pagina da aplicação.

<a name="requisitos"></a>

## :memo: Requisitos

| Código | Funcionalidade | Link |
| ---------------------------- | --------------------------| -------------------------- |
| REF001 | Cadastro | [Geral](./frontend/src/pages/register.html) |
| REF002 | Tipo de Usuário | [Aluno](./backend/src/controllers/UserController.js)|
| REF003 | Login | [Geral](./frontend/index.html)|
| REF004 | Criar Questão | [Aluno](./frontend/src/pages/lisQuestionStudent.html)  [Professor](./frontend/src/pages/lisQuestionTeacher.html)|
| REF005 | Lista de Questões | [Aluno](./frontend/src/pages/lisQuestionStudent.html)  [Professor](./frontend/src/pages/lisQuestionTeacher.html)|
| REF006 | Criar Partida | [Aluno](./frontend/src/pages/criarPartidaStudent.html)  [Professor](./frontend/src/pages/criarPartidaTeacher.html)|
| REF007 | Partida em espera | [Aluno](./frontend/src/pages/partidasGuardadasStudent.html)  [Professor](./frontend/src/pages/partidasGuardadasTeacher.html)|
| REF008 | Partida Iniciada | [Aluno](./frontend/src/pages/MatchScreen.html)  [Professor](./frontend/src/pages/MatchScreen.html)|
| REF009 | Entrar em Uma Partida | [Aluno](./frontend/src/pages/alunoHome.html)|
| REF010 | Quiz | [Aluno](./frontend/src/pages/MatchScreen.html)  [Professor](./frontend/src/pages/MatchScreen.html)|
| REF011 | Ranking | [Aluno](./frontend/src/pages/MatchScreen.html)  [Professor](./frontend/src/pages/MatchScreen.html)|
| REF012 | Chat | [Aluno](./frontend/src/pages/MatchScreen.html)  [Professor](./frontend/src/pages/MatchScreen.html)|
| REF013 | Histórico de Partidas - Host | [Aluno](./frontend/src/pages/historicoDePartidaStudent.html)  [Professor](./frontend/src/pages/historicoDePartidasTeacher.html)|
| REF014 | Histórico de Partidas - Competidor | [Aluno](./frontend/src/pages/historicoDePartidaStudent.html) |
| REF015 | Foto de Perfil | [Aluno](./frontend/src/pages/configProfileStudent.html)  [Professor](./frontend/src/pages/configProfileTeacher.html)|
| REF016 | Atualizar Conta | [Aluno](./frontend/src/pages/configProfileStudent.html)  [Professor](./frontend/src/pages/configProfileTeacher.html)|
