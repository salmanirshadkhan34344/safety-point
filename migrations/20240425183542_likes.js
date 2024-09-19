/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('likes', function (table) {
        table.increments('id');
        table.integer('user_id', 11).nullable();
        table.string('like_type', 255).nullable().defaultTo('like');
        table.integer('likeableId', 255).nullable();
        table.string('likeableType', 255).nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('likes');
};
