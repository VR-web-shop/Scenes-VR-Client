import { expect, test, vi } from 'vitest'
import InitializeState from '../../../src/shop3D/states/InitializeState.js'
import View3D from '../../../src/shop3D/View3D.js'
import Shop from '../../../src/shop3D/Shop.js'
import JSDOM from 'jsdom'

test('Expect ExecuteState to be defined', () => {
	expect(InitializeState).toBeDefined()
})

