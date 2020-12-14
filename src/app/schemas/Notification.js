/**
 * ABAIXO VAMOS CRIAR UM SCHEMA (MODEL/TABELA NO SEQUELIZE)
 * LEMBRANDO> com o mongoDB não é preciso de:
 * migrations
 * nenhum arquivo conex.(load) do Model na base (../migration/index.js)
 */

import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: Number,
            required: true,
        },
        read: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true // Cria os campos created_at e update_at automagicamente
    }
)

export default mongoose.model('Notification', NotificationSchema)