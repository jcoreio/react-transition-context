// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {loadFeature} from 'redux-features'
import type {FeatureState, FeatureStates} from 'redux-features'
import {createSelector} from 'reselect'
import defaults from 'lodash.defaults'

export type Options<P: Object> = {
  getFeatures?: (state: any) => ?Object,
  getFeatureStates?: (state: any) => ?FeatureStates,
  featureId: string,
  render?: (options: {featureState: FeatureState, feature: ?Object, props: P}) => ?React.Element<any>,
}

type SelectProps = {
  feature: ?Object,
  featureState: FeatureState,
}

type LoaderProps<P: Object> = SelectProps & {
  featureComponentProps: P,
  dispatch: (action: Object) => any,
}

export default function featureLoader<P: Object>(options: Options<P>): (props: P) => React.Element<any> {
  const {getFeatures, getFeatureStates, featureId, render} = defaults({}, options, {
    getFeatures: state => state ? state.features : undefined,
    getFeatureStates: state => state ? state.featureStates : undefined,
  })
  const select: (state: any) => SelectProps = createSelector(
    getFeatures,
    getFeatureStates,
    (features = {}, featureStates = {}) => ({
      feature: features[featureId],
      featureState: featureStates[featureId],
    })
  )

  class FeatureLoader extends Component<void, LoaderProps<P>, void> {
    componentWillMount() {
      const {featureState, dispatch} = this.props
      if (featureState === 'NOT_LOADED') dispatch(loadFeature(featureId))
    }
    render(): ?React.Element<any> {
      const {featureState, feature, featureComponentProps} = this.props
      return (
        render
          ? render({featureState, feature, props: featureComponentProps})
          : null
      )
    }
  }

  const Wrapped = connect(select)(FeatureLoader)

  const FeatureComponentProxy = (props: P) => <Wrapped featureComponentProps={props} />
  return FeatureComponentProxy
}

