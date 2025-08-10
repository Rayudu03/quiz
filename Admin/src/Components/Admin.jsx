import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import "./Admin.css";

function Admin() {

    const socket = useRef(null); //admin object
    const [index,setIndex]= useState(0);
    const questions = [
        {
            id:1,
            question: "Who has scored the most runs in ODI cricket?",
            option1: "Ricky Ponting",
            option2: "Virat Kohli",
            option3: "Sachin Tendulkar",
            option4: "Kumar Sangakkara"
        },
        {
            id:2,
            question: "Which country won the ICC Cricket World Cup in 2011?",
            option1: "India",
            option2: "Australia",
            option3: "Sri Lanka",
            option4: "Pakistan"
        },
        {
            id:3,
            question: "Who holds the record for the fastest century in ODI cricket?",
            option1: "AB de Villiers",
            option2: "Chris Gayle",
            option3: "Shahid Afridi",
            option4: "Glenn Maxwell"
        },
        {
            id:4,
            question: "In which year was the first ever Test match played?",
            option1: "1877",
            option2: "1882",
            option3: "1890",
            option4: "1901"
        },
        {
            id:5,
            question: "Which bowler has taken the most wickets in Test cricket?",
            option1: "Muttiah Muralitharan",
            option2: "Shane Warne",
            option3: "James Anderson",
            option4: "Anil Kumble"
        }
    ];
    const [noMoreQuestions, setNoMoreQuestions] = useState(false);

    
    useEffect(()=>{
        socket.current = io('http://localhost:5000');
        socket.current.on('connect',()=>{
            console.log('Admin connected'+socket.current.id);
        });
        return () => {
            socket.current.disconnect();
            console.log(" Socket disconnected");
        };

    } ,[])

    const sendQuestion = () =>{
        if(index < questions.length){
            socket.current.emit('send-question' , questions[index]);
            setIndex((index)=>index+1);
            console.log("sending question");
        } 
        

        if(index == questions.length){
            socket.current.emit('quiz-completed',"Quizz is Completed Thanks for the participation");
            setNoMoreQuestions(true);
        }
    }
        
    return (
        <div className='admin-container'>
            <h1>This is Admin</h1>
            <div className = 'admin'>
                <h2>Total Questions are {questions.length}</h2>
                {
                    noMoreQuestions?<div>
                        <h1>No more Questions Quiz Completed</h1>
                    </div>
                    :
                    <button onClick={sendQuestion}>
                        {
                            index < questions.length?
                            `send QuestionNumber ${index+1}`:
                            "End Quiz"
                        }
                    </button>
                }
            </div>
        </div>
    )
 
}

export default Admin