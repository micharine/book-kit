# GraphQL API for Book-kit-ui
This is an express-powered GraphQL API that interacts with a MySQL database that contains the inventory and orders list for the Bible Book Club store ([book-kit-ui](https://github.com/micharine/book-kit-ui)). It also uses [Stripe.js](https://stripe.com/docs/stripe-js) to manage payment information. 

To test this locally after cloning, 
1. Create or use a [Stripe](https://stripe.com/docs/stripe-js) account to get access to the [keys required](https://stripe.com/docs/keys) to connect to Stripe.
1. Create or use a MySQL server, connect to it with MySQL Workbench and run the scripts from the [`database`](https://github.com/micharine/book-kit/tree/main/database) folder in a query on your server. 
1. **IMPORTANT**: Rename [`local-temp.js`](https://github.com/micharine/book-kit/blob/stripe/local-temp.js) to `local.js` and fill in with the correct values. This is for storing secret information. `local.js` has been added to the `.gitignore` file so that it will not be pushed.
1. from the root directory of this project in a command line, run `npm install`, then  `node server`. 
1. The graphiQL interface will be served on `localhost:4000/graphQL`. You can simply open it in your browser. 

 ## Queries
 The queries are defined in the [`server.js`](https://github.com/micharine/book-kit/blob/main/server.js) file. 
 
 Here we have some example queries that can be run in GraphiQL.
 ### Get a list of all items in inventory
 ```
 query {
  getInventoryItems {
    id,
    name,
    description,
    code,
    cost,
    quantityInStock,
  }
}
```
 ### Get information for one item in inventory
 In this example, we're getting the information for the inventory item with id = 5.
```
{
  getInventoryItemInfo(id: 5) {
    name,
    description,
    code,
    cost,
    quantityInStock,
  }
}
```
### Update the quantity available in the inventory item list
This mutation will update the quantityInStock for the inventory item with id = 5 to be 5.
```
mutation {updateInventoryItemQuantity(id: 5 quantityInStock: 5)}
```
### Create an order

```
mutation{
  createOrder(
    inventoryItemCode: "gen"
    quantityOrdered: 1
    email: "test@testmyemailstuff.com"
    firstName: "Bugs"
    lastName: "Bunny"
    transactionID:"PK_12378"
  )
}
```
