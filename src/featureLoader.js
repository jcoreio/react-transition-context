// @flow

import * as React from 'react'
import {connect} from 'react-redux'
import type {Dispatch} from 'redux'
import {loadFeature} from 'redux-features'
import type {Feature, Features, FeatureState, FeatureStates} from 'redux-features'
import {createSelector} from 'reselect'
import defaults from 'lodash.defaults'

export type Options<S, A, P: Object> = {
  getFeatures?: (state: S) => ?Features<S, A>,
  getFeatureStates?: (state: S) => ?FeatureStates,
  featureId: string,
  render?: (options: {featureState: FeatureState, feature: ?Feature<S, A>, props: P}) => ?React.Element<any>,
}

export default function featureLoader<S, A, P: Object>(options: Options<S, A, P>): React.ComponentType<P> {
  type PropsFromState = {
    feature: ?Feature<S, A>,
    featureState: FeatureState,
  }

  type PropsFromDispatch = {
    dispatch: Dispatch<A>,
  }

  type MergedProps = {
    children?: any,
    featureState: FeatureState,
    dispatch: Dispatch<A>,
  }

  const {getFeatures, getFeatureStates, featureId, render} = defaults({}, options, {
    getFeatures: state => state ? state.features : undefined,
    getFeatureStates: state => state ? state.featureStates : undefined,
  })
  const mapStateToProps: (state: S) => PropsFromState = createSelector(
    getFeatures,
    getFeatureStates,
    (features: Features<S, A> = {}, featureStates: FeatureStates = {}): PropsFromState => ({
      feature: features[featureId],
      featureState: featureStates[featureId],
    })
  )

  function mergeProps({feature, featureState}: PropsFromState, {dispatch}: PropsFromDispatch, props: P): MergedProps {
    return {
      dispatch,
      featureState,
      children: render
        ? render({feature, featureState, props})
        : null,
    }
  }

  class FeatureLoader extends React.Component<P> {
    static defaultProps: MergedProps;
    componentWillMount() {
      const {featureState, dispatch} = this.props
      if (featureState === 'NOT_LOADED') dispatch(loadFeature(featureId))
    }
    render(): React.Node {
      return this.props.children
    }
  }

  return connect(mapStateToProps, null, mergeProps)(FeatureLoader)
}

