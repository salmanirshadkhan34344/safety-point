/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('comments', function (table) {
        table.increments('id');
        table.text('text').nullable();
        table.text('media').nullable().defaultTo(null);
        table.integer('user_id', 11).nullable();
        table.integer('parent_id', 11).nullable();
        table.integer('commentableId', 255).nullable();
        table.string('commentableType', 255).nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('comments');
};
