const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const profileCard = document.getElementById("profileCard");

const avatarImg = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const bioEl = document.getElementById("bio");
const joinDateEl = document.getElementById("joinDate");
const repoCountEl = document.getElementById("repoCount");
const portfolioLink = document.getElementById("portfolioLink");


function showLoading() {
  loadingDiv.classList.remove("hidden");
  errorDiv.classList.add("hidden");
  profileCard.classList.add("hidden");
}

function showError() {
  errorDiv.classList.remove("hidden");
  loadingDiv.classList.add("hidden");
  profileCard.classList.add("hidden");
}

function showProfile() {
  profileCard.classList.remove("hidden");
  loadingDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
}


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


async function searchUser() {
  const username = searchInput.value.trim();

  
  if (!username) {
    alert("Please type a username first!");
    return;
  }

  
  showLoading();

  try {    
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error("User not found");
    }
  
    const data = await response.json();    
    avatarImg.src = data.avatar_url;
    avatarImg.alt = `${data.login}'s avatar`;

    nameEl.textContent = data.name || data.login;
    bioEl.textContent = data.bio || "This user has no bio.";
    joinDateEl.textContent = "Joined: " + formatDate(data.created_at);
    repoCountEl.textContent = "📦 Repositories: " + data.public_repos;

    if (data.blog) {
      portfolioLink.href = data.blog;
      portfolioLink.textContent = "🔗 Visit Portfolio";
      portfolioLink.classList.remove("hidden");
    } else {
      portfolioLink.classList.add("hidden");
    }    
    showProfile();
  } catch (error) {
    
    showError();
  }
}

searchBtn.addEventListener("click", searchUser);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchUser();
  }
});
