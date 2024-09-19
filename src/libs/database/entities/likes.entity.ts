import { Mapping } from "../orm/sql.model";
import { Users } from "./user.entity";

export class Likes extends Mapping {
    static table = 'likes'

    static get relationMappings () {
        return {
            user: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'users.id',
                    to: 'likes.user_id',
                },
            },
        }
    }
}

