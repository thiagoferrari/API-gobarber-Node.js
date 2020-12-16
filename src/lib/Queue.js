/***
 * VAMOS AQUI CONFIGURAR AS FILAS NO APP [dentro das filas tem vários jobs]
    * cada background-job estará dentro de uma fila! ex.:
        * É UM JOB: envio de e-mail de cancel. de agendamento [VAI TER UMA FILA]
        * É UM JOB: envio de e-mail de redefinição de senha [VAI TER UMA FILA]
 * 
 */

import Bee from 'bee-queue'
import CancellationMail from '../app/jobs/CancellationMail'
import redisConfig from '../config/redis'
import { query } from 'express'

/* todo novo job vai entrar aqui neste array */
const jobs = [CancellationMail]

class Queue {
    constructor() {
        this.queues = {}
        this.init()
    }

    init() {
        /* abaixo vamos percorrer os jobs e a partir das functions [key, handle] + bee-queue*/
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig, /* aqui conecto com o DB redis */
                }),
                handle, /* handle executa o JOB */
            }
        })
    }

    /* add adiciona novos jobs dentro de cada fila */
    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save()
    }

    /* processQueue percorre cada job dentro de cada fila */
    processQueue() {
        jobs.forEach(job => {
            /* aqui desestrutu. a fila por trás do job.key expecífico */
            const { bee, handle } = this.queues[job.key]

            bee.on('failed', this.handleFailure).process(handle) // aqui executamos a fila
        })
    }

    /* handleFailure é executado quando se ocorre falha em fila */
    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err)
    }
}


export default new Queue()