//const symbols = ["💚", "🥊", "🎸", "🦁", "🫦", "🍾", "🍠"];
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import { getSlot_history, createSlot_history } from "../api/slot_history.api.js";

const SlotMachine = ({ isDarkMode }) => {
  const [credits, setCredits] = useState(1000);
  const [bet, setBet] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(["💚", "💚", "💚"]);
  const [lastWin, setLastWin] = useState(0);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [topHistory, setTopHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const symbols = ["💚", "🥊", "🎸", "🦁", "🫦", "🍾", "🍠"];

  // Cargar historial desde la API
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getSlot_history();
      // Ordenar por créditos descendente y tomar solo los top 10
      const sortedData = data
        .sort((a, b) => b.credits - a.credits)
        .slice(0, 10);
      setTopHistory(sortedData);
    } catch (error) {
      console.error("Error cargando historial:", error);
      // Si hay error (como 404), mantener array vacío
      setTopHistory([]);
    }
  };

  const adjustBet = (amount) => {
    const newBet = Math.max(1, Math.min(credits, bet + amount));
    setBet(newBet);
  };

  const setMaxBet = () => {
    setBet(credits);
  };

  const resetCredits = () => {
    setCredits(1000);
    setBet(10);
    setLastWin(0);
  };

  const spin = () => {
    if (credits < bet || isSpinning) return;

    setCredits(credits - bet);
    setIsSpinning(true);
    setLastWin(0);

    // Animación de spinning
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);

      // Resultado final
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];

      setReels(finalReels);

      // Calcular premio basado en la bet
      let multiplier = 0;
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        // Tres iguales
        if (finalReels[0] === "🫦") multiplier = 50;
        else if (finalReels[0] === "🦁") multiplier = 20;
        else if (finalReels[0] === "🍾") multiplier = 10;
        else multiplier = 5;
      } else if (
        finalReels[0] === finalReels[1] ||
        finalReels[1] === finalReels[2] ||
        finalReels[0] === finalReels[2]
      ) {
        // Dos iguales
        multiplier = 2;
      }

      const winAmount = bet * multiplier;

      if (winAmount > 0) {
        setCredits((prev) => prev + winAmount);
        setLastWin(winAmount);
      }

      setIsSpinning(false);
    }, 2000);
  };

  const saveToHistory = async () => {
    if (!playerName.trim()) return;

    setIsLoading(true);
    
    try {
      const slotData = {
        name: playerName.trim(),
        credits: credits,
      };

      await createSlot_history(slotData);
      
      // Recargar el historial
      await loadHistory();
      
      // Reset del juego
      setCredits(1000);
      setBet(10);
      setPlayerName("");
      setShowSaveDialog(false);
    } catch (error) {
      console.error("Error guardando en el historial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`max-w-2xl mx-auto transition-colors duration-500 rounded-lg shadow-lg ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-800 to-purple-900 border border-purple-700"
            : "bg-gradient-to-br from-white to-purple-50 border border-purple-200"
        }`}
      >
        <div className="p-6">
          <div className="text-center mt-5 mb-6">
            <h2
              className={`text-2xl font-bold flex items-center justify-center gap-2 transition-colors duration-500 ${
                isDarkMode ? "text-purple-300" : "text-purple-800"
              }`}
            >
              Por si quieren slotear un rato
            </h2>
          </div>

          <div className="space-y-6">
            {/* Créditos y controles */}
            <div className="flex justify-between items-center">
              <div
                className={`flex items-center gap-2 text-xl font-bold transition-colors duration-500 ${
                  isDarkMode ? "text-yellow-400" : "text-yellow-600"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="8" cy="8" r="6"/>
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
                  <path d="M7 6h1v4"/>
                  <path d="m16.71 13.88.7.71-2.82 2.82"/>
                </svg>
                {credits} créditos
              </div>

               <Button
                  onClick={resetCredits}
                  size="sm"
                  className={`outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                    isDarkMode
                      ? "bg-blue-800 border-blue-600 text-blue-300 hover:bg-blue-700 dark:bg-blue-800 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-700"
                      : "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200 dark:bg-blue-100 dark:border-blue-300 dark:text-blue-700 dark:hover:bg-blue-200"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </Button>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  size="sm"
                  className={`outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                    isDarkMode
                      ? "bg-purple-800 border-purple-600 text-purple-300 hover:bg-purple-700 dark:bg-purple-800 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700"
                      : "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200 dark:bg-purple-100 dark:border-purple-300 dark:text-purple-700 dark:hover:bg-purple-200"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 mr-2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
</svg>
 Top 10
                </Button>

                <Button
                  onClick={() => setShowSaveDialog(true)}
                  size="sm"
                  className={`outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                    isDarkMode
                      ? "bg-green-800 border-green-600 text-green-300 hover:bg-green-700 dark:bg-green-800 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-700"
                      : "bg-green-100 border-green-300 text-green-700 hover:bg-green-200 dark:bg-green-100 dark:border-green-300 dark:text-green-700 dark:hover:bg-green-200"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                  <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
                  <path d="M7 3v4a1 1 0 0 0 1 1h8"/>
                </svg> Guardar
                </Button>
              </div>
            </div>

            {/* Control de apuesta */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <span className={`transition-colors duration-500 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
                  Apuesta:
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => adjustBet(-10)}
                    disabled={bet <= 10}
                    size="sm"
                    className={`outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                      isDarkMode
                        ? "bg-purple-800 border-purple-600 text-purple-300 hover:bg-purple-700 disabled:opacity-50 dark:bg-purple-800 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700"
                        : "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200 disabled:opacity-50 dark:bg-purple-100 dark:border-purple-300 dark:text-purple-700 dark:hover:bg-purple-200"
                    }`}
                  >
                    -
                  </Button>
                  <div
                    className={`w-20 text-center font-bold text-lg transition-colors duration-500 ${
                      isDarkMode ? "text-white" : "text-purple-900"
                    }`}
                  >
                    {bet}
                  </div>
                  <Button
                    onClick={() => adjustBet(10)}
                    disabled={bet >= credits}
                    size="sm"
                    className={`outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                      isDarkMode
                        ? "bg-purple-800 border-purple-600 text-purple-300 hover:bg-purple-700 disabled:opacity-50 dark:bg-purple-800 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700"
                        : "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200 disabled:opacity-50 dark:bg-purple-100 dark:border-purple-300 dark:text-purple-700 dark:hover:bg-purple-200"
                    }`}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Botones de apuesta rápida */}
              <div className="flex justify-center gap-2 flex-wrap">
                {[25, 50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setBet(Math.min(amount, credits))}
                    disabled={credits < amount}
                    size="sm"
                    className={`text-sm outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                      isDarkMode
                        ? "bg-purple-800 border-purple-600 text-purple-300 hover:bg-purple-700 disabled:opacity-50 dark:bg-purple-800 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700"
                        : "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200 disabled:opacity-50 dark:bg-purple-100 dark:border-purple-300 dark:text-purple-700 dark:hover:bg-purple-200"
                    }`}
                  >
                    {amount}
                  </Button>
                ))}
                <Button
                  onClick={setMaxBet}
                  disabled={credits <= 0}
                  size="sm"
                  className={`text-sm font-bold outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                    isDarkMode
                      ? "bg-yellow-800 border-yellow-600 text-yellow-300 hover:bg-yellow-700 disabled:opacity-50 dark:bg-yellow-800 dark:border-yellow-600 dark:text-yellow-300 dark:hover:bg-yellow-700"
                      : "bg-yellow-100 border-yellow-500 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 dark:bg-yellow-100 dark:border-yellow-500 dark:text-yellow-700 dark:hover:bg-yellow-200"
                  }`}
                >
                  ⚡ MAX
                </Button>
              </div>
            </div>

            {/* Reels */}
            <div
              className={`flex justify-center gap-2 p-6 rounded-lg transition-colors duration-500 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {reels.map((symbol, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 flex items-center justify-center text-4xl rounded-lg transition-all duration-300 ${
                    isSpinning ? "animate-spin" : ""
                  } ${isDarkMode ? "bg-gray-600" : "bg-white"} shadow-lg`}
                >
                  {symbol}
                </div>
              ))}
            </div>

            {/* Resultado */}
            {lastWin > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 animate-bounce">
                  ¡Ganaste {lastWin} créditos! 🎉
                </div>
              </div>
            )}

            {/* Botón de jugar */}
            <div className="text-center grid place-items-center">
              <Button
                onClick={spin}
                disabled={credits < bet || isSpinning}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-12 py-4 text-xl outline-none ring-0 focus:outline-none focus:ring-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-2">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
                {isSpinning ? "Girando..." : `Jugar (${bet} créditos)`}
              </Button>
            </div>

            {/* Tabla de premios */}
            <div
              className={`text-sm text-center space-y-1 transition-colors duration-500 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="font-semibold mb-2">Multiplicadores de Premio:</div>
              <div>🫦🫦🫦 = x50 | 🦁🦁🦁 = x20 | 🍾🍾🍾 = x10</div>
              <div>Otros triples = x5 | Dos iguales = x2</div>
            </div>

            {/* Top 10 histórico */}
            {showHistory && (
              <div
                className={`mt-6 p-4 rounded-lg transition-colors duration-500 ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-4 text-center transition-colors duration-500 ${
                    isDarkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                Top 10 Histórico
                </h3>
                {topHistory.length === 0 ? (
                  <p
                    className={`text-center transition-colors duration-500 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ¡Sé el primero en el ranking!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {topHistory.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`flex justify-between items-center p-2 rounded transition-colors duration-500 ${
                          index === 0
                            ? isDarkMode
                              ? "bg-yellow-900/50 text-yellow-300"
                              : "bg-yellow-100 text-yellow-800"
                            : isDarkMode
                              ? "bg-gray-600 text-gray-200"
                              : "bg-white text-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">#{index + 1}</span>
                          <span>{entry.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="8" r="6"/>
                            <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
                            <path d="M7 6h1v4"/>
                            <path d="m16.71 13.88.7.71-2.82 2.82"/>
                          </svg>
                          <span className="font-bold">{entry.credits}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para guardar en histórico */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`max-w-md w-full mx-4 p-6 rounded-lg shadow-xl transition-colors duration-500 ${
              isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-2 transition-colors duration-500 ${
                isDarkMode ? "text-green-300" : "text-green-800"
              }`}
            >
              🏆 ¡Guardar en el Top Histórico!
            </h3>
            <p
              className={`mb-4 transition-colors duration-500 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Tienes {credits} créditos. Al guardar tu resultado en el top histórico, tus créditos se resetearán a 1000 para empezar una nueva partida.
            </p>

            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Tu nombre para el ranking:
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className={`w-full px-3 py-2 rounded-md border transition-colors duration-500 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowSaveDialog(false)}
                className={`flex-1 outline-none ring-0 focus:outline-none focus:ring-0 transition-colors duration-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </Button>
              <Button
                onClick={saveToHistory}
                disabled={!playerName.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white outline-none ring-0 focus:outline-none focus:ring-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
                  <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/>
                  <path d="M7 3v4a1 1 0 0 0 1 1h8"/>
                </svg>
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlotMachine;