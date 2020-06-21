import React, {useState} from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

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

import PublicRoute from './components/publicRoute';
import PrivateRoute from './components/privateRoute';

export default function Routes(){

    const [cookieMsgDisplay, setCookieMsgDisplay] = useState(true);

    /*
        Como as rotas são remontadas quando mudam, o display da msg de cookies tem que ser definido
        aqui, para não ficar repetitivo.
    */

    return(
        <BrowserRouter>
            <Switch>
                <PublicRoute cookieMsgDisplay={cookieMsgDisplay} setCookieMsgDisplay={setCookieMsgDisplay} key='logon' restricted={true} path='/logon' component={Logon}/>
                <PublicRoute cookieMsgDisplay={cookieMsgDisplay} setCookieMsgDisplay={setCookieMsgDisplay} key='register' restricted={true} path='/register' component={Register}/>
                <PrivateRoute key='profile' path='/profile' component={Profile}/>
                <PrivateRoute key='newIncident' path='/incidents/new' component={NewIncident}/>
            </Switch>
        </BrowserRouter>
    );
}

/*
    If the component from the route /profile is displayed and /profile/logout is acessed, even if 
    the authentication fails, the component from /profile/logout will be displayed.
    This happens because /profile/logout is out of the switch, due to interface concerns, and
    the authentication already succeded in /profile.

    Though, if someone tries to access /profile/logout directly, the authentication will run
*/

/*
    Switches only display one route at a time. If they change, react doesn't underestand the new route
    as a new component, only as an update of the props of the previous route.

    As I want them to remount, not update, I added keys
*/