# Why is collapsing a Hacker News comment so slow?

*Disclaimer: I love HN, it's an awesome forum, not intending to throw shade at anyone, just genuinely curious.*

I own a 2016 Moto g4 plus and every time I collapse a comment in Hacker News it takes a whole second before the UI is responsive again. Why would that be? Let's find out.

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

and this is the definition of `toggle` and the rest of the relevant functions (comments added by me, some indentation changed for readability):

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

// Returns all elements of class .comtr in the document
function comments () {
  return allof('comtr')
}

// Returns all elements of class .coll in the document
function collapsed () {
  return allof('coll')
}

function recoll() {
  // Expand all comments
  aeach(expand, comments());

  // Collapse the comments marked as `.coll` and all its children
  aeach(squish, collapsed());
}

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

// Returns an array of the <tr> elements for the children comments from a comment id
function kidsOf (id) {
  var ks = [];
  var trs = comments();

  // Get the position of the provided comment id in the comments array
  var i = apos($(id), trs);

  // From the provided id, get the position of the next comment with a level equal or less than the level
  // of the provided comment, and then return a slice of the comments array with those positions.
  if (i >= 0) {
    ks = acut(trs, i + 1);
    var n = ind($(id));
    var j = apos(function(tr) {return ind(tr) <= n}, ks);
  
    if (j >= 0) {
      ks = acut(ks, 0, j)
    }
  }
  return ks;
}
```

So here's what's happening:

1. all comments are expanded (first `comments()` call)
2. all the comments marked as `.coll` and its children are collapsed
   a. for each `.coll` comment there's a `comments()` call

How would you fix it? Would you render the comments in a hierarchical structure to make
hiding and showing children easier? Would you add additional classes and use modern DOM selection
methods to improve the performance? Would you mark it as WONTFIX because it probably only affects
people with an old Moto g4 Plus?
