# JavaScript Fundamentals Quiz

I built myself a little playground to flex DOM muscles and JavaScript basics. This quiz throws one question at me at a time, smacks me with green or red feedback instantly, and keeps track of my score. When I finish, I get a victory screen and even the chance to peek back at my answers in a tidy review panel.

## What I Packed In
- Commenting that matches my personality (every file has it)
- Review answers finally behave and stay tucked inside their container
- Keyboard shortcuts so I can speed-run my own quiz: **Enter** to advance, **1–9** to pick answers
- Shuffle toggle, because random chaos is good practice
- Dark comfy styling with obvious correct/incorrect colors

## How I Run It
Just crack open `index.html` in a modern browser. That’s it. No builds, no npm, no drama.

## How I Customize
- Add my own questions in `script.js` inside the `quizData` array (answer is the index of the correct one)
- Dress it up in `style.css` with whatever colors/fonts suit my vibe
- If I want frameworks like Bootstrap/Tailwind, I could — but I left it raw CSS to sharpen fundamentals

## Accessibility Moves
- The quiz screen is polite with `aria-live` so question changes are announced
- Real `<button>`s everywhere (tab-friendly)
- Visible focus outlines for keyboard warriors

## Credits Where Due
I didn’t invent everything — I leaned on trusted sources:
- [Wikipedia – Fisher–Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
- [MDN – Document.querySelector()](https://developer.mozilla.org/docs/Web/API/Document/querySelector)
- [MDN – Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN – typeof](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof)
- [MDN – do...while](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/do...while)
- [MDN – aria-live](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-live)

## License
MIT — remix, learn, share. Just keep the sources list so credit flows back where it belongs.