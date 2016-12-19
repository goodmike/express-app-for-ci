exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          username: 'michael', email: 'michael@mherman.org'
        }),
        knex('users').insert({
          username: 'michaeltwo', email: 'goodmike200@gmail.com'
        })
      ]);
    });
};
