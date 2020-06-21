export default function validateEmail(email, setError){
    if(email){
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError(null);
            return email;
        }else{
            setError('Email inválido!');
            return null;
        }
    }else{
        setError('Este campo é obrigatório!')
    }
}