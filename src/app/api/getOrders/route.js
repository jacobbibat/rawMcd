export async function POST(req) {
    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session) {
        return Response.json(
            { success: false, message: "Not logged in" },
            { status: 401 }
        );
    }

    const { MongoClient } = require("mongodb");

    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");

    const userId = String(session.userId);

    const orders = await db.collection("orders")
        .find({ userId })
        .sort({ createdAt: -1 })
        .toArray();

    return Response.json({
        success: true,
        orders
    });
}
