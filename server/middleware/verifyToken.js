const prisma = require("../utils/prisma");

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token) {
      return res.status(403).json({ message: "Token does not exists!" });
    }

    const accessToken = token.split(" ")[1];
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden!" });
        }

        const user = await prisma.user.findUnique({
          where: {
            id: decoded.user.id,
          },
        });

        if (!user) {
          return res.status(404).json({ message: "User does not exists!" });
        }

        next();
      }
    );
  } catch (error) {}
};

module.exports = {
  verifyToken,
};
