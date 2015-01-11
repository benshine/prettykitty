'use strict';

document.addEventListener("DOMContentLoaded", function() {


  // These tests are just for me to debug/develop with -- they don't actually
  //  pass or fail in a meaningful way

  var testOuptutSelector = '[data-test-name=ChainableGet]';

  var testUrl = "https://api.flickr.com/services/rest/?api_key=c41f95395bce6261e24a6d635e97c49b&method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=11968896-72157622466344583&extras=owner_name,url,url_m,url_q";
  var notFound = "http://prettykitty.herokuapp.com/000";

  var logToPage = function (cssClass, msg) {
    $(testOuptutSelector + ' .log').append($("<h2>").addClass(cssClass).text(msg));
  };

  var failures = [];
  var passes = [];

  var failTest = function (testName, message) {
    failures.push({
      testName: testName,
      message: message
    });

    logToPage("error", "Failed test " + testName + ": " + message);
  };

  var testPassed = function (testName) {
    passes.push(testName);
    logToPage("success", testName + " passed.");
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
    var testName = "testNiceGet";
    console.log("testNiceGet");
    var p1 = new ChainableGet().get(testUrl);

    p1.success( successHandler )
      .then(
      function (data) { console.log("ooh it's my SECOND success handler"); },
      function (reason) {
        failTest(testName, "unexpected reject  handler called");
        console.error("why do i need a reject handler? ", reason);
      }
    );
    p1.then(successHandler, errorHandler);
  };


  logToPage("", "Starting tests...");


  var testErrorHandling = function () {
    console.log("testErrorHandling: ", notFound);
    var p2 = new ChainableGet().get(notFound);

    //.fail(function (reason) {
    //  console.log("My VERY OWN error handler!!! #1", reason);
    //})
    //.fail(function (reason) {
    //  console.log("ANOTHER error handler!!! #2", reason);
    //});
    //  .then(successHandler, errorHandler);
  };


  // The interaction of testNiceGet and testErrorHandling cause testNiceGet to fail.
  testNiceGet();
  testErrorHandling();





});
