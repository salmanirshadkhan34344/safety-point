import { Mapping } from "../orm/sql.model";
import { Users } from "./user.entity";

export class UserAddresses extends Mapping {
    static table = 'user_addresses'


    static get relationMappings () {
        return {

            user: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'user_addresses.user_id',
                    to: 'users.id',
                },
            },


        };

    }
}
