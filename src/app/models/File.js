import { Model, Sequelize } from 'sequelize'

class File extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                /* url para facilitar ao front-end ver o avatar:*/
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3333/files/${this.path}`
                    }
                }
            },
            {
                sequelize,
            }
        )
        return this
    }
}


export default File