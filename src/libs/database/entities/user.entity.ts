import { Mapping } from "../orm/sql.model";
import { BlockUser } from "./block-user.entity";

export class Users extends Mapping {
  static table = 'users';

  $formJson (json) {
    json = super.$formatJson(json);
    delete json.Body
    return json;
  }

  static get relationMappings () {
    return {

      is_blocked_by_me: {
        relation: Mapping.BelongsToOneRelation,
        modelClass: BlockUser,

        join: {
          from: 'block_users.block_by',
          to: 'users.id',
        },
      },
      is_mi_blocked_by_him: {
        relation: Mapping.BelongsToOneRelation,
        modelClass: BlockUser,
        join: {
          from: 'block_users.block_to',
          to: 'users.id',
        },
      },


    }
  }
}

