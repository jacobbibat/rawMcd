export async function POST(req) {
    try {
        const { getSession } = require("@/lib/auth/sessions");
        const session = await getSession();

        if (!session) {
            return Response.json({
                success: false,
                message: "You must be logged in."
            });
        }

        const { MongoClient } = require("mongodb");

        const url =
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";

        const client = new MongoClient(url);
        const userId = String(session.userId);

        await client.connect();
        const db = client.db("McDonalds");

        const cart = await db.collection("cart").findOne({ userId });

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return Response.json({
                success: false,
                message: "Cart is empty."
            });
        }

        const total = cart.items.reduce(
            (sum, item) => sum + Number(item.qty) * Number(item.price),
            0
        );

        let discountAmount = 0;
        let finalTotal = total;
        let promoTitle = null;

        if (cart.appliedPromotion) {
            const promo = await db.collection("promotions").findOne({
                code: cart.appliedPromotion,
                active: true
            });

            if (promo) {
                discountAmount = total * (promo.discount / 100);
                finalTotal = total - discountAmount;
                promoTitle = promo.title;
            }
        }

        return Response.json({
            success: true,
            cart,
            total,
            discountAmount,
            finalTotal,
            promotion: promoTitle
        });

    } catch (err) {
        console.log("getCart error:", err);
        return Response.json({
            success: false,
            message: "Server error loading cart."
        });
    }
}
