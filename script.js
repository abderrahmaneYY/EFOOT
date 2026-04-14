const connectionString = 'sqlitecloud://cxfpqgd2dz.g2.sqlite.cloud:8860/auth.sqlitecloud?apikey=iyb5YyA3PInZp0B2u6fAnf779Z5mI6lPZ6kR8nL';
const db = new sqlitecloud.Database(connectionString);

async function loadMatches() {
    try {
        return await db.sql`SELECT * FROM matches ORDER BY id DESC`;
    } catch (e) {
        console.error("Load Error:", e);
        return [];
    }
}

async function saveMatch() {
    const kv = parseInt(document.getElementById('inp-k').value) || 0;
    const av = parseInt(document.getElementById('inp-a').value) || 0;

    try {
        await db.sql`INSERT INTO matches (k, a) VALUES (${kv}, ${av})`;
        showToast("Syncing with EFOOT Cloud...");
        await init();
        document.getElementById('inp-k').value = 0;
        document.getElementById('inp-a').value = 0;
    } catch (e) {
        console.error("Save Error:", e);
    }
}

async function deleteMatch(id) {
    if(!confirm("Delete match record?")) return;
    try {
        await db.sql`DELETE FROM matches WHERE id = ${id}`;
        await init();
        showToast("Match removed.");
    } catch (e) { console.error(e); }
}

function renderStats(matches) {
    let kw=0, aw=0, dr=0, kg=0, ag=0;
    matches.forEach(m => {
        if(m.k > m.a) kw++; else if(m.a > m.k) aw++; else dr++;
        kg += m.k; ag += m.a;
    });
    document.getElementById('k-wins').textContent = kw;
    document.getElementById('a-wins').textContent = aw;
    document.getElementById('total-draws').textContent = dr;
    document.getElementById('k-goals').textContent = kg;
    document.getElementById('a-goals').textContent = ag;
    document.getElementById('matches-count').textContent = matches.length + " matches";
}

function renderMatches(matches) {
    const list = document.getElementById('match-list');
    list.innerHTML = matches.map(m => `
        <div class="match-item">
            <span style="font-size:12px; color:var(--text3)">#${m.id}</span>
            <div class="score-pill">${m.k} - ${m.a}</div>
            <div style="display:flex; gap:10px; align-items:center">
                <span style="font-size:10px; color:var(--text3)">${m.date || 'Today'}</span>
                <button class="del-btn" onclick="deleteMatch(${m.id})">🗑</button>
            </div>
        </div>
    `).join('');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

async function init() {
    const data = await loadMatches();
    renderStats(data);
    renderMatches(data);
}

init();