/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('friends', function (table) {
            table.increments('id');
            table.string('status').defaultTo('requested');
            table.integer('sender_id', 11).nullable();
            table.integer('receiver_id', 11).nullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('friends');

};