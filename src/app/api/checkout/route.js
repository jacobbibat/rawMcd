export async function POST(req) {
    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session) {
        return Response.json({ success: false, message: "You must be logged in." });
    }

    const { MongoClient, ObjectId } = require("mongodb");
    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");

    const userId = String(session.userId);

    const cart = await db.collection("cart").findOne({ userId });

    if (!cart || cart.items.length === 0) {
        return Response.json({
            success: false,
            message: "Cart is empty."
        });
    }

    const menu = db.collection("menu");
    const orders = db.collection("orders");

    // Build correct item prices
    const orderItems = [];
    for (let item of cart.items) {
        const product = await menu.findOne({ _id: new ObjectId(item.productId) });

        orderItems.push({
            productId: item.productId,
            qty: item.qty,
            price: Number(product.price),
            name: product.name
        });
    }

    const total = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    await orders.insertOne({
        userId,
        items: orderItems,
        total,
        status: "pending",
        createdAt: new Date()
    });

    // Clear cart
    await db.collection("cart").updateOne(
        { userId },
        { $set: { items: [] } }
    );

    return Response.json({
        success: true,
        message: "Order placed successfully!"
    });
}
