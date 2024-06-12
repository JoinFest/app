import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './schemas/user.schema';
import {EventSchema} from "./schemas/event.schema";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI),
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}, {name: 'Event', schema: EventSchema}]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {
}
