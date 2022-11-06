
import React from 'react';
import Board from './board/Board'
import Dialog from './board/Dialog';
import { useEffect } from 'react';
import ControlArea from './board/ControlArea'
import {getApiGameUrl, numberIsFullyUsed} from '../functions';


const Game = ({difficulty}) => {

  useEffect( () => {

    const keyEventCallback = event => {
      keypress_tile( event )
    };

    document.addEventListener('keydown', keyEventCallback)

    toggle_number_controls();
    let game_url = getApiGameUrl(difficulty)

    const controller = new AbortController();
    const signal = controller.signal

    fetch(game_url, {signal})
    .then((response) => response.json())
    .then((data) => {
      let tiles = document.querySelectorAll('.game-board td')
      data.forEach((data_row,row) => {
        data_row.forEach((data_col, col) => {
          if ( data_col !== 0 ) {
            let tile = tiles[(row * 5) + col]
            tile.innerHTML = data_col
            tile.classList.add('given-number')
          }
        });
      })
      document.querySelector('.game-loader').classList.remove('show')
    });

    return () => {
      document.removeEventListener('keydown', keyEventCallback);
      controller.abort();
    }
  })

  const keypress_tile = e => {
    // console.log(e)
    if(e.key === '1'){
      click_control(1)
    } else if (e.key === '2') {
      click_control(2)
    } else if (e.key === '3') {
      click_control(3)
    } else if (e.key === '4') {
      click_control(4)
    } else if (e.key === '5') {
      click_control(5)
    } else if (e.key === 'Backspace') {
      click_control('E')
    }
  }

  const toggle_number_controls = () => {
    let numbers = document.querySelectorAll('.control-number')
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


  const click_tile = i => {
    let selected_tile = document.querySelector('.selected-tile')
    selected_tile && selected_tile.classList.remove('selected-tile')
    let tile = document.getElementById('tile-' + i)
    tile && tile.classList.add('selected-tile')
    toggle_number_controls()
  }

  const click_control = i => {
    let selected_tile = document.querySelector('.selected-tile')
    if ( selected_tile && ! selected_tile.classList.contains('given-number') ) {
      if ( i === 'E' ) {
        selected_tile.innerHTML = ''
      } else {
        selected_tile.innerHTML = i
      }
    }
    toggle_number_controls()
  }

  return (
    <div onKeyPress={e => keypress_tile(e)} className="game">
      <Dialog />
      <div className="game-board" onKeyPress={e => keypress_tile(e)}>
        <Board
          onClick={i => click_tile(i)}
        />
      </div>
      <div className="game-controls">
        <ControlArea
          onClick={i => click_control(i)}
        />
      </div>
    </div>
  );
}

export default Game;
