'use strict';

var Lightbox = (function () {
  var galleryData = undefined;
  var current = 0;

  var LOADING = "LOADING";
  var LOAD_COMPLETED = "LOAD_COMPLETED";
  var currentState = LOADING;

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
      this.showCurrentPhotoInLightbox();
    },

    goToPrevious: function () {
      current = current - 1;
      if (current < 0) {
        current = galleryData.photo.length - 1;
      }
      this.showCurrentPhotoInLightbox();
    },

    showPhotoInLightbox: function (photoId) {
      FlickrHelpers.loadAndShowMetadata(photoId,
        '.LightBox .ImageInfo-owner',
        '.LightBox .ImageInfo-title',
        '.LightBox .ImageInfo-url'
      );
      return FlickrHelpers.loadAndShowImage(photoId, '.LightBox .LightBox-mainImage');
    },

    loadAndShowGallery: function (galleryId) {
      var self = this;
      self.switchToState(LOADING)
      FlickrHelpers.getGallery(galleryId)
        .success(function (responseText) {
          self.setGalleryData(JSON.parse(responseText).photos);
          self.showCurrentPhotoInLightbox().success(
            function () {
              self.switchToState(LOAD_COMPLETED)
            }
          )
        })
      ;
    },

    switchToState: function (newState) {
      if (currentState === newState) {
        return;
      }

      if (newState === LOAD_COMPLETED) {
        this.showControls();
        currentState = LOAD_COMPLETED;
      } else if (newState === LOADING) {
        currentState = LOADING;
        this.hideControls();
      } else {
        throw new Error("transitioned to unknown state: ", newState);
      }
    },

    showControls: function () {
      document.querySelector('.controls-container').style.opacity = 1;
    },

    hideControls: function () {
      document.querySelector('.controls-container').style.opacity = 0;
    }
  }
}());

