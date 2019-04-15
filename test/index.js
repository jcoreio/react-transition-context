// @flow

import { describe, it } from 'mocha'
import * as React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'
import delay from 'delay'

import TransitionContext from '../src'

describe('TransitionContext', () => {
  describe('by itself', () => {
    it(`calls child function with in state if no state given`, function() {
      const render = sinon.spy(() => 'test')
      const comp = mount(
        <div>
          <TransitionContext>{render}</TransitionContext>
        </div>
      )
      expect(comp.text()).to.equal('test')
      expect(render.args).to.deep.equal([['in']])
    })
    it('calls didComeIn if in during mount', async (): Promise<void> => {
      const didComeIn = sinon.spy()

      mount(<TransitionContext transitionState="in" didComeIn={didComeIn} />)
      await delay(30)
      expect(didComeIn.called).to.be.true
    })
    it(`doesn't call didComeIn if not in during mount`, async (): Promise<void> => {
      const didComeIn = sinon.spy()

      mount(
        <TransitionContext transitionState="entering" didComeIn={didComeIn} />
      )
      await delay(30)
      expect(didComeIn.called).to.be.false
    })
    it('calls willLeave if in during unmount', async (): Promise<void> => {
      const willLeave = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="in" willLeave={willLeave} />
      )
      expect(willLeave.called).to.be.false

      comp.unmount()
      await delay(30)
      expect(willLeave.called).to.be.true
    })
    it(`doesn't call willLeave if not in during unmount`, async (): Promise<void> => {
      const willLeave = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="leaving" willLeave={willLeave} />
      )
      expect(willLeave.called).to.be.false

      comp.unmount()
      await delay(30)
      expect(willLeave.called).to.be.false
    })
    it(`calls onTransition after transitionState changes`, async function(): Promise<void> {
      const onTransition = sinon.spy()

      const comp = mount(
        <TransitionContext
          transitionState="entering"
          onTransition={onTransition}
        />
      )
      expect(onTransition.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="in" onTransition={onTransition} />
            .props
        )
        .update()

      await delay(30)
      expect(onTransition.args).to.deep.equal([['entering', 'in']])

      onTransition.resetHistory()
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="leaving"
              onTransition={onTransition}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(onTransition.args).to.deep.equal([['in', 'leaving']])

      onTransition.resetHistory()
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="out"
              onTransition={onTransition}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(onTransition.args).to.deep.equal([['leaving', 'out']])
    })
    it(`calls willComeIn when state changes from out to entering`, async function(): Promise<void> {
      const willComeIn = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="out" willComeIn={willComeIn} />
      )
      expect(willComeIn.called).to.be.false
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="entering"
              willComeIn={willComeIn}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(willComeIn.called).to.be.true
    })
    it(`calls willComeIn when state changes from out to appearing`, async function(): Promise<void> {
      const willComeIn = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="out" willComeIn={willComeIn} />
      )
      expect(willComeIn.called).to.be.false
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="appearing"
              willComeIn={willComeIn}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(willComeIn.called).to.be.true
    })
    it(`doesn't call willComeIn when state changes from out to in`, async function(): Promise<void> {
      const willComeIn = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="out" willComeIn={willComeIn} />
      )
      expect(willComeIn.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="in" willComeIn={willComeIn} />
            .props
        )
        .update()

      await delay(30)
      expect(willComeIn.called).to.be.false
    })
    it(`calls willEnter when state changes from out to entering`, async function(): Promise<void> {
      const willEnter = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="out" willEnter={willEnter} />
      )
      expect(willEnter.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="entering" willEnter={willEnter} />
            .props
        )
        .update()

      await delay(30)
      expect(willEnter.called).to.be.true
    })
    it(`calls willEnter when state changes from leaving to entering`, async function(): Promise<void> {
      const willEnter = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="leaving" willEnter={willEnter} />
      )
      expect(willEnter.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="entering" willEnter={willEnter} />
            .props
        )
        .update()

      await delay(30)
      expect(willEnter.called).to.be.true
    })
    it(`doesn't call willEnter when state changes from in to entering`, async function(): Promise<void> {
      const willEnter = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="in" willEnter={willEnter} />
      )
      expect(willEnter.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="entering" willEnter={willEnter} />
            .props
        )
        .update()

      await delay(30)
      expect(willEnter.called).to.be.false
    })
    it(`calls willAppear when state changes from out to appearing`, async function(): Promise<void> {
      const willAppear = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="out" willAppear={willAppear} />
      )
      expect(willAppear.called).to.be.false
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="appearing"
              willAppear={willAppear}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(willAppear.called).to.be.true
    })
    it(`calls willAppear when state changes from leaving to appearing`, async function(): Promise<void> {
      const willAppear = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="leaving" willAppear={willAppear} />
      )
      expect(willAppear.called).to.be.false
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="appearing"
              willAppear={willAppear}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(willAppear.called).to.be.true
    })
    it(`doesn't call willAppear when state changes from in to appearing`, async function(): Promise<void> {
      const willAppear = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="in" willAppear={willAppear} />
      )
      expect(willAppear.called).to.be.false
      comp
        .setProps(
          (
            <TransitionContext
              transitionState="appearing"
              willAppear={willAppear}
            />
          ).props
        )
        .update()

      await delay(30)
      expect(willAppear.called).to.be.false
    })
    it(`calls didEnter when state changes from entering to in`, async function(): Promise<void> {
      const didEnter = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="entering" didEnter={didEnter} />
      )
      expect(didEnter.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="in" didEnter={didEnter} />.props
        )
        .update()

      await delay(30)
      expect(didEnter.called).to.be.true
    })
    it(`doesn't call didEnter when state changes from appearing to in`, async function(): Promise<void> {
      const didEnter = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="appearing" didEnter={didEnter} />
      )
      expect(didEnter.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="in" didEnter={didEnter} />.props
        )
        .update()

      await delay(30)
      expect(didEnter.called).to.be.false
    })
    it(`calls didAppear when state changes from appearing to in`, async function(): Promise<void> {
      const didAppear = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="appearing" didAppear={didAppear} />
      )
      expect(didAppear.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="in" didAppear={didAppear} />.props
        )
        .update()

      await delay(30)
      expect(didAppear.called).to.be.true
    })
    it(`doesn't call didAppear when state changes from entering to in`, async function(): Promise<void> {
      const didAppear = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="entering" didAppear={didAppear} />
      )
      expect(didAppear.called).to.be.false
      comp
        .setProps(
          <TransitionContext transitionState="in" didAppear={didAppear} />.props
        )
        .update()

      await delay(30)
      expect(didAppear.called).to.be.false
    })
  })
  describe(`nested`, function() {
    it(`calls child function with overall transitionState`, function() {
      const render = sinon.spy(() => 'test')

      const comp = mount(
        <div>
          <TransitionContext transitionState="entering">
            <TransitionContext transitionState="in">{render}</TransitionContext>
          </TransitionContext>
        </div>
      )

      expect(comp.text()).to.equal('test')
      expect(render.args).to.deep.equal([['entering']])

      render.resetHistory()
      const comp2 = mount(
        <div>
          <TransitionContext transitionState="in">
            <TransitionContext transitionState="leaving">
              {render}
            </TransitionContext>
          </TransitionContext>
        </div>
      )

      expect(comp2.text()).to.equal('test')
      expect(render.args).to.deep.equal([['leaving']])

      render.resetHistory()
      const comp3 = mount(
        <div>
          <TransitionContext transitionState="entering">
            <TransitionContext>{render}</TransitionContext>
          </TransitionContext>
        </div>
      )

      expect(comp3.text()).to.equal('test')
      expect(render.args).to.deep.equal([['entering']])
    })
    it('calls didComeIn when parent changes from entering to in', async (): Promise<void> => {
      const didComeIn = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="entering">
          <TransitionContext transitionState="in" didComeIn={didComeIn} />
        </TransitionContext>
      )
      await delay(30)
      expect(didComeIn.called).to.be.false

      comp
        .setProps(
          (
            <TransitionContext transitionState="in">
              <TransitionContext transitionState="in" didComeIn={didComeIn} />
            </TransitionContext>
          ).props
        )
        .update()
      await delay(30)
      expect(didComeIn.called).to.be.true
    })
    it('calls didComeIn when parent is in and child changes from entering to in', async (): Promise<void> => {
      const didComeIn = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="in">
          <TransitionContext transitionState="entering" didComeIn={didComeIn} />
        </TransitionContext>
      )
      await delay(30)
      expect(didComeIn.called).to.be.false

      comp
        .setProps(
          (
            <TransitionContext transitionState="in">
              <TransitionContext transitionState="in" didComeIn={didComeIn} />
            </TransitionContext>
          ).props
        )
        .update()
      await delay(30)
      expect(didComeIn.called).to.be.true
    })
    it(`doesn't call didComeIn when child changes from entering to in but parent is out`, async (): Promise<void> => {
      const didComeIn = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="out">
          <TransitionContext transitionState="entering" didComeIn={didComeIn} />
        </TransitionContext>
      )
      await delay(30)
      expect(didComeIn.called).to.be.false

      comp
        .setProps(
          (
            <TransitionContext transitionState="out">
              <TransitionContext transitionState="in" didComeIn={didComeIn} />
            </TransitionContext>
          ).props
        )
        .update()
      await delay(30)
      expect(didComeIn.called).to.be.false
    })
    it('calls willLeave when parent changes from in to leaving', async (): Promise<void> => {
      const willLeave = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="in">
          <TransitionContext transitionState="in" willLeave={willLeave} />
        </TransitionContext>
      )
      await delay(30)
      expect(willLeave.called).to.be.false

      comp
        .setProps(
          (
            <TransitionContext transitionState="leaving">
              <TransitionContext transitionState="in" willLeave={willLeave} />
            </TransitionContext>
          ).props
        )
        .update()
      await delay(30)
      expect(willLeave.called).to.be.true
    })
    it('calls didLeave when parent changes from leaving to out', async (): Promise<void> => {
      const didLeave = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="leaving">
          <TransitionContext transitionState="leaving" didLeave={didLeave} />
        </TransitionContext>
      )
      await delay(30)
      expect(didLeave.called).to.be.false

      comp
        .setProps(
          (
            <TransitionContext transitionState="out">
              <TransitionContext
                transitionState="leaving"
                didLeave={didLeave}
              />
            </TransitionContext>
          ).props
        )
        .update()
      await delay(30)
      expect(didLeave.called).to.be.true
    })
    it('calls willLeave when tree unmounts', async (): Promise<void> => {
      const willLeave = sinon.spy()

      const comp = mount(
        <TransitionContext transitionState="in">
          <TransitionContext transitionState="in" willLeave={willLeave} />
        </TransitionContext>
      )
      await delay(30)
      expect(willLeave.called).to.be.false

      comp.unmount()
      await delay(30)
      expect(willLeave.called).to.be.true
    })
  })
})
