const API_URL = "postgresql://postgres:itiydtwEjGvJHhymwNtLWsVJjNjDIiip@postgres.railway.internal:5432/railway";

async function loadMatches() {
  const res = await fetch(API_URL);
  const matches = await res.json();
  renderStats(matches);
  renderMatches(matches);
}

async function saveMatch() {
  const kv = parseInt(document.getElementById('inp-k').value) || 0;
  const av = parseInt(document.getElementById('inp-a').value) || 0;
  const today = new Date().toISOString().split('T')[0];

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ k: kv, a: av, date: today })
  });

  loadMatches();
  // Reset inputs
  document.getElementById('inp-k').value = 0;
  document.getElementById('inp-a').value = 0;
}