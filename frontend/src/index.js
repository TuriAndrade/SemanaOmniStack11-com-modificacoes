import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './main.css';

/*
    como react monta single page application, não importa se o css é importado por componente ou página,
    ele sempre acaba junto no final.
*/

//index.js já é automaticamente linkado no index.html

ReactDOM.render(<App />,document.getElementById('root')
);
