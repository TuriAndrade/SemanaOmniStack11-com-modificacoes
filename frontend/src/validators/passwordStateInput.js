export function passwordRegEx(state, setState){
    if(/^[A-Za-z0-9_.]{0,16}$/.test(state)){
        setState(state);
    }
}