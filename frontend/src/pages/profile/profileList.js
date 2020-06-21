import React, { useEffect, useState } from 'react';

import { FiEdit } from 'react-icons/fi';
import { FaUserTag, FaUser, FaEnvelope, FaPhone, FaMapMarked, FaCheck, FaMap } from 'react-icons/fa';

import api from '../../services/api';

import StateInputClipPath from '../../components/stateInputClipPath';

import {verifyIfBlank, atLeast14,atMost50, atMost150, atLeast4} from '../../validators/stateInput';

import validateEmail from '../../validators/emailStateInput';

import { phoneFormat } from '../../validators/numberStateInput';

import { ufRegEx, validateUf, validateCity } from '../../validators/ufAndCityStateInput';
import { loginRegEx } from '../../validators/loginStateInput';

import TabPortUpdate from './tabPortUpdate';

/*
    const a = { data: data }
    const b = { data: data } 

    a and b have different signatures

    const a = { data: data }
    const b = a 

    a and b have the same signature

    Fot the setData to cause an update, the object passed has to have a new signature.
    In other words, it has to be a new one. Thats why Object.assign is necessary.

    OBS: Given to objects with the same signature, like a and b in the first scenario,
    if you change one of them, the other also changes. Its like they are the same
*/

export default function ProfileList(props){

    const [data, setData] = useState({});
    
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

    const [openModalUpdate, setOpenModalUpdate] = useState(false);

    useEffect(()=>{
        api.get('/get/data', {
            withCredentials:true,
            timeout:5000
        }).then(response => {
            setData(Object.assign({}, response.data.ongData));
            setLogin(response.data.ongData.login);
            setName(response.data.ongData.name);
            setEmail(response.data.ongData.email);
            setWhatsapp(response.data.ongData.whatsapp);
            setCity(response.data.ongData.city);
            setUf(response.data.ongData.uf);
        });
    }, []);

    function handleEditInfo(id){
        if(document.querySelector(`#right-menu__edit-checkbox--${id}`).checked){
            document.querySelector(`#right-menu__input-group--${id}`).style.visibility = "visible";
            document.querySelector(`#right-menu__input-group--${id}`).style.opacity = "1";
            document.querySelector(`#right-menu__input-group--${id}`).style.transform = "translateX(0)";
        }else{
            document.querySelector(`#right-menu__input-group--${id}`).style.visibility = "hidden";
            document.querySelector(`#right-menu__input-group--${id}`).style.opacity = "0";
            document.querySelector(`#right-menu__input-group--${id}`).style.transform = "translateX(-100%)";
        }
    }

    async function handleSubmit(data, id, setError){

        try{
            await api.put('/update/data', data,{
                timeout:5000,
                withCredentials:true,
                headers:{
                    anticsrf:props.antiCsrfToken
                }
            });

            setData(Object.assign({}, data));

            document.querySelector(`#right-menu__edit-checkbox--${id}`).checked = false;
            document.querySelector(`#right-menu__input-group--${id}`).style.visibility = "hidden";
            document.querySelector(`#right-menu__input-group--${id}`).style.opacity = "0";
            document.querySelector(`#right-menu__input-group--${id}`).style.transform = "translateX(-100%)";

        }catch(error){
            if(error.response){
                if(error.response.data.error === "Login already exists"){
                    setError("Login em uso!");
                }else{
                    setError('Falha na conexão com o servidor!')
                }
            }else{
                setError('Falha na conexão com o servidor!')
            }
        }
    }

    return(
        <>
            <ul className="right-menu__list">
                <li className={errorLogin ? "right-menu__list-item right-menu__list-item--error" : "right-menu__list-item"}>
                    <div className="right-menu__list-item--left">
                        <FaUserTag className='right-menu__icon' color='#fff'/>
                    </div>
                    <div className="right-menu__list-item--middle">
                        <span className="right-menu__list-label">Login</span>
                        <span className="right-menu__list-text">{data.login}</span>
                    </div>
                    <div className="right-menu__list-item--right">
                        <input onChange={
                            ()=>{
                                handleEditInfo('login');
                            }
                        } id='right-menu__edit-checkbox--login' type="checkbox" className="right-menu__edit-checkbox"/>
                        <label htmlFor="right-menu__edit-checkbox--login" className="right-menu__edit-label">
                            <FiEdit className='right-menu__icon right-menu__icon--pointer' color='#fff'/>
                        </label>
                    </div>
                    <form onSubmit={(e)=>{ 
                            e.preventDefault();

                            const ong = {
                                login: atLeast4(login, setErrorLogin),
                                name: data.name,
                                email:data.email,
                                whatsapp:data.whatsapp,
                                city:data.city,
                                uf:data.uf
                            }

                            if(ong.login){
                                handleSubmit(ong, 'login', setErrorLogin);
                            }
                        }} className="form right-menu__form">
                        <div id='right-menu__input-group--login' className="form--input-group-clip-path">
                            <StateInputClipPath
                                error = {errorLogin}
                                type = 'text'
                                placeholder = 'Login'
                                state={login}
                                setState = {setLogin}
                                validate={loginRegEx}/>
                            <button type="submit" className="right-menu__edit-button">
                                <FaCheck className="right-menu__icon" color="#fff"/>
                            </button>
                        </div>
                    </form>
                </li>
                <li className={errorName ? "right-menu__list-item right-menu__list-item--error" : "right-menu__list-item"}>
                    <div className="right-menu__list-item--left">
                        <FaUser className='right-menu__icon' color='#fff'/>
                    </div>
                    <div className="right-menu__list-item--middle">
                        <span className="right-menu__list-label">Nome</span>
                        <span className="right-menu__list-text">{data.name}</span>
                    </div>
                    <div className="right-menu__list-item--right">
                        <input onChange={
                            ()=>{
                                handleEditInfo('name');
                            }
                        } id='right-menu__edit-checkbox--name' type="checkbox" className="right-menu__edit-checkbox"/>
                        <label htmlFor="right-menu__edit-checkbox--name" className="right-menu__edit-label">
                            <FiEdit className='right-menu__icon right-menu__icon--pointer' color='#fff'/>
                        </label>
                    </div>
                    <form onSubmit={(e)=>{ 
                            e.preventDefault();

                            const ong = {
                                login:data.login,
                                name: verifyIfBlank(name, setErrorName),
                                email:data.email,
                                whatsapp:data.whatsapp,
                                city:data.city,
                                uf:data.uf
                            }

                            if(ong.name){
                                handleSubmit(ong, 'name', setErrorName);
                            }
                        }} className="form right-menu__form">
                        <div id='right-menu__input-group--name' className="form--input-group-clip-path">
                            <StateInputClipPath
                                error = {errorName}
                                type = 'text'
                                placeholder = 'Nome'
                                state={name}
                                setState = {setName}
                                validate={atMost50}/>
                            <button type="submit" className="right-menu__edit-button">
                                <FaCheck className="right-menu__icon" color="#fff"/>
                            </button>
                        </div>
                    </form> 
                </li>
                <li className={errorEmail ? "right-menu__list-item right-menu__list-item--error" : "right-menu__list-item"}>
                    <div className="right-menu__list-item--left">
                        <FaEnvelope className='right-menu__icon' color='#fff'/>
                    </div>
                    <div className="right-menu__list-item--middle">
                        <span className="right-menu__list-label">Email</span>
                        <span className="right-menu__list-text">{data.email}</span>
                    </div> 
                    <div className="right-menu__list-item--right">
                        <input onChange={
                            ()=>{
                                handleEditInfo('email');
                            }
                        } id='right-menu__edit-checkbox--email' type="checkbox" className="right-menu__edit-checkbox"/>
                        <label htmlFor="right-menu__edit-checkbox--email" className="right-menu__edit-label">
                            <FiEdit className='right-menu__icon right-menu__icon--pointer' color='#fff'/>
                        </label>
                    </div>
                    <form onSubmit={(e)=>{ 
                            e.preventDefault();

                            const ong = {
                                login:data.login,
                                name: data.name,
                                email:validateEmail(email, setErrorEmail),
                                whatsapp:data.whatsapp,
                                city:data.city,
                                uf:data.uf
                            }

                            if(ong.email){
                                handleSubmit(ong, 'email', setErrorEmail);
                            }
                        }} className="form right-menu__form">
                        <div id='right-menu__input-group--email' className="form--input-group-clip-path">
                            <StateInputClipPath
                                error = {errorEmail}
                                type = 'text'
                                placeholder = 'Email'
                                state={email}
                                setState = {setEmail}/>
                            <button type="submit" className="right-menu__edit-button">
                                <FaCheck className="right-menu__icon" color="#fff"/>
                            </button>
                        </div>
                    </form>
                </li>
                <li className={errorWhatsapp ? "right-menu__list-item right-menu__list-item--error" : "right-menu__list-item"}>
                    <div className="right-menu__list-item--left">
                        <FaPhone className='right-menu__icon' color='#fff'/>
                    </div>
                    <div className="right-menu__list-item--middle">
                        <span className="right-menu__list-label">Whatsapp</span>
                        <span className="right-menu__list-text">{data.whatsapp}</span>
                    </div>
                    <div className="right-menu__list-item--right">
                        <input onChange={
                            ()=>{
                                handleEditInfo('whatsapp');
                            }
                        } id='right-menu__edit-checkbox--whatsapp' type="checkbox" className="right-menu__edit-checkbox"/>
                        <label htmlFor="right-menu__edit-checkbox--whatsapp" className="right-menu__edit-label">
                            <FiEdit className='right-menu__icon right-menu__icon--pointer' color='#fff'/>
                        </label>
                    </div>
                    <form onSubmit={(e)=>{ 
                            e.preventDefault();

                            const ong = {
                                login:data.login,
                                name: data.name,
                                email:data.email,
                                whatsapp:atLeast14(whatsapp, setErrorWhatsapp),
                                city:data.city,
                                uf:data.uf
                            }

                            if(ong.whatsapp){
                                handleSubmit(ong, 'whatsapp', setErrorWhatsapp);
                            }
                        }} className="form right-menu__form">
                        <div id='right-menu__input-group--whatsapp' className="form--input-group-clip-path">
                            <StateInputClipPath
                                error = {errorWhatsapp}
                                type = 'text'
                                placeholder = 'Whatsapp'
                                state={whatsapp}
                                setState = {setWhatsapp}
                                validate = {phoneFormat}/>
                            <button type="submit" className="right-menu__edit-button">
                                <FaCheck className="right-menu__icon" color="#fff"/>
                            </button>
                        </div>
                    </form>
                </li>
                <li className={errorCity ? "right-menu__list-item right-menu__list-item--error" : "right-menu__list-item"}>
                    <div className="right-menu__list-item--left">
                        <FaMapMarked className='right-menu__icon' color='#fff'/>
                    </div>
                    <div className="right-menu__list-item--middle">
                        <span className="right-menu__list-label">Cidade</span>
                        <span className="right-menu__list-text">{data.city}</span>
                    </div>
                    <div className="right-menu__list-item--right">
                        <input onChange={
                            ()=>{
                                handleEditInfo('city');
                            }
                        } id='right-menu__edit-checkbox--city' type="checkbox" className="right-menu__edit-checkbox"/>
                        <label htmlFor="right-menu__edit-checkbox--city" className="right-menu__edit-label">
                            <FiEdit className='right-menu__icon right-menu__icon--pointer' color='#fff'/>
                        </label>
                    </div>
                    <form onSubmit={async (e)=>{ 
                            e.preventDefault();

                            const ong = {
                                login:data.login,
                                name: data.name,
                                email:data.email,
                                whatsapp:data.whatsapp,
                                city: await validateCity(city, data.uf, setErrorCity),
                                uf:data.uf
                            }

                            if(ong.city){
                                handleSubmit(ong,'city', setErrorCity);
                            }
                        }} className="form right-menu__form">
                        <div id='right-menu__input-group--city' className="form--input-group-clip-path">
                            <StateInputClipPath
                                error = {errorCity}
                                type = 'text'
                                placeholder = 'Cidade'
                                state={city}
                                setState = {setCity}
                                validate={atMost150}/>
                            <button type="submit" className="right-menu__edit-button">
                                <FaCheck className="right-menu__icon" color="#fff"/>
                            </button>
                        </div>
                    </form>
                </li>
                <li className={errorUf ? "right-menu__list-item right-menu__list-item--error" : "right-menu__list-item"}>
                    <div className="right-menu__list-item--left">
                        <FaMap className='right-menu__icon' color='#fff'/>
                    </div>
                    <div className="right-menu__list-item--middle">
                        <span className="right-menu__list-label">Uf</span>
                        <span className="right-menu__list-text">{data.uf}</span>
                    </div> 
                    <div className="right-menu__list-item--right">
                        <input onChange={
                            ()=>{
                                handleEditInfo('uf');
                            }
                        } id='right-menu__edit-checkbox--uf' type="checkbox" className="right-menu__edit-checkbox"/>
                        <label htmlFor="right-menu__edit-checkbox--uf" className="right-menu__edit-label">
                            <FiEdit className='right-menu__icon right-menu__icon--pointer' color='#fff'/>
                        </label>
                    </div>
                    <form onSubmit={(e)=>{ 
                            e.preventDefault();

                            const ong = {
                                login:data.login,
                                name: data.name,
                                email:data.email,
                                whatsapp:data.whatsapp,
                                city:data.city,
                                uf:validateUf(uf, setErrorUf)
                            }

                            if(ong.uf){
                                handleSubmit(ong,'uf', setErrorUf);
                            }
                        }} className="form right-menu__form">
                        <div id='right-menu__input-group--uf' className="form--input-group-clip-path">
                            <StateInputClipPath
                                error = {errorUf}
                                type = 'text'
                                placeholder = 'UF'
                                state={uf}
                                setState = {setUf}
                                validate={ufRegEx}/>
                            <button type="submit" className="right-menu__edit-button">
                                <FaCheck className="right-menu__icon" color="#fff"/>
                            </button>
                        </div>
                    </form>
                </li>
            </ul>
            <button onClick={
                ()=>{
                    setOpenModalUpdate(true);
                }
            } className="btn btn--red right-menu__tab-port-popup-button">Alterar Perfil</button>
            <TabPortUpdate display={openModalUpdate} antiCsrfToken={props.antiCsrfToken} setDisplay={setOpenModalUpdate}
                login={data.login}
                name={data.name}
                email={data.email}
                whatsapp={data.whatsapp}
                city={data.city}
                uf={data.uf}    
                setData={setData}
            />
        </>
    );
}