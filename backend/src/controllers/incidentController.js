const connection = require('../database/connection');

module.exports = {
    async index(request,response){
        const count = await connection('incidents').count().first();

        const { page = 1 } = request.query;

        const incidents = await connection('incidents').join('ongs','ongs.id','=','incidents.ong_id').limit(5).offset((page - 1)*5).select([
            'incidents.*',
            'ongs.name',
            'ongs.email',
            'ongs.whatsapp',
            'ongs.city',
            'ongs.uf',
        ]); //colchetes necessários para listagens multiplas.

        //OBS: se eu buscar o id da tabela ongs ele sobrepõe o id da tabela incidents, pois o nome desses atributos é igual.
        //OBS: buscar o id na tabela ongs não é necessário, pois a tabela incidents já o contém.

        //limit: número máximo de resultados(linhas) desejados na query.
        //offset: número de resultados(linhas) a ser saltado na query.

        response.header('X-Total-Count', count['count(*)']); //Normalmente começa com X-...

        return response.json(incidents);
    },

    async create(request,response){
        const {title,description,value} = request.body;
        //ong_id poderia ser passado como parâmetro da requisição, mas como a ong precisa estar logada para cadastrar casos, é comum usar o request header para pegar o login

        const ong_id = request.headers.authorization; //authorization é o nome dado à requisição no insomnia

        const incident_id = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({
            "incident_id":incident_id[0]
        });
    },

    async delete(request,response){
        const { id } = request.params; //{ id } => variavel entre chaves determina o número deargumentos aceitos. Nesse caso, apenas 1.
        const ong_id = request.headers.authorization; // preciso verificar se o id passado realmente corresponde a um caso da ong logada, para evitar que uma ong delete um case de outra
        
        const incident = await connection('incidents').where('id',id).select('ong_id').first(); //.first() pq só retorna uma registro. O método serve para pegar apenas o primeiro retornado, não um array.

        if(incident.ong_id !== ong_id){
            return response.status(401).json({error:"Operation not permitted"});
        } else{
            await connection('incidents').where('id',id).delete(); //delete não retorna nada

            return response.status(204).send(); //204 é status de sucesso, usado quando não tem conteúdo para retorno. Por isso json não é nem necessário
        }
    }
}