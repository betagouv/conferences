exports.up = function (knex) {
  return knex.schema.table('loginTokens', function (table) {
    table.integer('userTimezoneOffset').defaultTo(-1) // default : Paris winter time
  })
}

exports.down = function (knex) {
  return knex.schema.table('loginTokens', function (table) {
    table.dropColumn('userTimezoneOffset')
  })
}
