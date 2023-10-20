const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// MiddleWare
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running')
})


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnl4pp8.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://assigement10:6QtPjsGK65_cCc_@cluster0.wnl4pp8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        let productCollection = client.db('assigement10').collection('product')
        let brandNameCollection = client.db('assigement10').collection('brandName')
        let brandCartCollection = client.db('assigement10').collection('mycart')


        app.post('/addproduct', async (req, res) => {
            let data = req.body
            let result = await productCollection.insertOne(data)
            // console.log(data);
            res.send(result)
        })

        // Start Add Cart
        app.post('/addCart', async (req, res) => {
            let data = req.body
            let result = await brandCartCollection.insertOne(data)
            console.log(data);
            res.send(result)
        })

        app.get('/myCart', async (rsq, res) => {
            let data = brandCartCollection.find()
            let result = await data.toArray()
            res.send(result)
        })
        app.delete('/cartitem/:id', async (req, res) => {
            let id = req.params.id
            let query = { _id: new ObjectId(id) }
            const result = await brandCartCollection.deleteOne(query)
            res.send(result)
        })

        //End Add Cart

        app.get('/updateproduct/:id', async (req, res) => {
            let id = req.params.id
            let query = { _id: new ObjectId(id) }
            let result = await productCollection.findOne(query)
            res.send(result)
            console.log(id);
          })

        app.put('/updateproduct/:id', async (req, res) => {
            let id = req.params.id
            let productData = req.body
            let query = { _id: new ObjectId(id) }
            let option = { upsert: true }
            let updatedData = {
                $set: {
                    name: productData.name,
                    brandName: productData.brandName,
                    imageValue: productData.imageValue,
                    price: productData.price,
                    producttype: productData.producttype,
                    details: productData.details,
                    shrotDescription: productData.shrotDescription
                }
            }
            let result = await productCollection.updateOne(query, updatedData, option)
            console.log('update the dsfsdfsdproduct');
            res.send(result)
        })

        app.get('/brandName', async (rsq, res) => {
            let data = brandNameCollection.find()
            let result = await data.toArray()
            res.send(result)
        })


        app.get('/brandProduct', async (req, res) => {
            let data = productCollection.find()
            let result = await data.toArray()
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

    }
}
run().catch(console.dir);

app.get('/addproduct', (req, res) => {
    res.send('All ok')
})

app.listen(port, () => {
    console.log('console server is running');
})