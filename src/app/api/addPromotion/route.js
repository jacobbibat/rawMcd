export async function POST(req) {

    const { getSession } = require("@/lib/auth/sessions");
    const session = await getSession();

    if (!session || session.role !== "manager") {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { MongoClient } = require("mongodb");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const { title, description, discount, code } = await req.json();

    if (!code || code.trim() === "") {
        return Response.json({
            success: false,
            message: "Promo code is required."
        });
    }

    await client.connect();
    const db = client.db("McDonalds");

    await db.collection("promotions").insertOne({
        title,
        description,
        discount: Number(discount),
        code: code.trim().toUpperCase(),
        active: true,
        createdAt: new Date()
    });

    return Response.json({
        success: true,
        message: "Promotion created successfully!"
    });
}
