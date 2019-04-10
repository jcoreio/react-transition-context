# react-redux-features

[![CircleCI](https://circleci.com/gh/jcoreio/react-redux-features.svg?style=svg)](https://circleci.com/gh/jcoreio/react-redux-features)
[![Coverage Status](https://codecov.io/gh/jcoreio/react-redux-features/branch/master/graph/badge.svg)](https://codecov.io/gh/jcoreio/react-redux-features)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Legacy build Notice

If you are building for legacy browsers with webpack or similar bundlers, you
may need to add a rule to transpile this package to ES5.

## Usage

```
npm i --save redux-features react-redux-features
```

### featureLoader(options)

Creates a component that loads a feature when it will mount, if the feature isn't already loaded. You may also have
it render a component from the feature, something about the loading status, or anything else you want.

`options` may contain the following fields (\* = required):

- `featureId` _(string)_: the id of the feature to load (i.e. what you used when you called `dispatch(addFeature(id, {...}))`
- `render` _(Function)_: an optional render function. It will be called with `{featureState, feature, props}`, where
  `props` are all the props you pass to the created component.
- `getFeatureStates` _(Function)_: function that takes the redux `state` and returns the feature states (default: `state => state.featureStates`)
- `getFeatures` _(Function)_: function that takes the redux `state` and returns the features (default: `state => state.features`)

#### Example

You'll probably want to create a function in your project that delegates to `featureLoader` and provides a
consisent UI for loading and error messages, like the following. If you need a custom `getFeatureStates` or
`getFeatures`, you can also include those in the call to `featureLoader` so that you don't have to provide them
everywhere you need to create a feature loader component.

`myFeatureLoader.js`

```es6
import React from 'react'
import { featureLoader } from 'react-redux-features'

export default function myFeatureLoader(options) {
  const { featureId, featureName, getComponent } = options

  return featureLoader({
    featureId,
    render: ({ featureState, feature, props }) => {
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
    },
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

Creates a component that renders zero or more components from features. Unlike `featureLoader`, it doesn't
automatically load any features.

`options` may contain the following fields:

- `getFeatures` _(Function)_: function that takes the redux `state` and returns the features (default: `state => state.features`)
- `sortFeatures` _(Function)_: function that takes the `features` and returns an array sorted however you choose. The
  components from features rendered by the HOC will appear in this order.
- `getComponents` _(Function)_: function that takes a `Feature` and returns a React element, React Component, or array
  of either/both.

All props passed to the HOC will be passed through to the feature components.

#### Example

Imagine you wanted three separate teams in your company to create subpanels for a user's account details, profile,
and orders.

But you don't want them to have to touch the main code for the user view, which is maintained by a fourth
team. That team uses `featureComponents` to specify an "insertion point" for any other teams' subpanels:

```es6
import React from 'react'
import sortBy from 'lodash.sortby'
import { featureComponents } from 'react-redux-features'

const UserViewSubpanels = featureComponents({
  sortFeatures: features => sortBy(features, 'indexInUserView'),
  getComponents: feature => feature.UserViewSubpanels,
})
const UserView = ({ user }) => (
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

### featureContent(options)

This is very similar to `featureComponents`, but it works a bit differently. It was designed for getting routes
(for `react-router`) from features.

`featureContent(...)` creates a FeatureContent component that gets some content from zero or more features in your
store, makes an array of all the content, and then passes the array to a child rendering function.

`options` may contain the following fields:

- `getFeatures` _(Function)_: function that takes the redux `state` and returns the features (default: `state => state.features`)
- `sortFeatures` _(Function)_: function that takes the `features` and returns an array sorted however you choose. The
  components from features rendered by the HOC will appear in this order.
- `getContent` _(Function)_: function that takes a `Feature` and returns the content. If the content is a function,
  it will be called with the props passed to the `<FeatureContent>` instance.

For `getContent: feature => feature.stuff`, a feature's `stuff` property may be a single value, an array of values, or
a function that takes the props passed to `<FeatureContent>` and returns either a single value or array of
values.

`<FeatureContent>` will concatenate the values from all features into a single flat array, and either render
those values inside a `<div>`, or if you pass a child function to `<FeatureContent>`, it will call that function with
the array of values and render what it returns.

#### Example

Let's say you have an app with a `/` route and an `/about` route, but you want features to be able to define additional
routes to go alongside these. You will put the additional routes in a feature's `rootRoutes` property. Here's how you
would get the routes from the features and include them with the `/` and `/about` routes:

```js
import {featureContent} from 'react-redux-features'

const RootRoutes = featureContent({getContent: feature => feature.rootRoutes})

<Router>
  <RootRoutes>
    {routes =>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        {routes}
      </Switch>
    }
  </RootRoutes>
</Router>
```

And here is what some of the features might look like:

```js
const ordersFeature = {
  rootRoutes: [
    <Route path="orders/buying" component={BuyingOrders} />,
    <Route path="orders/selling" component={SellingOrders} />,
  ],
}

const UserSubRoutes = featureContent({getContent: feature => feature.userSubRoutes})
const userFeature = {
  rootRoutes: <Route path="/user" render={({match, location}) =>
    <div>
      <UserView match={match}>
      <UserSubRoutes match={match} location={location} />
    </div>
  }/>
}
```

In this case `<RootRoutes>` will call its child function with

```js
[
  <Route key={...} path="orders/buying" component={BuyingOrders} />,
  <Route key={...} path="orders/selling" component={SellingOrders} />,
  <Route key={...} path="/user" render={...} />,
]
```

So the `<Switch>` will render these as siblings of the `/` and `/about` routes.

Notice how the `userFeature` plans to include additional routes underneath `/user`.
The following features use a function for `userSubRoutes`; the `UserSubRoutes` component will call the function
with the `match` and `location` props it received.

```js
const userProfileFeature = {
  dependencies: ['userFeature'],
  userSubRoutes: ({ match }) => (
    <Route path={`${match.url}/profile`} component={UserProfile} />
  ),
}

const userOrdersFeature = {
  dependencies: ['userFeature'],
  userSubRoutes: ({ match }) => [
    <Route path={`${match.url}/orders/buying`} component={UserBuyingOrders} />,
    <Route
      path={`${match.url}/orders/selling`}
      component={UserSellingOrders}
    />,
  ],
}
```

So the `UserSubRoutes` component will render the following children:

```js
<Route key={...} path="/user/profile" component={UserProfile} />
<Route key={...} path="/user/orders/buying" component={UserBuyingOrders} />
<Route key={...} path="/user/orders/selling" component={UserSellingOrders} />
```
