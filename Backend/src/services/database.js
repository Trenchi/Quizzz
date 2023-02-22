const { Client } = require("pg");

const pgClient = new Client({
  user: "postgres",
  database: "quizzz",
  password: "AWS-22.10",
  port: 54320,
  host: "maikslab.my-gateway.de",
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
