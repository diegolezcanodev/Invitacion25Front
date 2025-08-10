// utils/calendar.js

export const createGoogleCalendarEvent = (eventDetails) => {
  const {
    title,
    date,
    startTime,
    endTime,
    location,
    description
  } = eventDetails;

  // Convertir fecha y hora al formato requerido por Google Calendar (YYYYMMDDTHHMMSS)
  const formatDateTime = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split('-');
    const [hour, minute] = timeStr.split(':');
    return `${year}${month}${day}T${hour}${minute}00`;
  };

  const startDateTime = formatDateTime(date, startTime);
  const endDateTime = formatDateTime(date, endTime);

  // Construir la URL de Google Calendar
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateTime}/${endDateTime}`,
    location: location || '',
    details: description || ''
  });

  return `${baseUrl}?${params.toString()}`;
};

// Función específica para el cumpleaños de Diego
export const addDiegoBirthdayToCalendar = () => {
  const eventDetails = {
    title: 'Cumpleaños de Diego 🎉',
    date: '2025-08-23', // Formato: YYYY-MM-DD
    startTime: '20:30',
    endTime: '23:59',
    location: 'Guemes 235, Granadero Baigorria, Santa Fe'
  };

  const calendarUrl = createGoogleCalendarEvent(eventDetails);
  
  // Debug - ver la URL generada
  console.log('Calendar URL:', calendarUrl);
  
  // Abrir en nueva pestaña
  window.open(calendarUrl, '_blank');
  
  return calendarUrl;
};

// También compatible con otros calendarios
export const generateCalendarUrls = (eventDetails) => {
  const googleUrl = createGoogleCalendarEvent(eventDetails);
  
  // Para Outlook/Hotmail
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${eventDetails.startDate}T${eventDetails.startTime}&enddt=${eventDetails.startDate}T${eventDetails.endTime}&location=${encodeURIComponent(eventDetails.location)}&body=${encodeURIComponent(eventDetails.description)}`;
  
  // Para descargar archivo .ics (compatible con la mayoría de calendarios)
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Diego Birthday//ES
BEGIN:VEVENT
DTSTART:${eventDetails.startDate.replace(/-/g, '')}T${eventDetails.startTime.replace(':', '')}00
DTEND:${eventDetails.startDate.replace(/-/g, '')}T${eventDetails.endTime.replace(':', '')}00
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;

  return {
    google: googleUrl,
    outlook: outlookUrl,
    ics: `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`
  };
};