/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('inbox', function (table) {
            table.increments('id');
            table.integer('user_id', 11).nullable();
            table.integer('addresser_id', 11).nullable();
            table.integer('conversation_id', 11).nullable();
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

    return knex.schema.dropTable('inbox');

};