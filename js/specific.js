const specificContainer = document.querySelector(".specific-content");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalClose = modal.querySelector(".close");
const postURL = "https://health-hub.karenjo.no/wp-json/wp/v2/posts?_embed";
const imgURL = "https://health-hub.karenjo.no/wp-json/wp/v2/media/";

const queryString = window.document.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

// Fetch and display single post
async function fetchPost() {
  try {
    const response = await fetch(`${postURL}&include=${id}`);
    const post = await response.json();
    const specificPost = post[0];

    const imgResponse = await fetch(
      `${imgURL}${specificPost.featured_media}?_embed`
    );
    const imgData = await imgResponse.json();
    const imageUrl = imgData.media_details.sizes.full.source_url;

    // get single post id
    /*     const specificPost = post.find((post) => post.id === parseInt(id));
     */

    // loader
    specificContainer.innerHTML = "";

    const date = new Date(specificPost.date).toLocaleDateString(undefined, {
      // modify the date (chatGPT)
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    specificContainer.innerHTML = `
      <h1>${specificPost.title.rendered}</h1>
      <p>Published on ${date}</p>
      <div class="content">${specificPost.content.rendered}</div>
    `;

    const newPageTitle = `Health Hub | ${specificPost.slug}`;
    document.title = newPageTitle;

    const images = specificContainer.querySelectorAll(".content img");

    // replacing event listener with openModal to trigger tapping on other devices like iphone/ipdad to open modal (chatGPT)

    images.forEach((image) => {
      const openModal = () => {
        console.log("Image clicked!");
        document.querySelector(".modal-image").src = imageUrl;
        modal.classList.add("show");
      };

      image.addEventListener("click", openModal);
      image.addEventListener("touchstart", openModal);
    });

    // event listener for closing the modal (chatGPT)
    modalClose.addEventListener("click", () => {
      modal.classList.remove("show");
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });
  } catch (error) {
    console.log(error);
    specificContainer.innerHTML = "An error occurred";
  }
}

fetchPost();
