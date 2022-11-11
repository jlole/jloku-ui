import { React, useEffect, useState, useCallback } from 'react';
import { getApiGameUrl, formatDate, calculateNextTile } from '../functions';
import ControlArea from './board/ControlArea'
import Dialog from './board/Dialog';
import Board from './board/Board'
import Timer from "./board/Timer"

const Game = ({difficulty}) => {
  const [noteMode, setNoteMode] = useState(false);
  const [selectedTile, setSelectedTile] = useState(false);
  const [givenPuzzle, setGivenPuzzle] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [solvedPuzzle, setSolvedPuzzle] = useState(null);
  const [notes, setNotes] = useState(new Array(25).fill('00000'));
  const [showOverlay, setShowOverlay] = useState(true);
  const [seconds, setSeconds] = useState(null);

  var puzzleIsSolved = givenPuzzle && currentPuzzle && solvedPuzzle === currentPuzzle;
  var tileIsGiven = givenPuzzle && givenPuzzle.charAt(selectedTile) !== '0';

  var disabledNumbers = '';
  if (selectedTile === false || tileIsGiven === true ) {
    disabledNumbers = '12345';
  } else if (currentPuzzle) {
    for( let i = 1; i <= 5; i++ ) {
      if ((currentPuzzle.split(i).length - 1) === 5) disabledNumbers += ( i + '');
    }
  }

  // // Start a new game
  const newGame = useCallback(() => {
    const getNewPuzzleUrl = getApiGameUrl(difficulty);
    fetch(getNewPuzzleUrl)
      .then((response) => response.json())
      .then((data) => {
        setCurrentPuzzle(data.puzzle);
        setGivenPuzzle(data.puzzle);
        setSolvedPuzzle(data.solution);
        setNotes(new Array(25).fill('00000'));
        setShowOverlay(true);
      });
    }, [difficulty]
  );

  // // Rest notes in a tile
  const eraseNotesFromTile = useCallback((selectedTile) => {
    let notesCopy = [...notes];
    notesCopy[selectedTile] = '00000';
    setNotes( notesCopy );
  }, [notes]);

  const clickControl = useCallback(i => {
    // Toggle note mode
    if (i === 'N') {
      setNoteMode(noteMode => ! noteMode);
    }
    // Don't do anything else if the puzzle is solved
    if (puzzleIsSolved) return;
    // Erase tile
    if (i === 'E' && ! tileIsGiven) {
      setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, '0'));
      eraseNotesFromTile(selectedTile);
    }
    let numberEntered = "12345".includes(i);
    // Fill in number
    if (numberEntered && ! noteMode && ! disabledNumbers.includes(i)) {
      setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, i));
      eraseNotesFromTile(selectedTile);
    }
    // Fill in note
    if (numberEntered && noteMode && !tileIsGiven) {
      setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, '0'));
      let notesCopy = [...notes]
      notesCopy[selectedTile] = notesCopy[selectedTile].replaceAt(i - 1, (notes[selectedTile].charAt(i-1) === '0' ? i : '0') );
      setNotes( notesCopy );
    }
  }, [disabledNumbers, noteMode, eraseNotesFromTile, selectedTile, tileIsGiven, puzzleIsSolved, notes]);
  
  const keypressTile = useCallback((e) => {
    let arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'a', 's', 'd'];
    if (arrows.includes(e.key)) {
      setSelectedTile(calculateNextTile(selectedTile, e.key));
      return;
    }
    if ("12345".includes(e.key)) clickControl(e.key);
    else if (e.key === 'Backspace') clickControl('E');
    else if (e.key === ' ') clickControl('N');
  }, [selectedTile, clickControl]);

  // // Keypress event listener (Updates when different tile selected)
  useEffect( () => {
    const keyEventCallback = event => { keypressTile( event ) };
    document.addEventListener('keydown', keyEventCallback);
    return () => {
      document.removeEventListener('keydown', keyEventCallback);
    }
  }, [keypressTile]);

  // // // Check for solved puzzle
  useEffect( () => {
    if (currentPuzzle && solvedPuzzle && currentPuzzle === solvedPuzzle) {
      setShowOverlay(true)
    }
  }, [currentPuzzle, solvedPuzzle]);

  // // Update local storage
  useEffect( () => {
    if (currentPuzzle) {
      let code = 'jloku-game-' + (difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty);
      let localGame = {}
      
      localGame.currentPuzzle = currentPuzzle;
      localGame.givenPuzzle = givenPuzzle;
      localGame.solution = solvedPuzzle;
      localGame.notes = notes;
      localGame.seconds = seconds;
      localStorage.setItem(code, JSON.stringify(localGame));
    }
  }, [difficulty, currentPuzzle, givenPuzzle, solvedPuzzle, notes, seconds]);

  // Load the puzzle
  useEffect( () => {
    let code = 'jloku-game-' + (difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty);
    let localGame = JSON.parse(localStorage.getItem(code));

    if (localGame) {
      setCurrentPuzzle(localGame.currentPuzzle);
      setGivenPuzzle(localGame.givenPuzzle);
      setSolvedPuzzle(localGame.solution);
      setNotes(localGame.notes);
      setSeconds(localGame.seconds);
    } else {
      newGame();
    }
  }, [newGame, difficulty]);

  return (
    <div className="game">
      <Dialog currentPuzzle={currentPuzzle} overlay={showOverlay} setOverlay={i => setShowOverlay(i)} />
      <Timer seconds={seconds} setSeconds={i => setSeconds(i)} setOverlay={i => setShowOverlay(i)} puzzleIsSolved={puzzleIsSolved} overlay={showOverlay} />
      <div className="game-board">
        <Board onClick={i => setSelectedTile(i)} currentPuzzle={currentPuzzle} givenPuzzle={givenPuzzle} selectedTile={selectedTile} notes={notes} />
      </div>

      {puzzleIsSolved && 
        <div className='solved no-select'>
          You solved it!
          {difficulty !== 'daily' && 
            <>&nbsp;<span className='new-game' onClick={() => newGame(difficulty)}>New game</span></>}
        </div>
      }
      <div className="game-controls">
        <ControlArea onClick={i => clickControl(i)} noteMode={noteMode} disabledNumbers={disabledNumbers} />
      </div>
    </div>
  );
}

export default Game;
