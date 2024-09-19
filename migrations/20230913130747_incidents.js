/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('incidents', function (table) {
            table.increments('id');
            table.string('name', 255).nullable();
            table.text('icon', 255).nullable();
            table.string('status', 255).nullable().defaultTo('active');
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('incidents');

};  