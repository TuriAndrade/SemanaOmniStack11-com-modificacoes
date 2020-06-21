const connection = require('../database/connection');
const utils = require('../utils');

module.exports = {
    async index(request,response){
        const ong = request.ong;

        const incidents = await connection('incidents').where('ong_id',ong.id).select('*'); //para usar o await aqui, é necessário definir a callback do jwt.verify como async

        return response.json({incidents});
        
    },

    async getData(request, response){
        const ong = request.ong;

        const ongData = await connection('ongs').where('id',ong.id).select('login','name','email', 'whatsapp','city','uf').first(); 

        return response.json({ongData});

        /*
            Query retorna um array de JSONs. Com first(), recebo somente a primeira
            posição do array e com name['name'], somente o nome da ong, não o 
            resultado JSON
        */
    },

    async updateData(request, response){
        const ong = request.ong;

        const { login, name, email, whatsapp, city, uf } = request.body;

        const alreadyExists = await connection('ongs').where('login',login).select('id').first();

        if(!alreadyExists || alreadyExists.id === ong.id){
            await connection('ongs').where('id',ong.id).update({
                login,
                name,
                email,
                whatsapp,
                city,
                uf
            });

            return response.status(204).send();
        }else{
            return response.status(409).json({error:"Login already exists"});
        }
    }
}