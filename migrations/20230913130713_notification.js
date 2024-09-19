/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('notification', function (table) {
            table.increments('id');
            table.string('body', 255).nullable();
            table.string('text', 255).nullable();
            table.integer('source_id', 11).nullable();
            table.integer('sender_id', 11).nullable();
            table.string('type', 255).nullable();
            table.integer('related_id', 11).nullable();
            table.string('related_type', 255).nullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('notification');

};