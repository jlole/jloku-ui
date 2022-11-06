import React from 'react';
import Control from './Control'

class ControlArea extends React.Component {
  renderNumber(i) {
    return (
      <Control
        onClick={() => this.props.onClick(i)}
        id={i}
        key={i}
        editMode={this.props.editMode}
        selectedIsGiven={this.props.selectedIsGiven}
        selectedTile={this.props.selectedTile}
      />
    );
  }

  render() {
    let buttons = [];
    for (let i = 1; i <= 5; i++) {
      buttons.push(this.renderNumber(i));
    }
    buttons.push(this.renderNumber('E'));
    buttons.push(this.renderNumber('N'));
    return (
      <div className="control-numbers">{buttons}</div>
    );
  }
}

export default ControlArea
