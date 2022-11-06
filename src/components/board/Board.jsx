import React from 'react'
import Tile from './Tile';

const Board = props => {
  
  const renderSquare = (i) => {
    return (
      <Tile
        onClick={() => props.onClick(i)}
        id={i}
      />
    );
  }

  return (
    <table className='game-board'>
      <tbody>
        <tr>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
        </tr>
        <tr>
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
          {renderSquare(9)}
        </tr>
        <tr>
          {renderSquare(10)}
          {renderSquare(11)}
          {renderSquare(12)}
          {renderSquare(13)}
          {renderSquare(14)}
        </tr>
        <tr>
          {renderSquare(15)}
          {renderSquare(16)}
          {renderSquare(17)}
          {renderSquare(18)}
          {renderSquare(19)}
        </tr>
        <tr>
          {renderSquare(20)}
          {renderSquare(21)}
          {renderSquare(22)}
          {renderSquare(23)}
          {renderSquare(24)}
        </tr>
      </tbody>
    </table>
  );
}

export default Board;
