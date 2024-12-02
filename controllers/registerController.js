//placeholder

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

exports.addUserToDb = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userName: req.body.userName },
    });

    if (user) {
      res.status(400).send("User already exists");
    } else {
      // Hash the password
      const hash = bcrypt.hashSync(req.body.password, 10);

      await prisma.user.create({
        data: {
          userName: req.body.userName,
          email: req.body.email,
          password: hash,
        },
      });

      console.log(`User ${req.body.userName} added to db`);
      res.redirect("/");
    }
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Server Error");
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = exports;