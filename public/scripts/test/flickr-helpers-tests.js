/* global console, $, FlickrHelpers */

document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  var MAX_TEST_DURATION = 2000; // milliseconds


  var logToPage = function (cssClass, msg) {
    var TEST_OUTPUT_SELECTOR = '[data-test-name=FlickrHelpers]';
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

  var testBestSize = function(testName, photoId, sizeDescriptor, expectedResult) {
    FlickrHelpers.getLargestUpTo(photoId, sizeDescriptor).then(function (photoData) {
      if (photoData.width === expectedResult.width
        && photoData.height === expectedResult.height
        && photoData.source === expectedResult.source
      ) {
        handleTestPassed(testName);
      } else {
        console.log(testName + ": photoData: ", photoData);
        handleTestFailed(testName, "Received " + photoData);
      }
    }).catch(function (info) {
      handleTestFailed(testName, "Rejection: " + info);
    });
  };

  doTest("test getLargestUpTo thumbnail", function (testName) {
    testBestSize(testName, 2805432983, {
      width: 102, height: 72
    }, {
      width: 100,
      height: 71,
      source: "https://farm4.staticflickr.com/3086/2805432983_c11bc875f4_t.jpg"
    });
  });

  doTest("test getLargestUpTo medium 640", function (testName) {
    testBestSize(testName, 2805432983, {
      width: 650, height: 500
    }, {
      width: 640,
      height: 457,
      source: "https://farm4.staticflickr.com/3086/2805432983_c11bc875f4_z.jpg?zz=1"
    });
  });

  doTest("test getLargestUpTo expected not to find a match", function (testName) {
    FlickrHelpers.getLargestUpTo(2805432983, {width: 1, height: 1}
    ).then(function (photoData) {
      handleTestFailed(testName, "Found a match but we expected to fail " + photoData);
    }).catch(function (info) {
      handleTestPassed(testName);
    });
  });

  setTimeout(function () {
    if (allTestsCompleted()) {
      logToPage("info", "All tests completed");
    } else {
      logToPage("error", "Some tests did not complete!");
    }
  }, MAX_TEST_DURATION * allTests.length);

});
