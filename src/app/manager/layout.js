import { getSession } from "@/lib/auth/sessions";

export default async function ManagerLayout({ children }) {
    const session = await getSession();

    // REDIRECT IF NOT LOGGED IN
    if (!session) {
        return (
            <html>
            <body>
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                You must be logged in.
            </h2>
            <script>{`window.location.href = "/login"`}</script>
            </body>
            </html>
        );
    }

    // REDIRECT IF NOT MANAGER
    if (session.role !== "manager") {
        return (
            <html>
            <body>
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                Unauthorized — Manager access only.
            </h2>
            <script>{`window.location.href = "/customer/dashboard"`}</script>
            </body>
            </html>
        );
    }

    return (
        <html>
        <body
            style={{
                margin: 0,
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#FFFBEA", // light yellow background
            }}
        >
        {/* HEADER BAR */}
        <header
            style={{
                backgroundColor: "#FFE55C",
                padding: "20px",
                textAlign: "center",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
                boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
                marginBottom: "25px",
            }}
        >
            <h2 style={{ margin: 0 }}>Manager Dashboard</h2>
            <p style={{ margin: "5px 0 0 0", opacity: 0.7 }}>
                Manage menu, orders & promotions
            </p>
        </header>

        {/* PAGE CONTENT */}
        <main
            style={{
                padding: "0 20px 100px 20px", // leaves space for ManagerBottomNav
            }}
        >
            {children}
        </main>
        </body>
        </html>
    );
}
