import React from 'react'
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
import {featureLoader} from '../src'

describe('integration test', () => {
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
