import React from 'react';
import { CiEraser, CiEdit } from 'react-icons/ci';

function Control(props) {
  let content = props.id
  if ( props.id === 'E' )
   content = <CiEraser/>
  if ( props.id === 'N' )
   content = <CiEdit/>

  return (
    <div className={'control-number ' + (props.id === 'N' && props.editMode ? 'active' : '')} onClick={props.onClick} data-key={props.id} id={'number-'+props.id}>{content}</div>
  );
}

export default Control
