const express = require("express");
const requireAll = require("require-all");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("express-jwt");
const morgan = require("morgan");
const {
  errorHandler,
  ensureAuthenticated,
  PUBLIC_ROUTES,
} = require("forest-express-mongoose");

const app = express();

let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];

if (process.env.CORS_ORIGINS) {
  allowedOrigins = allowedOrigins.concat(process.env.CORS_ORIGINS.split(","));
}

const corsConfig = {
  origin: allowedOrigins,
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
};

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
app.use(
  "/forest/authentication",
  cors({
    ...corsConfig,
    // The null origin is sent by browsers for redirected AJAX calls
    // we need to support this in authentication routes because OIDC
    // redirects to the callback route
    origin: corsConfig.origin.concat("null"),
  })
);
app.use(cors(corsConfig));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// import Routes
const userRoutes = require("./api/user");
app.use(userRoutes);

const booksRoutes = require("./api/books");
app.use(booksRoutes);

const tomeRoutes = require("./api/tome");
app.use(tomeRoutes);

//Ce middleware ne fait que vérifier que le jeton JWT est présent dans la requête.
//Il ne vérifie pas si le jeton est valide ou non.
//Pour vérifier la validité du jeton, vous devez utiliser une fonction de validation personnalisée.
/* app.use(
  jwt({
    secret: process.env.FOREST_AUTH_SECRET,
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
); */

//Correction apportée
function validateToken(req, res, next) {
  const token = req.headers['Authorization'].split(' ')[1];
  const payload = jwt.verify(token, secret);

  if (!payload) {
    return res.status(401).send('Unauthorized');
  }

  req.user = payload;
  next();
}

app.use("/forest", (request, response, next) => {
  if (PUBLIC_ROUTES.includes(request.url)) {
    return next();
  }
  return ensureAuthenticated(request, response, next);
});

requireAll({
  dirname: path.join(__dirname, "routes"),
  recursive: true,
  resolve: (Module) => app.use("/forest", Module),
});

requireAll({
  dirname: path.join(__dirname, "middlewares"),
  recursive: true,
  resolve: (Module) => Module(app),
});

app.use(errorHandler());

module.exports = app;
