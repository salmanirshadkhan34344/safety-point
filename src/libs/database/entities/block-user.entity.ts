import { Mapping } from "../orm/sql.model";
import { Users } from './user.entity';

export class BlockUser extends Mapping {
    static table = 'block_users';
    $formatJson (json) {
        json = super.$formatJson(json);
        return json;
    }
    static get relationMappings () {
        return {
            user: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                filter (builder) {
                    builder.where({ is_deleted: 0 })
                },
                join: {
                    from: 'users.id',
                    to: 'block_users.block_to',
                },
            },
            user_block_by: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "users.id",
                    to: "block_users.block_by",
                },
            },

            user_block_to: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: "users.id",
                    to: "block_users.block_to"
                },
            },
        };
    };

}
