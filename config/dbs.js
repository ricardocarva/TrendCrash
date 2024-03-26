import { getConnection } from "oracledb";

export const setupOracleConnection = async () => {
    // oracle database credentials and connection details
    const dbConfig = {
        user: process.env.DB_CONFIG_USERNAME,
        password: process.env.DB_CONFIG_PASSWORD,
        connectString: process.env.DB_CONFIG_CONNECTION,
    };

    let connection = {};

    // try to connect to oracle
    try {
        // await connection to the Oracle database (must be on vpn)
        connection = await getConnection(dbConfig);
        console.log(
            "Connection to the CISE database has been established successfully."
        );
    } catch (err) {
        console.error(err);
        res.status(500).send(
            "Error connecting to the database, confirm you are connected to the UF VPN."
        );
    } finally {
        return connection ? connection : null;
    }
};
