const mongoose = require('mongoose');

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://hemanthreddy:322106410098@quiz-data.0unm8lw.mongodb.net/?retryWrites=true&w=majority&appName=quiz-data"; 
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

const questionSchema = new mongoose.Schema({
    selectedOption:String,
    username : String,
    questionId:Number,
    socketId:String,
    submittedAt:Number,
});

const QuestionCollections = {};
for(let i = 1;i<=5; i++){
    QuestionCollections[`QuestionNumber${i}`] = mongoose.model(`QuestionNumber${i}`, questionSchema);
}


module.exports = {QuestionCollections, connectDB};