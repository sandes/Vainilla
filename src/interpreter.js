const Runtime = require('./runtime.js');
const Number_ = require('./number.js');
const String_ = require('./string.js');
const List = require('./list.js');
const e = require('./error.js');
const Identifiers = require('./identifiers.js');
const Function_ = require('./func.js');

const It = new Identifiers();
var haserror = null;
var cont = 0 ;


function promise() {
  return new Promise(resolve => setTimeout(resolve) );
}

class Interpreter{

    run(node, context, from){

        if(node != null){
          return new Interpreter()[
             `run_${node.constructor.name}`
          ](node, context);

        }else{
           return new Interpreter()[`method_not_exists`]();
        }



    }
    method_not_exists(){
        console.log("not exists");
    }
    run_NumberNode(node, context){



        //cont++;
        //console.log(Function.name, ":", cont);

        var n = new Number_(node.token.value);
        n.set_position(node.pos_start,node.pos_end);
        n.set_context(context);

        return new Runtime().success(n);

    }
    run_StringNode(node, context){
        var s = new String_(node.token.value);
        s.set_context(context);
        s.set_position(
            node.pos_start,
            node.pos_end
        );

        return new Runtime().success(s);


    }
    run_BinaryOperationNode(node, context){



        var res = new Runtime();

        var left = res.register(this.run(node.left_node, context));

        if (res.should_return()){
            return res;
        }

        var right = res.register(this.run(node.right_node, context));

        if (res.should_return()){
            return res;
        }


        if (node.op_token.type == It.TK_PLUS) {

            var result = left.add(right);
        }

        else if (node.op_token.type == It.TK_MINUS) {
            var result = left.minus(right);
        }
        else if (node.op_token.type == It.TK_MUL) {
            var result = left.mul(right);
        }
        else if (node.op_token.type == It.TK_DIV) {
            var result = left.div(right);
        }

        else if (node.op_token.type == It.TK_POW) {
            var result = left.pow(right);
        }

        else if (node.op_token.type == It.TK_MOD) {
            var result = left.mod(right);
        }

        else if (node.op_token.type == It.TK_ARROW) {
            var result = left.retrieve(right);
        }

        else if (node.op_token.type == It.TK_IS_EQ) {
            var result = left.get_comparation_equals(right);
        }
        else if (node.op_token.type == It.TK_IS_NEQ) {
            var result = left.get_comparation_not_equals(right);
        }
        else if (node.op_token.type == It.TK_IS_LT) {
            var result = left.get_comparation_lt(right);
        }
        else if (node.op_token.type == It.TK_IS_LTE) {
            var result = left.get_comparation_lte(right);
        }

        else if (node.op_token.type == It.TK_IS_GT) {
            var result = left.get_comparation_gt(right);
        }
        else if (node.op_token.type == It.TK_IS_GTE) {
            var result = left.get_comparation_gte(right);
        }

        else if (node.op_token.matches(It.TK_KEYWORD, 'y')) {
            var result = left.and_by(right);
        }
        else if (node.op_token.matches(It.TK_KEYWORD, 'o')) {
            var result = left.or_by(right);
        }




        if (result.error){

            return res.failure(result.error);
        }


        return res.success(
            result.n.set_position(node.pos_start, node.pos_end )
        );
    }
    run_UnaryOperationNode(node, context){

        var res = new Runtime();

        var number = res.register(this.run(node.node, context));

        if (res.should_return())
            return res;

        if (node.op_token.type == It.TK_MINUS) {
            number = number.mul(new Number_(-1));
        }
        else if (node.op_token.matches(It.TK_KEYWORD,'no')) {
            number = number.notted()
        }

        if (number.error) {
            return res.failure(number.error);
        }

        return res.success(
            number.n.set_position(node.pos_start, node.pos_end)
        );

    }
    run_ReturnNode(node, context){



        var res = new Runtime();
        if (node.node_to_return) {
            var value = res.register(this.run(node.node_to_return, context));



            if (res.should_return()) {
                return res;
            }
        }
        else{
            var value = new Number_(0);
        }


        return res.success_return(value);

    }
    run_ContinueNode(node,context){
        var res = new Runtime();
        return res.success_continue();
    }
    run_BreakNode(node, context){

        var res = new Runtime();
        return res.success_break();
    }
    run_VarAssignNode(node, context){


        var res = new Runtime();
        var var_name = node.var_name_token.value;


        var value = res.register(this.run(
            node.value_node,
            context,
        ))


        if (res.should_return()){
            return res;
        }

        context.symbol_table.set(var_name,value);

        return res.success(value);

    }
    run_VarAccessNode(node, context){

        var res = new Runtime();
        var var_name = node.var_name_token.value;
        var value = context.symbol_table.get(var_name);

        if (!value){
            return res.failure(
                new e.RunTimeError(
                    node.pos_start,
                    node.pos_end,
                    `'${var_name}' no se ha definido`,
                    context
                )
            );
        }



        value = value.get();



        value.set_position(node.pos_start,node.pos_end);
        value.set_context(context);

        return res.success(value);
    }

    run_ListAccessNode(node, context){

        var res = new Runtime();
        var list_name = node.list_name_token.value;

        var position = res.register(this.run(
            node.position,
            context
        ));

        if (res.should_return()) {
            return res;
        }

        var list_ = context.symbol_table.get(list_name);

        if(!list_){

            return res.failure(
                new e.RunTimeError(
                    node.pos_start,
                    node.pos_end,
                    `'${list_name}' no se ha definido`,
                    context
                )
            );

        }
        list_ = list_.get();
        list_.set_position(node.pos_start, node.pos_end);
        list_.set_context(context);

        try{
          if (list_.elements[ parseInt(position.value) ] == undefined) {

            return res.failure(
              new e.RunTimeError(
                node.pos_start,
                node.pos_end,
                `El indice está fuera de rango.`,
                context
              )
            );
          }

        }catch(err){
          return res.failure(
            new e.RunTimeError(
              node.pos_start,
              node.pos_end,
              `'${list_name}' no es una lista`,
              context
            )
          );
        }


        var value = list_.elements[ parseInt(position.value) ];
        return res.success(value)

    }

    run_ListNode(node,context){

        var res = new Runtime();
        var elements = [];


        //console.log("LENNNN", node.element_nodes.length)

        for (var i = 0; i < node.element_nodes.length; i++) {


            elements.push(
                res.register(
                    this.run(node.element_nodes[i], context)
                )
            );

            if (res.should_return()) {

                return res;

            }

        }



        var l = new List(elements);
        l.set_context(context);
        l.set_position(node.pos_start, node.pos_end);


        return res.success(l);

    }


    run_WhileNode(node, context){

        var res = new Runtime();

        var elements = [];

        while (true){

            var condition = res.register(this.run(
                node.condition_node,
                context
            ));

            if (res.should_return()) {
                return res;
            }

            if (!condition.is_true()) {
                break;
            }

            var value = res.register(this.run(
                node.body_node,
                context
            ));

            if (
                (res.should_return())
                &&
                (res.loop_should_continue == false)
                &&
                (res.loop_should_break == false)
            ) {
                return res;
            }

            if (res.loop_should_continue) {

                // javascript has a strange way of handling
                // the continue statement
                // ==================
                // fix in the future

                //continue
                break;
            }

            if (res.loop_should_break) {
                break;
            }

            elements.push(value);
        }

        var l = new List(elements);
        l.set_context(context);
        l.set_position(node.pos_start, node.pos_end);

        if (node.should_return_null) {

            return res.success(new Number_(0));
        }else{
            return res.success(l);
        }
    }
    run_IfNode(node,context){




        var res = new Runtime();


        for (var i = 0; i < node.cases.length; i++) {

            var condition = node.cases[i][0];
            var expr = node.cases[i][1];
            var should_return_null = node.cases[i][2];

            // run
            var condition_value = res.register(this.run(condition,context));

            if (res.should_return()) {

                return res;
            }

            if (condition_value.is_true()) {
                var expr_value = res.register(this.run(expr,context));
                if (res.should_return()) {
                    return res;
                }

                if (should_return_null) {
                    return res.success(new Number_(0));
                }else{
                    return res.success(expr_value);
                }
            }
        }

        if (node.else_case) {

            var expr = node.else_case[0];
            var should_return_null = node.else_case[1];

            var expr_value = res.register(this.run(expr, context));

            if (res.should_return()) {
                return res;
            }

            if (should_return_null) {
                return res.success(new Number_(0));
            }else{
                return res.success(expr_value);
            }
        }

     return res.success(new Number_(0));

    }
    run_ForNode(node,context){

        var res = new Runtime();
        var elements = [];

        var start_value = res.register(this.run(
            node.start_value_node,
            context,
        ));


        if (res.should_return()) {

            return res;
        }

        var end_value = res.register(this.run(
            node.end_value_node,
            context
        ));


        if (res.should_return()) {

            return res;
        }

        if (node.step_value_node) {
            var step_value = res.register(this.run(
                node.step_value_node,
                context
            ));


            if (res.should_return()) {
                return res;
            }
        }
        else{
            var step_value = new Number_(1);
        }

        var i = start_value.value;

        if (step_value.value > 0) {
            var condition = () => i < end_value.value;
        }else{
            var condition = () => i > end_value.value;
        }

        while(condition()){

            context.symbol_table.set(node.var_name_token.value, new Number_(i));
            i = i + step_value.value;

            var value = res.register(this.run(
                node.body_node,
                context,
            ));


            if (
                (res.should_return())
                &&
                (res.loop_should_continue == false)
                &&
                (res.loop_should_break == false)
             ){
                return res;
            }

            if (res.loop_should_continue) {
                continue;
            }

            if (res.loop_should_break) {
                break;
            }

            elements.push(value);

        }

        var l = new List(elements);
        l.set_context(context);
        l.set_position(node.pos_start, node.pos_end);


        if (node.should_return_null) {
            return res.success(new Number_(0));
        }
        else{
            return res.success(l);
        }

    }
    run_FunctionNode(node, context){



        var res = new Runtime();

        if (node.var_name_token) {
            var func_name = node.var_name_token.value;
        }else{
            func_name = null;
        }
        var body_node = node.body_node;
        var args_names = [];
        for (var i = 0; i < node.args_tokens.length; i++) {
            args_names.push(node.args_tokens[i].value);
        }
        var func_value = new Function_(
            func_name,
            body_node,
            args_names,
            node.should_auto_return
        );

        func_value.set_context(context);
        func_value.set_position(node.pos_start, node.pos_end);

        if (node.var_name_token) {
            context.symbol_table.set(func_name, func_value);
        }

        return res.success(func_value);

    }

    run_CallNode(node, context){


        var res = new Runtime();
        var args = [];

        var value_to_call = res.register(this.run(
            node.node_to_call,
            context
        ));

        if (res.should_return()) {
            return res;
        }


        value_to_call = value_to_call.get();
        value_to_call.set_position(
            node.pos_start,
            node.pos_end
        );

        for (var i = 0; i < node.arg_nodes.length; i++) {
            args.push(
                res.register(
                    this.run(node.arg_nodes[i], context)
                )
            );
            if (res.should_return()) {
                return res;
            }
        }



        var rv = res.register(value_to_call.execute(args));
        if (res.should_return()) {
            return res;
        }

        rv = rv.get();
        rv.set_position(node.pos_start, node.pos_end);
        rv.set_context(context);

        return res.success(rv);
    }

}

module.exports = Interpreter;
