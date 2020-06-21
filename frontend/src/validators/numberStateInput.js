export function allowOnlyNumbers(state, setState){
    if(/^[0-9\s]*$/.test(state)){
        setState(state);
    }
}

export function moneyFormat(state, setState){

    if(!state.startsWith("R$ ")){
        state = "R$ "+state;
    }

    if(!state.replace("R$ ","")){
        state = state.replace("R$ ","");
    }

    if(/^(\d+(\.\d{0,2})?|\.?\d{0,2})$/.test(state.replace("R$ ","")) && /^.{0,20}$/.test(state.replace("R$ ",""))){
        setState(state);
    }
}

export function phoneFormat(state, setState){

    state = state.replace(/\D/g,"");            
    state = state.replace(/^(\d{2})(\d)/g,"($1) $2"); 
    state = state.replace(/(\d)(\d{4})$/,"$1-$2");

    if(/^.{0,15}$/.test(state)){
        setState(state);
    }
}
