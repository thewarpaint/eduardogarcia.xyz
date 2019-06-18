# Why is collapsing a Hacker News comment so slow?

*Disclaimer: I love HN, it's an awesome forum, not intending to throw shade at anyone, just genuinely curious.*

I own a 2016 Moto G4 Plus and use Chrome. Sometimes when I toggle a comment thread in Hacker News it takes a whole second
for the UI to update. Why would that be?

Comments are organised in a flat structure. Let's use this comment tree as an example:

```
- comment 1234567
  - comment 2345678
    - comment 3456789
```

This is the corresponding (simplified) DOM representation:

```html
<table class="comment-tree">
  <tbody>
    <tr class="athing comtr" id="1234567">
      ...
    </tr>
    <tr class="athing comtr" id="2345678">
      ...
    </tr>
    <tr class="athing comtr" id="3456789">
      ...
    </tr>
    ...
  </tbody>
</table>
```

Collapsing a comment thread adds the `coll` class to the parent comment and the `noshow`
class to every child comment:

```html
<table class="comment-tree">
  <tbody>
    <tr class="coll athing comtr" id="1234567">
      ...
    </tr>
    <tr class="noshow athing comtr" id="2345678">
      ...
    </tr>
    <tr class="noshow athing comtr" id="3456789">
      ...
    </tr>
    ...
  </tbody>
 </table>
```

There is also a `GET` request to https://news.ycombinator.com/collapse?id=1234567 to save the state of the
collapsed/expanded comment if the user is logged in, but it's an async request so it doesn't have an impact.

This is the structure of the toggle links:

```html
<a class="togg" onclick="return toggle(event, 1234567)">[-]</a>
```

All following JS snippets extracted from [https://news.ycombinator.com/hn.js](https://news.ycombinator.com/hn.js),
comments added by me, some indentation changed for readability.

This is the definition of `toggle`:

```js
function toggle (ev, id) {
  // Determine if the id to toggle is in the collapsed elements
  var on = !afind($(id), collapsed());
  (on ? addClass : remClass)($(id), 'coll');

  recoll();

  // If the user is logged in, save the state of the collapsed/expanded comment
  if ($('logout')) {
    new Image().src = 'collapse?id=' + id + (on ? '' : '&un=true');
  }

  ev.stopPropagation();
  return false;
}
```

There are helper functions to retrieve the comments and the collapsed comments:

```js
// Returns all elements of class .comtr in the document
function comments () {
  return allof('comtr')
}

// Returns all elements of class .coll in the document
function collapsed () {
  return allof('coll')
}
```

There's a function that "resets the collapsed state" of the comments by expanding them all and then collapse the marked ones:

```js
function recoll() {
  // Expand all comments
  aeach(expand, comments());

  // Collapse the comments marked as `.coll` and all its children
  aeach(squish, collapsed());
}
```

These are the functions that expand and collapse (squish) a comment's `<tr>`:

```js
function expand (tr) {
  elShow(tr);
  elShow(byClass(tr, 'comment')[0]);

  // Set `visibility: visible` for the .votelinks element
  vis(byClass(tr, 'votelinks')[0], true);
  byClass(tr, 'togg')[0].innerHTML = '[-]';
}

function squish (tr) {
  if (hasClass(tr, 'noshow')) return;

  // Hide all the children comments of this comment id
  aeach(noshow, kidsOf(tr.id));

  var el = byClass(tr, 'togg')[0];
  el.innerHTML = '[+' + el.getAttribute('n') + ']';
  noshow(byClass(tr, 'comment')[0]);
  vis(byClass(tr, 'votelinks')[0], false);
}
```

There's a function to retrieve the array of `<tr>` elements for the children comments from the parent comment id
(this one was a bit tricky to decipher):

```js
function kidsOf (id) {
  var ks = [];
  var trs = comments();

  // Get the position of the provided comment id in the comments array
  var i = apos($(id), trs);

  // From the provided id, get the position of the next comment with a level equal or less than the level
  // of the provided comment, and then return a slice of the comments array from these positions.
  if (i >= 0) {
    // Same as Array.prototype.slice.call(trs, i + 1)
    ks = acut(trs, i + 1);
    // Get the level of the comment in the tree
    var n = ind($(id));

    // Get the position of the next comment with a level equal or less than the level of the current comment
    var j = apos(function (tr) { return ind(tr) <= n }, ks);

    if (j >= 0) {
      // Same as Array.prototype.slice.call(ks, 0, j)
      ks = acut(ks, 0, j)
    }
  }

  return ks;
}
```

And finally there's a function to get the "level" of a comment from the padding image's width:

```js
function ind (el) {
  return (byTag(el, 'img')[0] || {}).width
}
```

So here's what's happening:

1. all comments are expanded (first `comments()` call)
2. all the comments marked as `.coll` and its children are collapsed
   1. for each `.coll` element there's an additional `comments()` call, then that array is traversed to find the children comments
   2. getting the level of a comment from a DOM element's `width` is expensive, as it forces reflow


## How would you fix it?

Let's suppose that somehow you got access to the HN repo. What would you do? I can think of two options:

### Without modifying the server-side HTML

- After the page is loaded, build a data structure to avoid:
   - Getting the comment tree on every toggle
   - Getting the comment level from a DOM element's `width`
- Changing the algorithm to just deal with the affected subtree instead of expanding everything, then collapsing
   the marked comments

### With modifications to the server-side HTML

- Render the comments in a hierarchical structure to make hiding and showing children way easier
- or: adding the comment level as a `data` attribute and changing the algorithm to just deal with the affected subtree
   instead of expanding everything, then collapsing the marked comments


Thanks to Ixai L. for reading a draft of this post and providing feedback.
