import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import rigmarole from '../rigmarole';

chai.use(sinonChai);

describe('rigmarole', () => {
    let viewModel;

    beforeEach(() => {
        viewModel = new rigmarole(5);
    });
    afterEach(() => {
        viewModel.reset();
    });

    describe('_initialize', () => {
        it('should initialize rigmarole', () => {
            expect(viewModel).exist;
            expect(viewModel._maxSize).to.equal(5);
        });
    });

    describe('getIndex', () => {
        it('should return the correct history index', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            expect(viewModel.getIndex()).to.be.equal(1);

            viewModel.set('a', 2);
            expect(viewModel.getIndex()).to.be.equal(2);

            viewModel.undo();
            expect(viewModel.getIndex()).to.be.equal(1);

            viewModel.undo();
            expect(viewModel.getIndex()).to.be.equal(0);

            viewModel.redo();
            expect(viewModel.getIndex()).to.be.equal(1);

            viewModel.redo();
            expect(viewModel.getIndex()).to.be.equal(2);

        });
    });

    describe('hasUndo', () => {
        it('should properly determine if there are any more undo states in the stack', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);

            expect(viewModel.hasUndo()).to.be.true;
            viewModel.undo();
            expect(viewModel.hasUndo()).to.be.false;
            viewModel.undo();
            expect(viewModel.hasUndo()).to.be.false;

        });
    });

    describe('hasRedo', () => {
        it('should properly determine if there are any more redo states in the stack', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.set('a', 56);
            viewModel.set('a', 7);
            viewModel.undo();
            viewModel.undo();
            expect(viewModel.hasRedo()).to.be.true;
            viewModel.redo();
            expect(viewModel.hasRedo()).to.be.true;
            viewModel.redo();
            expect(viewModel.hasRedo()).to.be.false;

        });
    });

    describe('operation', () => {
        it('should properly add to the history stack while performing any mutate action', () => {
            viewModel.set('a', {'b': 2});

            expect(viewModel._history.length).to.equal(1);
            viewModel.operation('a', (state) => ({ a: 'b' }));
            expect(viewModel._history.length).to.equal(2);
            expect(viewModel.get('a.b')).to.not.exist;

        });
    });

    describe('ingest', () => {
        it('should properly ingest an entire object', () => {
            viewModel.ingest({
                a: 2,
                b: 3,
                c: {
                    test: 'test'
                }
            });
            viewModel.set('b', {d: {test: 'test'}});
            expect(viewModel.get('a')).to.eql(2);
            expect(viewModel.get('b.d.test')).to.eql('test');

        });
    });

    describe('set', () => {
        it('should properly add to the history stack', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.set('a', 2);

            expect(viewModel.getIndex()).to.equal(2);

        });

        it('should properly add to the history stack and honor the max size', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.set('a', 2);
            viewModel.set('a', 7);
            viewModel.set('a', 5);
            viewModel.set('a', 6);
            viewModel.set('a', 8);

            expect(viewModel.getIndex()).to.equal(4);
            expect(viewModel._history.length).to.equal(5);

            viewModel.undo();
            viewModel.undo();
            viewModel.undo();
            viewModel.undo();
            viewModel.undo();

            expect(viewModel.get('a')).to.equal(2);

        });
    });

    describe('replace', () => {
        it('should properly replace the current state', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.set('a', 2);

            expect(viewModel.getIndex()).to.equal(2);
            viewModel.replace('a', 5);
            expect(viewModel.getIndex()).to.equal(3);
            expect(viewModel.get('a')).to.equal(5);

            viewModel.set('a', 5);
            expect(viewModel.getIndex()).to.equal(3);
            expect(viewModel.get('a')).to.equal(5);

        });
    });

    describe('delete', () => {
        it('should properly delete a variable and add to the history stack', () => {
            const testState = { b: { c: 1 }, d: { test: 'hello' } };
            viewModel.set('a', testState);
            const staticPointerTest = viewModel.get('a.d');
            expect(staticPointerTest.test).to.exist;
            expect(viewModel.get('a.b')).to.exist;

            viewModel.delete('a.b');
            expect(viewModel.get('a')).to.exist;
            expect(viewModel.get('a.b')).to.not.exist;
            expect(viewModel.get('a.d')).to.equal(staticPointerTest);
        });

        it('should properly delete an index from an array and add to the history stack', () => {
            const testArray = [{ a: 'test'}, 2, { b: 'thing' }, 4, 5, 6, 7, { foo: 'bar' }];
            viewModel.set(['a', 'array'], testArray);
            viewModel.delete(['a', 'array', '1']);
            expect(viewModel.get(['a', 'array', '1'])).to.eql(testArray[2]);
            viewModel.delete(['a', 'array', '3']);
            expect(viewModel.get(['a', 'array', '3'])).to.equal(testArray[5]);
            expect(viewModel.get(['a', 'array', 'length'])).to.equal(testArray.length - 2);
            viewModel.delete(['a', 'array', '5']);
            expect(viewModel.get(['a', 'array', 'length'])).to.equal(testArray.length - 3);
            expect(viewModel.get(['a', 'array', '4'])).to.equal(testArray[6]);
        });
    });

    describe('get', () => {
        it('should properly return the current state of a key', () => {
            viewModel.set('a', 1);
            expect(viewModel.get('a')).to.equal(1);

            viewModel.set('a', { b: 3 });
            expect(viewModel.get('a.b')).to.equal(3);

            viewModel.set('a.b', 'hello');
            expect(viewModel.get('a.b')).to.equal('hello');

            viewModel.set('a.b.c.d', { e: 'f' });
            expect(viewModel.get('a.b')).to.eql({c: { d: { e: 'f'} } });
        });
    });

    describe('getMutable', () => {
        it('should properly return the current state of a key', () => {
            viewModel.set('a', 1);
            expect(viewModel.get('a')).to.equal(1);

            viewModel.set('a', { b: 3 });
            expect(viewModel.get('a.b')).to.equal(3);

            viewModel.set('a.b', 'hello');
            expect(viewModel.get('a.b')).to.equal('hello');

            viewModel.set('a.b.c.d', { e: 'f' });
            expect(viewModel.get('a.b')).to.eql({ c: { d: { e: 'f' } } });

            const mutable = viewModel.getMutable('a.b.c.d');
            mutable.e = 'g';
            mutable.test = { food: 'buffet' };
            expect(mutable.e).to.equal('g');
            expect(mutable.test).to.eql({ food: 'buffet' });
        });
    });

    describe('undo', () => {
        it('should undo the state', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.set('b.c', 4);

            expect(viewModel.get('a')).to.equal(3);
            expect(viewModel.get('b.c')).to.equal(4);

            const undo1 = viewModel.undo();
            expect(undo1).to.eql(['b.c']);

            const undo2 = viewModel.undo();
            expect(undo2).to.eql(['a']);

            expect(viewModel.get('a')).to.equal(1);

        });

        it('should not undo the state more than what existed in the first place', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);

            expect(viewModel.get('a')).to.equal(3);
            viewModel.undo();
            viewModel.undo();
            viewModel.undo();
            viewModel.undo();
            expect(viewModel.get('a')).to.equal(1);

        });
    });

    describe('redo', () => {
        it('should redo the state after an undo', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.set('b.c', 4);

            expect(viewModel.get('a')).to.equal(3);

            const undo1 = viewModel.undo();
            expect(undo1).to.eql(['b.c']);

            const undo2 = viewModel.undo();
            expect(undo2).to.eql(['a']);
            expect(viewModel.get('a')).to.equal(1);
            expect(viewModel.get('b')).to.not.exist;

            const redo1 = viewModel.redo();
            expect(redo1).to.eql(['a']);

            expect(viewModel.get('a')).to.equal(3);

            const redo2 = viewModel.redo();
            expect(redo2).to.eql(['b.c']);

        });

        it('should not redo the state more than what exists', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);
            viewModel.redo();
            expect(viewModel.get('a')).to.equal(3);

        });
    });

    describe('reset', () => {
        it('should reset the structure', () => {
            viewModel.set('a', 1);
            viewModel.set('a', 3);

            viewModel.reset();
            expect(viewModel.get('a')).to.not.exist;

        });
    });

    describe('documentation proof', () => {
        let documentationModel;
        beforeEach(() => {
            documentationModel = new rigmarole();
        });

        describe('replicates the uses in the documentation', () => {
            it('should validate the basic usage', () => {
                documentationModel.set('user', {});
                documentationModel.set('user.firstName', 'Anon');
                documentationModel.set('user.lastName', 'Ymous');

                documentationModel.set('user', { firstName: 'Test', lastName: 'McTester'});

                expect(documentationModel.get('user.firstName')).to.equal('Test');
                expect(documentationModel.get('user.lastName')).to.equal('McTester');

                documentationModel.undo();

                expect(documentationModel.get('user.firstName')).to.equal('Anon');
                expect(documentationModel.get('user.lastName')).to.equal('Ymous');

                documentationModel.redo();

                expect(documentationModel.get('user.firstName')).to.equal('Test');
                expect(documentationModel.get('user.lastName')).to.equal('McTester');
            });

            it('should validate manual manipulation', () => {
                documentationModel.operation('test.path', (state) => ({
                    ...state,
                    some: { sort: { of: { update: true } } }
                }));

                expect(documentationModel.get('test')).to.not.exist;
                expect(documentationModel.get('some.sort.of.update')).to.be.true;
            });

            it('should validate set', () => {
                const currentIndex = documentationModel.getIndex();
                documentationModel.set('foo.bar', true);
                expect(documentationModel.get('foo.bar')).to.be.true;
                documentationModel.set(['foo', 'bar'], false);
                expect(documentationModel.get('foo.bar')).to.be.false;
                expect(documentationModel.getIndex()).to.be.greaterThan(currentIndex);
            });

            it('should validate replace', () => {
                const currentIndex = documentationModel.getIndex();
                expect(currentIndex).to.equal(-1);
                documentationModel.replace('foo.bar', true);
                expect(documentationModel.get('foo.bar')).to.be.true;
                documentationModel.replace(['foo', 'bar'], false);
                expect(documentationModel.get('foo.bar')).to.be.false;
                documentationModel.replace(['foo', 'bar'], true);
                expect(documentationModel.getIndex()).to.equal(currentIndex + 1);

                documentationModel.set('baz', 100);
                expect(documentationModel.getIndex()).to.equal(currentIndex + 1);
            });

            it('should validate deletion', () => {
                documentationModel.replace('foo.bar', true);
                expect(documentationModel.get('foo.bar')).to.be.true;
                documentationModel.delete('foo.bar');
                expect(documentationModel.get('foo.bar')).to.not.exist;
                expect(documentationModel.get('foo')).to.exist;
            });

            it('should validate get', () => {
                documentationModel.set('a', { b: 3 });

                const a = documentationModel.get('a');
                expect(a).to.eql({ b: 3 });
                try {
                    a.b = 4;
                }
                catch (error) {
                    expect(error).to.exist;
                }
            });

            it('should validate getMutable', () => {
                documentationModel.set('a', { b: 3 });

                const a = documentationModel.getMutable('a');
                const b = documentationModel.getMutable('a.b');
                expect(b).to.equal(3);
                expect(a).to.eql({ b: 3 });
                try {
                    a.b = 4;
                    expect(a.b).to.equal(4);
                }
                catch (error) {
                    expect(error).to.not.exist;
                }
            });

            it('should validate undo/redo', () => {
                documentationModel.set('user', {});
                documentationModel.set('user', { firstName: 'Test', lastName: 'McTester'});
                documentationModel.replace('user.firstName', 'Anon');
                documentationModel.set('user.lastName', 'Ymous');

                expect(documentationModel.get('user.firstName')).to.equal('Anon');
                expect(documentationModel.get('user.lastName')).to.equal('Ymous');

                const undoPaths = documentationModel.undo();
                expect(undoPaths).to.eql(['user.firstName', 'user.lastName']);

                expect(documentationModel.get('user.firstName')).to.equal('Test');
                expect(documentationModel.get('user.lastName')).to.equal('McTester');

                const redoPaths = documentationModel.redo();
                expect(redoPaths).to.eql(['user.firstName', 'user.lastName']);

                expect(documentationModel.get('user.firstName')).to.equal('Anon');
                expect(documentationModel.get('user.lastName')).to.equal('Ymous');
            });
        });
    });
});
