import { Mapping } from "../orm/sql.model";
import { Users } from "./user.entity";

export class ContactUs extends Mapping {
    static table = 'contact_us'


    static get relationMappings() {
        return {
            user: {
                relation: Mapping.HasOneRelation,
                modelClass: Users,
                join: {
                    from: 'contact_us.sender_id',
                    to: 'users.id',
                },
            },
        }
    }
}

