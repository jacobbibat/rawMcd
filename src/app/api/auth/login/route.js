export async function POST(req) {

    console.log("In login API");

    const { MongoClient } = require("mongodb");
    const bcrypt = require("bcrypt");
    const { createSession } = require("@/lib/auth/sessions");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    const dbName = "McDonalds";

    const body = await req.json();
    const { email, password } = body;

    await client.connect();
    console.log("Connected to DB");

    const db = client.db(dbName);
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
        return Response.json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
        return Response.json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // CREATE SESSION COOKIE
    await createSession(user);

    return Response.json({
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            firstName: user.firstName,
            role: user.role
        }
    });
}
