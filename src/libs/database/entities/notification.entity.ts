import { NotificationRelatedTypeEnum } from "src/enum/global.enum";
import { Mapping } from "../orm/sql.model";
import { NotificationReceiver } from "./notification-receiver.entity";
import { Reporting } from "./reporting.entity";
import { Users } from "./user.entity";

export class Notifications extends Mapping {
    static table = 'notification';

    $formJson (json) {
        json = super.$formatJson(json);
        delete json.Body
        return json;
    }
    // this is the method to define relation in the table
    // one of the best structure ever
    static get relationMappings () {
        return {
            received_notification:{
                relation: Mapping.BelongsToOneRelation,
                modelClass:NotificationReceiver,
                join: {
                    from: 'notification.id',
                    to: 'notification_receiver.notification_id'
                },
                
            },

            reporting:{
                relation: Mapping.BelongsToOneRelation,
                modelClass: Reporting,
                join:{
                    from: 'notification.related_id',
                    to: 'reporting.id'
                }
            },
            sender:{
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                join:{
                    from: 'notification.sender_id',
                    to: 'users.id'
                }
            }
        }
    }
}