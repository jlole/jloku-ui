import { React, useEffect, useState } from 'react';
import { BsPauseFill } from 'react-icons/bs';

function Timer(props) {
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
        props.setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!timerRunning && props.seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, props.seconds]);

  const visualTime = ( seconds ) => {
    let visualMinutes = Math.floor(seconds / 60);
    let visualSeconds = seconds - visualMinutes * 60;
    return visualMinutes + ':' + visualSeconds.toString().padStart(2, '0');
  }

  return (
    <div className='game-timer no-select'>
      {visualTime(props.seconds)} <span className='game-timer-pause'><BsPauseFill onClick={() => toggleTimer()} /></span>
    </div>
  );
}

export default Timer;
