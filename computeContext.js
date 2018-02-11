const grammar = require("./grammar.js");
const nearley = require("nearley");

let context = {
    expressions: [],
    outputs: [],
    variables: {},
    functions: {},
    getAst(input){return new nearley.Parser(nearley.Grammar.fromCompiled(grammar)).feed(input).results; },
    operations: {
        number(ns) {return ns;},
        negation(ns) {return -ns;},
        addition(x,y) {return x+y;},
        subtraction(x,y) {return x-y;},
        multiplication(x,y) {return x*y;},
        division(x,y) {return x/y;},
        exponentiation(x,y) {return Math.pow(x,y);},
        modulo(x,y) {return x%y}
    },
    specialOperations: {
        variable(exp){ 
            if(!Object.keys(context.variables).includes(exp.nodes[0])) throw Error(`Variable ${exp.nodes[0]} is not defined`);
            return context.variables[exp.nodes[0]];
        },
        assignment(exp){
            var [left, right] = exp.nodes;
            const value = context.compute(right);
            context.variables[left.nodes[0]] = value;
            return value;
        },
        functiondec(exp){
            const [name, params, body] = exp.nodes;
            context.functions[name] = {body, params};
            const names = Object.keys(context.variables).concat(params.map(v => v.nodes[0]));
            if( 
                !context.flatten(exp).filter(e => e.type == 'variable')
                    .every(e => names.includes(e.nodes[0]))
            )
            {
                throw Error(`Function: ${name} is invalid`);
            }
            return 'Function';
        },
        function(exp){
            const savedVariables = Object.assign({}, context.variables);
            const [name,math=params] = exp.nodes;
            if(!Object.keys(context.functions).includes(name)) throw Error(`Function ${exp.nodes[0]} is not defined`);            
            const {body,params} = context.functions[name];
            for(let i=0;i<params.length;i++){
                context.variables[params[i].nodes[0]] = context.compute(math[i]);
            }
            var res = context.compute(body);
            variables = savedVariables;
            return res;
        }
    },
    flatten(exp) { 
        var res = [];
        let stack = [exp];
        while(stack.length){
            var item = stack.pop();
            res.push(item);
            for(var child in item.nodes){
                stack.push(child);
            }
        }
        return res;
    },
    compute: (exp) => {
        if (typeof(exp) ==='number') return exp;
        if(exp.type === 'negation') exp.nodes.push(0);
        let specialOperation = context.specialOperations[exp.type];
        if(specialOperation){
            return specialOperation(exp);
        }
        if(exp.nodes == undefined) {
            throw Error(`${JSON.stringify(exp, null , 2)} nodes is undefined`);
        }
        return exp.nodes.map(node => context.compute(node)).reduce(context.operations[exp.type]);
    },
    evaluate: (expressions) => {
        context.outputs = [];
        context.variables = {};
        context.functions = {};
        context.expressions = expressions;
        for(let expression of context.expressions){
            // try to compute using context.
            context.outputs.push(context.compute(expression[0]));
        }
    },
}
module.exports = {context};