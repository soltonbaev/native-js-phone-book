/*Сделать контактную книжку с использованием  Dom и  Json Server

Нужно реализовать:

Нужно реализовать CRUD:
1)добавление
2) отображение
3) редактирование
4) удаление

При создании должно быть 4 инпута:
1) Имя контакта
2) фамилия
3) номер телефона
4) фото контакта

При сдаче прикрепить ссылку на гитхаб (zip, stackblitz и тд не будут приняты) */

async function launchContactBook() {
  let ui = grabUiElements();
  await renderNames(ui);
  await launchListeners(ui);
}
function grabUiElements() {
  console.log("A:", "Grabbing Elements...");
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
  // let updateBtn = document.getElementById("forms_btn-update");
  let del = document.getElementById("delete");
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
    // update: updateBtn,
    delete: del,
  };
}

async function launchListeners(ui, id, type) {
  // add new contact
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
  });
  if (id && type === "update") {
    let update = document.createElement("button");
    ui.editSpan.append(update);
    update.innerText = "Update";
    update.setAttribute("id", "forms_btn-update");
    update.addEventListener("click", async function update() {
      await updateContact(ui, id);
      await renderNames(ui);
      // ui.update.removeEventListener("click", update);
      // await renderContact(ui);
    });
  } else if (id && type == "delete") {
    ui.delete.addEventListener("click", async function del() {
      console.log("Clicking delete button...");
      await setJSON("delete", id);
      ui.delete.removeEventListener("click", del);
      await renderNames(ui);
      await renderContact(ui);
    });
  }
}

// launchListeners();

async function renderNames(ui) {
  console.log(ui);
  console.log("B:", "Rendering list of contacts...");
  ui.contactList.innerText = ""; // clear contact list
  let contacts = await getJSON();
  contacts.forEach((contact) => {
    let li = document.createElement("li");
    ui.contactList.append(li);
    li.innerText = `${contact.name} ${contact.lastName}`;
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
    update = document.getElementById("forms_btn-update");
    update.remove();
    // ui.update.removeEventListener("click", updateContact);
    ui.name.innerText = contact.name;
    ui.lName.innerText = contact.lastName;
    ui.phone.innerText = contact.phone;
    ui.photo.innerHTML = `<img class = "contacts_photo" src="${contact.photo}">`;
    await editContact(ui, id, contact);
    launchListeners(ui, id, "delete");
    // await deleteContact(id);
  } else {
    console.log(true);
    ui.inpName.value = "";
    ui.inpLName.value = "";
    ui.inpPhone.value = "";
    ui.inpPhoto.value = "";
  }
}

// async function deleteContact(id) {

// }

async function editContact(ui, id, contact) {
  ui.add.classList.add("toggle");
  ui.editSpan.classList.remove("toggle");
  ui.inpName.value = contact.name;
  ui.inpLName.value = contact.lastName;
  ui.inpPhone.value = contact.phone;
  ui.inpPhoto.value = contact.photo;
  // ui.update.innerText = "Update";
  await launchListeners(ui, id, "update");
}

async function setJSON(contact, id) {
  // console.log("setting data to JSON server...");
  let endpoint = "http://localhost:8000/contacts/";
  if (contact === "delete" && id) {
    // delete contact
    console.log("Deleting a contact...");
    const options = {
      method: "DELETE",
    };
    await fetch(`${endpoint}${id}`, options);
    // await renderNames();
    //
  } else if (id === undefined) {
    console.log("Creating a new contact...");
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
    console.log("Updating a contact...");
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
    console.log("render names");
    // await renderNames();
    // await renderContact(id, contactObj);
  }
}

async function getJSON() {
  let contactsResponse = await fetch("http://localhost:8000/contacts");
  result = await contactsResponse.json();
  return result;
}

launchContactBook();

// renderContact(1, null);
