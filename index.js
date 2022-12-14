const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();

// middlewares
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p41fucv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('used-products').collection('pro-users')
        const productsCollection = client.db('used-products').collection('products')
        const categoryes = client.db('used-products').collection('categorys')
        const bookingsCollection = client.db('used-products').collection('bookings')


        app.put('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log(result)
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
            const query = { category: category };
            const product = await productsCollection.find(query).toArray();
            res.send(product)
        })

        app.get('/products', async (req, res) => {
            const query = {}
            const category = await categoryes.find(query).toArray()
            res.send(category)
        })

        app.get('/seller', async (req, res) => {
            const query = { role: "seller" }
            const category = await usersCollection.find(query).toArray()
            res.send(category)
        })

        app.get('/buyer', async (req, res) => {
            const query = { role: "buyer" }
            const category = await usersCollection.find(query).toArray()
            res.send(category)
        })

        app.get('/products', async (req, res) => {
            const query = {}
            const category = await categoryes.find(query).toArray()
            res.send(category)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const query = {}
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result);
        });
        app.get('/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        })
        app.get('/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        })

        app.put('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
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