/* global console, $, betterGet */

document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  var MAX_TEST_DURATION = 2000; // milliseconds
  var VALID_EXTERNAL_URL = "https://api.flickr.com/services/rest/?api_key=c41f95395bce6261e24a6d635e97c49b&method=flickr.galleries.getPhotos&format=json&nojsoncallback=1&gallery_id=11968896-72157622466344583&extras=owner_name,url,url_m,url_q";
  var URL_THAT_WILL_404 = "http://localhost:5000/non_existent_url";

  var logToPage = function (cssClass, msg) {
    var TEST_OUTPUT_SELECTOR = '[data-test-name=BetterGet]';
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
    testFunc(testName);
  };

  var allTestsCompleted = function () {
    var completedTests = failures.concat(passes);
    return allTests.every(function (testName) {
      return completedTests.indexOf(testName) >= 0;
    });
  };

  doTest("testSuccessFlow", function (testName) {
    // This tests a successful promise
    var expectationsMet = [ false, false ];
    var checkForSuccess = function () {
      if (expectationsMet[0] && expectationsMet[1]) {
        handleTestPassed(testName);
      }
    };

    betterGet(VALID_EXTERNAL_URL)
      .then( function () {
        expectationsMet[0] = true;
        checkForSuccess();
      })
        .then(
          function () {
            expectationsMet[1] = true;
            checkForSuccess();
          },
          function () {
            handleTestFailed(testName, "unexpected reject handler called");
          }
      ).catch(
        function () {
          handleTestFailed(testName, "unexpected fail handler called");
        }
      );
    }
  );

  doTest("testMultipleSuccesses", function (testName) {
    var expectationsMet = [ false, false, false ];
    var checkForSuccess = function () {
      if (expectationsMet[0] && expectationsMet[1] && expectationsMet[2]) {
        handleTestPassed(testName);
      }
    };

    betterGet(VALID_EXTERNAL_URL)
      .then(function () {
        expectationsMet[0] = true;
        checkForSuccess();
      })
      .then(function () {
        expectationsMet[1] = true;
        checkForSuccess();
      })
      .then(function () {
        expectationsMet[2] = true;
        checkForSuccess();
      });
  });


  doTest("testErrorHandling", function (testName) {
    betterGet(URL_THAT_WILL_404)
      .catch(
        function () { handleTestPassed(testName, "received expected failure call"); }
    ).catch(
      function () { handleTestFailed(testName, "received unexpected success call"); }
    );
  });


  doTest("testErrorHandlingWithThen", function (testName) {
    betterGet(URL_THAT_WILL_404)
      .then(
        function () { handleTestFailed(testName, "received unexpected onResolved call"); },
        function () { handleTestPassed(testName, "received expected onRejected call"); }
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
