const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Fetch and render the files and folders page
exports.filesAndFolders = async (req, res) => {
    try {
        const userId = req.user?.id; // Ensure user is authenticated
        const userName = req.isAuthenticated() ? req.user.userName : "Guest";

        // Fetch folders for the user
        const folders = userId ? await exports.findUserFolders(userId) : [];

        // Render the EJS template with folders and userName
        res.render("filesAndFolders", { title: "User Folders", folders, userName });
    } catch (err) {
        console.error("Error rendering files and folders:", err);
        res.status(500).send("Server Error");
    }
};

// Render a specific folder page
exports.renderFolder = async (req, res) => {
    try {
        const folderId = req.params.folderId; // Get folderId from request params
        const userName = req.isAuthenticated() ? req.user.userName : "Guest";

        // Fetch the folder from the database
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
        });

        if (!folder) {
            return res.status(404).send("Folder not found");
        }

        res.render("folder", { title: folder.name, folder, userName });
    } catch (err) {
        console.error("Error rendering folder:", err);
        res.status(500).send("Server Error");
    }
};

// Add a new folder to the database
exports.addFolderToDatabase = async (req, res) => {
    try {
        const folderName = req.body.folderName;
        const userId = req.user?.id; // Ensure user is authenticated

        if (!folderName) {
            return res.status(400).json({ error: "Folder name is required" });
        }

        const existingFolder = await exports.findFolder(folderName);
        if (existingFolder) {
            return res.status(400).json({ error: "Folder already exists" });
        }

        const folder = await prisma.folder.create({
            data: {
                name: folderName,
                userId: userId,
            },
        });

        res.status(201).json(folder);
    } catch (err) {
        console.error("Error adding folder to database:", err);
        res.status(500).json({ error: "Failed to create folder" });
    }
};

// Find a folder by name
exports.findFolder = async (folderName) => {
    return prisma.folder.findUnique({
        where: {
            name: folderName,
        },
    });
};

// Find all folders for a user
exports.findUserFolders = async (userId) => {
    return prisma.folder.findMany({
        where: {
            userId: userId,
        },
    });
};

// Fetch and render user folders (alternative to filesAndFolders)
exports.getUserFolders = async (req, res) => {
    try {
        const userId = req.user?.id; // Ensure user is authenticated

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // Fetch folders for the user
        const folders = await exports.findUserFolders(userId);

        // Pass folders to the EJS template
        res.render("filesAndFolders", { title: "User Folders", folders, userName: req.user.userName || "Guest" });
    } catch (err) {
        console.error("Error fetching user folders:", err);
        res.status(500).send("Failed to fetch folders");
    }
};

module.exports = exports;