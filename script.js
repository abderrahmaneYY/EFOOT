// Replace this with your Railway URL once deployed
const RAILWAY_API = "https://your-project.up.railway.app/matches";

async function loadMatches() {
    // For now, it pulls from the local data you already have
    // When Railway is ready, change this to: const res = await fetch(RAILWAY_API);
    renderStats();
    renderMatches();
}

function renderStats() {
    const statsContainer = document.getElementById('stats-summary');
    // Logic to calculate wins/goals from your previous data
    statsContainer.innerHTML = `
        <div class="stat-box">KHALED WINS: 13</div>
        <div class="stat-box">AMINE WINS: 11</div>
    `;
}

async function saveMatch() {
    const kScore = document.getElementById('inp-k').value;
    const aScore = document.getElementById('inp-a').value;

    console.log(`Saving: Khaled ${kScore} - Amine ${aScore}`);
    
    // API POST Logic goes here
    alert("Match Data Sent to Database!");
}

window.onload = loadMatches;