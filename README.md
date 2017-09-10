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

### featureComponents(options)

Creates a component that renders zero or more components from features.  Unlike `featureLoader`, it doesn't
automatically load any features.

`options` may contain the following fields:
- `getFeatures` *(Function)*: function that takes the redux `state` and returns the features (default: `state => state.features`)
- `sortFeatures` *(Function)*: function that takes the `features` and returns an array sorted however you choose.  The
  components from features rendered by the HOC will appear in this order.
- `getComponents` *(Function)*: function that takes  a `Feature` and returns a React element, React Component, or array
  of either/both.
  
All props passed to the HOC will be passed through to the feature components.

#### Example

Imagine you wanted three separate teams in your company to create subpanels for a user's account details, profile, 
and orders.

But you don't want them to have to touch the main code for the user view, which is maintained by a fourth
team.  That team uses `featureComponents` to specify an "insertion point" for any other teams' subpanels:

```es6
import React from 'react'
import sortBy from 'lodash.sortby'
import {featureComponents} from 'react-redux-features'

const UserViewSubpanels = featureComponents({
  sortFeatures: features => sortBy(features, 'indexInUserView'),
  getComponents: feature => feature.UserViewSubpanels,
})
const UserView = ({user}) => (
  <div>
    <h1>User Profile</h1>
    <UserViewSubpanels user={user} />
  </div>
)
```

The user account team could write a feature like this to insert its panel:
```es6
import React from 'react'
import Panel from './Panel'
import store from './store'
import {addFeature} from 'redux-features'

const UserAccountPanel = ({user}) => (
  <Panel title="Account">
    <form onSubmit={...}>
      Username: <input name="username" type="text" value={user.username} />
      Password: <input name="password" type="password" value={user.password} />
    </form>
  </Panel>
)

store.dispatch(addFeature('userAccount', {
  indexInUserView: 0,
  userViewSubpanels: UserAccountPanel
}))
```

The user profile team would write the following:
```es6
import React from 'react'
import Panel from './Panel'
import store from './store'
import {addFeature} from 'redux-features'

const UserProfilePanel = ({user}) => (
  <Panel title="Profile">
    <form onSubmit={...}>
      First name: <input name="firstName" type="text" value={user.firstName} /> 
      Last name: <input name="lastName" type="text" value={user.lastName} /> 
    </form>
  </Panel>
)

store.dispatch(addFeature('userProfile', {
  indexInUserView: 1,
  userViewSubpanels: UserProfilePanel
}))
```

And the user orders team would write:
```es6
import React from 'react'
import Panel from './Panel'
import store from './store'
import {addFeature} from 'redux-features'

const UserOrdersPanel = ({user}) => (
  <Panel title="Orders">
    <table>
      <thead>
        <tr>
          <td>Order Number</td>
          <td>Date</td>
          <td>Item</td>
          <td>Tracking Number</td>
        </tr>
      </thead>
      <tbody>
        {user.orders.map((order, key) =>
          <tr key={key}>
            <td>{order.number}</td>
            <td>{order.date}</td>
            <td>{order.itemName}</td>
            <td><a href={...}>{order.trackingNumber}</a></td>
          </tr>
        )}
      </tbody>
    </table>
  </Panel>
)

store.dispatch(addFeature('userOrders', {
  indexInUserView: 2,
  userViewSubpanels: UserOrdersPanel,
}))
```

