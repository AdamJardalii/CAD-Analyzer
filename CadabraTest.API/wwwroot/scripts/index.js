let data = {
    count:0,
    items:[]
};

async function fetchData(){
    const result = await API.fetchAll();
    data = result.data;
    renderCards();
}
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function createCard(item) {
    const { analysisId, status, partMetadata, aiAnalysis, createdAt, completedAt } = item;
    const { partName, dimensions, material, mass, volume, customProperties } = partMetadata;

    return `
        <div class="card" data-id="${analysisId}">
            <div class="card-header">
                <div class="card-title">
                    <h2><i class="fas fa-cube"></i> ${partName}</h2>
                    <div class="status-badge ${status}">
                        <i class="fas fa-check-circle"></i> ${status.toUpperCase()}
                    </div>
                </div>
                <div class="card-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(createdAt)}</span>
                    <span><i class="fas fa-file"></i> ${partMetadata.fileName}</span>
                </div>
            </div>

            <div class="card-body">
                <div class="section">
                    <div class="section-title">
                        <i class="fas fa-info-circle"></i> Summary
                    </div>
                    <div class="summary-box">
                        ${aiAnalysis.summary}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <i class="fas fa-ruler-combined"></i> Specifications
                    </div>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <div class="spec-label">Dimensions</div>
                            <div class="spec-value">${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.units}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">Material</div>
                            <div class="spec-value">${material}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">Mass</div>
                            <div class="spec-value">${mass} kg</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">Volume</div>
                            <div class="spec-value">${volume} m³</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <i class="fas fa-tags"></i> Properties
                    </div>
                    <div class="properties-list">
                        ${Object.entries(customProperties).map(([key, value]) => `
                            <div class="property-item">
                                <span class="property-label">${key}:</span>
                                <span class="property-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">
                        <i class="fas fa-lightbulb"></i> AI Insights
                    </div>
                    <ul class="insights-list">
                        ${aiAnalysis.insights.map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>

                <div class="section">
                    <div class="section-title">
                        <i class="fas fa-check-circle"></i> Recommendations
                    </div>
                    <ul class="recommendations-list">
                        ${aiAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="card-actions">
                <button class="btn btn-open" onclick="openAnalysis('${analysisId}')">
                    <i class="fas fa-external-link-alt"></i> Open Analysis
                </button>
                <button class="btn btn-delete" onclick="deleteCard('${analysisId}')">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        </div>
    `;
}

function renderCards() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = data.items.map(item => createCard(item)).join('');
    document.getElementById('totalCount').textContent = data.count;
}

function openAnalysis(id) {
    const item = data.items.find(item => item.analysisId === id);
    if (!item) return;

    const { status, partMetadata, aiAnalysis, createdAt, completedAt, analysisId } = item;
    const { partName, dimensions, material, mass, volume, fileName, customProperties } = partMetadata;

    const detailHTML = `
        <button class="back-button" onclick="backToDashboard()">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
        </button>

        <div class="detail-header">
            <div class="detail-title-section">
                <div>
                    <h1><i class="fas fa-cube"></i> ${partName}</h1>
                    <div class="card-meta">
                        <span><i class="far fa-calendar"></i> Created: ${formatDate(createdAt)}</span>
                        <span><i class="fas fa-check-circle"></i> Completed: ${formatDate(completedAt)}</span>
                    </div>
                </div>
                <div class="detail-actions">
                    <button class="btn-delete-detail" onclick="deleteFromDetail('${analysisId}')">
                        <i class="fas fa-trash-alt"></i> Delete Analysis
                    </button>
                </div>
            </div>
        </div>

        <div class="detail-content">
            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="fas fa-fingerprint"></i> Identifiers
                </div>
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-label">Analysis ID</div>
                        <div class="id-display">${analysisId}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Part ID</div>
                        <div class="id-display">${analysisId}</div>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <div class="spec-item">
                        <div class="spec-label">File Name</div>
                        <div class="spec-value">${fileName}</div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="fas fa-info-circle"></i> AI Analysis Summary
                </div>
                <div class="summary-box" style="font-size: 16px; padding: 20px;">
                    ${aiAnalysis.summary}
                </div>
            </div>

            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="fas fa-ruler-combined"></i> Technical Specifications
                </div>
                <div class="specs-grid">
                    <div class="spec-item">
                        <div class="spec-label">Dimensions (L × W × H)</div>
                        <div class="spec-value">${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${dimensions.units}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Material</div>
                        <div class="spec-value">${material}</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Mass</div>
                        <div class="spec-value">${mass} kg</div>
                    </div>
                    <div class="spec-item">
                        <div class="spec-label">Volume</div>
                        <div class="spec-value">${volume} m³</div>
                    </div>
                </div>
            </div>

            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="fas fa-tags"></i> Custom Properties
                </div>
                <div class="properties-list">
                    ${Object.entries(customProperties).map(([key, value]) => `
                        <div class="property-item">
                            <span class="property-label">${key}:</span>
                            <span class="property-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="fas fa-lightbulb"></i> AI Insights
                </div>
                <ul class="insights-list">
                    ${aiAnalysis.insights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>

            <div class="detail-section">
                <div class="detail-section-title">
                    <i class="fas fa-check-circle"></i> Recommendations
                </div>
                <ul class="recommendations-list">
                    ${aiAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    document.getElementById('detailView').innerHTML = detailHTML;
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('detailView').classList.add('active');
    window.scrollTo(0, 0);
}

function backToDashboard() {
    document.getElementById('dashboardView').classList.remove('hidden');
    document.getElementById('detailView').classList.remove('active');
    window.scrollTo(0, 0);
}

function deleteFromDetail(id) {
    if (confirm('Are you sure you want to delete this analysis? You will be returned to the dashboard.')) {
        const index = data.items.findIndex(item => item.analysisId === id);
        if (index > -1) {
            data.items.splice(index, 1);
            data.count = data.items.length;
            backToDashboard();
            renderCards();
        }
    }
}

async function deleteCard(id) {
    if (confirm('Are you sure you want to delete this analysis?')) {
        const response = await API.deleteAnalysis(id);
        if (!response.success) {
            alert("Failed to delete item from server: " + response.error);
            return;
        }
        const index = data.items.findIndex(item => item.analysisId === id);
        if (index > -1) {
            data.items.splice(index, 1);
            data.count = data.items.length;
            renderCards();
        }
    }
}
let selectedFile = null;

function handleLogout() {
    Storage.removeToken();
    window.location.href = "login.html";
}

function removeFile() {
    selectedFile = null;
    document.getElementById('fileInput').value = '';
}

const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragging');

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
        selectedFile = file;
        const result = await API.uploadAnalysis(file, selectedAnalysisType);

        if (result.success) {
            alert("Analysis submitted!");
            await fetchData();
        } else {
            alert("Upload failed: " + result.error);
        }
    } else {
        alert('Please drop a valid JSON file');
    }

    removeFile();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragging');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragging');
});


let selectedAnalysisType = 'standard';

function selectAnalysisType(type) {
    selectedAnalysisType = type;
    
    document.querySelectorAll('.analysis-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    if (type === 'standard') {
        document.querySelector('.analysis-option.standard').classList.add('selected');
    } else {
        document.querySelector('.analysis-option.ai').classList.add('selected');
    }
    
    console.log('Selected analysis type:', selectedAnalysisType);
}
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        selectedFile = file;
        const result = await API.uploadAnalysis(file,selectedAnalysisType);

        if (result.success) {
            showToast("Analysis submitted successfully!", "success");
            await fetchData();
        } else {
                showToast("Upload failed: " + result.error, "error");
        }
    } else {
            showToast('Please select a valid JSON file', "error");
    }
    removeFile();
}

function showToast(message, type = "success") {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        container.removeChild(toast);
    }, 3000);
}


fetchData();
renderCards();