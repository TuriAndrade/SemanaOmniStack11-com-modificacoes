const express = require('express');
const ongController = require('./controllers/ongController');
const incidentController = require('./controllers/incidentController');
const profileController = require('./controllers/profileController');
const sessionController = require('./controllers/sessionController');

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

routes.post('/sessions', sessionController.create); //POST é utilizado pois eu CRIO uma sessão durante o login.

routes.get('/ongs', ongController.index);
routes.post('/ongs', ongController.create);

routes.get('/profile',profileController.index);

routes.get('/incidents', incidentController.index);
routes.post('/incidents', incidentController.create);
routes.delete('/incidents/:id', incidentController.delete);

module.exports = routes //exporta variável routes do arquivo routes.js