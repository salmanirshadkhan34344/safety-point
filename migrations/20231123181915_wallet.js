/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('wallet', function (table) {
            table.increments('id').primary();
            table.string('email').nullable();
            table.string('password').nullable();
            table.string('name').nullable();
            table.string('wallet').nullable();
            table.string('display_name').nullable();
            table.text('avatar').nullable();
            table.date('dob').nullable();
            table.string('address').nullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('wallet');
};

