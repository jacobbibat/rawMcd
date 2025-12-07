export async function GET(req) {

    const { getSession } = require("@/lib/auth/sessions");

    const session = await getSession();

    if (!session) {
        return Response.json({
            loggedIn: false
        });
    }

    return Response.json({
        loggedIn: true,
        session
    });
}
