import { useEffect } from "react";
import { getAccessToken, getUserIdAndLocale, spotifyAuthorize } from "../services/filesService";
import '../styles/Home.scss'
import { useLocation } from 'react-router-dom';
import { setUser } from '../store/actions/userActions'
import { connect } from 'react-redux'

const _Home = (props) => {
    const location = useLocation();

    const LoginToSpotify = async () => {
        spotifyAuthorize()
    }
    // const created = async () => {
    //     const code = new URLSearchParams(location.search).get('code');
    //     if (code) {
    //         await getAccessToken(code)
    //         const [userId, userLocale, userImg] = await getUserIdAndLocale()
    //         props.setUser({ id: userId, locale: userLocale, img: userImg })
    //     }
    // }

    // useEffect(() => {
    //     created()
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <div>
            <p>Using this tool will help you create a new playlist in your Spotify account<br /> that contains your favorite songs from the past that just sitting unused on your computer.</p>
            <button onClick={LoginToSpotify}>Login to your spotify</button>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.userReducer.user
  })
  
  const mapDispatchToProps = {
    setUser
  }
  export const Home = connect(mapStateToProps, mapDispatchToProps)(_Home)