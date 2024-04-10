import { expect, test, vi } from 'vitest'
import State from '../../../../src/shop3D/abstractions/states/State.js'

test('expect State to be defined', () => {
	expect(State).toBeDefined()
})

test('State must have an options property', () => {
	expect((new State()).options).toBeDefined()
})

test('State must have an enter and exit method', () => {
	expect((new State()).enter).toBeDefined()	
	expect((new State()).exit).toBeDefined()
})

test('State.setOptions should throw an error if the argument is undefined', () => {
	const s = new State()
	expect(() => s.setOptions(null)).toThrowError()
	expect(() => c.seOptions(undefined)).toThrowError()
})

test('State.setOptions should update the state\'s options', () => {
	const opt = { prop: 1 }
	const s = new State()
	s.setOptions(opt)

	expect(s.options).toBe(opt)
})
