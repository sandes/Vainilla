class NumberNode{
    constructor(token){
        this.token = token;
        this.pos_start = token.pos_start;
        this.pos_end = token.pos_end;
    }
    repr(){
        return `${this.token}`;
    }
}

class StringNode{
    constructor(token){
        this.token = token;
        this.pos_start = token.pos_start;
        this.pos_end = token.pos_end;
    }
    repr(){
        return `${this.token}`;
    }
}

class ListNode{
    constructor(element_nodes, pos_start, pos_end){
        this.element_nodes = element_nodes;
        this.pos_start = pos_start;
        this.pos_end = pos_end;
    }
    repr(){
        return `${this.element_nodes}`;
    }
}

class VarAccessNode{
    constructor(var_name_token){
        this.var_name_token = var_name_token;
        this.pos_start = this.var_name_token.pos_start;
        this.pos_end = this.var_name_token.pos_end;
    }
}

class VarAssignNode{
    constructor(var_name_token, value_node){
        this.var_name_token = var_name_token;
        this.value_node = value_node;
        this.pos_start = var_name_token.pos_start;
        this.pos_end = value_node.pos_end;
    }
    repr(){
        return `${this.var_name_token}:${this.value_node}`;
    }
}

class ListAssignNode{
    constructor(list_name_token, position, new_value){
        this.list_name_token = list_name_token;
        this.position = position;
        this.new_value = new_value;
        this.pos_start = list_name_token.pos_start;
        this.pos_end = new_value.pos_end;
    }
}

class ListAccessNode{
    constructor(list_name_token, position){
        this.list_name_token = list_name_token;
        this.position = position;
        this.pos_start = this.list_name_token.pos_start;
        this.pos_end = this.list_name_token.pos_end;
    }
}

class BinaryOperationNode{
    constructor(left_node, op_token, right_node){
        this.left_node = left_node;
        this.op_token = op_token;
        this.right_node = right_node;
        this.pos_start = left_node.pos_start;
        this.pos_end = right_node.pos_end;
    }
    repr(){
        return `${this.left_node}, ${this.op_token}, ${this.right_node}`;
    }    
}

class UnaryOperationNode{
    constructor(op_token, node){
        this.op_token = op_token;
        this.node = node;
        this.pos_start = this.op_token.pos_start;
        this.pos_end = this.node.pos_end;
    }
    repr(){
        return `${this.op_token}, ${this.node}`;
    }
}

class IfNode{
    constructor(cases, else_case){
        this.cases = cases;
        this.else_case = else_case;
        this.pos_start = cases[0][0].pos_start;
        this.pos_end = (else_case || cases[cases.length - 1])[0].pos_end;
    }
}

class ForNode{
    constructor(
        var_name_token,
        start_value_node,
        end_value_node,
        step_value_node,
        body_node,
        should_return_null){

        this.var_name_token = var_name_token;
        this.start_value_node = start_value_node;
        this.end_value_node = end_value_node;
        this.step_value_node = step_value_node;
        this.body_node = body_node;
        this.should_return_null = should_return_null;
        this.pos_start = var_name_token.pos_start;
        this.pos_end = this.body_node.pos_end;

    }
}

class WhileNode{
    constructor(condition_node, body_node, should_return_null){
        this.condition_node = condition_node;
        this.body_node = body_node;
        this.should_return_null = should_return_null;
        this.pos_start = this.condition_node.pos_start;
        this.pos_end = this.body_node.pos_end;
    }
}

class FunctionNode{
    constructor(
        var_name_token,
        args_tokens,
        body_node,
        should_auto_return
    ){
        this.var_name_token = var_name_token;
        this.args_tokens = args_tokens;
        this.body_node = body_node;
        this.should_auto_return = should_auto_return;

        if (var_name_token) {
            this.pos_start = var_name_token.pos_start;
        }else if (args_tokens.length > 0) {
            this.pos_start = this.args_tokens[0].pos_start;
        }else{
            this.pos_start = this.body_node.pos_start;
        }
        this.pos_end = this.body_node.pos_end;
    }
}

class CallNode{
    constructor(node_to_call, arg_nodes){
        this.node_to_call = node_to_call;
        this.arg_nodes = arg_nodes;
        this.pos_start = this.node_to_call.pos_start;

        if (arg_nodes.length > 0) {
            this.pos_end = arg_nodes[arg_nodes.length-1].pos_end;
        }else{
            this.pos_end = this.node_to_call.pos_end;
        }
    }
}

class ReturnNode{
    constructor(node_to_return, pos_start, pos_end){
        this.node_to_return = node_to_return;
        this.pos_start = pos_start;
        this.pos_end = pos_end;
    }
}

class ContinueNode{
    constructor(pos_start, pos_end){
        this.pos_start = pos_start;
        this.pos_end = pos_end;
    }
}

class BreakNode{
    constructor(pos_start, pos_end){
        this.pos_start = pos_start;
        this.pos_end =  pos_end;
    }
}


module.exports = {
    NumberNode: NumberNode,
    BinaryOperationNode: BinaryOperationNode,
    UnaryOperationNode: UnaryOperationNode,
    StringNode:StringNode,
    VarAccessNode:VarAccessNode,
    ListNode:ListNode,
    VarAssignNode:VarAssignNode,
    ListAssignNode:ListAssignNode,
    ListAccessNode:ListAccessNode,
    IfNode:IfNode,
    ForNode:ForNode,
    WhileNode:WhileNode,
    FunctionNode:FunctionNode,
    CallNode:CallNode,
    ReturnNode:ReturnNode,
    ContinueNode:ContinueNode,
    BreakNode: BreakNode


}