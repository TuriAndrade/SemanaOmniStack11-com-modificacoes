/*
    React wraps native browser events into instances of the SyntheticEvent. 
    A synthetic event cannot be accessed asynchronously because React reuses it 
    once its handler is called, so all the event properties are nullified. 
    As possible solutions, we can call event.persist() or we can cache the needed 
    event properties until they’re finally used.

    The setState() function is asynchronous, so it's only possible to use the event properties
    in it if the event.persist() is called. The event.persist() removes the event from the pool
    and allows it to be retained asynchronously. 

    Another way to use the event properties asynchronously is to store them in variables before
    calling the asynchronous method and passing these variables as arguments to it instead of 
    passing the event properties directly. This was what i did in the handleChange of the id input.

    OBS: event pooling defines that the pool events are nullified after their callback is invoked, 
    so they can be reused. Thats why the events can't be called asynchronously, the event callback
    doesn't  'wait' for the asynchronous call to be invoked, so the event is already nullified in 
    the asynchronous method. 
*/

/*
    Storage objects are simple key-value stores, similar to objects, 
    but they stay intact through page loads. The keys and the values 
    are always strings (note that, as with objects, integer keys will 
    be automatically converted to strings). You can access these values 
    like an object, or with the Storage.getItem() and Storage.setItem() methods.
    
    * sessionStorage maintains a separate storage area for each given origin that's available 
    for the duration of the page session (as long as the browser is open, including page 
    reloads and restores).

    * localStorage does the same thing, but persists even when the browser is closed and reopened.

    Both are stored in the client's computer. sessionStorage is deleted after the session is over,
    but localStorage persists.

    sessionStorage can persist to. For example when the section crashes and you open the browser 
    again, you are able to restore the section.

    It's not secure to store passwords in other than RAM memory, which is the case of these, specialy
    localStorage.
*/

import React, {useState} from 'react';

import { Link,useHistory } from 'react-router-dom'; 
/*
    É um componente que contém a tag <a>, mas que não recarrega a página ao trocar a rota,
    pois REACT MONTA SINGLE PAGE APPLICANTIONS.

    No css, pode ser referenciado pela tag <a>.
*/

import './logon_main.css'

import heroesImg from '../../assets/heroes.png'; //heroesImg é uma variável que recebeu a importação
import logoImg from '../../assets/logo.svg'; 

import api from '../../services/api';
import {setToken} from '../../services/auth';
/*
    You can't have more than one default export. So, in the case of auth, that I need many consts
    from the file, I have to export each one, whitout using default, and get them by their names
*/


import {FiLogIn} from 'react-icons/fi'; //pacote de icons de varios sites, como feathers e font-awsome

//icones do react-icons são usados como componentes e aceitam tamanho e cor como parâmetros. DEVEM começar com letra maiúscula 
//o formato deles é svg

function Logon(){
    const history = useHistory(); //com essa const posso usar os métodos do useHistory

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const [incorrectLogin, setIncorrectLogin] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);

    async function handleLogin(e){
        e.preventDefault();

        try{
            const response = await api.post('sessions',{login,password}); //o id tem que ser mandado como um objeto. Axios converte ele para JSON.
            if(response.data.token){//response.data acessa a resposta json da requisição.
                setIncorrectLogin(false);
                setIncorrectPassword(false);

                setToken(response.data.token);
                localStorage.setItem("nome_login@beTheHero",response.data.name);

                history.push('/profile') //é possível passar dados pelo history.push e recuperá-los usando props.location na página renderizada

                /*
                    Eu poderia fazer uma requisição em /profile antes de renderizar a página usando
                    o token para recuperar o nome, mas retorná-lo no login e salvá-lo no localStorage
                    é mais prático e fácil.
                */

            }
        }catch(error){
            if(error.response){
                if(error.response.data.error === "No ONG found with this login"){
                    setIncorrectLogin(true);
                    setIncorrectPassword(false);
                }else if(error.response.data.error === "Incorrect password"){
                    setIncorrectLogin(false);
                    setIncorrectPassword(true);
                }else{
                    setIncorrectLogin(false);
                    setIncorrectPassword(false);
                    alert("Erro no login");
                }
            }else{
                setIncorrectLogin(false);
                setIncorrectPassword(false);
                alert("Não foi possível conectar com o servidor");
            }
        }
    }

    return(
        <div className="logon-container">
            <div className="u-container-small">
                <div className="row">
                    <div className="col col-40">
                        <div className="u-margin-bottom-medium">
                            <div className="logon-container__logo-img">
                                <img src={logoImg} alt="Be the hero"/>
                            </div>
                        </div>
                        <div className="u-margin-bottom-small">
                            <h1 className="heading-primary">Faça seu login</h1>
                        </div>
                        <form className="form" onSubmit={handleLogin}>
                            <LoginInput 
                                incorrectLogin = {incorrectLogin}
                                login = {login}
                                setLogin={setLogin}/>
                            <PasswordInput 
                                incorrectPassword = {incorrectPassword}
                                password = {password}
                                setPassword = {setPassword}/>
                            <button className="btn-100" type="submit">Entrar</button>
                            <Link className="link" to="/register">
                                <FiLogIn className="u-font-size-icon-small" color="#e02041"/>Não tenho cadastro
                            </Link>
                        </form>
                    </div>
                    <div className="col col-60">
                        <div className="logon-container__heroes-img">
                            <img src={heroesImg} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Logon;

function LoginInput(props){
    if(props.incorrectLogin){
        return(
            <div className="form--input-error">
                <input
                    value={props.login}
                    onChange={e => {
                        const value = e.target.value.toLowerCase();
                        props.setLogin(value);
                    }}
                    type="text" 
                    placeholder="Login"/>
                    <p>Login inexistente</p>
            </div>
        )
    }else{
        return(
            <input 
                value={props.login}
                onChange={e => {
                    const value = e.target.value.toLowerCase();
                    props.setLogin(value);
                }}
                type="text" 
                placeholder="Login"/>
        )
    }
}

function PasswordInput(props){
    if(props.incorrectPassword){
        return(
            <div className="form--input-error">
                <input
                    value={props.password}
                    onChange={e => { 
                        const value = e.target.value;
                        props.setPassword(value);
                    }}
                    type="password" 
                    placeholder="Senha"/>
                <p>Senha incorreta</p>
            </div>
        )
    }else{
        return(
            <input 
                value={props.password}
                onChange={e => { 
                    const value = e.target.value;
                    props.setPassword(value);
                }}
                type="password" 
                placeholder="Senha"/>
        )
    }
}