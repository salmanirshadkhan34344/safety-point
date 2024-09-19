/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('reported', function (table) {
        table.increments('id');
        table.integer('user_id', 11).nullable();
        table.integer('source_id', 11).nullable();
        table.string('type', 255).nullable().defaultTo('reporting');
        table.text('message').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('reported');
};
