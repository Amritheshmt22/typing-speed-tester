(function () {
  "use strict";

  const quotes = [
    "Small steps every day can turn a big goal into a finished project.",
    "Good code is clear, useful and easy for the next person to read.",
    "Practice makes progress, and progress builds confidence.",
    "A simple project teaches more when it works well from start to finish.",
    "Focus on one problem at a time and improve the details as you go."
  ];

  const BEST_SCORE_KEY = "typing-speed-tester-best-wpm";

  const quoteText = document.getElementById("quoteText");
  const typingInput = document.getElementById("typingInput");
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const progressBar = document.getElementById("progressBar");
  const timeStat = document.getElementById("timeStat");
  const wpmStat = document.getElementById("wpmStat");
  const accuracyStat = document.getElementById("accuracyStat");
  const bestStat = document.getElementById("bestStat");
  const statusMessage = document.getElementById("statusMessage");

  let activeQuote = "";
  let startedAt = 0;
  let timerId = null;
  let lastQuoteIndex = -1;

  function countMistakes(input, quote) {
    let mistakes = 0;
    const limit = Math.max(input.length, quote.length);

    for (let index = 0; index < limit; index += 1) {
      if (index < input.length && input[index] !== quote[index]) {
        mistakes += 1;
      }
    }

    return mistakes;
  }

  function calculateStats(input, quote, elapsedSeconds) {
    const safeElapsed = Math.max(elapsedSeconds, 0.1);
    const mistakes = countMistakes(input, quote);
    const correctCharacters = Math.max(input.length - mistakes, 0);
    const wordsTyped = correctCharacters / 5;
    const wpm = Math.round((wordsTyped / safeElapsed) * 60);
    const accuracy = input.length === 0 ? 100 : Math.max(Math.round((correctCharacters / input.length) * 100), 0);
    const progress = quote.length === 0 ? 0 : Math.min(Math.round((input.length / quote.length) * 100), 100);

    return { mistakes, correctCharacters, wpm, accuracy, progress };
  }

  function getElapsedSeconds() {
    if (!startedAt) {
      return 0;
    }

    return (Date.now() - startedAt) / 1000;
  }

  function loadBestScore() {
    const savedScore = Number(window.localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(savedScore) && savedScore > 0 ? savedScore : 0;
  }

  function saveBestScore(score) {
    if (score > loadBestScore()) {
      window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    }
  }

  function chooseQuote() {
    let nextIndex = Math.floor(Math.random() * quotes.length);

    if (quotes.length > 1) {
      while (nextIndex === lastQuoteIndex) {
        nextIndex = Math.floor(Math.random() * quotes.length);
      }
    }

    lastQuoteIndex = nextIndex;
    return quotes[nextIndex];
  }

  function setStatus(text, isError) {
    statusMessage.textContent = text;
    statusMessage.classList.toggle("error", Boolean(isError));
  }

  function renderStats() {
    const stats = calculateStats(typingInput.value, activeQuote, getElapsedSeconds());

    timeStat.textContent = `${getElapsedSeconds().toFixed(1)}s`;
    wpmStat.textContent = `${stats.wpm} WPM`;
    accuracyStat.textContent = `${stats.accuracy}%`;
    bestStat.textContent = `${loadBestScore()} WPM`;
    progressBar.style.width = `${stats.progress}%`;

    return stats;
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function finishTest() {
    stopTimer();
    const stats = renderStats();
    saveBestScore(stats.wpm);
    renderStats();
    typingInput.disabled = true;
    startButton.disabled = false;
    startButton.textContent = "Try another quote";
    setStatus(`Completed at ${stats.wpm} WPM with ${stats.accuracy}% accuracy.`, stats.mistakes > 0);
  }

  function startTest() {
    stopTimer();
    activeQuote = chooseQuote();
    startedAt = Date.now();
    quoteText.textContent = activeQuote;
    typingInput.value = "";
    typingInput.disabled = false;
    typingInput.placeholder = "Start typing the quote exactly as shown.";
    typingInput.focus();
    startButton.disabled = true;
    startButton.textContent = "Test running";
    setStatus("Type the full quote. The timer is running.", false);
    renderStats();
    timerId = window.setInterval(renderStats, 100);
  }

  function resetTest() {
    stopTimer();
    activeQuote = "";
    startedAt = 0;
    quoteText.textContent = "Press Start test to load a quote.";
    typingInput.value = "";
    typingInput.disabled = true;
    typingInput.placeholder = "The typing area opens when the test starts.";
    startButton.disabled = false;
    startButton.textContent = "Start test";
    progressBar.style.width = "0%";
    timeStat.textContent = "0.0s";
    wpmStat.textContent = "0 WPM";
    accuracyStat.textContent = "100%";
    bestStat.textContent = `${loadBestScore()} WPM`;
    setStatus("Ready when you are.", false);
  }

  function handleInput() {
    const stats = renderStats();

    if (typingInput.value === activeQuote && activeQuote.length > 0) {
      finishTest();
      return;
    }

    if (stats.mistakes > 0) {
      setStatus(`${stats.mistakes} character ${stats.mistakes === 1 ? "needs" : "characters need"} a fix.`, true);
    } else {
      setStatus("Nice going. Keep typing.", false);
    }
  }

  startButton.addEventListener("click", startTest);
  resetButton.addEventListener("click", resetTest);
  typingInput.addEventListener("input", handleInput);

  bestStat.textContent = `${loadBestScore()} WPM`;

  window.TypingSpeedTester = {
    calculateStats,
    countMistakes,
    quotes
  };
}());
