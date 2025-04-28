const config = {
    source: {
        anti_crash: process.env.anti_crash === "true" ? true : false || false, // Anticrash on or off
        database: {
            type: process.env.database_type || "", // Choose one type for save users and guilds data. Types: "mysql" | "sql" | "mongodb" | "json"
            mongoURL: process.env.database_mongoURL || "", // If you choose "mongodb" type place your mongo url.
            mysql: {
                host: process.env.database_msql_host || "", // Place your Mysql server host name.
                user: process.env.database_msql_user || "", // Place your Mysql server username.
                password: process.env.database_msql_password || "", // Place your Mysql server password.
                database: process.env.database_msql_database || "" // Place your Mysql server database name.
            } // If you choose "mysql" type place your Mysql server information.
        }
    },
    bot: {
        token: process.env.token || "", // Bot token.
        support: {
            owners: JSON.parse(process.env.owners || "[]") || [] // Source owners.
        }
    }
};
export default config;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */