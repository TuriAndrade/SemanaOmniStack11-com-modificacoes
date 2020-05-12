import React from 'react';

import './newIncident_main.css';

import logoImg from '../../assets/logo.svg';

import { FiArrowLeft } from 'react-icons/fi';

import { Link } from 'react-router-dom';

export default function NewIncident(){
    return(
        <div className="newIncident-container">
             <div className="u-container-small u-box-shadow u-padding-medium">
                <div className="row">
                    <div className="col col-50">
                        <div className="u-margin-bottom-medium">
                            <div className="newIncident-container__logo-img">
                                <img src={logoImg} alt="Be The Hero"/>
                            </div>
                        </div>
                        <div className="u-margin-bottom-small">
                            <h1 className="heading-primary">Cadastrar novo caso</h1>
                        </div>
                        <p>Descreva o caso detalhadamente e encontre um herói para resolvê-lo!</p>
                        <div className="u-margin-top-small">
                            <Link className="link" to="/profile">
                                <FiArrowLeft className="u-font-size-icon-small" color="#e02041"/>Voltar para home
                            </Link>
                        </div>
                    </div>
                    <div className="col col-50">
                        <form className="form">
                            <input placeholder="Título do caso" type="text"/>
                            <textarea rows={4} placeholder="Descrição"></textarea>
                            <input placeholder="Valor" type="text"/>
                            <button className="btn-100" type="submit">Cadastrar</button>
                        </form>
                    </div>
                </div>
             </div>
        </div>
    );
}