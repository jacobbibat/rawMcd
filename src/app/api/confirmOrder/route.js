export async function POST(req) {
    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session) {
        return Response.json({ success: false, message: "You must be logged in." });
    }

    const { MongoClient } = require("mongodb");
    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");

    const userId = String(session.userId);

    const cart = await db.collection("cart").findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
        return Response.json({ success: false, message: "Cart is empty" });
    }

    const total = cart.items.reduce((sum, item) => sum + item.qty * item.price, 0);

    const order = {
        userId,
        items: cart.items,
        total,
        status: "pending",
        createdAt: new Date()
    };

    await db.collection("orders").insertOne(order);

    // Clear cart
    await db.collection("cart").updateOne(
        { userId },
        { $set: { items: [], updatedAt: new Date() } }
    );

    return Response.json({
        success: true,
        message: "Order placed successfully",
        orderId: order._id
    });
}
