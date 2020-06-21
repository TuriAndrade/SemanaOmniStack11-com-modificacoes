export function loginRegEx(state, setState){
    state = state.toLowerCase();

    if(/^[a-z0-9_.]{0,16}$/.test(state)){
        setState(state);
    }
}