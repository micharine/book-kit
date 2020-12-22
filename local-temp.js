const config = {
    db: {
        host: /* DB host e.g. 'localhost'*/,
        user: /* DB username e.g. 'root'*/,
        password : /* DB password*/,
        database: 'bookkit_dev', // this is the name of the database that is created using the scripts in this project. If you use a different DB, replace this field with that DB's name
        port: /* Port, e.g. 3306 */,
    },
    
    stripe: {
        // Find these keys here after creating a stripe account https://stripe.com/docs/keys
        publishableKey: /* publishableKey from stripe, e.g. 'pk_test_....'*/,
        secretKey: /* secretKey from stripe, e.g. 'sk_test_...'*/
    }
}

module.exports = {
    config
}