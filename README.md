# Typing Speed Tester

A small frontend project that lets a user test typing speed and accuracy in the browser. It is built with plain HTML, CSS and JavaScript, with no build step or external dependency.

## Features

- Start and reset a typing test
- Random practice quote selection
- Live elapsed time, words per minute, accuracy and completion progress
- Mistake counting while typing
- Best WPM score saved in browser local storage
- Responsive layout for desktop and mobile screens
- Keyboard-friendly controls and visible focus states

## Files

- `index.html` - page structure and app content
- `styles.css` - responsive layout, colors and visual states
- `script.js` - timer, score calculations, quote selection and browser storage

## How to run

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select **Start test**, type the quote and view the live score.

No server, package install or account is required.

## How it works

The JavaScript compares each typed character with the selected quote. It uses the standard five-characters-per-word estimate for WPM and calculates accuracy from correct characters. When the typed text exactly matches the quote, the test stops and the best score is updated in local storage.

## Testing

The project was checked in a browser with functional tests for quote loading, live stats, mistake counting, completion, reset behavior and saved best scores. Desktop and mobile layouts were visually inspected.

## Note

This project was built with the help of an AI assistant (Instinct) as a learning project.
