const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphql, buildSchema } = require('graphql');
const mysql = require('mysql');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const configurator = require('./local');
let config = configurator.config;

// stripe
const stripe = Stripe(config.stripe.secretkey);

// Standup
let app = express();

app.use(cors());
app.use(bodyParser.json());

/* Establish Database Connection */
app.use((req, res, next) => {
    req.mysqlDb = mysql.createConnection({
        // host: config.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        // port: config.port,
        // insecureAuth : true
    });
    req.mysqlDb.connect();

    next();
});

// TODO: consider async/await here... but, it works for now because of the different resolves.
const queryDB = (req, sql, args) =>
    new Promise((resolve, reject) => {
        req.mysqlDb.query(sql, args, (err, rows) => {
            if (err) return reject(err);
            rows.changedRows || rows.affectedRows || rows.insertId
                ? resolve(true)
                : resolve(rows);
        });
    });

    // TODO: separate file later and export/import?

const storeSchema = buildSchema(`
type InventoryItem {
  id: Int!
  name: String
  description: String
  cost: Float
  code: String
  quantityInStock: Int
}
type Order {
  id: Int!
  transactionID: String!
  inventoryItemCode: String
  quantityOrdered: Int
  email: String
  firstName: String
  lastName: String
}
type Query {
  getInventoryItems: [InventoryItem],
  getInventoryItemInfo(id: Int) : InventoryItem
}
type Mutation {
  updateInventoryItemQuantity(id: Int, quantityInStock: Int) : Boolean
  createOrder(inventoryItemCode: String, quantityOrdered: Int, email: String, firstName: String, lastName: String, transactionID: String) : Boolean
}
`);

const root = {
    getInventoryItems: (args, req) =>
        queryDB(req, 'select * from inventoryitem').then((data) => data),
    getInventoryItemInfo: (args, req) =>
        queryDB(req, 'select * from inventoryitem where id = ?', [
            args.id,
        ]).then((data) => data[0]),
    updateInventoryItemQuantity: (args, req) =>
        queryDB(req, 'update inventoryitem SET ? where id = ?', [
            args,
            args.id,
        ]).then((data) => data),
    createOrder: (args, req) =>{
        queryDB(req, 'insert into purchase SET ?', args).then((data) => data)},
    //   deleteInventoryItem: (args, req) => queryDB(req, "delete from inventoryitem where id = ?", [args.id]).then(data => data)
};

// Connect graphQL
app.use(
    '/graphql',
    graphqlHTTP({
        schema: storeSchema,
        rootValue: root,
        graphiql: true,
    })
);

// Test root connection
app.get('/', (req, res) => {
    res.send(`Hello World!`);
});

// items = [{id, cost, quantityOrdered, code},{},...]
let calculateOrderAmount = (items, currency) => {
    let itemIds = Object.keys(items);
    let amount = 0;
    itemIds.map((id) => {
        let cost = items[id].cost;
        let quantity = items[id].quantityOrdered;
        amount += cost * quantity;
    });
    if (currency == 'usd') {
        amount *= 100; // Convert to cents, since amount must be positive integer representing how much to charge in the smallest currency (cents
    }
    return amount;
};

// Stripe payment intent endpoint
app.post('/create-payment-intent', upload.array(), async (req, res) => {
    let { items, currency } = req.body;
    // TODO: may hardcode currency to 'usd'
    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: calculateOrderAmount(items, currency),
            currency: currency,
            // Verify integration
            metadata: { integration_check: 'accept_a_payment' },
        },
        { apiKey: config.stripe.secretKey }
    );

    // Send publishable key and paymentIntent details to client
    // TODO: may not need publishable key
    res.send({
        // TODO: publishable key instead of secret
        publishableKey: config.stripe.secretkey,
        clientSecret: paymentIntent.client_secret,
    });
});

let port = 4000;
app.listen(port);
console.log(`Running GraphQL server at http://localhost:${port}/graphql.`);
