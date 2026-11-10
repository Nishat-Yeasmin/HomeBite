
const db = require("./config/db");

async function checkDatabase() {
  try {
    const [database] = await db.query("SELECT DATABASE() AS db_name");

    console.log("Connected Database:", database[0].db_name);

    const [foods] = await db.query("SHOW CREATE TABLE foods");
    console.log("\nFOODS TABLE:\n", foods[0]["Create Table"]);

    const [categories] = await db.query("SHOW CREATE TABLE categories");
    console.log("\nCATEGORIES TABLE:\n", categories[0]["Create Table"]);

  } catch (error) {
    console.error("DATABASE CHECK ERROR:", error);
  } finally {
    await db.end();
  }
}

checkDatabase();
