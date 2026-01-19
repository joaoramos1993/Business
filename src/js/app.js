let currentLanguage = 'en';
const STORAGE_KEY = 'vacation_requests';
const NOTIFICATIONS_KEY = 'vacation_notifications';
let currentView = 'employee';
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

export function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateLanguage();
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    updateAllViews();
}

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        const tagName = el.tagName;
        const hasClass = el.className;
        if (tagName === 'LABEL' || tagName === 'BUTTON' || tagName === 'H1' || tagName === 'H2' || tagName === 'P' || 
            (tagName === 'DIV' && (hasClass.includes('label') || hasClass.includes('stat-label')))) {
            el.textContent = el.getAttribute('data-' + currentLanguage);
        }
    });
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        el.placeholder = el.getAttribute('data-placeholder-' + currentLanguage);
    });
    document.querySelectorAll('option[data-en]').forEach(el => {
        el.textContent = el.getAttribute('data-' + currentLanguage);
    });
}

function translateVacationType(type) {
    const translations = {
        vacation: { en: 'Vacation', pt: 'Férias' },
        sick: { en: 'Sick Leave', pt: 'Licença Médica' },
        personal: { en: 'Day Off', pt: 'Folga' }
    };
    return translations[type] ? translations[type][currentLanguage] : type;
}

function getRequests() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveRequests(requests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    updateAllViews();
}

function getNotifications() {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : { pending: 0, newApprovals: 0, newRejections: 0 };
}

function saveNotifications(notifications) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
}

function addNotification(type) {
    const notifications = getNotifications();
    if (type === 'pending') {
        notifications.pending++;
    } else if (type === 'approved') {
        notifications.newApprovals++;
    } else if (type === 'rejected') {
        notifications.newRejections++;
    }
    saveNotifications(notifications);
    updateNotificationBadges();
}

function clearNotifications(type) {
    const notifications = getNotifications();
    if (type === 'pending') {
        notifications.pending = 0;
    } else if (type === 'employee') {
        notifications.newApprovals = 0;
        notifications.newRejections = 0;
    }
    saveNotifications(notifications);
    updateNotificationBadges();
}

function updateNotificationBadges() {
    const notifications = getNotifications();
    
    const ownerBtn = document.querySelector('.btn-role[onclick*="owner"]');
    if (ownerBtn) {
        let badge = ownerBtn.querySelector('.notification-badge');
        if (notifications.pending > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'notification-badge';
                ownerBtn.appendChild(badge);
            }
            badge.textContent = notifications.pending;
        } else if (badge) {
            badge.remove();
        }
    }
    
    const employeeBtn = document.querySelector('.btn-role[onclick*="employee"]');
    if (employeeBtn) {
        let badge = employeeBtn.querySelector('.notification-badge');
        const totalNew = notifications.newApprovals + notifications.newRejections;
        if (totalNew > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'notification-badge';
                employeeBtn.appendChild(badge);
            }
            badge.textContent = totalNew;
        } else if (badge) {
            badge.remove();
        }
    }
}

export function submitRequest() {
    const empName = document.getElementById('empName').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const vacationType = document.getElementById('vacationType').value;
    const notes = document.getElementById('notes').value.trim();
    const days = parseInt(document.getElementById('days').value);

    if (!empName || !startDate || !endDate || days === 0) {
        showNotification(
            currentLanguage === 'pt' ? 'Por favor, preencha todos os campos obrigatórios' : 'Please fill in all required fields',
            'error'
        );
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
        showNotification(
            currentLanguage === 'pt' ? 'A data de início não pode ser no passado' : 'Start date cannot be in the past',
            'error'
        );
        return;
    }

    const request = {
        id: Date.now(),
        empName,
        startDate,
        endDate,
        vacationType,
        notes,
        days,
        status: 'pending',
        submittedDate: new Date().toISOString(),
        processedDate: null
    };

    const requests = getRequests();
    requests.push(request);
    saveRequests(requests);
    
    addNotification('pending');

    document.getElementById('empName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('days').value = '';

    showNotification(
        currentLanguage === 'pt' ? '✅ Solicitação enviada com sucesso! Aguardando aprovação.' : '✅ Request submitted successfully! Awaiting approval.',
        'success'
    );
}

function showNotification(message, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

export function calculateDays() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (startDate && endDate && endDate >= startDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('days').value = days;
    }
}

export function switchRole(role) {
    currentView = role;
    document.getElementById('employeeView').classList.toggle('hidden', role !== 'employee');
    document.getElementById('ownerView').classList.toggle('hidden', role !== 'owner');

    document.querySelectorAll('.btn-role').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (role === 'owner') {
        clearNotifications('pending');
    } else {
        clearNotifications('employee');
    }

    updateAllViews();
}

export function approveRequest(requestId) {
    const requests = getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
        request.status = 'approved';
        request.processedDate = new Date().toISOString();
        
        const notifications = getNotifications();
        if (notifications.pending > 0) notifications.pending--;
        saveNotifications(notifications);
        
        addNotification('approved');
        saveRequests(requests);
        
        showNotification(
            currentLanguage === 'pt' 
                ? '✅ Férias aprovadas para ' + request.empName
                : '✅ Vacation approved for ' + request.empName,
            'success'
        );
    }
}

export function rejectRequest(requestId) {
    const requests = getRequests();
    const request = requests.find(r => r.id === requestId);
    if (request && request.status === 'pending') {
        request.status = 'rejected';
        request.processedDate = new Date().toISOString();
        
        const notifications = getNotifications();
        if (notifications.pending > 0) notifications.pending--;
        saveNotifications(notifications);
        
        addNotification('rejected');
        saveRequests(requests);
        
        showNotification(
            currentLanguage === 'pt' 
                ? '❌ Férias rejeitadas para ' + request.empName
                : '❌ Vacation rejected for ' + request.empName,
            'warning'
        );
    }
}

function generateCalendar(year, month, containerId) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const dayNames = currentLanguage === 'pt' ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = currentLanguage === 'pt' 
        ? ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let html = '<div class="calendar-controls">';
    html += '<button class="btn-nav" onclick="previousMonth()" ' + (year === currentYear && month === currentMonth ? 'disabled' : '') + '>◀</button>';
    html += '<h3>' + monthNames[month] + ' ' + year + '</h3>';
    html += '<button class="btn-nav" onclick="nextMonth()" ' + (year === currentYear && month === currentMonth + 11 ? 'disabled' : '') + '>▶</button>';
    html += '</div>';
    
    html += '<table class="calendar"><thead><tr>';
    dayNames.forEach(day => html += '<th>' + day + '<' + '/th>');
    html += '<' + '/tr><' + '/thead><tbody><tr>';

    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<td><' + '/td>';
    }

    const requests = getRequests();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];

        let className = '';
        if ((startingDayOfWeek + day - 1) % 7 === 0 || (startingDayOfWeek + day) % 7 === 0) {
            className += 'weekend ';
        }

        let hasVacation = false;
        for (const req of requests) {
            if (req.status === 'approved' && dateStr >= req.startDate && dateStr <= req.endDate) {
                hasVacation = true;
                break;
            }
        }

        if (hasVacation) className += 'vacation';
        className += ' clickable-day';

        html += '<td class="' + className + '" onclick="showDayDetails(\'' + dateStr + '\')">' + day + '<' + '/td>';

        if ((startingDayOfWeek + day) % 7 === 0 && day < daysInMonth) {
            html += '<' + '/tr><tr>';
        }
    }

    html += '<' + '/tr><' + '/tbody><' + '/table>';
    return html;
}

export function previousMonth() {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    updateAllViews();
}

export function nextMonth() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const maxAllowedMonth = currentMonth + 11;
    
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    }
    
    const monthsSinceStart = (currentCalendarYear - currentYear) * 12 + (currentCalendarMonth - currentMonth);
    
    if (monthsSinceStart > 11) {
        currentCalendarMonth--;
        if (currentCalendarMonth < 0) {
            currentCalendarMonth = 11;
            currentCalendarYear--;
        }
    }
    
    updateAllViews();
}

export function showDayDetails(dateStr) {
    const requests = getRequests();
    const vacationsOnDay = requests.filter(req => 
        req.status === 'approved' && dateStr >= req.startDate && dateStr <= req.endDate
    );
    
    const detailsId = currentView === 'employee' ? 'employeeDayDetails' : 'ownerDayDetails';
    let detailsDiv = document.getElementById(detailsId);
    
    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        detailsDiv.id = detailsId;
        detailsDiv.className = 'day-details';
        const calendarDiv = document.getElementById(currentView === 'employee' ? 'employeeCalendar' : 'ownerCalendar');
        calendarDiv.parentNode.insertBefore(detailsDiv, calendarDiv.nextSibling);
    }
    
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString(currentLanguage === 'pt' ? 'pt-BR' : 'en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    if (vacationsOnDay.length === 0) {
        const noVacationMsg = currentLanguage === 'pt' ? 'Sem férias neste dia' : 'No vacations on this day';
        detailsDiv.innerHTML = '<h3>' + formattedDate + '</h3><p class="empty-message">' + noVacationMsg + '</p>';
    } else {
        const title = currentLanguage === 'pt' ? 'Férias neste dia' : 'Vacations on this day';
        let html = '<h3>' + formattedDate + '</h3>';
        html += '<h4>' + title + ' (' + vacationsOnDay.length + ')</h4>';
        html += '<div class="day-details-list">';
        
        vacationsOnDay.forEach(req => {
            const dateLabel = currentLanguage === 'pt' ? 'para' : 'to';
            html += '<div class="detail-item">';
            html += '<strong>' + req.empName + '</strong> - ' + translateVacationType(req.vacationType);
            html += '<br><small>' + req.startDate + ' ' + dateLabel + ' ' + req.endDate + '</small>';
            html += '</div>';
        });
        
        html += '</div>';
        detailsDiv.innerHTML = html;
    }
    
    detailsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateEmployeeView() {
    const requests = getRequests();
    document.getElementById('employeeCalendar').innerHTML = generateCalendar(currentCalendarYear, currentCalendarMonth, 'employeeCalendar');

    const approvedRequests = requests.filter(r => r.status === 'approved');
    const usedDays = approvedRequests.reduce((sum, req) => sum + req.days, 0);
    const totalDays = 20;
    const remainingDays = totalDays - usedDays;

    document.getElementById('availableDays').textContent = totalDays;
    document.getElementById('usedDays').textContent = usedDays;
    document.getElementById('remainingDays').textContent = Math.max(0, remainingDays);

    const container = document.getElementById('employeeRequests');
    container.innerHTML = '';
    
    if (requests.length === 0) {
        const emptyMsg = currentLanguage === 'pt' ? 'Nenhuma solicitação de férias ainda' : 'No vacation requests yet';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-message';
        emptyDiv.textContent = emptyMsg;
        container.appendChild(emptyDiv);
    } else {
        const sortedRequests = [...requests].sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
        sortedRequests.forEach(req => {
            const div = document.createElement('div');
            const statusTexts = { en: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }, pt: { pending: 'Pendente', approved: 'Aprovada', rejected: 'Rejeitada' } };
            const statusText = statusTexts[currentLanguage][req.status];
            const dateLabel = currentLanguage === 'pt' ? 'para' : 'to';
            const daysLabel = currentLanguage === 'pt' ? 'dias' : 'days';
            
            div.className = 'request-item ' + req.status;
            
            const header = document.createElement('div');
            header.className = 'request-header';
            header.innerHTML = '<div><strong>' + req.empName + '<' + '/strong> - ' + translateVacationType(req.vacationType) + '<' + '/div><span class="request-status status-' + req.status + '">' + statusText + '<' + '/span>';
            div.appendChild(header);
            
            const dates = document.createElement('div');
            dates.textContent = req.startDate + ' ' + dateLabel + ' ' + req.endDate + ' (' + req.days + ' ' + daysLabel + ')';
            div.appendChild(dates);
            
            if (req.notes) {
                const notesDiv = document.createElement('div');
                const em = document.createElement('em');
                em.textContent = req.notes;
                notesDiv.appendChild(em);
                div.appendChild(notesDiv);
            }
            
            container.appendChild(div);
        });
    }
}

function updateOwnerView() {
    const requests = getRequests();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const employeesOut = requests.filter(r => r.status === 'approved' && r.startDate <= todayStr && r.endDate >= todayStr).length;

    document.getElementById('totalRequests').textContent = requests.length;
    document.getElementById('pendingRequests').textContent = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('employeesOut').textContent = employeesOut;

    document.getElementById('ownerCalendar').innerHTML = generateCalendar(currentCalendarYear, currentCalendarMonth, 'ownerCalendar');

    const pendingContainer = document.getElementById('pendingApprovals');
    pendingContainer.innerHTML = '';
    
    const pendingRequests = requests.filter(r => r.status === 'pending');
    const pendingSection = document.getElementById('pendingApprovalsSection');
    
    if (pendingRequests.length === 0) {
        pendingSection.style.display = 'none';
    } else {
        pendingSection.style.display = 'block';
        pendingRequests.forEach(req => {
            const div = document.createElement('div');
            div.className = 'request-item pending pending-action';
            const btnTexts = currentLanguage === 'pt' ? { approve: '✓ Aprovar', reject: '✗ Rejeitar' } : { approve: '✓ Approve', reject: '✗ Reject' };
            const dateLabel = currentLanguage === 'pt' ? 'para' : 'to';
            const daysLabel = currentLanguage === 'pt' ? 'dias' : 'days';
            
            const header = document.createElement('div');
            header.className = 'request-header';
            header.innerHTML = '<div><strong>' + req.empName + '<' + '/strong> - ' + translateVacationType(req.vacationType) + '<' + '/div><span class="request-status status-pending">' + (currentLanguage === 'pt' ? 'Pendente' : 'Pending') + '<' + '/span>';
            div.appendChild(header);
            
            const dates = document.createElement('div');
            dates.textContent = req.startDate + ' ' + dateLabel + ' ' + req.endDate + ' (' + req.days + ' ' + daysLabel + ')';
            div.appendChild(dates);
            
            const actions = document.createElement('div');
            actions.className = 'request-actions';
            
            const approveBtn = document.createElement('button');
            approveBtn.className = 'btn btn-success';
            approveBtn.textContent = btnTexts.approve;
            approveBtn.onclick = () => window.approveRequest(req.id);
            
            const rejectBtn = document.createElement('button');
            rejectBtn.className = 'btn btn-danger';
            rejectBtn.textContent = btnTexts.reject;
            rejectBtn.onclick = () => window.rejectRequest(req.id);
            
            actions.appendChild(approveBtn);
            actions.appendChild(rejectBtn);
            div.appendChild(actions);
            
            pendingContainer.appendChild(div);
        });
    }

    const allContainer = document.getElementById('allRequests');
    allContainer.innerHTML = '';
    
    if (requests.length === 0) {
        const noRequestsMsg = currentLanguage === 'pt' ? 'Sem solicitações' : 'No requests';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-message';
        emptyDiv.textContent = noRequestsMsg;
        allContainer.appendChild(emptyDiv);
    } else {
        requests.forEach(req => {
            const div = document.createElement('div');
            const statusTexts = { en: { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' }, pt: { pending: 'Pendente', approved: 'Aprovada', rejected: 'Rejeitada' } };
            const statusText = statusTexts[currentLanguage][req.status];
            const dateLabel = currentLanguage === 'pt' ? 'para' : 'to';
            const daysLabel = currentLanguage === 'pt' ? 'dias' : 'days';
            
            div.className = 'request-item ' + req.status;
            
            const header = document.createElement('div');
            header.className = 'request-header';
            header.innerHTML = '<div><strong>' + req.empName + '<' + '/strong> - ' + translateVacationType(req.vacationType) + '<' + '/div><span class="request-status status-' + req.status + '">' + statusText + '<' + '/span>';
            div.appendChild(header);
            
            const dates = document.createElement('div');
            dates.textContent = req.startDate + ' ' + dateLabel + ' ' + req.endDate + ' (' + req.days + ' ' + daysLabel + ')';
            div.appendChild(dates);
            
            allContainer.appendChild(div);
        });
    }
}

function updateAllViews() {
    updateEmployeeView();
    updateOwnerView();
}

window.addEventListener('DOMContentLoaded', () => {
    currentLanguage = localStorage.getItem('language') || 'en';
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const langBtn = document.querySelector('.lang-btn[onclick*="' + currentLanguage + '"]');
    if (langBtn) langBtn.classList.add('active');
    updateLanguage();
    updateAllViews();
    updateNotificationBadges();
});

window.setLanguage = setLanguage;
window.switchRole = switchRole;
window.submitRequest = submitRequest;
window.calculateDays = calculateDays;
window.approveRequest = approveRequest;
window.rejectRequest = rejectRequest;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.showDayDetails = showDayDetails;
