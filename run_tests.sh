#!/usr/bin/env bash
mocha ./test/rect_helper_test.js
mocha-phantomjs ./test/test.html -v 500x500
