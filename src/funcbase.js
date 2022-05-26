const Runtime = require('./runtime.js');
const Value_ = require('./value.js');
const Context = require('./context.js');
const Symbol_ = require('./symbol.js');
const e = require('./error.js');

class FunctionBase extends Value_{
    constructor(name){
        super();
        this.name = name || "<anonimo>";
    }
    generate_new_context(){
        var new_context = new Context(this.name, this.context, this.pos_start);
        new_context.symbol_table = new Symbol_(new_context.parent.symbol_table);

        return new_context;
    }
    check_args(arg_names, args){
        var res = new Runtime();

        if (args.length != arg_names.length) {
            return res.failure(
                new e.RunTimeError(
                    this.pos_start,
                    this.pos_end,
                    `La función esperaba ${arg_names.length} argumento/s, actualmente hay ${args.length}`,
                    this.context
                )
            );
        }
        return res.success(null);
    }

    populate_args(arg_names, args, exec_ctx){

        for (var i = 0; i < args.length; i++) {
            var arg_name = arg_names[i];
            var arg_value = args[i];
            arg_value.set_context(exec_ctx);
            exec_ctx.symbol_table.set(arg_name, arg_value);
        }
    }

    populate_all_args(args, exec_ctx){

        /*populate all args*/

        var res = new Runtime();

        for (var i = 0; i < args.length; i++) {

            var arg_value = args[i];
            arg_value.set_context(exec_ctx);
            exec_ctx.symbol_table.set(i, arg_value);
        }

        return res.success(null);

    }

    check_and_populate_args(arg_names, args, exec_ctx){

        var res = new Runtime();

        res.register(this.check_args(arg_names, args));
        if (res.should_return()) {
            return res;
        }

        this.populate_args(arg_names, args, exec_ctx);
        return res.success(null);
    }
}

module.exports = FunctionBase;
