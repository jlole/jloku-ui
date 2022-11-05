import React from 'react';

function Control(props) {
  return (
    <div className="control-number" onClick={props.onClick} data-key={props.id} id={'number-'+props.id}>{props.id}</div>
  );
}

export default Control
