// imports here for express and pg
const express = require("express");
const app = express();
const pg = require("pg");
const path = require("path");

const client = new pg.Client(
  "postgres://postgres:2182@localhost:5432/acme_froyo_db"
);

// static routes here (you only need these for deployment)
app.use(express.static(path.join(__dirname, "..client/dist")));

// app routes here
app.get("/api/flavors", async (req, res) => {
    try {
        const SQL = `
        SELECT * FROM flavors
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (ex) {
        next()
    }
 
});

app.get("/api/flavors/:id", (req, res) => {
  res.send("get single flavor");
});

app.post("/api/flavors", (req, res) => {
  res.send("create flavor");
});

app.delete("/api/flavors/:id", (req, res) => {
  res.send("delete flavor");
});

app.put("/api/flavors/:id", (req, res) => {
  res.send("update flavor");
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
