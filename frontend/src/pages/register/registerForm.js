import React, {useState, useEffect, useRef} from 'react'; 

/*
    The history object keeps track of an array of locations. The ability to add 
    locations and move throughout the location array is what makes history “history”.

    The Link from react router dom works using the history.

    PUSH:

    The push method allows you to go to a new location. This will add a new location to the 
    array after the current location. When this happens, any “future” locations 
    (ones that exist in the array after the current location because of use of the back button) 
    will be dropped.

    There are other methods, its easy to find article about them on the internet.
*/

import api from '../../services/api';

import StateInput from '../../components/stateInput';

import Alert from '../../components/alert';

import {verifyIfBlank, atLeast4, atLeast8, atLeast14, atMost50, atMost150} from '../../validators/stateInput';

import validateEmail from '../../validators/emailStateInput';

import { loginRegEx } from '../../validators/loginStateInput';

import { passwordRegEx } from '../../validators/passwordStateInput';

import { phoneFormat } from '../../validators/numberStateInput';

import { ufRegEx, validateUf, validateCity } from '../../validators/ufAndCityStateInput';

export default function RegisterForm(){

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');

    /*
        Values of controlled inputs should always start with '' or another string instead of null.
        When they are mounted and first receive the state as their values, if the state is null, the
        value of the input will be undefined and it will become uncontrolled.

        OBS: Controlled inputs are inputs that have their values controlled by the state
    */

    const[errorLogin, setErrorLogin] = useState(null);
    const[errorPassword, setErrorPassword] = useState(null);
    const[errorName, setErrorName] = useState(null);
    const[errorEmail, setErrorEmail] = useState(null);
    const[errorWhatsapp, setErrorWhatsapp] = useState(null);
    const[errorCity, setErrorCity] = useState(null);
    const[errorUf, setErrorUf] = useState(null);

    const [errorRegister, setErrorRegister] = useState(null);
    const [sucessRegister, setSucessRegister] = useState(null);
    const [prevSucessRegister, setPrevSucessRegister] = useState(null);

    const formHeight = useRef(null);

    const didSubmit = useRef(false);

    const antiCsrfToken = useRef(null);

    useEffect(()=>{
        if(errorRegister || sucessRegister){

            document.querySelector('.rotation__side--back').style.transform = "rotateY(0deg)";
            
        }else if(prevSucessRegister){

            didSubmit.current = true;
            
            document.querySelector('.rotation__side--back').style.transform = "rotateY(-90deg)";

            document.querySelector('.rotation__side--back').ontransitionend = () =>{
                setPrevSucessRegister(null);
            }

        }else{
            didSubmit.current = false;
            document.querySelector('.rotation__side--front').style.transform = "rotateY(0deg)";
        }
    }, [errorRegister, sucessRegister, prevSucessRegister]);

    useEffect(()=>{
        if(!errorLogin && !errorPassword && !errorName && !errorEmail && !errorWhatsapp && !errorCity && !errorUf){
            formHeight.current = document.querySelector('.form').offsetHeight;
        }
    },[errorLogin, errorPassword, errorName, errorEmail, errorWhatsapp, errorCity, errorUf]);

    useEffect(()=>{
        api.get('/generic/token', {timeout:5000}).then(response => antiCsrfToken.current = response.data.token)
                .catch(()=>setErrorRegister('Falha na conexão com o servidor!'));

        const interval = setInterval(()=>{
            
            api.get('/generic/token', {timeout:5000}).then(response => antiCsrfToken.current = response.data.token)
                .catch(()=>setErrorRegister('Falha na conexão com o servidor!'));

        }, 600000);

        return function cleanup(){
            clearInterval(interval);
        }
    },[]);

    async function handleRegister(e){ //'e' é o evento onSubmit. PreventDefault previne o comportamento padrão e faz com que a página não seja atualizada
        e.preventDefault();

        const dados = {
            login:atLeast4(login, setErrorLogin),
            password:atLeast8(password, setErrorPassword),
            name:verifyIfBlank(name, setErrorName),
            email:validateEmail(email, setErrorEmail),
            whatsapp:atLeast14(whatsapp, setErrorWhatsapp),
            city:await validateCity(city, uf, setErrorCity),
            uf:validateUf(uf, setErrorUf)
        };

        if(dados.login && dados.password && dados.name && dados.email && dados.whatsapp && dados.city && dados.uf){
            
            try{

                formHeight.current = document.querySelector('.rotation__side--front').offsetHeight;

                const response = await api.post('ongs',dados, {
                    timeout:5000,
                    headers:{
                        anticsrf:antiCsrfToken.current
                    }
                }); //axios já converte os datos para json. Só é necessário passar a url 'ong', pois o resto já foi definido na baseURL
                
                setErrorLogin(null);

                document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
                        
                document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                    setSucessRegister(`Bem vinda, ${response.data.login}!`);
                    setTimeout(()=>{
                        setPrevSucessRegister(`Bem vinda, ${response.data.login}!`);
                        setSucessRegister(null);
                        setLogin('');
                        setPassword('');
                        setName('');
                        setEmail('');
                        setWhatsapp('');
                        setCity('');
                        setUf('');
                    }, 1500);
                }

            }catch(error){ // com error. é possível usar as variáveis do try
                if(error.response){ //verifica se error.response é diferente de null ou undefined

                    if(error.response.data.error === "Login already exists"){
                        setErrorLogin("Login em uso!");
                    }else{
                        setErrorLogin(null);
                        
                        document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
                        
                        document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                            setErrorRegister('Falha na conexão com o servidor!');
                        }
                    }
                }else{
                    setErrorLogin(null);
                    document.querySelector('.rotation__side--front').style.transform = 'rotateY(90deg)';
                        
                    document.querySelector('.rotation__side--front').ontransitionend = ()=>{
                        setErrorRegister('Falha na conexão com o servidor!');
                    }
                }
            }
        }
    }

    if(!errorRegister && !sucessRegister && !prevSucessRegister){
        return(
            <form 
                onSubmit={handleRegister} 
                className="form rotation__side rotation__side--front" 
                noValidate={true}
                style={didSubmit.current?{transform:"rotateY(90deg)"}:null}
            >
                <StateInput 
                    error = {errorLogin}
                    type = 'text'
                    placeholder = 'Login'
                    state={login}
                    setState = {setLogin}
                    validate={loginRegEx}/>
                <StateInput 
                    error = {errorPassword}
                    type = 'password'
                    placeholder = 'Senha'
                    state={password}
                    setState = {setPassword}
                    validate={passwordRegEx}/>
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
                <button className="btn btn--100 btn--red" type="submit">Cadastre-se</button>
            </form>
        );
    }else{
        return(
            <Alert
                error={errorRegister}
                sucess={sucessRegister || prevSucessRegister}
                className='rotation__side rotation__side--back u-font-size-medium'
                style = {{height:formHeight.current}}
            />
        );
    }
}