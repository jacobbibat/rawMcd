export async function POST(req) {
    const { destroySession } = require("@/lib/auth/sessions");

    await destroySession();

    return Response.json({
        success: true,
        message: "Logged out"
    });
}
