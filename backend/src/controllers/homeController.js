const connection = require('../database/connection');
const utils = require('../utils');
const jwt = require('jsonwebtoken');
const redis = require('../database/redis');

module.exports = {
    async redirect(request,response){
        jwt.verify(request.token, process.env.JWT_SECRET, async function (err, ong){ //ong acces token after its decrypted
            if(err){ //fires if token doesn't exists
                return response.status(401).json({error:"Invalid token"});
            }else if(utils.decode(request.token).iat > request.app.get('timestamp')){ //request.app holds a reference to the instance of the Express application that is using the middleware.
                
                /*
                    Essa condição invalida todos os tokens que foram criados antes do deploy do servidor
                */

                redis.get(ong.login, async (error, result)=>{
                    if(error){
                        return response.status(400).json({error});
                    }else{
                        if(utils.decode(request.token).iat > Number(result)){ //if no data matches the ong.login, result will be null and this condition will be true
                            
                            const login = ong.login; // ong é o objeto JSON retornado pelo jwt.verify
            
                            const exists = await connection('ongs').where('login',login).select('login', 'name').first();
            
                            if(exists){ //not really necessary, because if the token didn't exist the err would have caught it
                                return response.json({
                                    name:exists.name,
                                    redirect:true
                                });
                            }else{
                                return response.status(401).json({error:"No ONG found with this login"})
                            }
                        }else{
                            return response.status(401).json({error: "Blacklisted token"});
                        }
                    }
                });
            }else{
                return response.status(401).json({error:"Old token"});
            }
        });
    }
}