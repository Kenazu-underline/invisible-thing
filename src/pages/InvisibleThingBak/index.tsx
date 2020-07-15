import React, { MouseEvent, useState, useEffect } from 'react';
import { FiRefreshCw as Reload, FiHome as Home } from 'react-icons/fi';
import { TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon } from 'react-share';
import { useParams } from "react-router-dom";
import getTexts from '../../assets/texts'
import './styles.css';
import { api, baseURL } from '../../services/api';
import LoadingDiv from '../../components/LoadingDiv';
import ErrorDiv from '../../components/ErrorDiv';


const beep = require('../../assets/audios/beep.mp3');
const margin = 10;
const footerHeigth = 24;
const imageSize = 32;
const adsWidth = 160;
const thing = "Vaca";
//const author = 'Kenazu_';
//const githubURL = 'github.com'
const twitterAccount = 'Kenazu_'

interface ThingInfo {
  status: string;
  name?: string;
  url?: string;
  image?: string;
  audio?: string;
  score?: number;
  creation_time?: number;
  reports?: number;
  likes?: number;
}

const InvisibleThing = () => {
  // Referência para o objeto de áudio
  const audioRef = React.createRef<HTMLAudioElement>();
  const beepRef = React.createRef<HTMLAudioElement>();

  /* Posição da coisa. */
  const [thingPosition, setThingPosition] = useState({ posX: 0, posY: 0 });
  /* Tamanho da diagonal da tela (Valor aproximado) */
  const [diagSize, setDiagSize] = useState(0);
  /* Tamanho da tela */
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  /* Pontuação do jogador */
  const [score, setScore] = useState(0);
  /* Estado do jogo */
  const [state, setState] = useState('inGame');
  /* Informações da coisa */
  const [thingInfo, setThingInfo] = useState<ThingInfo>({ status: 'loading' });
  /* Informação de audio carregados */
  const [loadedAudio, setLoadedAudio] = useState(false);
  /* Informação de imagem carregados */
  const [loadedImage, setLoadedImage] = useState(false);

  /* Obtém os textos de acordo com o idioma */
  const texts = getTexts('en');
  /* Identificador do jogo */
  let { gameID } = useParams();

  useEffect(() => {
    api.get(`things/${gameID}`).then(response => {
      setThingInfo(response.data);
    })
  }, [gameID]);

  useEffect(() => {
    thingRandomize();
    let oldScore = Number(localStorage.getItem(`findtheinvisible${gameID}_score`));
    if (oldScore !== undefined)
      setScore(oldScore)
  }, [gameID]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function thingRandomize() {
    let { innerWidth: width, innerHeight: height } = window;
    setDiagSize(Math.sqrt(width * width + height * height))

    width -= margin * 2 + imageSize + adsWidth;
    width *= Math.random()
    height -= margin * 2 + footerHeigth + imageSize;
    height *= Math.random()

    setThingPosition({
      posX: Math.floor(width),
      posY: Math.floor(height)
    });
  }

  function touchMoveHandle(event: React.TouchEvent) {
    const distance = Math.sqrt(Math.pow(thingPosition.posX - event.touches[0].pageX + margin + imageSize / 2, 2) +
      Math.pow(thingPosition.posY - event.touches[0].pageY + margin + imageSize / 2, 2))
    const scale = Math.pow((diagSize - distance) / diagSize, 2);
    if (audioRef.current) {
      audioRef.current.volume = Math.sqrt(scale);
      audioRef.current.playbackRate = scale * 1.75 + 0.25;
      if (audioRef.current.paused)
        audioRef.current.play();
    }
  }

  function mouseMoveHandle(event: MouseEvent) {
    const distance = Math.sqrt(Math.pow(thingPosition.posX - event.pageX + margin + imageSize / 2, 2) +
      Math.pow(thingPosition.posY - event.pageY + margin + imageSize / 2, 2))
    const scale = Math.pow((diagSize - distance) / diagSize, 4);
    if (audioRef.current) {
      audioRef.current.volume = Math.sqrt(scale);
      audioRef.current.playbackRate = scale * 1.8 + 0.2;
      if (audioRef.current.paused && state !== 'found')
        audioRef.current.play();
      if (!audioRef.current.paused && state === 'found')
        audioRef.current.pause();
    }
  }

  function audioPlayHandle(){
    if (audioRef.current && state==='found') 
      audioRef.current.pause();
  }

  function mouseTouchOutHandle() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  function imageClickHandle(event: MouseEvent) {
    if(state === 'found'){
      return
    }

    setState('found');
    localStorage.setItem(`findtheinvisible${gameID}_score`, String(score + 1));
    setScore(score + 1);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (beepRef.current) {
      beepRef.current.play();
    }
    api.put(`score/${gameID}`).then(response => {
      if (response.data.status === 'ok') {
        let score = response.data.score;
        setThingInfo({
          ...thingInfo,
          score
        });
      }
    });
  }

  function restartHandle(event: MouseEvent) {
    setState('inGame');
    thingRandomize();
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  function imageLoadHandle() {
    setLoadedImage(true);
    console.log('image')
  }

  function audioLoadHandle() {
    if (audioRef.current) {
      audioRef.current.play();
      setLoadedAudio(true);
    }
  }

  document.title = "Find the invisible... " + thing;

  if (thingInfo['status'] === 'loading') {
    return (
      <LoadingDiv />
    );
  }
  if (thingInfo['status'] !== 'ok') {
    return (<ErrorDiv />)
  }
  return (
    <div id='page-game'>
      <div id="wrapper">
        <div id='content-wtrapper'>
          <div
            id="content"
            onMouseMove={mouseMoveHandle}
            onTouchMove={touchMoveHandle}
            onMouseOut={mouseTouchOutHandle}
            onTouchEnd={mouseTouchOutHandle}
          >
            <img
              id="thing"
              className={[state === 'found' ? 'animate' : '', state === 'found' ? '' : 'invisibleThing'].join(' ')}
              src={`${baseURL}uploads/${thingInfo.image}`}
              alt=""
              onClick={imageClickHandle}
              onLoad={imageLoadHandle}
              style={{
                marginTop: thingPosition.posY,
                marginLeft: thingPosition.posX,
                height: imageSize,
                width: imageSize,
                cursor: 'pointer',
                objectFit: 'contain'
              }}
            />
          </div>
          <div id="ads">
            Reserved for Ads
          </div>
        </div>
        <footer
          style={{
            height: footerHeigth,
            display: 'flex',
          }}
        >
          <div className='share-game'>
            {texts.share}:&nbsp;
            <TwitterShareButton
              url={document.URL}
              title={`Find The invisible thing - ${gameID}\n`}
              via={twitterAccount}
            >
            <TwitterIcon
                size={24}
                round />
            </TwitterShareButton>
            <WhatsappShareButton
              url={document.URL}
              title={`Find The invisible thing - ${gameID}\n`}
              separator=" "
            >
              <WhatsappIcon size={24} round />
            </WhatsappShareButton>
            <FacebookShareButton
              url={document.URL}
              quote={`Find The invisible thing - ${gameID}\n`}
              hashtag="#invisiblething"
            >
              <FacebookIcon size={24} round />
            </FacebookShareButton>
          </div>
          <p> {texts.foundAroundWorld}: {thingInfo.score}  </p>
          <p className='inspired'>{texts.inspired}: <a className="animated-link" href='https://findtheinvisiblecow.com/'>Find the Invisible Cow</a> </p>
        </footer>
      </div>
      <div
        className={state === 'found' ? '' : 'invisible'}
        style={{
          width: 400,
          height: windowDimensions.height - margin * 2 - footerHeigth,
          position: 'absolute',
          top: 0,
          left: 0,
          margin: margin,
          marginBottom: margin + footerHeigth,
          marginLeft: windowDimensions.width / 2 - 200,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: 'var(--baseColor)',
            height: '400px',
            width: '100%',
            border: 'solid 6px var(--highlightColor)',
            zIndex: 10
          }}
        >
          <h1>{texts.congratulations}</h1>
          <h2>{texts.youFound}</h2>

          <a className="game-link" href='#restart' onClick={restartHandle} >{texts.playAgain} <Reload size={32} /></a>
          <a className="game-link" href='/'>Home <Home size={32} /></a>
        </div>
      </div>

      <div id="score">
        {texts.score}<br />
        <span style={{ fontSize: 36 }}>{score}</span> <br />
      </div>
      <audio src={`${baseURL}uploads/${thingInfo.audio}`} ref={audioRef} loop onCanPlay={audioLoadHandle} onPlay={audioPlayHandle} />
      <audio src={beep} ref={beepRef} />
      {(loadedAudio && loadedImage) ? '' : <LoadingDiv />}
    </div>
  )
}

export default InvisibleThing;

// Sound from Zapsplat.com