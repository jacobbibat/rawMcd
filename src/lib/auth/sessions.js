const { cookies } = require("next/headers");

// -----------------------------
// CREATE SESSION
// -----------------------------
async function createSession(user) {
    const cookieStore = await cookies();

    cookieStore.set("session", JSON.stringify({
        userId: user._id,
        firstName: user.firstName,
        role: user.role
    }), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
}

// -----------------------------
// DESTROY SESSION (logout)
// -----------------------------
async function destroySession() {
    const cookieStore = await cookies();

    cookieStore.set("session", "", {
        path: "/",
        expires: new Date(0)
    });
}

// -----------------------------
// GET SESSION
// -----------------------------
async function getSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session");

    if (!cookie) return null;

    try {
        return JSON.parse(cookie.value);
    } catch {
        return null;
    }
}

module.exports = {
    createSession,
    destroySession,
    getSession
};
