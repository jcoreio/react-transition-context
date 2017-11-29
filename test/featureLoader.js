import React from 'react'
import {expect} from 'chai'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {mount} from 'enzyme'
import {configure as configureEnzyme} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
configureEnzyme({ adapter: new Adapter() })
import sinon from 'sinon'
import {featureLoader} from '../src'
import {loadFeature} from 'redux-features'

describe('featureLoader', () => {
  it('behaves when state is undefined', () => {
    const Comp = featureLoader({
      featureId: 'test',
      render: () => null,
    })

    const reducer = sinon.spy(state => state)

    const store = createStore(reducer)

    mount(
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    expect(reducer.calledWith(store.getState(), loadFeature('test'))).to.be.false
  })
  it("dispatches loadFeature action if feature isn't loaded", () => {
    const Comp = featureLoader({
      featureId: 'test',
      render: () => null,
    })

    const reducer = sinon.spy(state => state)

    const store = createStore(reducer, {
      featureStates: {
        test: 'NOT_LOADED',
      }
    })

    mount(
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    expect(reducer.calledWith(store.getState(), loadFeature('test'))).to.be.true
  })
  it("doesn't dispatch loadFeature action if feature doesn't exist", () => {
    const Comp = featureLoader({
      featureId: 'test',
      render: () => null,
    })

    const reducer = sinon.spy(state => state)

    const store = createStore(reducer, {
      featureStates: {}
    })

    mount(
      <Provider store={store}>
        <Comp />
      </Provider>
    )

    expect(reducer.calledWith(store.getState(), loadFeature('test'))).to.be.false
  })
  it("doesn't dispatch loadFeature action if feature is loading, loaded, or failed", () => {
    const Comp = featureLoader({
      featureId: 'test',
      render: () => null,
    })

    const reducer = sinon.spy(state => state)

    for (let featureState of ['LOADING', 'LOADED', new Error('test')]) {
      const store = createStore(reducer, {
        featureStates: {
          test: featureState,
        }
      })

      mount(
        <Provider store={store}>
          <Comp />
        </Provider>
      )

      expect(reducer.calledWith(store.getState(), loadFeature('test'))).to.be.false
    }
  })
  it('behaves when render is not given', () => {
    const reducer = state => state
    const feature = {
      hello: 'world',
    }

    for (let featureState of ['NOT_LOADED', 'LOADING', 'LOADED', new Error('test')]) {
      const Comp = featureLoader({
        featureId: 'test',
      })

      const store = createStore(reducer, {
        featureStates: {
          test: featureState,
        },
        features: {
          test: feature,
        }
      })

      const props = {
        foo: 'bar',
      }

      mount(
        <Provider store={store}>
          <Comp {...props} />
        </Provider>
      )
    }
  })
  it('calls render with feature, featureState, and props', () => {
    const reducer = state => state
    const feature = {
      hello: 'world',
    }

    for (let featureState of ['NOT_LOADED', 'LOADING', 'LOADED', new Error('test')]) {
      const render = sinon.spy(() => <h1>Rendered!</h1>)
      const Comp = featureLoader({
        featureId: 'test',
        render,
      })

      const store = createStore(reducer, {
        featureStates: {
          test: featureState,
        },
        features: {
          test: feature,
        }
      })

      const props = {
        foo: 'bar',
      }

      const comp = mount(
        <Provider store={store}>
          <Comp {...props} />
        </Provider>
      )

      expect(render.calledWith({
        featureState,
        feature,
        props,
      })).to.be.true

      expect(comp.text()).to.equal('Rendered!')
    }
  })
  it('supports custom getFeatures and getFeatureStates', () => {
    const reducer = state => state
    const feature = {
      hello: 'world',
    }

    for (let featureState of ['NOT_LOADED', 'LOADING', 'LOADED', new Error('test')]) {
      const render = sinon.spy(() => null)
      const Comp = featureLoader({
        featureId: 'test',
        render,
        getFeatureStates: state => state.featureStatage,
        getFeatures: state => state.featureness,
      })

      const store = createStore(reducer, {
        featureStatage: {
          test: featureState,
        },
        featureness: {
          test: feature,
        }
      })

      const props = {
        foo: 'bar',
      }

      mount(
        <Provider store={store}>
          <Comp {...props} />
        </Provider>
      )

      expect(render.calledWith({
        featureState,
        feature,
        props,
      })).to.be.true
    }
  })
})

