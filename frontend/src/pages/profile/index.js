import React, {useState} from 'react';

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

import { FiPower, FiArrowLeft, FiUser } from 'react-icons/fi';

import Incidents from './incidents';
import Logout from './logout';
import ProfileList from './profileList';

    /*
    
        SUPER OBS: 

        O state e as props são definidos UMA VEZ quando o componente é MONTADO (primeira renderização)

        Toda vez que o state ou as props de um componente são definidos ou alterados, o componente 
        renderiza.
        
        Em qualquer renderização sem ser a primeira, o componente mantém para state e props os ÚLTIMOS
        VALORES DEFINIDOS.
        
        Toda vez que o componente é renderizado, assim que a renderização acaba, o useEffect()
        é invocado (somente se o array que determina quando ele deve ser invocado não for passado).

        Dessa forma, se o state for atualizado dentro do useEffect sem que haja condição de invocação
        (array que é o segundo parâmetro do useEffect), o componente iniciará um ciclo infinito de
        renderizações, o que é ruim para performance. 

        A condição de invocação do useEffect compara os valores passados (state ou props normalment) com 
        sua versão antes da renderização. Se houve uma alteração, useEffect é invocado. Se não, não é invocado.

        OBS: Passando um array vazio como segunto argumento do useEffect(), o hook não será disparado
        por nenhuma mudança nas variáveis do código, mesmo que o componente seja atualizado e renderizado
        novamente.

        SUPER OBS: Passar arrays para o array de dependências do useEffect NÃO funciona.
        A comparação feita entre o valor atual é do tipo strict (===), ou seja, é por referência.
        Por isso, quando um array é passado, somente suas referências são comparadas, não seu conteúdo.
        Além disso, mesmo que dois arrays tenham o mesmo conteúdo, se suas referências forem diferentes
        o retorno da comparação é false.

        Ex:

            const foo = [1,2,3];
            const bar = foo;
            foo === bar //true

            const foo = [1,2,3];
            const bar = [1,2,3];
            foo === bar //false
    
    */

    /*
        Element vs Component

        A React.Element references a DOM node created by React

        A React.Component is a function or a class that returns a React.Element

        When React renders on updating, in order to decide what to change, React 
        creates new React.Elements and compares it with the previous ones. It uses 
        a number of rules to decide what to do:

            1. Elements with differing types are trashed and re-rendered

            2. Elements with differing props or children are re-rendered in place

            3. Identical elements which have been re-ordered within an array are 
            moved to reflect the new order
    */

export default function Profile(props){

    const [openModalLogout, setOpenModalLogout] = useState(false);

    return(
        <>
            <div className="navigation">
                <input type="checkbox" className="navigation__checkbox" id="navigation__toggle"/>
                <label htmlFor="navigation__toggle" className="navigation__button">
                    <span className="navigation__icon"></span>
                </label>
                <div className="navigation__background"></div>
                <nav className="navigation__nav">
                    <ul className="navigation__list">
                        <li className="navigation__item">
                            <div onMouseLeave={
                                ()=>{
                                    document.querySelector('#navigation__logo-img').style.opacity = "0";
                                    document.querySelector('#navigation__logo-img').ontransitionend = ()=>{
                                        document.querySelector('#navigation__logo-img').style.opacity = "1";
                                        document.querySelector('#navigation__logo-img').style.filter = "brightness(10)";
                                    }
                                }
                            } onMouseEnter={
                                ()=>{
                                    document.querySelector('#navigation__logo-img').style.opacity = "0";
                                    document.querySelector('#navigation__logo-img').ontransitionend = ()=>{
                                        document.querySelector('#navigation__logo-img').style.opacity = "1";
                                        document.querySelector('#navigation__logo-img').style.filter = "brightness(1)";
                                    }
                                }
                            } onClick={
                                ()=>{
                                    document.querySelector("#navigation__toggle").checked = false;
                                }
                            } className="navigation__logo-img">
                                <img id='navigation__logo-img' src={LogoImg} alt="Be The Hero"/>
                            </div>
                        </li>
                        <li className="navigation__item">
                            <Link className="link-text-2" to='/incidents/new'>Cadastrar novo caso</Link>
                        </li>
                        <li className="navigation__item">
                            <button onClick={
                                ()=>{
                                    setOpenModalLogout(true);
                                }
                            } className="navigation__btn-icon"><FiPower className="u-font-size-icon-small"/></button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="right-menu">
                <input type="checkbox" className="right-menu__checkbox" id="right-menu__toggle"/>
                <label htmlFor="right-menu__toggle" className='right-menu__label'>
                    <div className="right-menu__button">
                        <FiUser className='right-menu__icon'/>
                    </div>
                </label>
                <div className="right-menu__background">
                    <div className="right-menu__content">
                        <button onClick={
                            ()=>{
                                document.querySelector("#right-menu__toggle").checked = false;
                            }
                        } className="right-menu__close-btn">
                            <FiArrowLeft className='right-menu__icon' color='#000'/>
                        </button>
                        <ProfileList antiCsrfToken = {props.antiCsrfToken}/>
                        <div className="right-menu__logo-box">
                            <img src={LogoImg} alt="Be The Hero"/>
                        </div>
                    </div>
                </div>
                <div onClick={
                    ()=>{
                        document.querySelector("#right-menu__toggle").checked = false;
                    }
                } className="right-menu__close-area"></div>
            </div>
            <Logout display={openModalLogout} antiCsrfToken={props.antiCsrfToken} setDisplay={setOpenModalLogout}/>
            <div className="u-padding-small-container">
                <header className="header">
                    <div className="header__logo-box">
                        <div className="header__logo">
                            <img src={LogoImg} alt="Be The Hero"/>
                        </div>
                    </div>
                </header>
                <div className="profile-container">
                    <div className="u-container-big">
                        <section className="profile-container__section-incidents u-padding-bottom-small">
                            <h1 className="heading-primary u-margin-bottom-medium">Casos cadastrados</h1>
                            <Incidents antiCsrfToken={props.antiCsrfToken}/>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}