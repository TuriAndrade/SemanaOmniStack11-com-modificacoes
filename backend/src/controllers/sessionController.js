const connection = require('../database/connection');
const utils = require('../utils');
const redis = require('../database/redis');

module.exports = {
    async create(request,response){
        const { login, password } = request.body;

        const queryLogin = await connection('ongs').where('login',login).select('id').first();

        if(!queryLogin){
            return response.status(400).json({error:"No ONG found with this login"});
        }else{
            const queryPassword = await connection('ongs').where({login:login,password:password}).select('id').first(); 
            /*
                Each result of this query would be an JSON object containing the id

                The select returns an array containing all the the JSON objects

                .first() returns only the first object, instead of an array
            */

            if(!queryPassword){
                return response.status(400).json({error:"Incorrect password"});
            }else{

                redis.get(queryPassword.id, async (error, result)=>{
                    if(error){
                        return response.status(400).json({error});
                    }else{
                        const obj = {
                            id:queryPassword.id,
                            generation: Number(result) + 1
                        }
        
                        const token = utils.generateToken(obj, process.env.JWT_AUTHENTICATION, 60*60*24*7); //7 dias
        
                        return response.cookie('token', token, { //this overwrites any other cookie with the same name
                            httpOnly:true, //httpOnly cookies can not be accessed in the browser, so they are safe against XSS attacks
                            expires: new Date(Number(utils.decode(token).exp)*1000) //the value is a date equal to the token expiration date parsed to ms
                        }).status(200).send();
                    }
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

    async delete(request, response){
        return response.status(204).clearCookie('token').send();
    },

    async deleteAll(request,response){

        const ong = request.ong;

        const { password } = request.body;

        const checkPassword = await connection('ongs').where({id:ong.id,password:password}).select('id').first(); 

        if(checkPassword){
            redis.set(ong.id, ong.generation, (error, result)=>{
                                    
                if(error){
                    return response.status(400).json({error});
                }else{
                    return response.status(204).clearCookie('token').send();    
                }
            });
        }else{
            return response.status(401).json({error:"Incorrect password"});
        }
    },

    async authentication(request,response){
        const ong = request.ong; // ong é o objeto JSON retornado pelo jwt.verify
            
        const exists = await connection('ongs').where('id', ong.id).select('id').first();

        if(exists){ //not really necessary, because if the token didn't exist the err would have caught it
            
            const csrfObj = {
                id:ong.id
            }

            const authObj = {
                id:ong.id,
                generation:Number(ong.generation)
            }
        
            const antiCsrfToken = utils.generateToken(csrfObj, process.env.JWT_ANTICSRF, 60*20);

            const token = utils.generateToken(authObj, process.env.JWT_AUTHENTICATION, 60*60*24*7); //7 dias

            return response.cookie('token', token, { //this overwrites any other cookie with the same name
                httpOnly:true, //httpOnly cookies can not be accessed in the browser, so they are safe against XSS attacks
                expires: new Date(Number(utils.decode(token).exp)*1000) //the value is a date equal to the token expiration date parsed to ms
            }).json({
                antiCsrfToken
            });

        }else{
            return response.status(401).json({
                error:"No ONG found with this id"
            })
        }
    }
}