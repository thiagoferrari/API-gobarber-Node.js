// O multer é um framework que consegue trabalhar com imagens!

/* a ideia é: quando o user subir pelo multer a img, ela já fica no banco,
    é retornado um id dessa img, e conseguimos manter um json com o id + dados do user juntos!
*/

import multer from 'multer' // framework que suporta imgs (JSON não suporta)
import crypto from 'crypto' // framework p/ gerar o id

// extname retorna a extensão de um arquivo (.png, .jpg)
// resolve é usado para acessar uma pasta
import { extname, resolve } from 'path'

// trabalhando com o multer:
export default {
    storage: multer.diskStorage({
        // Local onde o arquivo será salvo na máquina do servidor
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),

        // Gerando o nome da imagem como um hash usando a lib nativa do node: crypto
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                // se der algum erro:
                if (err) return cb(err)

                // se der certo, null para error e vamos concatenar um nome random com a extensão:
                return cb(null, res.toString('hex') + extname(file.originalname))
            })
        }
    })
}