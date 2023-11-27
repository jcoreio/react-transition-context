import * as React from 'react'

export type TransitionState =
  | 'out'
  | 'in'
  | 'appearing'
  | 'entering'
  | 'leaving'

export const BaseTransitionContext: React.Context<TransitionState>

export function useTransitionContext(): TransitionState

export function overallTransitionState(
  parentState: TransitionState,
  childState: TransitionState
): TransitionState

export type Props = {
  state: TransitionState
  children: React.ReactElement
}

export function TransitionContext(props: Props): React.ReactElement

export type TransitionStateEffect = (
  prevState: TransitionState | null | undefined,
  nextState: TransitionState
) => any

export function useTransitionStateEffect(effect: TransitionStateEffect): void

export function useTransitionStateEffectFilter(
  filter: (
    prevState: TransitionState | null | undefined,
    nextState: TransitionState
  ) => boolean
): (effect: TransitionStateEffect) => void

export function useAppearingEffect(effect: TransitionStateEffect): void
export function useEnteringEffect(effect: TransitionStateEffect): void
export function useAppearedEffect(effect: TransitionStateEffect): void
export function useEnteredEffect(effect: TransitionStateEffect): void
export function useCameInEffect(effect: TransitionStateEffect): void
export function useLeavingEffect(effect: TransitionStateEffect): void
export function useLeftEffect(effect: TransitionStateEffect): void
export function useAutofocusRef(): React.Ref<HTMLElement>
