/* global BJQ, FlickrHelpers, console */

var Lightbox = (function () {
  'use strict';

  var galleryData;
  var current = 0;
  var transitionDuration = 500; // ms duration of opacity transition of main image

  var LOADING = "LOADING";
  var LOAD_COMPLETED = "LOAD_COMPLETED";
  var currentState = LOADING;

  var THUMBNAIL_SIZE = 75;

  var selectors = {
    MAIN_IMAGE: '.LightBox-mainImage',
    MAIN_IMAGE_OWNER: '.LightBox .ImageInfo-owner',
    MAIN_IMAGE_TITLE: '.LightBox .ImageInfo-title',
    MAIN_IMAGE_URL: '.LightBox .ImageInfo-url',
    MAIN_IMAGE_AND_INFO: '.LightBox',
    CONTROLS_CONTAINER: '.controls-container'
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
          console.log("yep");
          event.preventDefault();
          Lightbox.goToNext();
        }
      );

      container.addEventListener('keyup', function (event) {
        if (event.keyIdentifier === "Right") {
          Lightbox.goToNext();
        } else if (event.keyIdentifier === "Left") {
          Lightbox.goToPrevious();
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
      self.switchToState(LOADING);
      FlickrHelpers.getGallery(galleryId)
        .success(function (responseText) {
          var galleryInfo = JSON.parse(responseText);
          self.setGalleryData(galleryInfo.photos);
          self.showCurrentPhotoInLightbox();
          self.switchToState(LOAD_COMPLETED);
          self.makeThumbnails(galleryInfo);
        })
      ;
    },

    makeThumbnails: function (galleryInfo) {
      var thumbnails = BJQ.getBySelector('.Thumbnails');
      galleryInfo.photos.photo.forEach( function (photo) {
        var image = document.createElement("img");
        image.setAttribute('src', photo.url_q);
        image.setAttribute('width', 75);
        image.setAttribute('height', 75);
        image.setAttribute('data-photo-id', photo.id);
        thumbnails.appendChild(image);
      });
    },

    switchToState: function (newState) {
      if (currentState === newState) {
        return;
      }

      if (newState === LOAD_COMPLETED) {
        this.showControls();
        currentState = LOAD_COMPLETED;
        document.querySelector(selectors.MAIN_IMAGE_AND_INFO).style.opacity = 1;
      } else if (newState === LOADING) {
        currentState = LOADING;
        this.hideControls();
      } else {
        throw new Error("transitioned to unknown state: ", newState);
      }
    },

    showControls: function () {
      document.querySelector(selectors.CONTROLS_CONTAINER).style.opacity = 1;
    },

    hideControls: function () {
      document.querySelector(selectors.CONTROLS_CONTAINER).style.opacity = 0;
    }
  };
}());

