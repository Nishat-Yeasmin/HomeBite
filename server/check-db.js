const db = require("./config/db");

async function test() {
  try {
    const [rows] = await db.query(
      "SELECT id, name, description, image_url FROM categories ORDER BY id ASC"
    );

    console.log("CATEGORY QUERY SUCCESS!");
    console.log(rows);
  } catch (error) {
    console.log("CATEGORY QUERY FAILED!");
    console.log("CODE:", error.code);
    console.log("MESSAGE:", error.message);
    console.log("SQL:", error.sql);
  } finally {
    await db.end();
  }
}

test();