# react-redux-features

[![Build Status](https://travis-ci.org/jcoreio/react-redux-features.svg?branch=master)](https://travis-ci.org/jcoreio/react-redux-features)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/react-redux-features/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/react-redux-features?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Usage

```
npm i --save redux-features react-redux-features
```

### featureLoader(options)

Creates a component that loads a feature when it will mount, if the feature isn't already loaded.  You may also have
it render a component from the feature, something about the loading status, or anything else you want.

`options` may contain the following fields (* = required):
- `featureId` *(string)*: the id of the feature to load (i.e. what you used when you called `dispatch(addFeature(id, {...}))`
- `render` *(Function)*: an optional render function.  It will be called with `{featureState, feature, props}`, where
  `props` are all the props you pass to the created component.
- `getFeatureStates` *(Function)*: function that takes the redux `state` and returns the feature states (default: `state => state.featureStates`)
- `getFeatures` *(Function)*: function that takes the redux `state` and returns the features (default: `state => state.features`)

#### Example

You'll probably want to create a function in your project that delegates to `featureLoader` and provides a
consisent UI for loading and error messages, like the following.  If you need a custom `getFeatureStates` or
`getFeatures`, you can also include those in the call to `featureLoader` so that you don't have to provide them
everywhere you need to create a feature loader component.

`myFeatureLoader.js`
```es6
import React from 'react'
import {featureLoader} from 'react-redux-features'

export default function myFeatureLoader(options) {
  const {
    featureId,
    featureName,
    getComponent,
  } = options

  return featureLoader({
    featureId,
    render: ({featureState, feature, props}) => {
      const Comp = getComponent && feature ? getComponent(feature) : null

      if (featureState instanceof Error) {
        return (
          <div className="alert alert-danger">
            Failed to load {featureName}: {featureState.message}
          </div>
        )
      } else if (!Comp) {
        return (
          <div className="alert alert-loading">
            <span className="spinner" /> Loading {featureName}...
          </div>
        )
      }
      return <Comp {...props} />
    }
  })
}
```

Then you can use it throughout your project like this:

```es6
import React from 'react'
import myFeatureLoader from './myFeatureLoader'

const ConfigView = myFeatureLoader({
  featureId: 'ConfigView',
  featureName: 'Config View',
  getComponent: feature => feature.components.ConfigView,
})

const configViewElem = <ConfigView config={...} />
```

