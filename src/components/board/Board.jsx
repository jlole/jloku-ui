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

  if ( props.currentPuzzle ) {
    var rows = []
    for ( let i = 0; i < 5; i++ ) {
      let cols = []
      for ( let j = 0; j < 5; j++ ) {
        let index = (i * 5) + j
        let value = props.currentPuzzle.charAt(index)
        let given = props.givenPuzzle.charAt(index) !== '0'
        cols.push(renderSquare(index, value, given))
      }
      rows.push((<tr key={i}>{cols}</tr>))
    }
  }

  return (
    <table className='game-board'>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export default Board;
