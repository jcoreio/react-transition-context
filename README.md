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
  - [Table](#table)
- [API](#api)
  - [`TransitionContext` component](#transitioncontext-component)
  - [`useTransitionContext` hook](#usetransitioncontext-hook)
  - [`useTransitionStateEffect` hook](#usetransitionstateeffect-hook)
  - [`useAppearingEffect` hook](#useappearingeffect-hook)
  - [`useAppearedEffect` hook](#useappearedeffect-hook)
  - [`useEnteringEffect` hook](#useenteringeffect-hook)
  - [`useEnteredEffect` hook](#useenteredeffect-hook)
  - [`useCameInEffect` hook](#usecameineffect-hook)
  - [`useLeavingEffect` hook](#useleavingeffect-hook)
  - [`useLeftEffect` hook](#uselefteffect-hook)
  - [`useAutofocusRef` hook](#useautofocusref-hook)

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
`/users/:userId` form can register a effect to get called when it's fully
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

| ↓ Ancestor / Descendant → | `'appearing'` | `'entering'`  | `'in'`        | `'leaving'` | `'out'` |
| :------------------------ | :------------ | :------------ | :------------ | :---------- | ------- |
| `'appearing'`             | `'appearing'` | `'appearing'` | `'appearing'` | `'leaving'` | `'out'` |
| `'entering'`              | `'appearing'` | `'entering'`  | `'entering'`  | `'leaving'` | `'out'` |
| `'in'`                    | `'appearing'` | `'entering'`  | **`'in'`**    | `'leaving'` | `'out'` |
| `'leaving'`               | `'leaving'`   | `'leaving'`   | `'leaving'`   | `'leaving'` | `'out'` |
| `'out'`                   | `'out'`       | `'out'`       | `'out'`       | `'out'`     | `'out'` |

# API

## `TransitionContext` component

```js
import { TransitionContext } from 'react-transition-context'
```

### Props

#### `state: TransitionState` (_optional_)

The transition state of your transition component that is rendering this.
Omit this if you just want to consume the [overall transition state](#overall-transition-state) without
changing the value for descendants.

#### `children: React.Node` (**required**)

The content to render

## `useTransitionContext` hook

```js
import { useTransitionContext } from 'react-transition-context'
```

Hook that returns the [overall transition state](#overall-transition-state) from
context.

## `useTransitionStateEffect` hook

```js
import { useTransitionStateEffect } from 'react-transition-context'
```

```js
useTransitionStateEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes.
`prevState` will be `null` for the first call (on mount).

## `useAppearingEffect` hook

```js
import { useAppearingEffect } from 'react-transition-context'
```

```js
useAppearingEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
from `'out'`/`'leaving'` to `'appearing'`, or is
`'appearing'` when the component mounts.

## `useAppearedEffect` hook

```js
import { useAppearedEffect } from 'react-transition-context'
```

```js
useAppearedEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
from `'appearing'` to `'in'`.

## `useEnteringEffect` hook

```js
import { useEnteringEffect } from 'react-transition-context'
```

```js
useEnteringEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
from `'out'`/`'leaving'` to `'entering'`, or is
`'entering'` when the component mounts.

## `useEnteredEffect` hook

```js
import { useEnteredEffect } from 'react-transition-context'
```

```js
useEnteredEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
from `'entering'` to `'in'`.

## `useCameInEffect` hook

```js
import { useCameInEffect } from 'react-transition-context'
```

```js
useCameInEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
to `'in'` (from any other state), or is `'in'` when the
component mounts.

[`useAutofocusRef`](#useautofocusref-hook) is built on
top of this.

## `useLeavingEffect` hook

```js
import { useLeavingEffect } from 'react-transition-context'
```

```js
useLeavingEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
from `'in'`/`'appearing'`/`'entering'` to `'leaving'`,
or when the component will unmount and the overall
transition state is `'in'`/`'appearing'`/`'entering'`.

## `useLeftEffect` hook

```js
import { useLeftEffect } from 'react-transition-context'
```

```js
useLeftEffect(
  effect: (prevState: ?TransitionState, nextState: TransitionState) => any
)
```

Calls `effect` whenever the [overall transition state](#overall-transition-state) from context changes
from `'leaving'` to `'out'`.

## `useAutofocusRef` hook

Creates a ref you can pass to an element to automatically
focus it when the [component comes in](#usecameineffect-hook)

### Example

```js
import * as React from 'react'
import { useAutofocusRef } from 'react-transition-context'

const LoginForm = () => {
  const autofocusRef = useAutofocusRef()
  return (
    <form>
      <input type="text" name="username" ref={autofocusRef} />
      <input type="password" name="password" />
    </form>
  )
}
```

## `useTransitionStateEffectFilter`

```js
import { useTransitionStateEffectFilter } from 'react-transition-context'
```

```js
useTransitionStateEffectFilter: (
  filter: (prevState: ?TransitionState, nextState: TransitionState) => boolean
) => (
  effect: (prevState: ?TransitionState, nextState: TransitionState)
) => void
```

A higher-order function that takes a filter function
and returns a transition state hook that only calls
`effect` when the `filter` returns truthy.

(`useTransitionStateEffectFilter` is used to create all
the `useAppearingEffect`, `useLeavingEffect`, etc hooks)
