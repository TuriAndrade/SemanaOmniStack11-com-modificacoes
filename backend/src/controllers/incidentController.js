const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const redis = require('../database/redis');

module.exports = {
    async index(request,response){
        const count = await connection('incidents').count().first();

        const { page = 1 } = request.query;

        const incidents = await connection('incidents').join('ongs','ongs.login','=','incidents.ong_login').limit(5).offset((page - 1)*5).select([
            'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf',
        ]); //colchetes necessários para listagens multiplas.

        //OBS: se eu buscar atributos com o mesmo nome em tabelas diferentes eles se sobrepõem
        //OBS: buscar o login na tabela ongs não é necessário, pois a tabela incidents já o contém.

        //limit: número máximo de resultados(linhas) desejados na query.
        //offset: número de resultados(linhas) a ser saltado na query.

        response.header('X-Total-Count', count['count(*)']); //Normalmente começa com X-...

        return response.json(incidents);
    },

    async create(request,response){

        //como a ong precisa estar logada para cadastrar casos, é comum usar o request header para pegar o login

        jwt.verify(request.token, process.env.JWT_SECRET, async function (err, ong){ //ong acces token after its decrypted
            if(err){ //fires if token doesn't exists

                return response.status(401).json({error:"Invalid token"});

            }else if(utils.decode(request.token).iat > request.app.get('timestamp')){

                redis.get(ong.login, async (error, result)=>{

                    if(error){
                        return response.status(400).json({error});
                    }else{
                        if(utils.decode(request.token).iat > Number(result)){ //if no data matches the ong.login, result will be null and this condition will be true
                            const {title,description,value} = request.body;

                            const login = ong.login; // ong é o objeto JSON retornado pelo jwt.verify

                            const incident_id = await connection('incidents').insert({
                                title,
                                description,
                                value,
                                ong_login:login, 
                            });

                            /*
                                if the name of the column os different from the value that it will receive, 
                                its necessary to specify both.

                                In JSON architecture, if you don't specify the name of the attribute, it will be assumed
                                that it's name is equal to the name of the variable that contains its value
                            */
                    
                            return response.json({
                                "incident_id":incident_id[0] // the [0] position must be accessed because querys return an array of results, even if there is only one
                            });
                        }else{
                            return response.status(401).json({error:"Blacklisted token"});
                        }
                    }
                });
            }else{
                return response.status(401).json({error:"Old token"})
            }
        });
    },

    async delete(request,response){
        jwt.verify(request.token, process.env.JWT_SECRET, async function (err, ong){ //ong acces token after its decrypted
            if(err){ //fires if token doesn't exists
                return response.status(401).json({error:"Invalid token"});

            }else if(utils.decode(request.token).iat > request.app.get('timestamp')){

                redis.get(ong.login, async (error, result)=>{

                    if(error){
                        return response.status(400).json({error});
                    }else{
                        if(utils.decode(request.token).iat > Number(result)){ //if no data matches the ong.login, result will be null and this condition will be true
                            
                            const { id } = request.params; //{ id } => variavel entre chaves determina o número deargumentos aceitos. Nesse caso, apenas 1.
                            
                            const login = ong.login; // ong é o objeto JSON retornado pelo jwt.verify
                            
                            const incident = await connection('incidents').where('id',id).select('ong_login').first(); //O método serve para pegar apenas o primeiro resultado do array retornado

                            if(!incident){
                                return response.status(400).json({error:"Not found"});
                            }else if(incident.ong_login !== login){
                                return response.status(401).json({error:"Operation not permitted"});
                            } else{
                                await connection('incidents').where('id',id).delete(); //delete não retorna nada

                                return response.status(204).send(); //204 é status de sucesso, usado quando não tem conteúdo para retorno. Por isso json não é nem necessário
                            }

                        }else{
                            return response.status(401).json({error:"Blacklisted token"});
                        }
                    }
                });
            }else{
                return response.status(401).json({error:"Old token"})
            }
        });
    }
}