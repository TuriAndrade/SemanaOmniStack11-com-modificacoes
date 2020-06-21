import api from './services/api';

export async function isLoggedIn(){
    try{
        const response = await api.get('/authentication', {withCredentials:true, timeout:2000});
        return response.data.antiCsrfToken;

    }catch(error){
        return false;
    }
}