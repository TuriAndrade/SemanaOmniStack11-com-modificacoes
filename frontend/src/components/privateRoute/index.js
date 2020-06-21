import React, {useState, useEffect} from 'react';

import {Route, Redirect} from 'react-router-dom';

import {isLoggedIn} from '../../utils';

import Loading from '../../components/loading';

export default function PrivateRoute({component: Component, ...rest}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        isLoggedIn().then(response =>{
            setIsAuthenticated(response);
            setLoading(false);
        });

        const interval = setInterval(()=>{
            isLoggedIn().then(response =>{
                setIsAuthenticated(response);
                setLoading(false);
            });
        }, 600000);

        return function cleanup(){
            clearInterval(interval);
        }
    }, []);

    if(loading){
        return(
            <Loading/>
        );
    }else{
        
        return (
            // Show the component only when the user is logged in
            // Otherwise, redirect the user to /signin page
            <Route {...rest} render={routeProps => (
                isAuthenticated ?
                    <Component antiCsrfToken = {isAuthenticated} {...routeProps} />
                : <Redirect to="/logon" />
            )} />
        );
    }
}