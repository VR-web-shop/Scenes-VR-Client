import { expect, test, vi } from 'vitest'
import Command from '../../../../src/shop3D/abstractions/commands/Command.js'
import Invoker from '../../../../src/shop3D/abstractions/commands/Invoker.js'

test('Invoker.invoke should throw an error if the argument is not a command', async () => {
	await expect(() => (new Invoker()).invoke({}))
		.rejects
		.toThrowError('Invalid command')
})

test('Invoker.invoke should call the execute method of the command argument', async () => {
	const testCommand = new (class TestCommand extends Command {
		async execute() {}
	})
	const testCommandSpy = vi.spyOn(testCommand, 'execute')
	await new Invoker().invoke(testCommand)
	
	expect(testCommandSpy).toHaveBeenCalled()
})

test('Invoker.options should be available to commands when execute invoke', async () => {
	const options = {fn: () => {}}
	const optionsSpy = vi.spyOn(options, 'fn')
	await new Invoker(options)
		.invoke((new (class TestCommand extends Command {
			async execute(opt) { opt.fn() }
		})
	))

	expect(optionsSpy).toHaveBeenCalled()
})


test('Invoker must have an options property', () => {
	expect((new Invoker()).options).toEqual({})
	expect((new Invoker(null)).options).toEqual({})
	expect((new Invoker(undefined)).options).toEqual({})
})
