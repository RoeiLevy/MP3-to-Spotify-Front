import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../styles/End.scss'

const End = () => {
    const location = useLocation();

    return (
        <div className="end">
            <p>
                You'r playlist named {location.state.formData.name} was created successfully. <br />
                You can see it and play it in <a href={`https://open.spotify.com/playlist/${location.state.playlistId}`} target="_blank">here</a>.<br/>
                The following songs were not been added to your playlist because<br/> spotify didn't find the a song matching it's name or because of your location.
            </p>
            <ul>
                {location.state.notFound.map(name => (<li key={name}>{name}</li>))}
            </ul>
        </div>
    )
}

export default End