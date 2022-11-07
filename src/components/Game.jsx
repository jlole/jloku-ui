import React from 'react';
import Board from './board/Board'
import Dialog from './board/Dialog';
import Timer from "./board/Timer"
import { useEffect, useState } from 'react';
import ControlArea from './board/ControlArea'
import {getApiGameUrl, numberIsFullyUsed} from '../functions';


const Game = ({difficulty}) => {

  const [editMode, setEditMode] = useState(false);
  const [selectedTile, setSelectedTile] = useState(false);
  const [selectedIsGiven, setSelectedIsGiven] = useState(false);
  const [givenPuzzle, setGivenPuzzle] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [disabledNumbers, setDisabledNumbers] = useState('');
  const [notes, setNotes] = useState(new Array(25).fill('00000'));
  const [solved, setSolved] = useState(false);

  useEffect( () => {
    if ( currentPuzzle && solution && currentPuzzle === solution ) {
      setSolved(true)
    }

    if ( currentPuzzle ) {
      let disabledNumbers = ''
      for( let i = 0; i < 5; i++ ) {
        if ((currentPuzzle.split(i).length - 1) === 5) {
          disabledNumbers += i + ''
        }
      }
      setDisabledNumbers( disabledNumbers )
      localStorage.setItem('givenPuzzle-' + difficulty, givenPuzzle)
      localStorage.setItem('currentPuzzle-' + difficulty, currentPuzzle)
      localStorage.setItem('solution-' + difficulty, solution)
    }
  }, [currentPuzzle])

  // Keypress event listener
  useEffect( () => {
    const keyEventCallback = event => {
      keypressTile( event )
    };
    document.addEventListener('keydown', keyEventCallback)
    return () => {
      document.removeEventListener('keydown', keyEventCallback);
    }
  })

  // Load the puzzle
  useEffect( () => {
    const controller = new AbortController();
    
    let _givenPuzzle = localStorage.getItem('givenPuzzle-' + difficulty)
    let _currentPuzzle = localStorage.getItem('currentPuzzle-' + difficulty)
    let _solution = localStorage.getItem('solution-' + difficulty)
    if ( _givenPuzzle && _currentPuzzle && _solution ) {
      setCurrentPuzzle(_currentPuzzle)
      setGivenPuzzle(_givenPuzzle)
      setSolution(_solution)
      document.querySelector('.game-loader').classList.remove('show')
    } else {
      
      const signal = controller.signal
      const game_url = getApiGameUrl(difficulty)
      fetch(game_url, {signal})
      .then((response) => response.json())
      .then((data) => {
        setCurrentPuzzle(data.puzzle)
        setGivenPuzzle(data.puzzle)
        setSolution(data.solution)
        document.querySelector('.game-loader').classList.remove('show')
      });
    }

    return () => {
      controller.abort();
    }
  }, [])

  const keypressTile = (e) => {
    if("12345".includes(e.key)){ 
      clickControl(e.key)
    } else if (e.key === 'Backspace') {
      clickControl('E')
    } else if (e.code === 'Space') {
      clickControl('N')
    }

    if ( e.code === 'ArrowLeft' ) {
      if ( selectedTile % 5 === 0 ) {
        setSelectedTile( selectedTile => selectedTile + 4 )
      } else {
        setSelectedTile( selectedTile => selectedTile - 1 )
      }
    } else if ( e.code === 'ArrowRight' ) {
      if ( selectedTile % 5 === 4 ) {
        setSelectedTile( selectedTile => selectedTile - 4 )
      } else {
        setSelectedTile( selectedTile => selectedTile + 1 )
      }
    } else if ( e.code === 'ArrowUp' ) {
      if ( selectedTile < 5 ) {
        setSelectedTile( selectedTile => selectedTile + 20 )
      } else {
        setSelectedTile( selectedTile => selectedTile - 5 )
      }
    } else if ( e.code === 'ArrowDown' ) {
      if ( selectedTile > 19 ) {
        setSelectedTile( selectedTile => selectedTile - 20 )
      } else {
        setSelectedTile( selectedTile => selectedTile + 5 )
      }
    }
  }

  useEffect( () => {
    if ( givenPuzzle ) {
      setSelectedIsGiven(givenPuzzle.charAt(selectedTile) !== '0')
    }
  }, [selectedTile])

  const click_tile = (i) => {
    setSelectedTile(i)
  }

  const eraseNotesFromTile = () => {
    let notesCopy = [...notes]
    notesCopy[selectedTile] = '00000'
    setNotes( notesCopy )
  }

  const clickControl = i => {
    if ( i === 'N' ) { // Toggle note mode
      setEditMode( editMode => ! editMode )
    } else if ( selectedTile !== false && selectedIsGiven === false ) {
      if ( i === 'E' ) { // Erase field
        setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, '0'))
        eraseNotesFromTile()
      } else if ("12345".includes(i)) {
        if ( editMode ) {
          setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, '0'))
          let notesCopy = [...notes]
          let currentNote = notesCopy[selectedTile].charAt(i-1)
          notesCopy[selectedTile] = notesCopy[selectedTile].replaceAt(i - 1, currentNote === '0' ? i : '0' )
          setNotes( notesCopy )
        } else if ( ! disabledNumbers.includes(i) ) {
          setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, i))
        }
      }
    }
  }

  return (
    <div className="game">
      <Dialog />
      <Timer solved={solved} />
      <div className="game-board">
        <Board
          onClick={i => click_tile(i)}
          currentPuzzle={currentPuzzle}
          givenPuzzle={givenPuzzle}
          selectedTile={selectedTile}
          notes={notes}
        />
      </div>
      {solved && (<div className='solved'>You solved it!</div>)}
      <div className="game-controls">
        <ControlArea
          onClick={i => clickControl(i)}
          editMode={editMode}
          currentPuzzle={currentPuzzle}
          selectedIsGiven={selectedIsGiven}
          selectedTile={selectedTile}
          disabledNumbers={disabledNumbers}
        />
      </div>
    </div>
  );
}

export default Game;
