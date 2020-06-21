import React, {useState,useEffect,useRef} from 'react';

import {useHistory} from 'react-router-dom';

import video1 from '../../assets/Flying-Birds.mp4';
import video2 from '../../assets/Love-Boat.mp4';
import video3 from '../../assets/The-Launch.mp4';

import StateInput from '../../components/stateInput';

import Alert from '../../components/alert';

import {passwordRegEx} from '../../validators/passwordStateInput';

import {verifyIfBlank} from '../../validators/stateInput';

import api from '../../services/api';

export default function Logout(props){

    const [thisSessionLogoutRadio, setThisSessionLogoutRadio] = useState(true);
    const [allSessionsLogoutRadio, setAllSessionsLogoutRadio] = useState(false);

    const [password, setPassword] = useState('');
    const [incorrectPassword, setIncorrectPassword] = useState(null);

    const [error, setError] = useState(null);
    const [sucess, setSuccess] = useState(null);

    const [shouldRedirect, setShouldRedirect] = useState(null);

    const videos = useRef([video1, video2, video3]);

    const formHeight = useRef(null);
    const formWidth = useRef(null);

    const history = useHistory();

    useEffect(()=>{
        if(props.display){
            document.querySelector('.profile-container__logout-popup').style.visibility = 'visible';
            document.querySelector('.profile-container__logout-popup').style.opacity = '1';
            document.querySelector('.profile-container__logout-popup .popup__content').style.transform = 'scale(1)';
            document.querySelector('.profile-container__logout-popup .popup__content').style.opacity = '1';
        }
    }, [props.display]);

    useEffect(()=>{
        if(error || sucess){
            document.querySelector('.rotation__side--back').style.transform = 'rotateY(0)';
            
            document.querySelector('.rotation__side--back').ontransitionend = ()=>{
                setShouldRedirect(true);
            }
        }
    }, [error, sucess]);

    function handleClose(){
        document.querySelector('.profile-container__logout-popup').style.visibility = 'hidden';
        document.querySelector('.profile-container__logout-popup').style.opacity = '0';
        document.querySelector('.profile-container__logout-popup .popup__content').style.transform = 'scale(.3)';
        document.querySelector('.profile-container__logout-popup .popup__content').style.opacity = '0';

        document.querySelector('.profile-container__logout-popup').ontransitionend = ()=>{
            props.setDisplay(false);
        }
    }

    
    function showFormThisSectionLogout(){
        setThisSessionLogoutRadio(true);
        setAllSessionsLogoutRadio(false);
    }

    function showFormAllSectionsLogout(){
        setAllSessionsLogoutRadio(true);
        setThisSessionLogoutRadio(false);
    }

    async function handleSubmit(e){
        e.preventDefault();

        formHeight.current = document.querySelector('.rotation__side--front').offsetHeight;
        formWidth.current = document.querySelector('.rotation__side--front').offsetWidth;

        if(thisSessionLogoutRadio){
            try{
                await api.delete('/sessions', {
                    withCredentials:true, 
                    timeout:5000,
                    headers:{
                        anticsrf:props.antiCsrfToken
                    }
                });

                document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';

                document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                    setSuccess('Logout concluído!');
                }

            }catch(error){
                if(error.response){ //.response access the error response
                    document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';

                    document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                        setError('Forbidden');
                    }
                }else{
                    document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';

                    document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                        setError('Falha na conexão com o servidor!');
                    }
                }
            }
        }else{
            const data = {
                password:verifyIfBlank(password, setIncorrectPassword)
            }

            if(data.password){
                try{

                    await api.delete('sessions/all',{
                        data: {
                            password: data.password
                        },
                        withCredentials:true, 
                        timeout:5000,
                        headers:{
                            anticsrf:props.antiCsrfToken
                        }
                    });
                    
                    /*
                        OBS:

                        put, and patch accept 3 parameters: url, data, and config

                        axios.delete does support a request body. It accepts two parameters: url and 
                        optional config. Thats why you have to set the body inside the config

                        AND THE BODY HAS TO BE CALLED DATA
                    */

                    document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';

                    document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                        setSuccess('Logout concluído!');
                    }

                }catch(error){
                    if(error.response){ //.response access the error response
                        if(error.response.data.error === "Incorrect password"){
                            setIncorrectPassword('Senha incorreta!')
                        }else{
                            document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
    
                            document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                                setError('Forbidden');
                            }
                        }
                    }else{
                        document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
    
                        document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                            setError('Falha na conexão com o servidor!');
                        }
                    }
                }
            }
        }
    }


    if(props.display){

        if(shouldRedirect){
            setTimeout(()=>{
                history.push('/logon');
            },1500);
        }

        return(
            <div className="popup profile-container__logout-popup">
                <div onClick={handleClose} className="popup__close-area"></div>
                <div className="popup__content">
                    <div className="background-video">
                        <video className="background-video__content" autoPlay muted loop>
                            <source src={videos.current[Math.floor((Math.random() * 3))]} type='video/mp4'/>
                        </video>
                    </div>
                    <div className="profile-container__logout-box">
                        <a onClick={handleClose} className="popup__close-btn">&times;</a>
                        <div className="profile-container__logout-form rotation">
                            {
                                error || sucess 
                                
                                ?
                                
                                <Alert
                                    error = {error}
                                    sucess = {sucess}
                                    className = {`rotation__side rotation__side--back u-font-size-medium`}
                                    style = {{height:formHeight.current, width:formWidth.current}} //ou passa um valor ou passa null
                                />

                                :

                                <form onSubmit={handleSubmit} className="form rotation__side rotation__side--front">
                                    <div onClick={showFormThisSectionLogout} className="form__radio-group">
                                        <input id='radio__this-section-logout' className='form__radio-input' type="radio" name="radio-logout" checked={thisSessionLogoutRadio} readOnly/>
                                        <label htmlFor="radio__this-section-logout" className="form__radio-label">
                                            <span className="form__radio-btn"></span>
                                            Sair dessa sessão
                                        </label>
                                    </div>
                                    <div onClick={showFormAllSectionsLogout} className="form__radio-group u-margin-bottom-medium">
                                        <input id='radio__all-sections-logout' className='form__radio-input' type="radio" name="radio-logout" checked={allSessionsLogoutRadio} readOnly/>
                                        <label htmlFor="radio__all-sections-logout" className="form__radio-label">
                                            <span className="form__radio-btn"></span>
                                            Sair de todas as sessões
                                        </label>
                                    </div>

                                    {
                                        thisSessionLogoutRadio
                                        ? 
                                        <button className="btn btn--100 btn--red" type="submit">Sair</button>
                                        
                                        :
                                        <>
                                            <StateInput 
                                                error = {incorrectPassword}
                                                type = 'password'
                                                placeholder = 'Senha'
                                                state={password}
                                                setState = {setPassword}
                                                validate={passwordRegEx}
                                            />
                                            <button className="btn btn--100 btn--red" type="submit">Sair</button>
                                        </>
                                    }

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