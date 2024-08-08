// Function to initialize the search overlay functionality
function initializeSearch() {
  searchFieldHTML();
  // Select the necessary DOM elements
  const openButtons = document.querySelectorAll(".js-search-trigger");
  const closeButton = document.querySelector(".search-overlay__close");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchField = document.querySelector(".search-term");
  const resultsDiv = document.getElementById("search-overlay__results");
  const body = document.querySelector("body");
  let isOverlay = false;
  let isSpinnerLoading = false;
  let debouncingSearch; // Declare debounce variable

  // Function to open the search overlay
  function openOverlay() {
    searchOverlay.classList.add("search-overlay--active");
    body.classList.add("body-no-scroll");
    searchField.value = ""; // Clear the search field value
    setTimeout(() => searchField.focus(), 301); // Add a delay to focus on the search field
    isOverlay = true; // Set isOverlay to true when the overlay is opened
    return false;
  }

  // Function to close the search overlay
  function closeOverlay() {
    searchOverlay.classList.remove("search-overlay--active");
    body.classList.remove("body-no-scroll");
    isOverlay = false; // Set isOverlay to false when the overlay is closed
  }

  // Attach event listeners to the open buttons
  openButtons.forEach((button) => {
    button.addEventListener("click", openOverlay);
  });

  // Attach event listener to the close button
  closeButton.addEventListener("click", closeOverlay);

  // Attach keyboard event listener to the document
  document.addEventListener("keydown", (e) => {
    const activeElement = document.activeElement; // Get the currently focused element to not trigger keyboard events
    if (
      (e.key === "S" || e.key === "s") &&
      !isOverlay &&
      activeElement.tagName !== "INPUT" &&
      activeElement.tagName !== "TEXTAREA"
    ) {
      openOverlay();
      console.log("Open overlay");
    }
    if (e.key === "Escape" && isOverlay) {
      closeOverlay();
      console.log("Close overlay");
    }
  });

  function getResults() {
    let searchValue = searchField.value;
    fetch(
      universityData.root_url +
        "/wp-json/university/v1/search?term=" +
        searchValue
    )
      .then((response) => response.json())
      .then((results) => {
        resultsDiv.innerHTML = `
      <div class="row" >
        <div class="one-third" >
          <h2 class="search-overlay__section-title">General Information</h2>
            ${
              results.generalInfo.length
                ? '<ul class="link-list min-list">'
                : "<p>No general Information</p>"
            }
            ${results.generalInfo
              .map(
                (item) =>
                  ` <li class=""> <a href="${item.permalink}">${item.title} </a>
                   ${item.postType === "post" ? `by ${item.authorName}` : ""} 
                   </li>`
              )
              .join("")}
            ${results.generalInfo ? "</ul>" : ""}
        </div>
        <div class="one-third" >
          <h2 class="search-overlay__section-title">Professors</h2>
          ${
            results.professors.length
              ? '<ul class="professor-cards">'
              : "<p>No Professors Information that matches your searches.</p>"
          }
          ${results.professors
            .map(
              (item) => `
              <li class="professor-card__list-item" >
                <a class="professor-card" href="${item.permalink}">
                <img class="professor-card__image" src="${item.image}" >
                <span class="professor-card__name" >${item.title}</span>
                </a>
            </li> 
              `
            )
            .join("")}
          ${results.professors ? "</ul>" : ""}
          
          <h2 class="search-overlay__section-title">Programs</h2>
          ${
            results.programs.length
              ? '<ul class="link-list min-list">'
              : `<p>No Professors Information that matches your searches. <a href="${universityData.root_url}/programs" >View all Professors</a> </p>`
          }
          ${results.programs
            .map(
              (item) =>
                `<li class=""> <a href="${item.permalink}">${item.title} </a></li>`
            )
            .join("")}
          ${results.programs ? "</ul>" : ""}
        </div>
        <div class="one-third" >
          <h2 class="search-overlay__section-title">Events</h2>
          
           ${
             results.events.length
               ? ""
               : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p>`
           }
              ${results.events
                .map(
                  (item) => `
                <div class="event-summary">
                  <a class="event-summary__date t-center" href="${item.permalink}">
                    <span class="event-summary__month">${item.month}</span>
                    <span class="event-summary__day">${item.day}</span>  
                  </a>
                  <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                    <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
                  </div>
                </div>
              `
                )
                .join("")}
        </div>

      </div>
      `;
      });

    // hve to delete this

    // let searchValue = searchField.value;
    // const postsURL =
    //   universityData.root_url + "/wp-json/wp/v2/posts?search=" + searchValue;
    // const pagesURL =
    //   universityData.root_url + "/wp-json/wp/v2/pages?search=" + searchValue;

    // Promise.all([fetch(postsURL), fetch(pagesURL)])
    //   .then((responses) =>
    //     Promise.all(responses.map((response) => response.json()))
    //   )
    //   .then((data) => {
    //     const [posts, pages] = data;

    //     let resultsHTML = `<h2 class="search-overlay__section-title">General Information</h2>
    //       ${
    //         posts.length
    //           ? '<ul class="link-list min-list">'
    //           : "<p>No general Information</p>"
    //       }
    //       ${posts
    //         .map(
    //           (blogpost) => `
    //             <li class="">
    //               <a href="${blogpost.link}">${blogpost.title.rendered} </a> by ${blogpost.authorName}
    //             </li>`
    //         )
    //         .join("")}
    //       ${posts ? "</ul>" : ""}`;

    //     resultsHTML += `<h2 class="search-overlay__section-title">Pages</h2>
    //       ${
    //         pages.length
    //           ? '<ul class="link-list min-list">'
    //           : "<p>No pages found</p>"
    //       }
    //       ${pages
    //         .map(
    //           (page) => `
    //             <li class="">
    //               <a href="${page.link}">${page.title.rendered}</a>
    //             </li>`
    //         )
    //         .join("")}
    //       ${pages.length ? "</ul>" : ""}`;

    //     resultsDiv.innerHTML = resultsHTML;
    //   })
    //   .catch((error) => console.error("Error:", error));
  }

  // Function to handle debounced search results
  function debouncingSearchResults() {
    if (searchField.value.trim() === "") {
      resultsDiv.innerHTML = "";
    } else {
      getResults();
    }
    isSpinnerLoading = false; // Reset spinner loading status when the results are displayed
  }

  // Implementing Debouncing
  //A better approach to prevent unnecessary spinner loading for non-character keys is to use the input event instead of the keydown event. The input event fires when the value of an input element changes, which is a more appropriate event for triggering debounced searches since it ignores non-character key presses such as arrow keys and modifier keys.

  searchField.addEventListener("input", (e) => {
    clearTimeout(debouncingSearch); // Clear previous timeout before setting a new one
    if (searchField.value.trim() === "") {
      resultsDiv.innerHTML = ""; // Clear results if input is empty
      isSpinnerLoading = false; // Reset spinner loading status
    } else if (!isSpinnerLoading) {
      resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
      isSpinnerLoading = true;
    }
    debouncingSearch = setTimeout(debouncingSearchResults, 500);
  });

  function searchFieldHTML() {
    let overlayHTML = `
         <div class="search-overlay">
      <div class="search-overlay__top">
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true" ></i>
          <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term" autocomplete="off">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true" ></i>
        </div>
      </div>
      <div class="container">
        <div id="search-overlay__results"></div>
      </div>
    </div>
      `;
    document.body.insertAdjacentHTML("beforeend", overlayHTML); // Insert the search overlay HTML into the body
  }
}

// Export the function
export default initializeSearch;
