/* -------------------------------------------------------------
 * RT Funds — Rajarata Technology 22/23
 * Core Application Engine & Reactive State Controller
 * ------------------------------------------------------------- */

// Global App State
let state = {
    students: [],
    events: [],
    transactions: [],
    currentUser: null, // Stores { email: '', role: 'Treasurer' | 'President' } if authenticated
    dashboardEventId: null
};
// Store uploaded PDF template bytes
state.pdfTemplateBytes = null;

// Constant Predefined Roles & Verified University Domains
const AUTHORIZED_ADMINS = [
    { email: 'treasurer@tec.rjt.ac.lk', password: 'rtfunds2223', role: 'Treasurer', name: 'Charith (Treasurer)' },
    { email: 'itt2023097@tec.rjt.ac.lk', password: '200309700301.', role: '', name: 'Rasika' }
];
const UNIVERSITY_DOMAIN = '@tec.rjt.ac.lk';

// Intentionally empty at startup so the site opens without sample data.
const MOCK_STUDENTS = [];
const MOCK_EVENTS = [];
const MOCK_TRANSACTIONS = [];

// Global Target Budget (Rs. 1,000,000)
const GLOBAL_BUDGET_TARGET = 1000000;

// Pagination Variables
let currentStudentsPage = 1;
const studentsPerPage = 8;
let filteredStudentsList = [];

/* -------------------------------------------------------------
 * INITIALIZATION & STORAGE
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    initEventListeners();
    renderApp();
    
    // Check if there's a cached admin session
    const cachedUser = localStorage.getItem('rt_user_session');
    if (cachedUser) {
        state.currentUser = JSON.parse(cachedUser);
        toggleAdminInterface(true);
        showToast(`Welcome back, ${state.currentUser.name}!`, 'success');
    } else {
        toggleAdminInterface(false);
    }

    document.getElementById('campusGate').classList.add('gate-hidden');
});

function initDatabase() {
    state.students = [...MOCK_STUDENTS];
    state.events = [...MOCK_EVENTS];
    state.transactions = [...MOCK_TRANSACTIONS];
    saveToLocalStorage();
    filteredStudentsList = [...state.students];
}

function saveToLocalStorage() {
    localStorage.setItem('rt_students', JSON.stringify(state.students));
    localStorage.setItem('rt_events', JSON.stringify(state.events));
    localStorage.setItem('rt_transactions', JSON.stringify(state.transactions));
}

/* -------------------------------------------------------------
 * EVENT LISTENERS SETUP
 * ------------------------------------------------------------- */
function initEventListeners() {
    // Sidebar toggle (Responsive Hamburger)
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // SPA Routing (Tab Switching)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.getAttribute('data-view');
            switchView(viewName);
            // Auto-close sidebar on mobile
            document.getElementById('sidebar').classList.remove('open');
        });
    });

    // Link triggers
    document.getElementById('linkToEvents').addEventListener('click', (e) => {
        e.preventDefault();
        switchView('events');
    });
    document.getElementById('linkToTransactions').addEventListener('click', (e) => {
        e.preventDefault();
        switchView('transactions');
    });

    document.getElementById('dashboardEventSelect').addEventListener('change', (e) => {
        state.dashboardEventId = e.target.value;
        renderDashboardStats();
        renderDashboardRecentTransactions();
    });

    // Modal Control: Generic Closer
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Modal overlays closer when clicking outside content
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });

    // Trigger Admin Login Modal
    document.getElementById('btnLoginLogout').addEventListener('click', () => {
        if (state.currentUser) {
            // Log Out
            state.currentUser = null;
            localStorage.removeItem('rt_user_session');
            toggleAdminInterface(false);
            showToast('Logged out successfully.', 'info');
        } else {
            // Open Login
            openModal('modalLogin');
        }
    });

    // Handle Login Form Submission
    document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Trigger Student Status Modal
    document.getElementById('btnStudentPortal').addEventListener('click', () => {
        document.getElementById('studentQueryResult').classList.add('hidden');
        document.getElementById('studentQueryEmpty').classList.remove('hidden');
        document.getElementById('studentSearchIndex').value = '';
        openModal('modalStudentPortal');
    });

    // Handle Student Index Query
    document.getElementById('btnQueryStudentStatus').addEventListener('click', queryStudentStatus);
    document.getElementById('studentSearchIndex').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') queryStudentStatus();
    });

    // Request Receipt Action
    document.getElementById('btnRequestReceipt').addEventListener('click', () => {
        showToast('Receipt PDF compilation initiated... Download will start shortly.', 'success');
        closeAllModals();
    });

    // Trigger Add Payment Modal
    document.getElementById('btnQuickAddPayment').addEventListener('click', () => {
        populateSelectors();
        openModal('modalAddPayment');
    });
    document.getElementById('btnCreateTransaction').addEventListener('click', () => {
        populateSelectors();
        openModal('modalAddPayment');
    });

    // Record Payment Form Submit
    document.getElementById('paymentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddPayment();
    });

    // Trigger New Event Modal
    document.getElementById('btnAddNewEvent').addEventListener('click', () => {
        openModal('modalNewEvent');
    });

    // Create Event Form Submit
    document.getElementById('eventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleNewEvent();
    });

    // Exports Triggers
    document.getElementById('btnExportStudents').addEventListener('click', () => openModal('modalExport'));
    document.getElementById('btnExportTransactions').addEventListener('click', () => openModal('modalExport'));
    document.getElementById('btnExportPDFAction').addEventListener('click', () => triggerExport('PDF'));
    document.getElementById('btnExportCSVAction').addEventListener('click', () => triggerExport('CSV'));

    // CSV File Upload Listener
    document.getElementById('csvFileInput').addEventListener('change', handleCSVUpload);

    // Template CSV import (fetch from workspace file)
    const importBtn = document.getElementById('btnImportTemplate');
    if (importBtn) {
        importBtn.addEventListener('click', importTemplateCSV);
    }

    // PDF template upload controls
    const pdfUploadBtn = document.getElementById('btnUploadPdfTemplate');
    const pdfInput = document.getElementById('pdfTemplateInput');
    const studentsForPdf = document.getElementById('studentsForPdf');
    const btnFillPdfSingle = document.getElementById('btnFillPdfSingle');
    const btnFillPdfBatch = document.getElementById('btnFillPdfBatch');

    if (pdfUploadBtn && pdfInput) {
        pdfUploadBtn.addEventListener('click', () => pdfInput.click());
        pdfInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                state.pdfTemplateBytes = evt.target.result;
                showToast('PDF template uploaded.', 'success');
            };
            reader.readAsArrayBuffer(file);
            e.target.value = '';
        });
    }

    if (studentsForPdf) {
        studentsForPdf.addEventListener('change', () => {});
    }

    if (btnFillPdfSingle) {
        btnFillPdfSingle.addEventListener('click', async () => {
            if (!state.pdfTemplateBytes) return showToast('Upload a PDF template first.', 'warning');
            populateStudentsForPdf();
            const sel = document.getElementById('studentsForPdf');
            const index = sel && sel.value;
            if (!index) return showToast('Select a student first.', 'warning');
            const student = state.students.find(s => s.IndexNumber === index);
            if (!student) return showToast('Student not found.', 'error');
            await fillPdfForStudent(student);
        });
    }

    if (btnFillPdfBatch) {
        btnFillPdfBatch.addEventListener('click', async () => {
            if (!state.pdfTemplateBytes) return showToast('Upload a PDF template first.', 'warning');
            if (!state.students || state.students.length === 0) return showToast('No students to export.', 'warning');
            for (const student of state.students) {
                // small delay to avoid blocking UI
                // eslint-disable-next-line no-await-in-loop
                await fillPdfForStudent(student);
                await new Promise(r => setTimeout(r, 200));
            }
            showToast('Batch PDF generation completed.', 'success');
        });
    }

    // Student Filter Actions
    document.getElementById('searchStudentInput').addEventListener('input', applyStudentFilters);
    document.getElementById('filterDeptSelect').addEventListener('change', applyStudentFilters);
    document.getElementById('filterStatusSelect').addEventListener('change', applyStudentFilters);

    // Pagination Click Actions
    document.getElementById('btnPrevPage').addEventListener('click', () => {
        if (currentStudentsPage > 1) {
            currentStudentsPage--;
            renderStudentsTable();
        }
    });
    document.getElementById('btnNextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredStudentsList.length / studentsPerPage);
        if (currentStudentsPage < totalPages) {
            currentStudentsPage++;
            renderStudentsTable();
        }
    });

    // Transactions Search & Filters
    document.getElementById('searchTransactionInput').addEventListener('input', renderTransactionsTable);
    document.getElementById('filterPaymentMethod').addEventListener('change', renderTransactionsTable);

    // Campus Gate Verification Listeners
    document.getElementById('btnVerifyGate').addEventListener('click', verifyCampusGate);
    document.getElementById('gateStudentIndex').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyCampusGate();
    });
    document.getElementById('btnAdminAccessLink').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('modalLogin');
    });
}

/* -------------------------------------------------------------
 * SPA ROUTER
 * ------------------------------------------------------------- */
function switchView(viewName) {
    // 1. Update Navigation classes
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 2. Hide all view panels
    const views = document.querySelectorAll('.view-panel');
    views.forEach(view => {
        view.classList.add('hidden');
    });

    // 3. Show target view panel
    const targetView = document.getElementById(`view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // 4. Update Header Title
    document.getElementById('currentViewTitle').innerText = viewName.charAt(0).toUpperCase() + viewName.slice(1);

    // 5. Re-render specific chart triggers on report page opening
    if (viewName === 'reports') {
        setTimeout(renderReportCharts, 100);
    }
}

/* -------------------------------------------------------------
 * RENDER CONTROLLERS
 * ------------------------------------------------------------- */
function renderApp() {
    populateDashboardEventSelector();
    renderDashboardStats();
    renderDashboardEventProgress();
    renderDashboardRecentTransactions();
    renderEventsGrid();
    
    // Set student filter defaults & render
    applyStudentFilters();
    renderTransactionsTable();
}

// 1. DASHBOARD PORTLET
function populateDashboardEventSelector() {
    const eventSelect = document.getElementById('dashboardEventSelect');
    if (!eventSelect) return;

    eventSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.innerText = 'Select an event';
    eventSelect.appendChild(placeholderOption);

    if (state.events.length === 0) {
        eventSelect.disabled = true;
        state.dashboardEventId = null;
        return;
    }

    eventSelect.disabled = false;

    state.events.forEach(event => {
        const opt = document.createElement('option');
        opt.value = event.id;
        opt.innerText = event.title;
        eventSelect.appendChild(opt);
    });

    if (!state.dashboardEventId || !state.events.some(event => event.id === state.dashboardEventId)) {
        state.dashboardEventId = state.events[0].id;
    }

    eventSelect.value = state.dashboardEventId;
}

function getSelectedDashboardEvent() {
    return state.events.find(event => event.id === state.dashboardEventId) || state.events[0] || null;
}

function renderDashboardStats() {
    const selectedEvent = getSelectedDashboardEvent();
    const totalCollected = selectedEvent ? selectedEvent.collected : 0;
    const targetAmount = selectedEvent ? selectedEvent.target : 0;
    const collectionPercent = targetAmount > 0 ? Math.min(100, Math.round((totalCollected / targetAmount) * 100)) : 0;

    document.getElementById('statTotalFunds').innerText = `Rs. ${totalCollected.toLocaleString()}`;
    document.getElementById('legendCollectedVal').innerText = `Rs. ${totalCollected.toLocaleString()}`;

    const targetDeficit = Math.max(0, targetAmount - totalCollected);
    document.getElementById('statPendingDues').innerText = `Rs. ${targetDeficit.toLocaleString()}`;
    document.getElementById('legendPendingVal').innerText = `Rs. ${targetDeficit.toLocaleString()}`;

    document.getElementById('dashboardProgressPercent').innerText = `${collectionPercent}%`;
    document.getElementById('statTotalTarget').innerText = selectedEvent
        ? `Target: Rs. ${targetAmount.toLocaleString()} • ${selectedEvent.title}`
        : 'Target: Rs. 0';
    const selectedEventLabel = document.getElementById('dashboardSelectedEventLabel');
    if (selectedEventLabel) {
        selectedEventLabel.innerText = selectedEvent
            ? selectedEvent.title
            : 'Select an event to view its payment totals';
    }

    // SVGCircle progress ring dash offset calibration
    // Radius is 90, Circumference = 2 * PI * R = ~565.48
    const strokeDashOffset = 565.48 - (collectionPercent / 100) * 565.48;
    document.getElementById('dashboardProgressRing').style.strokeDashoffset = strokeDashOffset;

    // Student counts
    const totalStudents = state.students.length;
    document.getElementById('statTotalStudents').innerText = totalStudents;

    const contributingCount = state.students.filter(s => s.AmountPaid > 0).length;
    const contributorRatio = totalStudents > 0 ? Math.round((contributingCount / totalStudents) * 100) : 0;
    document.getElementById('statPaidPercent').innerText = `${contributorRatio}% Contributor Ratio`;

    const paidFullyCount = state.students.filter(s => s.Status === 'Paid').length;
    document.getElementById('statPaidCount').innerText = `${paidFullyCount} Students Paid Fully`;

    // Active Events
    const activeEventsCount = state.events.filter(e => e.active).length;
    document.getElementById('statActiveEvents').innerText = activeEventsCount;
    document.getElementById('statCompletedEvents').innerText = `${state.events.filter(e => !e.active).length} Completed Events`;
}

function renderDashboardEventProgress() {
    const listContainer = document.getElementById('dashboardEventProgress');
    listContainer.innerHTML = '';

    if (state.events.length === 0) {
        listContainer.innerHTML = '<p class="text-sm text-muted">No active events configured.</p>';
        return;
    }

    state.events.forEach(event => {
        const pct = Math.round((event.collected / event.target) * 100);
        
        const eventEl = document.createElement('div');
        eventEl.className = 'event-progress-item';
        eventEl.innerHTML = `
            <div class="event-progress-details">
                <span class="event-progress-name">${event.title}</span>
                <span class="event-progress-pct" style="color: ${event.color}">${pct}%</span>
            </div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${event.color}; box-shadow: 0 0 8px ${event.color}40;"></div>
            </div>
        `;
        listContainer.appendChild(eventEl);
    });
}

function renderDashboardRecentTransactions() {
    const tbody = document.getElementById('dashboardRecentTransactions');
    tbody.innerHTML = '';

    const selectedEvent = getSelectedDashboardEvent();
    const eventTransactions = selectedEvent
        ? state.transactions.filter(txn => txn.eventName === selectedEvent.title)
        : state.transactions;

    // Take top 5 transactions sorted descending
    const recent = [...eventTransactions].reverse().slice(0, 5);

    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-muted text-center">No transactions recorded yet.</td></tr>';
        return;
    }

    recent.forEach(txn => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${txn.date}</td>
            <td class="font-bold text-white">${txn.studentName}</td>
            <td>${txn.studentIndex}</td>
            <td>${txn.eventName}</td>
            <td><span class="badge badge-accent">${txn.method}</span></td>
            <td class="font-bold text-emerald">Rs. ${txn.amount.toLocaleString()}</td>
            <td><span class="badge badge-paid">${txn.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// 2. EVENTS DASHBOARD GRID
function renderEventsGrid() {
    const container = document.getElementById('eventsGridContainer');
    container.innerHTML = '';

    if (state.events.length === 0) {
        container.innerHTML = '<div class="content-card full-width text-center text-muted">No events constructed.</div>';
        return;
    }

    state.events.forEach(event => {
        const pct = Math.round((event.collected / event.target) * 100);

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-card-stripe" style="background-color: ${event.color}; box-shadow: 0 0 10px ${event.color};"></div>
            <div class="event-card-body">
                <h4 class="event-card-title">${event.title}</h4>
                <div class="event-card-meta">
                    <span>Deadline: ${event.deadline}</span>
                    <span class="badge badge-accent" style="color: ${event.color}; border-color: ${event.color}60;">${event.active ? 'Active' : 'Archived'}</span>
                </div>
                <div class="event-card-progress">
                    <div class="event-progress-details margin-bottom-sm">
                        <span class="text-xs text-muted">Progress Rate</span>
                        <span class="font-bold text-sm" style="color: ${event.color}">${pct}%</span>
                    </div>
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${event.color};"></div>
                    </div>
                </div>
                <div class="event-card-grid-metrics">
                    <div>
                        <span class="event-metric-lbl">Target Target</span>
                        <div class="event-metric-val">Rs. ${event.target.toLocaleString()}</div>
                    </div>
                    <div>
                        <span class="event-metric-lbl">Amount Collected</span>
                        <div class="event-metric-val text-emerald">Rs. ${event.collected.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. STUDENT REGISTRY CONTROLLER
function applyStudentFilters() {
    const query = document.getElementById('searchStudentInput').value.toLowerCase().trim();
    const dept = document.getElementById('filterDeptSelect').value;
    const status = document.getElementById('filterStatusSelect').value;

    filteredStudentsList = state.students.filter(student => {
        // Query text matches index number or student name
        const matchQuery = student.FullName.toLowerCase().includes(query) || student.IndexNumber.toLowerCase().includes(query);
        // Department filter match
        const matchDept = (dept === 'All') || (student.Department === dept);
        // Payment status match
        const matchStatus = (status === 'All') || (student.Status === status);

        return matchQuery && matchDept && matchStatus;
    });

    currentStudentsPage = 1; // Reset to page 1 on filter
    renderStudentsTable();
}

function renderStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    const totalStudents = filteredStudentsList.length;
    const totalPages = Math.ceil(totalStudents / studentsPerPage) || 1;

    // Boundary correction
    if (currentStudentsPage > totalPages) currentStudentsPage = totalPages;

    const startIdx = (currentStudentsPage - 1) * studentsPerPage;
    const endIdx = Math.min(startIdx + studentsPerPage, totalStudents);

    // Update paging indicators
    document.getElementById('paginationInfo').innerText = totalStudents > 0 
        ? `Showing ${startIdx + 1} to ${endIdx} of ${totalStudents} students`
        : `Showing 0 to 0 of 0 students`;
    
    document.getElementById('pageIndicator').innerText = `Page ${currentStudentsPage} of ${totalPages}`;
    document.getElementById('btnPrevPage').disabled = (currentStudentsPage === 1);
    document.getElementById('btnNextPage').disabled = (currentStudentsPage === totalPages);

    if (totalStudents === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-muted text-center">No student records match selected filters.</td></tr>';
        return;
    }

    const pageStudents = filteredStudentsList.slice(startIdx, endIdx);

    pageStudents.forEach(student => {
        const tr = document.createElement('tr');
        
        let statusBadgeClass = 'badge-unpaid';
        if (student.Status === 'Paid') statusBadgeClass = 'badge-paid';
        else if (student.Status === 'Partially Paid') statusBadgeClass = 'badge-pending';

        // Set action columns for authenticated admins
        const adminActionCol = state.currentUser 
            ? `<td class="admin-only"><button class="btn btn-glass btn-arrow" onclick="quickAddPaymentForStudent('${student.IndexNumber}')" title="Record Payment">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
               </button></td>` 
            : '';

        tr.innerHTML = `
            <td class="font-bold text-cyan">${student.IndexNumber}</td>
            <td class="font-bold text-white">${student.FullName}</td>
            <td>${student.Department}</td>
            <td class="text-emerald font-bold">Rs. ${student.AmountPaid.toLocaleString()}</td>
            <td class="text-muted">Rs. ${student.AmountOwed.toLocaleString()}</td>
            <td><span class="badge ${statusBadgeClass}">${student.Status}</span></td>
            ${adminActionCol}
        `;
        tbody.appendChild(tr);
    });
}

// 4. TRANSACTIONS LEDGER LEDGER
function renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';

    const query = document.getElementById('searchTransactionInput').value.toLowerCase().trim();
    const method = document.getElementById('filterPaymentMethod').value;

    const filteredTxns = state.transactions.filter(txn => {
        const matchQuery = txn.studentName.toLowerCase().includes(query) || 
                           txn.studentIndex.toLowerCase().includes(query) ||
                           txn.eventName.toLowerCase().includes(query) ||
                           txn.id.toLowerCase().includes(query);
        const matchMethod = (method === 'All') || (txn.method === method);
        return matchQuery && matchMethod;
    });

    if (filteredTxns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-muted text-center">No transaction matching terms discovered.</td></tr>';
        return;
    }

    // Display sorted descending by date
    [...filteredTxns].reverse().forEach(txn => {
        const tr = document.createElement('tr');
        
        const adminDeleteAction = state.currentUser
            ? `<td class="admin-only"><button class="btn btn-glass text-rose border-glow-rose" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="voidTransaction('${txn.id}')">Void</button></td>`
            : '';

        tr.innerHTML = `
            <td class="font-bold text-cyan">${txn.id}</td>
            <td>${txn.date}</td>
            <td class="font-bold text-white">${txn.studentName}</td>
            <td>${txn.studentIndex}</td>
            <td>${txn.eventName}</td>
            <td><span class="badge badge-accent">${txn.method}</span></td>
            <td class="font-bold text-emerald">Rs. ${txn.amount.toLocaleString()}</td>
            <td><span class="badge badge-paid">${txn.status}</span></td>
            ${adminDeleteAction}
        `;
        tbody.appendChild(tr);
    });
}

// 5. REPORTS DASHBOARD CHARTS
function renderReportCharts() {
    // Generate departmental chart heights
    const depts = ['Technology', 'Computing', 'Applied Sciences', 'Management'];
    const deptTotals = {};

    depts.forEach(d => {
        deptTotals[d] = state.students
            .filter(student => student.Department === d)
            .reduce((sum, student) => sum + student.AmountPaid, 0);
    });

    const maxVal = Math.max(...Object.values(deptTotals)) || 1;
    const chartContainer = document.getElementById('deptBarChart');
    chartContainer.innerHTML = '';

    depts.forEach(d => {
        const amt = deptTotals[d];
        const heightPct = Math.max(8, Math.round((amt / maxVal) * 100)); // Maintain min height for visual aesthetics

        const barGroup = document.createElement('div');
        barGroup.className = 'chart-bar-group';
        barGroup.innerHTML = `
            <div class="chart-bar" style="height: ${heightPct}%;">
                <span class="chart-bar-value">Rs. ${amt.toLocaleString()}</span>
            </div>
            <span class="chart-bar-label" title="${d}">${d}</span>
        `;
        chartContainer.appendChild(barGroup);
    });

    // Update Report panel text stats
    let topDept = 'Technology';
    let maxCollected = 0;
    depts.forEach(d => {
        if (deptTotals[d] > maxCollected) {
            maxCollected = deptTotals[d];
            topDept = d;
        }
    });

    document.getElementById('reportTopDept').innerText = topDept;
    document.getElementById('reportTopDeptStat').innerText = `Rs. ${maxCollected.toLocaleString()} accumulated`;

    const totalCollected = state.students.reduce((sum, s) => sum + s.AmountPaid, 0);
    const totalStudents = state.students.length;
    const avgContrib = totalStudents > 0 ? Math.round(totalCollected / totalStudents) : 0;
    document.getElementById('reportAvgContribution').innerText = `Rs. ${avgContrib.toLocaleString()}`;

    const totalDeficit = Math.max(0, GLOBAL_BUDGET_TARGET - totalCollected);
    document.getElementById('reportTotalDeficit').innerText = `Rs. ${totalDeficit.toLocaleString()}`;

    // Event contribution breakdown table
    const tableBody = document.getElementById('reportEventBreakdown');
    tableBody.innerHTML = '';

    if (state.events.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No events configured.</td></tr>';
        return;
    }

    state.events.forEach(event => {
        const rate = Math.round((event.collected / event.target) * 100);
        
        // Dynamic event payment contributors share
        const contributorsCount = state.transactions.filter(t => t.eventName === event.title).length;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="font-bold text-white">${event.title}</td>
            <td>Rs. ${event.target.toLocaleString()}</td>
            <td class="text-emerald font-bold">Rs. ${event.collected.toLocaleString()}</td>
            <td>
                <span class="badge" style="background: rgba(0, 242, 254, 0.08); color: ${event.color}; border: 1px solid ${event.color}30;">
                    ${rate}% Complete
                </span>
            </td>
            <td class="text-muted">${contributorsCount} contributors</td>
        `;
        tableBody.appendChild(tr);
    });
}

/* -------------------------------------------------------------
 * ACTIONS & OPERATIONS HANDLERS
 * ------------------------------------------------------------- */

// AUTHENTICATION CONTROLLER
function handleLogin() {
    const email = document.getElementById('loginEmail').value.toLowerCase().trim();
    const password = document.getElementById('loginPassword').value;
    const errorAlert = document.getElementById('loginErrorAlert');
    const errorText = document.getElementById('loginErrorText');

    errorAlert.classList.add('hidden');

    // 1. Strict email domain restriction validator
    if (!email.endsWith(UNIVERSITY_DOMAIN)) {
        errorText.innerText = `Access denied! Only official ${UNIVERSITY_DOMAIN} emails are allowed.`;
        errorAlert.classList.remove('hidden');
        showToast('Invalid email domain.', 'error');
        return;
    }

    // 2. Validate email and password matches
    const verifiedAdmin = AUTHORIZED_ADMINS.find(admin => admin.email === email && admin.password === password);

    if (verifiedAdmin) {
        // Authenticated
        state.currentUser = {
            email: verifiedAdmin.email,
            role: verifiedAdmin.role,
            name: verifiedAdmin.name
        };
        localStorage.setItem('rt_user_session', JSON.stringify(state.currentUser));
        
        toggleAdminInterface(true);
        document.getElementById('campusGate').classList.add('gate-hidden');
        
        closeAllModals();
        showToast(`Authenticated successfully as ${verifiedAdmin.role}!`, 'success');
        
        // Reset login form fields
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        errorText.innerText = 'Invalid email address or access password credentials.';
        errorAlert.classList.remove('hidden');
        showToast('Authentication failed.', 'error');
    }
}

function toggleAdminInterface(isUnlocked) {
    const adminElements = document.querySelectorAll('.admin-only');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const loginBtnText = document.getElementById('loginBtnText');
    const btnLoginLogout = document.getElementById('btnLoginLogout');
    const profileCard = document.querySelector('.user-profile-card');

    if (isUnlocked && state.currentUser) {
        // Show all administrative elements
        adminElements.forEach(el => el.classList.remove('hidden'));
        
        // Update user footer card details
        profileAvatar.innerText = state.currentUser.role === 'Treasurer' ? 'S' : 'R';
        profileName.innerText = state.currentUser.role === 'Treasurer' ? 'Salinda' : 'Rasika';
        profileRole.innerText = `${state.currentUser.role} (Admin)`;
        profileCard.classList.add('admin-active');
        
        // Modify Header button
        loginBtnText.innerText = 'Log Out';
        btnLoginLogout.classList.add('admin-active');
    } else {
        // Hide all administrative elements
        adminElements.forEach(el => el.classList.add('hidden'));
        
        // Reset user footer card details to default guest
        profileAvatar.innerText = 'G';
        profileName.innerText = 'Public Guest';
        profileRole.innerText = 'Read Only';
        profileCard.classList.remove('admin-active');
        
        // Modify Header button
        loginBtnText.innerText = 'Sign in to Edit';
        btnLoginLogout.classList.remove('admin-active');
    }

    // Force lists to re-draw so column actions render
    renderStudentsTable();
    renderTransactionsTable();
}

// CAMPUS GATE VERIFICATION ENGINE
function verifyCampusGate() {
    const rawInput = document.getElementById('gateStudentIndex').value.trim();
    const errorAlert = document.getElementById('gateErrorAlert');
    const errorText = document.getElementById('gateErrorText');

    errorAlert.classList.add('hidden');

    if (!rawInput) {
        errorText.innerText = "Please enter your Campus Index Number or University Email!";
        errorAlert.classList.remove('hidden');
        showToast('Access field is empty.', 'warning');
        return;
    }

    const isEmail = rawInput.includes('@');
    let matchedStudent = null;

    if (isEmail) {
        const emailLower = rawInput.toLowerCase();
        // Only allow official university email domain
        if (!emailLower.endsWith('@tec.rjt.ac.lk')) {
            errorText.innerText = `Only official @tec.rjt.ac.lk emails are permitted. Got: "${rawInput}"`;
            errorAlert.classList.remove('hidden');
            showToast('Invalid email domain.', 'error');
            return;
        }
        // Derive index number from email prefix (e.g., tec2223001@tec.rjt.ac.lk → TEC2223001)
        const emailPrefix = emailLower.split('@')[0].toUpperCase();
        matchedStudent = state.students.find(s => s.IndexNumber.toUpperCase() === emailPrefix);
    } else {
        // Direct index number lookup
        const rawIndex = rawInput.toUpperCase();
        matchedStudent = state.students.find(s => s.IndexNumber.toUpperCase() === rawIndex);
    }

    if (matchedStudent) {
        // Verified! Save in sessionStorage
        sessionStorage.setItem('rt_campus_verified', 'true');
        sessionStorage.setItem('rt_verified_index', matchedStudent.IndexNumber);

        // Hide gate overlay with animation
        document.getElementById('campusGate').classList.add('gate-hidden');

        showToast(`Access Granted. Welcome, ${matchedStudent.FullName}!`, 'success');

        // Pre-fill student search with their index
        document.getElementById('searchStudentInput').value = matchedStudent.IndexNumber;
        applyStudentFilters();
    } else {
        errorText.innerText = isEmail
            ? `No student found for email "${rawInput}". Please verify your email with the batch treasurer.`
            : `Invalid Index Number "${rawInput.toUpperCase()}"! Please verify your ID with the batch treasurer.`;
        errorAlert.classList.remove('hidden');
        showToast('Verification failed. Unrecognized credentials.', 'error');
    }
}

// PUBLIC INDEX INQUIRY CONTROLLER
function queryStudentStatus() {
    const rawIndex = document.getElementById('studentSearchIndex').value.toUpperCase().trim();
    const resultCard = document.getElementById('studentQueryResult');
    const emptyResult = document.getElementById('studentQueryEmpty');

    if (!rawIndex) {
        showToast('Please specify a valid Student Index Number.', 'warning');
        return;
    }

    const student = state.students.find(s => s.IndexNumber.toUpperCase() === rawIndex);

    if (student) {
        emptyResult.classList.add('hidden');
        resultCard.classList.remove('hidden');

        document.getElementById('qStudentName').innerText = student.FullName;
        document.getElementById('qStudentIndexDept').innerText = `${student.IndexNumber} • Department of ${student.Department}`;
        
        // Status Badge styling
        const badge = document.getElementById('qStudentStatusBadge');
        badge.innerText = student.Status;
        badge.className = 'badge'; // clear previous
        if (student.Status === 'Paid') badge.classList.add('badge-paid');
        else if (student.Status === 'Partially Paid') badge.classList.add('badge-pending');
        else badge.classList.add('badge-unpaid');

        document.getElementById('qStudentPaid').innerText = `Rs. ${student.AmountPaid.toLocaleString()}`;
        document.getElementById('qStudentOwed').innerText = `Rs. ${student.AmountOwed.toLocaleString()}`;

        // Personal Timelines
        const timeline = document.getElementById('qStudentTimeline');
        timeline.innerHTML = '';

        const payments = state.transactions.filter(t => t.studentIndex === student.IndexNumber);

        if (payments.length === 0) {
            timeline.innerHTML = '<span class="text-xs text-muted">No transaction ledger recorded for this index.</span>';
        } else {
            payments.forEach(pay => {
                const row = document.createElement('div');
                row.className = 'timeline-row';
                row.innerHTML = `
                    <span>${pay.date} — <b>${pay.eventName}</b></span>
                    <span class="text-emerald font-bold">Rs. ${pay.amount.toLocaleString()}</span>
                `;
                timeline.appendChild(row);
            });
        }
        showToast('Index details retrieved successfully.', 'success');
    } else {
        resultCard.classList.add('hidden');
        emptyResult.classList.remove('hidden');
        emptyResult.innerHTML = `
            <svg viewBox="0 0 24 24" class="empty-icon text-rose" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p class="text-sm text-rose font-bold">No record found matching Index Number "${rawIndex}".</p>
        `;
        showToast('No record matched that index.', 'error');
    }
}

// QUICK LINK ADMIN ASSISTANCE
window.quickAddPaymentForStudent = function(indexNumber) {
    populateSelectors();
    document.getElementById('paymentStudentSelect').value = indexNumber;
    openModal('modalAddPayment');
};

// POPULATE DROPDOWNS SELECTORS
function populateSelectors() {
    const studentSelect = document.getElementById('paymentStudentSelect');
    const eventSelect = document.getElementById('paymentEventSelect');

    studentSelect.innerHTML = '';
    eventSelect.innerHTML = '';

    // Load registered students sorted alphabetically
    const sortedStudents = [...state.students].sort((a,b) => a.FullName.localeCompare(b.FullName));
    sortedStudents.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.IndexNumber;
        opt.innerText = `${s.FullName} (${s.IndexNumber})`;
        studentSelect.appendChild(opt);
    });

    // Load active milestones events
    state.events.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.innerText = e.title;
        eventSelect.appendChild(opt);
    });
}

// RECORD TRANSACTION ACTION
function handleAddPayment() {
    const index = document.getElementById('paymentStudentSelect').value;
    const eventId = document.getElementById('paymentEventSelect').value;
    const amt = parseFloat(document.getElementById('paymentAmount').value);
    const method = document.getElementById('paymentMethodSelect').value;

    if (!index || !eventId || isNaN(amt) || amt <= 0) {
        showToast('Please specify valid transaction details.', 'warning');
        return;
    }

    const student = state.students.find(s => s.IndexNumber === index);
    const event = state.events.find(e => e.id === eventId);

    if (!student || !event) {
        showToast('Record validation failure. Student/Event lost.', 'error');
        return;
    }

    // 1. Generate Audit Transaction Record
    const txnId = `TXN${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const newTxn = {
        id: txnId,
        date: formattedDate,
        studentName: student.FullName,
        studentIndex: student.IndexNumber,
        eventName: event.title,
        method: method,
        amount: amt,
        status: 'Approved'
    };

    // 2. Push to Ledger
    state.transactions.push(newTxn);

    // 3. Increment Student Collections
    student.AmountPaid += amt;
    student.AmountOwed = Math.max(0, student.AmountOwed - amt);
    
    // Status update: if amount paid >= total owed then fully Paid
    if (student.AmountPaid >= (student.AmountPaid + student.AmountOwed)) {
        student.Status = 'Paid';
        student.AmountOwed = 0;
    } else if (student.AmountPaid > 0) {
        student.Status = 'Partially Paid';
    } else {
        student.Status = 'Unpaid';
    }

    // 4. Increment Event Collections
    event.collected += amt;

    // 5. Commit to LocalStorage
    saveToLocalStorage();

    // 6. Refresh visuals
    renderApp();
    closeAllModals();

    // Reset inputs
    document.getElementById('paymentAmount').value = '';

    showToast(`Payment of Rs. ${amt.toLocaleString()} recorded successfully for ${student.FullName}!`, 'success');
}

// PUBLISH NEW EVENT ACCOMPLISHMENT
function handleNewEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const target = parseFloat(document.getElementById('eventTarget').value);
    const deadline = document.getElementById('eventDeadline').value;
    const accentColor = document.getElementById('eventColorSelect').value;

    if (!title || isNaN(target) || target <= 0 || !deadline) {
        showToast('Please fulfill all event configurations correctly.', 'warning');
        return;
    }

    const newEvent = {
        id: `ev${state.events.length + 1}`,
        title: title,
        target: target,
        collected: 0,
        deadline: deadline,
        color: accentColor,
        active: true
    };

    state.events.push(newEvent);
    saveToLocalStorage();

    state.dashboardEventId = newEvent.id;

    renderApp();
    closeAllModals();

    // Reset fields
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventTarget').value = '';
    document.getElementById('eventDeadline').value = '';

    showToast(`New Milestone "${title}" published successfully!`, 'success');
}

// VOID / DELETE TRANSACTION (ADMIN HELP)
window.voidTransaction = function(txnId) {
    if (!state.currentUser) return;

    if (confirm(`Are you absolutely sure you want to void transaction ${txnId}? All associated student/event balances will be reverted.`)) {
        const txnIndex = state.transactions.findIndex(t => t.id === txnId);
        if (txnIndex === -1) return;

        const txn = state.transactions[txnIndex];

        // 1. Revert student totals
        const student = state.students.find(s => s.IndexNumber === txn.studentIndex);
        if (student) {
            student.AmountPaid = Math.max(0, student.AmountPaid - txn.amount);
            student.AmountOwed += txn.amount;
            
            if (student.AmountPaid === 0) {
                student.Status = 'Unpaid';
            } else {
                student.Status = 'Partially Paid';
            }
        }

        // 2. Revert event collections
        const event = state.events.find(e => e.title === txn.eventName);
        if (event) {
            event.collected = Math.max(0, event.collected - txn.amount);
        }

        // 3. Splice transaction
        state.transactions.splice(txnIndex, 1);

        saveToLocalStorage();
        renderApp();
        showToast(`Transaction ${txnId} voided successfully.`, 'info');
    }
};

// CSV DATA IMPORTER LOGIC
function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const contents = evt.target.result;
        parseCSVData(contents);
    };
    reader.readAsText(file);

    // Clear input so same file can be uploaded again
    e.target.value = '';
}

function parseCSVData(csvText) {
    const lines = csvText.split('\n');
    let addedCount = 0;
    let updatedCount = 0;

    // Expected format: IndexNumber,FullName,Department,AmountPaid,AmountOwed,Status
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',');
        if (cols.length < 3) continue; // Must contain at least Index, Name, Dept

        const indexNum = cols[0].trim().toUpperCase();
        const fullName = cols[1].trim();
        const dept = cols[2].trim();
        const paid = cols[3] ? parseFloat(cols[3].trim()) || 0 : 0;
        const owed = cols[4] ? parseFloat(cols[4].trim()) || 0 : 0;
        const status = cols[5] ? cols[5].trim() : (paid > 0 ? (owed === 0 ? 'Paid' : 'Partially Paid') : 'Unpaid');

        // Check if student index already exists
        const existingStudent = state.students.find(s => s.IndexNumber.toUpperCase() === indexNum);

        if (existingStudent) {
            // Update details
            existingStudent.FullName = fullName;
            existingStudent.Department = dept;
            existingStudent.AmountPaid = paid;
            existingStudent.AmountOwed = owed;
            existingStudent.Status = status;
            updatedCount++;
        } else {
            // Register new record
            state.students.push({
                IndexNumber: indexNum,
                FullName: fullName,
                Department: dept,
                AmountPaid: paid,
                AmountOwed: owed,
                Status: status
            });
            addedCount++;
        }
    }

    saveToLocalStorage();
    applyStudentFilters(); // re-draws grid
    renderDashboardStats();
    showToast(`CSV Process Complete: Registered ${addedCount} new records, updated ${updatedCount} profiles.`, 'success');
}

function populateStudentsForPdf() {
    const sel = document.getElementById('studentsForPdf');
    if (!sel) return;
    sel.innerHTML = '';
    if (!state.students || state.students.length === 0) {
        const opt = document.createElement('option'); opt.value = ''; opt.innerText = 'No students available'; sel.appendChild(opt); return;
    }
    state.students.forEach(s => {
        const opt = document.createElement('option'); opt.value = s.IndexNumber; opt.innerText = `${s.IndexNumber} — ${s.FullName}`; sel.appendChild(opt);
    });
}

async function fillPdfForStudent(student) {
    try {
        const uint8 = new Uint8Array(state.pdfTemplateBytes);
        const pdfDoc = await PDFLib.PDFDocument.load(uint8);
        let formExists = false;
        try {
            const form = pdfDoc.getForm();
            formExists = !!form;
            // Try to fill fields named IndexNumber, FullName, Department
            try {
                const idxField = form.getTextField('IndexNumber'); idxField.setText(student.IndexNumber);
                const nameField = form.getTextField('FullName'); nameField.setText(student.FullName);
                const deptField = form.getTextField('Department'); deptField.setText(student.Department);
            } catch (err) {
                // fields missing — fall back to drawing text
                formExists = false;
            }
        } catch (err) {
            formExists = false;
        }

        if (!formExists) {
            const pages = pdfDoc.getPages();
            const page = pages[0];
            const { height } = page.getSize();
            page.drawText(student.IndexNumber, { x: 60, y: height - 120, size: 12, color: PDFLib.rgb(0,0,0) });
            page.drawText(student.FullName, { x: 60, y: height - 140, size: 12, color: PDFLib.rgb(0,0,0) });
            page.drawText(student.Department, { x: 60, y: height - 160, size: 12, color: PDFLib.rgb(0,0,0) });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `student_${student.IndexNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (err) {
        console.error('PDF fill error', err);
        showToast('Failed to generate PDF. See console.', 'error');
    }
}

// Import the bundled data-template.csv and parse into app state
function importTemplateCSV() {
    showToast('Importing students from template...', 'info');
    fetch('data-template.csv')
        .then(resp => {
            if (!resp.ok) throw new Error('Failed to fetch template');
            return resp.text();
        })
        .then(text => {
            parseCSVData(text);
            showToast('Template import completed successfully.', 'success');
        })
        .catch(err => {
            console.error('Template import error:', err);
            showToast('Template import failed. Open console for details.', 'error');
        });
}

// EXPORT TOCSV / PDF ACTIONS SIMULATOR
function triggerExport(format) {
    showToast(`Exporting data registry in ${format} format... Compiled file ready.`, 'success');
    closeAllModals();

    if (format === 'CSV') {
        // Build a simulated download
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "IndexNumber,FullName,Department,AmountPaid,AmountOwed,Status\n";
        
        state.students.forEach(s => {
            csvContent += `"${s.IndexNumber}","${s.FullName}","${s.Department}",${s.AmountPaid},${s.AmountOwed},"${s.Status}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `RT_Funds_Students_Audit_22_23.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/* -------------------------------------------------------------
 * UI INTERACTIVE SYSTEM WINDOWS
 * ------------------------------------------------------------- */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('open');
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(m => m.classList.remove('open'));
    // Clear login warning alert
    document.getElementById('loginErrorAlert').classList.add('hidden');
}

// SLIDE-IN SYSTEM TOASTS NOTIFIER
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Icon selection
    let icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    if (type === 'success') {
        icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
        icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else if (type === 'warning') {
        icon = '<svg viewBox="0 0 24 24" class="btn-icon" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    }

    toast.innerHTML = `
        ${icon}
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Auto wipe toast after 4s
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
