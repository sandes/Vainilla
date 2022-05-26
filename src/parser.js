const Identifiers = require('./identifiers.js');
const nodes = require('./nodes.js');
const Result = require('./result.js');
const e = require('./error.js');
const It = new Identifiers();

// parser

class Parser{
    constructor(tokens, context){
        this.tokens = tokens;
        this.token_idx = -1;
        this.context = context;
        this.next();
        this.list_errors = [];
    }

    next(){
        this.token_idx++;
        this.update_current_token();


        return this.current_token;
    }

    tmp_prev_token(plus=1){
      if (this.token_idx - plus < this.tokens.length) {

          var tmp_token = this.tokens[this.token_idx - plus]
          return tmp_token;

      }
      else{
          return null;
      }
    }

    tmp_next_token(plus=1){
        if (this.token_idx + plus < this.tokens.length) {

            var tmp_token = this.tokens[this.token_idx + plus]
            return tmp_token;

        }
        else{
            return null;
        }
    }
    reverse(amount=1){
        this.token_idx = this.token_idx - amount;
        this.update_current_token();
        return this.current_token;
    }
    update_current_token(){
        if (this.token_idx < this.tokens.length && this.token_idx >= 0)
            this.current_token = this.tokens[this.token_idx];
    }
    list_expr(){

        const res = new Result();
        var elements_nodes = [];
        var pos_start = this.current_token.pos_start.get();




        if (this.current_token.type != It.TK_LSQBRA) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba '['",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        if (this.current_token.type == It.TK_RSQBRA) {
            res.register_next();
            this.next();
        }
        else{
            elements_nodes.push(res.register(this.expr()));
            if (res.error) {
                return res;
            }

            while(this.current_token.type == It.TK_COMMA){
                res.register_next();
                this.next();

                elements_nodes.push(res.register(this.expr()));
                if (res.error) {
                    return res;
                }
            }

            if (this.current_token.type != It.TK_RSQBRA) {
                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba ',' o ']'",
                    this.context,
                ));
            }
            res.register_next();
            this.next();
        }

        return res.success(new nodes.ListNode(
            elements_nodes,
            pos_start,
            this.current_token.pos_end.get()
        ));
    }
    while_expr(){
        const res = new Result();

        if (!this.current_token.matches(It.TK_KEYWORD, 'mientras')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'mientras'",
                this.context,
            ));
        }
        res.register_next();
        this.next();

        var condition = res.register(this.expr());
        if (res.error) {
            return res;
        }

        if (!this.current_token.matches(It.TK_KEYWORD, 'hacer')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'hacer'",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        if (this.current_token.type == It.TK_NEWLINE) {

            res.register_next();
            this.next();

            var body = res.register(this.statements());
            if (res.error) {
                return res;
            }

            if (!this.current_token.matches(It.TK_KEYWORD, 'finmientras')) {
                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'finmientras'",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            return res.success(new nodes.WhileNode(
                condition,
                body,
                true,
            ));
        }

        var body = res.register(this.statement());
        if (res.error) {
            return res;
        }

        return res.success(new nodes.WhileNode(
            condition,
            body,
            false
        ));
    }
    func_expr(){

        const res = new Result();
        if (!this.current_token.matches(It.TK_KEYWORD, 'funcion')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'funcion'",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        if ( this.current_token.type == It.TK_IDENTIFIER) {

            var var_name_token = this.current_token;

            if ( It.reserved().indexOf(var_name_token.value) != -1) {
                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    `'${var_name_token.value}' es una palabra reservada`,
                    this.context,
                ));
            }


            res.register_next();
            this.next();

            if (this.current_token.type != It.TK_LPAREN) {
                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba '('",
                    this.context,
                ));

            }
        }
        else{
            var var_name_token = null;
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba una variable o '('",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        var args_tokens = [];

        if ( this.current_token.type == It.TK_IDENTIFIER) {

            args_tokens.push(this.current_token);
            res.register_next();
            this.next();

            while(this.current_token.type == It.TK_COMMA){
                res.register_next();
                this.next();

                if (this.current_token.type != It.TK_IDENTIFIER) {
                    return res.failure(new e.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba una variable",
                        this.context,
                    ));
                }

                args_tokens.push(this.current_token);
                res.register_next();
                this.next();
            }



            if (this.current_token.type != It.TK_RPAREN) {

                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba ',' o ')'",
                    this.context,
                ));
            }

        }
        else{


            if (this.current_token.type != It.TK_RPAREN) {
                // we excepeted a function without arguments o return error

                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba ',' o ')'",
                    this.context,
                ));

            }

        }

        res.register_next();
        this.next();
        if (this.current_token.type == It.TK_ARROW) {

            res.register_next();
            this.next();
            var node_to_return = res.register(this.expr());
            if (res.error) {
                return res;
            }
            return res.success(new nodes.FunctionNode(
                var_name_token,
                args_tokens,
                node_to_return,
                true
            ));
        }

        if (this.current_token.type != It.TK_NEWLINE) {

            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba una '->' o 'ENTER'",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        var body = res.register(this.statements());
        if (res.error) {
            return res;
        }

        if (!this.current_token.matches(It.TK_KEYWORD, 'finfuncion')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'finfuncion' o falta un operador",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        return res.success(new nodes.FunctionNode(
            var_name_token,
            args_tokens,
            body,
            false
        ));

    }
    for_expr(){

        const res = new Result();
        if (!this.current_token.matches(It.TK_KEYWORD, 'para')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'para'",
                this.context,
            ));
        }
        res.register_next();
        this.next();

        if (
            (this.current_token.type != It.TK_IDENTIFIER)

        ) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba una variable",
                this.context,
            ));
        }

        var var_name = this.current_token;
        res.register_next();
        this.next();

        if (this.current_token.type != It.TK_EQUALS) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba '='",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        var start_value = res.register(this.expr());
        if (res.error) {
            return res;
        }
        if (!this.current_token.matches(It.TK_KEYWORD, 'hasta')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'hasta'",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        var end_value = res.register(this.expr());
        if (res.error) {
            return res;
        }

        var step_value = null;

        if (this.current_token.matches(It.TK_KEYWORD,'con')) {

            res.register_next();
            this.next();

            if (!this.current_token.matches(It.TK_KEYWORD, 'paso')) {
                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'paso'",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            step_value = res.register(this.expr());
            if (res.error) {
                return res;
            }
        }

        if (!this.current_token.matches(It.TK_KEYWORD, 'hacer')) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba 'hacer'",
                this.context,
            ));
        }

        res.register_next();
        this.next();

        if (this.current_token.type == It.TK_NEWLINE) {

            res.register_next();
            this.next();

            var body = res.register(this.statements());
            if (res.error) {
                return res;
            }
            if (!this.current_token.matches(It.TK_KEYWORD, 'finpara')) {
                return res.failure(new e.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'finpara'",
                    this.context,
                ));
            }

            res.register_next();
            this.next();
            return res.success(new nodes.ForNode(
                var_name,
                start_value,
                end_value,
                step_value,
                body,
                true
            ));
        }
        var body = res.register(this.statement());
        if (res.error) {
            return res;
        }

        return res.success(new nodes.ForNode(
            var_name,
            start_value,
            end_value,
            step_value,
            body,
            false,
        ))
    }
    if_expr_b(){
        const res = new Result();
        res.register_next();
        this.next();
        return this.if_expr_cases('si',true);
    }
    if_expr_c(){
        const res = new Result();
        var else_case = null;

        if (this.current_token.matches(It.TK_KEYWORD,'sino')) {
            res.register_next();
            this.next();

            if (this.current_token.type == It.TK_NEWLINE) {
                var statements = res.register(this.statements());
                if (res.error) {
                    return res;
                }
                else_case = [statements, true];

                if (this.current_token.matches(It.TK_KEYWORD,'finsi')) {

                    res.register_next();
                    this.next();
                }
                else{
                    return res.failure(new e.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba 'finsi'",
                        this.context,
                    ));
                }
            }
            else{
                var expr = res.register(this.statement());

                if(res.error){
                    return res;
                }
                else_case = [expr, false];
            }
        }
        return res.success(else_case);

    }
    if_expr_b_or_c(){

        const res = new Result();
        var cases = [];
        var else_case = false;

        if (this.current_token.matches(It.TK_KEYWORD,'sino')
            &&
            this.tmp_next_token().matches(It.TK_KEYWORD,'si')
            ) {

            var all_cases = res.register(this.if_expr_b());
            if (res.error) {
                return res;
            }

            cases = all_cases[0];
            else_case = all_cases[1];
        }

        else{
            else_case = res.register(this.if_expr_c());
            if (res.error) {
                return res;
            }
        }
        return res.success([cases, else_case]);
    }

    if_expr_cases(case_keyword, is_elif=null){

        const res = new Result();
        var cases = [];
        var else_case =null;

        if (!this.current_token.matches(It.TK_KEYWORD, case_keyword)) {

            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                `Se esperaba '${case_keyword}'`,
                this.context,
            ));
        }

        res.register_next();
        this.next();

        var condition = res.register(this.expr());

        //console.log("condition:", condition);

        if (res.error) {
            return res;
        }


        if (!this.current_token.matches(It.TK_KEYWORD, 'entonces')) {

            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                `Se esperaba 'entonces'`,
                this.context,
            ));

        }
        res.register_next();
        this.next();

        if (this.current_token.type == It.TK_NEWLINE) {

            res.register_next();
            this.next();

            var statements = res.register(this.statements());
            if (res.error) {
                return res;
            }

            cases.push([condition,statements,true]);

            if (this.current_token.matches(It.TK_KEYWORD,'finsi')) {

                res.register_next();
                this.next();
            }
            else{
                var all_cases = res.register(this.if_expr_b_or_c());
                if (res.error) {
                    return res;
                }
                var new_cases = all_cases[0];
                else_case = all_cases[1];

                cases = cases.concat(new_cases);
            }
        }
        else{
            var expr = res.register(this.statement());
            if (res.error) {
                return res;
            }

            cases.push([condition,expr,false]);

            var all_cases = res.register(this.if_expr_b_or_c());

            if (res.error) {
                return res;
            }

            var new_cases = all_cases[0];
            else_case = all_cases[1];

            cases = cases.concat(new_cases)
        }

        //console.log("nex:", this.current_token);

        return res.success([cases, else_case]);
    }
    if_expr(){

        const res = new Result();
        var all_cases = res.register(this.if_expr_cases('si'));
        if (res.error) {

            return res;
        }
        return res.success(
            new nodes.IfNode(
                all_cases[0], // cases
                all_cases[1] // else_case
            )
        )
    }
    call(){
        const res = new Result();



        var atom = res.register(this.atom());
        if (res.error) {


            return res;
        }
        if (this.current_token.type == It.TK_LPAREN) {
            res.register_next();
            this.next();

            var arg_nodes = [];

            if (this.current_token.type == It.TK_RPAREN) {
                res.register_next();
                this.next();

            }else{


                arg_nodes.push(res.register(this.expr()));
                if (res.error) {
                    return res;
                }

                while(this.current_token.type == It.TK_COMMA){

                    res.register_next();
                    this.next();

                    arg_nodes.push(res.register(this.expr()));
                    if (res.error) {
                        return res;
                    }
                }

                if (this.current_token.type != It.TK_RPAREN) {


                    return res.failure(new e.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba ',' o ')'",
                        this.context,
                    ));
                }
                res.register_next();
                this.next();
            }

            return res.success(new nodes.CallNode(
                atom,
                arg_nodes
            ));
        }
        return res.success(atom);
    }
    atom(who_call){

        const res = new Result();
        var token = this.current_token;

        if( [It.TK_INT, It.TK_FLOAT].indexOf(token.type) != -1 ){

            res.register_next();
            this.next();
            return res.success(new nodes.NumberNode(token));
        }
        else if ( token.type == It.TK_STRING) {

            res.register_next();
            this.next()
            return res.success(new nodes.StringNode(token))
        }
        else if ([It.TK_IDENTIFIER, It.TK_BOOLEAN].indexOf(token.type) != -1) {

            res.register_next();
            this.next()


            if (this.current_token.type == It.TK_LSQBRA) {

                res.register_next();
                this.next();

                var expr = res.register(this.expr());
                if (res.error) {
                    return res;
                }


                if (this.current_token.type != It.TK_RSQBRA) {
                    return res.failure(new e.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba ']'",
                        this.context,
                    ));

                }

                res.register_next();
                this.next();

                if (this.current_token.type == It.TK_EQUALS) {

                    res.register_next();
                    this.next();

                    var new_value = res.register(this.expr());
                    if (res.error) {
                        return res;
                    }

                    return res.success(new nodes.ListAssignNode(
                        token,
                        expr, // position
                        new_value
                    ));
                }
                return res.success(new nodes.ListAccessNode(
                    token,
                    expr
                ))
            }

            return res.success(new nodes.VarAccessNode(token))
        }
        else if (token.type == It.TK_LPAREN) {
            res.register(this.next());
            var expr = res.register(this.expr());
            if (res.error)
                return res;

            if (this.current_token.type == It.TK_RPAREN) {
                res.register(this.next());
                return res.success(expr);
            }
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "Se esperaba ')'",
                this.context,
            ));
        }
        else if (token.type == It.TK_LSQBRA) {

            var list_expr = res.register(this.list_expr());
            if (res.error) {
                return res;
            }
            return res.success(list_expr)
        }
        else if (token.matches(It.TK_KEYWORD,'si')) {

             var if_expr = res.register(this.if_expr());
             if (res.error) {
                return res;
             }
             return res.success(if_expr);
        }
        else if (token.matches(It.TK_KEYWORD,'para')) {

             var for_expr = res.register(this.for_expr());
             if (res.error) {
                return res;
             }
             return res.success(for_expr);
        }
        else if (token.matches(It.TK_KEYWORD,'mientras')) {

             var while_expr = res.register(this.while_expr());
             if (res.error) {
                return res;
             }
             return res.success(while_expr);
        }
        else if (token.matches(It.TK_KEYWORD,'funcion')) {

             var func_expr = res.register(this.func_expr());
             if (res.error) {
                return res;
             }

             return res.success(func_expr);
        }


        return res.failure(new e.InvalidSyntaxError(
            token.pos_start,
            token.pos_end,
            "Se esperaba un número",
            this.context,
        ));


        //console.log("bad ERROR:", who_call);


    }

    pow(){

        const res = new Result();
        var left = res.register(this.call());

        if (res.error){
            return res;
        }

        while([It.TK_POW].indexOf(this.current_token.type) != -1){

            var op_token = this.current_token;
            res.register_next();
            this.next();

            var right = res.register(this.factor());
            if (res.error) {
                return res;
            }
            left = new nodes.BinaryOperationNode(left, op_token, right);
        }
        return res.success(left);
    }

    factor(){

        const res = new Result();
        var token = this.current_token;
        if( [It.TK_PLUS, It.TK_MINUS].indexOf(token.type) != -1  ){





            //res.register(this.next());
            res.register_next();
            this.next();



            var factor = res.register(this.factor());
            if (res.error){
                return res;
            }
            return res.success(new nodes.UnaryOperationNode(token, factor));
        }
        return this.pow();
    }

    term(){
        const res = new Result();
        var left = res.register(this.factor());

        if (res.error){
            return res;
        }
        while([
                It.TK_MUL,
                It.TK_DIV,
                It.TK_MOD,
                It.TK_ARROW,
              ].indexOf(this.current_token.type) != -1){

            var op_token = this.current_token;
            res.register_next();
            this.next();

            var right = res.register(this.factor());
            if (res.error) {
                return res;
            }

            left = new nodes.BinaryOperationNode(left, op_token, right);
        }
        return res.success(left);

    }

    expr(){

        const res = new Result();

        if (this.current_token.type == It.TK_IDENTIFIER) {

            if(this.tmp_next_token(1).type == It.TK_EQUALS){


                var var_name = this.current_token;

                if ( It.reserved().indexOf(var_name.value) != -1) {
                    return res.failure(new e.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        `'${var_name.value}' es una palabra reservada`,
                        this.context,
                    ));
                }

                //pass indentifier
                res.register_next();
                this.next();

                //pass equals
                res.register_next();
                this.next();

                var expr = res.register(this.expr());
                if (res.error) {
                    return res;
                }
                return res.success(new nodes.VarAssignNode(
                    var_name,
                    expr
                ))
            }
        }

        var left = res.register(this.compare_expr());

        if (res.error){

            return res;
        }
        while(
            (
                (this.current_token.type == It.TK_KEYWORD)
                &&
                (this.current_token.value == "y")
            )
            ||
            (
                (this.current_token.type == It.TK_KEYWORD)
                &&
                (this.current_token.value == "o")
            )
        ){
            var op_token = this.current_token;
            res.register_next();
            this.next();

            var right = res.register(this.compare_expr());
            if (res.error) {
                return res;
            }

            left = new nodes.BinaryOperationNode(left, op_token, right);
        }
        return res.success(left);

    }
    arith_expr(){

        const res = new Result();

        var left = res.register(this.term());

        if (res.error){

            return res;
        }
        while([It.TK_PLUS, It.TK_MINUS].indexOf(this.current_token.type) != -1){

            var op_token = this.current_token;
            res.register_next();
            this.next();

            var right = res.register(this.term());
            if (res.error) {
                return res;
            }

            left = new nodes.BinaryOperationNode(left, op_token, right);
        }
        return res.success(left);
    }

    compare_expr(){

        const res = new Result();
        if (this.current_token.matches(It.TK_KEYWORD, 'no')) {
            var operation_token = this.current_token;
            res.register_next();
            this.next();

            var node = res.register(this.compare_expr());

            if (res.error) {
                return res;
            }
            return res.success(new nodes.UnaryOperationNode(
                operation_token,
                node
            ))
        }
        var left = res.register(this.arith_expr());
        if (res.error){
            return res;
        }

        while([
            It.TK_IS_EQ,
            It.TK_IS_NEQ,
            It.TK_IS_LT,
            It.TK_IS_GT,
            It.TK_IS_LTE,
            It.TK_IS_GTE,
            ].indexOf(this.current_token.type) != -1){

            var op_token = this.current_token;
            res.register_next();
            this.next();

            var right = res.register(this.arith_expr());
            if (res.error) {
                return res;
            }

            left = new nodes.BinaryOperationNode(left, op_token, right);
        }
        return res.success(left);
    }

    statement(){

        const res = new Result();
        const pos_start = this.current_token.pos_start.get();

        if (this.current_token.matches(It.TK_KEYWORD, 'retornar')) {
            res.register_next();
            this.next();

            var expr = res.try_register(this.expr());

            if (!expr) {
                this.reverse(res.to_reverse_count);
            }
            return res.success(new nodes.ReturnNode(
                expr,
                pos_start,
                this.current_token.pos_start.get(),
            ))
        }
        if (this.current_token.matches(It.TK_KEYWORD, 'continuar')) {
            res.register_next();
            this.next();

            return res.success(new nodes.ContinueNode(
                pos_start,
                this.current_token.pos_start.get()
            ))
        }
        if (this.current_token.matches(It.TK_KEYWORD, 'detener')) {
            res.register_next();
            this.next();

            return res.success(new nodes.BreakNode(
                pos_start,
                this.current_token.pos_start.get()
            ))
        }
        var expr = res.register(this.expr());

        if (res.error) {
            return res;
        }
        return res.success(expr);
    }

    statements(){

        const res = new Result();
        var statements = [];
        const pos_start = this.current_token.pos_start.get();

        while(this.current_token.type == It.TK_NEWLINE){
            res.register_next();
            this.next();
        }
        var statement = res.register(this.statement());

        if (res.error) {
            return res;
        }

        statements.push(statement);
        var more_statements = true;

        while(true){
            var new_line_count = 0;

            while  (this.current_token.type == It.TK_NEWLINE){
                res.register_next();
                this.next();
                new_line_count++;
            }
            if (new_line_count == 0) more_statements = false;
            if(!more_statements) break;

            var statement = res.try_register(this.statement());

            if (!statement) {
                this.reverse(res.to_reverse_count);
                more_statements = false;
                continue;
            }
            statements.push(statement);
        }

        return res.success(new nodes.ListNode(
            statements, // other nodes
            pos_start,
            this.current_token.pos_end.get()
        ))

    }

    parse(){
        var res = this.statements();

        if (
            (!res.error)
            &&
            (this.current_token.type != It.TK_EOF)
        ) {
            return res.failure(new e.InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                "sintaxis inválida",
                this.context,
            ));

        }

        return res;
    }

}

module.exports = Parser;
