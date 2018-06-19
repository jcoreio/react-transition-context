/* @flow */

import * as React from 'react'
import { defaults } from "lodash"
import type {Feature, Features} from 'redux-features'
import {connect} from 'react-redux'
import {createStructuredSelector, createSelector} from 'reselect'

type Options<S, A> = {
  getFeatures?: (state: S) => Features<S, A>,
  sortFeatures?: (features: Features<S, A>) => Array<Feature<S, A>>,
  getContent: (feature: Feature<S, A>) => any,
}

export default function featureContent<S, A, P: Object>(
  options: Options<S, A>,
): React.ComponentType<P & {children: (content: Array<any>) => ?React.Element<any>}> {
  const {getFeatures, sortFeatures, getContent} = defaults({}, options, {
    getFeatures: state => state ? state.features : {},
    sortFeatures: features => Object.values(features),
  })

  type PropsFromState = {
    features: Array<Feature<S, A>>,
  }

  const mapStateToProps: (state: S) => PropsFromState = createStructuredSelector({
    features: createSelector(
      getFeatures,
      sortFeatures,
    ),
  })

  function mergeProps({features}: PropsFromState, dispatchProps: any, {children, ...props}: P): {children: any} {
    const content = []
    features.forEach((feature: Feature<S, A>, featureIndex: number) => {
      let featureContent = getContent(feature)
      if (featureContent == null) return
      if (typeof featureContent === 'function') featureContent = featureContent(props)
      if (!Array.isArray(featureContent)) featureContent = [featureContent]
      featureContent.forEach((item: any, index: number) => {
        if (React.isValidElement(item) && item.key == null) {
          item = React.cloneElement(item, {key: featureIndex + ':' + index})
        }
        content.push(item)
      })
    })
    return {
      children: children instanceof Function
        ? children(content)
        : <div>{content}</div>,
    }
  }

  const FeatureContent = ({children}) => children

  return connect(mapStateToProps, null, mergeProps)(FeatureContent)
}

