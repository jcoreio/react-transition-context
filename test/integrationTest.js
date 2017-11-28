import React from 'react'
import sortBy from 'lodash.sortby'
import {renderToString} from 'react-dom/server'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import {connect, Provider} from 'react-redux'
import {mount} from 'enzyme'
import {expect} from 'chai'
import {
  composeReducers, featuresReducer, featureStatesReducer, featureReducersReducer,
  loadFeatureMiddleware, featureMiddlewaresMiddleware, addFeature, loadInitialFeatures,
  LOAD_FEATURE,
} from 'redux-features'
import {featureLoader, featureComponents, featureContent} from '../src'
import {Router, Route, Switch} from 'react-router-dom'
import {createMemoryHistory} from 'history'

describe('integration test', () => {
  describe('featureLoader', () => {
    it('server-side rendering works', async () => {
      const reducer = composeReducers(
        combineReducers({
          features: featuresReducer(),
          featureStates: featureStatesReducer(),
        }),
        featureReducersReducer()
      )

      const featurePromises = []

      const store = createStore(
        reducer,
        applyMiddleware(
          store => next => action => {
            const result = next(action)
            if (action.type === LOAD_FEATURE) featurePromises.push(result)
            return result
          },
          loadFeatureMiddleware(),
          featureMiddlewaresMiddleware(),
        )
      )

      const counter = {
        load: (store) => Promise.resolve({
          reducer: (state, action) => action.type === 'INCREMENT' ? {...state, count: (state.count || 0) + 1} : state,
          Counter: connect(({count}) => ({count}))(({count}) => <div>{`Counter: ${count || 0}`}</div>),
        })
      }
      store.dispatch(addFeature('counter', counter))

      const Counter = featureLoader({
        featureId: 'counter',
        render({featureState, feature, props}) {
          const Comp = feature && feature.Counter
          if (featureState instanceof Error) {
            return <div>Failed to load counter: {featureState.message}</div>
          } else if (!Comp) {
            return <div>Loading counter...</div>
          }
          return <Comp {...props} />
        }
      })

      const app = (
        <Provider store={store}>
          <Counter />
        </Provider>
      )
      renderToString(app)
      await Promise.all(featurePromises)

      expect(renderToString(app)).to.match(/Counter: 0/)

      store.dispatch({type: 'INCREMENT'})
      expect(renderToString(app)).to.match(/Counter: 1/)
    })
    it('client-side rendering works', async () => {
      const reducer = composeReducers(
        combineReducers({
          features: featuresReducer(),
          featureStates: featureStatesReducer(),
        }),
        featureReducersReducer()
      )

      const featurePromises = []

      const store = createStore(
        reducer,
        {
          featureStates: {
            counter: 'LOADED',
          }
        },
        applyMiddleware(
          store => next => action => {
            const result = next(action)
            if (action.type === LOAD_FEATURE) featurePromises.push(result)
            return result
          },
          loadFeatureMiddleware(),
          featureMiddlewaresMiddleware(),
        )
      )

      const counter = {
        load: (store) => Promise.resolve({
          reducer: (state, action) => action.type === 'INCREMENT' ? {...state, count: (state.count || 0) + 1} : state,
          Counter: connect(({count}) => ({count}))(({count}) => <div>{`Counter: ${count || 0}`}</div>),
        })
      }
      store.dispatch(addFeature('counter', counter))

      const Counter = featureLoader({
        featureId: 'counter',
        render({featureState, feature, props}) {
          const Comp = feature && feature.Counter
          if (featureState instanceof Error) {
            return <div>Failed to load counter: {featureState.message}</div>
          } else if (!Comp) {
            return <div>Loading counter...</div>
          }
          return <Comp {...props} />
        }
      })

      const app = (
        <Provider store={store}>
          <Counter />
        </Provider>
      )
      const comp = mount(app)
      store.dispatch(loadInitialFeatures())
      await Promise.all(featurePromises)
      expect(comp.text()).to.equal('Counter: 0')

      store.dispatch({type: 'INCREMENT'})
      expect(comp.text()).to.equal('Counter: 1')
    })
  })
  describe('featureComponents', () => {
    it('client-side rendering works', async function () {
      const reducer = combineReducers({
        features: featuresReducer(),
        featureStates: featureStatesReducer(),
      })

      const store = createStore(reducer)

      const dog = {
        index: 1,
        animals: <div>Dog</div>
      }
      const Tiger = ({adjective}) => <div>{adjective} Tiger</div>
      const cats = {
        index: 0,
        animals: [
          <div key={0}>Lion</div>,
          Tiger,
        ],
      }
      store.dispatch(addFeature('dog', dog))
      store.dispatch(addFeature('cats', cats))
      store.dispatch(addFeature('ghosts', {}))

      const Animals = featureComponents({
        getComponents: feature => feature.animals,
        sortFeatures: features => sortBy(features, 'index'),
      })

      const app = (
        <Provider store={store}>
          <Animals adjective="big" />
        </Provider>
      )
      const comp = mount(app)
      expect(comp.text()).to.equal('Lionbig TigerDog')

      const app2 = (
        <Provider store={store}>
          <Animals adjective="big">
            {animals => (
              <div>
                Bear
                {animals}
                Zebra
              </div>
            )}
          </Animals>
        </Provider>
      )

      expect(mount(app2).text()).to.equal('BearLionbig TigerDogZebra')
    })
  })
  describe('featureContent', () => {
    it('works with react-router', async function () {
      const reducer = combineReducers({
        features: featuresReducer(),
        featureStates: featureStatesReducer(),
      })

      const store = createStore(reducer)

      const RootRoutes = featureContent({
        getContent: feature => feature.rootRoutes,
      })
      const UserViewRoutes = featureContent({
        getContent: feature => feature.userViewRoutes,
      })

      const UserView = props => (
        <div>
          <h1>User {props.match.params.userId}</h1>
          <UserViewRoutes {...props} />
        </div>
      )

      const userViewFeature = {
        rootRoutes: (
          <Route path="/users/:userId" component={UserView} />
        ),
      }

      const UserProfileView = () => <h3>Profile</h3>
      const ProfileRoute = ({match}) => (
        <Route path={`${match.url}/profile`} component={UserProfileView} />
      )
      const userProfileViewFeature = {
        userViewRoutes: ProfileRoute,
      }

      const ChangePasswordView = () => <h3>Change Password</h3>
      const UserOrdersView = () => <h3>Orders</h3>
      const otherUserRoutesFeature = {
        userViewRoutes: ({match}) => [
          /* eslint-disable react/jsx-key */
          <Route path={`${match.url}/changePassword`} component={ChangePasswordView} />,
          <Route path={`${match.url}/orders`} component={UserOrdersView} />,
          /* eslint-enable react/jsx-key */
        ],
      }

      store.dispatch(addFeature('userView', userViewFeature))
      store.dispatch(addFeature('userProfileView', userProfileViewFeature))
      store.dispatch(addFeature('otherUserRoutes', otherUserRoutesFeature))

      const history = createMemoryHistory({
        initialEntries: ['/users/andy/changePassword'],
        initialIndex: 0,
      })

      const app = (
        <Provider store={store}>
          <Router history={history}>
            <Route render={props =>
              (<RootRoutes {...props}>
                {routes =>
                  (<Switch>
                    {routes}
                  </Switch>)
                }
              </RootRoutes>)
            }
            />
          </Router>
        </Provider>
      )
      const comp = mount(app)
      expect(comp.text()).to.equal('User andyChange Password')

      history.push('/users/andy/orders')
      expect(comp.text()).to.equal('User andyOrders')
    })
  })
})

