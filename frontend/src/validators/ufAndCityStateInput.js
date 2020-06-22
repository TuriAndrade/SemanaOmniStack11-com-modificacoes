const ufArray = [
    {"nome": "Acre", "sigla": "AC", "id": 12},
    {"nome": "Alagoas", "sigla": "AL", "id": 27},
    {"nome": "Amapá", "sigla": "AP", "id": 16},
    {"nome": "Amazonas", "sigla": "AM", "id": 13},
    {"nome": "Bahia", "sigla": "BA", "id": 29},
    {"nome": "Ceará", "sigla": "CE", "id": 23},
    {"nome": "Distrito Federal", "sigla": "DF", "id": 53},
    {"nome": "Espírito Santo", "sigla": "ES", "id": 32},
    {"nome": "Goiás", "sigla": "GO", "id": 52},
    {"nome": "Maranhão", "sigla": "MA", "id": 21},
    {"nome": "Mato Grosso", "sigla": "MT", "id": 51},
    {"nome": "Mato Grosso do Sul", "sigla": "MS", "id": 50},
    {"nome": "Minas Gerais", "sigla": "MG", "id": 31},
    {"nome": "Pará", "sigla": "PA", "id": 15},
    {"nome": "Paraíba", "sigla": "PB", "id": 25},
    {"nome": "Paraná", "sigla": "PR", "id": 41},
    {"nome": "Pernambuco", "sigla": "PE", "id": 26},
    {"nome": "Piauí", "sigla": "PI", "id": 22},
    {"nome": "Rio de Janeiro", "sigla": "RJ", "id": 33},
    {"nome": "Rio Grande do Norte", "sigla": "RN", "id": 24},
    {"nome": "Rio Grande do Sul", "sigla": "RS", "id": 43},
    {"nome": "Rondônia", "sigla": "RO", "id": 11},
    {"nome": "Roraima", "sigla": "RR", "id": 14},
    {"nome": "Santa Catarina", "sigla": "SC", "id": 42},
    {"nome": "São Paulo", "sigla": "SP", "id": 35},
    {"nome": "Sergipe", "sigla": "SE", "id": 28},
    {"nome": "Tocantins", "sigla": "TO", "id": 17}

]


export function ufRegEx(state, setState){
    state = state.toUpperCase();

    if(/^[A-Z]{0,2}$/.test(state)){
        setState(state);
    }
}

export function validateUf(state, setError){
    if(state){
        if(ufArray.filter(uf => uf.sigla === state).length === 0){
            setError('UF inválida!');
            return null;
        }else{
            setError(null);
            return state;
        }
    }else{
        setError('Este campo é obrigatório!');
    }
}

export async function validateCity(stateCity, stateUf, setError){
    if(stateCity){
        if(stateUf){

            const testUf = ufArray.filter(uf => uf.sigla === stateUf);

            if(testUf.length > 0){
                try{
                    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${testUf[0].id}/distritos`)
                
                    const cities = await response.json();

                    if(cities.filter(city => city.nome.toUpperCase() === stateCity.toUpperCase()).length > 0){
                        setError(null);
                        return stateCity;
                    }else{
                        setError('Cidade não encontrada!');
                        return null;
                    }
                }catch(error){
                    setError('Falha na conexão com a internet!');
                    return null;
                }

            }else{
                setError('Cidade não encontrada!');
                return null;
            }

        }else{
            setError('Cidade não encontrada!');
            return null;
        }
    }else{
        setError('Este campo é obrigatório!');
    }
}

