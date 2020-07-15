interface txt{
  score: string;
  share: string;
  statistics: string;
  inspired: string;
  playAgain: string;
  congratulations: string;
  foundAroundWorld: string;
  youFound: string;
}

function getTexts (lang: string): txt {
  switch (lang){
    case 'pt':
      return {
        score: 'Pontuação',
        share: 'Compartilhar',
        statistics: 'Estatísticas',
        inspired: 'Inspirado em',
        playAgain: 'Jogar Novamente',
        congratulations: 'Parabéns',
        foundAroundWorld: 'Encontradas mundialmente',
        youFound: 'Você encontrou'
      }
    default:
      return {
        score: 'Score',
        share: 'Share',
        statistics: 'Statistics',
        inspired: 'Inspired by',
        playAgain: 'Play Again',
        congratulations: 'Congratulations',
        foundAroundWorld: 'Found around the world',
        youFound: 'You\'ve found!',
      }
  }
}

export default getTexts;