export function verifyIfBlank(state, setError){
    if(state){
        setError(null);
        return state;
    }else{
        setError('Este campo é obrigatório!');
    }
}

export function atLeast4(state, setError){
    if(state){
        if(!/^.{4,}$/.test(state)){
            setError('Digite no mínimo 4 caracteres');
            return null;
        }else{
            setError(null);
            return state;
        }
    }else{
        setError('Este campo é obrigatório!');
    }
}

export function atLeast8(state, setError){
    if(state){
        if(!/^.{8,}$/.test(state)){
            setError('Digite no mínimo 8 caracteres');
            return null;
        }else{
            setError(null);
            return state;
        }
    }else{
        setError('Este campo é obrigatório!');
    }
}

export function atLeast14(state, setError){
    if(state){
        if(!/^.{14,}$/.test(state)){
            setError('Digite no mínimo 14 caracteres');
            return null;
        }else{
            setError(null);
            return state;
        }
    }else{
        setError('Este campo é obrigatório!');
    }
}

export function atMost50(state, setState){
    if(/^.{0,50}$/.test(state)){
        setState(state);
    }
}

export function atMost150(state, setState){
    if(/^.{0,150}$/.test(state)){
        setState(state);
    }
}