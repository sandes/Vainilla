const FunctionBase =  require('./funcbase.js');
const Runtime = require('./runtime.js');

class Function_ extends FunctionBase{

    constructor(name, body_node, arg_names, should_auto_return){
        super(name);
        this.body_node = body_node;
        this.arg_names = arg_names;
        this.should_auto_return = should_auto_return;
    }
    execute(args){

        const Interpreter = require('./interpreter.js');

        var res = new Runtime();
        var inter = new Interpreter();

        var exec_ctx = this.generate_new_context();
        res.register(this.check_and_populate_args(
            this.arg_names,
            args,
            exec_ctx
        ));

        if (res.should_return()) {
            return res;
        }

        var value = res.register(inter.run(
            this.body_node,
            exec_ctx
        ));

        if (res.should_return() && res.func_return_value == null) {
            return res;
        }

        if (this.should_auto_return) {
            return res.success(value);
        }

        else if(res.func_return_value){
            return res.success(res.func_return_value);
        }

        else{
            const Number_ = require('./number.js');
            return res.success(new Number_(0));
        }

    }
    get(){
        var get = new Function_(
            this.name,
            this.body_node,
            this.arg_names,
            this.should_auto_return
        );
        get.set_context(this.context);
        get.set_position(this.pos_start, this.pos_end);

        return get;
    }
    repr(){

        return `<Función ${this.name}>`;
    }


}

module.exports = Function_;