const jwt = require('jsonwebtoken');
const utils = require('../utils');
const redis = require('../database/redis');

module.exports = {

    verifyAuthenticationToken(request, response, next){ //verifies if there is a jwt or not
        const token = request.cookies.token;

        if(token){ 
            
            jwt.verify(token, process.env.JWT_AUTHENTICATION, async function (err, ong){ //ong acces token after its decrypted
                if(err){ //fires if token doesn't exists
                    return response.status(401).json({error:"Invalid auth token"});
                }else{
                    redis.get('first-connection', (error, result)=>{
                        if(error){
                            return response.status(400).json({error});
                        }else if(result){
                            if(utils.decode(token).iat > Number(result)){
                                redis.get(ong.id, async (error, result)=>{
                                    if(error){
                                        return response.status(400).json({error});
                                    }else{
                                        if(ong.generation > Number(result)){ //if no data matches the ong.id, result will be null and this condition will be true
    
                                            request.token = token; 
                                            request.ong = ong;
                                            next();
                                            
                                        }else{
                                            return response.status(401).json({error: "Blacklisted token"});
                                        }
                                    }
                                });
                            }else{
                                return response.status(401).json({error: "Old token"})
                            }
                        }else{
                            return response.status(400).json({error: "Connection problem"})
                        }
                    })
                }
            });

        }else{
            response.status(401).json({error:"Auth token is required"})
        }
    },

    verifyAntiCsrfToken(request, response, next){
        const token = request.headers.anticsrf;

        const authenticatedOng = request.ong;

        if(token){
            jwt.verify(token, process.env.JWT_ANTICSRF, async function (err, antiCsrfData){ //ong acces token after its decrypted
                if(err){ //fires if token doesn't exists
                    return response.status(401).json({error:"Invalid antiCsrf token"});
                }else{
                    if(authenticatedOng){
                        if(authenticatedOng.id === antiCsrfData.id){
                            next();
                        }else{
                            return response.status(401).json({error:"Ong not authenticated"});
                        }
                    }else{
                        next();
                    }
                }
            }); 
        }else{
            response.status(401).json({error:"AntiCsrf token is required"})
        }
    }, 

    getGenericAntiCsrfToken(request, response){
        const token = utils.generateToken({random: utils.generateRandomString()}, process.env.JWT_ANTICSRF, 60*20);

        return response.json({token});
    }
}