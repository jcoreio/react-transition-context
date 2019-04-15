# react-transition-context

[![CircleCI](https://circleci.com/gh/jcoreio/react-transition-context.svg?style=svg)](https://circleci.com/gh/jcoreio/react-transition-context)
[![Coverage Status](https://codecov.io/gh/jcoreio/react-transition-context/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/react-transition-context)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-transition-context.svg)](https://badge.fury.io/js/react-transition-context)

Helps you deal with nested transitions

```
npm install --save-dev react-transition-context
```

# Table of Contents

<!-- toc -->

- [Introduction](#introduction)
- [`TransitionState` enum](#transitionstate-enum)
- [Overall transition state](#overall-transition-state)
- [`TransitionContext` component](#transitioncontext-component)

<!-- tocstop -->

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

# `TransitionState` enum

There are five possible values:

- `'appearing'`
- `'entering'`
- `'in'`
- `'leaving'`
- `'out'`

# Overall transition state

The _overall transition state_ takes into account both a transition component's
own transition state, and the overall transition state of its closest ancestor
transition component.

For example:

- If the ancestor is `'in'` and the descendant is `'entering'`, the overall transition state is `'entering'`.
- If the ancestor is `'leaving'` and the descendant is 'entering', the overall transition state is `'leaving'`.
- If the ancestor is `'out'` and the descendant is 'leaving', the overall transition state is `'out'`.

## Table

| ↓ Ancestor / Descendant → | `null`        | `'appearing'` | `'entering'`  | `'in'`        | `'leaving'` | `'out'` |
| :------------------------ | :------------ | :------------ | :------------ | :------------ | :---------- | ------- |
| `null`                    | **`'in'`**    | `'appearing'` | `'entering'`  | **`'in'`**    | `'leaving'` | `'out'` |
| `'appearing'`             | `'appearing'` | `'appearing'` | `'appearing'` | `'appearing'` | `'leaving'` | `'out'` |
| `'entering'`              | `'entering'`  | `'appearing'` | `'entering'`  | `'entering'`  | `'leaving'` | `'out'` |
| `'in'`                    | `'in'`        | `'appearing'` | `'entering'`  | **`'in'`**    | `'leaving'` | `'out'` |
| `'leaving'`               | `'leaving'`   | `'leaving'`   | `'leaving'`   | `'leaving'`   | `'leaving'` | `'out'` |
| `'out'`                   | `'out'`       | `'out'`       | `'out'`       | `'out'`       | `'out'`     | `'out'` |

# `TransitionContext` component

```js
import TransitionContext from 'react-transition-context'
```

## Props

### `transitionState: TransitionState` (_optional_)

The transition state of your transition component that is rendering this.
Omit this if you just want to consume the [overall transition state](#overall-transition-state) without
changing the value for descendants.

### `children: React.Node | (TransitionState) => ?React.Node` (_optional_)

The content to render. If you pass a function, it will
be called with the [overall transition state](#overall-transition-state) and its return value will be rendered.

### `onTransition: (prevState: TransitionState, nextState: TransitionState) => any` (_optional_)

Listener that will be called whenever the [overall transition state](#overall-transition-state)
changes with the old and new values.

### `willComeIn: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'out'`/`'leaving'` to `'appearing'`/`'entering'`

### `didComeIn: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) is `'in'` upon mount, or if it changes from `'appearing'`/`'entering'` to `'in'`

### `willAppear: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'out'`/`'leaving'` to `'appearing'`/`'entering'`

### `didAppear: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'appearing'` to `'in'`

### `willEnter: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'out'`/`'leaving'` to `'entering'`/`'entering'`

### `didEnter: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'entering'` to `'in'`

### `willLeave: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'in'`/`'appearing'`/`'entering'` to `'leaving'`

### `didLeave: () => any` (_optional_)

Listener that will be called if the [overall transition state](#overall-transition-state) changes from `'leaving'` to `'out'`
