// import { apiGet, apiPost } from '../utils/apiUtils';
import qs from 'qs'
import axios from 'axios';

// const fetchUsers = async () => {
//   try {
//     const users = await apiGet('/users');
//     console.log(users); // Process the fetched users data
//   } catch (error) {
//     console.error(error); // Handle any errors
//   }
// };

// const createUser = async (userData) => {
//   try {
//     const response = await apiPost('/users', userData);
//     console.log(response); // Handle the response after creating a user
//   } catch (error) {
//     console.error(error); // Handle any errors
//   }
// };

// Usage examples
// fetchUsers();
// createUser({ name: 'John Doe', email: 'johndoe@example.com' });

const clientId = '993fff92e68041ebaf1b4a269be443a1'
const clientSecret = '9926d6e4e04e4295a3351268b91fdf7a'
let accessToken
var redirect_uri = 'http://localhost:3000/uploadFiles'; // Your redirect uri

export const spotifyAuthorize = () => {
    var scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
    window.location.href = `https://accounts.spotify.com/authorize?show_dialog=false&response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirect_uri}`
}

export const getAccessToken = async (code) => {
    // try {
    //     const response = await apiPost('/users', userData);
    //     console.log(response); // Handle the response after creating a user
    // } catch (error) {
    //     console.error(error); // Handle any errors
    // }
    try {
        const auth_token = btoa(`${clientId}:${clientSecret}`)
        // const auth_token = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify(
            {
                code,
                redirect_uri,
                grant_type: 'authorization_code'
            });

        const response = await axios.post(token_url, data, {
            headers: {
                'Authorization': `Basic ${auth_token}`,
            }
        })
        accessToken = response.data.access_token;
        return
    } catch (error) {
        console.log(error);
    }
}
export const getUserIdAndLocale = async () => {
    try {
        const user = await axios.get('https://api.spotify.com/v1/me',
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        )
        return [user.data.id, user.data.country]
    } catch (error) {
        console.log(error);
    }
}
export const getSongsIds = async (songsNames, userLocale) => {
    const trackIds = [], failedTracksNames = [], notFound = []
    const promises = songsNames.map(songName => {
        return axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1&locale=${userLocale}`,
            { headers: { "Authorization": `Bearer ${accessToken}` } })
    })
    return Promise.allSettled(promises).then((results) => results.forEach((result) => {
        if (result.status === 'rejected') { // Failed
            // console.log(result.reason.response.headers['retry-after']);
            const url = result.reason.config.url
            const name = decodeURIComponent(url.substring(url.indexOf('query=') + 'query='.length, url.indexOf('&')))
            failedTracksNames.push(name)
        } else if (result.value.data.tracks.items.length) { // Success but could be that nothing was found
            trackIds.push(result.value.data.tracks.items[0].id);
        } else {
            const url = result.value.data.tracks.href
            const name = decodeURIComponent(url.substring(url.indexOf('query=') + 'query='.length, url.indexOf('&')))
            notFound.push(name)
        }
    })).then(async () => {
        if (failedTracksNames.length) {
            const [ids, notfound] = await getSongsIds(failedTracksNames)
            return [trackIds.concat(ids), notFound.concat(notfound)]
        } else return [trackIds, notFound]
    })
}
export const createPlaylistAndAddSongs = async (userId, songsIds, { name, description, isPrivate }) => {
    try {
        const { data } = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                name,
                description,
                public: !isPrivate
            },
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const playlistId = data.id
        for (let i = 0; i <= Math.floor(songsIds.length / 100); i++) {
            let uris = songsIds.slice(i * 100, (i * 100) + 100)
            uris = uris.map(songId => `spotify:track:${songId}`)
            await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    uris
                },
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
        }
        return playlistId
    } catch (error) {
        console.log(error);
    }
}
// export const addSongsToPlaylist = (playlist, songsNames) => {
//     try {
//         const tracksIds = []
//         const tracksNamesToSearch = []
//         const promises = []
//         fs.readdirSync(musicDirPath).forEach(file => {
//             tracksNamesToSearch.push(file)
//         })
//         for (let i = 0; i < tracksNamesToSearch.length; i++) {
//             const trackName = tracksNamesToSearch[i];
//             const responsePromise = axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`,
//                 { headers: { "Authorization": `Bearer ${accessToken}` } })
//             promises.push(responsePromise)
//             // if (response.data.tracks.items.length) {
//             //     tracksIds.push(response.data.tracks.items[0].id)
//             // }
//         }
//         Promise.allSettled(promises).then((results) => results.forEach((result) => {
//             if (result.status === 'rejected') {
//                 console.log(result);
//             }
//         }
//         ));
//     } catch (error) {
//         console.log(error);
//     }
// }
