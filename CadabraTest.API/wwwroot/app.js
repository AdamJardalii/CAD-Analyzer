const API_URL = "http://localhost:5000/api";

function saveToken(token) {
    localStorage.setItem("jwtToken", token);
}

function getToken() {
    return localStorage.getItem("jwtToken");
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if(res.ok){
        const data = await res.json();
        saveToken(data.token);
        window.location.href = "index.html";
    } else {
        alert("Login failed");
    }
});

document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    if(res.ok){
        alert("Signup successful! Login now.");
        window.location.href = "login.html";
    } else {
        alert("Signup failed");
    }
});
async function deleteAnalysis(id){
    const token = getToken();
    await fetch(`${API_URL}/cad/analysis/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
}
async function getAnalysis(id){
    const token = getToken();
    await fetch(`${API_URL}/cad/analysis/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
}

document.getElementById("createBtn")?.addEventListener("click", async () => {
    const token = getToken();
    const file = document.getElementById("fileInput").files[0];
    if(!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/cad/analyze`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    });

    if(res.ok){
        alert("Analysis submitted!");
        fetchAnalyses();
    } else {
        alert("Failed to submit analysis");
    }
});

if(window.location.pathname.includes("index.html")){
    fetchAnalyses();
}

async function fetchAnalyses() {
    const token = getToken();
    if (!token) { 
        window.location.href = "login.html"; 
        return; 
    }

    const res = await fetch(`${API_URL}/cad/all`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        const data = await res.json();
        const container = document.getElementById("analysesList");
        container.innerHTML = ""; 

        data.items.forEach(item => {
            const card = document.createElement("div");
            card.className = "analysis-card";

            card.innerHTML = `
                <h2>${item.partMetadata?.partName || "Unnamed Part"}</h2>
                <p><strong>Status:</strong> ${item.status}</p>
                <p><strong>File:</strong> ${item.partMetadata?.fileName || "N/A"}</p>
                <p><strong>Created:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
                <p><strong>Completed:</strong> ${item.completedAt ? new Date(item.completedAt).toLocaleString() : "Pending"}</p>
            `;

            if (item.partMetadata?.dimensions) {
                const dim = item.partMetadata.dimensions;
                const dimDiv = document.createElement("div");
                dimDiv.className = "section";
                dimDiv.innerHTML = `
                    <h3>Dimensions</h3>
                    <p>Length: ${dim.length} ${dim.units}</p>
                    <p>Width: ${dim.width} ${dim.units}</p>
                    <p>Height: ${dim.height} ${dim.units}</p>
                `;
                card.appendChild(dimDiv);
            }

            if (item.partMetadata?.customProperties) {
                const propsDiv = document.createElement("div");
                propsDiv.className = "section custom-properties";
                propsDiv.innerHTML = "<h3>Custom Properties</h3>";
                Object.entries(item.partMetadata.customProperties).forEach(([key, value]) => {
                    const prop = document.createElement("div");
                    prop.innerHTML = `<strong>${key}:</strong> ${value}`;
                    propsDiv.appendChild(prop);
                });
                card.appendChild(propsDiv);
            }

            if (item.aiAnalysis) {
                const aiDiv = document.createElement("div");
                aiDiv.className = "section";
                aiDiv.innerHTML = `
                    <h3>AI Analysis</h3>
                    <p><strong>Summary:</strong> ${item.aiAnalysis.summary}</p>
                    <p><strong>Insights:</strong></p>
                    <ul>${item.aiAnalysis.insights.map(i => `<li>${i}</li>`).join('')}</ul>
                    <p><strong>Recommendations:</strong></p>
                    <ul>${item.aiAnalysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
                `;
                card.appendChild(aiDiv);
            }

            const getBtn = document.createElement("button");
            getBtn.textContent = "Open";
            getBtn.onclick = () => {
                window.location.href = `analysis.html?analysisId=${item.analysisId}`;
            };
            card.appendChild(getBtn);

            container.appendChild(getBtn);

            const delBtn = document.createElement("button");
            delBtn.textContent = "Delete";
            delBtn.onclick = async () => {
                await deleteAnalysis(item.analysisId);
                fetchAnalyses();
            };
            card.appendChild(delBtn);

            container.appendChild(card);
        });
    } else {
        window.location.href = "login.html";
    }
}
