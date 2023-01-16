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
            const cursor = pcCollection.find({}).limit(0);
            const products = await cursor.toArray();
            res.json(products);
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
