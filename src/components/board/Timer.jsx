import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BsPauseFill } from "react-icons/bs";

function Timer(props) {

  const [seconds, setSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  }

  // const startTimer = () => {
  //   setTimerRunning(true);
  // }

  // const stopTimer = () => {
  //   setTimerRunning(false);
  // }

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!timerRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, seconds]);

  const visualTime = ( seconds ) => {
    let visualMinutes = Math.floor(seconds / 60)
    let visualSeconds = seconds - visualMinutes * 60
    return visualMinutes + ':' + visualSeconds.toString().padStart(2, '0');
  }

  return (
    <div className='game-timer'>
      {visualTime(seconds)} <span className='game-timer-pause'><BsPauseFill onClick={() => toggleTimer()} /></span>
    </div>
  );
}

export default Timer;
