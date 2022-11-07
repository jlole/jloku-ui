// import {GridLoader} from 'react-spinners'

const Overlay = _ => {
  let showLoader = _.showLoader ? ' show' : ''

  return (
    <div className={'game-overlay' + showLoader} onClick={_.setOverlay}>
      <div className="text-white">
        <h1>Game Paused</h1>
      </div>
    </div>
  )
}

export default Overlay
