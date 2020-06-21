import React, {useState, useEffect} from 'react';

import logoImg from '../../assets/logo.svg';

export default function Loading(){
    const [display, setDisplay] = useState(null);

    useEffect(()=>{
        const timeoutDisplay = setTimeout(()=> setDisplay(true), 500);

        return function cleanup(){
            clearTimeout(timeoutDisplay);
        }
    }, []);

    /*
        Sometimes this component is unmounted before the timeout finishes. Because of this, it's
        necessary to return a cleanup function, in this case, a clearTimeout, so react can clear
        everything that could persist from the component before unmounting it.
    */

    if(display){
        return(
            <div className="loading">
                <div className="loading__card">
                    <img src={logoImg} alt="Be the hero"/>
                </div>
            </div>
        );
    }else{
        return null;
    }
}