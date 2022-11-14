import {GridLoader} from 'react-spinners'

const Overlay = props => {
  let showLoader = typeof(props.currentPuzzle) === 'undefined'
  let showOverlay = props.overlay === true ? ' show' : ''
  return (
    <div className={'game-overlay' + showOverlay}>
      <div className="text-white text-center">
        <h1>
          {props.difficulty === 'daily' && <>Daily   puzzle</>}
          {props.difficulty === 0       && <>Easy    puzzle</>}
          {props.difficulty === 1       && <>Medium  puzzle</>}
          {props.difficulty === 2       && <>Hard    puzzle</>}
          {props.difficulty === 3       && <>Extreme puzzle</>}
        </h1>
        <button className="btn" onClick={() => props.setOverlay(false)}>
          {showLoader &&
            <GridLoader color="#36d7b7"	size='5px' margin='0px' />
          }
          {!showLoader && props.seconds === null && <>Start  Game</>}
          {!showLoader && props.seconds !== null && <>Resume Game</>}
        </button>
      </div>
    </div>
  )
}

export default Overlay
