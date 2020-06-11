import axios from "axios";

updateBooKList();

const addBookForm = document.getElementById("add-book-form");

addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bodyFormData = new FormData(addBookForm);

  axios({
    method: "post",
    url: "http://localhost:8000/book",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (res) {
      console.info(res.data);

      updateBooKList();
    })
    .catch((err) => {
      console.error(err);
    });
});

function updateBooKList() {
  axios.get("http://localhost:8000/book").then((res) => {
    const bookListContainer = document.getElementById("book-list");

    bookListContainer.innerHTML = "";

    res.data.forEach(({ id, title, author }) => {
      const bookItem = document.createElement("li");
      bookItem.innerHTML = `${id}. ${title} by ${author}`;

      bookListContainer.appendChild(bookItem);
    });
  });
}
