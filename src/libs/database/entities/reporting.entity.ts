import { raw } from "objection";
import { LikeTypeEnum } from "../../../enum/global.enum";
import { Mapping } from "../orm/sql.model";
import { Comments } from "./comments.entity";
import { Likes } from "./likes.entity";
import { Reported } from "./reported.entity";
import { Users } from "./user.entity";
export class Reporting extends Mapping {
    static table = 'reporting'

    $formJson (json) {
        json = super.$formatJson(json);
        return json;
    }
    // this is the method to define relation in the table
    // one of the best structure ever
    static get relationMappings () {
        return {

            reported_report: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Reported,

                join: {
                    from: 'reporting.id',
                    to: 'reported.source_id'
                }
            },
            user: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Users,
                filter (builder) {
                    builder.where({ is_deleted: 0 })
                },
                join: {
                    from: 'reporting.user_id',
                    to: 'users.id'
                }
            },

            parent: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Reporting,
                join: {
                    from: 'reporting.parent_id',
                    to: 'reporting.id',
                },
            },

            is_like: {
                relation: Mapping.HasOneRelation,
                modelClass: Likes,
                filter (builder) {
                    builder.select(raw('id'))
                    builder.where({ likeableType: LikeTypeEnum.Reporting })

                },
                join: {
                    from: 'reporting.id',
                    to: 'likes.likeableId',
                },
            },


            share_count: {
                relation: Mapping.BelongsToOneRelation,
                modelClass: Reporting,
                filter (builder) {
                    builder.select(raw('COUNT(id) as share_count'))

                },
                join: {
                    from: 'reporting.parent_id',
                    to: 'reporting.id',
                },
            },

            likes_count: {
                relation: Mapping.HasOneRelation,
                modelClass: Likes,
                filter (builder) {
                    builder.select(raw('COUNT(id) as like_count'))
                    builder.where({ likeableType: LikeTypeEnum.Reporting })
                    builder.groupBy('likeableId', 'likeableType');
                },
                join: {
                    from: 'reporting.id',
                    to: 'likes.likeableId',
                },
            },

            comments_count: {
                relation: Mapping.HasOneRelation,
                modelClass: Comments,
                filter (builder) {
                    builder.where({ commentableType: LikeTypeEnum.Reporting })
                    builder.select(raw('COUNT(id) as comments_count'))
                    builder.groupBy('commentableId', 'commentableType',);
                },
                join: {
                    from: 'reporting.id',
                    to: 'comments.commentableId',
                },
            },





        }
    }
}

