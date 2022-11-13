import React from 'react';
import Control from './Control'

const ControlArea = props => {
  const renderNumber = i => {
    return (
      <Control
        key={i}
        id={i}
        onClick={() => props.onClick(i)}
        noteMode={props.noteMode}
        disabledNumbers={props.disabledNumbers}
      />
    );
  }

  let buttons = [];
  buttons.push(renderNumber('U'));
  for (let i = 1; i <= 5; i++) { buttons.push(renderNumber(i)); }
  buttons.push(renderNumber('E'));
  buttons.push(renderNumber('N'));
  
  return ( <div className="control-area no-select">{buttons}</div> )
}

export default ControlArea
