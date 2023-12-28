const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite = require('sqlite3');
const fs = require('fs');

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET,POST',
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

const db = new sqlite.Database('./db/inventory.sqlite');

app.get('/store', (req, res) => {
    db.all('SELECT * FROM Store', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
});

app.get('/inventory', (req, res) => {
    db.all('SELECT Inventory.InventoryID, Inventory.ItemID, Inventory.Quantity, Store.ItemName, Store.Category, Store.Unit, Store.Price, Store.Supplier, Store.Thumbnail FROM Inventory JOIN Store ON Inventory.ItemID = Store.ItemID', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json(rows);
    });
});

async function db_run(query, params){
  return new Promise(function(resolve,reject){
      db.run(query, params, function(err,rows){
         if(err){return reject(err);}
         resolve(rows);
       });
  });
}

app.post('/inventory', async (req, res) => {
    try {
        const { inventory } = req.body;

        if (!Array.isArray(inventory) || inventory.length === 0) {
            res.status(400).json({ error: 'Invalid request body. Please provide inventory items.' });
            return;
        }

        const promises = inventory.map(async ({ ItemId: ItemID, Quantity }) => {
            if (!ItemID || !Quantity || isNaN(Quantity))
                return Promise.reject('Invalid item.');
            
            const storeItem = await new Promise((resolve, reject) => db.get('SELECT * FROM Store WHERE ItemID = ?', [ItemID], (err, rows) => {
              if (err) return reject(err);
              resolve(rows);
            }));

            if (storeItem.Quantity < Quantity) {
                return Promise.reject(`Not enough quantity in the store for item with ID ${ItemID}.`);
            }
            const existingInventoryItem = await new Promise((resolve, reject) => db.get('SELECT * FROM Inventory WHERE ItemID = ?', [ItemID], (err, rows) => {
              if (err) return reject(err);
              resolve(rows);
            }));
            if (existingInventoryItem) {
                await db_run('UPDATE Inventory SET Quantity = Quantity + ? WHERE ItemID = ?', [Quantity, ItemID]);
            } else {
                await db_run('INSERT INTO Inventory (ItemID, Quantity) VALUES (?, ?)', [ItemID, Quantity]);
            }
            await db_run('UPDATE Store SET Quantity = Quantity - ? WHERE ItemID = ?', [Quantity, ItemID]);
            return { message: `Item added.` };
        });

        const results = await Promise.allSettled(promises);

        const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

        const failedResults = results
        .filter(result => result.status === 'rejected')
        .map(result => ({ error: result.reason }));

        res.json({ success: successfulResults, error: failedResults });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});