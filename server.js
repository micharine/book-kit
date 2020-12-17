const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphql, buildSchema } = require('graphql');
const mysql = require('mysql');
// const cors = require('cors')

const configurator = require('./local');
let config = configurator.config;

// TODO: separate file later and export/import?
// Make id's id: Int! or !Int? Or something.. Make them required?

const storeSchema = buildSchema(`
  type InventoryItem {
    id: Int
    name: String
    description: String
    cost: Float
    code: String
    quantityInStock: Int
  }
  type Order {
    id: Int
    name: String
    description: String
    cost: Float
    code: String
    quantityInStock: Int
  }
  type Query {
    getInventoryItems: [InventoryItem],
    getInventoryItemInfo(id: Int) : InventoryItem
  }
  type Mutation {
    updateInventoryItemQuantity(id: Int, quantityInStock: Int) : Boolean
    createOrder(inventoryItemCode: String, quantityOrdered: Int, customerID: String, transactionID: String) : Boolean
  }
`);


// Standup
let app = express();

// app.use(cors());

/* Establish Database Connection */
app.use((req, res, next) => {
    req.mysqlDb = mysql.createConnection({
        // host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        // port: config.port,
        // insecureAuth : true
    });
    req.mysqlDb.connect();

    next();
});

// TODO: consider async/await here
const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
        if (err)
            return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

const root = {
  getInventoryItems: (args, req) => queryDB(req, "select * from inventoryitem").then(data => data),
  getInventoryItemInfo: (args, req) => queryDB(req, "select * from inventoryitem where id = ?", [args.id]).then(data => data[0]),
  updateInventoryItemQuantity: (args, req) => queryDB(req, "update inventoryitem SET ? where id = ?", [args, args.id]).then(data => data),
  createOrder: (args, req) => queryDB(req, "insert into order SET ?", args).then(data => data),
//   deleteInventoryItem: (args, req) => queryDB(req, "delete from inventoryitem where id = ?", [args.id]).then(data => data)
};

// Connect graphQL
app.use('/graphql', graphqlHTTP({
    schema: storeSchema,
    rootValue: root,
    graphiql: true,
}));

// Test root connection
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});
let port = 4000;
app.listen(port);
console.log(`Running GraphQL server at localhost:${port}.`);
