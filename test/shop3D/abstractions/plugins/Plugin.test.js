import { expect, test } from 'vitest'
import Plugin from '../../../../src/shop3D/abstractions/plugins/Plugin.js'

test('Plugin must be defined', () => {
	expect(Plugin).toBeDefined()
})

test('Plugin must define an init method', () => {
	expect((new Plugin()).init).toBeDefined()
})

test('Plugin must define an exit method', () => {
	expect((new Plugin()).exit).toBeDefined()	
})

