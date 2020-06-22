import React, {useState, useEffect, useRef} from 'react';

import StateInput from '../../components/stateInput';
import StateTextarea from '../../components/stateTextarea';

import Alert from '../../components/alert';

import api from '../../services/api';

import {verifyIfBlank, atMost50, atMost150} from '../../validators/stateInput';
import { moneyFormat } from '../../validators/numberStateInput';

export default function NewIncidentForm(props){

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');

    /*
        Values of controlled inputs should always start with '' or another string instead of null.
        When they are mounted and first receive the state as their values, if the state is null, the
        value of the input will be undefined and it will become uncontrolled.

        OBS: Controlled inputs are inputs that have their values controlled by the state
    */

    const [errorTitle, setErrorTitle] = useState(null);
    const [errorDescription, setErrorDescription] = useState(null);
    const [errorValue, setErrorValue] = useState(null);

    const [error, setError] = useState(null);
    const [sucess, setSucess] = useState(null);

    const [prevSucess, setPrevSucess] = useState(null);

    const didSubmit = useRef(false);

    const formHeight = useRef(false);

    const textareaHeight = useRef(null);

    const rotationFront = useRef();
    const rotationBack = useRef();

    /*
        Na montagem do componente, didSubmit é false e o form não é renderizado com uma transição
        Logo após ele ser montado, didSubmit é definido como true, e todas as vezes que o componente
        for atualizado, o form é renderizado com uma transição.
    */

    useEffect(()=>{

        if(error || sucess){

            rotationBack.current.style.transform = "rotateY(0deg)";
            
        }else if(prevSucess){

            didSubmit.current = true;
            
            rotationBack.current.style.transform = "rotateY(-90deg)";

            rotationBack.current.ontransitionend = () =>{
                setPrevSucess(null);
            }

        }else{
            didSubmit.current = false;
            rotationFront.current.style.transform = "rotateY(0deg)";
        }

    }, [error, sucess, prevSucess]);

    useEffect(()=>{
        if(!errorTitle && !errorDescription && !errorValue){
            formHeight.current = document.querySelector('.form').offsetHeight;
        }
    },[errorTitle, errorDescription, errorValue]);

    async function handleNewIncident(e){ //e é o evento e não precisa ser passado como argumento aparentement
        e.preventDefault();

        textareaHeight.current = document.querySelector('.form textarea').offsetHeight;
        
        formHeight.current = document.querySelector('.form').offsetHeight;

        const data = {
            title:verifyIfBlank(title, setErrorTitle),
            description:verifyIfBlank(description, setErrorDescription),
            value:verifyIfBlank(value.replace("R$ ",""), setErrorValue)
        }

        if(data.title && data.description && data.value){
        
            try{
                await api.post('/incidents', data, {
                    withCredentials:true, 
                    timeout:5000,
                    headers:{
                        anticsrf:props.antiCsrfToken
                    }
                });

                rotationFront.current.style.transform = "rotateY(90deg)";

                rotationFront.current.ontransitionend = () => {
                    setSucess('Caso cadastrado com sucesso!');
                    
                    setTimeout(()=>{
                        setPrevSucess('Caso cadastrado com sucesso!');
                        setTitle('');
                        setDescription('');
                        setValue('');
                        setSucess(null);
                    },1500)
                };

                /*
                    O evento ontransitionend dispara quando a transição do elemento acaba.
                    Também existe um onanimationend.
                */

            }catch(error){
                if(error.response){
                    setError('Forbidden');
                }else{
                    setError('Falha na conexão com o servidor!');
                }
            }
        }
    }

    if(!error && !sucess && !prevSucess){
        return(
            <form 
                ref={rotationFront}
                style={didSubmit.current ? {transform:"rotateY(90deg)"}:null}
                className="form rotation__side rotation__side--front" 
                onSubmit={handleNewIncident}
                noValidate={true}
            >
                <StateInput 
                    error = {errorTitle}
                    type = 'text'
                    placeholder = 'Título do caso'
                    state={title}
                    setState = {setTitle}
                    validate={atMost50}/>
                <StateTextarea 
                    error = {errorDescription}
                    placeholder = 'Descrição do caso'
                    state = {description}
                    setState = {setDescription}
                    rows = {4}
                    height={textareaHeight.current}
                    validate={atMost150}/>
                <StateInput 
                    error = {errorValue}
                    type = 'text'
                    placeholder = 'Valor'
                    state={value}
                    setState = {setValue}
                    validate = {moneyFormat}/>
                <button className="btn btn--100 btn--red" type="submit">Cadastrar</button>
            </form>
        );
    }else{
        return(
            <Alert
                fowardedRef={rotationBack}
                error = {error}
                sucess = {sucess || prevSucess}
                className = 'rotation__side rotation__side--back u-font-size-medium'
                style = {{height:formHeight.current}}
            />
        );
    }
}