import { expect, test, vi } from 'vitest'
import Manager from '../../../src/shop3D/abstractions/Manager.js'
import View from '../../../src/shop3D/abstractions/View.js'
import State from '../../../src/shop3D/abstractions/states/State.js'
import Command from '../../../src/shop3D/abstractions/commands/Command.js'
import Plugin from '../../../src/shop3D/abstractions/plugins/Plugin.js'

test('expect Manager to be defined', () => {
	expect(Manager).toBeDefined()
})

test('expect Manager to throw an error if the first argument is not a view', () => {
	expect(() => new Manager({})).toThrowError()
})

test('expect Manager to throw an error if the second argument is not a state', () => {
	expect(() => new Manager(new View(), {})).toThrowError()
})

test('expect Manager to implement the following methods', () => {
	const m = new Manager()
	expect(m.invoke).toBeDefined()
	expect(m.setState).toBeDefined()
	expect(m.getState).toBeDefined()
	expect(m.addPlugin).toBeDefined()
	expect(m.removePlugin).toBeDefined()
})

test('expect Manager.invoke to call a command\'s execute method', async () => {
	const c = new (class TestCommand extends Command {
		async execute(opt) {}
	})
	const cSpy = vi.spyOn(c, 'execute')
	const m = new Manager()
	await m.invoke(c)

	expect(cSpy).toHaveBeenCalled()
})


test('expect Manager.getState to return the current state', () => {
	const s = new State()
	const m = new Manager(new View(), s)
	expect(m.getState()).toBe(s)
})

test('expect Manager.setState to change the manager\'s current state', () => {
	const s = new State()
	const m = new Manager()
	m.setState(s)

	expect(m.getState()).toBe(s)
})

test('expect Manager Invoker to have access to a plugin find, init, and exit method through its options', async () => {
	let find, init, exit
	const s = new (class TestCommand extends Command {
		async execute(opt) {
			find = opt.plugins.find
			init = opt.plugins.init
			exit = opt.plugins.exit
		}
	})
	const m = new Manager()
	await m.invoke(s)

	expect(find).toBeDefined()
	expect(init).toBeDefined()
	expect(exit).toBeDefined()
})

test('expect Manager Invoker to have access to Context OnState event listener methods', async () => {	
	let addOnStateChangeListener
	let removeOnStateChangeListener
	const s = new (class TestCommand extends Command {
		async execute(opt) {
			addOnStateChangeListener = opt.context.addOnStateChangeListener
			removeOnStateChangeListener = opt.context.removeOnStateChangeListener
		}
	})
	const m = new Manager()
	await m.invoke(s)

	expect(addOnStateChangeListener).toBeDefined()
	expect(removeOnStateChangeListener).toBeDefined()
})

test('expect Manager Invoker to have access to the view through its options', async () => {
	let view
	const s = new (class TestCommand extends Command {
		async execute(opt) { view = opt.view }
	})
	const m = new Manager()
	await m.invoke(s)

	expect(view).toBeDefined()
})

test('expect Manager Context to have access to a plugin find, init, and exit through its options', () => {	
	const s = new State()
	const m = new Manager(new View(), s)

	expect(s.options.plugins.find).toBeDefined()
	expect(s.options.plugins.init).toBeDefined()
	expect(s.options.plugins.exit).toBeDefined()
})

test('expect Manager Context to have access to the view through its options', () => {
	const s = new State()
	const m = new Manager(new View(), s)

	expect(s.options.view).toBeDefined()

})

test('expect Manager.addPlugin to add a plugin to its pluginCtrl', () => {
	const plugin = new Plugin('p1')
	const s = new State()
	const m = new Manager(new View(), s)
	m.addPlugin(plugin)

	expect(s.options.plugins.find('p1').name).toBe(plugin.name)
})

test('expect Manager.removePlugin to remove a plugin from its pluginCtrl', () => {
	const plugin = new Plugin('p1')
	const s = new State()
	const m = new Manager(new View(), s)
	m.addPlugin(plugin)
	m.removePlugin(plugin.name)

	expect(s.options.plugins.find('p1')).toBeUndefined()
})
