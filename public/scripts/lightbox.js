/* global BJQ, FlickrHelpers, console */

var Lightbox = (function () {
  'use strict';

  var galleryData;
  var current = 0;
  var transitionDuration = 500; // ms duration of opacity transition of main image

  var states = {
    LOADING_GALLERY_DATA: "LOADING_GALLERY_DATA",
    GALLERY_OVERVIEW: "GALLERY_OVERVIEW",
    FOCUSED_ON_PHOTO: "FOCUSED_ON_PHOTO"
  };

  var currentState = states.LOADING_GALLERY_DATA;

  var THUMBNAIL_SIZE = 150;

  var selectors = {
    MAIN_IMAGE: '.LightBox-mainImage',
    MAIN_IMAGE_OWNER: '.LightBox .ImageInfo-owner',
    MAIN_IMAGE_TITLE: '.LightBox .ImageInfo-title',
    MAIN_IMAGE_URL: '.LightBox .ImageInfo-url',
    MAIN_IMAGE_AND_INFO: '.LightBox',
    BACKDROP: '.Lightbox-backdrop',
    CONTROLS_CONTAINER: '.controls-container',
    THUMBNAILS: '.Thumbnails'
  };

  return {

    addEventListeners: function (container) {
      container.getElementById('PreviousButton').addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          Lightbox.goToPrevious();
        }
      );

      container.getElementById('NextButton').addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          Lightbox.goToNext();
        }
      );

      BJQ.getBySelector(selectors.MAIN_IMAGE).addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          Lightbox.goToNext();
        }
      );

      container.addEventListener('keyup', function (event) {
        if (event.keyCode === 39) { // right arrow
          Lightbox.goToNext();
        } else if (event.keyCode === 37) { // left arrow
          Lightbox.goToPrevious();
        } else if (event.keyCode === 27) { // escape key
          Lightbox.switchToState(states.GALLERY_OVERVIEW);
        }
      });
    },

    setGalleryData: function (photos) {
      galleryData = photos;
      current = 0;
    },

    showCurrentPhotoInLightbox: function () {
      return this.showPhotoInLightbox(galleryData.photo[current].id);
    },

    goToNext: function () {
      current = current + 1;
      if (current >= galleryData.photo.length) {
        current = 0;
      }
      this.transitionToCurrentPhoto();
    },

    goToPrevious: function () {
      current = current - 1;
      if (current < 0) {
        current = galleryData.photo.length - 1;
      }
      this.transitionToCurrentPhoto();
    },

    emptyLightbox: function () {
      BJQ.setImage(selectors.MAIN_IMAGE, 'http://localhost:5000/images/transparent.png');
      BJQ.setText(selectors.MAIN_IMAGE_OWNER, '');
      BJQ.setText(selectors.MAIN_IMAGE_TITLE, '');
    },

    transitionToCurrentPhoto: function () {
      var self = this;
      var lightbox = document.querySelector('.LightBox');

      // Step 1: start fading out current image. That will take 0.5 s (see styles.css)
      lightbox.style.opacity = 0;

      // Step 2: after a brief delay, start loading next photo
      window.setTimeout(function () {
        // Empty out the lightbox so that we don't get a flash of the old photo,
        // which we might if the next photo is slow to load.
        // This is a workaround for actually waiting for the photo to load before
        // we start animating it.
        self.emptyLightbox();

        self.showCurrentPhotoInLightbox()
          .success( function () {
            // Step 3: Start animating image opacity back in
            lightbox.style.opacity = 1;
          });

      }, transitionDuration);
    },

    showPhotoInLightbox: function (photoId) {
      FlickrHelpers.loadAndShowMetadata(photoId,
        selectors.MAIN_IMAGE_OWNER,
        selectors.MAIN_IMAGE_TITLE,
        selectors.MAIN_IMAGE_URL
      );
      // We need to redo these calculations every time we load an image,
      // because the container size may have changed
      var containerDimensions = BJQ.getDimensions('.container');
      var largestSizeDesired = {
        width: containerDimensions.width - 50,
        height: containerDimensions.height - BJQ.getBySelector('.ImageInfo').clientHeight
      };
      return FlickrHelpers.loadAndShowImage(photoId, selectors.MAIN_IMAGE, largestSizeDesired);
    },

    loadAndShowGallery: function (galleryId) {
      var self = this;
      self.switchToState(states.LOADING_GALLERY_DATA);
      FlickrHelpers.getGallery(galleryId)
        .success(function (responseText) {
          var galleryInfo = JSON.parse(responseText);
          self.setGalleryData(galleryInfo.photos);
          self.showCurrentPhotoInLightbox();
          self.switchToState(states.GALLERY_OVERVIEW);
          self.makeThumbnails(galleryInfo);
        })
      ;
    },

    makeThumbnails: function (galleryInfo) {
      var thumbnails = BJQ.getBySelector('.Thumbnails');
      var self = this;
      galleryInfo.photos.photo.forEach( function (photo, index) {
        var image = document.createElement("img");
        image.setAttribute('src', photo.url_q);
        image.setAttribute('width', THUMBNAIL_SIZE);
        image.setAttribute('height', THUMBNAIL_SIZE);
        image.setAttribute('data-photo-id', photo.id);
        image.setAttribute('data-index', index);
        image.className = "Thumbnail";
        image.addEventListener('click', self.handleThumbnailClick.bind(self));
        thumbnails.appendChild(image);
      });
    },

    handleThumbnailClick: function (event) {
      current = BJQ.getData(event.target, "index");
      this.switchToState(states.FOCUSED_ON_PHOTO);
      this.transitionToCurrentPhoto();
    },

    switchToState: function (newState) {
      if (currentState === newState) {
        return;
      }

      currentState = newState;
      if (currentState === states.GALLERY_OVERVIEW) {
        this.toggleFocusMode(false);
      } else if (currentState === states.FOCUSED_ON_PHOTO) {
        this.toggleFocusMode(true);
      } else if (currentState === states.LOADING_GALLERY_DATA) {
        this.toggleFocusMode(false);
      } else {
        throw new Error("transitioned to unknown state: ", newState);
      }
    },

    toggleFocusMode: function (focused) {
      if (focused) {
        BJQ.setOpacity(selectors.MAIN_IMAGE_AND_INFO, 1);
        BJQ.setOpacity(selectors.BACKDROP, 0.8);
        // TODO: timing
        BJQ.setDisplay(selectors.BACKDROP, "block");
        BJQ.setDisplay(selectors.MAIN_IMAGE_AND_INFO, "block");
      } else {
        BJQ.setOpacity(selectors.MAIN_IMAGE_AND_INFO, 0);
        BJQ.setOpacity(selectors.BACKDROP, 0);
        // TODO: timing
        BJQ.setDisplay(selectors.BACKDROP, "none");
        BJQ.setDisplay(selectors.MAIN_IMAGE_AND_INFO, "none");
      }
    },

    showControls: function () {
      BJQ.setOpacity(selectors.CONTROLS_CONTAINER, 1);
    },

    hideControls: function () {
      BJQ.setOpacity(selectors.CONTROLS_CONTAINER, 0);
    }
  };
}());

