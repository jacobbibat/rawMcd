export async function POST(req) {
    try {
        const { getSession } = require("@/lib/auth/sessions");
        const session = await getSession();

        if (!session) {
            return Response.json({ success: false, message: "Not logged in" });
        }

        const { MongoClient } = require("mongodb");

        const client = new MongoClient(
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
        );

        const { productId, qty } = await req.json();
        const userId = String(session.userId);

        if (!productId || qty < 1) {
            return Response.json({
                success: false,
                message: "Invalid quantity or product ID."
            });
        }

        await client.connect();
        const db = client.db("McDonalds");

        const cart = await db.collection("cart").findOne({ userId });

        if (!cart) {
            return Response.json({
                success: false,
                message: "Cart not found."
            });
        }

        // Update the product qty
        const newItems = cart.items.map(item => {
            if (String(item.productId) === String(productId)) {
                return {
                    ...item,
                    qty: Number(qty)
                };
            }
            return item;
        });

        await db.collection("cart").updateOne(
            { userId },
            {
                $set: {
                    items: newItems,
                    appliedPromotion: null,
                    updatedAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            message: "Cart updated!"
        });

    } catch (err) {
        console.log("updateCartItem error:", err);
        return Response.json({
            success: false,
            message: "Server error updating cart."
        });
    }
}
