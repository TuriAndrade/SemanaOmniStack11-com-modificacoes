import React, {useState} from 'react'; 

/*
    useState é um hook que recebe um valor como parâmetro e 
    retorna um array contendo o estado correspondente ao valor e uma function para atualizá-lo
*/

/*
    Quando uma das variáveis do state é atualizada, a parte da página que usa a variável
    é renderizada novamente sem ser atualizada e sem interferir nas outras variáveis.
*/ 

import './register_main.css';

import logoImg from '../../assets/logo.svg'; 

import { Link, useHistory } from 'react-router-dom'; 

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

import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';

/*
{} no código HTML indicam código javascript e {{}} indicam um objeto javascript dentro do código javascript.
Nele, é possível passar styles css por meio do atributo style. Ex: style={{width:"100%"}}
*/

export default function Register(){
    const history = useHistory(); //com essa const posso usar os métodos do useHistory

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [city, setCity] = useState('');
    const [uf, setUf] = useState('');

    const[loginExists, setLoginExists] = useState('false');

    async function handleRegister(e){ //'e' é o evento onSubmit. PreventDefault previne o comportamento padrão e faz com que a página não seja atualizada
        e.preventDefault();

        const dados = {
            login,
            password,
            name,
            email,
            whatsapp,
            city,
            uf
        };

        try{
            const response = await api.post('ongs',dados); //axios já converte os datos para json. Só é necessário passar a url 'ong', pois o resto já foi definido na baseURL

            if(response.data.login){ //verifica se response retornou login
                setLoginExists(false);

                alert(`Bem vinda, ${response.data.login}`); //com .data posso acessar a resposta JSON da requisição

                history.push('/');
            }

        }catch(error){ // com error. é possível usar as variáveis do try
            if(error.response){ //verifica se error.response é diferente de null ou undefined
                if(error.response.data.error === "Login already exists"){
                    setLoginExists(true);
                }else{
                    setLoginExists(false);
                    alert("Erro no cadastro")
                }
            }else{
                setLoginExists(false);
                alert("Não foi possível conectar com o servidor")
            }
        }
    }

    return(
        <div className="register-container">
            <div className="u-container-small u-box-shadow u-padding-medium">
                <div className="row">
                    <div className="col col-50">
                        <div className="u-margin-bottom-medium">
                            <div className="register-container__logo-img">
                                <img src={logoImg} alt="Be The Hero"/>
                            </div>
                        </div>
                        <div className="u-margin-bottom-small">
                            <h1 className="heading-primary">Cadastro</h1>
                        </div>
                        <p>Faça seu cadastro, entre na plataforma e ajude pessoas a encontrarem os casos da sua ONG.</p>
                        <div className="u-margin-top-small">
                            <Link className="link" to="/">
                                <FiArrowLeft className="u-font-size-icon-small" color="#e02041"/>Fazer login
                            </Link>
                        </div>
                    </div>
                    <div className="col col-50">
                        <form className="form" onSubmit={handleRegister}>
                            <LoginInput 
                                alreadyExists={loginExists}
                                login={login}
                                setLogin={setLogin} />
                            <input 
                                value={password} 
                                onChange={e => {
                                    const value = e.target.value;
                                    setPassword(value);
                                }}
                                placeholder="Senha" 
                                type="password"
                                required/>
                            <input 
                                value={name} 
                                onChange={e => {
                                    const value = e.target.value;
                                    setName(value);
                                }}
                                placeholder="Nome da ONG" 
                                type="text"
                                required/>
                            <input 
                                value={email} 
                                onChange={e => {
                                    const value = e.target.value;
                                    setEmail(value);
                                }}
                                placeholder="E-mail" 
                                type="email"
                                required/>
                            <input 
                                value={whatsapp} 
                                onChange={e => {
                                    const value = e.target.value;
                                    setWhatsapp(value);
                                }} 
                                placeholder="Whatsapp" 
                                type="text"
                                required/>
                            <div className="form--input-group-75-25">
                                <input 
                                    value={city} 
                                    onChange={e => {
                                        const value = e.target.value;
                                        setCity(value);
                                    }}  
                                    placeholder="Cidade" 
                                    type="text"
                                    required/>
                                <input 
                                    value={uf} 
                                    onChange={e => {
                                        const value = e.target.value;
                                        setUf(value);
                                    }} 
                                    placeholder="UF" 
                                    type="text"
                                    required/>
                            </div>
                            <button className="btn-100" type="submit">Cadastre-se</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginInput(props) {
    if(props.alreadyExists === true){
        return(
            <div className="form--input-error">
                <input
                    value={props.login} 
                    onChange={e => {
                        const value = e.target.value.toLowerCase();
                        props.setLogin(value);
                    }}
                    placeholder="Login" 
                    type="text"
                    required/>
                <p>Login existente</p>
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
                placeholder="Login" 
                type="text"
                required/>
        );
    }
}