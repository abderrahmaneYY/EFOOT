// Connection initialized first to avoid ReferenceError
const connectionString = 'sqlitecloud://cxfpqgd2dz.g2.sqlite.cloud:8860/auth.sqlitecloud?apikey=iyb5YB2dOtdJnbtb4BaxPkRjBkyPa36zoGIVaUgDrpw';
const db = new sqlitecloud.Database(connectionString);

async function init() {
    try {
        const matches = await db.sql`SELECT * FROM matches ORDER BY id DESC`;
        renderStats(matches);
        renderMatches(matches);
    } catch (err) {
        console.error("Initialization failed:", err);
    }
}

async function saveMatch() {
    const kScore = parseInt(document.getElementById('inp-k').value) || 0;
    const aScore = parseInt(document.getElementById('inp-a').value) || 0;

    try {
        // Insert match into cloud table
        await db.sql`INSERT INTO matches (k, a) VALUES (${kScore}, ${aScore})`;
        
        // Reset inputs
        document.getElementById('inp-k').value = 0;
        document.getElementById('inp-a').value = 0;
        
        showToast("Synced to Cloud");
        await init(); 
    } catch (err) {
        console.error("Save failed:", err);
        alert("SQL Error: Check if table 'matches' exists.");
    }
}

async function deleteMatch(id) {
    if(!confirm("Delete this match?")) return;
    try {
        await db.sql`DELETE FROM matches WHERE id = ${id}`;
        await init();
    } catch (err) {
        console.error("Delete failed:", err);
    }
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
            <span style="color:var(--text3); font-size:12px;">#${m.id}</span>
            <div class="score-pill">${m.k} - ${m.a}</div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:var(--text3); font-size:10px;">${m.date || 'Today'}</span>
                <button class="del-btn" onclick="deleteMatch(${m.id})">🗑</button>
            </div>
        </div>
    `).join('');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = "toast show";
    setTimeout(() => { t.className = "toast"; }, 2500);
}

// Start app
init();