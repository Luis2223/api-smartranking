import * as mongoose from 'mongoose';

export const JogadorSchema = new mongoose.Schema({
    phoneNumber: String,
    email: {
        type: String,
        unique: true,
    },
    name: String,
    ranking: String,
    rankingPosition: Number,
    urlPictureFriend: String
}, {
    timestamps: true,
    collection: 'jogadores'
})