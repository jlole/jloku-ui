import React from 'react'
import Tile from './Tile';

const Board = props => {
  
  const renderSquare = (id, value, given) => {
    return (
      <Tile
        onClick={() => props.onClick(id)}
        selectedTile={props.selectedTile === id}
        notes={props.notes}
        value={value}
        key={id}
        id={id}
        given={given}
      />
    );
  }

  let _currentPuzzle = props.currentPuzzle ? props.currentPuzzle : '0000000000000000000000000'
  let _givenPuzzle = props.givenPuzzle ? props.givenPuzzle : '0000000000000000000000000'

  var rows = []
  for ( let i = 0; i < 5; i++ ) {
    let cols = []
    for ( let j = 0; j < 5; j++ ) {
      let index = (i * 5) + j
      let value = _currentPuzzle.charAt(index)
      let given = _givenPuzzle.charAt(index) !== '0'
      cols.push(renderSquare(index, value, given))
    }
    rows.push((<tr key={i}>{cols}</tr>))
  }

  return (
    <table className='game-board no-select'>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default Board;
