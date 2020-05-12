const redis = require('redis'); // redis é um in memory, noSQL database
const client = redis.createClient(); //aceita um array [options] e outros parâmetros, ver documentação
/*
    Por padrão, a conexão com o redis é em localhost e não tem senha, mas pode ser configurada
    para outros servidores e com senha
*/

client.on("error", function(error) {
    console.error(error);
});

/*
    All redis comands in node are asynchronous, so results must be treated in callbacks
*/

module.exports = client;