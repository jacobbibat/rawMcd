"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ManagerBottomNav from "../../components/ManagerBottomNav";

export default function ManagerMenuPage() {

    const [menu, setMenu] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadMenu();
    }, []);

    async function loadMenu() {
        const res = await fetch("/api/getAllMenu");
        const data = await res.json();

        if (!data.success) {
            setMessage("Could not load menu.");
            return;
        }

        setMenu(data.menu);
    }

    async function deleteItem(id) {
        const res = await fetch("/api/deleteMenuItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const data = await res.json();
        setMessage(data.message);
        loadMenu();
    }

    return (
        <>
            <Container maxWidth="sm" style={{ marginTop: "40px", marginBottom: "90px" }}>
                <h1>Manage Menu</h1>

                <Button
                    variant="contained"
                    fullWidth
                    style={{ marginBottom: "20px" }}
                    onClick={() => window.location.href = "/manager/menu/add"}
                >
                    + Add New Menu Item
                </Button>

                {menu.map((item) => (
                    <Box
                        key={item._id}
                        style={{
                            padding: "15px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginBottom: "15px"
                        }}
                    >
                        <Typography><b>{item.name}</b></Typography>
                        <Typography>{item.description}</Typography>
                        <Typography>Price: €{item.price}</Typography>
                        <Typography>Category: {item.category}</Typography>
                        <Typography>Available: {item.available ? "Yes" : "No"}</Typography>

                        <Box style={{ marginTop: "15px" }}>
                            <Button
                                variant="outlined"
                                style={{ marginRight: "10px" }}
                                onClick={() => {
                                    localStorage.setItem("editItemId", item._id);
                                    window.location.href = "/manager/menu/edit";
                                }}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => deleteItem(item._id)}
                            >
                                Delete
                            </Button>
                        </Box>
                    </Box>
                ))}

                {message && (
                    <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
                )}
            </Container>

            <ManagerBottomNav />
        </>
    );
}
