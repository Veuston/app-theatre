const express = require("express");
const requireAll = require("require-all");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const {
  errorHandler,
  ensureAuthenticated,
  PUBLIC_ROUTES,
} = require("forest-express-mongoose");

const app = express();

// Configuration CORS
let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];
if (process.env.CORS_ORIGINS) {
  allowedOrigins = allowedOrigins.concat(process.env.CORS_ORIGINS.split(","));
}

const corsConfig = {
  origin: allowedOrigins,
  maxAge: 86400, // 1 day
  credentials: true,
};

// Middlewares
app.use(morgan("tiny"));

// Support for request-private-network as the `cors` package
// doesn't support it by default
// See: https://github.com/expressjs/cors/issues/236
app.use((req, res, next) => {
  if (req.headers["access-control-request-private-network"]) {
    res.setHeader("access-control-allow-private-network", "true");
  }
  next(null);
});

app.use("/forest/authentication", cors({ ...corsConfig, origin: corsConfig.origin.concat("null") }));
app.use(cors(corsConfig));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const userRoutes = require("./api/user");
const booksRoutes = require("./api/books");
const tomeRoutes = require("./api/tome");

app.use(userRoutes);
app.use(booksRoutes);
app.use(tomeRoutes);

// JWT Middleware
app.use((req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.FOREST_AUTH_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
});

// Forest Authentication Middleware
app.use("/forest", (request, response, next) => {
  if (PUBLIC_ROUTES.includes(request.url)) {
    return next();
  }
  return ensureAuthenticated(request, response, next);
});

// Import Routes dynamically
requireAll({
  dirname: path.join(__dirname, "routes"),
  recursive: true,
  resolve: (Module) => app.use("/forest", Module),
});

// Import Middlewares dynamically
requireAll({
  dirname: path.join(__dirname, "middlewares"),
  recursive: true,
  resolve: (Module) => Module(app),
});

// Error handling middleware
app.use(errorHandler());

module.exports = app;
