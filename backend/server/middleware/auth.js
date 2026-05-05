const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  console.log(req.headers)
  const tokenArr = req.headers.authorization?.split(" ")
  const token = tokenArr[1]


  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode", decoded)
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;