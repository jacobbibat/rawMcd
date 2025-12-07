export default function RegisterLayout({ children }) {
    return (
        <html>
        <body
            style={{
                backgroundColor: "#FFFBEA",
                margin: 0,
                padding: 0,
                fontFamily: "Arial, sans-serif",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
        {children}
        </body>
        </html>
    );
}
