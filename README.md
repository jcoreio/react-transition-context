# react-transition-context

[![CircleCI](https://circleci.com/gh/jcoreio/react-transition-context.svg?style=svg)](https://circleci.com/gh/jcoreio/react-transition-context)
[![Coverage Status](https://codecov.io/gh/jcoreio/react-transition-context/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/react-transition-context)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-transition-context.svg)](https://badge.fury.io/js/react-transition-context)

Helps you deal with nested transitions

# Introduction

These days it's fairly easy to animate transitions between your app routes using
React components. But it adds difficulty to other things, like focusing an
input when a form appears. If the form is part of the initial page load, the
input should be focused immediately after mounting. But if you transition to
the form from some other route, the input shouldn't be focused until the
transition ends. So you need to know if a transition is in progress and take
action when it ends.

To make matters worse, there may be nested transitions. For example, in my app,
I have a fade transition between the `/users` and `/organizations` routes, but
within the `/users` route, I have a drilldown transition from `/users` to
`/users/:userId`. If the user is in `/organizations/yolo` and clicks a link to
`/users/jimbo`, there will be a fade transition, but not a drilldown transition.
So the `/users/:userId` form needs to know if either the fade or drilldown
transition is going before it focuses an input.

`react-transition-context` solves this problem. If the fade and the drilldown
both put use it to put their transition state on React context, the
`/users/:userId` form can register a listener to get called when it's fully
**in** (rather than mounted but **appearing** or **entering**).

# The rest of the docs are a work in progress
