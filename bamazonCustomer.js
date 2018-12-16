var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
  console.log(
    "Welcome to the bamazon store! Take a look at the items that we have for sale below."
  );

  connection.query("SELECT * from products;", function(error, results, fields) {
    if (error) throw error;

    var table = new Table({
      head: ["Item ID", "Item Name", "Item Price"],
      colWidths: [10, 20, 20]
    });

    for (var i = 0; i < results.length; i++) {
      table.push([
        results[i].item_id,
        results[i].product_name,
        results[i].price
      ]);
    }
    console.log(table.toString());
  });
}
displayItems();
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
    } else {
      console.log(
        "We currently do not have enough inventory to fulfill your order. Please select another item"
      );
      displayItems();
      itemSelection();
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
    console.log(
      "Congratulations your order is complete! Your total is: $" + total
    );
  });
}
