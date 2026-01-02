/* =====================================================
   Config
===================================================== */

const YEAR = 2026;

const MONTHS = [
  'ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН',
  'ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'
];

const DAYS_OF_WEEK = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];

const HOLIDAYS = new Set([
  '01-01','01-02','01-03','01-04','01-05','01-06','01-07','01-08','01-09',
  '02-23',
  '03-09',
  '05-01','05-11',
  '06-12',
  '11-04',
  '12-31'
]);

const DAY_WIDTH = 32;
const MONTH_CELL_WIDTH = 70;

const calendar = document.querySelector('.calendar');

/* =====================================================
   Date helpers
===================================================== */

/** ISO weekday: Monday = 0 … Sunday = 6 */
function getISOWeekday(date) {
  return (date.getDay() + 6) % 7;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function formatMMDD(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}

function isHoliday(date) {
  return HOLIDAYS.has(formatMMDD(date));
}

function isWeekend(weekday) {
  return weekday === 5 || weekday === 6;
}

function isMonthEnd(date, monthIndex) {
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  return next.getMonth() !== monthIndex;
}

/* =====================================================
   DOM creators
===================================================== */

function createMonthCell(name) {
  const cell = document.createElement('div');
  cell.className = 'month-cell';
  cell.textContent = name;
  return cell;
}

function createDayCell(date, monthIndex) {
  const day = document.createElement('div');
  day.className = 'day';

  const weekday = getISOWeekday(date);

  if (weekday === 0) {
    day.classList.add('week-start');
  }

  if (isWeekend(weekday)) {
    day.classList.add('weekend');
    day.classList.add(weekday === 5 ? 'saturday' : 'sunday');
  }

  if (isHoliday(date)) {
    day.classList.add('weekend');
    day.classList.add('sunday');
  }

  if (isMonthEnd(date, monthIndex)) {
    day.classList.add('month-end');
  }

  day.innerHTML = `
    <div class="day-content">
      <span class="date">${date.getDate()}</span>
      <span class="dow">${DAYS_OF_WEEK[weekday]}</span>
    </div>
  `;

  return day;
}

function createMonthDivider(monthIndex) {
  const currentDays = daysInMonth(YEAR, monthIndex);
  const nextDays =
    monthIndex < 11
      ? daysInMonth(YEAR, monthIndex + 1)
      : currentDays;

  const dividerDays = Math.max(currentDays, nextDays);

  const divider = document.createElement('div');
  divider.className = 'month-divider';
  divider.style.width =
    MONTH_CELL_WIDTH + dividerDays * DAY_WIDTH + 1 + 'px';

  return divider;
}

/* =====================================================
   Render
===================================================== */

MONTHS.forEach((monthName, monthIndex) => {
  const row = document.createElement('div');
  row.className = 'month-row';

  row.appendChild(createMonthCell(monthName));

  const date = new Date(YEAR, monthIndex, 1);

  while (date.getMonth() === monthIndex) {
    row.appendChild(createDayCell(date, monthIndex));
    date.setDate(date.getDate() + 1);
  }

  calendar.appendChild(row);
  calendar.appendChild(createMonthDivider(monthIndex));
});
