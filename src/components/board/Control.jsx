import React from 'react';
import { CiEraser, CiEdit } from 'react-icons/ci';

function Control(props) {
  let content = props.id
  if ( props.id === 'E' ) content = <CiEraser/>
  if ( props.id === 'N' ) content = <CiEdit/>

  let active = (props.editMode && props.id === 'N') ? ' active' : ''

  let noTileSelected = props.selectedTile === false
  let selectedTileIsLocked = props.selectedIsGiven
  let numberUsedUp = props.disabledNumbers.includes(props.id)
  let disabled = (noTileSelected || selectedTileIsLocked || numberUsedUp) ? ' disabled' : ''

  return (
    <div className={'control-number ' + disabled + active} onClick={props.onClick} data-key={props.id} id={'number-'+props.id}>
      {content}
    </div>
  );
}

export default Control
