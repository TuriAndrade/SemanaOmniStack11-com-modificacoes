import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

/*
    React pages are dinamically rendered(not server rendered)
    Although the page does not ever refresh, notice how
    React Router keeps the URL up to date as you navigate
    through the site. This preserves the browser history,
    making sure things like the back button and bookmarks
    work properly.
*/

/*
    A <Switch> looks through all its children <Route>
    elements and renders the first one whose path
    matches the current URL. Use a <Switch> any time      
    you have multiple routes, but you want only one
    of them to render at a time.

    The <Switch> renders the firts path the starts with the URL, 
    thats why we have to use the 'exact' clause sometimes, so it 
    won't render the wrong component.

*/

import Logon from './pages/logon'; //o index é selecionado por padrão.
import Register from './pages/register';
import Profile from './pages/profile';
import NewIncident from './pages/newIncident';

export default function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Logon}></Route>
                <Route path='/register' component={Register}></Route>
                <Route path='/profile' component={Profile}></Route>
                <Route path='/incidents/new' component={NewIncident}></Route>
            </Switch>
        </BrowserRouter>
    );
}