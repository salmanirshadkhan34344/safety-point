/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('user_addresses', function (table) {
            table.increments('id');
            table.string('longitude', 255).nullable();
            table.string('latitude', 255).nullable();
            table.string('address', 255).nullable();
            table.integer('user_id', 11).nullable();
            table.boolean('default').nullable().defaultTo(false);
            table.string('title', 255).nullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('user_addresses');

};