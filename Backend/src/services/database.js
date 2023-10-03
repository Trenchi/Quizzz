const { Client } = require("pg");

const pgClient = new Client({
  user: "postgres",
  database: "quizzz-dev",
  password: "MYPASSWOT",
  port: 54320,
  host: "MYURL.COM",
});

async function connectToDatabase() {
  await pgClient.connect();
}

async function connectAndQuery(query, params) {
  try {
    const result = await pgClient.query(query, params);
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = { connectToDatabase, connectAndQuery, pgClient };
