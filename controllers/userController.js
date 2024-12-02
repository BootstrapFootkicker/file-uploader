//placeholder

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUsers = async (req, res) => {
  try {
    return await prisma.user.findMany();
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Server Error");
  } finally {
    await prisma.$disconnect();
  }
};

exports.getUserByName = async (username) => {
  try {
    return await prisma.user.findFirst({
      where: {
        userName: username,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUserId = async (userName) => {
  try {
    return await prisma.user.findUnique({
      where: {userName: userName},
      select: {id: true},
    });
  } catch (err) {
    console.error("Database query error:", err);
  } finally {
    await prisma.$disconnect();
  }
};

exports.getUserByUserId = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  try {
    return await prisma.user.findUnique({
      where: { id: id },
    });
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
};

exports.addAdminStatus = async (userName) => {
  try {
    await prisma.user.update({
      where: { userName: userName },
      data: { isAdmin: true },
    });
  } catch (err) {
    console.error("Database query error:", err);
  } finally {
    await prisma.$disconnect();
  }
};

exports.isAdmin = async (userName) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userName: userName },
      select: { isAdmin: true },
    });
    return user.isAdmin;
  } catch (err) {
    console.error("Database query error:", err);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = exports;