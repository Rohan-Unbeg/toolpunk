// // /server/server.js
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();

// const allowedOrigins = ["http://localhost:5173", "https://toolpunk.vercel.app"];

// app.set("trust proxy", 1); // or true

// // Add this before CORS middleware
// app.use((req, res, next) => {
//     console.log("Received Origin:", req.headers.origin);
//     next();
// });

// app.options("*", cors()); // Handle all OPTIONS requests
// // Add this before CORS middleware
// app.use((req, res, next) => {
//     console.log("Received Origin:", req.headers.origin);
//     next();
// });

// app.use(cors({ origin: "*" }));

// // app.use(
// //     cors({
// //         origin: (origin, callback) => {
// //             console.log("CORS origin requested:", origin);
// //             if (!origin || allowedOrigins.includes(origin)) {
// //                 callback(null, true);
// //             } else {
// //                 callback(new Error("Not allowed by CORS"));
// //             }
// //         },
// //         methods: ["GET", "POST", "OPTIONS"],
// //         allowedHeaders: ["Content-Type", "Authorization"],
// //         credentials: true,
// //     })
// // );

// app.use(express.json());

// // Debug all requests
// app.use((req, res, next) => {
//     console.log(
//         `${req.method} ${req.path} from origin: ${
//             req.headers.origin || "undefined"
//         }`
//     );
//     next();
// });

// // Root route
// app.get("/", (req, res) => {
//     res.json({ message: "Toolpunk API is live!" });
// });

// // Health check
// app.get("/api/health", (req, res) => {
//     res.json({ status: "OK", origin: req.headers.origin || "none" });
// });

// // Routes
// import createOrderRoute from "./create-order.js";
// import verifyPaymentRoute from "./verify-payment.js";

// app.use("/api/create-order", createOrderRoute);
// app.use("/api/verify-payment", verifyPaymentRoute);

// // Catch-all
// app.use((req, res) => {
//     console.log("404 hit:", req.path);
//     res.status(404).json({ error: "Not Found" });
// });

// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const allowedOrigins = ["http://localhost:5173", "https://toolpunk.vercel.app"];

// Trust proxy (important for Render.com)
app.set("trust proxy", 1);

// Request logging middleware (single instance)
app.use((req, res, next) => {
    console.log("Received Origin:", req.headers.origin);
    console.log(`${req.method} ${req.path}`);
    next();
});

// CORS configuration (choose one approach below)

// APPROACH 1: Simple CORS (all origins allowed - for testing)
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* 
// APPROACH 2: Controlled CORS (production-ready)
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
*/

// Handle OPTIONS requests
// app.options("/{*any}", cors());
// Explicit OPTIONS handler for all routes
app.options('/{*any}', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
  });

// Body parser
app.use(express.json());

// Routes
import createOrderRoute from "./create-order.js";
import verifyPaymentRoute from "./verify-payment.js";

// Verify route files exist and export properly
try {
    app.use("/api/create-order", createOrderRoute);
    app.use("/api/verify-payment", verifyPaymentRoute);
} catch (err) {
    console.error("Route loading error:", err);
    process.exit(1);
}

// Basic routes
app.get("/", (req, res) => {
    res.json({ message: "Toolpunk API is live!" });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        origin: req.headers.origin || "none",
        proxy: req.ip,
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
