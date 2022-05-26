const Tokenization = require('./tokenization.js');
const Context = require('./context.js');
const Parser = require('./parser.js');
const Interpreter = require('./interpreter.js');
const Symbol_ = require('./symbol.js');
const BuiltIn = require('./builtin.js');
const Number_ = require('./number.js');


var symbol_table = new Symbol_();


function create_default_symbol_table(){

  const Boolean_ = require('./boolean.js');

  symbol_table.set('nulo', Boolean_.null);
  symbol_table.set('verdadero', Boolean_.true);
  symbol_table.set('falso', Boolean_.false);
  symbol_table.set('pi', new Number_(Math.PI));
  symbol_table.set('mostrar', new BuiltIn('print'));
  symbol_table.set('alertar', new BuiltIn('print2'));
  symbol_table.set('longitud', new BuiltIn('length'));
  symbol_table.set('raiz', new BuiltIn('square'));
  symbol_table.set('ingresar', new BuiltIn('input'));

  symbol_table.set('esnumero', new BuiltIn('is_number'));
  symbol_table.set('estexto', new BuiltIn('is_string'));
  symbol_table.set('eslista', new BuiltIn('is_list'));
  symbol_table.set('agregar', new BuiltIn('push_back'));
  symbol_table.set('remover', new BuiltIn('pop'));
  symbol_table.set('unir', new BuiltIn('concat'));
  symbol_table.set('insertar', new BuiltIn('insert'));
  symbol_table.set('reemplazar', new BuiltIn('replace'));
  symbol_table.set('azar', new BuiltIn('random'));
  symbol_table.set('minus', new BuiltIn('lower'));
  symbol_table.set('mayus', new BuiltIn('upper'));
  symbol_table.set('subtexto', new BuiltIn('substring'));
  symbol_table.set('buscar', new BuiltIn('find'));
  symbol_table.set('numero', new BuiltIn('to_number'));
  symbol_table.set('texto', new BuiltIn('to_string'));
  symbol_table.set('abs', new BuiltIn('abs'));
  symbol_table.set('ln', new BuiltIn('ln'));
  symbol_table.set('log', new BuiltIn('log'));
  symbol_table.set('sen', new BuiltIn('sin'));
  symbol_table.set('cos', new BuiltIn('cos'));
  symbol_table.set('tan', new BuiltIn('tan'));
  symbol_table.set('trunc', new BuiltIn('trunc'));
  symbol_table.set('redondear', new BuiltIn('round'));
  symbol_table.set('max', new BuiltIn('max'));
  symbol_table.set('min', new BuiltIn('min'));
  symbol_table.set('piso', new BuiltIn('floor'));
  symbol_table.set('techo', new BuiltIn('ceil'));
  symbol_table.set('fecha', new BuiltIn('date'));

}
create_default_symbol_table();



//console.log("test:", new BuiltIn('print'))

function empty(tokens){
    for (var i = 0; i < tokens.length; i++) {
        if(tokens[i] != "NEWLINE" && tokens[i] != "EOF"){
            return false;
        }
    }
    return true;
}

function run(fn, txt){



    const context = new Context('<web>');
    context.symbol_table = symbol_table;

    const t = new Tokenization(fn, txt, context).create_tokens();

    //console.log("t:",t);





    if (t.error != null) {

        //return {
        //    'error':t.error.as_string(),
        //}
        var div = document.createElement("div");
        div.className = 'executePrint';

        div.innerHTML = `
          <div class='resrow'  style="color: #d3d4d3;">${t.error.as_string()}</div>
        `;

        document.getElementById("response").appendChild(div);

        return true;

    }


    if (t.tokens.length == 1 && t.tokens[0].type == "EOF") {
      // empty
      return true;
    }



    var parser = new Parser(t.tokens, context);
    var ast = parser.parse();

    if (ast.error) {
        //return {
        //'error':ast.error
        //}
        var div = document.createElement("div");
        div.className = 'executePrint';

        div.innerHTML = `
          <div class='resrow'  style="color: #d3d4d3;">${ast.error.as_string()}</div>
        `;

        document.getElementById("response").appendChild(div);

        return true;
    }


    //console.log("node:", ast.node);

    //symbol_table.reset();
    symbol_table = new Symbol_();
    create_default_symbol_table();

    context.symbol_table = symbol_table;


    var inter = new Interpreter();
    try{
        var res = inter.run(ast.node, context);
    }catch(err){



        var div = document.createElement("div");
        div.className = 'executePrint';

        div.innerHTML = `
          <div class='resrow'  style="color: #ef6161;">
            Error de sintaxis
          </div>
        `;

        document.getElementById("response").appendChild(div);

        return true;

    }

    //console.log("res:", res);


    if (res) {

        if (res.error != null && res.error != "empty") {
            //document.getElementById("response").innerHTML = r.error.as_string();

            var div = document.createElement("div");
            div.className = 'executePrint error';

            div.innerHTML = `
              <div class='resrow'  style="color: #d3d4d3;">${res.error.as_string()}</div>
            `;

            document.getElementById("response").appendChild(div);
        }

    }

    // finish
    return true;
}

//async function Precodigo(fn, txt){
//  var r = run(fn, txt);
//}
/*
function Precodigo(fn, txt){

  var r = run(fn, txt);

}
*/


/*

function torun(){

    var v = document.getElementById("torun").value;

    var r = run("web", v);

    //console.log("r:",r);

    //console.log("res: ", r)


    if (r) {

        if (r.error != null && r.error != "empty") {

            document.getElementById("results").innerHTML = r.error.as_string();
        }

        else{

            document.getElementById("results").innerHTML = r.value.elements[0].value;



        }
    }
}

document.getElementById("buttonrun").addEventListener("click", torun);
*/


exports.run = run;
