import { Mapping } from "../orm/sql.model";
import { Reporting } from "./reporting.entity";
import { Users } from "./user.entity";

export class Reported extends Mapping {
    static table = 'reported'
    static get relationMappings () {
        return {
            reported_report: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Reporting,
                join: {
                    from: 'reporting.id',
                    to: 'reported.source_id'
                },
            },

            reported_by: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: 'reported.user_id',
                    to: 'users.id'
                },
            },
        
        }
    }
}

