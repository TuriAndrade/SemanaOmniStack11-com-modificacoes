const redis = require('redis'); // redis é um in memory, noSQL database
const client = redis.createClient(); //aceita um array [options] e outros parâmetros, ver documentação
/*
    Por padrão, a conexão com o redis é em localhost e não tem senha, mas pode ser configurada
    para outros servidores e com senha
*/

client.on("error", function(error) {
    console.error(error);
});

client.on("connect", function(){
    client.setnx('first-connection', new Date().getTime()/1000, (error, result)=>{                     
        if(error){
            console.error(error);
        }else{
            client.get('first-connection', (error, result)=>{
                if(error){
                    console.error(error);
                }else{
                    console.log("First connection with the redis-server: "+result)
                }
            })
        }
    });
})

/*
    This method sets the timestamp in seconds of moment of the connection in the redis database ONLY 
    if it doesn't exist. This way, the value stored is always the timestamp of the last deploy of the 
    redis-server and it's possible to invalidate the user tokens that were issued before it.

    OBS: As long as they share the redis database, this solution works for multiple servers even if one
    or all of them fall at some point.
*/

/*
    All redis comands in node are asynchronous, so results must be treated in callbacks
*/

module.exports = client;