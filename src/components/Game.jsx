import { React, useEffect, useState, useCallback, useRef } from 'react';
import { getApiGameUrl, formatDate, calculateNextTile, visualTime, updateHistory } from '../functions';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ControlArea from './board/ControlArea'
import Dialog from './board/Dialog';
import Board from './board/Board'
import Timer from "./board/Timer"

const Game = ({difficulty}) => {
  const [noteMode, setNoteMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [seconds, setSeconds] = useState(null);
  const [dateAtLoad] = useState(formatDate(new Date(), '-'));
  const [copiedText, setCopiedText] = useState('share');
  const [selectedTile, setSelectedTile] = useState(false);
  const [history, setHistory] = useState({0:{notes:new Array(25).fill('00000')}});
  const [currentStep, setCurrentStep] = useState(0);

  const current = history[currentStep]
  const puzzleIsSolved = history.givenPuzzle && current.currentPuzzle && history.solution === current.currentPuzzle;
  const tileIsGiven = history.givenPuzzle && history.givenPuzzle.charAt(selectedTile) !== '0';

  var disabledNumbers = '';
  if (selectedTile === false || tileIsGiven === true ) {
    disabledNumbers = '12345';
  } else if (current['currentPuzzle']) {
    for( let i = 1; i <= 5; i++ ) {
      if ((current.currentPuzzle.split(i).length - 1) === 5) disabledNumbers += ( i + '');
    }
  }
  if ( currentStep === 0 ) {
    disabledNumbers += 'U';
  }

  // Start a new game
  const newGame = useCallback(() => {
    const getNewPuzzleUrl = getApiGameUrl(difficulty);
    fetch(getNewPuzzleUrl)
      .then((response) => response.json())
      .then((data) => {
        setCurrentStep(0);
        setHistory({"givenPuzzle": data.puzzle, "solution": data.solution, 0: {'currentPuzzle': data.puzzle, 'notes': new Array(25).fill('00000')}});
        setShowOverlay(true);
      });
    }, [difficulty]
  );

  // Reset notes in a tile
  const eraseNotesFromTile = useCallback(selectedTile => {
    let notesCopy = [...current.notes];
    notesCopy[selectedTile] = '00000';
    return notesCopy;
  }, [current]);

  const clickControl = useCallback(i => {
    // Toggle note mode
    if (i === 'N') {
      setNoteMode(noteMode => ! noteMode);
      return;
    }
    // Undo
    if (i === 'U' && currentStep > 0) {
      setCurrentStep(currentStep => currentStep - 1);
      return;
    }

    let eraseTile = current.currentPuzzle.replaceAt(selectedTile, '0');
    let eraseNote = eraseNotesFromTile(selectedTile);

    // Don't do anything else if the puzzle is solved
    if (puzzleIsSolved) return;

    // Erase tile
    if (i === 'E' && ! tileIsGiven) {
      setHistory(updateHistory(history, currentStep, eraseTile, eraseNote));
      setCurrentStep(currentStep => currentStep + 1);
    }

    let numberEntered = "12345".includes(i);

    // Fill in number
    if (numberEntered && ! noteMode && ! disabledNumbers.includes(i)) {
      setHistory(updateHistory(history, currentStep, current.currentPuzzle.replaceAt(selectedTile, i), eraseNote));
      setCurrentStep(currentStep => currentStep + 1);
    }

    // Fill in note
    if (numberEntered && noteMode && !tileIsGiven) {
      let notesCopy = [...current.notes];
      notesCopy[selectedTile] = notesCopy[selectedTile].replaceAt(i - 1, (notesCopy[selectedTile].charAt(i-1) === '0' ? i : '0') );
      setHistory(updateHistory(history, currentStep, eraseTile, notesCopy));
      setCurrentStep(currentStep => currentStep + 1);
    }
  }, [disabledNumbers, noteMode, eraseNotesFromTile, selectedTile, tileIsGiven, puzzleIsSolved, history, current, currentStep]);
  
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

  // Keypress event listener
  useEffect( () => {
    const keyEventCallback = event => keypressTile( event );
    document.addEventListener('keydown', keyEventCallback);
    return () => {
      document.removeEventListener('keydown', keyEventCallback);
    }
  }, [keypressTile]);

  // Update local storage
  useEffect( () => {
    if (current['currentPuzzle']) {
      let code = 'jloku-a-' + (difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty);
      let localGame = {}
      localGame.currentPuzzle = current['currentPuzzle'];
      localGame.givenPuzzle = history['givenPuzzle'];
      localGame.solution = history['solution'];
      localGame.notes = current.notes;
      localGame.seconds = seconds;
      localStorage.setItem(code, JSON.stringify(localGame));
    }
  }, [difficulty, history, current, seconds]);

  // Load the puzzle
  useEffect( () => {
    let code = 'jloku-a-' + (difficulty === 'daily' ? difficulty + '-' + formatDate(new Date()) : difficulty);
    let localGame = JSON.parse(localStorage.getItem(code));
    if (localGame && localGame.currentPuzzle && localGame.givenPuzzle && localGame.solution && localGame.notes) {
      setHistory({"givenPuzzle": localGame.givenPuzzle, "solution": localGame.solution, 0: {'currentPuzzle': localGame.currentPuzzle, 'notes': localGame.notes}});
      setCurrentStep(0);
      setSeconds(localGame.seconds);
      var puzzleIsSolved = localGame.solution === localGame.currentPuzzle;
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


  return (
    <div className="game">
      <Dialog currentPuzzle={current.currentPuzzle} overlay={showOverlay} setOverlay={i => setShowOverlay(i)} />
      <Timer seconds={seconds} setSeconds={i => setSeconds(i)} setOverlay={i => setShowOverlay(i)} puzzleIsSolved={puzzleIsSolved} overlay={showOverlay} />
      <div className="game-board">
        <Board onClick={i => setSelectedTile(i)} currentPuzzle={current.currentPuzzle} givenPuzzle={history.givenPuzzle} selectedTile={selectedTile} notes={current.notes} />
      </div>

      {puzzleIsSolved && 
        <div className='solved no-select'>
          {difficulty === 'daily' && 
            <div>You solved the daily puzzle!<br/>
              <CopyToClipboard text={dailyShareText} onCopy={() => copiedShareLink(copiedText)}>
                <span className='copy-share-link' ref={copyShareLink}>{copiedText}</span>
              </CopyToClipboard>
            </div>
            }
          {difficulty !== 'daily' && 
            <div>You solved the puzzle!<br/>
              <span className='new-game' onClick={() => newGame(difficulty)}>New game</span>
            </div>
          }  
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
