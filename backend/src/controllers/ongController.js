const connection = require('../database/connection');

module.exports = {
    async index(request,response){
        const ongs = await connection('ongs').select('*');

        return response.json(ongs);
    },

    async create(request,response){

        const {login,password,name,email,whatsapp,city,uf} = request.body; 
    
        //const id = crypto.randomBytes(4).toString('HEX'); //gera id aleatória
        
        const alreadyExists = await connection('ongs').where('login',login).select('id').first();

        if(!alreadyExists){
            await connection('ongs').insert({
                login,
                password,
                name,
                email,
                whatsapp,
                city,
                uf,
            });
    
            return response.json({login:login});
        }else{
            return response.status(409).json({error:"Login already exists"});
        }
    }
}

//aparentemente, as queries retornam promisses, pois promisses precisam ser o retorno do await para async functions funcionarem 