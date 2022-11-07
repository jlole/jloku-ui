import { React, useEffect, useState, useCallback } from 'react';
import { getApiGameUrl, formatDate, calculateNextTile } from '../functions';
import ControlArea from './board/ControlArea'
import Dialog from './board/Dialog';
import Board from './board/Board'
import Timer from "./board/Timer"

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
  const [overlay, setOverlay] = useState(true);

  // Start a new game
  const newGame = useCallback((dif) => {
    const game_url = getApiGameUrl(dif);
    fetch(game_url)
      .then((response) => response.json())
      .then((data) => {
        setCurrentPuzzle(data.puzzle);
        setGivenPuzzle(data.puzzle);
        setSolution(data.solution);
        setNotes(new Array(25).fill('00000'));
        setSolved(false);
        setOverlay(true);
      });
    }, []
  );

  // Rest notes in a tile
  const eraseNotesFromTile = useCallback((selectedTile, notes) => {
    let notesCopy = [...notes];
    notesCopy[selectedTile] = '00000';
    setNotes( notesCopy );
  }, []);

  // Check for solved puzzle
  useEffect( () => {
    if ( currentPuzzle && solution && currentPuzzle === solution ) {
      setSolved(true);
      setOverlay(false)
    }
  }, [currentPuzzle, solution]);

  // Update local storage
  useEffect( () => {
    if ( currentPuzzle ) {
      let code = difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty;
      if ( difficulty === 'daily' ) {
        code = code + '-' + formatDate(new Date());
      }
      localStorage.setItem(code + '-currentPuzzle', currentPuzzle);
      localStorage.setItem(code + '-givenPuzzle', givenPuzzle);
      localStorage.setItem(code + '-solution', solution);
      localStorage.setItem(code + '-notes', JSON.stringify(notes));
    }
  }, [difficulty, currentPuzzle, givenPuzzle, solution, notes]);

  // Update the disabled controls
  useEffect( () => {
    if (selectedTile === false || selectedIsGiven === true) {
      setDisabledNumbers( '12345' );
      return;
    }

    if ( currentPuzzle ) {
      let disabledNumbers = '';
      for( let i = 1; i <= 5; i++ ) {
        if ((currentPuzzle.split(i).length - 1) === 5) disabledNumbers += ( i + '');
      }
      setDisabledNumbers( disabledNumbers );
    }
  }, [selectedIsGiven, selectedTile, currentPuzzle, disabledNumbers]);


  // Load the puzzle
  useEffect( () => {
    let code = difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty;
    let localCurrentPuzzle = localStorage.getItem(code + '-currentPuzzle');
    let localGivenPuzzle = localStorage.getItem(code + '-givenPuzzle');
    let localSolution = localStorage.getItem(code + '-solution');
    let localNotes = localStorage.getItem(code + '-notes');
    if ( localGivenPuzzle && localCurrentPuzzle && localSolution && localNotes ) {
      setCurrentPuzzle(localCurrentPuzzle);
      setGivenPuzzle(localGivenPuzzle);
      setSolution(localSolution);
      setNotes(JSON.parse(localNotes));
    } else {
      newGame(difficulty);
    }
  }, [difficulty, newGame]);

  useEffect( () => {
    if ( givenPuzzle ) {
      setSelectedIsGiven(givenPuzzle.charAt(selectedTile) !== '0');
    }
  }, [selectedTile, givenPuzzle]);

  const clickControl = useCallback(i => {
    if ( i === 'R' ) { // Toggle note mode
      setSolved(true);
    }
    if ( i === 'N' ) { // Toggle note mode
      setEditMode( editMode => ! editMode );
    } else if ( ! solved ) {
      if (i === 'E' && ! selectedIsGiven) { // Erase field
        setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, '0'));
        eraseNotesFromTile(selectedTile, notes);
      } else if ("12345".includes(i)) {
        if (editMode) {
          setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, '0'));
          let notesCopy = [...notes];
          let currentNote = notesCopy[selectedTile].charAt(i-1);
          notesCopy[selectedTile] = notesCopy[selectedTile].replaceAt(i - 1, currentNote === '0' ? i : '0' );
          setNotes( notesCopy );
        } else if ( ! disabledNumbers.includes(i) ) {
          setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(selectedTile, i));
        }
      }
    }
  }, [disabledNumbers, editMode, eraseNotesFromTile, notes, selectedTile, solved, selectedIsGiven]);
  
  const keypressTile = useCallback((e) => {
    let arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'a', 's', 'd'];
    if (arrows.includes(e.key)) {
      setSelectedTile(calculateNextTile(selectedTile, e.key));
      return;
    }

    let code = e.key;
    if ("12345".includes(e.key)) code = e.key;
    else if (e.key === 'Backspace') code = 'E';
    else if (e.key === ' ') code = 'N';
    
    clickControl(code);
  }, [selectedTile, clickControl]);

  // Keypress event listener (Updates when different tile selected)
  useEffect( () => {
    const keyEventCallback = event => { keypressTile( event ) };
    document.addEventListener('keydown', keyEventCallback);
    return () => {
      document.removeEventListener('keydown', keyEventCallback);
    }
  }, [keypressTile]);
  
  return (
    <div className="game">
      <Dialog 
        currentPuzzle={currentPuzzle}
        overlay={overlay}
        setOverlay={i => setOverlay(i)}
        />
      <Timer solved={solved} />
      <div className="game-board">
        <Board
          onClick={i => setSelectedTile(i)}
          currentPuzzle={currentPuzzle}
          givenPuzzle={givenPuzzle}
          selectedTile={selectedTile}
          notes={notes}
        />
      </div>
      {solved && 
        <div className='solved no-select'>
          You solved it!
          { difficulty !== 'daily' && 
            <>&nbsp;<span className='new-game' onClick={() => newGame(difficulty)}>New game</span></>}
        </div>
      }
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
