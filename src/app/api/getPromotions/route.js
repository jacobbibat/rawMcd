export async function GET() {

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");

    const promotions = await db.collection("promotions")
        .find({ active: true })
        .toArray();

    return Response.json({
        success: true,
        promotions
    });
}
