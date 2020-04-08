//OBS: npm instala pacotes e npx executa

const express = require('express'); //require é usado para importar pacotes, como o express e arquivos
const cors = require('cors');
const routes = require('./routes'); //require usado para importar o arquivo routes.js

const app = express(); // express fornece mecanismos para gerenciamento de rotas, URLs e requisições.

/*
Por padrão, os navegadores só permitem que um recurso de um site seja chamado por outro site se eles estiverem hospedados no mesmo domínio
O cors permite cominicação entre domínios de forma livre, desde que os domínios aceitos para troca de informações sejam especificados devidamente.
Sua principal função é permitir comunicação entre o frontend e o backend.
*/

app.use(cors()); 
app.use(express.json()); // Possibilita o entendimento de request body em JSON pelo javascript. Deve ser declarado antes das rotas para que elas possam usar JSON 
app.use(routes);

app.listen(3333,'localhost'); // inicia a conexão nos determinados (port, hostname) 


/* 
    Rota => ex: localhost:3333/users 
    Recurso: users => um recurso pode ser um registro em uma tabela do DB por exemplo, normalmente identificado pela id

*
    Métodos HTTP:

    GET: Buscar/Pedir representação de um recurso no backend. Os dados vão na URL.
    POST: Criar um recurso no backend. Os dados NÃO vão na URL, mas no corpo da requisição.
    PUT: Requisita que um recurso seja "guardado" na URI fornecida. Se o recurso já existir, ele deve ser atualizado. Se não existir, pode ser criado. Os dados NÃO vão na URL, mas no corpo da requisição.
    DELETE: Exclui o recurso especificado.

*

    Tipos de parâmetros

    Query params: nomeados e enviados na rota após "?" (Filtros, paginação)
    Route params: parâmetros usados para identificar recursos
    Request body: corpo da requisição, utilizado para criar ou alterar recursos 
    Request header: guarda informações do contexto da requisição, como autenticação do usuário, localização, etc

    OBS: Response header: pode ser utilizado para retornar alguns tipos de informação da resposta da requisição, como número total de elementos de uma paginação.

    OBS: NÃO é interessante passar parâmetros importantes, como logins e senhas, por meio de query e route parms, na URL.
*/
