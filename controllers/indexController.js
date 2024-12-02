const passport = require("passport");
const userController = require("./userController");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.index = async (req, res) => {
  try {
    // Example query with all required fields
    const users = await prisma.user.findMany();
    res.json(users); // Send the user data as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = exports;