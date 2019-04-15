'use strict';

const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

let hub = new HubRegistry(["gulp-tasks/*.js"]);

gulp.registry(hub);