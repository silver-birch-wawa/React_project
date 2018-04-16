import React from'react';
import ReactDOM from 'react-dom';
import'./index.css';
import registerServiceWorker from './registerServiceWorker';

import Routes from './routes/Router.js'

ReactDOM.render(
   <Routes/>,document.body
);

registerServiceWorker();
