const prisma = require("../utils/prisma");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    if (!email || !name || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing informations!" });
    }

    const isExistsEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isExistsEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords incorrect!" });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing informations!" });
    }

    const isExistsUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!isExistsUser) {
      return res.status(404).json({ message: "Email does not exists!" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isExistsUser.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const refreshToken = jwt.sign(
      { user: isExistsUser },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const accessToken = jwt.sign(
      { user: isExistsUser },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const user = {
      id: isExistsUser.id,
      name: isExistsUser.name,
      email: isExistsUser.email,
      picture: isExistsUser.picture,
    };

    // auth logic like verify email and check password...ect
    //..
    //..

    res.status(201).json({user,refreshToken,accessToken});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};


const loginWithGoogle = async (req, res) => {
  try {
    const { googleId, name, email, picture } = req.body;

    if (!googleId) {
      return res.status(400).json({ message: "Google ID is required" });
    }

    const account = await prisma.account.findUnique({
      where: {
        googleId,
      },
    });

    if (!account) {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          picture,
        },
      });

      const account = await prisma.account.create({
        data: {
          googleId,
          email,
          name,
          picture,
          userId: newUser.id,
        },
      });

      await prisma.user.update({
        where: {
          id: newUser.id,
        },
        data: {
          account: {
            connect: {
              id: account.id,
            },
          },
        },
      });

      const refreshToken = jwt.sign(
        { user: newUser },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const accessToken = jwt.sign(
        { user: newUser },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      return res.status(201).json({user,refreshToken,accessToken});
    }

    const theUser = await prisma.user.findFirst({
      where: {
        account: {
          googleId,
        },
      },
    });

    const refreshToken = jwt.sign(
      { user: theUser },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const accessToken = jwt.sign(
      { user: theUser },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const user = {
      id: theUser.id,
      name: theUser.name,
      email: theUser.email,
      picture: theUser.picture,
    };
    return res.status(201).json({user,refreshToken,accessToken});  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const logOut = (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("user");
    res.status(200).json({ message: "All cookies cleared!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  signIn,
  logOut,
  loginWithGoogle,
};
