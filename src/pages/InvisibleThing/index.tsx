import React, { MouseEvent, useState, useEffect } from 'react';
import { FiRefreshCw as Reload, FiHome as Home } from 'react-icons/fi';
import { TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon } from 'react-share';
//import { useParams } from "react-router-dom";
import getTexts from '../../assets/texts'
import './styles.css';
import { api, baseURL } from '../../services/api';
import LoadingDiv from '../../components/LoadingDiv';
import ErrorDiv from '../../components/ErrorDiv';
import ReactGA from 'react-ga';

const beep = require('../../assets/audios/beep.mp3');
const margin = 10;
const footerHeigth = 24;
const imageSize = 32;
const thing = "Vaca";
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

function setCookie(cname: String, cvalue: String, exdays: number) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=none ; Secure";
}

function getCookie(cname: String) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
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
  //let { gameID } = useParams();
  const search = window.location.search;
  const gameID = String(new URLSearchParams(search).get('game'));
  console.log(gameID)

  /* Ações executadas apenas uma vez ao carregar a página */
  useEffect(() => {
    /* Posiciona a coisa em uma região aleatória da tela */
    thingRandomize();
    /* Obtém o score já registrado ou inicializa com o valor padrão de 0 */
    //let oldScore = Number(localStorage.getItem(`findtheinvisible${gameID}_score`));
    let oldScore_ = getCookie("scoreFIT"+gameID);
    if (oldScore_.length === 0){
      oldScore_="0";
    }
    let oldScore = parseInt(oldScore_);
    if (oldScore !== undefined)
      setScore(oldScore)
    /* Obtém os dados referentes ao jogo selecionado */
    api.get(`things/${gameID}`).then(response => {
      setThingInfo(response.data);
    })
    /* Adiciona o evento de redimensionamento da janela */
    window.addEventListener('resize', () => { setWindowDimensions(getWindowDimensions()) });
    /* Informa a visita ao Google Analytics */
    ReactGA.pageview(gameID);

    
  }, [gameID]);

  /* Posiciona a coisa em uma posição aleatória da tela */
  function thingRandomize() {
    let { innerWidth: width, innerHeight: height } = window;
    setDiagSize(Math.sqrt(width * width + height * height))

    width -= margin * 2 + imageSize;
    width *= Math.random()
    height -= margin * 2 + footerHeigth + imageSize;
    height *= Math.random()

    setThingPosition({
      posX: Math.floor(width),
      posY: Math.floor(height)
    });
  }

  /* Resposta ao touch */
  function touchMoveHandle(event: React.TouchEvent) {
    const distance = Math.sqrt(Math.pow(thingPosition.posX - event.touches[0].pageX + margin + imageSize / 2, 2) +
      Math.pow(thingPosition.posY - event.touches[0].pageY + margin + imageSize / 2, 2))
    //const scale = Math.pow((diagSize - distance) / diagSize, 2);
  
    let scale = (diagSize*0.75 - distance) / (diagSize*0.75);
    if(scale <= 0)
      scale = 0;
    scale = Math.pow(Math.sin(scale*(Math.PI/6))*2, 2);


    if (audioRef.current) {
      audioRef.current.volume = Math.sqrt(scale);
      audioRef.current.playbackRate = scale * 1.8 + 0.2;
      if (audioRef.current.paused && state !== 'found')
        audioRef.current.play();
      if (!audioRef.current.paused && state === 'found')
        audioRef.current.pause();
    }
  }

  /* Resposta ao movimento do mouse */
  function mouseMoveHandle(event: MouseEvent) {
    const distance = Math.sqrt(Math.pow(thingPosition.posX - event.pageX + margin + imageSize / 2, 2) +
      Math.pow(thingPosition.posY - event.pageY + margin + imageSize / 2, 2))
    //const scale = Math.pow((diagSize - distance) / diagSize, 4);
    let scale = (diagSize*0.75 - distance) / (diagSize*0.75);
    if(scale <= 0)
      scale = 0;
    scale = Math.pow(Math.sin(scale*(Math.PI/6))*2, 2);
    if (audioRef.current) {
      audioRef.current.volume = Math.sqrt(scale);
      audioRef.current.playbackRate = scale * 1.8 + 0.2;
      if (audioRef.current.paused && state !== 'found')
        audioRef.current.play();
      if (!audioRef.current.paused && state === 'found')
        audioRef.current.pause();
    }
  }

  /* Resposta ao fim da carga do arquivo de audio */
  function audioPlayHandle() {
    if (audioRef.current && state === 'found')
      audioRef.current.pause();
  }

  /* Resposta à saída do mouse do div e ao fim do touch */
  function mouseTouchOutHandle() {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  /* Resposta ao clique na imagem */
  function imageClickHandle(event: MouseEvent) {
    if (state !== 'found') {
      setState('found');
      //localStorage.setItem(`findtheinvisible${gameID}_score`, String(score + 1));
      setCookie("scoreFIT"+gameID, String(score + 1), 365);
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
  }

  /* Reinicia o jogo ao clicar no botão de reinício */
  function restartHandle(event: MouseEvent) {
    setState('inGame');
    thingRandomize();
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  /* Obtém a altura e largura da tela */
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  /* Resposta à carga da imagem */
  function imageLoadHandle() {
    setLoadedImage(true);
  }
  /* Resposta à carga do audio */
  function audioLoadHandle() {
    if (audioRef.current) {
      audioRef.current.play();
      setLoadedAudio(true);
    }
  }

  document.title = "Find the invisible " + thing;

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
        <div id='congratulations'>
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
      <div id="adContainer"></div>
    </div>
  )
}

export default InvisibleThing;
