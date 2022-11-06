import React from 'react';
import Control from './Control'

const ControlArea = props => {
  const renderNumber = i => {
    return (
      <Control
        onClick={() => props.onClick(i)}
        id={i}
        key={i}
        editMode={props.editMode}
        selectedIsGiven={props.selectedIsGiven}
        selectedTile={props.selectedTile}
      />
    );
  }

  let buttons = [];
  for (let i = 1; i <= 5; i++) {
    buttons.push(renderNumber(i));
  }
  buttons.push(renderNumber('E'));
  buttons.push(renderNumber('N'));
  
  return (
    <div className="control-numbers">{buttons}</div>
  )
}

export default ControlArea
