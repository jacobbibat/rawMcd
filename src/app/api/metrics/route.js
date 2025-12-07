export async function GET() {
    const { MongoClient } = require("mongodb");

    const client = new MongoClient(
        "mongodb+srv://b00165639:brightposy@cluster0.ah2kv3o.mongodb.net/?appName=Cluster0"
    );

    await client.connect();
    const db = client.db("McDonalds");
    const orders = db.collection("orders");

    // ================
    // LAST 7 DAYS ORDERS COUNT
    // ================
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const results = await orders.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]).toArray();

    const labels = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        const label = d.toISOString().slice(0, 10);
        labels.push(label);

        const found = results.find(r => r._id === label);
        values.push(found ? found.count : 0);
    }

    // ================
    // TOTAL REVENUE (all time)
    // ================
    const revenueResult = await orders.aggregate([
        {
            $group: {
                _id: null,
                revenue: { $sum: "$total" }
            }
        }
    ]).toArray();

    const totalRevenue = revenueResult.length > 0
        ? Number(revenueResult[0].revenue.toFixed(2))
        : 0;

    return Response.json({
        labels,
        values,
        totalRevenue
    });
}
