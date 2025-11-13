// ShiftBase Application - Main JavaScript File

// ==================== DATA STORAGE ====================
let employees = JSON.parse(localStorage.getItem('shiftbase_employees')) || [];
let shifts = JSON.parse(localStorage.getItem('shiftbase_shifts')) || [];
let absences = JSON.parse(localStorage.getItem('shiftbase_absences')) || [];
let timeEntries = JSON.parse(localStorage.getItem('shiftbase_timeEntries')) || [];
let currentEmployee = null;
let editingEmployeeId = null;
let currentWeekOffset = 0;

// ==================== UTILITY FUNCTIONS ====================
function saveData() {
    localStorage.setItem('shiftbase_employees', JSON.stringify(employees));
    localStorage.setItem('shiftbase_shifts', JSON.stringify(shifts));
    localStorage.setItem('shiftbase_absences', JSON.stringify(absences));
    localStorage.setItem('shiftbase_timeEntries', JSON.stringify(timeEntries));
}

function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(time) {
    return time ? time.substring(0, 5) : '';
}

function calculateHours(start, end) {
    if (!start || !end) return 0;
    const startTime = new Date('2000-01-01 ' + start);
    const endTime = new Date('2000-01-01 ' + end);
    const diff = (endTime - startTime) / (1000 * 60 * 60);
    return Math.max(0, diff);
}

function getCurrentWeekDates(offset = 0) {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff + (offset * 7));

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date);
    }
    return dates;
}

function getWeekRange(dates) {
    const start = dates[0];
    const end = dates[6];
    return `Semaine du ${formatDate(start)} au ${formatDate(end)}`;
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.dataset.page;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show target page
            pages.forEach(page => page.classList.add('hidden'));
            const pageElement = document.getElementById(targetPage + 'Page');
            if (pageElement) {
                pageElement.classList.remove('hidden');
                document.getElementById('pageTitle').textContent = item.querySelector('span:last-child').textContent;

                // Load page-specific data
                if (targetPage === 'dashboard') loadDashboard();
                else if (targetPage === 'employees') loadEmployees();
                else if (targetPage === 'schedule') loadSchedule();
                else if (targetPage === 'timetracking') loadTimeTracking();
                else if (targetPage === 'absences') loadAbsences();
                else if (targetPage === 'reports') loadReports();
            }
        });
    });
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    updateDashboardStats();
    loadWeekSchedulePreview();
    loadRecentActivity();
}

function updateDashboardStats() {
    const activeEmployees = employees.filter(e => e.status === 'active').length;
    document.getElementById('totalEmployees').textContent = activeEmployees;

    const today = new Date().toISOString().split('T')[0];
    const todayShifts = shifts.filter(s => s.date === today);
    document.getElementById('presentToday').textContent = todayShifts.length;

    const todayAbsences = absences.filter(a => {
        return a.startDate <= today && a.endDate >= today && a.status === 'approved';
    });
    document.getElementById('absentToday').textContent = todayAbsences.length;

    const weekDates = getCurrentWeekDates();
    const weekStart = weekDates[0].toISOString().split('T')[0];
    const weekEnd = weekDates[6].toISOString().split('T')[0];
    const weekShifts = shifts.filter(s => s.date >= weekStart && s.date <= weekEnd);
    const totalHours = weekShifts.reduce((sum, shift) => {
        return sum + calculateHours(shift.startTime, shift.endTime);
    }, 0);
    document.getElementById('totalHours').textContent = Math.round(totalHours) + 'h';
}

function loadWeekSchedulePreview() {
    const preview = document.getElementById('weekSchedulePreview');
    const weekDates = getCurrentWeekDates();
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    let html = '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-top: 16px;">';
    weekDates.forEach((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayShifts = shifts.filter(s => s.date === dateStr);

        html += `
            <div style="background: var(--bg-primary); padding: 12px; border-radius: 8px; text-align: center;">
                <div style="font-weight: 600; color: var(--text-secondary); font-size: 12px; margin-bottom: 4px;">${days[index]}</div>
                <div style="font-size: 18px; font-weight: 700; color: var(--primary-color);">${dayShifts.length}</div>
                <div style="font-size: 11px; color: var(--text-secondary);">shifts</div>
            </div>
        `;
    });
    html += '</div>';
    preview.innerHTML = html;
}

function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    const activities = [];

    // Add recent shifts
    shifts.slice(-5).reverse().forEach(shift => {
        const employee = employees.find(e => e.id === shift.employeeId);
        if (employee) {
            activities.push({
                type: 'shift',
                text: `${employee.firstName} ${employee.lastName} a un shift prévu`,
                time: shift.date,
                icon: 'schedule',
                color: 'blue'
            });
        }
    });

    // Add recent absences
    absences.slice(-3).reverse().forEach(absence => {
        const employee = employees.find(e => e.id === absence.employeeId);
        if (employee) {
            activities.push({
                type: 'absence',
                text: `${employee.firstName} ${employee.lastName} - Demande d'absence`,
                time: absence.startDate,
                icon: 'event_busy',
                color: 'orange'
            });
        }
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    let html = '<div style="max-height: 400px; overflow-y: auto;">';
    if (activities.length === 0) {
        html += '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Aucune activité récente</p>';
    } else {
        activities.slice(0, 10).forEach(activity => {
            html += `
                <div class="activity-item">
                    <div class="activity-icon stat-icon ${activity.color}" style="width: 40px; height: 40px; font-size: 18px;">
                        <span class="material-icons" style="font-size: 18px;">${activity.icon}</span>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.text}</h4>
                        <p class="activity-time">${formatDate(activity.time)}</p>
                    </div>
                </div>
            `;
        });
    }
    html += '</div>';
    container.innerHTML = html;
}

// ==================== EMPLOYEES MODULE ====================
function loadEmployees() {
    const tbody = document.getElementById('employeesTableBody');

    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">Aucun employé. Cliquez sur "Ajouter un employé" pour commencer.</td></tr>';
        return;
    }

    let html = '';
    employees.forEach(employee => {
        html += `
            <tr>
                <td><strong>${employee.firstName} ${employee.lastName}</strong></td>
                <td>${employee.position}</td>
                <td>${employee.email}</td>
                <td>${employee.phone || '-'}</td>
                <td><span class="status-badge ${employee.status}">${employee.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="editEmployee('${employee.id}')" title="Modifier">
                            <span class="material-icons" style="font-size: 16px;">edit</span>
                        </button>
                        <button class="action-btn delete" onclick="deleteEmployee('${employee.id}')" title="Supprimer">
                            <span class="material-icons" style="font-size: 16px;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function openEmployeeModal(employeeId = null) {
    const modal = document.getElementById('employeeModal');
    const form = document.getElementById('employeeForm');
    const title = document.getElementById('modalTitle');

    editingEmployeeId = employeeId;

    if (employeeId) {
        const employee = employees.find(e => e.id === employeeId);
        if (employee) {
            title.textContent = 'Modifier l\'employé';
            document.getElementById('firstName').value = employee.firstName;
            document.getElementById('lastName').value = employee.lastName;
            document.getElementById('email').value = employee.email;
            document.getElementById('phone').value = employee.phone || '';
            document.getElementById('position').value = employee.position;
            document.getElementById('department').value = employee.department;
            document.getElementById('hourlyRate').value = employee.hourlyRate || '';
            document.getElementById('status').value = employee.status;
        }
    } else {
        title.textContent = 'Ajouter un employé';
        form.reset();
    }

    modal.classList.remove('hidden');
}

function closeEmployeeModal() {
    document.getElementById('employeeModal').classList.add('hidden');
    document.getElementById('employeeForm').reset();
    editingEmployeeId = null;
}

function saveEmployee(e) {
    e.preventDefault();

    const employeeData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        position: document.getElementById('position').value,
        department: document.getElementById('department').value,
        hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || 0,
        status: document.getElementById('status').value
    };

    if (editingEmployeeId) {
        const index = employees.findIndex(e => e.id === editingEmployeeId);
        if (index !== -1) {
            employees[index] = { ...employees[index], ...employeeData };
        }
    } else {
        employeeData.id = generateId();
        employeeData.createdAt = new Date().toISOString();
        employees.push(employeeData);
    }

    saveData();
    closeEmployeeModal();
    loadEmployees();
    updateEmployeeSelects();
}

function editEmployee(id) {
    openEmployeeModal(id);
}

function deleteEmployee(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
        employees = employees.filter(e => e.id !== id);
        saveData();
        loadEmployees();
        updateEmployeeSelects();
    }
}

function updateEmployeeSelects() {
    const selects = [
        document.getElementById('shiftEmployee'),
        document.getElementById('absenceEmployee')
    ];

    selects.forEach(select => {
        if (select) {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Sélectionner un employé</option>';
            employees.filter(e => e.status === 'active').forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.id;
                option.textContent = `${employee.firstName} ${employee.lastName}`;
                select.appendChild(option);
            });
            select.value = currentValue;
        }
    });
}

// Search employees
document.getElementById('searchEmployee').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#employeesTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// ==================== SCHEDULE MODULE ====================
function loadSchedule() {
    const weekDates = getCurrentWeekDates(currentWeekOffset);
    document.getElementById('currentWeek').textContent = getWeekRange(weekDates);
    renderScheduleGrid(weekDates);
}

function renderScheduleGrid(dates) {
    const container = document.getElementById('scheduleGrid');
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    let html = '<table class="schedule-table"><thead><tr><th style="width: 150px;">Employé</th>';

    dates.forEach((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayNum = date.getDate();
        html += `<th>${days[index]}<br><small>${dayNum}</small></th>`;
    });

    html += '</tr></thead><tbody>';

    if (employees.length === 0) {
        html += '<tr><td colspan="8" style="text-align: center; padding: 40px;">Aucun employé disponible</td></tr>';
    } else {
        employees.filter(e => e.status === 'active').forEach(employee => {
            html += `<tr><td><strong>${employee.firstName} ${employee.lastName}</strong></td>`;

            dates.forEach(date => {
                const dateStr = date.toISOString().split('T')[0];
                const dayShifts = shifts.filter(s => s.date === dateStr && s.employeeId === employee.id);

                html += '<td>';
                dayShifts.forEach(shift => {
                    html += `
                        <div class="shift-block" onclick="editShift('${shift.id}')">
                            <div class="time">${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}</div>
                            ${shift.note ? `<div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">${shift.note}</div>` : ''}
                        </div>
                    `;
                });
                html += '</td>';
            });

            html += '</tr>';
        });
    }

    html += '</tbody></table>';
    container.innerHTML = html;
}

function openShiftModal() {
    document.getElementById('shiftModal').classList.remove('hidden');
    document.getElementById('shiftDate').value = new Date().toISOString().split('T')[0];
}

function closeShiftModal() {
    document.getElementById('shiftModal').classList.add('hidden');
    document.getElementById('shiftForm').reset();
}

function saveShift(e) {
    e.preventDefault();

    const shiftData = {
        id: generateId(),
        employeeId: document.getElementById('shiftEmployee').value,
        date: document.getElementById('shiftDate').value,
        startTime: document.getElementById('shiftStart').value,
        endTime: document.getElementById('shiftEnd').value,
        note: document.getElementById('shiftNote').value
    };

    shifts.push(shiftData);
    saveData();
    closeShiftModal();
    loadSchedule();
    updateDashboardStats();
}

function editShift(id) {
    const shift = shifts.find(s => s.id === id);
    if (shift && confirm('Voulez-vous supprimer ce shift ?')) {
        shifts = shifts.filter(s => s.id !== id);
        saveData();
        loadSchedule();
        updateDashboardStats();
    }
}

// Week navigation
document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeekOffset--;
    loadSchedule();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeekOffset++;
    loadSchedule();
});

// ==================== TIME TRACKING MODULE ====================
let clockInterval = null;
let currentClockIn = null;

function loadTimeTracking() {
    startClock();
    loadTimesheet();
}

function startClock() {
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('fr-FR');
        const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        document.getElementById('currentTime').textContent = timeStr;
        document.getElementById('clockDate').textContent = dateStr;
    }

    updateClock();
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateClock, 1000);
}

function clockIn() {
    if (!currentEmployee) {
        const employeeId = prompt('ID de l\'employé (pour demo, entrez n\'importe quoi):');
        if (!employeeId) return;
        currentEmployee = employees[0] || { id: 'demo', firstName: 'Demo', lastName: 'User' };
    }

    currentClockIn = {
        employeeId: currentEmployee.id,
        date: new Date().toISOString().split('T')[0],
        clockIn: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    document.getElementById('clockInBtn').disabled = true;
    document.getElementById('clockOutBtn').disabled = false;
    alert('Arrivée enregistrée avec succès !');
}

function clockOut() {
    if (!currentClockIn) return;

    currentClockIn.clockOut = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    currentClockIn.hours = calculateHours(currentClockIn.clockIn, currentClockIn.clockOut);
    currentClockIn.id = generateId();

    timeEntries.push(currentClockIn);
    saveData();

    document.getElementById('clockInBtn').disabled = false;
    document.getElementById('clockOutBtn').disabled = true;
    currentClockIn = null;

    alert('Sortie enregistrée avec succès !');
    loadTimesheet();
}

function loadTimesheet() {
    const tbody = document.getElementById('timesheetTableBody');
    const weekDates = getCurrentWeekDates();
    const weekStart = weekDates[0].toISOString().split('T')[0];
    const weekEnd = weekDates[6].toISOString().split('T')[0];

    const weekEntries = timeEntries.filter(entry => entry.date >= weekStart && entry.date <= weekEnd);

    if (weekEntries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">Aucune entrée cette semaine</td></tr>';
        return;
    }

    let html = '';
    weekEntries.forEach(entry => {
        const employee = employees.find(e => e.id === entry.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';

        html += `
            <tr>
                <td><strong>${employeeName}</strong></td>
                <td>${formatDate(entry.date)}</td>
                <td>${entry.clockIn}</td>
                <td>${entry.clockOut || '-'}</td>
                <td><strong>${entry.hours ? entry.hours.toFixed(2) + 'h' : '-'}</strong></td>
                <td><span class="status-badge approved">Validé</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

document.getElementById('clockInBtn').addEventListener('click', clockIn);
document.getElementById('clockOutBtn').addEventListener('click', clockOut);

// ==================== ABSENCES MODULE ====================
function loadAbsences() {
    renderAbsences();
}

function renderAbsences(filter = 'all') {
    const tbody = document.getElementById('absencesTableBody');
    let filteredAbsences = absences;

    if (filter !== 'all') {
        filteredAbsences = absences.filter(a => a.status === filter);
    }

    if (filteredAbsences.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">Aucune absence</td></tr>';
        return;
    }

    let html = '';
    filteredAbsences.forEach(absence => {
        const employee = employees.find(e => e.id === absence.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';

        const start = new Date(absence.startDate);
        const end = new Date(absence.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        const typeLabels = {
            vacation: 'Congés payés',
            sick: 'Maladie',
            personal: 'Congé personnel',
            unpaid: 'Sans solde'
        };

        html += `
            <tr>
                <td><strong>${employeeName}</strong></td>
                <td>${typeLabels[absence.type]}</td>
                <td>${formatDate(absence.startDate)}</td>
                <td>${formatDate(absence.endDate)}</td>
                <td>${days} jour${days > 1 ? 's' : ''}</td>
                <td><span class="status-badge ${absence.status}">${getStatusLabel(absence.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        ${absence.status === 'pending' ? `
                            <button class="action-btn" onclick="approveAbsence('${absence.id}')" title="Approuver">
                                <span class="material-icons" style="font-size: 16px;">check</span>
                            </button>
                            <button class="action-btn delete" onclick="rejectAbsence('${absence.id}')" title="Refuser">
                                <span class="material-icons" style="font-size: 16px;">close</span>
                            </button>
                        ` : ''}
                        <button class="action-btn delete" onclick="deleteAbsence('${absence.id}')" title="Supprimer">
                            <span class="material-icons" style="font-size: 16px;">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function getStatusLabel(status) {
    const labels = {
        pending: 'En attente',
        approved: 'Approuvée',
        rejected: 'Refusée'
    };
    return labels[status] || status;
}

function openAbsenceModal() {
    document.getElementById('absenceModal').classList.remove('hidden');
}

function closeAbsenceModal() {
    document.getElementById('absenceModal').classList.add('hidden');
    document.getElementById('absenceForm').reset();
}

function saveAbsence(e) {
    e.preventDefault();

    const absenceData = {
        id: generateId(),
        employeeId: document.getElementById('absenceEmployee').value,
        type: document.getElementById('absenceType').value,
        startDate: document.getElementById('absenceStart').value,
        endDate: document.getElementById('absenceEnd').value,
        reason: document.getElementById('absenceReason').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    absences.push(absenceData);
    saveData();
    closeAbsenceModal();
    loadAbsences();
    updateDashboardStats();
}

function approveAbsence(id) {
    const absence = absences.find(a => a.id === id);
    if (absence) {
        absence.status = 'approved';
        saveData();
        loadAbsences();
        updateDashboardStats();
    }
}

function rejectAbsence(id) {
    const absence = absences.find(a => a.id === id);
    if (absence) {
        absence.status = 'rejected';
        saveData();
        loadAbsences();
    }
}

function deleteAbsence(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
        absences = absences.filter(a => a.id !== id);
        saveData();
        loadAbsences();
        updateDashboardStats();
    }
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderAbsences(tab.dataset.filter);
    });
});

// ==================== REPORTS MODULE ====================
function loadReports() {
    renderReportCharts();
}

function renderReportCharts() {
    // Placeholder for charts - in a real app, you'd use Chart.js or similar
    document.getElementById('employeeHoursChart').innerHTML = '<p>Graphique des heures par employé</p><p style="font-size: 12px; margin-top: 10px;">Intégration de Chart.js recommandée</p>';
    document.getElementById('attendanceChart').innerHTML = '<p>Graphique du taux de présence</p><p style="font-size: 12px; margin-top: 10px;">Intégration de Chart.js recommandée</p>';
    document.getElementById('costChart').innerHTML = '<p>Graphique des coûts</p><p style="font-size: 12px; margin-top: 10px;">Intégration de Chart.js recommandée</p>';
}

// ==================== MODAL HANDLERS ====================
document.getElementById('addEmployeeBtn').addEventListener('click', () => openEmployeeModal());
document.getElementById('closeEmployeeModal').addEventListener('click', closeEmployeeModal);
document.getElementById('cancelEmployeeBtn').addEventListener('click', closeEmployeeModal);
document.getElementById('employeeForm').addEventListener('submit', saveEmployee);

document.getElementById('addShiftBtn').addEventListener('click', openShiftModal);
document.getElementById('closeShiftModal').addEventListener('click', closeShiftModal);
document.getElementById('cancelShiftBtn').addEventListener('click', closeShiftModal);
document.getElementById('shiftForm').addEventListener('submit', saveShift);

document.getElementById('requestAbsenceBtn').addEventListener('click', openAbsenceModal);
document.getElementById('closeAbsenceModal').addEventListener('click', closeAbsenceModal);
document.getElementById('cancelAbsenceBtn').addEventListener('click', closeAbsenceModal);
document.getElementById('absenceForm').addEventListener('submit', saveAbsence);

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// ==================== HEADER DATE ====================
function updateHeaderDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('currentDate').textContent = dateStr;
}

// ==================== INITIALIZATION ====================
function initApp() {
    updateHeaderDate();
    initNavigation();
    updateEmployeeSelects();
    loadDashboard();

    // Load demo data if empty
    if (employees.length === 0) {
        loadDemoData();
    }
}

// ==================== DEMO DATA ====================
function loadDemoData() {
    employees = [
        {
            id: 'emp1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '0612345678',
            position: 'Manager',
            department: 'management',
            hourlyRate: 25,
            status: 'active',
            createdAt: '2025-01-01'
        },
        {
            id: 'emp2',
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie.martin@example.com',
            phone: '0623456789',
            position: 'Vendeur',
            department: 'sales',
            hourlyRate: 15,
            status: 'active',
            createdAt: '2025-01-05'
        },
        {
            id: 'emp3',
            firstName: 'Pierre',
            lastName: 'Bernard',
            email: 'pierre.bernard@example.com',
            phone: '0634567890',
            position: 'Support',
            department: 'support',
            hourlyRate: 18,
            status: 'active',
            createdAt: '2025-01-10'
        }
    ];

    // Add some shifts for current week
    const today = new Date();
    const weekDates = getCurrentWeekDates();

    weekDates.forEach((date, index) => {
        if (index < 5) { // Monday to Friday
            employees.forEach(emp => {
                shifts.push({
                    id: generateId(),
                    employeeId: emp.id,
                    date: date.toISOString().split('T')[0],
                    startTime: '09:00',
                    endTime: '17:00',
                    note: ''
                });
            });
        }
    });

    // Add some absences
    absences.push({
        id: generateId(),
        employeeId: 'emp2',
        type: 'vacation',
        startDate: '2025-11-20',
        endDate: '2025-11-25',
        reason: 'Vacances d\'hiver',
        status: 'pending',
        createdAt: new Date().toISOString()
    });

    saveData();
    updateEmployeeSelects();
}

// Start the application
document.addEventListener('DOMContentLoaded', initApp);
