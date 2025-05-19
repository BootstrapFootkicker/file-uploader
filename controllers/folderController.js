const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Render the files and folders page
exports.renderFilesAndFolders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userName = req.isAuthenticated() ? req.user.userName : "Guest";
        const folders = userId ? await this.getUserFoldersById(userId) : [];
        res.render("folderList", { title: "User Folders", folders, userName });
    } catch (err) {
        console.error("Error rendering files and folders:", err);
        res.status(500).send("Server Error");
    }
};

// Render a specific folder
exports.renderFolder = async (req, res) => {
    try {
        const folderId = req.params.folderId;
        const userName = req.isAuthenticated() ? req.user.userName : "Guest";
        const folder = await prisma.folder.findUnique({ where: { id: folderId } });

        if (!folder) {
            return res.status(404).send("Folder not found");
        }

        res.render("folder", { title: folder.name, folder, userName });
    } catch (err) {
        console.error("Error rendering folder:", err);
        res.status(500).send("Server Error");
    }
};

// Add a new folder
exports.addFolder = async (req, res) => {
    try {
        const folderName = req.body.folderName;
        const userId = req.user?.id;

        if (!folderName) {
            return res.status(400).json({ error: "Folder name is required" });
        }

        const existingFolder = await this.getFolderByName(folderName);
        if (existingFolder) {
            return res.status(400).json({ error: "Folder already exists" });
        }

        const folder = await prisma.folder.create({
            data: { name: folderName, userId },
        });

        res.status(201).json(folder);
    } catch (err) {
        console.error("Error adding folder:", err);
        res.status(500).json({ error: "Failed to create folder" });
    }
};

// Get a folder by name
exports.getFolderByName = async (folderName) => {
    return prisma.folder.findUnique({ where: { name: folderName } });
};

// Get all folders for a user
exports.getUserFoldersById = async (userId) => {
    return prisma.folder.findMany({ where: { userId } });
};

// Fetch and render user folders
exports.getUserFolders = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const folders = await this.getUserFoldersById(userId);
        res.render("folderList", { title: "User Folders", folders, userName: req.user.userName || "Guest" });
    } catch (err) {
        console.error("Error fetching user folders:", err);
        res.status(500).send("Failed to fetch folders");
    }
};