function likeFunction() {
  function events() {
    document.querySelectorAll(".like-box").forEach(function (element) {
      element.addEventListener("click", ourClickDispatcher);
    });
  }

  function ourClickDispatcher(e) {
    var currentLikeBox = e.target.closest(".like-box");

    if (currentLikeBox.dataset.exists === "yes") {
      deleteLike(currentLikeBox);
    } else {
      createLike(currentLikeBox);
    }
  }

  function createLike(currentLikeBox) {
    const url = universityData.root_url + "/wp-json/university/v1/manageLike";
    const likeData = {
      professorId: currentLikeBox.dataset.professor,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": universityData.nonce,
      },
      body: JSON.stringify(likeData),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        currentLikeBox.setAttribute("data-exists", "yes");
        const likeCountElement = currentLikeBox.querySelector(".like-count");
        let likeCount = parseInt(likeCountElement.innerHTML, 10);
        likeCount++;
        likeCountElement.innerHTML = likeCount;
        currentLikeBox.setAttribute("data-like", data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteLike(currentLikeBox) {
    const url = `${universityData.root_url}/wp-json/university/v1/manageLike`;
    const likeData = {
      like: currentLikeBox.dataset.like,
    };
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": universityData.nonce,
      },
      body: JSON.stringify(likeData),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        currentLikeBox.setAttribute("data-exists", "no");
        const likeCountElement = currentLikeBox.querySelector(".like-count");
        let likeCount = parseInt(likeCountElement.innerHTML, 10);
        likeCount--;
        likeCountElement.innerHTML = likeCount;
        currentLikeBox.setAttribute("data-like", "");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Initialize the events
  events();
}

export default likeFunction;
