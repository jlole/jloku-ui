import {GridLoader} from 'react-spinners'

const Loader = _ => {
  let showLoader = _.showLoader ? ' show' : ''
  return (
    <div className={'game-loader' + showLoader}>
      <GridLoader color="#36d7b7" />
    </div>
  )
}

export default Loader
