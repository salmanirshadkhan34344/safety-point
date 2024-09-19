import { Mapping } from '../orm/sql.model';
import { Users } from './user.entity';
// import { Wishes } from '../../wishes/entities/wish.entity';

export class Chat extends Mapping {
  static table = 'chat';

  $formatJson (json) {
    json = super.$formatJson(json);
    if (json.media) {
      json.media = JSON.parse(json.media);
    }
    return json;
  }
  static get relationMappings () {
    return {

      parent: {
        relation: Mapping.BelongsToOneRelation,
        modelClass: Chat,
        join: {
          from: 'chat.parent_id',
          to: 'chat.id',
        },
      },

      sender: {
        relation: Mapping.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'users.id',
          to: 'chat.sender_id',
        },
      },

      receiver: {
        relation: Mapping.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'users.id',
          to: 'chat.receiver_id',
        },
      },
    };

  }
}
