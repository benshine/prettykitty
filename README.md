# prettykitty
## a slideshow viewer for cat pics

I'm working on this as an exercise in life without jquery or css frameworks.

The live app is deployed to [heroku](https://prettykitty.herokuapp.com/).

### Ingredients

- sinatra
- haml
- ruby 2.1.5

[BJQ.js ("Benji's jQuery")](https://github.com/benshine/prettykitty/blob/master/public/scripts/lib/bjq.js)
is my miniature jquery replacement, and
[betterGet](https://github.com/benshine/prettykitty/blob/master/public/scripts/lib/better-get.js)
is my $.get replacement. Neither of those accept all the parameters and options that jQuery function do,
and they haven't been tested outside of Chrome, but they do the basic things I need for this
application.

Most of the application code is in
[lightbox.js](https://github.com/benshine/prettykitty/blob/master/public/scripts/lightbox.js)

If you want to use your own gallery, edit the gallery id in
[main.js](https://github.com/benshine/prettykitty/blob/master/public/scripts/main.js).
To get the gallery id for your gallery, use the
[Flickr API explorer](https://www.flickr.com/services/api/explore/flickr.urls.lookupGallery)

### To run:
    bundle install
    foreman start
    open http://localhost:5000

### Stuff I'd like to do
- better indicators for loading and error states
- ability to set a different gallery
- look better on mobile
- concatenate all the js files together so I don't have to worry about load order
- write my own versions of the es6 polyfill functions for Array.prototype.find and Object.assign

### Stuff I'm deliberately not going to do, for now:

- Make it work on old browsers or without javascript. My focus here is on writing
  javascript without libraries, using web standards, not on progressive enhancement.
- Write more tests. This is a prototype and an exercise to force me to learn new techniques.
  I'm already pretty good at writing exhaustive javascript tests, thanks to the
  mentorship of co-workers at Twitter. Writing a mock/stub and test DSL library
  from scratch would be a useful exercise, but it's not my focus for today. I did,
  however, write a few tests of my $.get replacement at http://localhost:5000/tests --
  that had some gnarly async and scope challenges that made automated tests very useful.
  Note that my tests use jquery; let's interpret "no libraries" as "no libraries
  in application code."

