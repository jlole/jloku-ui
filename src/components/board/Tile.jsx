import React from 'react';

function Tile(props) {
  return (
    <td className={"tile"} onClick={props.onClick} data-key={props.id} id={'tile-'+props.id}></td>
  );
}

export default Tile;
