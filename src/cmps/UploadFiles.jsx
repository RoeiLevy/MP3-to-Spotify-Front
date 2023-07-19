import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccessToken, getUserIdAndLocale, getSongsIds, createPlaylistAndAddSongs, createUserSession } from '../services/filesService';
import '../styles/UploadFiles.scss'
import { default as uploadIcon } from '../assets/upload.svg';
import { setUser } from '../store/actions/userActions'
// import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'

const _UploadFiles = (props) => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  // const [code, setCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    files: []
  });

  const handleChange = (e) => {
    if (e.target.name === 'files') {
      setFormData({
        ...formData,
        [e.target.name]: Array.from(e.target.files).map(file => file.name)
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleUploadClick = (e) => {
    inputRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const [songsIds, notFound] = await getSongsIds(formData.files, props.user.locale)
    const playlistId = await createPlaylistAndAddSongs(props.user.id, songsIds, formData)
    await createUserSession({ userId:props.user.id, userLocale:props.user.locale, playlistId, uploadCount: formData.files.length, failedCount: notFound.length, succeededCount: songsIds.length })
    navigate('/end', { state: { notFound, formData, playlistId } });
  };

  const created = async () => {
    const code = new URLSearchParams(location.search).get('code');
    await getAccessToken(code)
    const [userId, userLocale, userImg] = await getUserIdAndLocale()
    props.setUser({ id: userId, locale: userLocale, img: userImg })
  }

  useEffect(() => {
    created()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Playlist name:
      </label>
      <input required value={formData.name} onChange={handleChange} id="name" name='name' type="text" />
      <label htmlFor="description">
        Playlist description:
      </label>
      <textarea value={formData.description} onChange={handleChange} id="description" name="description" cols="20" rows="3"></textarea>
      <label>
        Private playlist
        <input value={formData.isPrivate} onChange={handleChange} type="checkbox" />
      </label>
      <div className="file-upload" onClick={handleUploadClick}>
        Choose files
        <img src={uploadIcon} alt="" />
      </div>
      <input type="file" name="files" ref={inputRef} multiple onChange={handleChange} />
      <button type="submit">Create Playlist</button>
    </form>
  );
};

// export default UploadFiles;
const mapStateToProps = state => ({
  user: state.userReducer.user
})

const mapDispatchToProps = {
  setUser
}
export const UploadFiles = connect(mapStateToProps, mapDispatchToProps)(_UploadFiles)