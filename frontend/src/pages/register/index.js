import React from 'react'; 

import logoImg from '../../assets/logo.svg'; 

import { Link } from 'react-router-dom'; 

import { FiArrowLeft } from 'react-icons/fi';

import RegisterForm from './registerForm';

export default function Register(){

    return(
        <div className="register-container">
            <div className="u-container-medium u-box-shadow u-padding-medium">
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
                                <FiArrowLeft className="u-font-size-icon-small" color="#e02041"/>Fazer logon
                            </Link>
                        </div>
                    </div>
                    <div className="col col-50 rotation">
                        <RegisterForm/>
                    </div>
                </div>
            </div>
        </div>
    );
}