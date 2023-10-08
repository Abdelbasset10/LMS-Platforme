const prisma = require("../utils/prisma");

const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
};
