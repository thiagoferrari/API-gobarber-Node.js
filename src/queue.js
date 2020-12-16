/**
 * ESTE ARQUIVO SERVE PARA EXECUTAR O NODE EM OUTRA INSTÂNCIA,
 *              COLOCANDO O PROCESSO DE ENVIO DE EMAIL EM OUTRO NODE
 *                                          E OTIMIZANDO O TEMPO DE ENVIO DE EMAIL
 */

import Queue from './lib/Queue'

Queue.processQueue()