import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReactGA from 'react-ga';
import auth from './services/auth';


ReactGA.initialize('UA-170894373-1', {
  gaOptions: {
    userId: auth()
  }
});


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);