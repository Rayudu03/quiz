import React from 'react'
import { useState , useRef } from 'react';
import { io } from 'socket.io-client';
import "./LeaderBoard.css";
import { useEffect } from 'react';

function LeaderBoard() {
  let n = 5;
  const divs = [];

  const socket = useRef(null);
  const[questionNumber,setQuestionNumber] = useState(0);
  const[collection,setCollection]  = useState([]);

  useEffect(()=>{
    socket.current = io('http://localhost:5000');
    socket.current.on('connect',()=>{
      console.log('Main screen '+socket.current.id);
    });

    socket.current.on('receive-collection' , (collection)=>{
      console.log(collection);
      setCollection(collection);
    });

    return () => {
      socket.current.disconnect();
    };
  },[])

  const loadCollection = (e) =>{
    socket.current.emit('send-questionNumber' , e.target.value);
  }

  for(let i = 1; i<=n;  i++){
    let div = <div key={i} id={i}><button value={i} onClick={loadCollection}>Question {i}</button></div>
    divs.push(div);
  }
  return (
    <div className='leader-board-container'>
      <h1 >Leader Board</h1>
      <div className='winners'>
        <div className='questions-board'>{divs}</div>
        <div className='leader-board'>
          <h1>Who answered first</h1>
          <div className='object-conatiner'>
            {collection.map((obj) => {
              return (
                <div key={obj._id} className='single-obj'>
                  <p>{obj.username}</p>
                  <p>{obj.selectedOption}</p>
                  <p>{obj.submittedAt}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  )
}

export default LeaderBoard;