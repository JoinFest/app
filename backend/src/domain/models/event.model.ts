import {ObjectId} from 'bson';

export class Event {
    constructor(
        public id: ObjectId,
        public name: string,
        public description: string,
        public date: Date,
        public location: string
    ) {
    }
}
