import Knex from 'knex'

const config = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'newpassword',
    database: 'planner_graphql_dev',
  },
};

(async () => {
  const results = await Knex(config).select('*').from('user');

  console.log(results);
})();

