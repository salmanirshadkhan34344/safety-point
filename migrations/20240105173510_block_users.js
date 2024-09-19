/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('block_users', function (table) {
        table.increments('id');
        table.integer('block_by', 11).nullable();
        table.integer('block_to', 11).nullable();
        table.timestamps(true, true);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('block_users');
};
