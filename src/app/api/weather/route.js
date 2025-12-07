export async function POST(req) {
    console.log("in weather api");

    try {
        const body = await req.json();
        const { location } = body;

        if (!location) {
            return Response.json(
                { error: "Location is required" },
                { status: 400 }
            );
        }

        const apiKey = "61ae200262d445e3bed144615250712";

        const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

        const res = await fetch(url);
        const data = await res.json();

        return Response.json({ weather: data });
    } catch (error) {
        console.error("Weather API error:", error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}
