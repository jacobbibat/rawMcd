import { MongoClient, ObjectId } from "mongodb";

export async function POST(req) {
    try {
        const { promoId } = await req.json();

        if (!promoId) {
            return Response.json({
                success: false,
                message: "Missing promoId"
            });
        }

        const client = new MongoClient(
            "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
        );

        await client.connect();
        const db = client.db("McDonalds");

        const result = await db.collection("promotions").deleteOne({
            _id: new ObjectId(promoId)
        });

        if (result.deletedCount === 0) {
            return Response.json({
                success: false,
                message: "Promotion not found"
            });
        }

        return Response.json({
            success: true,
            message: "Promotion deleted successfully"
        });

    } catch (err) {
        console.error("deletePromotion error:", err);
        return Response.json({
            success: false,
            message: "Server error deleting promotion"
        });
    }
}
