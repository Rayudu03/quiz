const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');

//database connections

const {QuestionCollections, connectDB} = require('./db.js'); 

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173','http://localhost:5174','http://localhost:5175'],  // client runs on 5173 Admin runs on 5174
    methods: ['GET', 'POST']
  }
});

connectDB();  //connecting to database



app.use(cors());

io.on('connection', (socket) => {

  socket.on('send-question' ,(question)=>{
    io.emit('receive-question' , question);
  });
  
  socket.on('send-questionNumber', (quesNum) => {
  async function load() {
    try {
      const collectionName = `QuestionNumber${quesNum}`;
      const DynamicModel = mongoose.models[collectionName] ||
        mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

      const data = await DynamicModel.find({}).sort({ submittedAt: 1 });
      io.emit('receive-collection', data);
    } catch (err) {
      console.error("Error fetching collection:", err);
    }
  }

  load();
});



  socket.on('quiz-completed',(msg) => {
    io.emit('quiz-end',(msg));
  });

  socket.on('submit-answer', (studentResponse)=>{
    const modelName = `QuestionNumber${studentResponse.questionId}`; 
    const Model = QuestionCollections[modelName]; 
    const obj = new Model(studentResponse);
    obj.save();
  });
});


server.listen(5000, () => {
  console.log(" Server running on http://localhost:5000 ");
});
