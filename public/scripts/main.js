document.addEventListener("DOMContentLoaded", function() {

  var testUrl = "https://api.flickr.com/services/rest/?api_key=c41f95395bce6261e24a6d635e97c49b&method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=11968896-72157622466344583&extras=owner_name,url,url_m,url_q";
  var notFound = "http://prettykitty.herokuapp.com/000"
  var badUrl = "https://NotAValidUrl";
  var successHandler = function (data) {
    var json = JSON.parse(data);
    console.log("success got data", json, " with arguments ", arguments);
    $('#log').append($("<h2>").addClass("success").text("success!"));
    $('#log').append($("<div>").addClass("success").text(JSON.stringify(data)));
  };

  var errorHandler = function (data) {
    console.log("error got data", data, " with arguments ", arguments);
  };

  console.log("Requestng exxpects success: ", testUrl);
  BJQ.get(testUrl, successHandler, errorHandler);

  console.log("Requestng exxpects failure: ", notFound);
  BJQ.get(notFound, successHandler, errorHandler);

  // Temporarily turn off lightbox stuff so I can focus on getting my $.get replacement
  // working!
  //
  //Lightbox.addEventListeners(document);
  //Lightbox.loadAndShowGallery("11968896-72157622466344583");
});
