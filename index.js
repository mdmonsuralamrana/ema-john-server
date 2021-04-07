const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwpid.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json())
app.use(cors())

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products")

    app.post("/addProduct", (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productsCollection.find({key: {$in: productsKeys}})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    })


});


app.listen(port,console.log('listening port'))