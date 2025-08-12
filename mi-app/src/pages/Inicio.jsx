import { useState, useEffect } from "react";
import { Button, Card, Badge } from "flowbite-react";
import SlotMachine from "../components/SlotMachine";
import PhotoGallery from "../components/PhotoGallery";
import { addDiegoBirthdayToCalendar } from '../utils/calendar';

function Inicio() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [wishes] = useState([
    "¡Que se extinga el Comunismo!",
    "¡Que se cumplan todos tus sueños!",
    "¡Feliz cumpleaños Diego!",
    "¡Que la pases genial en tu día!",
    "Jajjajasjja qsy",
    "Re antipala la invitación pero bueno",
    "VLLC"
  ]);
  const [currentWish, setCurrentWish] = useState("");
  const [showWishAnimation, setShowWishAnimation] = useState(false);

  // Fecha del cumpleaños (ajustá esta fecha)
  const birthdayDate = new Date("2025-08-23T20:30:00");

  // Datos del evento
  const eventData = {
    location: "Mi Casa",
    address: "Martín Güemes 235, Granadero Baigorria, Santa Fe",
    neighborhood: "Granadero Baigorria",
  };

  const timelineEvents = [
    {
      time: "20:30",
      title: "Llegada",
      description: "Les abro la puerta.",
      emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-6">
  <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
  <path fill-rule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clip-rule="evenodd" />
</svg>

    },
    {
      time: "21:00", 
      title: "Cena Especial",
      description: "Comemos algo chill.",
      emoji: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ham-icon lucide-ham"><path d="M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856"/><path d="M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288"/><path d="M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025"/><path d="m8.5 16.5-1-1"/></svg>
    },
    {
      time: "22:00",
      title: "Previa", 
      description: "Tomamos unos drinksss tranqui.",
      emoji: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wine-icon lucide-wine"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg>
    },
    {
      time: "23:00",
      title: "Momento Torta",
      description: "Me cantan el feliz cumpleaños.",
      emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-6">
  <path d="m15 1.784-.796.795a1.125 1.125 0 1 0 1.591 0L15 1.784ZM12 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L12 1.784ZM9 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L9 1.784ZM9.75 7.547c.498-.021.998-.035 1.5-.042V6.75a.75.75 0 0 1 1.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 0 1 1.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 0 0-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 0 1 1.5 0v.797ZM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 0 1 2.585.364 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 2.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0 0 12 12.75ZM21.75 18.131a2.604 2.604 0 0 0-1.915.165 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.604 2.604 0 0 0-1.915-.165v2.494c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494Z" />
</svg>

    },
    {
      time: "00:30",
      title: "Bailongo",
      description: "Nos vamos para el boliche un ratiiiito. Lugar a confirmar depende: 1. La voluntad de los invitados obvio. 2. Cuantos seamos y en q vamos. 3. Si Marianito Pepe abre su boliche o ns q onda. ", 
      emoji: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-party-popper-icon lucide-party-popper"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>
    },
    {
      time: "09:00",
      title: "Misa",
      description: "A pedir perdon por los pecados cometidos. ", 
      emoji: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-church-icon lucide-church"><path d="M10 9h4"/><path d="M12 7v5"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22"/><path d="m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7"/></svg>    },
  ];

  // Cuenta regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = birthdayDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [birthdayDate]);

  const generateRandomWish = () => {
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    setCurrentWish(randomWish);
    setShowWishAnimation(true);
    setTimeout(() => setShowWishAnimation(false), 2000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-center transition-colors duration-500 ${
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 animate-gradient-move-dark" 
        : "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 animate-gradient-move-light"
    }`}>
      
      {/* Header */}
      <header className={`relative overflow-hidden w-full transition-colors duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800" 
          : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"
      } text-white`}>
        
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            onClick={toggleDarkMode}
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30 border outline-none ring-0 focus:outline-none focus:ring-0"
          >
            {isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
</svg>
 : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
</svg>
}
          </Button>
        </div>

        <div className="relative w-full px-4 py-16 text-center">
          <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="m15 1.784-.796.795a1.125 1.125 0 1 0 1.591 0L15 1.784ZM12 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L12 1.784ZM9 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L9 1.784ZM9.75 7.547c.498-.021.998-.035 1.5-.042V6.75a.75.75 0 0 1 1.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 0 1 1.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 0 0-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 0 1 1.5 0v.797ZM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 0 1 2.585.364 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 2.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0 0 12 12.75ZM21.75 18.131a2.604 2.604 0 0 0-1.915.165 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.604 2.604 0 0 0-1.915-.165v2.494c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494Z" />
            </svg>
            </span>
            <span className="text-2xl font-bold">Te invito a mi cumple</span>
            <span className="text-3xl"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path d="m15 1.784-.796.795a1.125 1.125 0 1 0 1.591 0L15 1.784ZM12 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L12 1.784ZM9 1.784l-.796.795a1.125 1.125 0 1 0 1.591 0L9 1.784ZM9.75 7.547c.498-.021.998-.035 1.5-.042V6.75a.75.75 0 0 1 1.5 0v.755c.502.007 1.002.021 1.5.042V6.75a.75.75 0 0 1 1.5 0v.88l.307.022c1.55.117 2.693 1.427 2.693 2.946v1.018a62.182 62.182 0 0 0-13.5 0v-1.018c0-1.519 1.143-2.829 2.693-2.946l.307-.022v-.88a.75.75 0 0 1 1.5 0v.797ZM12 12.75c-2.472 0-4.9.184-7.274.54-1.454.217-2.476 1.482-2.476 2.916v.384a4.104 4.104 0 0 1 2.585.364 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 3.67 0 2.605 2.605 0 0 0 2.33 0 4.104 4.104 0 0 1 2.585-.364v-.384c0-1.434-1.022-2.7-2.476-2.917A49.138 49.138 0 0 0 12 12.75ZM21.75 18.131a2.604 2.604 0 0 0-1.915.165 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.605 2.605 0 0 0-2.33 0 4.104 4.104 0 0 1-3.67 0 2.604 2.604 0 0 0-1.915-.165v2.494c0 1.035.84 1.875 1.875 1.875h15.75c1.035 0 1.875-.84 1.875-1.875v-2.494Z" />
            </svg>
            </span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
            DIEGO
          </h1>
          
          
          <div className="flex flex-wrap justify-center gap-6 text-lg mb-8">
            <div className="flex items-center gap-2">
              <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
            </svg>
            </span>
              <span>Sábado 23 de Agosto</span>
            </div>
            <div className="flex items-center gap-2">
              <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
            </svg>
            </span>
              <span>20:30 hs</span>
            </div>
            <div className="flex items-center gap-2">
              <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
            </svg>
            </span>
              <span>Mi Casa</span>
            </div>
          </div>

          {/* Botón de Google Calendar */}
          <div className="flex justify-center">
            <Button
              onClick={addDiegoBirthdayToCalendar}
              className="bg-white/90 hover:bg-white dark:bg-white/90 dark:hover:bg-white text-green-600 hover:text-green-700 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 outline-none ring-0 focus:outline-none focus:ring-0"
            >
              <div className="flex items-center gap-3">
               
            
                <span className="font-bold">Agregar a Google Calendar</span>
              </div>
            </Button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-12 space-y-12">
        <div className="max-w-6xl mx-auto">
        
        {/* Cuenta Regresiva */}
        <section className="text-center">
            <Card className={`max-w-4xl mx-auto transition-colors duration-500 ${
                isDarkMode 
                    ? "bg-gray-800 border-green-700" 
                    : "bg-white border-green-200 dark:bg-white dark:border-green-200"
            }`}>
                <div className="text-center p-6">
                    <h2 className={`text-4xl font-bold mb-3 transition-colors duration-500 ${
                        isDarkMode ? "text-green-300" : "text-green-800"
                    }`}>
                        Cuenta Regresiva
                    </h2>
                    <p className={`text-xl mb-7 transition-colors duration-500 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                    }`}>
                        ¡Faltan solo...!
                    </p>
                    
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-green-800"
                    }`}>
                        {[
                            { label: "Días", value: timeLeft.days, emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mx-auto mb-2"><path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" /></svg> },
                            { label: "Horas", value: timeLeft.hours, emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mx-auto mb-2"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" /></svg> },
                            { label: "Minutos", value: timeLeft.minutes, emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mx-auto mb-2"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" /></svg> },
                            { label: "Segundos", value: timeLeft.seconds, emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 mx-auto mb-2"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg> },
                        ].map((item, index) => (
                  <div
                    key={index}
                    className={`text-center p-6 rounded-xl transition-all duration-500 hover:scale-105 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-green-700 to-emerald-800"
                        : "bg-gradient-to-br from-green-100 to-emerald-100"
                    }`}
                  >
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className={`text-3xl font-bold transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-green-800"
                    }`}>
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className={`text-sm transition-colors duration-500 ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

                    {/* Generador de Deseos */}
              <div className="space-y-4 grid justify-items-center">
                <Button
                  onClick={generateRandomWish}
                  className={` outline-none ring-0 focus:outline-none focus:ring-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 ${
                    showWishAnimation ? "animate-pulse" : ""
                  }`}
                >
                ¡Generar Deseo!
                </Button>

                {currentWish && (
                  <div className={`p-6 rounded-xl transition-all duration-500 ${
                    showWishAnimation ? "scale-105" : "scale-100"
                  } ${
                    isDarkMode
                      ? "bg-gradient-to-r from-green-800 to-emerald-800 text-green-200"
                      : "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800"
                  }`}>
                    <div className="text-2xl mb-2">🎉</div>
                    <p className="text-xl font-semibold italic">"{currentWish}"</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Ubicación del Evento */}
        <section className="text-center mt-24 ">
            <Card className={`max-w-4xl mx-auto transition-colors duration-500 ${
                isDarkMode 
                    ? "bg-gray-800 border-green-700" 
                    : "bg-white border-green-200 dark:bg-white dark:border-green-200"
            }`}>
                <div className="text-center p-6">
                    <h2 className={`flex items-center justify-center gap-2 text-4xl font-bold mb-2 transition-colors duration-500 ${
                        isDarkMode ? "text-green-300" : "text-green-800"
                    }`}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8.5">
                                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <span>Ubicación</span>
                    </h2>
                    <div className="flex flex-col items-center justify-center mb-8">
                        <p className={`text-xl mb-2 transition-colors duration-500 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                        }`}>
                            {eventData.location}
                        </p>
                        <p className={`text-lg transition-colors duration-500 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                        }`}>
                            {eventData.address}
                        </p>
                    </div>
                    {/* Mapa y botones de acción */}
              <div className="space-y-6">
                {/* Mapa embed */}
                <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3346.8!2d-60.7175!3d-32.8568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab123456789a%3A0x123456789abcdef0!2sG%C3%BCemes%20235%2C%20Granadero%20Baigorria%2C%20Santa%20Fe%2C%20Argentina!5e0!3m2!1ses!2sar!4v1642678901234!5m2!1ses!2sar"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del evento"
                  ></iframe>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.address)}`, "_blank")}
                    className="outline-none ring-0 focus:outline-none focus:ring-0 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3"
                  >
                    Abrir en Google Maps
                  </Button>

                  <Button
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(eventData.address)}`, "_blank")}
                    className="outline-none ring-0 focus:outline-none focus:ring-0 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3"
                  >
                    Cómo llegar
                  </Button>

                  <Button
                    onClick={() => window.open(`https://wa.me/5493412112126?text=Hola Diego! No se leer y tengo dudas sobre la dirección de tu casa`, "_blank")}
                    className="outline-none ring-0 focus:outline-none focus:ring-0 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3"
                  >
                    Consultar Ubicación
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Timeline */}
        <section>
          <h2 className={`text-4xl font-bold text-center mt-24 mb-12 transition-colors duration-500 ${
            isDarkMode ? "text-green-300" : "text-green-800"
          }`}>
            Lineup de la Noche
          </h2>
          
          <div className="max-w-4xl mx-auto mb-24">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-teal-500 rounded-full hidden md:block"></div>

              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex items-start mb-8 group">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{event.emoji}</span>
                  </div>

                  {/* Content */}
                  <div className="ml-6 flex-1">
                    <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
                      isDarkMode ? "bg-gray-800 border-green-700" : "bg-white border-green-200 dark:bg-white dark:border-green-200"
                    }`}>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`text-xl font-bold transition-colors duration-500 ${
                            isDarkMode ? "text-green-300" : "text-green-800"
                          }`}>
                            {event.title}
                          </h3>
                          <Badge className={`transition-colors duration-500 ${
                            isDarkMode ? "bg-green-800 text-green-300" : "bg-green-100 text-green-700"
                          }`}>
                            {event.time}
                          </Badge>
                        </div>
                        <p className={`transition-colors duration-500 ${
                          isDarkMode ? "text-green-400" : "text-green-600"
                        }`}>
                          {event.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*Casino*/ }

        <SlotMachine isDarkMode={isDarkMode}/>

        <PhotoGallery isDarkMode={isDarkMode} />

        {/* Información de Contacto */}
        <section className="text-center">
          <Card className={`max-w-lg mx-auto border-0 mt-24 transition-colors duration-500 ${
            isDarkMode
              ? "bg-gradient-to-br from-green-800 to-emerald-800"
              : "bg-gradient-to-br from-green-600 to-emerald-600"
          } text-white`}>
            <div className="p-6 grid justify-items-center">
              <h2 className="text-2xl font-bold mb-4">¿Dudas o Consultas?
            </h2>
              <p className="mb-4">Escribime por WhatsApp</p>
              <Button
                className={`outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-green-300 hover:bg-gray-700"
                    : "bg-white text-green-600 hover:bg-green-50"
                }`}
                onClick={() => window.open("https://wa.me/5493412112126", "_blank")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide mr-2 lucide-message-circle-question-mark-icon lucide-message-circle-question-mark"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> Contactar a Diego
              </Button>
            </div>
          </Card>
        </section>

        </div>
      </main>

      {/* Footer */}
<footer className={`py-8 text-center w-full transition-colors duration-500 ${
  isDarkMode
    ? "bg-gradient-to-r from-green-800 to-emerald-800"
    : "bg-gradient-to-r from-green-800 to-emerald-800"
} text-white`}>
  <p className="text-lg">¡Más vale que vengan!</p>
  <p className={`mt-2 transition-colors duration-500 ${
    isDarkMode ? "text-green-300" : "text-green-200"
  }`}>
    Este año me lucí eh
  </p>

 
</footer>
    </div>
  );
}

export default Inicio;