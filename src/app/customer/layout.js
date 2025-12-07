import { getSession } from "@/lib/auth/sessions";
import { redirect } from "next/navigation";

import Image from "next/image";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import { mcdTheme } from "@/theme/mcdonaldsTheme";

export default async function CustomerLayout({ children }) {
    const session = await getSession();

    // Redirects
    if (!session) redirect("/login");
    if (session.role === "manager") redirect("/manager");

    return (
        <html>
        <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider theme={mcdTheme}>

            {/* 🔥 Global McDonald's Header */}
            <Box
                sx={{
                    width: "97%",
                    backgroundColor: "#FFE55C",
                    padding: "12px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    borderBottom: "3px solid #FFCC00",
                    position: "sticky",
                    top: 0,
                    zIndex: 999,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
            >
                {/* LOGO */}
                <Image
                    src="/img/logo.png"
                    width={42}
                    height={42}
                    alt="McDonalds Logo"
                />


                {/* TITLE */}
                <h2
                    style={{
                        margin: 0,
                        fontSize: "22px",
                        color: "#333",
                        fontWeight: "bold",
                    }}
                >
                    McDonalds
                </h2>
            </Box>

            {/*SPACING BELOW HEADER */}
            <Box sx={{ height: "20px" }} />

            {/* PAGE CONTENT */}
            <main>
                {children}
            </main>

        </ThemeProvider>
        </body>
        </html>
    );
}
