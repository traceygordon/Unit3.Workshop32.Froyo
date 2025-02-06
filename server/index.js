// imports here for express and pg
const express = require("express");
const app = express();
const pg = require("pg");
const path = require("path");

const client = new pg.Client(
  "postgres://postgres:2182@localhost:5432/acme_froyo_db"
);

app.use(express.json());
// static routes here (you only need these for deployment)
// app.use(express.static(path.join(__dirname, "..client/dist")));

app.post("/api/flavors", async (req, res, next) => {
  const { flavorName } = req.body;
  try {
    const response = await client.query(
      `
        INSERT INTO flavors (name)
        VALUES ($1)
        RETURNING *;
        `,
      [flavorName]
    );

    res.send(response.rows);
  } catch (ex) {
    next();
  }
});
// app routes here
app.get("/api/flavors", async (req, res) => {
  try {
    const response = await client.query(`
        SELECT * FROM flavors
        `);
    res.send(response.rows);
  } catch (ex) {
    next();
  }
});

app.get("/api/flavors/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await client.query(
      `
        SELECT * FROM flavors WHERE id=$1
        `,
      [id]
    );

    res.send(response.rows[0]);
  } catch (ex) {
    next();
  }
});

app.delete("/api/flavors/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await client.query(
      `
         DELETE FROM flavors WHERE id=$1;
        `,
      [id]
    );

    res.send(response.rows);
  } catch (ex) {
    next();
  }
});

app.put("/api/flavors/:id", async (req, res, next) => {
  const { id } = req.params;
  const { newName } = req.body;
  try {
    const response = await client.query(
      `
        UPDATE flavors SET name=$1 WHERE id=$2
        RETURNING *;
        `,
      [newName, id]
    );

    res.send(response.rows);
  } catch (ex) {
    next();
  }
});

// create your init function
const init = async () => {
  await client.connect();

  const SQL = `
DROP TABLE IF EXISTS flavors;

CREATE TABLE flavors(
id SERIAL PRIMARY KEY,
name VARCHAR(50),
is_favorite BOOLEAN DEFAULT false,
create_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now()
);
INSERT INTO flavors(name) VALUES('vanilla'), ('chocolate'), ('strawberry');
`;
  await client.query(SQL);

  console.log("data seeded");

  app.listen(3000, () => console.log("listening on port 3000"));
};

// init function invocation
init();
