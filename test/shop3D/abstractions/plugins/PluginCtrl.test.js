import { expect, test, vi } from 'vitest'
import Plugin from '../../../../src/shop3D/abstractions/plugins/Plugin.js'
import PluginCtrl from '../../../../src/shop3D/abstractions/plugins/PluginCtrl.js'

test('PluginCtrl must be defined', () => {
	expect(PluginCtrl).toBeDefined()
})

test('PluginCtrl must define the following methods', () => {
	const ctrl = new PluginCtrl()
	expect(ctrl.add).toBeDefined()
	expect(ctrl.remove).toBeDefined()
	expect(ctrl.find).toBeDefined()
	expect(ctrl.init).toBeDefined()
	expect(ctrl.exit).toBeDefined()
})

test('PluginCtrl.find must return a plugin based on a string', () => {
	const p = new Plugin('PLUGIN NAME')
	const c = new PluginCtrl()
		.add(p)

	expect(c.find('PlUgiN NaMe')).toBe(p)
})

test('PluginCtrl.add must require the argument to be of type Plugin', () => {
	const ctrl = new PluginCtrl()
	expect(() => ctrl.add({})).toThrowError()
	expect(() => ctrl.add(null)).toThrowError()
	expect(() => ctrl.add(undefined)).toThrowError()
})

test('PluginCtrl.add must return the PluginCtrl instance', () => {
	const c = new PluginCtrl()
	expect(c.add(new Plugin('p'))).toBe(c)
})

test('PluginCtrl.add must not add two plugins with the same name', () => {	
	const p1 = new Plugin('p1')
	const p1_2 = new Plugin('p1')
	const ctrl = new PluginCtrl()
		.add(p1)

	expect(() => ctrl.add(p1_2)).toThrowError('Plugin already exists')
})

test('PluginCtrl.remove should throw an error if the argument is not a string', () => {
	const c = new PluginCtrl()
	expect(() => c.remove({})).toThrowError()
	expect(() => c.remove(null)).toThrowError()
	expect(() => c.remove(undefined)).toThrowError()
})

test('PluginCtrl.remove must return the PluginCtrl instance', () => {
	const c = new PluginCtrl().add(new Plugin('p'))
	expect(c.remove('p')).toBe(c)
})

test('PluginCtrl.remove should remove a plugin based on a string', () => {
	const p = new Plugin('PLUGIN NAME')
	const c = new PluginCtrl()
		.add(p)
		.remove('plugin name')
	expect(c.find('plugin name')).toBeUndefined()
})

test('PluginCtrl.init should call init on all registrated plugins', () => {
	const p1 = new Plugin('p1')
	const p2 = new Plugin('p2')
	const c = new PluginCtrl().add(p1).add(p2)
	const p1Spy = vi.spyOn(p1, 'init')
	const p2Spy = vi.spyOn(p2, 'init')

	c.init({})

	expect(p1Spy).toHaveBeenCalled()
	expect(p2Spy).toHaveBeenCalled()
})

test('PluginCtrl.exit should call exit on all registrated plugins', () => {
	const p1 = new Plugin('p1')
	const p2 = new Plugin('p2')
	const c = new PluginCtrl().add(p1).add(p2)
	const p1Spy = vi.spyOn(p1, 'exit')
	const p2Spy = vi.spyOn(p2, 'exit')

	c.exit({})

	expect(p1Spy).toHaveBeenCalled()
	expect(p2Spy).toHaveBeenCalled()
})
