// CONFIGURATION
const API_URL = "https://postgres-production-6178.up.railway.app/matches";

/**
 * CORE LOGIC
 */
async function loadMatches() {
    try {
        const response = await fetch(API_URL);
        const matches = await response.json();
        
        // Update the dashboard and history list
        renderStats(matches);
        renderMatches(matches);
    } catch (error) {
        console.error("Database Connection Error:", error);
    }
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

    // Clear inputs and reload
    document.getElementById('inp-k').value = 0;
    document.getElementById('inp-a').value = 0;
    loadMatches();
}

/**
 * UI RENDERING - STATS
 */
function renderStats(matches) {
    let kw=0, aw=0, dr=0, kg=0, ag=0;
    matches.forEach(m => { 
        if(m.k > m.a) kw++; 
        else if(m.a > m.k) aw++; 
        else dr++; 
        kg += m.k; ag += m.a; 
    });
    
    const t = matches.length;
    const kwr = t ? Math.round(kw/t*100) : 0;
    const awr = t ? Math.round(aw/t*100) : 0;

    // Update Stadium UI IDs
    document.getElementById('k-wins').textContent = kw;
    document.getElementById('a-wins').textContent = aw;
    document.getElementById('draws-num').textContent = dr;
    document.getElementById('matches-count').textContent = `${t} matches`;
    
    document.getElementById('k-wr').textContent = `${kwr}%`;
    document.getElementById('a-wr').textContent = `${awr}%`;
    document.getElementById('k-bar').style.width = `${kwr}%`;
    document.getElementById('a-bar').style.width = `${awr}%`;

    document.getElementById('k-goals').textContent = kg;
    document.getElementById('a-goals').textContent = ag;
}

/**
 * UI RENDERING - HISTORY
 */
function renderMatches(matches) {
    const list = document.getElementById('match-list');
    if(!matches.length) {
        list.innerHTML = '<div class="empty-state">Waiting for match data...</div>';
        return;
    }

    // Sort newest at the top
    const sorted = [...matches].sort((a, b) => b.id - a.id);
    
    list.innerHTML = sorted.map(m => {
        const win = m.k > m.a ? 'k' : m.a > m.k ? 'a' : 'draw';
        const pillCls = win === 'k' ? 'k-win' : win === 'a' ? 'a-win' : 'draw-pill';
        
        return `
            <div class="match-item">
                <div class="match-num">#${m.id}</div>
                <div class="match-players">
                    <span class="mp ${win === 'k' ? 'winner' : ''}">Khaled</span>
                    <div class="score-pill ${pillCls}">${m.k} – ${m.a}</div>
                    <span class="mp ${win === 'a' ? 'winner' : ''}">Amine</span>
                </div>
                <div class="match-date">${fmt(m.date)}</div>
            </div>`;
    }).join('');
}

function fmt(d) {
    const dateObj = new Date(d);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

// Start app
window.onload = loadMatches;