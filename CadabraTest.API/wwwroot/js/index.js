// const data = {
//     "count": 2,
//     "items": [
//         {
//             "id": "8aab4869-9d35-42e4-930e-772688c03990",
//             "analysisId": "e9b262b6-c6cd-416d-b8d9-1687351e409d",
//             "status": "completed",
//             "userId": "019abd77-0b6e-7a98-9a2a-1f27fc9992f8",
//             "partMetadata": {
//                 "fileName": "mock_part_data.json",
//                 "partName": "Bracket_Assembly_Main",
//                 "dimensions": {
//                     "length": 125.5,
//                     "width": 75.2,
//                     "height": 45,
//                     "units": "mm"
//                 },
//                 "material": "6061-T6 Aluminum",
//                 "mass": 0.285,
//                 "volume": 0.0001056,
//                 "customProperties": {
//                     "Notes": "Standard bracket for assembly mounting",
//                     "LeadTime": "2 weeks",
//                     "Revision": "B",
//                     "PartNumber": "BRK-001-MAIN",
//                     "CostEstimate": "12.5",
//                     "Manufacturer": "Internal",
//                     "MaterialGrade": "6061-T6"
//                 }
//             },
//             "aiAnalysis": {
//                 "id": "00000000-0000-0000-0000-000000000000",
//                 "summary": "Basic rule-based analysis completed.",
//                 "insights": [
//                     "This part is relatively large. Consider material strength.",
//                     "Mass is within normal range."
//                 ],
//                 "recommendations": [
//                     "Aluminum is lightweight; check for load requirements."
//                 ]
//             },
//             "createdAt": "2025-11-26T12:08:55.076804Z",
//             "completedAt": "2025-11-26T12:08:55.022589Z"
//         },
//         {
//             "id": "19586672-4136-413f-8ee6-d005675958ad",
//             "analysisId": "3f430a37-b946-4d09-972f-ff0f8d07006b",
//             "status": "completed",
//             "userId": "019abd77-0b6e-7a98-9a2a-1f27fc9992f8",
//             "partMetadata": {
//                 "fileName": "mock_part_data.json",
//                 "partName": "Bracket_Assembly_Main",
//                 "dimensions": {
//                     "length": 125.5,
//                     "width": 75.2,
//                     "height": 45,
//                     "units": "mm"
//                 },
//                 "material": "6061-T6 Aluminum",
//                 "mass": 0.285,
//                 "volume": 0.0001056,
//                 "customProperties": {
//                     "Notes": "Standard bracket for assembly mounting",
//                     "LeadTime": "2 weeks",
//                     "Revision": "B",
//                     "PartNumber": "BRK-001-MAIN",
//                     "CostEstimate": "12.5",
//                     "Manufacturer": "Internal",
//                     "MaterialGrade": "6061-T6"
//                 }
//             },
//             "aiAnalysis": {
//                 "id": "00000000-0000-0000-0000-000000000000",
//                 "summary": "Basic rule-based analysis completed.",
//                 "insights": [
//                     "This part is relatively large. Consider material strength.",
//                     "Mass is within normal range."
//                 ],
//                 "recommendations": [
//                     "Aluminum is lightweight; check for load requirements."
//                 ]
//             },
//             "createdAt": "2025-11-26T12:10:15.021254Z",
//             "completedAt": "2025-11-26T12:10:15.009617Z"
//         }
//     ]
// };

const data = {
    count:0,
    items:[]
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
    const { id, status, partMetadata, aiAnalysis, createdAt, completedAt } = item;
    const { partName, dimensions, material, mass, volume, customProperties } = partMetadata;

    return `
        <div class="card" data-id="${id}">
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
                <button class="btn btn-open" onclick="openAnalysis('${id}')">
                    <i class="fas fa-external-link-alt"></i> Open Analysis
                </button>
                <button class="btn btn-delete" onclick="deleteCard('${id}')">
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
    const item = data.items.find(item => item.id === id);
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
                    <button class="btn-delete-detail" onclick="deleteFromDetail('${id}')">
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
                        <div class="id-display">${id}</div>
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
        const index = data.items.findIndex(item => item.id === id);
        if (index > -1) {
            data.items.splice(index, 1);
            data.count = data.items.length;
            backToDashboard();
            renderCards();
        }
    }
}

function deleteCard(id) {
    if (confirm('Are you sure you want to delete this analysis?')) {
        const index = data.items.findIndex(item => item.id === id);
        if (index > -1) {
            data.items.splice(index, 1);
            data.count = data.items.length;
            renderCards();
        }
    }
}

renderCards();