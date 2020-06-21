import React from 'react';

import { Link } from 'react-router-dom';

export default function Alert(props){

    if(!props.error){
        if(!props.sucess){
            return null;
        }else{
            return(
                <div {...props} className={`alert alert--green ${props.className}`}>{props.sucess}</div>
            );
        }
    }else if(props.error === 'Forbidden'){
        return(
            <div {...props} className={`alert alert--red  ${props.className}`}>
                <Link className='link-text link-text--red' to='/'> Permissão negada</Link>
            </div>
        );
    }else{
        return(
            <div {...props} className={`alert alert--red ${props.className}`}>{props.error}</div>
        );
    }
}