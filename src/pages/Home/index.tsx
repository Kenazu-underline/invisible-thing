import React, { useEffect } from 'react';
import { TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon } from 'react-share';
import getTexts from '../../assets/texts'
import ReactGA from 'react-ga';

import './styles.css'

const twitterAccount = 'Kenazu_'

const oficialGames = [
  { name: 'Cow', gameID: 'cow' },
  { name: 'Guinea Pig', gameID: 'guineapig' },
  { name: 'Dog', gameID: 'dog' },
  { name: 'Cat', gameID: 'cat' },
  { name: 'Bird', gameID: 'bird' },
  { name: 'Lion', gameID: 'lion' },
  { name: 'Chicken', gameID: 'chicken' },
  { name: 'Egg', gameID: 'egg' },
];

const Home = () => {
  useEffect(() =>{
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  /* Obtém os textos de acordo com o idioma */
  const texts = getTexts('en');
  const vSpace = <div className="vertical-space" />;
  return (
    <div id="pages-home">
      <div className="container">
        {vSpace}
        <h1>Find the Invisible Things</h1>
        {vSpace}

        <div className="games-wrapper">
          <div className="oficial-games-wrapper">
            <h3>Oficial Games</h3>
            &nbsp;
            <nav className="oficial-games-list">
              { oficialGames.map( (game) => {
                return <a key={game.gameID} href={`/play?game=${game.gameID}`} className="game-link">{game.name}</a>
              })}
            
            </nav>
          </div>
          <div className="custom-game">
            <h3>Create your Games</h3>
            <ul>
              Recomendations
              <li>Use a square PNG image with transparency and with a resolution of 128x128 pixels.</li>
              <li>Use short audios with a steady volume. (Only the first 10 seconds will be used)</li>
            </ul>
            <ul>
              Limitations
              <li>File size must be less than 2 MB</li>
            </ul>
            
            <a id="create-game" href='/create-thing' className="game-link">Create a game</a>
          </div>
        </div>

        <div className="instructions">
          <h3>Instructions</h3>
          <p>Before starting the game, check if the audio is active and enabled for this site.</p>
          <p>When moving the mouse/finger across the screen, the playback speed and audio volume will indicate the proximity of the thing to be found. The faster and louder the audio is, the closer to the thing.</p>
          <p>When you're close enough, click/touch to reveal the thing.</p>
        </div>

        <footer>
          <div className='share-game'>
            {texts.share}:&nbsp;
            <TwitterShareButton
              url={document.URL}
              title={`Find The invisible things\n`}
              via={twitterAccount}
            >
              <TwitterIcon
                size={24}
                round />
            </TwitterShareButton>
            <WhatsappShareButton
              url={document.URL}
              title={`Find The invisible things\n`}
              separator=" "
            >
              <WhatsappIcon size={24} round />
            </WhatsappShareButton>
            <FacebookShareButton
              url={document.URL}
              quote={`Find The invisible things\n`}
              hashtag="#invisiblething"
            >
              <FacebookIcon size={24} round />
            </FacebookShareButton>
          </div>

          <p className='inspired'>{texts.inspired}: <a className='animated-link' href='https://findtheinvisiblecow.com/'>Find the Invisible Cow</a> </p>
        </footer>

      </div>
    </div>
  )
}

export default Home;