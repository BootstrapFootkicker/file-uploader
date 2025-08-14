// Show popup with a form
function openFolderPopup(formBuilder) {
    displayPopup(formBuilder);
}

// Build the edit folder form
function buildEditFolderForm(editButton) {
    const folderContainer = editButton.closest(".folder-container");
    const folderNameElement = folderContainer.querySelector(".folder-name");

    const formContainer = document.createElement("div");
    formContainer.classList.add("folderFormContainer");

    const form = document.createElement("form");
    form.classList.add("folderForm");

    const folderTitle = document.createElement("h1");
    folderTitle.textContent = folderNameElement.textContent;

    const folderNameInput = document.createElement('input');
    folderNameInput.type = 'text';
    folderNameInput.name = "newFolderName";

    const submitEditButton = document.createElement("button");
    submitEditButton.type = "submit";
    submitEditButton.textContent = "Edit Folder Name";

    submitEditButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const currentFolderName = folderNameElement.textContent;
        const updatedFolderName = folderNameInput.value;
        const response = await fetch("/files/editFolderName", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({folderName: currentFolderName, newFolderName: updatedFolderName}),
        });

        if (!response.ok) {
            throw new Error("Failed to update folder name");
        }

        folderNameElement.textContent = updatedFolderName;
        closePopup(document.querySelector(".popup-overlay"));
    });

    form.appendChild(folderTitle);
    form.appendChild(folderNameInput);
    form.appendChild(submitEditButton);
    formContainer.appendChild(form);

    return formContainer;
}

// Build the create folder form
function buildCreateFolderForm() {
    const formContainer = document.createElement("div");
    formContainer.classList.add("folderFormContainer");

    const form = document.createElement("form");
    form.classList.add("folderForm");

    const header = document.createElement("h3");
    header.textContent = "Create Folder";

    const label = document.createElement("h1");
    label.textContent = "Folder Name";

    const folderNameInput = document.createElement("input");
    folderNameInput.type = "text";
    folderNameInput.name = "folderName";

    const submitCreateButton = document.createElement("button");
    submitCreateButton.type = "submit";
    submitCreateButton.textContent = "Create Folder";

    submitCreateButton.addEventListener("click", async (event) => {
        event.preventDefault();
        await createFolder();
        closePopup(document.querySelector(".popup-overlay"));

    });

    form.appendChild(header);
    form.appendChild(label);
    form.appendChild(folderNameInput);
    form.appendChild(submitCreateButton);
    formContainer.appendChild(form);

    return formContainer;
}

// Display popup overlay with form
function displayPopup(formBuilder) {
    const overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");

    const form = formBuilder();
    form.classList.add("popup-form");

    overlay.appendChild(form);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closePopup(overlay);
        }
    });
}

// Remove popup overlay
function closePopup(overlay) {
    document.body.removeChild(overlay);
}

// Create a new folder and add to DOM
async function createFolder() {
    const folderName = document.querySelector("input[name='folderName']").value;
//todo add rest of folder buttons on creation/styling as well
    if (!folderName.trim()) {
        alert("Folder name cannot be empty.");
        return;
    }

    try {
        const response = await fetch("/files/addFolder", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({folderName}),
        });

        if (!response.ok) {
            throw new Error("Failed to create folder");
        }

        const folder = await response.json();
        const folderList = document.querySelector(".folderList-Container");
        if (!folderList) {
            console.warn("⚠️ folderList-Container not found");
            return;
        }

        const newFolderElement = document.createElement("div");
        newFolderElement.classList.add("folder-container");
        newFolderElement.innerHTML = `
      <a class="folder-link" href="/folder/${folder.id}">
        <div class="folder-icon">
          <img src="/images/folder.png" alt="Folder Icon">
        </div>
        <div class="folder-name">
          <span>${folder.name}</span>
        </div>
      </a>
     <div class="drpdown" data-dropdown>
        <button class="drpdownMenuButton" data-dropdown-button>...</button>
        <div class="drpdownMenu">
          <button type="button" onclick="openFolderPopup(() => buildEditFolderForm(this))">Edit</button>
          <button type="button" onclick="deleteFolder(this)">Delete</button>
        </div>
      </div>
    `;
        folderList.appendChild(newFolderElement);

// Sort the folders alphabetically after adding
        const folders = Array.from(folderList.children);

        folders.sort((a, b) => {
            const nameA = a.querySelector(".folder-name span").textContent.toLowerCase();
            const nameB = b.querySelector(".folder-name span").textContent.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        folders.forEach(folder => folderList.appendChild(folder));

    } catch (error) {
        console.error("❌ Error in createFolder():", error);
        alert("An error occurred while creating the folder.");
    }
}

// Delete a folder and remove from DOM
async function deleteFolder(deleteButton) {
    const folderContainer = deleteButton.closest(".folder-container");
    const folderNameElement = folderContainer.querySelector(".folder-name");
    const folderName = folderNameElement.textContent.trim();

    console.log("Folder to DELETE:", folderName);

    try {
        const response = await fetch("/files/removeFolder", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({folderName}),
        });

        if (!response.ok) {
            throw new Error("Failed to DELETE folder");
        }

        folderContainer.remove();
    } catch (error) {
        console.error("❌ Error in deleteFolder():", error);
        alert("An error occurred while deleting the folder.");
    }
}

// Fetch user folders (for future use)
async function fetchUserFolders() {
    try {
        const response = await fetch("/files/userFolders");
        if (!response.ok) {
            throw new Error("Failed to fetch folders");
        }
        const folders = await response.json();
        console.log(folders);
    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching folders.");
    }
}

// Close dropdown when clicking a link inside
document.querySelectorAll('.drpdownMenu a').forEach(link => {
    link.addEventListener('click', () => {
        const parentDropdown = link.closest('[data-dropdown]');
        parentDropdown?.classList.remove('active');
    });
});