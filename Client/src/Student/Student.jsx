import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import "./Student.css";

function Student() {
  const [question, setQuestion] = useState({});
  const socket = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [username, setUserName] = useState("");
  const [tempUserName, setTempUserName] = useState("");
  const [firstRender, setFirstRender] = useState(true);
  const [time, setTime] = useState(60);
  const [quizEnd, setQuizEnd] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    socket.current = io('https://quiz-backend-oe2l.onrender.com');

    socket.current.on('connect', () => {
      console.log(" Student connected:", socket.current.id);
    });

    socket.current.on('welcome-msg', (msg1) => {
      console.log(msg1);
    });

    socket.current.on('quiz-end', (msg) => {
      setQuizEnd(true);
    });

    socket.current.on('receive-question', (ques) => {
      console.log("Hello");
      setQuestion(ques);
      setHasSubmitted(false);
    });

    return () => {
      socket.current.disconnect();
      console.log(" Socket disconnected");
    };
  }, []);

  useEffect(() => {
    if (!question?.id || quizEnd || hasSubmitted) return;

    setTime(60);
    let interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const now = new Date();
          const studentResponse = {
            selectedOption: selectedOption,
            username: username,
            questionId: question.id,
            socketId: socket.current.id,
            timeStamp: now.getTime()
          };
          socket.current.emit('submit-answer', studentResponse);
          setHasSubmitted(true);
          setQuestion([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question, hasSubmitted, quizEnd]);

  const submitOption = (e) => {
    e.preventDefault();
    const now = new Date();
    const studentResponse = {
      selectedOption: selectedOption,
      username: username,
      questionId: question.id,
      socketId: socket.current.id,
      submittedAt: now.getTime(),
    };
    socket.current.emit('submit-answer', studentResponse);
    console.log('Submitted Successfully');

    setHasSubmitted(true); 
    setQuestion([]);
  };

  const handleOptionSelect = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleTempUserName = (e) => {
    setTempUserName(e.target.value);
  };

  const handleUserName = (e) => {
    setUserName(tempUserName);
    setFirstRender(false);
  };

  return (
    <form method='get' onSubmit={submitOption} className='question'>
      {firstRender ? (
        <div className='registration-container'>
          <h2>Enter your Email </h2>
          <input
            type='email'
            placeholder="Without username test can't be evaluated"
            value={tempUserName}
            onChange={handleTempUserName}
          />
          <br />
          <br />
          <button onClick={handleUserName}>Click ok to continue</button>
        </div>
      ) : false}

      <h2>Welcome To Quiz</h2>
      <h4>Wait for next question until quiz completes</h4>

      {/*Timer only shows if not submitted and quiz not ended*/}
      {!hasSubmitted && !quizEnd && (
        <div className='timer'>Time Left : <span>{time}</span></div>
      )}

      {(Object.keys(question).length > 0 && !quizEnd) ? (
        <div className='question-container'>
          <h2 className='question'>{question.question}</h2>
          <div className='options-container'>
            <div className='option'>
              <input
                type='radio'
                id='option-1'
                name='answer'
                value="option1"
                onChange={handleOptionSelect}
              />
              <label htmlFor='option-1'>{question.option1}</label>
            </div>

            <div className='option'>
              <input
                type='radio'
                id='option-2'
                name='answer'
                value="option2"
                onChange={handleOptionSelect}
              />
              <label htmlFor='option-2'>{question.option2}</label>
            </div>

            <div className='option'>
              <input
                type='radio'
                id='option-3'
                name='answer'
                value="option3"
                onChange={handleOptionSelect}
              />
              <label htmlFor='option-3'>{question.option3}</label>
            </div>

            <div className='option'>
              <input
                type='radio'
                id='option-4'
                name='answer'
                value="option4"
                onChange={handleOptionSelect}
              />
              <label htmlFor='option-4'>{question.option4}</label>
            </div>
          </div>
          <button className='submit-btn'>Submit</button>
        </div>
      ) : null}

      {quizEnd ? (
        <h1>Quiz has Ended - Thanks for the participation</h1>
      ) : ""}
    </form>
  );
}

export default Student;
