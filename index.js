const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())


//Ag82tXVCFl4hWEut


const uri = "mongodb+srv://usedseller:xQZHlD2v7seMbcnl@cluster0.p41fucv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('used-products').collection('pro-users')
        const productsCollection = client.db('used-products').collection('products')
        const categoryes = client.db('used-products').collection('categorys')

        // Save user email
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            console.log(email);
            const filter = {
                email: email,

            }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const product = req.body;
            const query = {
                sellername: product.sellername,
                productname: product.productname,
                location: product.location,
                category: product.category,
                resaleprice: product.resaleprice,
                originalprice: product.originalprice,
                used: product.used,
                image: product.image,
                publishDate: product.publishDate
            }

            const result = await productsCollection.insertOne(query);
            res.send(result);
        });
        app.get('/products/:category', async (req, res) => {
            const category = req.params.category;
            console.log(category);
            const query = { category: category };
            const product = await productsCollection.find(query).toArray();
            console.log(product);
            res.send(product)
        })
        app.get('/products', async (req, res) => {
            const query = {}
            const category = await categoryes.find(query).toArray()
            res.send(category)
        })

    }
    finally {
    }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})