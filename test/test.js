const {expect} = require('chai');
const {context} = require('../computeContext');
describe('Report builder', function(){
    
    it('should work with simple math', function(){
        var input = '5+5*5';
        context.evaluate([
            context.getAst(input)
        ]);
        expect(context.outputs[0]).to.equal(30);
    });
    it('should compute values from variables', function(){
        context.evaluate([
            context.getAst('a=3'),
            context.getAst('a')
        ]);
        expect(context.outputs).to.deep.equal([3,3]);
    });
    it('should compute functions', function(){
        context.evaluate([
            context.getAst('fun a(b,c)=>b*c'),
            context.getAst('a(5,5)')
        ]);
        expect(context.outputs).to.deep.equal(['Function',25]);
    });
    it.only('should compute functions with one parameter', function(){
        context.evaluate([
            context.getAst('fun a(b)=>b*3'),
            context.getAst('a(4)')
        ]);
        expect(context.outputs).to.deep.equal(['Function',12]);
    });
    it('should throw when there is no variable declared', function(){
        expect(() => {
            context.evaluate([
                context.getAst('somevar')
            ]);
        }).to.throw();
    });
    it('should throw when no function', function(){
        expect(() => {
            context.evaluate([
                context.getAst('a(5,5)')
            ]);
        }).to.throw();
    });
});