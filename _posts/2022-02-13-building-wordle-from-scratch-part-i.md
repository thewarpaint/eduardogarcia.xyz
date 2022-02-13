# Building Wordle from scratch, part I

_This could be interesting for you if you're learning programming, if you know how to program
but you're learning Javascript, or if you're looking for ways to hate Javascript even more._

By now you're probably familiar with the story of Wordle.
So let's jump right into building our own clone from scratch, shall we?

But where to begin? Let's start with a few things that we know for sure are needed:

```js
// We know that both the answers and the guesses have a fixed size, so let's define it here
const WORD_LENGTH = 5;

// Let's define today's answer here
const ANSWER = 'TACOS';

// The result of the evaluation of each letter in a guess vs the answer can be one of these:
// - correct: the letter is in the correct position in the answer (green square)
// - present: the leter is present in the answer, but not in this position (yellow square)
// - absent: the letter is not present in the answer (black square)
const Evaluation = {
  correct: 'correct',
  present: 'present',
  absent: 'absent',
};
```

Nice. Now let's write a key piece of the game logic:

```js
/**
 * Evaluate a guessed word and get the result for each of the guess's letters.
 *
 * @param {String} guess - Guessed word
 * @returns {Array<String>} Evaluation result for each of the guess's letters
 */
function evaluateGuess(guess) {
  const result = [];

  // Iterate through each of the letters of both the guess and the answer
  for (let i = 0; i < WORD_LENGTH; i++) {
    const currentAnswerLetter = ANSWER[i];
    const currentGuessLetter = guess[i];
    let evaluation;

    if (currentAnswerLetter === currentGuessLetter) {
      // First, check if `currentGuessLetter` is in the correct position in `ANSWER`
      evaluation = Evaluation.correct;
    } else if (ANSWER.includes(currentGuessLetter)) {
      // Then, check if `currentGuessLetter` is in *any* position in `ANSWER`
      // String#includes is not the most efficient way to check if `currentGuessLetter` is part of `ANSWER`!
      // However, slightly inefficient but simple and readable is the right trade-off for now
      evaluation = Evaluation.present;
    } else {
      // Else, `currentGuessLetter` is not part of `ANSWER`
      evaluation = Evaluation.absent;
    }

    // Add the current letter evaluation to the result array
    result.push(evaluation);
  }

  return result;
}
```

Looking good. Let's try it.

```js
const guess = 'ARSON';

evaluationResult = evaluateGuess(guess);
console.log(evaluationResult);
```

```js
[ 'present', 'absent', 'present', 'correct', 'absent' ]
```

This means that:
- `A` is present in the answer, but not in this position (yellow square)
- `R` is not present in the answer (black square)
- `S` is present in the answer, but not in this position (yellow square)
- `O` is in the correct position in the answer (green square)
- `N` is not present in the answer (black square)

It's a bit tedious to analyse the result this way, so let's write a function to have a first
graphical approximation of the evaluation result.

```js
/**
 * Build a string with color escape codes for a terminal or the browser's console
 *
 * @param {String} guess - Guessed word
 * @param {Array<String>} evaluationResult - The output of `evaluateGuess` for the guessed word
 * @returns {String} Formatted string ready for output through a terminal or the browser's console
 */
function getFormattedEvaluationResult(guess, evaluationResult) {
  // Foreground color, background color and reset ANSI escape codes
  // https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit
  const FG_BLACK = '\x1b[30m';
  const BG_GRAY = '\x1b[100m';
  const BG_GREEN = '\x1b[42m';
  const BG_YELLOW = '\x1b[43m';
  const RESET = '\x1b[0m';

  let formattedResult = '';

  // Iterate through each of the letters of the guess
  for (let i = 0; i < WORD_LENGTH; i++) {
    const currentGuessLetter = guess[i];
    let bgColor;

    // Pick the background color based on the evaluation result for the current letter
    if (evaluationResult[i] == Evaluation.correct) {
      bgColor = BG_GREEN;
    } else if (evaluationResult[i] == Evaluation.present) {
      bgColor = BG_YELLOW;
    } else {
      bgColor = BG_GRAY;
    }

    // Append the output for the current letter to the string we will return
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    formattedResult += `${FG_BLACK}${bgColor} ${currentGuessLetter} ${RESET}`;
  }

  return formattedResult;
}
```

Let's see how it looks like.

```js
console.log(getFormattedEvaluationResult(guess, evaluationResult));
```

```sh
 A  R  S  O  N
```

Ah, that's not very telling. You should see something like this in your terminal:

![Wordle: formatted evaluation result](https://raw.githubusercontent.com/thewarpaint/eduardogarcia.xyz/master/assets/images/wordle--terminal-arson.png)
