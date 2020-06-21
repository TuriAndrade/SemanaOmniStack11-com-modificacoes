require('dotenv').config(); 

/*
    An app's config is everythig that vary between deploys. It can be database config, 
    jsonwebtoken keys, etc. It's a good practice to keep it in separate files.

    dotenv is a module that stores enviroment variables(variables that change according with the
    deploy enviroment for example). To access it, a .env file must be created in the same folder
    where node_modules folder is.

    deploy = implantação. Deploying a website usually means hosting it in a server after you finish
    the development
*/

const express = require('express');
const ongController = require('./controllers/ongController');
const incidentController = require('./controllers/incidentController');
const profileController = require('./controllers/profileController');
const sessionController = require('./controllers/sessionController');
const jwtController = require('./controllers/jwtController');

const routes = express.Router();

/* EXEMPLO

routes.post('/users/:id', (request,response) => { // :id é um route param; aceita valores como 1,2,etc
    const params = request.body; 
    
    // Request acessa parâmetros (request.query: query params, request.params: route params, request.body: request body)
    // Response retorna uma resposta ao usuário 
    
    console.log(params);
    return response.json({
        evento: 'semana OmniStack 11.0',
        aluno:'Turi Andrade'
    });
});

*/


//connection methods retornam promises, por isso é possível usar async, await e then() com eles.



/* MIDDLEWARE

    Realiza e otimiza integração entre aplicações. 
    
    É possível configurá-los pelo método .use() do express.js ou passá-los especificamente para as
    rotas desejadas. Middlewares do express recebem a request e a response e as manipulam.

    OS CONTROLLERS SÃO EXEMPLOS DE MIDDLEWARES

    No express, tem sempre 4 parâmetros nessa ordem: (err,req,res,next). Se apenas 2 forem declarados,
    serão req e res, se três forem, req, res e next e, por fim, se todos forem declarados, serão 
    err,req,res e next. Só é possível usar err declarando todos.

        Err=>Trata erros

        Req=> Acessa o objeto de solicitação

        Res=> Acessa o objeto de resposta

        Next=> Chama o próximo middleware. Se a atual função de middleware não terminar o ciclo 
        de solicitação-resposta, ela precisa chamar next() para passar o controle para a próxima 
        função de middleware. Caso contrário, a solicitação ficará suspensa.


    Middleware de aplicação => configurado para toda aplicação. Ex:
        const app = express();
        app.use(...);

        As próprias rotas criadas nesse arquivo são um middleware de aplicação e são usados por
        app.use(routes)

    Middleware de roteador => configurado em um grupo de rotas ou em uma rota específica. Ex:
        const routes = express.Router();
        routes.use(...);

        Definido em só uma rota:
            routes.get('/', (request,response)=>{...});

    Middleware de terceiros=> podem ser usados para incluir funcionalidades aos apps express. Ex
        app.use(cors())

    Middleare de manipulação de erros=> Trata erros. Para ser acessado, deve ser chamado com os 4
    parâmetros, err, req, res, next, nessa ordem, mesmo que alguns não forem usados
        


    OBS: É possível usar mais de um middleware, e eles são executados na ordem em que são passados. Ex
        routes.get('/', (request,response)=>{...}, function mid2(request,response){...});

        Podem ser arrow functions ou functions normais.

*/

routes.post('/sessions',jwtController.verifyAntiCsrfToken ,sessionController.create); //POST é utilizado pois eu CRIO uma sessão durante o login.
routes.delete('/sessions', jwtController.verifyAuthenticationToken, jwtController.verifyAntiCsrfToken, sessionController.delete);

routes.delete('/sessions/all', jwtController.verifyAuthenticationToken, jwtController.verifyAntiCsrfToken, sessionController.deleteAll); //DELETE é utilizado pois eu DELETO todas as sessões

routes.get('/authentication', jwtController.verifyAuthenticationToken, sessionController.authentication);

routes.get('/ongs', ongController.index);
routes.post('/ongs', jwtController.verifyAntiCsrfToken, ongController.create);

routes.get('/profile', jwtController.verifyAuthenticationToken, profileController.index);

routes.get('/get/data', jwtController.verifyAuthenticationToken, profileController.getData);

routes.put('/update/data', jwtController.verifyAuthenticationToken, jwtController.verifyAntiCsrfToken, profileController.updateData);

routes.get('/incidents', incidentController.index);
routes.post('/incidents', jwtController.verifyAuthenticationToken, jwtController.verifyAntiCsrfToken, incidentController.create);
routes.delete('/incidents/:id', jwtController.verifyAuthenticationToken, jwtController.verifyAntiCsrfToken, incidentController.delete);

routes.get('/generic/token', jwtController.getGenericAntiCsrfToken);

module.exports = routes //exporta variável routes do arquivo routes.js