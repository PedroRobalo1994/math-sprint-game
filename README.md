# Math Sprint Game

A fast-paced mathematics game that tests your multiplication skills and quick thinking abilities.

## Description

Math Sprint Game is an interactive web application where players solve multiplication equations against the clock. The game features different difficulty levels based on the number of questions and tracks your best scores.

## Features

- Multiple difficulty levels (10, 25, 50, or 99 questions)
- Real-time scoring system
- Best score tracking with local storage
- Penalty system for wrong answers
- Responsive design for desktop and mobile devices
- Clean and intuitive user interface

## Technical Details

### Core Components

- **HTML5** - Structured layout with semantic elements
- **CSS3** - Responsive design with media queries
- **JavaScript** - Game logic and DOM manipulation
- **Local Storage** - Persistent score tracking

### Game Mechanics

- Base time tracking
- Penalty time (0.5s per wrong answer)
- Randomized equation generation
- Shuffle algorithm for question order

## How to Play

1. Select the number of questions (10, 25, 50, or 99)
2. Wait for the countdown (3, 2, 1, GO!)
3. For each equation shown:
   - Click "Right" if the equation is correct
   - Click "Wrong" if the equation is incorrect
4. Your final score will be calculated as:
   ```
   Final Time = Base Time + Penalty Time
   ```
5. Try to beat your best score!

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/math-sprint-game.git
   ```
2. Open `index.html` in your preferred browser

## Development

### File Structure
```
math-sprint-game/
├── index.html
├── style.css
├── script.js
├── shuffle.js
└── README.md
```

### Local Development
No build process required. Simply edit the files and refresh your browser to see changes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Background pattern from [Hero Patterns](https://www.heropatterns.com/)
- Fonts from Google Fonts (Oxanium, PT Mono)