import React from 'react';
import Board from './board/Board'
import Dialog from './board/Dialog';
import Timer from "./board/Timer"
import { useEffect, useState } from 'react';
import ControlArea from './board/ControlArea'
import {getApiGameUrl, numberIsFullyUsed} from '../functions';


const Game = ({difficulty}) => {

  const [editMode, setEditMode] = useState(false);
  const [puzzleCode, setPuzzleCode] = useState(null);

  // Keypress event listener
  useEffect( () => {
    const keyEventCallback = event => {
      keypressTile( event )
    };
    document.addEventListener('keydown', keyEventCallback)
    return () => {
      document.removeEventListener('keydown', keyEventCallback);
    }
  }, [editMode])

  // Load the puzzle
  useEffect( () => {
    const controller = new AbortController();
    const signal = controller.signal

    let game_url = getApiGameUrl(difficulty)
    fetch(game_url, {signal})
    .then((response) => response.json())
    .then((data) => {
      // setPuzzleCode(data.puzzle)
      let puzzle = data.puzzle
      let row = null
      let col = null
      let tiles = document.querySelectorAll('.game-board td')
      for ( var i = 0; i < puzzle.length; i++ ) {
        row = Math.floor(i / 5)
        col = i % 5
        let tile = tiles[(row * 5) + col]
        if ( puzzle.charAt(i) !== '0' ) {
          tile.children.namedItem('tile-entry-'+tile.dataset.key).innerHTML = puzzle.charAt(i)
          tile.classList.add('given-number')
        }
      }
      document.querySelector('.game-loader').classList.remove('show')
    });

    toggle_number_controls();
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
  }

  const toggle_number_controls = () => {
    let numbers = document.querySelectorAll('.control-number:not(#number-N)')
    if ( numbers ) {
      let disable_buttons = document.querySelector('.selected-tile:not(.given-number)') === null
      numbers.forEach( numberTile => {
        if ( disable_buttons ) {
          numberTile.classList.add('disabled')
        } else {
          if ( numberIsFullyUsed( numberTile.dataset.key ) ) {
            numberTile.classList.add('disabled')
          } else {
            numberTile.classList.remove('disabled')
          }
        }
      })
    }
  }


  const click_tile = (i) => {
    let selected_tile = document.querySelector('.selected-tile')
    selected_tile && selected_tile.classList.remove('selected-tile')
    let tile = document.getElementById('tile-' + i)
    tile && tile.classList.add('selected-tile')
    toggle_number_controls()
  }

  const clickControl = i => {
    let selected_tile = document.querySelector('.selected-tile')

    if ( i === 'N' ) {
      setEditMode( editMode => ! editMode )
      if ( editMode ) {
        document.getElementById('number-N').classList.add('active')
      } else {
        document.getElementById('number-N').classList.remove('active')
      }
    } else if ( selected_tile && ! selected_tile.classList.contains('given-number') ) {
      if ( i === 'E' ) {
        let entry = document.querySelector('.selected-tile .entry')
        entry.innerHTML = ''
        let notes = selected_tile.children.namedItem('tile-notes-' + selected_tile.dataset.key).children
        Array.from(notes).forEach(el=>{
          el.classList.remove('show')
        });
      } else if ( "12345".includes(i) ) {
        if ( editMode ) {
          let note = document.querySelector('.selected-tile .notes .note-' + i)
          note.classList.toggle('show')
          let entry = document.querySelector('.selected-tile .entry')
          entry.innerHTML = ''
        } else {
          let notes = selected_tile.children.namedItem('tile-notes-' + selected_tile.dataset.key).children
          Array.from(notes).forEach(el=>{
            el.classList.remove('show')
          });
          let entry = document.querySelector('.selected-tile .entry')
          entry.innerHTML = i
        }
      }
    }
    toggle_number_controls()
  }

  return (
    <div className="game">
      <Dialog />
      <Timer />
      <div className="game-board">
        <Board
          onClick={i => click_tile(i)}
        />
      </div>
      <div className="game-controls">
        <ControlArea
          onClick={i => clickControl(i)}
          editMode={editMode}
        />
      </div>
    </div>
  );
}

export default Game;
