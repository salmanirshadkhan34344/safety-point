/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('metas', function (table) {
            table.increments('id');
            table.string('meta_key', 255).nullable();
            table.text('meta_value').nullable();
            table.integer('source_id', 255).defaultTo(0);
            table.string('source_type', 255).nullable();
            table.integer('user_id', 255).defaultTo(0);
            table.timestamps(true, true);
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('metas');
};
