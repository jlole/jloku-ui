import { React, useEffect, useState } from 'react';
import { BsPauseFill } from 'react-icons/bs';

function Timer(props) {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect( () => {
    if ( props.overlay === false && props.puzzleIsSolved === false ) {
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [props.overlay, props.puzzleIsSolved]);

  const toggleTimer = () => {
    props.setOverlay(true)
  }

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
    let visualMinutes = Math.floor(seconds / 60);
    let visualSeconds = seconds - visualMinutes * 60;
    return visualMinutes + ':' + visualSeconds.toString().padStart(2, '0');
  }

  return (
    <div className='game-timer no-select'>
      {visualTime(seconds)} <span className='game-timer-pause'><BsPauseFill onClick={() => toggleTimer()} /></span>
    </div>
  );
}

export default Timer;
