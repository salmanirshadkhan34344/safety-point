/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('reporting', function (table) {
            table.increments('id');
            table.integer('user_id', 11).nullable();
            table.integer('parent_id', 11).nullable().defaultTo(0);
            table.text('images', 255).nullable();
            table.string('priority', 255).nullable().defaultTo('Low');
            table.text('text').nullable();
            table.boolean('is_public', 255).nullable();
            table.string('longitude', 255).nullable();
            table.string('latitude', 255).nullable();
            table.string('incident_id', 255).nullable();
            table.string('location', 255).nullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('reporting');

};  