import React from 'react';

function Tile(props) {
  let entry = ''
  let note = []
  if ("12345".includes(props.value)) {
    entry = props.value
  } else {
    for(let i = 0; i < props.notes[props.id].length; i++){
      let charAt = props.notes[props.id].charAt(i)
      if ( charAt !== '0') {
        note.push((<div key={i} className=''>{i+1}</div>))
      }
    }
  }

  let givenNumber = props.given ? ' given-number' : '';
  let selectedTile = props.selectedTile ? ' selected-tile' : '';

  return (
    <td className={'tile' + givenNumber + selectedTile} onClick={props.onClick} data-key={props.id} id={'tile-'+props.id}>
      <div className='entry' id={'tile-entry-'+props.id}>{entry}</div>
      <div className='notes' id={'tile-notes-'+props.id}>{note}</div>
    </td>
  );
}

export default Tile;
