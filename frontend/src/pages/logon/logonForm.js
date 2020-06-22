/*
    React wraps native browser events into instances of the SyntheticEvent. 
    A synthetic event cannot be accessed asynchronously because React reuses it 
    once its handler is called, so all the event properties are nullified. 
    As possible solutions, we can call event.persist() or we can cache the needed 
    event properties until they’re finally used.

    The setState() function is asynchronous, so it's only possible to use the event properties
    inside of it if the event.persist() is called. The event.persist() removes the event from the pool
    and allows it to be retained asynchronously. 

    OBS: events can be passed as arguments on an asynchronous function call, they just can't be used
    inside it's scope. When the function is called, it's execution context (arguments, variables that 
    can be used inside of it's scope, etc) is defined, and then the function is placed in the event queue. 
    So, something as setState(event...) works, but setState(()=>{ event }) doesn't work, because in the first 
    example, the event was passed as a argument when the function was called, and these arguments are placed
    with it in the event queue. This way, even if the event doesn't exist anymore when the function is going to
    be executed, the arguments of the function can still be accessed. In the second example, however, when the 
    function is placed in the event queue, no argument referencing the event is passed, so when it's is finally
    executed, the event doesn't exist anymore.

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

    local and session storage are vunerable to XSS attacks.
*/

import React, {useState, useRef, useEffect} from 'react';

import { Link,useHistory } from 'react-router-dom'; 
/*
    É um componente que contém a tag <a>, mas que não recarrega a página ao trocar a rota,
    pois REACT MONTA SINGLE PAGE APPLICATIONS.

    No css, pode ser referenciado pela tag <a>.
*/

import api from '../../services/api';
/*
    You can't have more than one default export. So, in the case of auth, that I need many consts
    from the file, I have to export each one, whitout using default, and get them by their names
*/

import {FiLogIn} from 'react-icons/fi'; //pacote de icons de varios sites, como feathers e font-awsome

//icones do react-icons são usados como componentes e aceitam tamanho e cor como parâmetros. DEVEM começar com letra maiúscula 
//o formato deles é svg

import StateInput from '../../components/stateInput';

import Alert from '../../components/alert';

import {verifyIfBlank} from '../../validators/stateInput';

import {loginRegEx} from '../../validators/loginStateInput';

import {passwordRegEx} from '../../validators/passwordStateInput';

export default function Logon(){
    const history = useHistory(); //com essa const posso usar os métodos do useHistory

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    /*
        Values of controlled inputs should always start with '' or another string instead of null.
        When they are mounted and first receive the state as their values, if the state is null, the
        value of the input will be undefined and it will become uncontrolled.

        OBS: Controlled inputs are inputs that have their values controlled by the state
    */

    const [incorrectLogin, setIncorrectLogin] = useState(null);
    const [incorrectPassword, setIncorrectPassword] = useState(null);

    const [error, setError] = useState(null);
    const [sucess, setSucess] = useState(null);

    const formHeight = useRef(null);

    const antiCsrfToken = useRef(null);

    const rotationFront = useRef();
    const rotationBack = useRef();

    useEffect(()=>{
        if(error || sucess){
            rotationBack.current.style.transform = 'rotateY(0deg)';
        }
    }, [error, sucess]);

    useEffect(()=>{
        if(!incorrectLogin && !incorrectPassword){
            formHeight.current = rotationFront.current.offsetHeight;
        }
    },[incorrectLogin, incorrectPassword]);

    useEffect(()=>{
        api.get('/generic/token', {timeout:5000}).then(response => antiCsrfToken.current = response.data.token)
                .catch((error)=>setError('Falha na conexão com o servidor!'));

        const interval = setInterval(()=>{
            
            api.get('/generic/token', {timeout:5000}).then(response => antiCsrfToken.current = response.data.token)
                .catch((error)=>setError('Falha na conexão com o servidor!'));
        }, 600000);

        return function cleanup(){
            clearInterval(interval);
        }
    },[]);

    async function handleLogin(e){
        e.preventDefault();

        const dados = {
            login:verifyIfBlank(login, setIncorrectLogin),
            password:verifyIfBlank(password, setIncorrectPassword)
        }

        if(dados.login && dados.password){

            try{

                formHeight.current = rotationFront.current.offsetHeight;


                /*
                    By default, credentials such as HTTP cookies and HTTP authentication headers
                    are NOT sent or received in cross-site comunication.

                    To apply it, Access-Control-Allow-Origin MUST be specified (AND DIFFERENT FROM '*')
                    in the server's response, and the Access-Control-Allow-Credentials must be set to TRUE 
                    both in the client's request and in the server's response

                */

                await api.post('sessions',dados,{
                    withCredentials:true, 
                    timeout:5000,
                    headers:{
                        anticsrf:antiCsrfToken.current
                    }
                }); //o id tem que ser mandado como um objeto. Axios converte ele para JSON.

                setIncorrectLogin(null);
                setIncorrectPassword(null);

                rotationFront.current.style.transform = 'rotateY(90deg)';

                rotationFront.current.ontransitionend = ()=>{
                    setSucess('Login realizado com sucesso!')

                    setTimeout(()=>{
                        history.push('/profile'); 
                    }, 1000);
                }
                
                /*
                    é possível passar dados pelo history.push para os props da pagina renderizada e 
                    recuperá-los usando props.location.state.dado_desejado 
                */

                /*
                    Eu poderia usar localStorage também, mas a estrátegia que eu usei é verificar se
                    o nome foi passado pelas props em Profile (quando links são usados). Se não forem,
                    (quando a página é acessada diretamente pelo browser), o nome é recuperado do DB.
                */
            }catch(error){
                if(error.response){//.response access the error response. It's NOT the const response declared above
                    if(error.response.data.error === "No ONG found with this login"){
                        setIncorrectLogin("Login inexistente!");
                        setIncorrectPassword(null);
                    }else if(error.response.data.error === "Incorrect password"){
                        setIncorrectLogin(null);
                        setIncorrectPassword("Senha incorreta!");
                    }else{
                        setIncorrectLogin(null);
                        setIncorrectPassword(null);
                        
                        rotationFront.current.style.transform = 'rotateY(90deg)';

                        rotationFront.current.ontransitionend = ()=>{
                            setError('Falha na conexão com o servidor!');
                        }
                    }
                }else{
                    rotationFront.current.style.transform = 'rotateY(90deg)';

                    rotationFront.current.ontransitionend = ()=>{
                        setError('Falha na conexão com o servidor!');
                    }
                }
            }
        }
    }

    if(!error && !sucess){
        return(
            <form ref={rotationFront} className="form rotation__side rotation__side--front" onSubmit={handleLogin}>
                <StateInput 
                    error = {incorrectLogin}
                    type = 'text'
                    lowerCase = {true}
                    placeholder = 'Login'
                    state={login}
                    setState = {setLogin}
                    validate={loginRegEx}/>
                <StateInput 
                    error = {incorrectPassword}
                    type = 'password'
                    placeholder = 'Senha'
                    state={password}
                    setState = {setPassword}
                    validate={passwordRegEx}/>
                <button className="btn btn--100 btn--red" type="submit">Entrar</button>
                <Link className="link" to="/register">
                    <FiLogIn className="u-font-size-icon-small" color="#e02041"/>Não tenho cadastro
                </Link>
            </form>
        );
    }else{
        return(
            <Alert
                fowardedRef={rotationBack}
                sucess={sucess}
                error={error}
                className='rotation__side rotation__side--back u-font-size-medium'
                style = {{height:formHeight.current}}
            />
        );
    }
}