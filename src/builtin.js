const FunctionBase =  require('./funcbase.js');
const Runtime = require('./runtime.js');
const List = require('./list.js');

var last_input = "";

const delay = ms => new Promise(res => setTimeout(res, ms));



function failed_params_count(expected,args_len, node){

  const e = require('./error.js');
  const res = new Runtime();

  return res.failure(
    new e.RunTimeError(
        node.pos_start,
        node.pos_end,
        `La función esperaba ${expected} argumento/s, actualmente hay ${args_len}`,
        node.context
    )
  )
}


class BuiltIn extends FunctionBase{
    constructor(name){
        super(name);
    }
    execute(args){
        const res = new Runtime();
        var exec_ctx = this.generate_new_context();

        res.register(this.populate_all_args(
            args,
            exec_ctx
        ));

        if (res.error) {
            return res;
        }

        var return_value = res.register(
            new BuiltIn()[`execute_${this.name}`](exec_ctx)
        );

        if (res.error) {
            return res;
        }
        return res.success(return_value);

    }
    get(){
        const copy = new BuiltIn(this.name);
        copy.set_context(this.context);
        copy.set_position(this.pos_start, this.pos_end);

        return copy;
    }

    execute_print(exec_ctx){
    //execute_print(exec_ctx){

        const Number_ = require('./number.js');
        const List = require('./list.js');

        const res = new Runtime();

        const len = Object.keys(exec_ctx.symbol_table.symbols).length;

        var response = "";
        for (var i = 0; i < len ; i++) {

          var instance = exec_ctx.symbol_table.symbols[i];
          response += instance.get(i).as_string();
        }

        var div = document.createElement("div");
        div.className = 'executePrint';

        div.innerHTML = `
          <div class='resrow'>${response}</div>
        `;

        document.getElementById("response").appendChild(div);

        return res.success(new Number_(0));
    }

    execute_print2(exec_ctx){
    //execute_print(exec_ctx){

        const Number_ = require('./number.js');
        const List = require('./list.js');

        const res = new Runtime();

        const len = Object.keys(exec_ctx.symbol_table.symbols).length;

        var response = "";
        for (var i = 0; i < len ; i++) {

          var instance = exec_ctx.symbol_table.symbols[i];
          response += instance.get(i).as_string();
        }

        alert(response);

        var div = document.createElement("div");
        div.className = 'executePrint';

        div.innerHTML = `
          <div class='resrow'>${response}</div>
        `;

        document.getElementById("response").appendChild(div);        

        return res.success(new Number_(0));
    }

    execute_length(exec_ctx){

      const String_ = require('./string.js');
      const List = require('./list.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      var node = exec_ctx.symbol_table.symbols[0];

      if(args_len > 1 ){
        return failed_params_count(1,args_len,node)
      }

      if (node instanceof List){
        return res.success(new Number_((node.elements).length));
      }


      if (node instanceof String_){
        return res.success(new Number_((node.value).length));
      }

      return res.failure(
        new e.RunTimeError(
            node.pos_start,
            node.pos_end,
            'El argumento debe ser una lista o una cadena de texto',
            node
        )
      )

    }

    execute_square(exec_ctx){

      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();


      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      var node = exec_ctx.symbol_table.symbols[0];

      if(args_len > 1 ){

        return failed_params_count(1,args_len,node);
      }

      if (node instanceof Number_) {

        if (parseInt(node.value) < 1) {
          return res.failure(
            new e.RunTimeError(
                node.pos_start,
                node.pos_end,
                `El número debe ser positivo`,
                node.context
            )
          )
        }

        return res.success(
          new Number_(Math.pow(node.value, 0.5))
        );

      }

      return res.failure(
        new e.RunTimeError(
            node.pos_start,
            node.pos_end,
            'El argumento debe ser un número',
            node
        )
      )

    }


    execute_input(exec_ctx){

      const Number_ = require('./number.js');
      const String_ = require('./string.js');
      const e = require('./error.js');
      const res = new Runtime();


      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;
      const node = exec_ctx.symbol_table.symbols[0];

      if(args_len > 1 ){
        return failed_params_count(1,args_len,node);
      }

      if (args_len == 0) {
        var prompt = "";
      }else{
        var prompt = node.value;
      }

      var user_input = window.prompt(prompt,"");

      if (user_input) {
        return res.success(new String_(user_input));
      }
      else{
        return res.success(new String_(""));
      }

    }

    execute_is_number(exec_ctx){

      const Number_ = require('./number.js');
      const Boolean_ = require('./boolean.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;
      const node = exec_ctx.symbol_table.symbols[0];

      if (args_len == 0) {
        return res.success(new Boolean_(0));
      }

      if(args_len > 1 ){
        return failed_params_count(1,args_len,node);
      }

      if (node instanceof Number_) {
        return res.success(new Boolean_(1));
      }else{
        return res.success(new Boolean_(0));
      }

    }

    execute_is_string(exec_ctx){


      const String_ = require('./string.js');
      const Boolean_ = require('./boolean.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;
      const node = exec_ctx.symbol_table.symbols[0];

      if (args_len == 0) {
        return res.success(new Boolean_(0));
      }

      if(args_len > 1 ){
        return failed_params_count(1,args_len,node);
      }

      if (node instanceof String_) {
        return res.success(new Boolean_(1));
      }else{
        return res.success(new Boolean_(0));
      }

    }


    execute_is_list(exec_ctx){


      const List = require('./list.js');
      const Boolean_ = require('./boolean.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;
      const node = exec_ctx.symbol_table.symbols[0];

      if (args_len == 0) {
        return res.success(new Boolean_(0));
      }

      if(args_len > 1 ){
        return failed_params_count(1,args_len,node);
      }

      if (node instanceof List) {
        return res.success(new Boolean_(1));
      }else{
        return res.success(new Boolean_(0));
      }

    }

    execute_push_back(exec_ctx){

      const List = require('./list.js');
      const e = require('./error.js');
      const Number_ = require('./number.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;
      const node1 = exec_ctx.symbol_table.symbols[0];

      if (args_len == 0) {
        return res.success(new Number_(0));
      }


      if(args_len != 2 ){
        return failed_params_count(2,args_len,node1);
      }


      if (!(node1 instanceof List)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El primer argumento debe ser una lista',
              node1
          )
        )
      }

      const node2 = exec_ctx.symbol_table.symbols[1];


      (exec_ctx.symbol_table.symbols[0].elements).push(node2);

      return res.success(new Number_(0));



    }

    execute_pop(exec_ctx){

      const List = require('./list.js');
      const e = require('./error.js');
      const Number_ = require('./number.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];
      if(args_len != 2 ){
        return failed_params_count(2,args_len,node1);
      }


      if (!(node1 instanceof List)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El primer argumento debe ser una lista',
              node1
          )
        )
      }

      const node2 = exec_ctx.symbol_table.symbols[1];

      (exec_ctx.symbol_table.symbols[0].elements).splice(node2.value,1);

      return res.success(new Number_(0));


    }

    execute_concat(exec_ctx){

      const List = require('./list.js');
      const e = require('./error.js');
      const Number_ = require('./number.js');
      const res = new Runtime();

      const len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (len == 0) {
        return res.success(new Number_(0));
      }

      var newlist = [];
      for (var i = 0; i < len ; i++) {

        var instance = exec_ctx.symbol_table.symbols[i];

        if (!(instance instanceof List) ) {
          return res.failure(
            new e.RunTimeError(
                instance.pos_start,
                instance.pos_end,
                'Todos los argumentos deben ser una lista',
                instance
            )
          )
        }
        newlist = newlist.concat(instance.elements);
      }

      return res.success(new List(newlist));

    }

    execute_insert(exec_ctx){

      const List = require('./list.js');
      const e = require('./error.js');
      const Number_ = require('./number.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];
      const node2 = exec_ctx.symbol_table.symbols[1];
      const node3 = exec_ctx.symbol_table.symbols[2];

      if(args_len != 3 ){
        return failed_params_count(3,args_len,node1);
      }

      if (!(node1 instanceof List)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El primer argumento debe ser una lista',
              node1
          )
        )
      }

      if (!(node2 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node2.pos_start,
              node2.pos_end,
              'El segundo argumento debe ser un numero',
              node2
          )
        )
      }

      if(
        (parseInt(node2.value) > node1.elements.length)
        ||
        (parseInt(node2.value) < 0)
      ){
        return res.failure(
          new e.RunTimeError(
              node2.pos_start,
              node2.pos_end,
              `El indice '${parseInt(node2.value)}' esta fuera de rango`,
              node2
          )
        )
      }

      exec_ctx.symbol_table.symbols[0]
        .elements
        .splice(parseInt(node2.value), 0, node3);


      return res.success(new Number_(0));



    }

    execute_replace(exec_ctx){

      const List = require('./list.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];
      const node2 = exec_ctx.symbol_table.symbols[1];
      const node3 = exec_ctx.symbol_table.symbols[2];

      if(args_len != 3 ){
        return failed_params_count(3,args_len,node1);
      }

      if (!(node1 instanceof List)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El primer argumento debe ser una lista',
              node1
          )
        )
      }

      if (!(node2 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node2.pos_start,
              node2.pos_end,
              'El segundo argumento debe ser un numero',
              node2
          )
        )
      }

      if(
        (parseInt(node2.value) > node1.elements.length - 1)
        ||
        (parseInt(node2.value) < 0)
      ){
        return res.failure(
          new e.RunTimeError(
              node2.pos_start,
              node2.pos_end,
              `El indice '${parseInt(node2.value)}' esta fuera de rango`,
              node2
          )
        )
      }


      exec_ctx.symbol_table.symbols[0]
      .elements[parseInt(node2.value)] = node3;



      return res.success(new Number_(0));


    }

    execute_random(exec_ctx){

      const List = require('./list.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      const node1 = exec_ctx.symbol_table.symbols[0];
      const node2 = exec_ctx.symbol_table.symbols[1];

      if(args_len > 2 ){
        return failed_params_count(2,args_len,node1);
      }

      if (args_len == 0) {
        var random_value = Math.floor(Math.random() * 100);
      }

      if (args_len == 1) {


        if (!(node1 instanceof Number_)) {
          return res.failure(
            new e.RunTimeError(
                node1.pos_start,
                node1.pos_end,
                'El argumento debe ser un número',
                node1
            )
          )
        }

        var random_value = Math.floor(
          Math.random() * (parseInt(node1.value) - 0 + 1) + 0
        );


      }
      if (args_len == 2) {

        if (!(node1 instanceof Number_)) {
          return res.failure(
            new e.RunTimeError(
                node1.pos_start,
                node1.pos_end,
                'El argumento debe ser un número',
                node1
            )
          )
        }
        if (!(node2 instanceof Number_)) {
          return res.failure(
            new e.RunTimeError(
                node2.pos_start,
                node2.pos_end,
                'El argumento debe ser un número',
                node2
            )
          )
        }

        var random_value = Math.floor(
          Math.random() * (
            parseInt(node1.value)
            - parseInt(node2.value) + 1) + parseInt(node2.value)
        );

      }

      return res.success(new Number_(random_value));

    }

    execute_lower(exec_ctx){
      const List = require('./list.js');
      const String_ = require('./string.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new String_(""));
      }


      const node1 = exec_ctx.symbol_table.symbols[0];

      if (!(node1 instanceof String_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser una cadena de texto',
              node1
          )
        )
      }

      return res.success(new String_((node1.value).toLowerCase()));



    }

    execute_upper(exec_ctx){
      const List = require('./list.js');
      const String_ = require('./string.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new String_(""));
      }


      const node1 = exec_ctx.symbol_table.symbols[0];

      if (!(node1 instanceof String_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser una cadena de texto',
              node1
          )
        )
      }

      return res.success(new String_((node1.value).toUpperCase()));



    }

    execute_substring(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();


      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new String_(""));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];


      if(args_len > 3 ){
        return failed_params_count(3 ,args_len,node1);
      }


      if (!(node1 instanceof String_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El primer argumento debe ser una cadena de texto',
              node1
          )
        )
      }


    var node_error = false;
    var node2_value = 0;
    var node3_value = (node1.value).length;

    if (args_len >= 2) {
      var node2 = exec_ctx.symbol_table.symbols[1];

      if (!(node2 instanceof Number_)) {
        node_error = true;
      }

      var node2_value = node2.value;

    }

    if(args_len == 3){
      var node3 = exec_ctx.symbol_table.symbols[2];
      if (!(node3 instanceof Number_)) {
        node_error = true;
      }
      var node3_value = node3.value;
    }

    if (node_error){

        return res.failure(
          new e.RunTimeError(
              node2.pos_start,
              node2.pos_end,
              'El argumento debe ser un número',
              node2
          )
        )

    }



      return res.success(new String_(
        (node1.value).substring(
          node2_value,
          node3_value
        )
      ));


    }

    execute_find(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();


      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(-1));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 2 ){
        return failed_params_count(2 ,args_len,node1);
      }


      const node2 = exec_ctx.symbol_table.symbols[1];

      if (!(node1 instanceof String_) || !(node2 instanceof String_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'Ambos argumentos deben ser una cadena de texto',
              node1
          )
        )
      }

      return res.success(
        new Number_((node1.value).indexOf(node2.value))
      );

    }



    execute_to_number(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (isNaN(parseInt(node1.value))) {

        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'Argumento no válido',
              node1
          )
        )

      }else{

        return res.success(
          new Number_(parseInt(node1.value))
        );

      }

    }


    execute_to_string(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new String_(""));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!((node1 instanceof String_) || (node1 instanceof Number_))) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'Argumento no válido',
              node1
          )
        )
      }

      return res.success(
        new String_((node1.value).toString())
      );


    }

    execute_abs(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.abs(parseFloat(node1.value)))
      );

    }

    execute_ln(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.log(parseFloat(node1.value)))
      );


    }

    execute_log(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.log10(parseFloat(node1.value)))
      );


    }

    execute_sin(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.sin(
          (parseFloat(node1.value)) * Math.PI / 180.0
        ))
      );


    }


    execute_cos(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.cos(
          (parseFloat(node1.value)) * Math.PI / 180.0
        ))
      );


    }

    execute_tan(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.tan(
          (parseFloat(node1.value)) * Math.PI / 180.0
        ))
      );


    }

    execute_trunc(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.trunc(parseFloat(node1.value)))
      );


    }

    execute_round(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.round(parseFloat(node1.value)))
      );


    }

    execute_max(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      const len = Object.keys(exec_ctx.symbol_table.symbols).length;

      var response = [];
      for (var i = 0; i < len ; i++) {

        var instance = exec_ctx.symbol_table.symbols[i];

        if(instance instanceof Number_){
          response.push(parseInt(instance.value));
        }else{
          return res.failure(
            new e.RunTimeError(
                instance.pos_start,
                instance.pos_end,
                'El argumento debe ser un número',
                instance
            )
          )
        }

      }

      return res.success(
        new Number_(Math.max(...response))
      );

    }

    execute_min(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      const len = Object.keys(exec_ctx.symbol_table.symbols).length;

      var response = [];
      for (var i = 0; i < len ; i++) {

        var instance = exec_ctx.symbol_table.symbols[i];

        if(instance instanceof Number_){
          response.push(parseInt(instance.value));
        }else{
          return res.failure(
            new e.RunTimeError(
                instance.pos_start,
                instance.pos_end,
                'El argumento debe ser un número',
                instance
            )
          )
        }

      }

      return res.success(
        new Number_(Math.min(...response))
      );

    }

    execute_floor(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }

      return res.success(
        new Number_(Math.floor(
          (parseFloat(node1.value))
        ))
      );


    }

    execute_ceil(exec_ctx){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');
      const e = require('./error.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len == 0) {
        return res.success(new Number_(0));
      }

      const node1 = exec_ctx.symbol_table.symbols[0];

      if(args_len != 1 ){
        return failed_params_count(1 ,args_len,node1);
      }


      if (!(node1 instanceof Number_)) {
        return res.failure(
          new e.RunTimeError(
              node1.pos_start,
              node1.pos_end,
              'El argumento debe ser un número',
              node1
          )
        )
      }



      return res.success(
        new Number_(Math.ceil(
          (parseFloat(node1.value))
        ))
      );


    }

    execute_date(exec_ctx){

      const Number_ = require('./number.js');
      const res = new Runtime();

      const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;

      if (args_len != 0) {
        const node1 = exec_ctx.symbol_table.symbols[0];
        return failed_params_count(0 ,args_len,node1);
      }

      var d = new Date();

      return res.success(new List(
        [
          new Number_(d.getFullYear()),
          new Number_(d.getMonth() + 1),
          new Number_(d.getDate())
        ]
      ));


    }


}

module.exports = BuiltIn;
