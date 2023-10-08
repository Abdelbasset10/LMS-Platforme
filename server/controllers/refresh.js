const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const generateAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Refresh Token does not exists!" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      async (err, decode) => {
        if (err) {
          return res.status(403).json({ message: "FORBIDDEN" });
        }
        const user = decode.user;

        const isExistUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });

        if (!isExistUser) {
          return res.status(404).json({ message: "User does not exists!" });
        }

        const accessToken = jwt.sign(
          { user: isExistUser },
          process.env.JWT_ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
          secure: true,
          httpOnly: true,
          sameSite: "lax",
        });

        return res.status(201).json(accessToken);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateAccessToken,
};
