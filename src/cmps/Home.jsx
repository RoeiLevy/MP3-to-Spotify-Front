import { spotifyAuthorize } from "../services/filesService";
import '../styles/Home.scss'
const Home = () => {

    const LoginToSpotify = async () => {
        spotifyAuthorize()
    }

    return (
        <div>
            <p>Using this toll will help you create a new playlist in your Spotify account<br /> that contains your favorite songs from the past that just sitting unused on your computer.</p>
            <button onClick={LoginToSpotify}>Login to your spotify</button>
        </div>
    )
}

export default Home