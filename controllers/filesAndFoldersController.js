//todo make better name for file for route consistence
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

    exports.renderFolder = (req, res) => {
        try {
            //todo Get the folderId from the request params and use it to fetch the folder from the database
            const userName = req.isAuthenticated() ? req.user.userName : "Guest";
            res.render("folder", {title: "folder", userName: userName});
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }

    //todo create functions to push files and folders to the database
// use those to recreate the file structure in the database
module.export = exports;