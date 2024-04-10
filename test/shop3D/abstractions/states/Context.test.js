import { expect, test, vi } from 'vitest'
import Context from '../../../../src/shop3D/abstractions/states/Context.js'
import State from '../../../../src/shop3D/abstractions/states/State.js'

test('expect Context to be defined', () => {
	expect(Context).toBeDefined()
})

test('Context should throw an error if the initial state is not an instance of State', () => {
	expect(() => new Context()).toThrowError('Invalid state')
	expect(() => new Context({})).toThrowError('Invalid state')
})

test('Context must implement the following props and methods', () => {
	const s = new State()
	const c = new Context(s)
	expect(c.state).toBe(s)
	expect(c.options).toBeDefined()
	expect(c.eventDispatcher).toBeDefined()
	expect(c.setState).toBeDefined()
	expect(c.getState).toBeDefined()
	expect(c.addOnStateChangeListener).toBeDefined()
	expect(c.removeOnStateChangeListener).toBeDefined()
})

test('Context.addOnStateChangeListener should add a listener to "stateChange" event', () => {
	const m = function () {}
	const c = new Context(new State())
	c.addOnStateChangeListener(m)

	expect(c.eventDispatcher._listeners['stateChange'][0]).toBe(m)
})

test('Context.removeOnStateChangeListener should remove "stateChange" listener', () => {
	const m = function() {}
	const c = new Context(new State())
	c.addOnStateChangeListener(m)
	c.removeOnStateChangeListener(m)

	expect(c.eventDispatcher._listeners['stateChange'].length).toBe(0)	
})

test('Context.setState should throw an error if the argument is not a state', () => {
	expect(() => new Context().setState(null)).toThrowError()
	expect(() => new Context().setState({})).toThrowError()
}) 

test('Context.setState should set the state property to the new state', () => {
	const c = new Context(new State())		
	const s = new State()

	c.setState(s)
	expect(c.state).toBe(s)
})

test('Context.setState should call exit if the new state is not the same', () => {
	const initialState = new State()
	const initialStateSpy = vi.spyOn(initialState, 'exit')
	const c = new Context(initialState)
	c.setState(new State())

	expect(initialStateSpy).toHaveBeenCalled()
})

test('Context.setState should not call exit if the new state is the same as the current', () => {
	const initialState = new State()
	const initialStateSpy = vi.spyOn(initialState, 'exit')
	const c = new Context(initialState)
	c.setState(initialState)

	expect(initialStateSpy).not.toHaveBeenCalled()
})

test('Context.setState should dispatch an "stateChange" event with the new and old state', () => {
	const initialState = new State()
	const c = new Context(initialState)
	const s = new State()
	let oldState, newState;
	const m = function(e) {
		oldState = e.oldState;
		newState = e.newState;
	}
	c.addOnStateChangeListener(m)
	c.setState(s)

	expect(oldState).toBe(initialState)
	expect(newState).toBe(s)
})

test('Context.setState should set the state options to its own', () => {
	const opt = { prop: 1 }
	const c = new Context(new State(), opt)
	const s = new State()
	c.setState(s)
	expect(s.options).toStrictEqual(opt)
})

test('Context.setState should call the new state\'s enter method', () => {
	const s = new State()
	const sSpy = vi.spyOn(s, 'enter')
	const c = new Context(new State())
	c.setState(s)

	expect(sSpy).toHaveBeenCalled()
})

test('Context.setState should provide itself to the new state\'s enter method', () => {
	const expectedState = new State()	
	// Note: I expect the following test state to
	// utilize the provided setState method to set
	// a third state, used for comparison.
	const mediatorState = new (class TestState extends State {
		enter(setState) { setState(expectedState); }
	})

	const c = new Context(new State())
	c.setState(mediatorState)

	expect(c.state).toBe(expectedState)
})

test('Context.getState should return the current state', () => {
	const s = new State()
	const c = new Context(s)
	expect(c.getState()).toBe(s)
})

