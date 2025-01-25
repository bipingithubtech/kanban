import jwt from "jsonwebtoken";

export const jwtMiddleware = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  const getToken = req.cookies.jwtToken;

  if (!getToken) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decodeToken = jwt.verify(getToken, process.env.jwt);
    req.user = decodeToken;
    console.log("jwtDecoded", decodeToken);
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
