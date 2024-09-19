/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('error_logs', function (table) {
        table.increments('id');
        table.integer('user_id', 11).nullable();
        table.string('method', 255).nullable();
        table.string('status_code', 255).nullable();
        table.text('url').nullable();
        table.text('error').nullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('error_logs');
};
