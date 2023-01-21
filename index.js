// express
const express = require("express");
const app = express();
// mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
// cors
const cors = require("cors");
// middleware
app.use(express.json());
app.use(cors());
// dotenv
require("dotenv").config();
// port
const port = process.env.PORT || 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgg2e.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("Moon_Tech");
        const pcCollection = database.collection("Gaming_PC");

        // find all products
        app.get("/product", async (req, res) => {
            const cursor = pcCollection.find({});
            const products = await cursor.toArray();
            res.json(products);
            // res.send({ status: true, data: products });
        });

        // find product by id
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = await pcCollection.findOne(query);
            // const products = await cursor.toArray();
            // console.log(req);
            res.json(cursor);
        });

        // update product info by id
        app.put("/product/:id", async (req, res) => {
            const body = req.body;
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    model: body.model,
                    image: body.image,
                    brand: body.brand,
                    status: body.status,
                    price: body.price,
                    keyFeature: [
                        body.keyFeature[0],
                        body.keyFeature[1],
                        body.keyFeature[2],
                        body.keyFeature[3],
                    ],
                },
            };
            const result = await pcCollection.updateOne(query, updateDoc);

            console.log(id, body._id);
            res.json(result);
        });

        // post a product
        app.post("/product", async (req, res) => {
            const product = req.body;
            const result = await pcCollection.insertOne(product);
            res.json(result);
        });

        // delete a product
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await pcCollection.deleteOne(query);
            console.log(result);
            res.json(result);

            // update a product
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
