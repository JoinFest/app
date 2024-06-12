import {ObjectId} from "bson";

export class User {
    constructor(
        public id: ObjectId,
        public email: string,
        public password: string,
        public name: string,
    ) {
    }
}
