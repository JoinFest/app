import {Schema} from 'mongoose';

export const EventSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String, required: true},
    hostId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});
