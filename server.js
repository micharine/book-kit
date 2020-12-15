const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphql, buildSchema } = require('graphql');
let mysql = require('mysql');

const config = require('./local');



// separate file later and export/import?
let storeSchema = buildSchema(`
    type InventoryItem {
        Name: String,
        Description: String,
        Cost: Float,
        Code: String,
        QuantityInStock: Int,
    },

type Query {
    hello: String
}
`);

let root = {
    hello: ()=>"World"
}


// Standup
let app = express();
app.use('/graphql', graphqlHTTP({
    schema: storeSchema,
    rootValue: root,
    graphiql: true,
}));

/* Establish Database Connection */
// app.use((req, res, next) => {
//     req.mysqlDb = mysql.createConnection({
//         host: config.host,
//         user: config.user,
//         password: config.password,
//         database: config.database,
//     });
//     req.mysqlDb.connect();
//     next();
// });
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});
let port = 4000;
app.listen(port);
console.log(`Running GraphQL server at localhost:${port}.`);
