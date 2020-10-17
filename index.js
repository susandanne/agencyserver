const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors')
app.use(cors())

require('dotenv').config()

const ObjectId = require('mongodb').ObjectId;


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.fxpfd.mongodb.net:27017,cluster0-shard-00-01.fxpfd.mongodb.net:27017,cluster0-shard-00-02.fxpfd.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-we805n-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    constservicecoll = client.db("creative").collection("services");
    const admin = client.db("creative").collection("email");

    const order_collection = client.db("creative").collection("orders");
    const review_collection = client.db("creative").collection("reviews");
    console.log("database connected")





    app.post('/newservice', (req, res) => {
       servicecoll.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/addadmin', (req, res) => { 
        admin.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/adminmail', (req, res) => { 
        admin.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/check' , (req, res)=>{
        admin.find({email: req.body.email})
            .toArray((err, documents) => {
                if(documents.length > 0){
                    res.send({person: 'admin'})
                }else{
                    res.send({person: 'user'})
                }
            })
    })

    app.get('/service', (req, res) => { 
       servicecoll.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.delete('/delete/:id', (req, res) => {
       servicecoll.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                if (documents.length > 0) {
                   servicecoll.deleteOne({ _id: ObjectId(req.params.id) })
                        .then(result => {
                            res.send(result.deletedCount > 0)
                        })
                }
            })
    })

    app.get('/order', (req, res) => { 
        order_collection.find({})
            .toArray((err, documents)=>{
                res.send(documents)
            })
    })

    app.patch('/update', (req,res)=>{ 
        order_collection.updateOne(
            {_id : ObjectId(req.body.id)},
            {
                $set: { status: req.body.newStatus},
                $currentDate : { "lastModified": true }
            }
        )
        .then(result =>{
            res.send(result.modifiedCount > 0)
        })
    })





    app.post('/place', (req, res) => {
        order_collection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/add', (req, res) => { 
        review_collection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/review', (req, res) => { 
        review_collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.post('/getOrder' , (req, res) => {
        order_collection.find({email: req.body.email})
            .toArray((err, documents) =>{
                res.send(documents);
            })
    })

});



app.get('/', (req, res) => {
    res.send('agency server!')
})

app.listen(process.env.PORT || port)