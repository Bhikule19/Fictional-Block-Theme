function myNotes() {
  var notesList = document.getElementById("my-notes");

  const deleteButton = document.querySelector(".delete-note");
  if (deleteButton) {
    deleteButton.addEventListener("click", deleteNote);
  }

  const editButton = document.querySelector(".edit-note");
  if (editButton) {
    editButton.addEventListener("click", editNote);
  }

  const updateButton = document.querySelector(".update-note");
  if (updateButton) {
    updateButton.addEventListener("click", updateNote);
  }

  const createButton = document.querySelector(".submit-note");
  if (createButton) {
    createButton.addEventListener("click", createNote);
  }

  // Delete note function
  function deleteNote(e) {
    // Find the closest li parent element of the clicked delete button
    const listItem = e.target.closest("li");
    // Get the data-id attribute from the li element
    const noteID = listItem.getAttribute("data-id");
    console.log(noteID);
    const url = `${universityData.root_url}/wp-json/wp/v2/note/${noteID}`;

    // Define the options for the fetch request, including method and headers
    const options = {
      method: "DELETE",
      headers: {
        "X-WP-Nonce": universityData.nonce, //AJAX Request: Using fetch for the DELETE request, including the nonce in the headers.
      },
    };

    fetch(url, options)
      .then((response) => {
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          return response.json().then((errorInfo) => Promise.reject(errorInfo));
        }
        return response.json();
      })
      .then((data) => {
        console.log("Congrats");
        console.log(data);
        // Remove the li element from the DOM
        listItem.remove();
      })
      .catch((error) => {
        console.log("Sorry");
        console.log(error);
      });
  }

  //update
  function updateNote(e) {
    // Find the closest li parent element of the clicked delete button
    const listItem = e.target.closest("li");
    // Get the data-id attribute from the li element
    const noteID = listItem.getAttribute("data-id");
    // console.log(noteID);
    const url = `${universityData.root_url}/wp-json/wp/v2/note/${noteID}`;

    const ourUpdatedPost = {
      title: listItem.querySelector(".note-title-field").value,
      content: listItem.querySelector(".note-body-field").value,
    };

    // Define the options for the fetch request, including method and headers
    const options = {
      method: "POST",
      body: JSON.stringify(ourUpdatedPost), // Use body and stringify the payload. This converts the ourUpdatedPost JavaScript object into a JSON string because the body of the request must be a string for JSON data.
      headers: {
        "Content-Type": "application/json", // Indicate the content type. you are informing the server that the data being sent in the body of the request is in JSON format. This is necessary for the server to correctly parse and handle the incoming data.
        "X-WP-Nonce": universityData.nonce, //AJAX Request: Using fetch for the DELETE request, including the nonce in the headers.
      },
    };

    fetch(url, options)
      .then((response) => {
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          return response.json().then((errorInfo) => Promise.reject(errorInfo));
        }
        return response.json();
      })
      .then((data) => {
        console.log("Congrats");
        console.log(data);
        makeNoteReadOnly(listItem);
      })
      .catch((error) => {
        console.log("Sorry");
        console.log(error);
      });
  }

  //Create note functionality
  function createNote() {
    const noteTitle = document.querySelector(".new-note-title");
    const noteBody = document.querySelector(".new-note-body");

    const ourNewPost = {
      title: noteTitle.value,
      content: noteBody.value,
      status: "publish",
    };

    const url = `${universityData.root_url}/wp-json/wp/v2/note/`;

    const options = {
      method: "POST",
      body: JSON.stringify(ourNewPost),
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": universityData.nonce,
      },
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorInfo) => Promise.reject(errorInfo));
        }
        return response.json();
      })
      .then((data) => {
        noteTitle.value = "";
        noteBody.value = "";
        const noteHtml = document.querySelector("#my-notes");
        noteHtml.insertAdjacentHTML(
          "afterbegin",
          ` <li data-id="${data.id}" class="fade-in-calc">
            <input readonly class="note-title-field" value="${data.title.raw}">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field">${data.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>`
        );
        noteHtml.style.display = "block";
        console.log("Congrats");
        console.log(data);
      })
      .catch((error) => {
        console.log("Sorry");
        console.log(error);
      });
  }

  // Edit note functionality
  function editNote(e) {
    // Find the closest li parent element of the clicked edit button
    var editListItem = e.target.closest("li");
    const field = editListItem.querySelector(".note-title-field");
    if (field.dataset.state === "editable") {
      makeNoteReadOnly(editListItem);
    } else {
      makeNoteEditable(editListItem);
    }
  }

  function makeNoteEditable(editListItem) {
    const editNoteFields = editListItem.querySelectorAll(
      ".note-title-field, .note-body-field, .update-note"
    );

    const editNoteButn = editListItem.querySelector(".edit-note");
    editNoteButn.innerHTML =
      '<i class="fa fa-times" aria-hidden="true"></i>Cancel';

    editNoteFields.forEach((field) => {
      field.removeAttribute("readonly");
      field.classList.add("note-active-field", "update-note--visible");
      field.dataset.state = "editable";
    });
  }

  function makeNoteReadOnly(editListItem) {
    const editNoteFields = editListItem.querySelectorAll(
      ".note-title-field, .note-body-field, .update-note"
    );

    const editNoteButn = editListItem.querySelector(".edit-note");
    editNoteButn.innerHTML =
      '<i class="fa fa-pencil" aria-hidden="true"></i>Edit';

    editNoteFields.forEach((field) => {
      field.setAttribute("readonly", "readonly");
      field.classList.remove("note-active-field", "update-note--visible");
      field.dataset.state = "cancel";
    });
  }
}

export default myNotes;
