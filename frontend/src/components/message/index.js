import React, {useEffect} from 'react';

export default function Message(props){

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            if(props.display){
                document.querySelector('.message').style.visibility = "visible";
                document.querySelector('.message').style.opacity = "1";
            }
        }, 500);

        return function cleanup(){
            clearTimeout(timeout);
        }
    });

    function handleClose(){
        document.querySelector('.message').style.opacity = "0";
        document.querySelector('.message').style.visibility = "hidden";

        document.querySelector('.message').ontransitionend = ()=>{
            props.setDisplay(null);
        }
    }

    if(props.display){
        return(
            <div className="message">
                <h2 className="heading-secondary">Esse site usa cookies para melhorar a experiência do usuário.</h2>
                <button onClick={handleClose} className="message__btn btn btn--red">Aceitar cookies</button>
            </div>
        );
    }else{
        return null;
    }
}