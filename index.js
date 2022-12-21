async function launchContactBook() {
  let ui = grabUiElements();
  await renderNames(ui);
  await launchListeners(ui);
}
function grabUiElements() {
  let inputName = document.getElementById("forms_name");
  let inputLName = document.getElementById("forms_last-name");
  let inputPhone = document.getElementById("forms_phone");
  let inputPhoto = document.getElementById("forms_photo");
  let inputBtn = document.getElementById("forms_btn-add");
  let contactList = document.getElementById("names");
  let renderedName = document.getElementById("contacts_rendered-name");
  let renderedLName = document.getElementById("contacts_rendered-last-name");
  let renderedPhone = document.getElementById("contacts_rendered-phone");
  let renderedPhoto = document.getElementById(
    "contacts_rendered-photo-wrapper"
  );
  let editSpan = document.getElementById("forms_edit-span");
  let updateBtn = document.getElementById("forms_btn-update");
  let del = document.getElementById("delete");
  let newContact = document.getElementById("new");
  let contactDetails = document.getElementById("contact-details");
  let contactInstructions = document.getElementById("contact-instructions");
  let list = document.getElementById("names");
  return {
    inpName: inputName,
    inpLName: inputLName,
    inpPhone: inputPhone,
    inpPhoto: inputPhoto,
    add: inputBtn,
    contactList: contactList,
    name: renderedName,
    lName: renderedLName,
    phone: renderedPhone,
    photo: renderedPhoto,
    editSpan: editSpan,
    update: updateBtn,
    delete: del,
    new: newContact,
    details: contactDetails,
    instructions: contactInstructions,
    list: list,
  };
}

async function launchListeners(ui, id, type) {
  // add new contact
  if (ui && id && type === "new") {
    ui.new.addEventListener("click", function newContact() {
      ui.editSpan.classList.add("hidden");
      ui.add.classList.remove("hidden");
      ui.details.classList.add("hidden");
      ui.instructions.classList.remove("hidden");
      let currentLi = document.getElementById(id);
      currentLi.classList.remove("selected");
      clearInputs(ui);
      ui.new.removeEventListener("click", newContact);
    });
  } else if (id && type === "update") {
    let newUpdateBtn = document.createElement("button");
    newUpdateBtn.innerText = "Update";
    newUpdateBtn.setAttribute("id", "forms_btn-update");
    newUpdateBtn.classList.add("contacts_forms");
    ui.editSpan.prepend(newUpdateBtn);
    newUpdateBtn.addEventListener("click", async function update() {
      await updateContact(ui, id);
      await renderNames(ui);
    });
  } else if (id && type == "delete") {
    ui.delete.addEventListener("click", async function del() {
      await setJSON("delete", id);
      ui.delete.removeEventListener("click", del);
      await renderNames(ui);
      await renderContact(ui);
    });
  } else {
    ui.add.addEventListener("click", function addNew() {
      if (ui.inpPhoto.value == "") {
        ui.inpPhoto.value = "./assets/placeholder.jpg";
      }
      setJSON([
        ui.inpName.value,
        ui.inpLName.value,
        ui.inpPhone.value,
        ui.inpPhoto.value,
      ]);
      renderNames(ui);
      clearInputs(ui);
    });
  }
}

async function renderNames(ui) {
  ui.contactList.innerText = ""; // clear contact list
  let contacts = await getJSON();
  contacts.forEach((contact) => {
    let li = document.createElement("li");
    ui.contactList.append(li);
    li.innerText = `${contact.name} ${contact.lastName}`;
    li.setAttribute("id", contact.id);
    li.addEventListener("click", async function render() {
      await renderContact(ui, contact.id, contact);
    });
  });
}

async function updateContact(ui, id) {
  if (ui.inpPhoto.value == "") {
    ui.inpPhoto.value = "./assets/placeholder.jpg";
  }
  await setJSON(
    [ui.inpName.value, ui.inpLName.value, ui.inpPhone.value, ui.inpPhoto.value],
    id
  );
}

async function renderContact(ui, id, contact) {
  if (id && contact && id === contact.id) {
    let liCol = ui.list.querySelectorAll("li");
    let currentLi = document.getElementById(id);
    currentLi.classList.add("selected");
    liCol.forEach((li) => {
      if (li !== currentLi) {
        li.classList.remove("selected");
      }
    });
    let update = document.getElementById("forms_btn-update");
    update.remove();
    ui.details.classList.remove("hidden");
    ui.instructions.classList.add("hidden");
    ui.name.innerText = contact.name;
    ui.lName.innerText = contact.lastName;
    ui.phone.innerText = contact.phone;
    ui.photo.innerHTML = `<img class = "contacts_photo" src="${contact.photo}">`;
    await editContact(ui, id, contact);
    launchListeners(ui, id, "delete");
    launchListeners(ui, id, "new");
  } else {
    clearInputs(ui);
  }
}

function clearInputs(ui) {
  ui.inpName.value = "";
  ui.inpLName.value = "";
  ui.inpPhone.value = "";
  ui.inpPhoto.value = "";
}

async function editContact(ui, id, contact) {
  ui.add.classList.add("hidden");
  ui.editSpan.classList.remove("hidden");
  ui.inpName.value = contact.name;
  ui.inpLName.value = contact.lastName;
  ui.inpPhone.value = contact.phone;
  ui.inpPhoto.value = contact.photo;
  await launchListeners(ui, id, "update");
}

async function setJSON(contact, id) {
  let endpoint = "http://localhost:8000/contacts/";
  if (contact === "delete" && id) {
    const options = {
      method: "DELETE",
    };
    await fetch(`${endpoint}${id}`, options);
  } else if (id === undefined) {
    [name, lastName, phone, photo] = contact;
    const contactObj = {
      name: name,
      lastName: lastName,
      phone: phone,
      photo: photo,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactObj),
    };
    await fetch(endpoint, options);
  } else if (contact && id) {
    [name, lastName, phone, photo] = contact;
    const contactObj = {
      name: name,
      lastName: lastName,
      phone: phone,
      photo: photo,
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactObj),
    };
    await fetch(`${endpoint}${id}`, options);
  }
}

async function getJSON() {
  let contactsResponse = await fetch("http://localhost:8000/contacts");
  result = await contactsResponse.json();
  return result;
}

launchContactBook();
