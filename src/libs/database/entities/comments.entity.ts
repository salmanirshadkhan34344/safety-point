import { raw } from "objection";
import { LikeTypeEnum } from "src/enum/global.enum";
import { Mapping } from "../orm/sql.model";
import { Likes } from "./likes.entity";
import { Users } from "./user.entity";

export class Comments extends Mapping {
    static table = 'comments'



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
                    to: 'comments.user_id',
                },
            },

            child_comments: {
                relation: Mapping.HasManyRelation,
                modelClass: Comments,
                join: {
                    from: 'comments.id',
                    to: 'comments.parent_id'
                }
            },

            comments_like_count: {
                relation: Mapping.HasOneRelation,
                modelClass: Likes,
                filter (builder) {

                  builder.select(raw("COUNT(id) as comments_like_count"))
                  builder.where({ likeableType: LikeTypeEnum.Comment })
                  builder.groupBy('likeableId', 'like_type', 'likeableType');
                },
                join: {
                  from: 'comments.id',
                  to: 'likes.likeableId',
                },
              },
              
              is_comment_like: {
                relation: Mapping.HasOneRelation,
                modelClass: Likes,
                filter (builder) {
                    builder.select(raw('id'))
                    builder.where({ likeableType: LikeTypeEnum.Comment })

                },
                join: {
                    from: 'comments.id',
                    to: 'likes.likeableId',
                },
            },


        }
    }
}

