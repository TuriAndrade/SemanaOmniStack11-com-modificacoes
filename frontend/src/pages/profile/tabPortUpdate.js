import React, { useRef, useState, useEffect } from 'react';

import video1 from '../../assets/Flying-Birds.mp4';
import video2 from '../../assets/Love-Boat.mp4';
import video3 from '../../assets/The-Launch.mp4';

import StateInput from '../../components/stateInput';

import api from '../../services/api';

import Alert from '../../components/alert';

import {verifyIfBlank, atLeast4, atLeast14, atMost50, atMost150} from '../../validators/stateInput';

import validateEmail from '../../validators/emailStateInput';

import { loginRegEx } from '../../validators/loginStateInput';

import { phoneFormat } from '../../validators/numberStateInput';

import { ufRegEx, validateUf, validateCity } from '../../validators/ufAndCityStateInput';

export default function TabPortUpdateModal(props){

    const [login, setLogin] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');

    const[errorLogin, setErrorLogin] = useState(null);
    const[errorName, setErrorName] = useState(null);
    const[errorEmail, setErrorEmail] = useState(null);
    const[errorWhatsapp, setErrorWhatsapp] = useState(null);
    const[errorCity, setErrorCity] = useState(null);
    const[errorUf, setErrorUf] = useState(null);

    const [sucess, setSucess] = useState(null);
    const [error, setError] = useState(null);
    const [prevSucess, setPrevSucess] = useState(null);

    const videos = useRef([video1, video2, video3]);

    const formHeight = useRef(null);

    const didSubmit = useRef(false);

    useEffect(()=>{
        if(props.display){

            setLogin(props.login);
            setName(props.name);
            setEmail(props.email);
            setWhatsapp(props.whatsapp);
            setCity(props.city);
            setUf(props.uf)

            document.querySelector('.profile-container__update-popup').style.visibility = 'visible';
            document.querySelector('.profile-container__update-popup').style.opacity = '1';
            document.querySelector('.profile-container__update-popup .popup__content').style.transform = 'scale(1)';
            document.querySelector('.profile-container__update-popup .popup__content').style.opacity = '1';
        }
    }, [props.display, props.login, props.name, props.email, props.whatsapp, props.city, props.uf]);

    useEffect(()=>{

        if(props.display){

            if(error || sucess){

                document.querySelector('.rotation__side--back').style.transform = "rotateY(0deg)";
                
            }else if(prevSucess){

                didSubmit.current = true;
                
                document.querySelector('.rotation__side--back').style.transform = "rotateY(-90deg)";

                document.querySelector('.rotation__side--back').ontransitionend = () =>{
                    setPrevSucess(null);
                }

            }else{
                didSubmit.current = false;
                document.querySelector('.rotation__side--front').style.transform = "rotateY(0deg)";
            }
        }

    }, [props.display, error, sucess, prevSucess]);

    function handleClose(){
        document.querySelector('.profile-container__update-popup').style.visibility = 'hidden';
        document.querySelector('.profile-container__update-popup').style.opacity = '0';
        document.querySelector('.profile-container__update-popup .popup__content').style.transform = 'scale(.3)';
        document.querySelector('.profile-container__update-popup .popup__content').style.opacity = '0';

        document.querySelector('.profile-container__update-popup').ontransitionend = ()=>{
            props.setDisplay(false);
        }
    }

    async function handleSubmit(e){ //'e' é o evento onSubmit. PreventDefault previne o comportamento padrão e faz com que a página não seja atualizada
        e.preventDefault();

        const dados = {
            login:atLeast4(login, setErrorLogin),
            name:verifyIfBlank(name, setErrorName),
            email:validateEmail(email, setErrorEmail),
            whatsapp:atLeast14(whatsapp, setErrorWhatsapp),
            city:await validateCity(city, uf, setErrorCity),
            uf:validateUf(uf, setErrorUf)
        };

        if(dados.login && dados.name && dados.email && dados.whatsapp && dados.city && dados.uf){
            try{

                formHeight.current = document.querySelector('.rotation__side--front').offsetHeight;

                await api.put('/update/data', dados,{
                    timeout:5000,
                    withCredentials:true,
                    headers:{
                        anticsrf:props.antiCsrfToken
                    }
                });

                props.setData(dados);

                setErrorLogin(null);

                document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
                        
                document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                    setSucess('Dados atualizados com sucesso!');

                    setTimeout(()=>{
                        setPrevSucess('Dados atualizados com sucesso!');
                        setSucess(null);
                    }, 1500)
                }

            }catch(error){ // com error. é possível usar as variáveis do try
                if(error.response){ //verifica se error.response é diferente de null ou undefined

                    if(error.response.data.error === "Login already exists"){
                        setErrorLogin("Login em uso!");
                    }else{
                        setErrorLogin(null);
                        
                        document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
                        
                        document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                            setError('Falha na conexão com o servidor!');
                        }
                    }
                }else{
                    setErrorLogin(null);
                    document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
                        
                    document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                        setError('Falha na conexão com o servidor!');
                    }
                }
            }
        }
    }

    if(props.display){
        return(
            <div className="popup profile-container__update-popup">
                <div onClick={handleClose} className="popup__close-area"></div>
                <div className="popup__content">
                    <a onClick={handleClose} className="popup__close-btn">&times;</a>
                    <div className="background-video">
                        <video className="background-video__content" autoPlay muted loop>
                            <source src={videos.current[Math.floor((Math.random() * 3))]} type='video/mp4'/>
                        </video>
                    </div>
                    <div className="profile-container__update-box">
                        <div className="profile-container__update-form rotation">
                            {
                                prevSucess || error || sucess
                                ?
                                <Alert
                                    error={error}
                                    sucess={sucess || prevSucess}
                                    className='rotation__side rotation__side--back u-font-size-medium'
                                    style = {{height:formHeight.current}}
                                />
                                :
                                <form 
                                    onSubmit={handleSubmit} 
                                    className="form rotation__side rotation__side--front" 
                                    style={didSubmit.current ? {transform:"rotateY(90deg)"}:null}
                                    noValidate={true}
                                >
                                    <StateInput 
                                        error = {errorLogin}
                                        type = 'text'
                                        placeholder = 'Login'
                                        state={login}
                                        setState = {setLogin}
                                        validate={loginRegEx}/>
                                    <StateInput 
                                        error = {errorName}
                                        type = 'text'
                                        placeholder = 'Nome'
                                        state={name}
                                        setState = {setName}
                                        validate={atMost50}/>
                                    <StateInput 
                                        error = {errorEmail}
                                        type = 'text'
                                        placeholder = 'Email'
                                        state={email}
                                        setState = {setEmail}
                                        validate= {atMost150}/>
                                    <StateInput 
                                        error = {errorWhatsapp}
                                        type = 'text'
                                        placeholder = 'Whatsapp'
                                        state={whatsapp}
                                        setState = {setWhatsapp}
                                        validate = {phoneFormat}/>
                                    <div className="form--input-group-75-25">
                                        <StateInput 
                                            error = {errorCity}
                                            type = 'text'
                                            placeholder = 'Cidade'
                                            state={city}
                                            setState = {setCity}
                                            validate={atMost150}/>
                                        <StateInput 
                                            error = {errorUf}
                                            type = 'text'
                                            placeholder = 'UF'
                                            state={uf}
                                            setState = {setUf}
                                            validate={ufRegEx}/>
                                    </div>
                                    <button className="btn btn--100 btn--red" type="submit">Alterar Perfil</button>
                                </form>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }else{
        return null;
    }
}