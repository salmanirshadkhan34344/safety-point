/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('inbox_active', function (table) {
        table.increments('id');
        table.integer('user_id', 11).nullable();
        table.integer('addresser_id', 11).nullable();
        table.string('conversation_id', 255).nullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('inbox_active');
};
