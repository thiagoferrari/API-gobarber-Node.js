// aqui vamos importar User, pois um provider é user
import User from '../models/User'
import File from '../models/File'


class ProviderController {
    async index(req, res) {
        const providers = await User.findAll({
            where: { provider: true },

            //controlando o que será retornado para o front-end:
            attributes: ['id', 'name', 'email', 'avatar_id'],
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['name', 'path']
                },
            ],
        })

        return res.json(providers)
    }

}

export default new ProviderController()