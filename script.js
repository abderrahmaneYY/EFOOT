// Change 'auth.sqlitecloud' to 'efootball' in the URL below
const connectionString = 'sqlitecloud://cxfpqgd2dz.g2.sqlite.cloud:8860/efootball?apikey=iyb5YB2dOtdJnbtb4BaxPkRjBkyPa36zoGIVaUgDrpw';
const db = new sqlitecloud.Database(connectionString);

async function init() {
    try {
        // Ensure we are using the correct user database
        await db.sql`USE DATABASE efootball`; 
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
        await db.sql`USE DATABASE efootball`;
        await db.sql`INSERT INTO matches (k, a) VALUES (${kScore}, ${aScore})`;
        
        document.getElementById('inp-k').value = 0;
        document.getElementById('inp-a').value = 0;
        
        showToast("Match Recorded!");
        await init(); 
    } catch (err) {
        console.error("Save failed:", err);
        alert("Cloud Error: " + err.message);
    }
}