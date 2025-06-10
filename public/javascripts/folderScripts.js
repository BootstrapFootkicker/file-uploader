//todo work in here first 3/2/25

document.addEventListener('click',e => {
    const isDropdownButton = e.target.matches('[data-dropdown-button]');
    if (!isDropdownButton && e.target.closest('[data-dropdown]') != null) return;

    if(isDropdownButton){
        currentDropdown = e.target.closest('[data-dropdown]');
        currentDropdown.classList.toggle('active');
    }

    document.querySelectorAll('[data-dropdown].active').forEach(dropdown => {
        if(dropdown === currentDropdown) return;
        dropdown.classList.remove('active');
    }
    );
})



function addFolderForm(formFunction) {
    showPopup(formFunction);
}


//used in folderList.ejs to create the folder form on the fly
function createFolderForm() {
    let folderFormContainer = document.createElement("div");
    folderFormContainer.classList.add("folderFormContainer");

    let folderForm = document.createElement("form");
    folderForm.classList.add("folderForm");

    let formHeader = document.createElement("h3");
    formHeader.textContent = "Create Folder";

    let formText = document.createElement("h1");
    formText.textContent = "Folder Name";

    let folderInput = document.createElement("input");
    folderInput.type = "text";
    folderInput.name = "folderName";

    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Create Folder";

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();

        addFolder();
        hidePopup(document.querySelector(".popup-overlay"));
    }
    );

    folderForm.appendChild(formHeader);
    folderForm.appendChild(formText);
    folderForm.appendChild(folderInput);
    folderForm.appendChild(submitButton);

    folderFormContainer.appendChild(folderForm);

    return folderFormContainer;
}



function showPopup(formFunction) {

    const overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");

    const folderForm = formFunction();
    folderForm.classList.add("popup-form");

    overlay.appendChild(folderForm);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            hidePopup(overlay);
        }
    });
}

function hidePopup(overlay) {
    document.body.removeChild(overlay);
}



function createFolder() {
    let folderName = document.querySelector("input[name='folderName']").value;

    return {
        name: folderName,
        type: "folder",
        children: []
    };
}

// This adds folder button to dom
async function addFolder() {
    let folderName = document.querySelector("input[name='folderName']").value;

    if (!folderName.trim()) {
        alert("Folder name cannot be empty.");
        return;
    }

    try {
        const res = await fetch("/files/addFolder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ folderName }),
        });

        if (!res.ok) {
            throw new Error("Failed to create folder");
        }

        const folder = await res.json();

        let folderContainer = document.querySelector(".folderContainer");
        let newFolderButton = document.createElement("button");
        newFolderButton.textContent = folder.name;
        newFolderButton.addEventListener("click", () => {
            window.location.href = `/folder/${folder.id}`;
        });

        folderContainer.appendChild(newFolderButton);
    } catch (error) {
        console.error(error);
        alert("An error occurred while creating the folder.");
    }
}


async function fetchUserFolders() {
    try {
        const res = await fetch("/files/userFolders");
        if (!res.ok) {
            throw new Error("Failed to fetch folders");
        }

        const folders = await res.json();
        console.log(folders); // Use this data to render folders in the UI
    } catch (error) {
        console.error(error);
        alert("An error occurred while fetching folders.");
    }
}

