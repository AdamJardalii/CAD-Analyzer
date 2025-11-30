// ?analysisId=xxxxx
const urlParams = new URLSearchParams(window.location.search);
const analysisId = urlParams.get("analysisId");
const API_URL = "http://localhost:5000/api"; // change to your API

if (!analysisId) {
    alert("Missing analysisId");
}

async function loadAnalysis() {
    try {
        const response = await fetch(`${API_URL}/cad/analysis/${analysisId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            document.getElementById("title").innerText = "Not Found";
            return;
        }

        const data = await response.json();
        console.log(data);

        document.getElementById("title").innerText = data.title;
        document.getElementById("description").innerText = data.description;
        document.getElementById("status").innerText = data.status;
        document.getElementById("createdAt").innerText = new Date(data.createdAt).toLocaleString();

    } catch (error) {
        console.error(error);
    }
}

function getToken() {
    return localStorage.getItem("jwtToken");
}
loadAnalysis();
