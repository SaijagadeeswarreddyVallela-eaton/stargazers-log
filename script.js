async function loadStarred() {
  const container = document.getElementById('starred-list');
  if (!container) return;
  container.innerHTML = '<p>Loading starred repositories…</p>';
  try {
    const res = await fetch('events.json');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    renderList(container, data);
  } catch (err) {
    container.innerHTML = `<p>Error loading data: ${err.message}</p>`;
  }
}

function renderList(container, items) {
  container.innerHTML = '';
  if (!items || items.length === 0) {
    container.textContent = 'No starred repositories found.';
    return;
  }

  items.forEach(item => {
    const repo = item.repo || {};
    const article = document.createElement('article');
    article.className = 'repo';

    const h2 = document.createElement('h2');
    const a = document.createElement('a');
    a.href = repo.html_url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = repo.name || 'Unknown repository';
    h2.appendChild(a);

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = repo.description || '';

    const meta = document.createElement('p');
    meta.className = 'meta';
    const lang = document.createElement('span');
    lang.className = 'lang';
    lang.textContent = repo.language || '';

    const stars = document.createElement('span');
    stars.className = 'stars';
    stars.textContent = `★ ${repo.stargazers_count || 0}`;

    const time = document.createElement('time');
    if (item.starred_at) {
      time.dateTime = item.starred_at;
      time.textContent = new Date(item.starred_at).toLocaleString();
    }

    if (lang.textContent) meta.appendChild(lang);
    meta.appendChild(stars);
    if (time.textContent) meta.appendChild(time);

    article.appendChild(h2);
    if (desc.textContent) article.appendChild(desc);
    article.appendChild(meta);

    container.appendChild(article);
  });
}

document.addEventListener('DOMContentLoaded', loadStarred);
