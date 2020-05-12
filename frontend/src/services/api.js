//na pasta services ficam todos os arquivos que vão prover algum serviço externo.

import axios from 'axios'; //axios é o cliente http que faz requisições à API. OBS: retorna Promises, então dá pra usar async e await

const api = axios.create({
    baseURL:"http://localhost:3333"
});

export default api;