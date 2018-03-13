import SeamlessImmutable from 'seamless-immutable';

const Immutable = SeamlessImmutable.static;

function setState(keyPathValue, state) {
    return Immutable.setIn(state, keyPathValue.keyPath, Immutable(keyPathValue.value));
}

function get(keyPath, obj) {
    const
        keyPathArray = generateKeyPath(keyPath),
        key = keyPathArray[0];

    let returnedObj = null;
    if (keyPathArray.length === 1) {
        returnedObj = obj[key];
    } else if (keyPathArray.length > 1) {
        const nextKeyPath = keyPathArray.slice(1, keyPathArray.length);
        returnedObj = get(nextKeyPath, obj[key]);
    }
    return returnedObj;
}

function isNotNaN(number) {
    return number === number;
}

function deleteState(keyPath, state) {
    const
        basePath = keyPath.slice(0, keyPath.length - 1),
        tailKey = keyPath.slice(keyPath.length - 1)[0],
        key = isNotNaN(parseFloat(tailKey)) ? parseFloat(tailKey) : tailKey,
        baseObj = get(basePath, state),
        newObj = Array.isArray(baseObj) ? [...baseObj.slice(0, key), ...baseObj.slice(key + 1, baseObj.length)] : Immutable.without(baseObj, key);
    return setState(generateKeyPathValue(basePath, newObj), state);
}
function generateKeyPathValue() {
    const keyPathArguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
    let keyPath;

    if (keyPathArguments.length === 1)
        keyPath = keyPathArguments[0];
    else
        keyPath = keyPathArguments;

    const value = arguments[arguments.length - 1];
    return {
        keyPath: generateKeyPath(keyPath),
        value
    };
}
function generateKeyPath(args) {
    let keyPath = [];
    if (typeof arguments !== 'string' && arguments.length > 1)
        keyPath = Array.prototype.slice.call(arguments, 0);
    else if (typeof args !== 'string' && args.length)
        keyPath = args;
    else if (typeof args === 'string')
        keyPath = args.split(/,|\./);

    return keyPath;
}
function stringifyPath(keyPath) {
    return generateKeyPath(keyPath).join('.');
}

export default class rigmarole {
    constructor(size) {
        this.reset();
        this._maxSize = size || 1000;
    }

    /*
     *  Returns the index of the current state within the history stack
     */
    getIndex() {
        return this._historyIndex;
    }

    /*
     *  Returns whether or not a previous state exists within the history stack
     */
    hasUndo() {
        return this._historyIndex > 0;
    }

    /*
     *  Returns whether or not a next state exists within the history stack
     */
    hasRedo() {
        return this._historyIndex < (this._history.length - 1);
    }

    /*
     *  Wrapper function for accessing the Immutable object and manipulating
     *  it while handling the history stack
     *
     *  keyPath - target path representation for `value`
     *              can be string 'foo.bar.foobar'
     *              can be array of strings ['foo', 'bar', 'foobar']
     *  fn - the transformation function
     */
    operation(keyPath, fn) {
        // eliminate the future
        this._history = this._history.slice(0, this._historyIndex + 1);

        // create a new version by applying an operation to the head
        const
            prevState = this._history[this._historyIndex] || {},
            prevVersion = prevState.data || new Immutable({}),
            newVersion = fn(prevVersion);
        this._history.push({ keyPaths: [stringifyPath(keyPath)], data: !Immutable.isImmutable(newVersion) ? Immutable(newVersion) : newVersion });
        if (this._history.length <= this._maxSize)
            this._historyIndex++;
        else
            this._history = this._history.slice(1);

        return stringifyPath(keyPath);
    }
    /*
     *  Like the `operation` method, but this replaces the current state
     *  without affecting the rest of the history stack
     *
     *  keyPath - target path representation for `value`
     *              can be string 'foo.bar.foobar'
     *              can be array of strings ['foo', 'bar', 'foobar']
     *  fn - the transformation function
     */
    mutateOperation(keyPath, fn) {
        // create a new version by applying an operation to the head
        const
            prevState = this._history[this._historyIndex] || {},
            prevVersion = prevState.data || new Immutable({}),
            newVersion = fn(prevVersion),
            stringPath = stringifyPath(keyPath),
            completePaths = prevState.keyPaths.indexOf(stringPath) === -1 ? [...prevState.keyPaths, stringPath] : prevState.keyPaths;

        // replace the current state
        this._history.splice(this._historyIndex, 1, { keyPaths: completePaths, data: !Immutable.isImmutable(newVersion) ? Immutable(newVersion) : newVersion });

        return stringifyPath(keyPath);
    }
    /*
     *  Takes in an object and creates a new complete state from it
     *
     *  obj - the object to store
     */
    ingest(obj) {
        this.operation('', () => new Immutable(obj));
    }
    /*
     *  Sets the `_isDirty` boolean to `true` which will prevent any changes from pushing
     *  new states into the stack
     */
    setDirty() {
        this._isDirty = true;
    }
    /*
     *  Sets the `_isDirty` boolean to `false` which will allow any changes to push
     *  new states into the stack
     */
    clearDirty() {
        this._isDirty = false;
    }
    /*
     *  Simple helper function for setting a value at a known key path
     *  - If the state is dirty, then this will clear the dirty state and
     *    replace the current state without affecting the stack
     *  - If the state is not dirty, then this will update the state while
     *    adding to the stack normally
     *
     *  keyPath - target path representation for `value`
     *              can be string 'foo.bar.foobar'
     *              can be array of strings ['foo', 'bar', 'foobar']
     *  value - the value
     */
    set(keyPath, value) {
        const keyValue = generateKeyPathValue(keyPath, value);
        if (this._isDirty === true) {
            this.clearDirty();
            return this.mutateOperation(keyValue.keyPath, (state) => setState(keyValue, state));
        } else
            return this.operation(keyValue.keyPath, (state) => setState(keyValue, state));
    }

    /*
     *  Simple helper function for setting a value at a known key path
     *  - If the state is already dirty, this and following `replace`s will
     *    not add to the stack
     *  - If not, the `replace` will set it to dirty, and add to the stack
     *
     *  keyPath - target path representation for `value`
     *              can be string 'foo.bar.foobar'
     *              can be array of strings ['foo', 'bar', 'foobar']
     *  value - the value
     */
    replace(keyPath, value) {
        const keyValue = generateKeyPathValue(keyPath, value);
        if (this._isDirty === false) {
            this.setDirty();
            return this.operation(keyValue.keyPath, (state) => setState(keyValue, state));
        } else
            return this.mutateOperation(keyValue.keyPath, (state) => setState(keyValue, state));
    }

    /*
     *  Simple helper function for deleting a value at a known key path
     *
     *  keyPath - target path representation for `value`
     *              can be string 'foo.bar.foobar'
     *              can be array of strings ['foo', 'bar', 'foobar']
     */
    delete(keyPath) {
        const path = generateKeyPath(keyPath);
        return this.operation(path, (state) => deleteState(path, state));
    }

    /*
     *  Simple helper function for getting a value at a known key path
     */
    get(keyPath) {
        const
            keyPathArray = generateKeyPath(keyPath),
            key = keyPathArray[0];

        let returnedObj = null;
        if (keyPathArray.length === 1) {
            returnedObj = this._history[this._historyIndex] ? (this._history[this._historyIndex]).data[key] : null;
        } else if (keyPathArray.length > 1) {
            const nextKeyPath = keyPathArray.slice(1, keyPathArray.length);
            returnedObj = this._history[this._historyIndex] ? get(nextKeyPath, (this._history[this._historyIndex]).data[key]) : null;
        }
        return returnedObj;
    }

    /*
     *  Simple helper function for getting a value at a known key path as a mutable object
     */
    getMutable(keyPath, options = { deep: true }) {
        const value = this.get(keyPath);
        if (value && typeof value === 'object')
            return Immutable.asMutable(value, options);

        return value;
    }

    /*
     *  Decrements the history index by 1
     */
    undo() {
        let keyPaths = [];
        if (this._historyIndex > 0) {
            keyPaths = this._history[this._historyIndex].keyPaths;
            this._historyIndex--;
        } else {
            console.warn('Reached as far back as possible.'); // eslint-disable-line no-console
        }

        return keyPaths;
    }
    /*
     *  Increments the history index by 1
     */
    redo() {
        let keyPaths = [];
        if (this._historyIndex < this._history.length - 1) {
            this._historyIndex++;
            keyPaths = this._history[this._historyIndex].keyPaths;
        } else {
            console.warn('Latest state.'); // eslint-disable-line no-console
        }

        return keyPaths;
    }

    /*
     *  Resets the stack
     */
    reset() {
        this._history = [];
        this._historyIndex = -1;
        this._isDirty = false;
    }
}
