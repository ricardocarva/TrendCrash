import { setupOracleConnection } from "./config/dbs.js";
import express from "express";
import dotenv from "dotenv";
const app = express();

// load config file
dotenv.config({ path: "./config/config.env" });

// try to setup oracle connection
let connection = await setupOracleConnection();

// endpoint to fetch data from Oracle database, data base connection made on each request
// may want to rework this to just leave the connection open so that we don't have overhead on the request
app.get("/data", async (req, res) => {
    // raw query
    const query = `SELECT * FROM RCARVALHEIRA.ACCIDENT`;

    try {
        const result = await connection.execute(query);
        const resObj = {
            query,
            result: result.rows,
        };

        console.log("\nresult found", resObj);

        // send response
        res.json(resObj);
    } catch (err) {
        console.log(err);
        res.status(500).send(
            "Error executing query, confirm table exists and check query format."
        );
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(
        `Server running on port ${port}\nVisit localhost:3000/data in a browser.`
    );
});
