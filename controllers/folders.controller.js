const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Render the files.js and folders page
exports.renderUserFoldersPage = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userName = req.isAuthenticated() ? req.user.userName : "Guest";
        const folders = userId ? await this.findFoldersByUserId(userId) : [];
        res.render("folderList", { title: "User Folders", folders, userName });
    } catch (err) {
        console.error("Error rendering files.js and folders:", err);
        res.status(500).send("Server Error");
    }
};

// Render a specific folder

exports.renderSingleFolderPage = async (req, res) => {
    try {
        const folderId = req.params.folderId;
        const userName = req.isAuthenticated() ? req.user.userName : "Guest";
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: { file: true } // Fetch related files.js
        });

        if (!folder) {
            return res.status(404).send("Folder not found");
        }

        res.render("folder", { title: folder.name, folder, files: folder.file, userName });
    } catch (err) {
        console.error("Error rendering folder:", err);
        res.status(500).send("Server Error");
    }
};

// Add a new folder
exports.createFolder = async (req, res) => {
    console.log("📥 POST /addFolder hit");

    try {
        const folderName = req.body.folderName;
        const userId = req.user?.id;

        console.log("🧾 Request body:", req.body);
        console.log("👤 User ID:", userId);

        if (!folderName) {
            console.warn("⚠️ Folder name missing");
            return res.status(400).json({ error: "Folder name is required" });
        }

        const existingFolder = await exports.findFolderByNameAndUserId(folderName);
        if (existingFolder) {
            console.warn("⚠️ Folder already exists:", existingFolder.name);
            return res.status(400).json({ error: "Folder already exists" });
        }

        const folder = await prisma.folder.create({
            data: { name: folderName, userId },
        });

        console.log("✅ Folder created:", folder);
        res.status(201).json(folder);
    } catch (err) {
        console.error("❌ Error adding folder:", err);
        res.status(500).json({ error: "Failed to create folder" });
    }
};

//remove a folder

exports.deleteFolder = async (req, res) => {
    console.log("BODY:", req.body, "SESSION USER:", req.session?.user);
  const userId = req.user?.id;
  const folderName = req.body.folderName;

  if (!userId || !folderName) {
    return res.status(400).json({ error: "Missing user ID or folder name" });
  }

  const folder = await exports.findFolderByNameAndUserId(folderName, userId);

  if (!folder) {
    return res.status(404).json({ error: "Folder not found" });
  }

  try {
    await prisma.folder.delete({
      where: { id: folder.id }
    });

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (err) {
    console.error("Error deleting folder:", err);
    return res.status(500).json({ error: "Failed to delete folder" });
  }
};

//update Folder
// controllers/folders.controller.js

exports.updateFolder = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const userId = req.user?.id;
  const folderName = req.body.folderName?.trim(); // Trim whitespace
    const newFolderName = req.body.newFolderName?.trim();

    if (!userId || !folderName || !newFolderName) {
        return res.status(400).json({ error: "Missing user ID, current folder name, or new folder name" });
    }

    const folder = await exports.findFolderByNameAndUserId(folderName, userId);

    if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
    }

    try {
        await prisma.folder.update({
            where: { id: folder.id },
            data: { name: newFolderName }
        });
        return res.status(200).json({ message: "Folder name updated successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Failed to update folder name" });
    }
};


// Get a folder by name
exports.findFolderByNameAndUserId = async (folderName, userId) => {
  return prisma.folder.findFirst({
      where: {
          name: folderName,
          userId: userId,
      },
  });
};


// Get all folders for a user
exports.findFoldersByUserId = async (userId) => {
    return prisma.folder.findMany({ where: { userId } });
};

// Fetch and render user folders
exports.renderUserFoldersList = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const folders = await this.findFoldersByUserId(userId);
        res.render("folderList", { title: "User Folders", folders, userName: req.user.userName || "Guest" });
    } catch (err) {
        console.error("Error fetching user folders:", err);
        res.status(500).send("Failed to fetch folders");
    }
};

