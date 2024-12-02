const passport = require("passport");
const userController = require("./userController");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.index = async (req, res) => {
  try {
    // Example query with all required fields
    const userName = req.isAuthenticated() ? req.user.userName : "Guest";
    const users = await prisma.user.findMany();
    res.status(200).json({ users, userName }); // Send the user data as JSON response with status code 200
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = exports;