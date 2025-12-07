export async function GET() {

    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();

    const db = client.db("McDonalds");
    const menu = await db.collection("menu").find({}).toArray();

    return Response.json({
        success: true,
        menu
    });
}
