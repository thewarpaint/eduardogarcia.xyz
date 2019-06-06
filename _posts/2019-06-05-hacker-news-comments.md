# Why is collapsing a Hacker News comment so slow?

Comments are organised in a flat structure. In this case, `123456789` is the parent comment and
`234567890` and `345678901` are its children:

```html
<table class="comment-tree">
  <tbody>
    <tr class="athing comtr" id="123456789">
      ...
    </tr>
    <tr class="athing comtr" id="234567890">
      ...
    </tr>
    <tr class="athing comtr" id="345678901">
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
    <tr class="coll athing comtr" id="123456789">
      ...
    </tr>
    <tr class="noshow athing comtr" id="234567890">
      ...
    </tr>
    <tr class="noshow athing comtr" id="345678901">
      ...
    </tr>
    ...
  </tbody>
 </table>
```

There is also a `GET` request to https://news.ycombinator.com/collapse?id=123456789 when
the comment is collapsed if the user is logged in.

This is the structure of the toggle links:

```html
<a class="togg" onclick="return toggle(event, 20108944)">[-]</a>
```

and this is the definition of `toggle` and the rest of the relevant functions:

```js
function toggle (ev, id) {
  var on = !afind($(id), collapsed());
  (on ? addClass : remClass)($(id), 'coll');
  recoll();
  if ($('logout')) {
    new Image().src = 'collapse?id=' + id + (on ? '' : '&un=true');
  }
  ev.stopPropagation();
  return false;
}

function comments () {
  return allof('comtr')
}

function collapsed () {
  return allof('coll')
}

function recoll() {
  aeach(expand, comments());
  aeach(squish, collapsed());
}

function expand (tr) {
  elShow(tr);
  elShow(byClass(tr, 'comment')[0]);
  vis(byClass(tr, 'votelinks')[0], true);
  byClass(tr, 'togg')[0].innerHTML = '[-]';
}

function squish (tr) {
  if (hasClass(tr, 'noshow')) return;
  aeach(noshow, kidsOf(tr.id));
  var el = byClass(tr, 'togg')[0];
  el.innerHTML = '[+' + el.getAttribute('n') + ']';
  noshow(byClass(tr, 'comment')[0]);
  vis(byClass(tr, 'votelinks')[0], false);
}
```

So it's expanding all the comments in the page and then collapsing the ones marked.
