/**
 * @flow
 * @prettier
 */

import * as React from 'react'

type TransitionState = 'out' | 'in' | 'appearing' | 'entering' | 'leaving'

const BaseTransitionContext: React.Context<TransitionState> = React.createContext(
  'in'
)

export function overallTransitionState(
  parentState: TransitionState,
  childState: ?TransitionState
): TransitionState {
  if (!childState) return parentState
  if (parentState === 'out' || childState === 'out') return 'out'
  if (parentState === 'leaving' || childState === 'leaving') return 'leaving'
  if (parentState === 'appearing' || childState === 'appearing')
    return 'appearing'
  if (parentState === 'entering' || childState === 'entering') return 'entering'
  return childState
}

type OnTransition = (
  prevState: TransitionState,
  nextState: TransitionState
) => any

export type Props = {
  transitionState?: ?TransitionState,
  children?: ?(React.Node | (TransitionState => ?React.Node)),
  onTransition?: ?OnTransition,
  willComeIn?: ?Function,
  didComeIn?: ?Function,
  willAppear?: ?Function,
  didAppear?: ?Function,
  willEnter?: ?Function,
  didEnter?: ?Function,
  willLeave?: ?Function,
  didLeave?: ?Function,
}

export type Stash = {
  prevState?: ?TransitionState,
  onTransition: (
    prevState: ?TransitionState,
    nextState: TransitionState
  ) => any,
}

const TransitionContext = ({
  transitionState,
  children,
  onTransition,
  willComeIn,
  didComeIn,
  willAppear,
  didAppear,
  willEnter,
  didEnter,
  willLeave,
  didLeave,
}: Props) => {
  const parentState = React.useContext(BaseTransitionContext)
  const nextState = overallTransitionState(parentState, transitionState)

  const stash: Stash = (React.useRef({
    onTransition:
      // istanbul ignore next
      () => {},
  }).current: any)
  stash.onTransition = (
    prevState: ?TransitionState,
    nextState: TransitionState
  ) => {
    if (prevState && onTransition) onTransition(prevState, nextState)

    switch (nextState) {
      case 'out':
        if (prevState === 'leaving') {
          if (didLeave) didLeave()
        }
        break
      case 'in':
        if (prevState === 'appearing') {
          if (didAppear) didAppear()
        } else if (prevState === 'entering') {
          if (didEnter) didEnter()
        }
        if (didComeIn) didComeIn()
        break
      case 'appearing':
        if (prevState === 'out' || prevState === 'leaving') {
          if (willAppear) willAppear()
          if (willComeIn) willComeIn()
        }
        break
      case 'entering':
        if (prevState === 'out' || prevState === 'leaving') {
          if (willEnter) willEnter()
          if (willComeIn) willComeIn()
        }
        break
      case 'leaving':
        if (
          prevState === 'in' ||
          prevState === 'appearing' ||
          prevState === 'entering'
        ) {
          if (willLeave) willLeave()
        }
        break
    }
  }

  React.useEffect(
    () => {
      const { prevState } = stash
      stash.prevState = nextState
      stash.onTransition(prevState, nextState)
    },
    [nextState]
  )

  React.useEffect(() => {
    return () => {
      if (
        nextState !== 'leaving' &&
        nextState !== 'out' &&
        stash.onTransition
      ) {
        stash.onTransition(nextState, 'leaving')
      }
    }
  }, [])

  const content =
    typeof children === 'function' ? children(nextState) : children

  return (
    <BaseTransitionContext.Provider value={nextState}>
      {content != null ? content : <React.Fragment />}
    </BaseTransitionContext.Provider>
  )
}

export default TransitionContext
