import Loader from "./Loader"
import Overlay from "./Overlay"


const Dialog = _ => {
  let showLoader = _.currentPuzzle === null
  let showOverlay = _.overlay === true
  return (
    <>
      <Loader showLoader={showLoader} />
      {/* <Overlay showLoader={showOverlay} 
      setOverlay={(i) => _.setOverlay(i)}
      /> */}
    </>
  )
}

export default Dialog
