"use client";

import { createTheme } from "@mui/material/styles";

// 🎨 McDonald's colour palette
export const MCD_COLORS = {
    yellow: "#FFE55C",
    yellowDark: "#FFD944",
    yellowLight: "#FFF3A6",
    red: "#DA291C",
    grey: "#F7F7F7",
    border: "#E5C100",
};

// 🌟 CUSTOM FONT (Playful / McDonalds Style)
export const mcdTheme = createTheme({
    typography: {
        fontFamily: `"Comic Neue", "Fredoka", "Arial Rounded MT", sans-serif`,
        h1: { fontWeight: 700 },
        h2: { fontWeight: 600 },
        h3: { fontWeight: 600 },
        body1: { fontSize: "16px" },
    },

    palette: {
        primary: { main: MCD_COLORS.yellow },
        secondary: { main: MCD_COLORS.red },
        background: { default: "#ffffff" },
    },

    shape: {
        borderRadius: 18,
    },
});

// ⭐ PROMO BANNER STYLE
export const promoBannerStyle = {
    backgroundColor: MCD_COLORS.yellow,
    padding: "20px",
    borderRadius: "22px",
    marginBottom: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    border: `2px solid ${MCD_COLORS.border}`,
    color: "#000",
    textAlign: "left",
};

// ⭐ PRODUCT CARD STYLE
export const productCardStyle = {
    backgroundColor: "#fff",
    padding: "18px",
    borderRadius: "20px",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

// ⭐ CATEGORY CHIP STYLE
export const categoryChipStyle = (active) => ({
    backgroundColor: active ? MCD_COLORS.yellowDark : MCD_COLORS.grey,
    color: active ? "#000" : "#444",
    padding: "10px 14px",
    fontSize: "15px",
    borderRadius: "14px",
    fontWeight: "700",
    border: active ? `2px solid ${MCD_COLORS.border}` : "1px solid #ddd",
    "&:hover": {
        backgroundColor: MCD_COLORS.yellowLight,
    },
});
