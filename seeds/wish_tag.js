/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('metas').del();
  await knex('metas').insert([
    {
      source_id: 0,
      meta_key: 'terms_and_services',
      meta_value: '<p>Hello</p>',
      source_type: 'app-info',
      user_id: 0,
    },
    {
      source_id: 0,
      meta_key: 'privacy_policy',
      meta_value: '<p>Hello</p>',
      source_type: 'app-info',
      user_id: 0,
    },
    {
      source_id: 0,
      meta_key: 'about_us',
      meta_value: '<p>about_us about_us</p>',
      source_type: 'app-info',
      user_id: 0,
    },
  ]);
};
