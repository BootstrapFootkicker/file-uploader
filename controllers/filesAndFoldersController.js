
exports.filesAndFolders =
    async (req, res) => {
        try {
            const userName = req.isAuthenticated() ? req.user.userName : "Guest";
            res.render("filesAndFolders", {title: "filesAndFolders", userName: userName});
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }
module.export = exports;