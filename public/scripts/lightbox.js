/* global BJQ, FlickrHelpers, console */

var Lightbox = (function () {
  'use strict';

  var galleryData;
  var current = 0;
  var TRANSITION_DURATION_MS = 500; // duration of opacity transition of main image. Must match styles.css!
  var THUMBNAIL_SIZE = 150;
  var MAX_GALLERY_SIZE = 30; // if this were a real app, I'd do some paging for large galleries, but...

  var states = {
    LOADING_GALLERY_DATA: "LOADING_GALLERY_DATA",
    GALLERY_OVERVIEW: "GALLERY_OVERVIEW",
    FOCUSED_ON_PHOTO: "FOCUSED_ON_PHOTO"
  };

  var currentState = states.LOADING_GALLERY_DATA;


  var selectors = {
    MAIN_IMAGE: '.LightBox-mainImage',
    MAIN_IMAGE_OWNER: '.LightBox .ImageInfo-owner',
    MAIN_IMAGE_TITLE: '.LightBox .ImageInfo-title',
    MAIN_IMAGE_URL: '.LightBox .ImageInfo-url',
    MAIN_IMAGE_AND_INFO: '.LightBox',
    BACKDROP: '.Lightbox-backdrop',
    CONTROLS_CONTAINER: '.controls-container',
    THUMBNAILS: '.Thumbnails',
    OFFSCREEN_IMAGE: '#OffscreenImage'
  };

  return {

    //// Initial setup //////////////////////////////////////////////////////////////////

    loadAndShowGallery: function (galleryId) {
      var self = this;
      self.switchToState(states.LOADING_GALLERY_DATA);
      FlickrHelpers.getGallery(galleryId)
        .then(function (responseText) {
          self.setGalleryData(JSON.parse(responseText).photos);
          self.switchToState(states.GALLERY_OVERVIEW);
          self.makeThumbnails();
          self.preloadImages();
        })
      ;
    },

    setGalleryData: function (photos) {
      galleryData = photos;
      // Brutally cap the gallery size! Beyond a certain size my UI will start to
      // look bad. For a real app, I'd handle paging.
      galleryData.photo = galleryData.photo.slice(0, MAX_GALLERY_SIZE);
      current = 0;
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

    makeThumbnails: function () {
      var thumbnails = BJQ.getBySelector('.Thumbnails');
      var self = this;
      galleryData.photo.forEach( function (photo, index) {
        var image = document.createElement("img");
        image.setAttribute('src', photo.url_q); // TODO: PUT THIS BACK!!!
        image.setAttribute('width', THUMBNAIL_SIZE);
        image.setAttribute('height', THUMBNAIL_SIZE);
        image.setAttribute('data-photo-id', photo.id);
        image.setAttribute('data-index', index);
        image.className = "Thumbnail";
        image.addEventListener('click', self.handleThumbnailClick.bind(self));
        thumbnails.appendChild(image);
      });
    },

    preloadImages: function () {
      // TODO: It would be nice to skip the preload if we're on mobile
      var maxDimensions = this.maxImageDimensions();
      galleryData.photo.forEach( function (photo, index) {
        setTimeout( function () {
          FlickrHelpers.loadAndShowImage(photo.id, selectors.OFFSCREEN_IMAGE, maxDimensions);
        }, 200 * index);
        // this timeout prevents the early loads from being canceled when
        // we re-assign the offscreen image's source to the next item.
      });
    },





    ///////// Switching between photos and modes //////////////////////////////////

    showCurrentPhotoInLightbox: function () {
      return this.showPhotoInLightbox(galleryData.photo[current].id);
    },

    showPhotoInLightbox: function (photoId) {
      FlickrHelpers.loadAndShowMetadata(photoId,
        selectors.MAIN_IMAGE_OWNER,
        selectors.MAIN_IMAGE_TITLE,
        selectors.MAIN_IMAGE_URL
      );
      // We need to redo these calculations every time we load an image,
      // because the container size may have changed
      return FlickrHelpers.loadAndShowImage(photoId, selectors.MAIN_IMAGE, this.maxImageDimensions());
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
          .then( function () {
            // Step 3: Start animating image opacity back in
            lightbox.style.opacity = 1;
          });

      }, TRANSITION_DURATION_MS);
    },

    emptyLightbox: function () {
      BJQ.setImage(selectors.MAIN_IMAGE, 'http://localhost:5000/images/transparent.png');
      BJQ.setText(selectors.MAIN_IMAGE_OWNER, '');
      BJQ.setText(selectors.MAIN_IMAGE_TITLE, '');
    },

    toggleFocusMode: function (focused) {
      if (focused) {
        BJQ.setOpacity(selectors.MAIN_IMAGE_AND_INFO, 1);
        BJQ.setOpacity(selectors.BACKDROP, 0.8);
        BJQ.setDisplay(selectors.BACKDROP, "block");
        BJQ.setDisplay(selectors.MAIN_IMAGE_AND_INFO, "block");
      } else {
        BJQ.setOpacity(selectors.MAIN_IMAGE_AND_INFO, 0);
        BJQ.setOpacity(selectors.BACKDROP, 0);
        BJQ.waitThen(TRANSITION_DURATION_MS, function () {
          BJQ.setDisplay(selectors.BACKDROP, "none");
          BJQ.setDisplay(selectors.MAIN_IMAGE_AND_INFO, "none");
        });
      }
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

    maxImageDimensions: function () {
      var containerDimensions = BJQ.getDimensions('.container');
      return {
        width: containerDimensions.width - 50,
        height: containerDimensions.height - BJQ.getBySelector('.ImageInfo').clientHeight
      };
    },




    ////// Event handlers //////////////////////////////////////////////////////

    addEventListeners: function (container) {
      BJQ.getBySelector(selectors.MAIN_IMAGE).addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          Lightbox.goToNext();
        }
      );

      BJQ.getBySelector(selectors.BACKDROP).addEventListener(
        'click',
        function (event) {
          event.preventDefault();
          Lightbox.switchToState(states.GALLERY_OVERVIEW);
        }
      );

      container.addEventListener('keyup', function (event) {
        if (event.keyCode === 39) { // right arrow
          event.preventDefault();
          Lightbox.goToNext();
        } else if (event.keyCode === 37) { // left arrow
          event.preventDefault();
          Lightbox.goToPrevious();
        } else if (event.keyCode === 27) { // escape key
          event.preventDefault();
          Lightbox.switchToState(states.GALLERY_OVERVIEW);
        }
      });
    },

    handleThumbnailClick: function (event) {
      current = parseInt(BJQ.getData(event.target, "index"));
      this.switchToState(states.FOCUSED_ON_PHOTO);
      this.transitionToCurrentPhoto();
    },
  };
}());

