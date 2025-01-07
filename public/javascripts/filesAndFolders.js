function addFolderForm(formFunction) {
    showPopup(formFunction);
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

function addFolder(){

    //todo add folders to database and possibly session
    let folderContainer = document.querySelector(".folderContainer");
    let folder = createFolder();
    let newFolderButton= document.createElement("button")
    newFolderButton.textContent = folder.name;
    newFolderButton.addEventListener("click", (e) => {
        e.preventDefault();
        newFolderButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "/folder";
        });
    })
    folderContainer.appendChild(newFolderButton);

}

function createUploadFileForm(){
    let uploadFileFormContainer = document.createElement("div");
    let formHeader = document.createElement("h3");
    formHeader.textContent = "Upload File";
    let uploadFileForm = document.createElement("form");
    let formFileInput = document.createElement("input");
    formFileInput.type = "file";
    formFileInput.name = "file";
    let fileNameInput = document.createElement("input");
    fileNameInput.type = "text";
    let fileDescriptionInput = document.createElement("input");
    fileDescriptionInput.type = "text";
    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Upload File";

    uploadFileForm.appendChild(formHeader);
    uploadFileForm.appendChild(formFileInput);
    uploadFileForm.appendChild(fileNameInput);
    uploadFileForm.appendChild(fileDescriptionInput);
    uploadFileForm.appendChild(submitButton);
    uploadFileFormContainer.appendChild(uploadFileForm);
    return uploadFileFormContainer;


}
