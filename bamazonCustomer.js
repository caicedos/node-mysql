var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err, ) {
    if (err) throw err;
    store();
});

function store() {
    connection.query("SELECT * FROM bamazon.products", function (err, res) {
        if (err) throw error;

        res.forEach(element => {
            
            var id = element.id;
            var name = element.product_name;
            var price = element.price;

            console.log(`${id} - ${name} $${price}\n`);
        });

        menu()
    })
}

function menu() {

    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Enter product ID:",
        }, {
            name: "units",
            type: "input",
            message: "How many units would you like?",
        }])

        .then(answers => {

            var requestedId = parseInt(answers.id);
            var requestedUnits = parseInt(answers.units);

            connection.query("SELECT id, price, stock_quantity FROM products WHERE ?", {
                id: answers.id
            }, function (err, res) {
                if (err) throw error;

                res.forEach(element => {

                    elementId = element.id;
                    elementStock = element.stock_quantity
                    elementPrice = element.price;
                  
                    if (elementId === requestedId && requestedUnits <= elementStock) {

                        console.log("Thank you for your purshase!");
                        console.log(`Total cost is $${elementPrice * requestedUnits}`);

                        newStock = elementStock - requestedUnits
                        
                        connection.query("UPDATE products SET ? WHERE ?",
                            [{
                                    stock_quantity: newStock
                                },
                                {
                                    id: requestedId
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                console.log("Transaction Successful!");
                            }
                        );

                    } else {
                        console.log("Insuficient quantity")
                    }
                    menu()
                });
            });
        });
}



