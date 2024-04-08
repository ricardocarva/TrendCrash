import { setupOracleConnection } from "./config/dbs.js";
import { safeGuardQuery } from "./public/scripts/utils.js";
import { getQuery1 } from "./scripts/queries.js";
import express from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

// load config file
dotenv.config({ path: "./config/config.env" });

// middleware to serve static files in public
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// try to setup oracle connection
let connection = await setupOracleConnection();

// endpoint to fetch data from Oracle database, data base connection made on each request
// may want to rework this to just leave the connection open so that we don't have overhead on the request
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/data", async (req, res) => {
    // raw query
    // const query = `SELECT * FROM RCARVALHEIRA.ACCIDENTMASTER ORDER BY id FETCH FIRST 10000 ROWS ONLY;`;
    // console.log(req.body.data);

    // todo need to confirm valid sql here, we don't need to but could i guess

    const selectFrom = "SELECT DISTINCT * FROM";
    const tableName = "RCARVALHEIRA.STATES";
    const whereClause = "WHERE ROWNUM <= 1000";
    const cityQuery = "select * from city where rownum <= 10000";

    // validates and returns the santized sql query and it
    const query = safeGuardQuery(req.body.data);
    console.log(query, "====");
    if (query) {
        try {
            const start = Date.now();
            const result = await connection.execute(query);
            const end = Date.now();
            const numTuples = result.rows.length;
            const resObj = {
                message: "success",
                query,
                result: result.rows,
                execution_time: `${numTuples} tuples returned in ${
                    end - start
                }ms`,
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
    } else {
        console.log("query doesn't pass validity check");
        const resObj = {
            message:
                "Query doesn't pass validity check, please don't try to alter tables",
            query,
            result: [],
            execution_time: 0,
        };
        res.json(resObj);
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(
        `Server running on port ${port}\nVisit localhost:3000 in a browser.`
    );
});
