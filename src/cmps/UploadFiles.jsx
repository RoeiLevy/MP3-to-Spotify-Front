import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccessToken, getUserIdAndLocale, getSongsIds, createPlaylistAndAddSongs } from '../services/filesService';
import '../styles/UploadFiles.scss'
import { default as uploadIcon } from '../assets/upload.svg';

const UploadFiles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const [code, setCode] = useState('');
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
    await getAccessToken(code)
    const [userId, userLocale] = await getUserIdAndLocale()
    const [songsIds, notFound] = await getSongsIds(formData.files, userLocale)
    const playlistId = await createPlaylistAndAddSongs(userId, songsIds, formData)
    navigate('/end',{state:{notFound,formData,playlistId}});
  };

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    setCode(code)
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <label for="name">
        Playlist name:
      </label>
      <input required value={formData.name} onChange={handleChange} id="name" name='name' type="text" />
      <label for="description">
        Playlist description:
      </label>
      <textarea value={formData.description} onChange={handleChange} id="description" name="description" cols="20" rows="3"></textarea>
      <label>
        Private playlist:
        <input value={formData.isPrivate} onChange={handleChange} type="checkbox" />
      </label>
      <div className="file-upload" onClick={handleUploadClick}>
        Choose files:
        <img src={uploadIcon} alt="" />
      </div>
      <input type="file" name="files" ref={inputRef} multiple onChange={handleChange} />
      <button type="submit">Create Playlist</button>
    </form>
  );
};

export default UploadFiles;
