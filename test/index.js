// @flow
/* eslint-env browser */

import { describe, it } from 'mocha'
import * as React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import sinon from 'sinon'
import delay from 'delay'

import {
  TransitionContext,
  useAppearingEffect,
  useEnteringEffect,
  useAppearedEffect,
  useEnteredEffect,
  useCameInEffect,
  useLeavingEffect,
  useLeftEffect,
  useAutofocusRef,
  type TransitionState,
} from '../src'

describe('useCameInEffect', () => {
  it('runs on mount if not enclosed', async (): Promise<void> => {
    const didComeIn = sinon.spy()

    const Test = (): React.Node => {
      useCameInEffect(didComeIn)
      return <div />
    }

    render(<Test />)
    await delay(30)
    expect(didComeIn.called).to.be.true
  })
  it('runs on mount if transition is in', async (): Promise<void> => {
    const didComeIn = sinon.spy()

    const Test = (): React.Node => {
      useCameInEffect(didComeIn)
      return <div />
    }

    render(
      <TransitionContext state="in">
        <Test />
      </TransitionContext>
    )
    await delay(30)
    expect(didComeIn.called).to.be.true
  })
  ;['out', 'leaving', 'appearing', 'entering'].forEach(
    (state: TransitionState) => {
      const testcase =
        (doRender: (React.Node, state: TransitionState) => React.Node) =>
        async (): Promise<void> => {
          const didComeIn = sinon.spy()

          const Test = (): React.Node => {
            useCameInEffect(didComeIn)
            return <div />
          }

          const comp = render(doRender(<Test />, state))
          await delay(30)
          expect(didComeIn.called).to.be.false

          comp.rerender(doRender(<Test />, 'in'))
          await delay(30)
          expect(didComeIn.called).to.be.true
        }
      it(
        `runs when transition state changes to from ${state} to in`,
        testcase((children, state: TransitionState) => (
          <TransitionContext state={state}>{children}</TransitionContext>
        ))
      )
      it(
        `runs when overall transition state changes from ${state} to in (from ancestor)`,
        testcase((children, state: TransitionState) => (
          <TransitionContext state={state}>
            <TransitionContext state="in">{children}</TransitionContext>
          </TransitionContext>
        ))
      )
      it(
        `runs when overall transition state changes from ${state} to in (from descendant)`,
        testcase((children, state: TransitionState) => (
          <TransitionContext state="in">
            <TransitionContext state={state}>{children}</TransitionContext>
          </TransitionContext>
        ))
      )
    }
  )
})
describe(`useAppearingEffect`, function () {
  it('runs on mount if transition is appearing', async (): Promise<void> => {
    const effect = sinon.spy()

    const Test = (): React.Node => {
      useAppearingEffect(effect)
      return <div />
    }

    render(
      <TransitionContext state="appearing">
        <Test />
      </TransitionContext>
    )
    await delay(30)
    expect(effect.called).to.be.true
  })
  ;['out', 'leaving'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useAppearingEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'appearing'))
        await delay(30)
        expect(effect.called).to.be.true
      }
    it(
      `runs when transition state changes from ${state} to appearing`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `runs when overall transition state changes from ${state} to appearing (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `runs when overall transition state changes from ${state} to appearing (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
  ;['in', 'entering'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useAppearingEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'appearing'))
        await delay(30)
        expect(effect.called).to.be.false
      }
    it(
      `doesn't run when transition state changes from ${state} to appearing`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to appearing (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to appearing (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
})
describe(`useEnteringEffect`, function () {
  it('runs on mount if transition is entering', async (): Promise<void> => {
    const effect = sinon.spy()

    const Test = (): React.Node => {
      useEnteringEffect(effect)
      return <div />
    }

    render(
      <TransitionContext state="entering">
        <Test />
      </TransitionContext>
    )
    await delay(30)
    expect(effect.called).to.be.true
  })
  ;['out', 'leaving'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useEnteringEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'entering'))
        await delay(30)
        expect(effect.called).to.be.true
      }
    it(
      `runs when transition state changes from ${state} to entering`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `runs when overall transition state changes from ${state} to entering (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `runs when overall transition state changes from ${state} to entering (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
  ;['in', 'appearing'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useEnteringEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'entering'))
        await delay(30)
        expect(effect.called).to.be.false
      }
    it(
      `doesn't run when transition state changes from ${state} to entering`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to entering (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to entering (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
})
describe(`useAppearedEffect`, function () {
  const testcase =
    (doRender: (React.Node, state: TransitionState) => React.Node) =>
    async (): Promise<void> => {
      const effect = sinon.spy()

      const Test = (): React.Node => {
        useAppearedEffect(effect)
        return <div />
      }

      const comp = render(doRender(<Test />, 'appearing'))
      await delay(30)
      expect(effect.called).to.be.false

      comp.rerender(doRender(<Test />, 'in'))
      await delay(30)
      expect(effect.called).to.be.true
    }
  it(
    `runs when transition state changes from appearing to in`,
    testcase((children, state) => (
      <TransitionContext state={state}>{children}</TransitionContext>
    ))
  )
  it(
    `runs when overall transition state changes from appearing to in (from ancestor)`,
    testcase((children, state) => (
      <TransitionContext state={state}>
        <TransitionContext state="in">{children}</TransitionContext>
      </TransitionContext>
    ))
  )
  it(
    `runs when overall transition state changes from appearing to in (from descendant)`,
    testcase((children, state) => (
      <TransitionContext state="in">
        <TransitionContext state={state}>{children}</TransitionContext>
      </TransitionContext>
    ))
  )
  ;['out', 'leaving', 'entering'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useAppearedEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'in'))
        await delay(30)
        expect(effect.called).to.be.false
      }
    it(
      `doesn't run when transition state changes from ${state} to in`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to in (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to in (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
})
describe(`useEnteredEffect`, function () {
  const testcase =
    (doRender: (React.Node, state: TransitionState) => React.Node) =>
    async (): Promise<void> => {
      const effect = sinon.spy()

      const Test = (): React.Node => {
        useEnteredEffect(effect)
        return <div />
      }

      const comp = render(doRender(<Test />, 'entering'))
      await delay(30)
      expect(effect.called).to.be.false

      comp.rerender(doRender(<Test />, 'in'))
      await delay(30)
      expect(effect.called).to.be.true
    }
  it(
    `runs when transition state changes from entering to in`,
    testcase((children, state) => (
      <TransitionContext state={state}>{children}</TransitionContext>
    ))
  )
  it(
    `runs when overall transition state changes from entering to in (from ancestor)`,
    testcase((children, state) => (
      <TransitionContext state={state}>
        <TransitionContext state="in">{children}</TransitionContext>
      </TransitionContext>
    ))
  )
  it(
    `runs when overall transition state changes from entering to in (from descendant)`,
    testcase((children, state) => (
      <TransitionContext state="in">
        <TransitionContext state={state}>{children}</TransitionContext>
      </TransitionContext>
    ))
  )
  ;['out', 'leaving', 'appearing'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useEnteredEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'in'))
        await delay(30)
        expect(effect.called).to.be.false
      }
    it(
      `doesn't run when transition state changes from ${state} to in`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to in (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to in (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
})
describe(`useLeavingEffect`, function () {
  it(`runs on unmount when unenclosed`, async function (): Promise<void> {
    const effect = sinon.spy()

    const Test = (): React.Node => {
      useLeavingEffect(effect)
      return <div />
    }

    const comp = render(<Test />)
    await delay(30)
    expect(effect.called).to.be.false

    comp.unmount()
    await delay(30)
    expect(effect.called).to.be.true
  })
  ;['in', 'entering', 'appearing'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node) => React.Node) => async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useLeavingEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />))
        await delay(30)
        expect(effect.called).to.be.false

        comp.unmount()
        await delay(30)
        expect(effect.called).to.be.true
      }

    it(
      `runs on unmount when transition is ${state}`,
      testcase((children) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `runs on unmount when overall transition state is ${state} (from ancestor)`,
      testcase((children) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `runs on unmount when overall transition state is ${state} (from descendant)`,
      testcase((children) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
  ;['out', 'leaving'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node) => React.Node) => async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useLeavingEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />))
        await delay(30)
        expect(effect.called).to.be.false

        comp.unmount()
        await delay(30)
        expect(effect.called).to.be.false
      }

    it(
      `doesn't run on unmount when transition is ${state}`,
      testcase((children) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `doesn't run on unmount when overall transition state is ${state} (from ancestor)`,
      testcase((children) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `doesn't run on on unmount when overall transition state is ${state} (from descendant)`,
      testcase((children) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
})
describe(`useLeftEffect`, function () {
  const testcase =
    (doRender: (React.Node, state: TransitionState) => React.Node) =>
    async (): Promise<void> => {
      const effect = sinon.spy()

      const Test = (): React.Node => {
        useLeftEffect(effect)
        return <div />
      }

      const comp = render(doRender(<Test />, 'leaving'))
      await delay(30)
      expect(effect.called).to.be.false

      comp.rerender(doRender(<Test />, 'out'))
      await delay(30)
      expect(effect.called).to.be.true
    }
  it(
    `runs when transition state changes from leaving to out`,
    testcase((children, state) => (
      <TransitionContext state={state}>{children}</TransitionContext>
    ))
  )
  it(
    `runs when overall transition state changes from leaving to out (from ancestor)`,
    testcase((children, state) => (
      <TransitionContext state={state}>
        <TransitionContext state="in">{children}</TransitionContext>
      </TransitionContext>
    ))
  )
  it(
    `runs when overall transition state changes from leaving to out (from descendant)`,
    testcase((children, state) => (
      <TransitionContext state="in">
        <TransitionContext state={state}>{children}</TransitionContext>
      </TransitionContext>
    ))
  )
  ;['in', 'appearing', 'entering'].forEach((state: TransitionState) => {
    const testcase =
      (doRender: (React.Node, state: TransitionState) => React.Node) =>
      async (): Promise<void> => {
        const effect = sinon.spy()

        const Test = (): React.Node => {
          useAppearedEffect(effect)
          return <div />
        }

        const comp = render(doRender(<Test />, state))
        await delay(30)
        expect(effect.called).to.be.false

        comp.rerender(doRender(<Test />, 'out'))
        await delay(30)
        expect(effect.called).to.be.false
      }
    it(
      `doesn't run when transition state changes from ${state} to out`,
      testcase((children, state) => (
        <TransitionContext state={state}>{children}</TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to out (from ancestor)`,
      testcase((children, state) => (
        <TransitionContext state={state}>
          <TransitionContext state="in">{children}</TransitionContext>
        </TransitionContext>
      ))
    )
    it(
      `doesn't run when overall transition state changes from ${state} to out (from descendant)`,
      testcase((children, state) => (
        <TransitionContext state="in">
          <TransitionContext state={state}>{children}</TransitionContext>
        </TransitionContext>
      ))
    )
  })
})
describe(`useAutofocusRef`, function () {
  beforeEach(() => {
    if (document.activeElement) document.activeElement.blur()
  })
  it(`does nothing when ref is not used`, async function (): Promise<void> {
    const Test = (): React.Node => {
      useAutofocusRef()
      return <button id="foo" />
    }

    render(<Test />)
    await delay(30)
  })
  it(`autofocuses button on mount when not enclosed`, async function (): Promise<void> {
    const Test = (): React.Node => {
      const ref = useAutofocusRef()
      return <button id="foo" ref={ref} />
    }

    render(<Test />, { attachTo: document.body ?? undefined })
    await delay(30)
    const { activeElement } = document
    if (!(activeElement instanceof HTMLButtonElement)) {
      throw new Error('expected activeElement to be an HTMLButtonElement')
    }
    expect(activeElement.id).to.equal('foo')
  })
  it(`autofocuses input on mount when not enclosed`, async function (): Promise<void> {
    const Test = (): React.Node => {
      const ref = useAutofocusRef()
      return <input value="test" id="foo" ref={ref} />
    }

    render(<Test />, { attachTo: document.body ?? undefined })
    await delay(30)
    const { activeElement } = document
    if (!(activeElement instanceof HTMLInputElement)) {
      throw new Error('expected activeElement to be an HTMLInputElement')
    }
    expect(activeElement.id).to.equal('foo')
    expect(activeElement.selectionStart).to.equal(0)
    expect(activeElement.selectionEnd).to.equal(4)
  })
  it.skip(`autofocuses input when overall transition state changes to in`, async function (): Promise<void> {
    const Test = (): React.Node => {
      const ref = useAutofocusRef()
      return <input value="test" id="foo" ref={ref} />
    }

    const comp = render(
      <TransitionContext state="entering">
        <Test />
      </TransitionContext>,
      { attachTo: document.body ?? undefined }
    )
    await delay(30)
    expect(document.activeElement && document.activeElement.id).not.to.equal(
      'foo'
    )

    comp.setProps({ state: 'in' }).update()
    await delay(30)
    const { activeElement } = document
    if (!(activeElement instanceof HTMLInputElement)) {
      throw new Error('expected activeElement to be an HTMLInputElement')
    }
    expect(activeElement.id).to.equal('foo')
    expect(activeElement.selectionStart).to.equal(0)
    expect(activeElement.selectionEnd).to.equal(4)
  })
})
