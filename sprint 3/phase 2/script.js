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
const reposSection = document.getElementById("reposSection");
const reposList = document.getElementById("reposList");


function showLoading() {
  loadingDiv.classList.remove("hidden");
  errorDiv.classList.add("hidden");
  profileCard.classList.add("hidden");
}

function showError() {
  errorDiv.classList.remove("hidden");
  loadingDiv.classList.add("hidden");
  profileCard.classList.add("hidden");
  reposSection.classList.add("hidden");
}

function showProfile() {
  profileCard.classList.remove("hidden");
  loadingDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
}


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}


function renderRepos(repos) {
  reposList.innerHTML = "";

  if (repos.length === 0) {
    reposList.innerHTML = "<li><p>This user has no public repositories.</p></li>";
    reposSection.classList.remove("hidden");
    return;
  }

  const top5 = repos
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  top5.forEach(function (repo) {
    const li = document.createElement("li");
    li.classList.add("repo-item");

    li.innerHTML = `
      <div class="repo-left">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description || "No description provided."}</p>
      </div>
      <span class="repo-meta">Updated: ${formatDate(repo.updated_at)}</span>
    `;

    reposList.appendChild(li);
  });

  reposSection.classList.remove("hidden");
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
    const reposResponse = await fetch(data.repos_url + "?per_page=100");
    const reposData = await reposResponse.json();

    renderRepos(reposData);

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
