import React, { useState, ChangeEvent, FormEvent } from 'react';
import DropImage from '../../components/DropImage';
import DropSound from '../../components/DropSound';
import CreatingDiv from '../../components/CreatingDiv';
import { api } from '../../services/api';
import { TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon } from 'react-share';

import './styles.css'

const baseURL = "http://localhost:3000/";
const twitterAccount = 'Kenazu_'

const CreateThing = () => {
  const [selectedAudio, setSelectedAudio] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<File>();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [url, setURL] = useState<string>("");

  function inputHandle(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (url !== "") {
      alert('The game has already been created.\nRefresh the page to create a new game.\n\n* Don\'t forget to save de link!')
      return
    }

    const data = new FormData();

    if (name === "" || !selectedAudio || !selectedImage) {
      alert('One or more fields has not been filled!\nMake sure to type a name and select a valid image and audio.')
      return
    }

    data.append('name', name);
    if (selectedAudio)
      data.append('audio', selectedAudio);
    if (selectedImage)
      data.append('image', selectedImage);

    setCreating(true);
    api.post(`create-thing`, data).then(response => {
      if (response.data.status === 'ok') {
        setCreating(false);
        setURL(response.data.url);
      }
    });
  }

  let fullURL = `${baseURL}play?game=${url}`;

  return (
    <>
      <form id='page-create' className="wrapper" onSubmit={handleSubmit} >
        <div className="container">
          <h1>Find the Invisible Thing</h1>
          <h3>Create your own game</h3>
          <fieldset>
            <label htmlFor='description'>Name</label><br />
            <input
              type='text'
              id='description'
              name='description'
              onChange={inputHandle}
              maxLength={32}
            />
          </fieldset>


          <div id='uploads'>
            <DropImage onFileUploaded={setSelectedImage} />
            <DropSound onFileUploaded={setSelectedAudio} />
          </div>
          <button
            id="create"
            className={url !== "" ? 'invisible' : ''}
          >
            Create
          </button>

          <button
            id="play"
            className={url !== "" ? '' : 'invisible'}
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals
              location.href = fullURL;
            }}
          >
            Play
          </button>

          <div
            id="share-wrapper"
            className={url !== "" ? '' : 'invisible'}
          >
            <div className='link-wrapper'>
              <p className='space-below'>Link to the created game</p>
              <input
                type="text"
                name="link"
                id="link"
                disabled={url === ""}
                value={fullURL}
              />
            </div>
            <div className='share-wrapper'>
              Share
              <div className='share'>
                <TwitterShareButton
                  url={fullURL}
                  title={`Find The invisible thing - ${name}\n`}
                  via={twitterAccount}
                  hashtags={['invisiblething']}
                  className="Demo__some-network__share-button">
                  <TwitterIcon size={24} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={fullURL}
                  title={`Find The invisible thing - ${name}\n`}
                  separator=" "
                >
                  <WhatsappIcon size={24} round />
                </WhatsappShareButton>
                <FacebookShareButton
                  url={fullURL}
                  quote={`Find The invisible thing - ${name}\n`}
                  hashtag="#invisiblething"
                >
                  <FacebookIcon size={24} round />
                </FacebookShareButton>
              </div>
            </div>
          </div>

        </div>
      </form>
      {creating ? <CreatingDiv /> : ''}
    </>
  )
}

export default CreateThing;