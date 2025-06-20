document.addEventListener('click', e => {
  const isDropdownButton = e.target.matches('[data-dropdown-button]');
  let currentDropdown;

  if (isDropdownButton) {
    currentDropdown = e.target.closest('[data-dropdown]');
    currentDropdown.classList.toggle('active');
  }

  // Close all other dropdowns
  document.querySelectorAll('[data-dropdown].active').forEach(dropdown => {
    if (dropdown === currentDropdown) return;
    dropdown.classList.remove('active');
  });
});




function addFolderForm(formFunction) {
    showPopup(formFunction);
}

function folderInfoForm(folder) {
    let folderFormContainer = document.createElement("div");
    folderFormContainer.classList.add("folderFormContainer");

    let folderForm = document.createElement("form");
    folderForm.classList.add("folderForm");

    let formText = document.createElement("h1");
    formText.textContent = folder.textContent;

    let nameEditInput = document.createElement('input');
    nameEditInput.type = 'text';
    nameEditInput.name = "NewFolderName";

    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Edit Folder Name";

    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        hidePopup(document.querySelector(".popup-overlay"));
    });

    folderForm.appendChild(formText);
    folderForm.appendChild(nameEditInput);
    folderForm.appendChild(submitButton);

    folderFormContainer.appendChild(folderForm);

    return folderFormContainer;
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

        // ✅ Select the container that holds all folder blocks
        let folderListContainer = document.querySelector(".folderList-Container");
        if (!folderListContainer) {
            console.warn("⚠️ folderList-Container not found");
            return;
        }

        // ✅ Create a new folder block
        let newFolder = document.createElement("div");
        newFolder.classList.add("folder-container");

        newFolder.innerHTML = `
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
              <a href="/">test</a>
            </div>
          </div>
        `;

        folderListContainer.appendChild(newFolder);
    } catch (error) {
        console.error("❌ Error in addFolder():", error);
        alert("An error occurred while creating the folder.");
    }
}

async function removeFolder(button) {
    // Go up to the folder-container div
    const folderContainer = button.closest(".folder-container");

    // Then query the .folder-name inside it
    const folderNameElement = folderContainer.querySelector(".folder-name");

    // Get the trimmed text content
    const folderName = folderNameElement.textContent.trim();

    console.log("Folder to DELETE:", folderName);

    try {
        const res = await fetch("/files/removeFolder", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({folderName}),
        });

        if (!res.ok) {
            throw new Error("Failed to DELETE folder");
        }

        folderContainer.remove();


        } catch (error) {
        console.error("❌ Error in addFolder():", error);
        alert("An error occurred while Deleting the folder.");
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


document.querySelectorAll('.drpdownMenu a').forEach(link => {
  link.addEventListener('click', () => {
    const parentDropdown = link.closest('[data-dropdown]');
    parentDropdown?.classList.remove('active');
  });
});
