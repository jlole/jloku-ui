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
  
  const [notes, setNotes] = useState(new Array(25).fill('00000'));

  const [solved, setSolved] = useState(false);

  useEffect( () => {
    if ( currentPuzzle && solution && currentPuzzle === solution ) {
      alert('You solved it!')
      setSolved(true)
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
    const signal = controller.signal
    const game_url = getApiGameUrl(difficulty)
    fetch(game_url, {signal})
    .then((response) => response.json())
    .then((data) => {
      const puzzle = data.puzzle
      const solution = data.solution
      setCurrentPuzzle(puzzle)
      setGivenPuzzle(puzzle)
      setSolution(solution)
      document.querySelector('.game-loader').classList.remove('show')
    });

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

  const clickControl = e => {
    let i = e

    if ( typeof( e ) === 'object' ) {
      i = e.target.dataset.key
    }

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
        } else {
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
      <div className="game-controls">
        <ControlArea
          onClick={i => clickControl(i)}
          editMode={editMode}
          currentPuzzle={currentPuzzle}
          selectedIsGiven={selectedIsGiven}
          selectedTile={selectedTile}
        />
      </div>
    </div>
  );
}

export default Game;
