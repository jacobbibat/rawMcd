export async function POST(req) {
    try {
        const { getSession } = require("@/lib/auth/sessions");
        const session = await getSession();

        // Must be logged in
        if (!session) {
            return Response.json({
                success: false,
                message: "You must be logged in."
            });
        }

        const { MongoClient, ObjectId } = require("mongodb");

        const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
        const client = new MongoClient(url);

        const { productId } = await req.json();

        if (!productId) {
            return Response.json({ success: false, message: "Missing productId" });
        }

        await client.connect();
        const db = client.db("McDonalds");

        // 1. Get product details
        const product = await db
            .collection("menu")
            .findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return Response.json({ success: false, message: "Product not found." });
        }

        const userId = String(session.userId);

        // 2. Find or create cart
        let cart = await db.collection("cart").findOne({ userId });

        if (!cart) {
            cart = { userId, items: [], updatedAt: new Date() };
            await db.collection("cart").insertOne(cart);
        }

        // 3. Check if product already exists
        const existing = cart.items.find(
            (item) => String(item.productId) === String(productId)
        );

        const price = Number(product.price);

        if (existing) {
            existing.qty = Number(existing.qty) + 1;
        } else {
            cart.items.push({
                productId: String(productId),
                name: product.name,
                price: price,
                qty: 1,
                image: product.image || "/placeholder-food.png"
            });
        }

        // 4. Save updated cart
        await db.collection("cart").updateOne(
            { userId },
            {
                $set: {
                    items: cart.items,
                    appliedPromotion: null, // Reset applied promo when cart changes
                    updatedAt: new Date()
                }
            }
        );

        return Response.json({
            success: true,
            message: `${product.name} added to cart!`
        });

    } catch (err) {
        console.error("addToCart error:", err);
        return Response.json({
            success: false,
            message: "Server error adding to cart."
        });
    }
}
