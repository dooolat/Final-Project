const API = "https://final-project-wamq.onrender.com/api";

/* ======================
   LOGIN
====================== */
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
      window.location.href = "index.html";
    })
    .catch(() => showError("Server error"));
}

/* ======================
   REGISTER
====================== */
function register() {
  clearErrors();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !email || !password) {
    showError("All fields are required");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    return;
  }

  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then(res => res.json())
    .then(data => {
      if (!data.token) {
        showError(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      window.location.href = "index.html";
    })
    .catch(() => showError("Server error"));
}

/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

/* ======================
   FEED
====================== */
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
        const authorName =
          photo.owner && typeof photo.owner === "object"
            ? photo.owner.username
            : "Unknown";

        const authorId =
          photo.owner && typeof photo.owner === "object"
            ? photo.owner._id
            : "";

        const stars = [1,2,3,4,5]
          .map(v =>
            `<span class="star" onclick="ratePhoto('${photo._id}', ${v})">⭐</span>`
          )
          .join("");

        const card = document.createElement("div");
        card.className = "photo-card";

        card.innerHTML = `
          <img src="${photo.imageUrl}" />
          <h3>${photo.title}</h3>
          <p>by <a href="portfolio.html?user=${authorId}">${authorName}</a></p>
          <div class="rating">
            ${stars}
            <span class="avg">(${photo.avgRating})</span>
          </div>
        `;

        feed.appendChild(card);
      });
    })
    .catch(() => {
      feed.innerHTML = "<p>Failed to load feed</p>";
    });
}

/* ======================
   PORTFOLIO
====================== */

async function deletePhoto(photoId) {
  const confirmDelete = confirm("Are you sure you want to delete this photo?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API}/photos/${photoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    loadMyPortfolio();
  } catch {
    alert("Delete failed");
  }
}



function loadMyPortfolio() {
  loadPortfolio(localStorage.getItem("userId"), true);
}

function loadUserPortfolio(userId) {
  loadPortfolio(userId, false);
}

function loadPortfolio(userId, isOwner) {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

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
          <img src="${photo.imageUrl}" />
          <h3>${photo.title}</h3>
          <p>⭐ ${photo.avgRating}</p>
          ${isOwner ? `<button onclick="deletePhoto('${photo._id}')">Delete</button>` : ""}
        `;

        gallery.appendChild(card);
      });
    })
    .catch(() => {
      gallery.innerHTML = "<p>Failed to load portfolio</p>";
    });
}

function protectMyPortfolio() {
  const link = document.getElementById("my-portfolio");
  if (!link) return;

  link.addEventListener("click", (e) => {
    const token = localStorage.getItem("token");

    if (!token) {
      e.preventDefault();
      alert("Please login to access your portfolio");
    }
  });
}

/* ======================
   UPLOAD
====================== */
function uploadPhoto() {
  const title = document.getElementById("photo-title").value.trim();
  const imageUrl = document.getElementById("photo-url").value.trim();
  const error = document.getElementById("upload-error");

  if (!title || !imageUrl) {
    error.innerText = "Title and image URL are required";
    return;
  }

  fetch(`${API}/photos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title,
      imageUrl,
    }),
  })
    .then(() => loadMyPortfolio())
    .catch(() => (error.innerText = "Upload failed"));
}


/* ======================
   RATING
====================== */
function ratePhoto(photoId, value) {
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");

  fetch(`${API}/photos/${photoId}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ value }),
  }).then(() => loadFeed());
}

/* ======================
   COMMENTS (простая версия)
====================== */
function addComment(photoId) {
  const text = prompt("Enter comment");
  if (!text) return;

  fetch(`${API}/photos/${photoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text }),
  }).then(() => loadFeed());
}

/* ======================
   HELPERS
====================== */
function showError(msg) {
  const el = document.getElementById("error");
  if (el) el.innerText = msg;
}

function clearErrors() {
  const el = document.getElementById("error");
  if (el) el.innerText = "";
}

/* ======================
   INIT
====================== */
document.addEventListener("DOMContentLoaded", () => {

  updateAuthButton();
  updateDeleteButton();
  updateMyPortfolioLink();
  protectMyPortfolio();
  
function updateDeleteButton() {
  const btn = document.getElementById("delete-account-btn");
  if (!btn) return;

  if (localStorage.getItem("token")) {
    btn.style.display = "inline-block";
    btn.onclick = deleteAccount;
  } else {
    btn.style.display = "none";
  }
}

  // FEED
  if (document.getElementById("feed")) {
    loadFeed();
  }

  // PORTFOLIO
  if (document.getElementById("gallery")) {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");

    if (user) {
      loadUserPortfolio(user);
    } else {
      loadMyPortfolio();
    }
  }
});


// Update auth button
function updateAuthButton() {
  const btn = document.getElementById("auth-btn");
  if (!btn) return;

  const token = localStorage.getItem("token");

  if (token) {
    btn.innerText = "Logout";
    btn.onclick = logout;
  } else {
    btn.innerText = "Sign in";
    btn.onclick = () => {
      window.location.href = "login.html";
    };
  }
}

function updateMyPortfolioLink() {
  const link = document.getElementById("my-portfolio");
  if (!link) return;

  if (!localStorage.getItem("token")) {
    link.style.display = "none";
  }
}

// Delete account
async function deleteAccount() {
  const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API}/users/profile`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    localStorage.clear();
    window.location.href = "login.html";
  } catch {
    alert("Delete failed");
  }
}
