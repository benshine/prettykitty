'use strict';

document.addEventListener("DOMContentLoaded", function() {


  var testOuptutSelector = '[data-test-name=ChainableGet]';
  var MAX_TEST_DURATION = 2000; // milliseconds

  var testUrl = "https://api.flickr.com/services/rest/?api_key=c41f95395bce6261e24a6d635e97c49b&method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=11968896-72157622466344583&extras=owner_name,url,url_m,url_q";
  var notFound = "http://prettykitty.herokuapp.com/000";

  var logToPage = function (cssClass, msg) {
    $(testOuptutSelector + ' .log').append($("<h2>").addClass(cssClass).text(msg));
  };

  var failures = [];
  var passes = [];
  var allTests = [];

  var handleTestPassed = function (testName) {
    passes.push(testName);
    logToPage("success", testName + " passed.");
  };

  var handleTestFailed = function (testName, message) {
    failures.push(testName);
    logToPage("error", testName + " failed: " + message);
  };

  var doTest = function (testName, testFunc) {
    allTests.push(testName);
    console.log("Running test: ", testName);
    testFunc();
  };

  doTest("testSuccessFlow", function () {
    var expectationsMet = [ false, false ];
    var checkForSuccess = function () {
      if (expectationsMet[0] && expectationsMet[1]) {
        completed = true;
        handleTestPassed("testSuccessFlow");
      }
    };
    var completed = false;

    var p1 = new ChainableGet().get(testUrl);

    p1.success( function () {
      expectationsMet[0] = true;
      checkForSuccess();
    })
      .then(
        function () {
          expectationsMet[1] = true;
          checkForSuccess();
        },
        function () {
          handleTestFailed("testSuccessFlow", "unexpected reject handler called");
          completed = true;
        }
    ).fail(
      function () {
        handleTestFailed("testSuccessFlow", "unexpected fail handler called");
        completed = true;
      }
    );

    setTimeout(function () {
      if (!completed) {
        handleTestFailed("testSuccessFlow", "test did not complete before timeout");
      }
    }, MAX_TEST_DURATION );
  });


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


//  testErrorHandling();





});
