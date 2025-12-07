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

    const userId = String(session.userId);

    await client.connect();
    const db = client.db("McDonalds");

    // Remove promo code by clearing appliedPromotion
    await db.collection("cart").updateOne(
        { userId },
        {
            $set: {
                appliedPromotion: null,
                updatedAt: new Date()
            }
        }
    );

    return Response.json({
        success: true,
        message: "Promotion removed."
    });
}
