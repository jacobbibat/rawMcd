export async function POST(req) {

    console.log("In register API");

    const { MongoClient } = require("mongodb");
    const bcrypt = require("bcrypt");
    const { createSession } = require("@/lib/auth/sessions");

    const url = "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0";
    const client = new MongoClient(url);

    await client.connect();
    console.log("Connected to DB");

    const db = client.db("McDonalds");
    const users = db.collection("users");

    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    // Check if email exists
    const existing = await users.findOne({ email });

    if (existing) {
        return Response.json({
            success: false,
            message: "Email already registered"
        });
    }

    // Hash the password like your login route expects
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "client",
        createdAt: new Date()
    };

    const result = await users.insertOne(user);

    await createSession({
        _id: result.insertedId,
        firstName,
        role: "client"
    });

    return Response.json({
        success: true,
        message: "Registration successful",
        userId: result.insertedId
    });
}
