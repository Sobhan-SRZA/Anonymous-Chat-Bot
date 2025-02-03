const config = {
    source: {
        anti_crash: process.env.anti_crash === "true" ? true : false || false, // Anticrash on or off
        logger: process.env.logger === "true" ? true : false || false, // Webhook logger on or off
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
            invite: process.env.support_url || "https://discord.gg/AfkuXgCKAQ", // Support server invite link.
            owners: JSON.parse(process.env.owners || "[]") || [] // Source owners.
        }
    }
};
export default config;
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */