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

// Load config file
dotenv.config({ path: "./config/config.env" });

// Middleware to serve static files in public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Try to setup oracle connection
let connection;
async function initializeConnection() {
    try {
        connection = await setupOracleConnection();
        console.log("Database connection successfully established.");
        startServer(); // Start server on successful connection
    } catch (error) {
        console.error("Failed to establish initial database connection:", error);
        setTimeout(initializeConnection, 5000); // Retry after 5 seconds
    }
}

initializeConnection();

// Start server function
const startServer = () => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server running on port ${port}\nVisit localhost:3000 in a browser.`);
    });
};

// Initial route to serve the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Data endpoint
app.post("/data", async (req, res) => {
    // raw query
    // const query = `SELECT * FROM RCARVALHEIRA.ACCIDENTMASTER ORDER BY id FETCH FIRST 10000 ROWS ONLY;`;
    // console.log(req.body.data);

    // todo need to confirm valid sql here, we don't need to but could

    const selectFrom = "SELECT DISTINCT * FROM";
    const tableName = "RCARVALHEIRA.STATES";
    const whereClause = "WHERE ROWNUM <= 1000";
    const cityQuery = "select * from city where rownum <= 10000";

    // validates and returns the santized sql query and it
    const query = safeGuardQuery(req.body.data);

    if (!connection) {
        return res.status(500).json({
            message: "Database connection failed. Please ensure you are connected to the VPN and try again.",
            error: "No database connection",
            suggestion: "Please confirm your VPN connection and restart the container."
        });

    }
    if (!query) {
        console.log("Query doesn't pass validity check.");
        return res.status(400).json({
            message: "Query doesn't pass validity check, please don't try to alter tables",
            execution_time: 0
        });
    }
    
    try {
        const start = Date.now();
        const result = await connection.execute(query);
        const end = Date.now();
        const numTuples = result.rows.length;
        res.json({
            message: "success",
            query,
            result: result.rows,
            execution_time: `${numTuples} tuples returned in ${end - start}ms`,
        });

    } catch (err) { 
        console.error("Error executing query: ", err.message);
        res.status(500).json({
            message: "Error executing query, confirm table exists and check query format.",
            error: err.message,
        });
    }
});

