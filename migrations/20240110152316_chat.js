/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('chat', function (table) {
      table.increments('id');
      table.integer('sender_id', 11).nullable();
      table.integer('receiver_id', 11).nullable();
      table.integer('parent_id', 11).nullable();
      table.string('conversation_id', 255).nullable();
      table.string('file_type', 255).nullable().defaultTo('message');
      table.text('message').nullable();
      table.text('media').nullable();
      table.boolean('is_seen').defaultTo(false);
      table.boolean('delete_for_everyone').defaultTo(false);
      table.integer('delete_by', 11).nullable().defaultTo(0);
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();
    });
  };
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('chat');
  };
  