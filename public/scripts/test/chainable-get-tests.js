document.addEventListener("DOMContentLoaded", function() {

  var testOuptutSelector = '[data-test-name=ChainableGet]';

  var testUrl = "https://api.flickr.com/services/rest/?api_key=c41f95395bce6261e24a6d635e97c49b&method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=11968896-72157622466344583&extras=owner_name,url,url_m,url_q";
  var notFound = "http://prettykitty.herokuapp.com/000";

  var logToPage = function (cssClass, msg ) {
    $(testOuptutSelector + ' .log').append($("<h2>").addClass(cssClass).text(msg));
  };

  var successHandler = function (data) {
    var json = JSON.parse(data);
    console.log("success got data", json, " with arguments ", arguments);
    logToPage("success", "success!");
  };

  var errorHandler = function (data) {
    $(testOuptutSelector + ' .log').append($("<h2>").addClass("error").text("error!"));
    console.log("error got data", data, " with arguments ", arguments);
  };

  var testNiceGet = function () {
    var p1 = new ChainableGet().get(testUrl);
    p1.success( successHandler)
      .then(
      function (data) { console.log("ooh it's my SECOND success handler"); },
      function (reason) {
        console.error("why do i need a reject handler? ")
      }
    );
    p1.then(successHandler, errorHandler);
  };


  logToPage("", "Starting tests...");


  var testErrorHandling = function () {
    console.log("Requestng exxpects failure: ", notFound);
    var p2 = new ChainableGet().get(notFound);

    //.fail(function (reason) {
    //  console.log("My VERY OWN error handler!!! #1", reason);
    //})
    //.fail(function (reason) {
    //  console.log("ANOTHER error handler!!! #2", reason);
    //});
    //  .then(successHandler, errorHandler);
  };


  testNiceGet();
  testErrorHandling();





});
