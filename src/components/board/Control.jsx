import React from 'react';
import { CiEraser, CiEdit } from 'react-icons/ci';

function Control(props) {
  let content = props.id
  if ( props.id === 'E' ) content = <CiEraser/>
  if ( props.id === 'N' ) content = <CiEdit/>

  let active = (props.noteMode && props.id === 'N') ? ' active' : ''
  let disabled = props.disabledNumbers.includes(props.id) ? ' disabled' : ''

  return (
    <div className={'control-button ' + disabled + active} onClick={props.onClick} data-key={props.id} id={'number-'+props.id}>
      {content}
    </div>
  );
}

export default Control
