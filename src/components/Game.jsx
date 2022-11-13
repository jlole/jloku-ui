import { React, useEffect, useState, useCallback, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getApiGameUrl, formatDate, calculateNextTile, visualTime } from '../functions';
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
  const [showOverlay, setShowOverlay] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [dateAtLoad] = useState(formatDate(new Date(), '-'));
  const [copiedText, setCopiedText] = useState('share');

  const [history, setHistory] = useState({0:{notes:new Array(25).fill('00000')}});
  const [currentStep, setCurrentStep] = useState(0);

  // Start a new game
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

  // Rest notes in a tile
  const eraseNotesFromTile = useCallback((selectedTile) => {
    let notesCopy = [...history[currentStep].notes];
    notesCopy[selectedTile] = '00000';
    // setNotes( notesCopy );
    setHistory( history => {
      history[currentStep] = notesCopy;
      return history;
    } );
  }, [history[currentStep].notes]);

  const clickControl = useCallback(i => {
    // Toggle note mode
    if (i === 'N') {
      setNoteMode(noteMode => ! noteMode);
    }
    // Don't do anything else if the puzzle is solved
    if (puzzleIsSolved) return;
    // Erase tile
    if (i === 'E' && ! tileIsGiven) {
      setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(history[currentStep].selectedTile, '0'));
      eraseNotesFromTile(history[currentStep].selectedTile);
    }
    let numberEntered = "12345".includes(i);
    // Fill in number
    if (numberEntered && ! noteMode && ! disabledNumbers.includes(i)) {
      setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(history[currentStep].selectedTile, i));
      eraseNotesFromTile(history[currentStep].selectedTile);
    }
    // Fill in note
    if (numberEntered && noteMode && !tileIsGiven) {
      setCurrentPuzzle(currentPuzzle => currentPuzzle.replaceAt(history[currentStep].selectedTile, '0'));
      let notesCopy = [...history[currentStep].notes]
      notesCopy[history[currentStep].selectedTile] = notesCopy[history[currentStep].selectedTile].replaceAt(i - 1, (history[currentStep].notes[history[currentStep].selectedTile].charAt(i-1) === '0' ? i : '0') );
      setNotes( notesCopy );
    }
  }, [disabledNumbers, noteMode, eraseNotesFromTile, history[currentStep].selectedTile, tileIsGiven, puzzleIsSolved, history[currentStep].notes]);
  
  const keypressTile = useCallback((e) => {
    let arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'a', 's', 'd'];
    if (arrows.includes(e.key)) {
      setSelectedTile(calculateNextTile(history[currentStep].selectedTile, e.key));
      return;
    }
    if ("12345".includes(e.key)) clickControl(e.key);
    else if (e.key === 'Backspace') clickControl('E');
    else if (e.key === ' ') clickControl('N');
  }, [history[currentStep].selectedTile, clickControl]);

  // Keypress event listener (Updates when different tile selected)
  useEffect( () => {
    const keyEventCallback = event => { keypressTile( event ) };
    document.addEventListener('keydown', keyEventCallback);
    return () => {
      document.removeEventListener('keydown', keyEventCallback);
    }
  }, [keypressTile]);

  // Update local storage
  useEffect( () => {
    if (history[currentStep].currentPuzzle) {
      let code = 'jloku-game-' + (difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty);
      let localGame = {}

      localGame.currentPuzzle = history[currentStep].currentPuzzle;
      localGame.givenPuzzle = history[currentStep].givenPuzzle;
      localGame.solvedPuzzle = history[currentStep].solvedPuzzle;
      localGame.notes = history[currentStep].notes;
      localGame.seconds = seconds;
      localStorage.setItem(code, JSON.stringify(localGame));
    }
  }, [difficulty, history[currentStep].currentPuzzle, history[currentStep].givenPuzzle, history[currentStep].solvedPuzzle, history[currentStep].notes, seconds]);

  // Load the puzzle
  useEffect( () => {
    let code = 'jloku-game-' + (difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty);
    let localGame = JSON.parse(localStorage.getItem(code));
    if (localGame && localGame.currentPuzzle && localGame.givenPuzzle && localGame.solvedPuzzle && localGame.notes && localGame.seconds) {
      setHistory({0 :localGame});
      setCurrentStep(0);
      // setCurrentPuzzle(localGame.currentPuzzle);
      // setGivenPuzzle(localGame.givenPuzzle);
      // setSolvedPuzzle(localGame.solvedPuzzle);
      // setNotes(localGame.notes);
      setSeconds(localGame.seconds);
      var puzzleIsSolved = localGame.solvedPuzzle === localGame.currentPuzzle;
      if (! puzzleIsSolved) {
        setShowOverlay(true);
      }
    } else {
      newGame();
      setShowOverlay(true);
    }
  }, [newGame, difficulty]);

  const dailyShareText = 'I solved the ' + dateAtLoad + ' Jloku daily puzzle in ' + visualTime(seconds) + "!\nhttps://jloku.click/";
  const copyShareLink = useRef(null);

  const copiedShareLink = useCallback( (copiedText) => {
    let oldText = copiedText;
    setCopiedText('copied');
    let interval = setInterval(() => {
      setCopiedText(oldText);
      clearInterval(interval)
    }, 1500);
  }, [])



  const current = history[currentStep]

  var puzzleIsSolved = givenPuzzle && current.currentPuzzle && solvedPuzzle === current.currentPuzzle;
  var tileIsGiven = givenPuzzle && givenPuzzle.charAt(selectedTile) !== '0';

  var disabledNumbers = '';
  if (selectedTile === false || tileIsGiven === true ) {
    disabledNumbers = '12345';
  } else if (currentPuzzle) {
    for( let i = 1; i <= 5; i++ ) {
      if ((currentPuzzle.split(i).length - 1) === 5) disabledNumbers += ( i + '');
    }
  }

  return (
    <div className="game">
      <Dialog currentPuzzle={current.currentPuzzle} overlay={showOverlay} setOverlay={i => setShowOverlay(i)} />
      <Timer seconds={seconds} setSeconds={i => setSeconds(i)} setOverlay={i => setShowOverlay(i)} puzzleIsSolved={puzzleIsSolved} overlay={showOverlay} />
      <div className="game-board">
        <Board onClick={i => setSelectedTile(i)} currentPuzzle={current.currentPuzzle} givenPuzzle={current.givenPuzzle} selectedTile={current.selectedTile} notes={current.notes} />
      </div>

      {puzzleIsSolved && 
        <div className='solved no-select'>
          You solved the daily puzzle!<br/>
          {difficulty === 'daily' && 
            <CopyToClipboard text={dailyShareText} onCopy={() => copiedShareLink(copiedText)}>
              <span className='copy-share-link' ref={copyShareLink}>{copiedText}</span>
            </CopyToClipboard>
            }
          {difficulty !== 'daily' && 
            <span className='new-game' onClick={() => newGame(difficulty)}>New game</span>}
        </div>
      }
      {! puzzleIsSolved &&
        <div className="game-controls">
          <ControlArea onClick={i => clickControl(i)} noteMode={noteMode} disabledNumbers={disabledNumbers} />
        </div>
      }
    </div>
  );
}

export default Game;
