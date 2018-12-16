var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

function displayItems() {
  connection.query("SELECT * from products;", function(error, results, fields) {
    if (error) throw error;
    for (var i = 0; i < results.length; i++) {
      console.log(
        "Item id: " +
          results[i].item_id +
          " " +
          "Proudct name: " +
          results[i].product_name +
          " " +
          "Price: $" +
          results[i].price
      );
    }
  });
}

function itemSelection() {
  connection.query("SELECT * from products;", function(error, results, fields) {
    if (error) throw error;
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the id of the item you want to buy?",
          name: "id"
        },
        // {
        //   type: "input",
        //   message: "What is the name of the product you want to buy?",
        //   name: "product"
        // },
        {
          type: "input",
          message: "How much do you want to buy?",
          name: "quantity"
        }
      ])
      .then(answers => {
        checkStock(answers.id, answers.quantity);
      });
  });
}
displayItems();
itemSelection();

function checkStock(id, qty) {
  var query = "SELECT stock_quantity FROM products WHERE item_id=" + id + ";";
  connection.query(query, function(error, response) {
    if (error) throw error;

    if (qty <= response[0].stock_quantity) {
      var newqty = response[0].stock_quantity - qty;

      connection.query("UPDATE products SET ? WHERE item_id=" + id, [
        {
          stock_quantity: newqty
        },
        {
          id: id
        }
      ]);
      calculatePrice(id, qty);
    }
  });
}

function calculatePrice(id, qty) {
  connection.query("SELECT price from products WHERE item_id=" + id, function(
    error,
    results
  ) {
    if (error) throw error;
    var total = results[0].price * qty;
    console.log("Your total is: " + total);
  });
}
