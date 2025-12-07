export async function POST(req) {

    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session || session.role !== "manager") {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { MongoClient, ObjectId } = require("mongodb");

    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    const { orderId, newStatus } = await req.json();

    await client.connect();
    const db = client.db("McDonalds");

    await db.collection("orders").updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: newStatus } }
    );

    return Response.json({
        success: true,
        message: "Order status updated!"
    });
}
