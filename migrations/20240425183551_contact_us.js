/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('contact_us', function (table) {
        table.increments('id');
        table.integer('sender_id', 11).nullable().defaultTo(0);
        table.string('email', 255).nullable();
        table.string('subject', 255).nullable();
        table.text('message').nullable();
        table.text('file').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('contact_us');
};
