var mysql = require("mysql");
var inquirer = require("inquirer");
var productInput = [];
var idInput = [];
var qtyInput = [];

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
    // console.log(results);
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
        console.log(answers);
        checkStock(answers.id, answers.quantity);
        // idInput.push(answers.id);
        // productInput.push(answers.product);
        // qtyInput.push(answers.quantity);
        // console.log(idInput);
        // console.log(qtyInput);
        // console.log(productInput);
      });
  });
}
displayItems();
itemSelection();

function checkStock(id, qty) {
  // console.log(id);
  var query = "SELECT stock_quantity FROM products WHERE item_id=" + id + ";";
  connection.query(query, function(error, response) {
    if (error) throw error;
    console.log(response[0].stock_quantity);
    if (qty <= response[0].stock_quantity) {
      var newqty = response[0].stock_quantity - qty;
      console.log(newqty);
      connection.query("UPDATE products SET ? WHERE item_id=" + id, [
        {
          stock_quantity: newqty
        },
        {
          id: id
        }
      ]);
      console.log("stock updated");
      connection.end();
    }
  });
}
