import { React, useEffect, useState } from 'react';
import { BsPauseFill } from 'react-icons/bs';
import { visualTime } from '../../functions';

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
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  return (
    <div className='game-timer no-select'>
      {visualTime(props.seconds)}
      {! props.puzzleIsSolved &&
        <span className='game-timer-pause'>
          <BsPauseFill onClick={() => toggleTimer()} />
        </span>
      }
    </div>
  );
}

export default Timer;
