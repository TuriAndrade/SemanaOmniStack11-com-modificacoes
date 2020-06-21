//OBS: npm instala pacotes e npx executa

const express = require('express'); //require é usado para importar pacotes, como o express, e arquivos
const cors = require('cors');
const routes = require('./routes'); //require usado para importar o arquivo routes.js
const cookieParser = require('cookie-parser'); //Middleware que permite criação e manipulação de cookies

const app = express(); // express fornece mecanismos para gerenciamento de rotas, URLs e requisições.

/*
    Por padrão, os navegadores só permitem que um recurso de um site seja chamado por outro site se eles 
    estiverem hospedados no mesmo domínio

    O cors permite cominicação entre domínios de forma livre, desde que os domínios aceitos para troca 
    de informações sejam especificados devidamente.

    Sua principal função é permitir comunicação entre o frontend e o backend.

    OBS: Mesmo que uma origem seja definida no cors, browsers ainda podem acessar as rotas da aplicação
*/

app.use(cors({
    origin: 'http://localhost:3000', //Access-Control-Allow-Origin
    credentials:true //Access-Control-Allow-Credentials

    /*
        By default, credentials such as HTTP cookies and HTTP authentication headers
        are NOT sent or received in cross-site comunication.

        To apply it, Access-Control-Allow-Origin MUST be specified (AND DIFFERENT FROM '*')
        in the server's response, and the Access-Control-Allow-Credentials must be set to TRUE 
        both in the client's request and in the server's response

    */

})); 

/*
    Normalmente, o frontend não conseguiria acessar o backend, mas o cors() sem especificação
    nenhuma permite que qualquer domínio acesse o backend.
*/

app.use(cookieParser());

app.use(express.json()); // Possibilita o entendimento de request body em JSON pelo javascript. Deve ser declarado antes das rotas para que elas possam usar JSON 
app.use(routes);

app.listen(3333,'localhost',()=>{
    app.set('timestamp',new Date().getTime()/1000);

/*
    Grava a data do momento em que o servidor vai pro ar em timestamp (milisec desde 1/1/1970)
    convertida pra segundos. Assim, posso comparar com o iat dos tokens para invalidar todos criados
    antes do servidor ir pro ar. Isso é importante por que se o servidor cair, a token blacklist
    no kedis(in memory database) é deletada, fazendo com que a data mínima válida de criação de
    um token seja apagada e qualquer data possa ser aceita.
*/

}); // inicia a conexão nos determinados (port, hostname) 


/* 
    Rota => ex: localhost:3333/users 
    Recurso: users => um recurso pode ser um registro em uma tabela do DB por exemplo, normalmente identificado pela id, e sua identificação pode ser passada por route params.

*
    Métodos HTTP:

    GET: Buscar/Pedir representação de um recurso no backend. Os dados vão na URL.
    POST: Criar um recurso no backend. Os dados NÃO vão na URL, mas no corpo da requisição.
    PUT: Requisita que um recurso seja "guardado" na URI fornecida. Se o recurso já existir, ele deve ser atualizado. Se não existir, pode ser criado. Os dados NÃO vão na URL, mas no corpo da requisição.
    DELETE: Exclui o recurso especificado.

*

    Tipos de parâmetros

    Query params: nomeados e enviados na rota após "?" (Filtros de pesquisa, paginação)
    Route params: parâmetros usados para identificar recursos
    Request body: corpo da requisição, utilizado para criar ou alterar recursos 
    Request header: guarda informações do contexto da requisição, como autenticação do usuário, localização, etc

    OBS: Response header: pode ser utilizado para retornar alguns tipos de informação da resposta da requisição, como número total de elementos de uma paginação.

    OBS: NÃO é interessante passar parâmetros importantes, como logins e senhas, por meio de query e route parms, na URL.
*/
