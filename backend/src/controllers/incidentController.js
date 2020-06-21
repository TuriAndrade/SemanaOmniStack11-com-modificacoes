const connection = require('../database/connection');

module.exports = {
    async index(request,response){
        const count = await connection('incidents').count().first();

        const { page = 1 } = request.query;

        const incidents = await connection('incidents').join('ongs','ongs.id','=','incidents.ong_id').limit(5).offset((page - 1)*5).select([
            'incidents.*',
            'ongs.login',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf',
        ]); //colchetes necessários para listagens multiplas.

        //OBS: se eu buscar atributos com o mesmo nome em tabelas diferentes eles se sobrepõem

        //limit: número máximo de resultados(linhas) desejados na query.
        //offset: número de resultados(linhas) a ser saltado na query.

        response.header('X-Total-Count', count['count(*)']); //Normalmente começa com X-...

        return response.json(incidents);
    },

    async create(request,response){
        const ong = request.ong;

        const {title,description,value} = request.body;

        const incident_id = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id:ong.id, 
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

    },

    async delete(request,response){
        const ong = request.ong;

        const { id } = request.params; //{ id } => variavel entre chaves determina o número deargumentos aceitos. Nesse caso, apenas 1.
        
        const incident = await connection('incidents').where('id',id).select('ong_id').first(); //O método serve para pegar apenas o primeiro resultado do array retornado

        if(!incident){
            return response.status(400).json({error:"Not found"});
        }else if(incident.ong_id !== ong.id){
            return response.status(401).json({error:"Operation not permitted"});
        } else{
            await connection('incidents').where('id',id).delete(); //delete não retorna nada

            return response.status(204).send(); //204 é status de sucesso, usado quando não tem conteúdo para retorno. Por isso json não é nem necessário
        }
    }
}