import { default as userIcon } from '../assets/user.svg';
import '../styles/AppHeader.scss'
import { connect } from 'react-redux'

const _AppHeader = ({user}) => {

  return (
    <header>
      <h1><a href="/">MP3 to Spotify</a></h1>
      <img src={user?.img?.url || userIcon} alt="" />
    </header>
  )
}

// export default AppHeader
const mapStateToProps = state => ({
  user: state.userReducer.user
})

const mapDispatchToProps = {}
export const AppHeader = connect(mapStateToProps, mapDispatchToProps)(_AppHeader)