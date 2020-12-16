# GraphQL API for Book-kit-ui
This is an express-powered GraphQL API that interacts with a MYSQL database that contains the inventory and orders list for the Bible Book Club Kit store ([book-kit-ui](https://github.com/micharine/book-kit-ui)).
 ## Queries
 The queries are defined in the `server.js` file. Here we have some example queries.
 ### Get a list of all items in inventory
 `
 query {
  getInventoryItems {
    id,
    name,
    description,
    code,
    cost,
  }
}
`
 ### Get information for one item in inventory
