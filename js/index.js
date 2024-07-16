document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const userResults = document.getElementById('user-results');
    const repoResults = document.getElementById('repo-results');
    const toggleSearchBtn = document.getElementById('toggle-search');
    const GITHUB_API_URL = 'https://api.github.com';
    let searchType = 'users'; 
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = document.getElementById('search-input').value;
      if (searchType === 'users') {
        searchUsers(query);
      } else {
        searchRepos(query);
      }
    });
  
    toggleSearchBtn.addEventListener('click', () => {
      if (searchType === 'users') {
        searchType = 'repos';
        toggleSearchBtn.textContent = 'Search Users';
        document.getElementById('search-input').placeholder = 'Search for repositories';
      } else {
        searchType = 'users';
        toggleSearchBtn.textContent = 'Search Repositories';
        document.getElementById('search-input').placeholder = 'Search for users';
      }
    });
  
    function searchUsers(query) {
      fetch(`${GITHUB_API_URL}/search/users?q=${query}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(data => displayUsers(data.items))
      .catch(error => console.error('Error:', error));
    }
  
    function searchRepos(query) {
      fetch(`${GITHUB_API_URL}/search/repositories?q=${query}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(data => displayRepos(data.items))
      .catch(error => console.error('Error:', error));
    }
  
    function displayUsers(users) {
      userResults.innerHTML = '';
      repoResults.innerHTML = '';
      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" width="100">
          <h3>${user.login}</h3>
          <a href="${user.html_url}" target="_blank">View Profile</a>
          <button data-username="${user.login}">View Repositories</button>
        `;
        userResults.appendChild(userCard);
  
        userCard.querySelector('button').addEventListener('click', () => {
          fetchUserRepos(user.login);
        });
      });
    }
  
    function displayRepos(repos) {
      userResults.innerHTML = '';
      repoResults.innerHTML = '';
      repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        repoCard.innerHTML = `
          <h3>${repo.name}</h3>
          <p>${repo.description ? repo.description : 'No description available'}</p>
          <a href="${repo.html_url}" target="_blank">View Repository</a>
        `;
        repoResults.appendChild(repoCard);
      });
    }
  
    function fetchUserRepos(username) {
      fetch(`${GITHUB_API_URL}/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      .then(response => response.json())
      .then(repos => displayRepos(repos))
      .catch(error => console.error('Error:', error));
    }
  });
  