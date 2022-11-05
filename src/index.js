import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Tile(props) {
  return (
    <td className={"tile"} onClick={props.onClick} id={'tile-'+props.id}></td>
  );
}

function Number(props) {
  return (
    <div className="control-number" onClick={props.onClick} id={'number-'+props.id}>{props.id}</div>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Tile
        onClick={() => this.props.onClick(i)}
        id={i}
      />
    );
  }

  componentDidMount() {
    fetch('/api/get_daily_board')
    .then((response) => response.json())
    .then((data) => {
      let tiles = document.querySelectorAll('.game-board td')
      data.map((v,row)=>{
        v.map( ( value,col ) => {
          if ( value != 0 ) {
            let tile = tiles[(row * 5)+col]
            tile.innerHTML = value
            tile.classList.add('given-number')
          }
        });
      })
    });
  }

  render() {
    return (
      <table className='game-board'>
        <tbody>
          <tr>
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            {this.renderSquare(3)}
            {this.renderSquare(4)}
          </tr>
          <tr>
            {this.renderSquare(5)}
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            {this.renderSquare(9)}
          </tr>
          <tr>
            {this.renderSquare(10)}
            {this.renderSquare(11)}
            {this.renderSquare(12)}
            {this.renderSquare(13)}
            {this.renderSquare(14)}
          </tr>
          <tr>
            {this.renderSquare(15)}
            {this.renderSquare(16)}
            {this.renderSquare(17)}
            {this.renderSquare(18)}
            {this.renderSquare(19)}
          </tr>
          <tr>
            {this.renderSquare(20)}
            {this.renderSquare(21)}
            {this.renderSquare(22)}
            {this.renderSquare(23)}
            {this.renderSquare(24)}
          </tr>
        </tbody>
      </table>
    );
  }
}

class Controls extends React.Component {
  renderNumber(i) {
    return (
      <Number
        onClick={() => this.props.onClick(i)}
        id={i}
      />
    );
  }

  render() {
    return (
      <div className="control-numbers">
        {this.renderNumber(1)}
        {this.renderNumber(2)}
        {this.renderNumber(3)}
        {this.renderNumber(4)}
        {this.renderNumber(5)}
        {this.renderNumber('E')}
      </div>
    );
  }
}

class Game extends React.Component {
  
  handleClick(i) {
    let selected_tile = document.querySelector('.selected-tile')
    selected_tile && selected_tile.classList.remove('selected-tile')
    let tile = document.getElementById('tile-' + i)
    tile && tile.classList.add('selected-tile')
  }

  handleClickControls(i) {
    let selected_tile = document.querySelector('.selected-tile')
    if ( ! selected_tile.classList.contains('given-number') ) {
      if ( i == 'E' ) {
        selected_tile.innerHTML = ''
      } else {
        selected_tile.innerHTML = i
      }
    }
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
        {/* <div className='start-game'></div> */}
          <Board
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-controls">
          <Controls
            onClick={i => this.handleClickControls(i)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
