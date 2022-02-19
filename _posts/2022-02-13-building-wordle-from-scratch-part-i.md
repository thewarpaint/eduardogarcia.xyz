# Building Wordle from scratch, part I

_This could be interesting for you if you're learning programming, if you know how to program
but you're learning Javascript, or if you're looking for ways to hate Javascript even more._

By now you're probably familiar with
[the](https://www.nytimes.com/2022/01/03/technology/wordle-word-game-creator.html)
[story](https://twitter.com/powerlanguish)
[of](https://trends.google.com/trends/explore?date=today%203-m&q=wordle)
[Wordle](https://www.nytimes.com/2022/01/31/business/media/new-york-times-wordle.html).
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

So, it looks like it's working. Let's write some tests to make sure it is. What scenarios do we need to cover?

First, the one we just tested (the word has only some matches):

```js
const guessWithSomeMatches = 'ARSON';
const expectedSomeMatchesResult = [
  Evaluation.present, // 'A' is present but not in this position
  Evaluation.absent,  // 'R' is absent from the answer
  Evaluation.present, // 'S' is present but not in this position
  Evaluation.correct, // 'O' is correct in this position
  Evaluation.absent,  // 'N' is absent from the answer
];

const someMatchesResult = evaluateGuess(guessWithSomeMatches);
const someMatchesErrorMessage =
  `Expected a guess with some matches to have result: ${getFormattedResult(expectedSomeMatchesResult)}` +
  ` but found: ${getFormattedResult(someMatchesResult)}`;
```

Then, the guess word has no matches:

```js
const guessWithNoMatches = 'NERDY';
const expectedNoMatchesResult = [
  Evaluation.absent, // 'N' is absent from the answer
  Evaluation.absent, // 'E' is absent from the answer
  Evaluation.absent, // 'R' is absent from the answer
  Evaluation.absent, // 'D' is absent from the answer
  Evaluation.absent, // 'Y' is absent from the answer
];

console.assert(areResultsEqual(
  evaluateGuess(guessWithNoMatches),
  expectedNoMatchesResult
), `Expected a guess with no matches to have result: [${expectedNoMatchesResult.join(', ')}]`);
```

Now let's cover anagrams of the solution, i.e. all the letters are present but in a different order:

```js
const guessWithAllMatches = 'COSTA';
const expectedAllMatchesResult = [
  Evaluation.present, // 'C' is present but not in this position
  Evaluation.present, // 'O' is present but not in this position
  Evaluation.present, // 'S' is present but not in this position
  Evaluation.present, // 'T' is present but not in this position
  Evaluation.present, // 'A' is present but not in this position
];

const allMatchesResult = evaluateGuess(guessWithAllMatches);
const allMatchesErrorMessage =
  `Expected a guess with some matches to have result: ${getFormattedResult(expectedAllMatchesResult)}` +
  ` but found: ${getFormattedResult(allMatchesResult)}`;

console.assert(areResultsEqual(
  allMatchesResult,
  expectedAllMatchesResult
), allMatchesErrorMessage);
```

Finally, the guess is the solution:

```js
const exactGuess = 'TACOS';
const expectedExactGuessResult = [
  Evaluation.correct, // 'T' is correct in this position
  Evaluation.correct, // 'A' is correct in this position
  Evaluation.correct, // 'C' is correct in this position
  Evaluation.correct, // 'O' is correct in this position
  Evaluation.correct, // 'S' is correct in this position
];

const exactGuessResult = evaluateGuess(exactGuess);
const exactGuessErrorMessage =
  `Expected a guess with some matches to have result: ${getFormattedResult(expectedExactGuessResult)}` +
  ` but found: ${getFormattedResult(exactGuessResult)}`;

console.assert(areResultsEqual(
  exactGuessResult,
  expectedExactGuessResult
), exactGuessErrorMessage);
```

We need to do the array comparison ourselves, comparing them directly with `===` won't work:

```js
/**
 * Determine if two results are equal.
 *
 * @param {Array<String>} resultA - An array of evaluation results
 * @param {Array<String>} resultB - An array of evaluation results
 * @returns {Boolean} If both results passed are equal
 */
function areResultsEqual(resultA, resultB) {
  if (resultA.length !== resultB.length) {
    return false;
  }

  for (let i = 0; i < resultA.length; i++) {
    if (resultA[i] !== resultB[i]) {
      return false;
    }
  }

  return true;
}
```

That's it for today! Although we still have a long way to go, we now have an important part of the
game mechanics working and tests that cover all possible scenarios.
