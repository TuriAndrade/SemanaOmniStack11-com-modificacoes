import React, {useState,useEffect} from 'react';

/*
    Usando esse Hook, você diz ao React que o componente precisa fazer algo apenas depois da 
    renderização. O React ira se lembrar da função que você passou (nos referiremos a ele como 
    nosso “efeito”), e chamá-la depois que realizar as atualizações do DOM. 

    UseEffect executa depois de toda renderização e PODE retornar uma function de limpeza que
    é executada após a renderização se necessário

    Como segundo parâmetro, pode receber um array que determina argumentos, como props ou state,
    fazendo com que o hook só seja executado se os componentes do array tenham sido atualizados,
    mesmo que a página seja renderizada novamente. Isso melhora a performance.

    OBS: Quando o componente é montado, a primeira renderização, o useEffect é sempre disparado
    Depois, mesmo que o componente seja renderizado novamente, o disparo ou não do hook depende dos 
    argumentos passados no array.
*/

import LogoImg from '../../assets/logo.svg';

import { Link } from 'react-router-dom';

import { FiPower } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi';

import './profile_main.css';

import api from '../../services/api';
import {getToken} from '../../services/auth';

export default function Profile(){
    const [incidents, setIncidents] = useState([]); //o valor inicial de incidents é um array vazio
    const ongName = localStorage.getItem("nome_login@beTheHero");

    useEffect(()=>{
        api.get('/profile',{ //posso passar um objeto como segundo parâmetro, e o axios converte ele para JSON
            headers: {
                authorization: `Bearer ${getToken()}`
            }
        }).then(response => setIncidents(response.data.incidents));

        /*
            Nesse caso, é melhor usar .then do que async e await, pois a callback do useEffect é
            síncrona para evitar error. Se ela for definida como async, ainda funciona, mas o react
            avisa que é melhor não fazer isso.
        */
    },[ongName]);

    /*
    
        SUPER OBS: 
        
        Toda vez que o componente é renderizado, assim que a renderização acaba, o useEffect()
        é invocado (somente se o array que determina quando ele deve ser invocado não for passado).
        
        Além disso, toda vez que o state ou as props de um componente são alteradas, o componente 
        renderiza novamente.

        Dessa forma, se o state for atualizado dentro do useEffect sem que haja condição de renderização
        (array que é o segundo parâmetro do useEffect), o componente iniciará um ciclo infinito de
        renderizações, o que é ruim para performance. 

        OBS: Passando um array vazio como segunto argumento do useEffect(), o hook não será disparado
        por nenhuma mudança nas variáveis do código, mesmo que o componente seja atualizado e renderizado
        novamente.
    
    */

    return(
        <div className="profile-container">
            <div className="u-container-big">
                <header className="profile-container__header-box u-margin-bottom-medium">
                    <div className="row-fluid u-align-items-center u-justify-content-space-between">
                        <div className="profile-container__header-box--left">
                            <div className="profile-container__logo-img">
                                <img src={LogoImg} alt="Be The Hero"/>
                            </div>
                            <span className="profile-container__header-text">Bem Vinda, {ongName}!</span>
                        </div>
                        <div className="profile-container__header-box--right">
                            <Link className="btn" to='incidents/new'>Cadastrar novo caso</Link>
                            <button className="btn-icon" type="button"><FiPower className="u-font-size-icon-small" color="#e02041"/></button>
                        </div>
                    </div>
                </header>
                <section className="profile-container__section-incidents u-padding-bottom-small">
                    <h1 className="heading-primary u-margin-bottom-medium">Casos cadastrados</h1>
                    <ul className="profile-container__section-incidents--grid">
                        { // para usar javascript dentro do jsx, é necessário usar { }
                            incidents.map(incident =>{ // cada incident é um objeto JSON em um array que foi retornado pela requisição. map() percorre esse array
                                return(
                                    <li key = {incident.id}>
                                        <strong>CASO:</strong>
                                        <p>{incident.title}</p>

                                        <strong>DESCRIÇÃO:</strong>
                                        <p>{incident.description}</p>

                                        <strong>VALOR</strong>
                                        <p>{
                                            Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(incident.value)
                                            
                                            /*
                                                O objeto Intl é o namespace para a API de Internacionalização do ECMAScript , 
                                                que fornece comparação de string sensível à línguagem, formatação de números, 
                                                e formatação de data e hora. 
                                            */

                                        }</p>

                                        <button className="btn-icon-2" type="button"><FiTrash2 className="u-font-size-icon-small"/></button>
                                    </li>
                                )
                            })

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
                </section>
            </div>
        </div>
    );
}