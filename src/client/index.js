// @flow

import s from './sdk'
import app from './app'
import Debug from 'debug'

const debug = Debug('laundree.client')

debug('┬┴┬┴┤ ͜ʖ ͡°) ├┬┴┬┴')

app()

window.sdk = s

export const sdk = s
