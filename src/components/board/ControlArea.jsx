import React from 'react';
import Control from './Control'

class ControlArea extends React.Component {
  renderNumber(i) {
    return (
      <Control
        onClick={() => this.props.onClick(i)}
        id={i}
        key={i}
      />
    );
  }

  render() {
    let buttons = [];
    for (let i = 1; i <= 5; i++) {
      buttons.push(this.renderNumber(i));
    }
    buttons.push(this.renderNumber('E'));
    return (
      <div className="control-numbers">{buttons}</div>
    );
  }
}

export default ControlArea
