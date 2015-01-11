# prettykitty
## a slideshow viewer for cat pics

I'm working on this as an exercise in life without jquery or css frameworks.

The live app (still a work in progress!) is deployed to [heroku](https://prettykitty.herokuapp.com/)

First I'm building it with a few jquery calls, but wrapping all jquery calls in my own
object. The only jquery call left is $.get and calls to success/error callbacks
on the jqXHR it returns.

### Ingredients

- sinatra
- haml
- ruby 2.1.5

### To run:
    bundle install
    foreman start
    open http://localhost:5000

### Stuff I'd like to do to consider this complete:

- write my own version of $.get
- position the lightboxed photo in the center of the viewport
- write my own versions of the es6 polyfill functions for Array.prototype.find and Object.assign
- transitions between photos
- ability to set a different gallery
- concatenate all the js files together so I don't have to worry about load order
- display of loading and error states
- make it look decent on small screens
- jshint

### Stuff I'm deliberately not going to do, for now:

- Make it work on old browsers or without javascript. My focus here is on writing
  javascript without libraries, using web standards, not on progressive enhancement.
- Write tests. This is a prototype and an exercise to force me to learn new techniques.
  I'm already pretty good at writing exhaustive javascript tests, thanks to the
  mentorship of co-workers at Twitter. Writing a mock/stub and test DSL library
  from scratch would be a useful exercise, but it's not my focus for today.

