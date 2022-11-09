// import {GridLoader} from 'react-spinners'

const Overlay = _ => {
  let showOverlay = _.showOverlay ? ' show' : ''
  return (
    <div className={'game-overlay' + showOverlay} onClick={_.setOverlay}>
      {showOverlay && <div></div>}

      <div className={'game-overlay' + showOverlay} onClick={_.setOverlay}>
        <div className="text-white">
          <h1>Game Paused</h1>
        </div>
      </div>
    </div>
  )
}

export default Overlay
