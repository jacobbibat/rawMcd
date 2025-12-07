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

    const data = await req.json();

    await client.connect();
    const db = client.db("McDonalds");

    await db.collection("menu").updateOne(
        { _id: new ObjectId(data._id) },
        {
            $set: {
                name: data.name,
                description: data.description,
                price: Number(data.price),
                category: data.category,
                image: data.image || "",
                available: data.available,
                updatedAt: new Date()
            }
        }
    );

    return Response.json({
        success: true,
        message: "Menu item updated!"
    });
}
