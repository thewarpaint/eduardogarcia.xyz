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
