const connection = require('../database/connection');
const utils = require('../utils');
const jwt = require('jsonwebtoken');
const redis = require('../database/redis');
const {promisify} = require('util');
const redisTTL = promisify(redis.ttl).bind(redis);

module.exports = {
    async create(request,response){
        const { login } = request.body;
        const { password } = request.body;

        const queryLogin = await connection('ongs').where('login',login).select('name').first();

        if(!queryLogin){
            return response.status(400).json({error:"No ONG found with this login"});
        }else{
            const queryPassword = await connection('ongs').where({login:login,password:password}).select('login','name','city','uf').first(); 
            /*
                Each result of this query would be an JSON object containing the login and the name

                The select returns an array containing all the the JSON objects

                .first() returns only the first object, instead of an array
            */

            if(!queryPassword){
                return response.status(400).json({error:"Incorrect password"});
            }else{
                const token = utils.generateTokenOng(queryPassword);

                return response.cookie('token', token, { //this overwrites any other cookie with the same name
                    httpOnly:true, //httpOnly cookies can not be accessed in the browser, so they are safe against XSS attacks
                    expires: new Date(Number(utils.decode(token).exp)*1000) //the value is a date equal to the token expiration date parsed to ms
                }).json({
                    token:token,
                    name:queryPassword.name
                });

                /*  
                    If .first() is used, to access the login and the name like this:
                    queryPassword['login'] and queryPassword['name'] or queryPassword.login 
                    and queryPassword.name
                    
                    If .first() isn't used, to access the login and the name, it would
                    be necessary to access the first position of the results array, like this:
                    queryPassword[0]['login'] and queryPassword[0]['name'] or queryPassword[0].login 
                    and queryPassword[0].name
                */
            }
        }
    },

    async delete(request,response){
        jwt.verify(request.token, process.env.JWT_SECRET, function (err, ong){
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
                    
                            redis.setex(ong.login, (utils.decode(request.token).exp - utils.decode(request.token).iat), utils.decode(request.token).iat, async (error, result)=>{
                                if(error){
                                    return response.status(400).json({error});
                                }else{
                                    return response.json({result})    
                                }
                            });
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