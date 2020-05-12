const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const redis = require('../database/redis');

module.exports = {
    async index(request,response){

        jwt.verify(request.token, process.env.JWT_SECRET, async function (err, ong){ //ong acces token after its decrypted
            if(err){ //fires if token doesn't exists
                return response.status(401).json({error:"Invalid token"});
            }else if(utils.decode(request.token).iat > request.app.get('timestamp')){
                /*
                    Essa condição invalida todos os tokens que foram criados antes do deploy do servidor
                */
                
               redis.get(ong.login, async (error, result)=>{

                    if(error){
                        return response.status(400).json({error});
                    }else{
                        if(utils.decode(request.token).iat > Number(result)){ //if no data matches the ong.login, result will be null and this condition will be true
                    
                            const incidents = await connection('incidents').where('ong_login',ong.login).select('*'); //para usar o await aqui, é necessário definir a callback do jwt.verify como async

                            return response.json({incidents});

                        }else{
                            return response.status(401).json({error:"Blacklisted token"});
                        }
                    }
                });

            }else{
                return response.status(401).json({error:"Old token"});
            }
        });
    }
}