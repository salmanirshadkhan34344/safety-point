/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('notification_receiver', function (table) {
        table.increments('id');
        table.integer('notification_id', 11).nullable();
        table.integer('receiver_id', 11).nullable();
        table.boolean('is_seen').nullable().defaultTo(false);
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('notification_receiver');
};
