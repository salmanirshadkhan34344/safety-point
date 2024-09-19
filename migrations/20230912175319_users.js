/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id');
            table.string('email', 255).nullable();
            table.string('first_name', 255).nullable();
            table.string('last_name', 255).nullable();
            table.string('user_name', 255).nullable();
            table.text('password').nullable();
            table.string('phone_number', 255).nullable();
            table.text('profile', 255).nullable();
            table.string('role', 255).nullable().defaultTo('user');
            table.integer('otp', 11).nullable();
            table.string('longitude', 255).nullable();
            table.string('latitude', 255).nullable();
            table.text('device_token', 255).nullable();
            table.boolean('is_verified').defaultTo(false);
            table.boolean('is_deleted').defaultTo(false);
            table.boolean('is_block').defaultTo(false);
            table.boolean('user_status').defaultTo(false);
            table.timestamps(true, true);

        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('users');

};