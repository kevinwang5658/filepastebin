'use strict';

const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

let hub = new HubRegistry(["tasks/*.js"]);

gulp.registry(hub);