import React from 'react';

function Tile(props) {
  return (
    <td className={"tile"} onClick={props.onClick} data-key={props.id} id={'tile-'+props.id}>
      <div className='entry' id={'tile-entry-'+props.id}></div>
      <div className='notes' id={'tile-notes-'+props.id}>
        <div className='note-1'>1</div>
        <div className='note-2'>2</div>
        <div className='note-3'>3</div>
        <div className='note-4'>4</div>
        <div className='note-5'>5</div>
      </div>
    </td>
  );
}

export default Tile;
