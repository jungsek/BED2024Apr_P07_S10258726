module.exports = {
    user: "booksapi_jung", //Replace with your SQL server login username
    password: "bingus", //Replace with your sql server login password
    server: "localhost", //Using my laptop's IP address 
    database: "bed_db", 
    trustServerCertificate: true,
    options: {
        port: 1433, //Default SQL Server Port
        connectionTimeout: 60000, //Connection timeout in millliseconds
    },
};
