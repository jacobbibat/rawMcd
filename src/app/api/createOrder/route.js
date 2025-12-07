export async function POST(req) {
    try {
        const { getSession } = require("@/lib/auth/sessions");
        const session = await getSession();

        if (!session) {
            return Response.json({ success: false, message: "You must be logged in." });
        }

        const { MongoClient } = require("mongodb");
        const client = new MongoClient(
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
        );

        const userId = String(session.userId);

        await client.connect();
        const db = client.db("McDonalds");

        // 1. Get cart
        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !cart.items || cart.items.length === 0) {
            return Response.json({
                success: false,
                message: "Your cart is empty."
            });
        }

        // 2. Calculate subtotal
        const subtotal = cart.items.reduce((sum, item) =>
            sum + Number(item.qty) * Number(item.price), 0
        );

        let discountAmount = 0;
        let finalTotal = subtotal;
        let promoTitle = null;

        // 3. Apply promo if exists
        if (cart.appliedPromotion) {
            const promo = await db.collection("promotions").findOne({
                code: cart.appliedPromotion,
                active: true
            });

            if (promo) {
                discountAmount = subtotal * (promo.discount / 100);
                finalTotal = subtotal - discountAmount;
                promoTitle = promo.title;
            }
        }

        // 4. Build order
        const order = {
            userId,
            items: cart.items,
            subtotal,
            discount: discountAmount,
            total: finalTotal,
            promotionUsed: promoTitle,
            status: "pending",
            createdAt: new Date()
        };

        const result = await db.collection("orders").insertOne(order);

        // 5. Clear cart
        await db.collection("cart").deleteOne({ userId });

        return Response.json({
            success: true,
            message: "Order created successfully.",
            orderId: result.insertedId
        });

    } catch (err) {
        console.error("createOrder error:", err);
        return Response.json({ success: false, message: "Server error creating order." });
    }
}
