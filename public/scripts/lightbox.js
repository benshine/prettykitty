var Lightbox = (function () {
  var galleryData = undefined;
  var current = 0;
  return {

    setGalleryData: function (photos) {
      galleryData = photos;
      current = 0;
    },

    showCurrentPhotoInLightbox: function () {
      console.log(galleryData);
      this.showPhotoInLightbox(galleryData.photo[current].id);
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
      FlickrHelpers.loadAndShowImage(photoId, '.LightBox .LightBox-mainImage')
        .then(function () {
          console.log("and then...");
        });
    },

    loadAndShowGallery: function (galleryId) {
      var self = this;
      FlickrHelpers.getGallery(galleryId).success(function (responseData) {
        self.setGalleryData(responseData.photos);
        self.showCurrentPhotoInLightbox();

      });
    }
  }
}());

