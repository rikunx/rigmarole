# rigmarole
A simple library that leverages the utility of [Seamless-Immutable](https://github.com/rtfeldman/seamless-immutable) to handle immutable states as updates are pushed to the history stack.

## Usage Overview
```
npm install rigmarole
```
### ES Module

```
import rigmarole from 'rigmarole';
```
### CommonJS
```
const rigmarole = require('rigmarole');
```

### Browser
```
<script src="rigmarole.js"></script>
```

### Example Usage
```
// Initialize with a maximum stack size of 100
const stateStack = new rigmarole(100);

stateStack.set('user', {});
stateStack.set('user.firstName', 'Anon');
stateStack.set('user.lastName', 'Ymous');

stateStack.set('user', { firstName: 'Test', lastName: 'McTester'});

stateStack.get('user.firstName'); // returns 'Test'
stateStack.get('user.lastName'); // returns 'McTester'

stateStack.undo();

stateStack.get('user.firstName'); // now returns 'Anon'
stateStack.get('user.lastName'); // now returns 'Ymous'

stateStack.redo();

stateStack.get('user.firstName'); // returns 'Test' again
stateStack.get('user.lastName'); // returns 'McTester' again
```

## API
- [set](#set)
- [replace](#replace)
- [delete](##delete)
- [get](#get)
- [getMutable](#getmutable)
- [undo](#undo)
- [redo](#redo)
- [ingest](#ingest)
- [reset](#reset)
- [getIndex](#getindex)
- [hasUndo](#hasundo)
- [hasRedo](#hasredo)
- [operation](#operation)
- [mutateOperation](#mutateoperation)
- [setDirty](#setdirty)
- [clearDirty](#cleardirty)

### set
Simple helper function for setting a value at a known key path. If the state is already dirty, this and following `replace`s will not add to the stack. If not, the `replace` will set it to dirty, and add to the stack.

Returns the path that was affected as a string.
```
stateStack.set('foo.bar', true);
stateStack.set(['foo', 'bar'], false);
```

### replace
Simple helper function for setting a value at a known key path. If the state is already dirty, this and following `replace`s will not add to the stack. If not, the `replace` will set it to dirty, and add to the stack.

Returns the path that was affected as a string.

*Usage for this might be for updating the state with data that you don't want to save to the stack.*
```
const stateStack = new rigmarole();
stateStack.getIndex(); // returns -1 after being newly initialized
stateStack.replace('foo.bar', true);
stateStack.getIndex(); // returns 0
stateStack.replace(['foo', 'bar'], false);
stateStack.replace(['foo', 'bar'], true);
stateStack.getIndex(); // returns 0
```

### delete
Deletes a value at a known key path.
```
stateStack.replace('foo.bar', true);
stateStack.get('foo.bar'); // returns true
stateStack.delete('foo.bar');
stateStack.get('foo.bar'); // returns undefined
```

### get
Retrieves a value at a known key path.
```
stateStack.set('a', { b: 3 });
const a = stateStack.get('a');
a.b = 4; // should print an error similar to "TypeError: Cannot assign to read only property 'b' of object '#<Object>'"
console.log(a.b) // prints 3
```

### getMutable
Retrieves a value at a known key path as a mutable object.
```
stateStack.set('a', { b: 3 });
const a = stateStack.getMutable('a');
a.b = 4; // should not print an error
console.log(a.b) // prints 4
```

### undo
Decrements the history index by 1.

Returns the paths that was affected as an array of strings.
```
stateStack.set('user', {});
stateStack.set('user', { firstName: 'Test', lastName: 'McTester'});
stateStack.replace('user.firstName', 'Anon');
stateStack.set('user.lastName', 'Ymous');

stateStack.undo(); // Returns ['user.firstName', 'user.lastName']

stateStack.get('user.firstName'); // returns 'Test'
stateStack.get('user.lastName'); // returns 'McTester'
```

### redo
Increments the history index by 1.

Returns the paths that was affected as an array of strings.
```
stateStack.set('user', { firstName: 'Test', lastName: 'McTester'});
stateStack.replace('user.firstName', 'Anon');
stateStack.set('user.lastName', 'Ymous');

stateStack.undo();
stateStack.redo(); // returns ['user.firstName', 'user.lastName']

stateStack.get('user.firstName'); // returns 'Anon'
stateStack.get('user.lastName'); // returns 'Ymous'
```

### ingest
Takes in an object and creates a new complete state from it.
```
stateStack.ingest({
    a: 2,
    b: 3,
    c: {
        test: 'test'
    }
});

stateStack.get('b.c.test') // returns 'test'
```

### reset
Clears and resets the stack back to the point of initialization.

### getIndex
Returns the index of the current state within the history stack.

### hasUndo
Returns whether or not a previous state exists within the history stack.

### hasRedo
Returns whether or not a next state exists within the history stack.

### operation
Wrapper function for accessing the Immutable object and manipulating it while handling the history stack.

Returns the path that was affected as a string.

*Only use this if you want to update the state manually.*
```
stateStack.operation('test.path', (state) => ({
    ...state,
    some: { sort: { of: { update: true }}}
}))
```

### mutateOperation
Like the `operation` method, but instead replaces the current state without affecting the rest of the history stack.

Returns the path that was affected as a string.

*Only use this if you want to update the state manually.*
```
stateStack.mutateOperation('test.path', (state) => ({
    ...state,
    some: { sort: { of: { update: true }}}
}))
```

### setDirty
 Sets the `_isDirty` boolean to `true` which will prevent any changes from pushing new states into the stack.

### clearDirty
Sets the `_isDirty` boolean to `false` which will allow any changes to push new states into the stack.

## To build:

`npm run build`

## To test:
`npm test`
