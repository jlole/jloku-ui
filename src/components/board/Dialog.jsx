import Loader from "./Loader"


const Dialog = _ => {
  let showLoader = _.currentPuzzle === null
  return (
    <>
      <Loader showLoader={showLoader} />
    </>
  )
}

export default Dialog
