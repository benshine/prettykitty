/* global console, $, ChainableGet */

document.addEventListener("DOMContentLoaded", function() {
  'use strict';


  var MAX_TEST_DURATION = 2000; // milliseconds
  var VALID_EXTERNAL_URL = "https://api.flickr.com/services/rest/?api_key=c41f95395bce6261e24a6d635e97c49b&method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=11968896-72157622466344583&extras=owner_name,url,url_m,url_q";
  var URL_THAT_WILL_404 = "http://localhost:5000/non_existent_url";

  var logToPage = function (cssClass, msg) {
    var TEST_OUTPUT_SELECTOR = '[data-test-name=ChainableGet]';
    $(TEST_OUTPUT_SELECTOR + ' .log').append($("<h2>").addClass(cssClass).text(msg));
    console.log(cssClass + ": " + msg);
  };

  var failures = [];
  var passes = [];
  var allTests = [];

  var handleTestPassed = function (testName) {
    passes.push(testName);
    logToPage("success", testName + " passed.");
    if (allTestsCompleted()) {
      logToPage("info", "All tests completed");
    }
  };

  var handleTestFailed = function (testName, message) {
    failures.push(testName);
    logToPage("error", testName + " failed: " + message);
    if (allTestsCompleted()) {
      logToPage("info", "All tests completed");
    }
  };

  var doTest = function (testName, testFunc) {
    allTests.push(testName);
    console.log("Running test: ", testName);
    testFunc();
  };

  var allTestsCompleted = function () {
    var completedTests = failures.concat(passes);
    return allTests.every(function (testName) {
      return completedTests.indexOf(testName) >= 0;
    });
  };

  doTest("testSuccessFlow", function () {
    // This tests both .success and .then
    var expectationsMet = [ false, false ];
    var checkForSuccess = function () {
      if (expectationsMet[0] && expectationsMet[1]) {
        handleTestPassed("testSuccessFlow");
      }
    };

    new ChainableGet().get(VALID_EXTERNAL_URL)
      .success( function () {
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
          }
      ).fail(
        function () {
          handleTestFailed("testSuccessFlow", "unexpected fail handler called");
        }
      );
    }
  );

  doTest("testMultipleSuccesses", function () {
    var expectationsMet = [ false, false, false ];
    var checkForSuccess = function () {
      if (expectationsMet[0] && expectationsMet[1] && expectationsMet[2]) {
        handleTestPassed("testMultipleSuccesses");
      }
    };

    new ChainableGet().get(VALID_EXTERNAL_URL)
      .success(function () {
        expectationsMet[0] = true;
        checkForSuccess();
      })
      .success(function () {
        expectationsMet[1] = true;
        checkForSuccess();
      })
      .success(function () {
        expectationsMet[2] = true;
        checkForSuccess();
      });
  });


  doTest("testErrorHandlingWithFail", function () {
    new ChainableGet().get(URL_THAT_WILL_404)
      .fail(
        function () { handleTestPassed("testErrorHandlingWithFail", "received expected failure call"); }
    ).success(
      function () { handleTestFailed("testErrorHandlingWithFail", "received unexpected success call"); }
    );
  });


  doTest("testErrorHandlingWithThen", function () {
    new ChainableGet()
      .get(URL_THAT_WILL_404)
      .then(
        function () { handleTestFailed("testErrorHandlingWithThen", "received unexpected onResolved call"); },
        function () { handleTestPassed("testErrorHandlingWithThen", "received expected onRejected call"); }
      );
  });

  setTimeout(function () {
    if (allTestsCompleted()) {
      logToPage("info", "All tests completed");
    } else {
      logToPage("error", "Some tests did not complete!");
    }
  }, MAX_TEST_DURATION * allTests.length);

});
