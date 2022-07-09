const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

//middleware to handle cors
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("SEND_MESSAGE", (data) => {
    const message=getNextQuestion(data.questionCode)
    socket.emit("RECEIVE_MESSAGE", [data,...message]);
  });
  socket.on("WELCOME_MESSAGE", (data) => {
    socket.join(socket.id);
    let welcomeMsg = questions[21];
    socket.emit("RECEIVE_MESSAGE", welcomeMsg);
  });
});
server.listen(3001, () => {
  console.log("server is running");
});

const questions = {
  21:[{
    type: "recieved",
    message:
      "Great! Before I connect you to our team, please choose an option below:",
    sentAt: new Date().getTime(),
    questionCode: 21,
    nextQuestion: 31,
    options: [
      {
        message: "I want my free list of ideal behavior",
        component: "button",
        sentAt: new Date().getTime(),
        optionCode: 1,
        questionCode: 21,
        nextQuestion: 31
      },
      {
        message: "I want to learn more about pricing",
        component: "button",
        sentAt: new Date().getTime(),
        optionCode: 2,
        questionCode: 21,
        nextQuestion: 31
      },
    ],
  }],
  31:[{
    type: "recieved",
    message:
      "Before we keep going, can I get your business email, just in case we get disconnected?",
    sentAt: new Date().getTime(),
    questionCode: 31,
    nextQuestion:41
  },
  {
    type: "recieved",
    message: "Email",
  placeHolder:"Enter you email",
    component: "input",
    sentAt: new Date().getTime(),
    optionCode: 1,
    questionCode: 31,
    nextQuestion: 41
  }
]
}
const getNextQuestion=(id)=>{

  const currentQuestion= questions[id]
  const nextQuestion=  questions[currentQuestion[0].nextQuestion]
  return nextQuestion

  
}
