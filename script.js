async function loadStarred() {
  const container = document.getElementById('starred-list');
  if (!container) return;
  container.textContent = '';
  const loading = document.createElement('p');
  loading.textContent = 'Loading starred repositories…';
  container.appendChild(loading);

  // 10s timeout for fetch
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('events.json', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid data format');
    renderList(container, data);
  } catch (err) {
    container.textContent = '';
    const errP = document.createElement('p');
    errP.textContent = 'Error loading data: ' + (err && err.message ? err.message : String(err));
    container.appendChild(errP);

    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Retry';
    retry.addEventListener('click', () => loadStarred());
    container.appendChild(retry);
  }
}

function renderList(container, items) {
  container.textContent = '';
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
    a.setAttribute('aria-label', repo.name || 'Repository');
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
      const d = new Date(item.starred_at);
      if (!isNaN(d)) time.textContent = d.toLocaleString();
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
