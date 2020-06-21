import React, {useEffect,useState} from 'react';

import {Route, Redirect} from 'react-router-dom';

import {isLoggedIn} from '../../utils';

import Loading from '../../components/loading';

import Message from '../message';

export default function PublicRoute({cookieMsgDisplay,setCookieMsgDisplay,component: Component, restricted, ...rest}){

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        isLoggedIn().then(response =>{
            setIsAuthenticated(response);
            setLoading(false);
        });
    }, [])

    if(loading){
        return(
            <Loading/>
        );
    }else{
        
        return (
            // restricted = false meaning public route
            // restricted = true meaning restricted route

            <>
                {
                    !isAuthenticated 
                    ? <Message display={cookieMsgDisplay} setDisplay={setCookieMsgDisplay}/>
                    : null
                }
                <Route {...rest} render={routeProps => (
                    isAuthenticated && restricted ?
                        <Redirect to='/profile' />
                    : <Component {...routeProps} />
                )} />
            </>

            /*
                A primeira vez que o <BrowserRouter/> é montado, se o usuário não estiver autenticado,
                a msg sobre cookies é mostrada
            */

        );
    }
}

/*
    Instead of having a new React element created for you using the component prop, you can pass in a 
    function to be called when the location matches. The render prop function has access to all the 
    same route props (match, location and history) as the component render prop.

    Component prop =>

        <Route path="/path" component={Component} />

    Render func =>

        <Route path="/home" render={() => <div>Home</div>} />

        Wrapped render function =>

            function WrappedRoute({component:Component, ...rest}){
                return(
                    <Route {...rest} render={routeProps =>{
                        <Component {...routeProps}/>
                    }}/>
                );
            }
*/