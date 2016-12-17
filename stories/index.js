import React from 'react'
import { storiesOf } from '@kadira/storybook'
import Hello from '../src/index'

storiesOf('react-redux-features', module)
  .add('Hello', () => (
    <Hello />
  ))
