"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";
import logo from "@/img/logo.png"; // <-- Logo import

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!data.success) {
            setMessage("Invalid email or password");
            return;
        }

        setMessage("Login successful!");

        setTimeout(() => {
            if (data.role === "manager") {
                window.location.href = "/manager";
            } else {
                window.location.href = "/customer/dashboard";
            }
        }, 800);
    }

    return (
        <Container
            maxWidth="xs"
            style={{
                padding: "30px",
                background: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
            }}
        >
            {/* LOGO */}
            <Image
                src={logo}
                alt="McDonalds Logo"
                width={100}
                style={{ marginBottom: "20px" }}
            />

            <h1 style={{ marginBottom: "10px", fontWeight: "bold" }}>Welcome Back</h1>
            <p style={{ marginTop: "-5px", marginBottom: "20px", opacity: 0.7 }}>
                Login to continue your order 🍔
            </p>

            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    margin="normal"
                    type="email"
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    style={{
                        marginTop: "20px",
                        backgroundColor: "#FFC300",
                        color: "#000",
                        fontWeight: "bold",
                    }}
                >
                    Login
                </Button>

                {message && (
                    <p style={{ marginTop: "15px", color: "green", fontWeight: "bold" }}>
                        {message}
                    </p>
                )}

                <p style={{ marginTop: "15px" }}>
                    Not registered?{" "}
                    <Link
                        href="/register"
                        style={{ color: "#D62828", textDecoration: "underline" }}
                    >
                        Create an account
                    </Link>
                </p>
            </form>
        </Container>
    );
}
