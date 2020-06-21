import React, { useState, useEffect, useRef } from 'react';

import { FiTrash2 } from 'react-icons/fi';

import Alert from '../../components/alert';

import api from '../../services/api';

export default function Incidents(props){

    const [incidents, setIncidents] = useState([]);

    const [incidentsExist, setIncidentsExist] = useState(true);

    const [errorGetIncidents, setErrorGetIncidents] = useState(null);
    const [errorDeleteIncidents, setErrorDeleteIncidents] = useState(null);

    const [sucessDeleteIncidents, setSucessDeleteIncidents] = useState(null);
    const [prevSucessDeleteIncidents, setPrevSucessDeleteIncidents] = useState(null);

    const incidentToDelete = useRef(null);
    const incidentHeight = useRef(null);

    /*
        Everytime a request is made to the API, the user's permission is verified
        to check if their token is still valid. If not, they are redirect to the 
        inital page.
    */

    useEffect(()=>{

        /*

            useEffect receives a function and an array of dependencies

            OBS: useEffect is ASYNCHRONOUS. That means that the component returns code 
            before the useEffect function is executed. However, as state is changed in 
            the useEffect function, the component is rendered again and returns the expected 
            value. This is the expected behaviour, because useEffect() works like the methods
            componentDidMount() (IN THIS CASE), componentDidUpdate() and componentWillUnmount().

            OBS: useLayoutEffect() is exaclty like useEffect(), but SYNCHRONOUS. That means that
            the component only returns anything after the useLayoutEffect function is fully executed.
            This should only be used in special cases, because the users sensation of useEffect is
            usually more dynamic than of useLayoutEffect.

            OBS: The useEffect is meant for a state change. Not doing so may cause bugs,
            because the useEffect callback will be executed after the component return,
            so if the state has not changed or a update hasn't been forced, the component
            won't be rendered again to accept the changes.
        */

        /*
            By default, credentials such as HTTP cookies and HTTP authentication headers
            are NOT sent or received in cross-site comunication.

            To apply it, Access-Control-Allow-Origin MUST be specified (AND DIFFERENT FROM '*')
            in the server's response, and the Access-Control-Allow-Credentials must be set to TRUE 
            both in the client's request and in the server's response

        */

        api.get('/profile',{withCredentials:true, timeout:5000}).then(response => {
            setIncidents(response.data.incidents);

            if(response.data.incidents.length === 0){
                setIncidentsExist(false);
            }

        }).catch(error => { //Thats how errors a caught in .then(). Try{}catch(){} doesn't work
            if(error.response){
                setErrorGetIncidents('Forbidden');
            }else{
                setErrorGetIncidents('Falha na conexão com o servidor!');
            }
        });

        /*
            Nesse caso, é melhor usar .then do que async e await, pois a callback do useEffect é
            síncrona para evitar error. Se ela for definida como async, ainda funciona, mas o react
            avisa que é melhor não fazer isso.
        */
    }, []);

    useEffect(()=>{

        if(errorDeleteIncidents || sucessDeleteIncidents){
            
            document.querySelector(`.profile-container__incident--${incidentToDelete.current}`).style.transform = "rotateY(0)";

            document.querySelector(`.profile-container__incident--${incidentToDelete.current}`).ontransitionend = ()=>{

                if(sucessDeleteIncidents){
                    setTimeout(()=>{
                        setPrevSucessDeleteIncidents('Caso excluído com sucesso!');
                        setSucessDeleteIncidents(null);
                    }, 1500);
                }
            }
        }else if(prevSucessDeleteIncidents){

            document.querySelector(`.profile-container__incident--${incidentToDelete.current}`).style.transform = "rotateY(-90deg)";

            document.querySelector(`.profile-container__incident--${incidentToDelete.current}`).ontransitionend = ()=>{

                setIncidents(incidents.filter(incident => incident.id !== incidentToDelete.current));

                if(incidents.filter(incident => incident.id !== incidentToDelete.current).length === 0){
                    incidentHeight.current = null;
                    setIncidentsExist(false);
                }

                setPrevSucessDeleteIncidents(null);
                incidentToDelete.current = null;
            }
        }

    }, [errorDeleteIncidents, sucessDeleteIncidents, prevSucessDeleteIncidents]);

    async function handleDelete(id){
        if(!errorDeleteIncidents && !sucessDeleteIncidents && !prevSucessDeleteIncidents){
            try{
                incidentToDelete.current = id;

                incidentHeight.current = document.querySelector(`.profile-container__incident--${id}`).offsetHeight;

                await api.delete(`/incidents/${id}`, {
                    withCredentials:true, 
                    timeout:5000,
                    headers:{
                        anticsrf:props.antiCsrfToken
                    }
                }); //withCredentials permite envio de cookies
                
                document.querySelector(`.profile-container__incident--${id}`).style.transform = "rotateY(90deg)";

                document.querySelector(`.profile-container__incident--${id}`).ontransitionend = ()=>{
                    setSucessDeleteIncidents('Caso excluído com sucesso!');
                }

                /*
                    O método filter() cria um novo array com todos os elementos que passaram no teste 
                    implementado pela função fornecida.
                */

            }catch(error){

                if(error.response){ //.response access the error response
                    if(error.response.data.error === "Not found"){
                        setErrorDeleteIncidents('Esse caso não existe!');
                    }else{
                        setErrorDeleteIncidents('Forbidden');
                    }
                }else{
                    setErrorDeleteIncidents('Falha na conexão com o servidor!');
                }
            }
        }
    }

    if(!errorGetIncidents){
        if(incidentsExist){
            return(
                <ul className="grid-2c rotation">
                    { // para usar javascript dentro do jsx, é necessário usar { }
                        incidents.map(incident =>{ // cada incident é um objeto JSON em um array que foi retornado pela requisição. map() percorre esse array
                            if(incidentToDelete.current !== incident.id){             
                                return(
                                    <li key = {incident.id} className={`rotation__side rotation__side--front profile-container__incident--${incident.id}`}>
                                        <strong>CASO:</strong>
                                        <p>{incident.title}</p>

                                        <strong>DESCRIÇÃO:</strong>
                                        <p>{incident.description}</p>

                                        <strong>VALOR</strong>
                                        <p>{
                                            Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(incident.value)
                                        }</p>

                                        <button className="btn-icon-2" type="button" onClick={
                                            ()=>handleDelete(incident.id)
                                        }>
                                            <FiTrash2 className="u-font-size-icon-small"/>
                                        </button>
                                    </li>
                                )
                            }else{
                                return(
                                    <Alert
                                        key = {incident.id}
                                        error = {errorDeleteIncidents}
                                        sucess = {sucessDeleteIncidents || prevSucessDeleteIncidents}
                                        className = {`rotation__side rotation__side--back profile-container__incident--${incident.id} u-font-size-medium`}
                                        style = {{height:incidentHeight.current}} //ou passa um valor ou passa null
                                    />
                                );
                            }
                        })

                        /*
                            Para eventos, como onClick, devem ser passadas FUNÇÕES, NÃO CHAMADAS
                            A FUNÇÕES, pois durante a renderização, a função passada será convertida
                            para javascript. Se for uma chamada a uma função em vez de uma função,
                            ela vai ser executada na renderização, não quando o evento é acionado.

                            Se a função a ser executada não receber nenhum argumento, isso pode ser
                            feito assim:

                                onClick = {nomeDaFunção}

                            Se precisar, deve ser feito assim:

                                onClick = {
                                    ()=>{
                                        nomeDaFunção(argumentos)
                                    }
                                }
                            
                            Além disso, no tratamento de eventos, o evento em questão pode ser passado
                            como argumento, da seguinte forma:

                                onClick = {
                                    (e) =>{
                                        e.target...
                                    }
                                }

                        */

                        /*
                            O método map chama a função callback recebida por parâmetro para cada 
                            elemento do Array original, em ordem, e constrói um novo array com base 
                            nos retornos de cada chamada. A função callback é chamada apenas para os 
                            elementos do array original que tiverem valores atribuídos; os elementos 
                            que estiverem como undefined, que tiverem sido removidos ou os que nunca 
                            tiveram valores atribuídos não serão considerados.

                            OBS: É comum a renderização de listas com vários componentes no React.
                            Para identificar cada um desses componentes, o React recomenda o uso
                            de uma propriedade especial chamada key, que deve ser única, e ajuda
                            na manipulação de cada componente da lista. Nesse caso, vou usar a
                            primary key da tabela incidents.
                        */
                    }
                </ul>
            )
        }else{
            return(
                <Alert
                    error = 'Nenhum caso cadastrado!'
                    className = 'animated__fadeIn u-font-size-big'
                    style = {{height:window.innerHeight/2}}
                />
            );
        }
    }else{
        return(
            <Alert
                error = {errorGetIncidents}
                className = 'animated__fadeIn u-font-size-big'
                style = {{height:window.innerHeight/2}}
            />
        );
    }
}