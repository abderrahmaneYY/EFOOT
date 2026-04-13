// CONFIGURATION - Replace with your live Railway App URL
const API_URL = "https://postgres-production-6178.up.railway.app/matches";

/**
 * CORE DATA LOADING
 * Fetches data from Railway and triggers the UI update
 */
async function loadMatches() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const matches = await response.json();
        
        // Update all UI components with the new data
        renderStats(matches);
        renderMatches(matches);
    } catch (error) {
        console.error("Database Error:", error);
        showToast("Error loading history from database.");
    }
}

/**
 * SAVE NEW MATCH
 * Sends score to Railway and refreshes the list
 */
async function saveMatch() {
    const kv = parseInt(document.getElementById('inp-k').value) || 0;
    const av = parseInt(document.getElementById('inp-a').value) || 0;
    const today = new Date().toISOString().split('T')[0];

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ k: kv, a: av, date: today })
        });

        if (response.ok) {
            // Reset inputs for next match
            document.getElementById('inp-k').value = 0;
            document.getElementById('inp-a').value = 0;
            
            // Reload data to show the new match in history
            await loadMatches();
            showToast(`Match Saved: Khaled ${kv} – ${av} Amine`);
        }
    } catch (error) {
        showToast("Failed to save match.");
    }
}

/**
 * CALCULATE STATISTICS
 * Logic to process the raw match data for the dashboard
 */
function calcStats(matches) {
    let kw = 0, aw = 0, dr = 0, kg = 0, ag = 0;
    matches.forEach(m => {
        if (m.k > m.a) kw++;
        else if (m.a > m.k) aw++;
        else dr++;
        kg += m.k;
        ag += m.a;
    });
    const t = matches.length;
    const kwr = t ? Math.round((kw / t) * 100) : 0;
    const awr = t ? Math.round((aw / t) * 100) : 0;
    return { kw, aw, dr, kg, ag, t, kwr, awr };
}

/**
 * UI RENDERING - STATS DASHBOARD
 */
function renderStats(matches) {
    const s = calcStats(matches);
    
    // Update Win Counters
    document.getElementById('k-wins').textContent = s.kw;
    document.getElementById('a-wins').textContent = s.aw;
    document.getElementById('draws-num').textContent = s.dr;
    document.getElementById('matches-count').textContent = `${s.t} matches`;

    // Update Win Rate Percentages and Bars
    document.getElementById('k-wr').textContent = `${s.kwr}%`;
    document.getElementById('a-wr').textContent = `${s.awr}%`;
    document.getElementById('k-bar').style.width = `${s.kwr}%`;
    document.getElementById('a-bar').style.width = `${s.awr}%`;

    // Update Goal Totals
    document.getElementById('k-goals').textContent = s.kg;
    document.getElementById('a-goals').textContent = s.ag;
}

/**
 * UI RENDERING - MATCH HISTORY
 */
function renderMatches(matches) {
    const list = document.getElementById('match-list');
    if (!matches.length) {
        list.innerHTML = '<div class="empty-state">No matches found in database.</div>';
        return;
    }

    // Sort matches by ID descending (newest at top)
    const sorted = [...matches].sort((a, b) => b.id - a.id);
    
    list.innerHTML = sorted.map(m => {
        const win = m.k > m.a ? 'k' : m.a > m.k ? 'a' : 'draw';
        const pillCls = win === 'k' ? 'k-win' : win === 'a' ? 'a-win' : 'draw-pill';
        const kCls = win === 'k' ? 'winner' : '';
        const aCls = win === 'a' ? 'winner' : '';
        
        return `
            <div class="match-item">
                <div class="match-num">#${m.id}</div>
                <div class="match-players">
                    <span class="mp ${kCls}">Khaled</span>
                    <div class="score-pill ${pillCls}">${m.k} – ${m.a}</div>
                    <span class="mp ${aCls}">Amine</span>
                </div>
                <div class="match-date">${fmt(m.date)}</div>
            </div>`;
    }).join('');
}

/**
 * UTILS
 */
function fmt(d) {
    const dateObj = new Date(d);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// Launch the app on load
window.onload = loadMatches;