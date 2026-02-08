const API = "http://localhost:5000/api";

// LOGIN
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showError("Email and password are required");
    return;
  }

  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (!data.token) {
        showError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);

      // redirect to feed
      window.location.href = "index.html";
    })
    .catch(() => {
      showError("Server error. Try again later.");
    });
}

// REGISTER
function register() {
  clearErrors();

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username) {
    showError("Username is required");
    usernameInput.classList.add("error-input");
    return;
  }

  if (!email) {
    showError("Email is required");
    emailInput.classList.add("error-input");
    return;
  }

  if (!password) {
    showError("Password is required");
    passwordInput.classList.add("error-input");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    passwordInput.classList.add("error-input");
    return;
  }

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (!data.token) {
        showError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);

      // redirect to feed
      window.location.href = "index.html";
    })
    .catch(() => {
      showError("Server is not responding");
    });
}


// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// FEED
function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "<p>Loading...</p>";

  fetch(`${API}/photos`)
    .then(res => res.json())
    .then(photos => {
      feed.innerHTML = "";

      if (!Array.isArray(photos) || photos.length === 0) {
        feed.innerHTML = "<p>No photos yet</p>";
        return;
      }

      photos.forEach(photo => {
        const isOwnerObject =
          photo.owner && typeof photo.owner === "object";

        const authorName = isOwnerObject
          ? photo.owner.username
          : "Unknown";

        const authorId = isOwnerObject
          ? photo.owner._id
          : null;

        const card = document.createElement("div");
        card.className = "photo-card";

        // ⭐⭐⭐⭐⭐ (без кнопок)
        const stars = [1, 2, 3, 4, 5]
          .map(() => "⭐")
          .join("");

        card.innerHTML = `
          <img src="http://localhost:5000${photo.imageUrl}" />
          <h3>${photo.title}</h3>

          ${
            authorId
              ? `<p class="author">
                   by <a href="portfolio.html?user=${authorId}">
                     ${authorName}
                   </a>
                 </p>`
              : `<p class="author">by ${authorName}</p>`
          }

          <div class="rating">
            ${stars}
            <span class="avg">(${photo.avgRating})</span>
          </div>
        `;

        feed.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      feed.innerHTML = "<p>Failed to load feed</p>";
    });
}


// HELPERS
function loadMyPortfolio() {
  loadPortfolio(localStorage.getItem("userId"), true);
}

function loadUserPortfolio(userId) {
  loadPortfolio(userId, false);
}

// =======================
// MAIN FUNCTION
// =======================
function loadPortfolio(userId, isOwner) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // если не владелец — скрываем upload
  if (!isOwner) {
    document.querySelector(".upload-box")?.remove();
  }

  fetch(`${API}/users/${userId}/photos`)
    .then(res => res.json())
    .then(photos => {
      gallery.innerHTML = "";

      if (!photos.length) {
        gallery.innerHTML = "<p>No photos yet</p>";
        return;
      }

      photos.forEach(photo => {
        const card = document.createElement("div");
        card.className = "photo-card";

        card.innerHTML = `
          <img src="http://localhost:5000${photo.imageUrl}" />
          <h3>${photo.title}</h3>
          <p>⭐ ${photo.avgRating}</p>
        `;

        gallery.appendChild(card);
      });
    })
    .catch(() => {
      gallery.innerHTML = "<p>Failed to load portfolio</p>";
    });
}

// HELPERS2
function showError(message) {
  const error = document.getElementById("error");
  if (error) error.innerText = message;
}

function clearErrors() {
  const error = document.getElementById("error");
  if (error) error.innerText = "";

  document
    .querySelectorAll(".error-input")
    .forEach(el => el.classList.remove("error-input"));
}

// uploadPhoto
function uploadPhoto() {
  const titleInput = document.getElementById("photo-title");
  const fileInput = document.getElementById("photo-file");
  const error = document.getElementById("upload-error");

  error.innerText = "";
  titleInput.classList.remove("error-input");
  fileInput.classList.remove("error-input");

  const title = titleInput.value.trim();
  const file = fileInput.files[0];

  if (!title) {
    error.innerText = "Title is required";
    titleInput.classList.add("error-input");
    return;
  }

  if (!file) {
    error.innerText = "Image file is required";
    fileInput.classList.add("error-input");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", file);

  fetch(`${API}/photos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        error.innerText = data.message;
        return;
      }

      titleInput.value = "";
      fileInput.value = "";

      loadPortfolio();
    })
    .catch(() => {
      error.innerText = "Upload failed";
    });
}

// rating
function ratePhoto(photoId, value) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to rate photos");
    return;
  }

  fetch(`${API}/photos/${photoId}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Rating failed");
      }
      return res.json();
    })
    .then(() => {
      loadFeed();
    })
    .catch(err => {
      console.error(err);
      alert("Failed to rate photo");
    });
}

function addComment(photoId, text) {
  if (!text.trim()) return;

  fetch(`${API}/photos/${photoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text }),
  })
    .then(() => loadFeed());
}

document.addEventListener("DOMContentLoaded", () => {
  // FEED
  if (document.getElementById("feed")) {
    loadFeed();
  }

  // PORTFOLIO
  if (document.getElementById("gallery")) {
    const params = new URLSearchParams(window.location.search);
    const userFromUrl = params.get("user");

    if (userFromUrl) {
      loadUserPortfolio(userFromUrl);
    } else {
      loadMyPortfolio();
    }
  }
});

//consoleLog
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM READY");

  const feed = document.getElementById("feed");
  if (feed) {
    console.log("FEED PAGE");
    loadFeed();
  }

  const gallery = document.getElementById("gallery");
  if (gallery) {
    console.log("PORTFOLIO PAGE");

    const params = new URLSearchParams(window.location.search);
    const userFromUrl = params.get("user");

    if (userFromUrl) {
      loadUserPortfolio(userFromUrl);
    } else {
      loadMyPortfolio();
    }
  }
});