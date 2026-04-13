const API_URL = "https://efoot-production.up.railway.app/matches";

async function loadMatches() {
    try {
        const response = await fetch(API_URL);
        const matches = await response.json();
        
        // If matches exist, this will populate the Stadium UI
        if (matches && matches.length > 0) {
            renderStats(matches);
            renderMatches(matches);
        } else {
            document.getElementById('match-list').innerHTML = 
                '<div class="empty-state">Database is connected but empty.</div>';
        }
    } catch (e) {
        console.error("Connection Error:", e);
    }
}