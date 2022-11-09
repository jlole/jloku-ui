import Loader from "./Loader"
import Overlay from "./Overlay"


const Dialog = _ => {
  let showLoader = _.currentPuzzle === null
  let showOverlay = _.overlay === true
  return (
    <>
      <Loader showLoader={showLoader} />
      <Overlay showOverlay={showOverlay} setOverlay={() => _.setOverlay(false)} />
    </>
  )
}

export default Dialog
