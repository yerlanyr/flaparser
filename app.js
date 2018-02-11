const readline = require('readline');
let commands = [];
const {context} = require('./computeContext');
function ask(){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    rl.question('go >', (command) => {
        const ast = context.getAst(command);
        try{
            commands.push(ast);
            context.evaluate(commands);
            console.log(context.outputs[context.outputs.length - 1]);
        }
        catch(ex){
            console.log(ex.message);
            commands.pop();
        }
        rl.close();
        ask();
    });
}
ask();