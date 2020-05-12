export const tokenKey = "token_login@beTheHero";
export const isAuthenticated = () => localStorage.getItem(tokenKey) !== null; //simplified arrow function. Returns the token key if it's different from null. Otherwise, returns nothing.
export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = token => localStorage.setItem(tokenKey,token);
export const delToken = () => localStorage.removeItem(tokenKey);