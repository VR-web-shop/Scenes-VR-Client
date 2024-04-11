import { expect, test } from 'vitest'
import Command from '../../../../src/shop3D/abstractions/commands/Command.js'

test('Command must be defined', () => {
	expect(Command).toBeDefined()
})

test('Command.execute should throw an error', async () => {
	await expect(() => (new Command()).execute())
		.rejects
		.toThrowError('Command.execute() must be overridden')
})
