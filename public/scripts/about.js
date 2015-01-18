/* global BJQ */

var About = (function () {
  'use strict';

  var ABOUT_PANE_SELECTOR = ".about";

  return {
    addEventListeners: function (container) {
      BJQ.getBySelector('#AboutButton').addEventListener(
        'click',
        function () {
          About.toggle(true);
        }
      );

      BJQ.getBySelector('.about').addEventListener(
        'click',
        function () {
          About.toggle(false);
        }
      );

    },

    toggle: function (show) {
      if (show) {
        BJQ.setDisplay(ABOUT_PANE_SELECTOR, 'block');
      } else {
        BJQ.setDisplay(ABOUT_PANE_SELECTOR, 'none');
      }
    }
  };
}());