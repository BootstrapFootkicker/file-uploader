function addFolderForm()
{
    showPopup();

}


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

    folderForm.appendChild(formHeader);
    folderForm.appendChild(formText);
    folderForm.appendChild(folderInput);
    folderForm.appendChild(submitButton);

    folderFormContainer.appendChild(folderForm);

    return folderFormContainer;
}



function showPopup() {

    const overlay = document.createElement("div");
    overlay.classList.add("popup-overlay");

    const folderForm = createFolderForm();
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

