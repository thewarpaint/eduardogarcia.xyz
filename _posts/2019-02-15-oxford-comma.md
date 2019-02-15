# Oxford comma

> Who gives a fuck about an Oxford comma?
>
> — Vampire Weekend

I want to display a list of terms using an Oxford comma.

Let's define the expected results:

```js
oxfordComma(['fire'])
=> 'fire'

oxfordComma(['fire', 'fury'])
=> 'fire and fury'

oxfordComma(['fire', 'fury', 'frankly power'])
=> 'fire, fury, and frankly power'
```

First let's do the obvious solution. I consciously avoided `pop` so `terms` is not modified.

```js
function oxfordComma(terms) {
  if (terms.length === 1) {
    return terms[0];
  }

  if (terms.length === 2) {
    return terms.join(' and ');
  }

  return terms.slice(0, terms.length - 1).join(', ') + ', and ' + terms.slice(-1);
}
```

Pretty straightforward and readable, but maybe a bit verbose.

Does it make sense to try to use `reduce`?

```js
function oxfordComma(terms) {
  return terms.reduce((result, term, i) => {
    if (i === 0) {
      return term;
    }

    if (i === terms.length - 1) {
      return result + (terms.length === 2 ? '' : ',') + ' and ' + term;
    }

    return result + ', ' + term;
  }, '');
}
```

Not really. Looks more complex than the previous one. Perhaps because with `reduce` it's not very "clean" to
use the length of the array. If you have a better `reduce` solution, please let me know.

I couldn't think of better ways to solve it so I started googling and found these:

[The RegExp solution.](https://codegolf.stackexchange.com/a/37654) Join the `terms` array, then prepend "and"
to the last term, using an Oxford comma if a third term exists.

I edited the original code (from a Code Golf challenge) for readability.

```js
function oxfordComma(terms) {
  return terms
    .join(', ')
    .replace(/,([^,]+)$/, `${terms[2] ? ',' : ''} and$1`);
}
```

[The CSS solution.](https://codegolf.stackexchange.com/a/37668) Very clever if you ask me. If the use case
is only formatting terms on the view, might be the best solution.

```html
<p>
  <a>fire</a>
</p>
<p>
  <a>fire</a>
  <a>fury</a>
</p>
<p>
  <a>fire</a>
  <a>fury</a>
  <a>frankly power</a>
</p>
```

```css
a:not(:last-child):nth-child(n+2)::after,
a:nth-last-child(n+3)::after {
  content: ",";
}

a + :last-child::before {
  content: "and ";
}
```
