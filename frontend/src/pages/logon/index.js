import React from 'react';

import heroesImg from '../../assets/heroes.png'; //heroesImg é uma variável que recebeu a importação
import logoImg from '../../assets/logo.svg';

import LogonForm from './logonForm';

export default function Logon(){

    return(
        <div className="logon-container">
            <div className="u-container-medium u-padding-medium">
                <div className="row">
                    <div className="col col-40 rotation">
                        <div className="u-margin-bottom-medium">
                            <div className="logon-container__logo-img">
                                <img src={logoImg} alt="Be the hero"/>
                            </div>
                        </div>
                        <div className="u-margin-bottom-small">
                            <h1 className="heading-primary">Faça seu logon</h1>
                        </div>
                        <LogonForm/>
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