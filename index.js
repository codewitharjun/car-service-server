const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = 5000;

// middleware 
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4gdc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);  //for cheaking uri in cmd

async function run () {
    try {
        await client.connect();
        // console.log("conneceted to database");
        const database = client.db('carMachanic');
        const servicesCollection = database.collection('services');

        // GET API 
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET SINGLE SERVICE 
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log('check id', id);
            const quary = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(quary)
            res.json(service);
        });

        // POST API 
        app.post('/services', async(req, res) => {
            const service = req.body;
            console.log('service', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // DELETE API 
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const quary = {_id:ObjectId(id)};
            const deleteItem = await servicesCollection.deleteOne(quary);
            res.json(deleteItem);
        })

    }
    finally {
        // await client.close(); 
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server connected');
})

app.listen(port, () => {
    console.log('Server is Rinning port is :', port);
})