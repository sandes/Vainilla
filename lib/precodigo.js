/*Precodigo lang js*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.precodigo = {}));
}(this, (function (exports) { 'use strict';

    var precodigo = {};

    class Identifiers$3{
        constructor(){
            this.TK_INT = 'INT';
            this.TK_FLOAT = 'FLOAT';
            this.TK_BOOLEAN = 'BOOLEAN';
            this.TK_STRING = 'STRING';
            this.TK_PLUS = 'PLUS';
            this.TK_MINUS = 'MINUS';
            this.TK_MUL = 'MUL';
            this.TK_DIV = 'DIV';
            this.TK_DIV_INTEGER = 'DIVINT';
            this.TK_MOD = 'MOD';
            this.TK_POW = 'POW';
            this.TK_LPAREN = 'LPAREN';
            this.TK_RPAREN = 'RPAREN';
            this.TK_LSQBRA = 'LSQBRA';
            this.TK_RSQBRA = 'RSQBRA';
            this.TK_IDENTIFIER = 'IDENTIFIER';
            this.TK_IDENTIFIER_DEFINED = 'IDENTIFIER_DEFINED';
            this.TK_EQUALS = 'EQUALS';
            this.TK_KEYWORD = 'KEYWORD';
            this.TK_IS_EQ = 'IS_EQUAL';
            this.TK_IS_NEQ = 'IS_NOT_EQUAL';
            this.TK_IS_LT = 'IS_LT';
            this.TK_IS_GT = 'IS_GT';
            this.TK_IS_LTE = 'IS_LTE';
            this.TK_IS_GTE = 'IS_GTE';
            this.TK_COMMA = 'COMMA';
            this.TK_ARROW = 'ARROW';
            this.TK_NEWLINE = 'NEWLINE';
            this.TK_EOF = 'EOF';
        }

        reserved(){
            return [
                'nulo',
                'verdadero',
                'falso',
                'pi',
                "y",
                "o",
                "no",
                'si',
                'sino',
                'entonces',
                'para',
                'hasta',
                'con',
                'paso',
                'hacer',
                'mientras',
                'funcion',
                'retornar',
                'continuar',
                'detener',
                'finfuncion',
                'finpara',
                'finmientras',
                'finsi',
                "mostrar",
                "alertar",
                "ingresar",
                "numero",
                "texto",
                "minus",
                "mayus",
                "raiz",
                "unir",
                "max",
                "min",
                "abs",
                "ln",
                "log",
                "sen",
                "cos",
                "tan",
                "esnumero",
                "estexto",
                "eslista",
                "agregar",
                "remover",
                "extender",
                "insertar",
                "reemplazar",
                "longitud",
                "azar",
                "subtexto",
                "buscar",
                "trunc",
                "redondear",
                "piso",
                "techo",
                "fecha"

            ];
        }

        nums(){
            return '0123456789.';
        }
        letters(){
            var en = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var es = 'ñáéíóúÑÁÉÍÓÚ';
            var pt = 'áâãàçéêèíìóôõòúù';
            var fr = 'îôûçëïü';
            return en+es+pt+fr;
        }

        spanish_keywords(){
            return [
                'definir', 'si', 'y', 'o', 'no',
                'sino', 'entonces', 'para', 'hasta',
                'con', 'paso', 'hacer', 'mientras',
                'función', 'funcion', 'retornar',
                'continuar', 'detener', 'finfuncion',
                'finfunción', 'finpara', 'finmientras','finsi',
            ];
        }

    }




    var identifiers = Identifiers$3;

    class Token$1{
        constructor(type, value=null, pos_start=null, pos_end=null){
            this.type = type;
            this.value = value;

            if (pos_start){
                this.pos_start = pos_start.get();
                this.pos_end = pos_start.get();
                this.pos_end.next();
            }
            if (pos_end) {
                this.pos_end = pos_end;
            }
        }
        matches(type, value){
            return this.type == type && this.value == value;
        }
        as_string(){
            if (this.value) {
                return `${this.type}:${this.value}`;
            }else {
                return `${this.type}`;
            }
        }
    }

    var token = Token$1;

    class Tracer$1{

        constructor(txt, pos_start, pos_end){
            this.txt = txt;
            this.pos_start = pos_start;
            this.pos_end = pos_end;
        }

        tracer_error(){

            var result = '';

            var idx_start = Math.max( this.txt.lastIndexOf('\n', this.pos_start.idx  ) ,0);
            var idx_end = this.txt.indexOf('\n', idx_start + 1);

            if (idx_end < 0){
                idx_end = this.txt.length;
            }

            var line_count = this.pos_end.ln - this.pos_start.ln + 1;

            for (var i = 0; i < line_count; i++) {

                var line = this.txt.substring(idx_start, idx_end);

                if (i == 0)
                    var col_start = this.pos_start.col;
                else
                    var col_start = 0;

                if (i == line_count - 1)
                    var col_end = this.pos_end.col;
                else
                    var col_end = line.length - 1;

                result = result + line + '<br>' +'\n' ;



                if ((col_end - col_start)>0) {
                    result = result + ' '.repeat(col_start) + '^'.repeat(col_end - col_start);
                }

                idx_start = idx_end;
                idx_end = this.txt.indexOf('\n', idx_start + 1);
                if (idx_end < 0)
                    idx_end = this.txt.length;
            }

            return result.replace('\t','');

        }
    }

    var tracer = Tracer$1;

    const Tracer = tracer;


    class Error_{
        constructor(pos_start, pos_end, error_name, details){
            this.pos_start = pos_start;
            this.pos_end = pos_end;
            this.error_name = error_name;
            this.details = details;
        }

        as_string(){

            var end =this.pos_end;
            end.idx = this.pos_start.idx;
            end.ln = this.pos_start.ln + 0;
            end.col = this.pos_start.col + 4;


            var result =`${this.error_name} : <strong>${this.details} <\/strong><br>`;
            result += `Archivo ${this.pos_start.fn}: linea ${this.pos_start.ln + 1}`;

            const t = new Tracer(this.pos_start.ftxt, this.pos_start, end);
            result += `<br><br> ${t.tracer_error()}`;

            return result;
        }
    }

    class IllegalCharError extends Error_{
        constructor(pos_start, pos_end, details){
            super(
              pos_start,
              pos_end,
              'Caracter no válido',
              "<span style='color: #ef6161;'>"+details+"</span>"
            );
        }
    }

    class RunTimeError extends Error_{
        constructor(pos_start, pos_end, details, context){
            super(
              pos_start,
              pos_end,
              'Error en tiempo de ejecución',
              "<span style='color: #ef6161;'>"+details+"</span>"
            );
            this.context = context;
        }
        as_string(){
            var result = this.generate_traceback();
            result = result + `${this.error_name} : <strong>${this.details}<\/strong>`;

            var end = this.pos_end;
            end.idx = this.pos_start.idx;
            end.ln = this.pos_start.ln;
            end.col = this.pos_start.col + 4;

            const t = new Tracer(this.pos_start.ftxt, this.pos_start, end);
            result += `<br><br> <div style='color: #ef6161;'>${t.tracer_error()}<\/div>`;


            return result;


        }
        generate_traceback(){
            var result = '';
            var pos = this.pos_start;
            var ctx = this.context;

            while (ctx){

                result = `Archivo ${pos.fn}: <strong> linea ${pos.ln + 1} <\/strong>, ${ctx.display_name}<br>` + result;

                pos = ctx.parent_entry_pos;
                ctx = ctx.parent;
            }

            return 'Secuencia del error:<br>' + result;
        }

    }

    class InvalidSyntaxError extends Error_{
        constructor(pos_start, pos_end, details){

            super(
              pos_start,
              pos_end,
              'Error de sintaxis',
              "<span style='color: #ef6161;'>"+details+"</span>"
            );
        }

    }

    var error = {
        Error_: Error_,
        IllegalCharError: IllegalCharError,
        RunTimeError: RunTimeError,
        InvalidSyntaxError: InvalidSyntaxError,
    };

    class Position$1{
        constructor(idx, ln, col, fn, ftxt){
            this.idx = idx;
            this.ln = ln;
            this.col = col;
            this.fn = fn;
            this.ftxt = ftxt;
        }
        next(current=null){
            this.idx++;
            this.col++;

            if (current == "\n"){
                this.ln++;
                this.col = 0;
            }
            return this;
        }
        get(){
            return new Position$1(
                this.idx,
                this.ln,
                this.col,
                this.fn,
                this.ftxt
            );
        }

    }

    var position = Position$1;

    const e$5 = error;

    class Value$3{

        constructor(){
            this.set_position();
            this.set_context();
        }
        set_position(pos_start=null, pos_end=null){
            this.pos_start = pos_start;
            this.pos_end = pos_end;
            return this;
        }
        set_context(context=null){
            this.context = context;
            return this;
        }
        add(other){

            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        minus(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        div(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        retrieve(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }    
        mul(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        mod(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        pow(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        get_comparation_equals(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }
        }
        get_comparation_not_equals(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        get_comparation_gt(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        get_comparation_lt(other){

            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }
        }
        get_comparation_gte(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        get_comparation_lte(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        and_by(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        or_by(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        notted(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        is_true(other){
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }        
        }
        execute(args){
            return {
                'n':null,
                'error':this.illegal_operaction()
            }        
        }
        illegal_operaction(other=null){
            if(!other){
                other = this;
            }
            return new e$5.RunTimeError(
                this.pos_start,
                other.pos_end,
                'Operación no permitida',
                this.context
            );
        }
        out_of_range(other = null) {
            if (!other) {
                other = this;
            }
            return new e$5.RunTimeError(
                this.pos_start,
                other.pos_end,
                'El indice está fuera de rango',
                this.context
            );
        }
    }
    var value = Value$3;

    const Value$2 = value;

    class String_$1 extends Value$2{

        constructor(value){
            super();
            this.value = value;
        }
        as_string(){
            return this.value;
        }
        add(other){
            if(
                (other instanceof String_$1)

            ){
                var s = new String_$1(this.value + (other.value).toString());
                s.set_context(this.context);
                //return [s, null];
                return {
                    'n':s,
                    'error':null
                }
            }
            else {
                return {
                    'n':null,
                    'error':this.illegal_operaction(other)
                }
            }
        }


        get_comparation_equals(other){

          const Number_ = number;
          const Boolean_ = boolean;

          if (
            !((other instanceof Number_)
            ||
            (other instanceof String_$1)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }


            // remainder value
            var n = new Boolean_((this.value == other.value)? 1 : 0);
            n.set_context(this.context);

            return {'n':n, 'error':null}


        }

        get_comparation_not_equals(other){

          const Number_ = number;
          const Boolean_ = boolean;

          if (
            !((other instanceof Number_)
            ||
            (other instanceof String_$1)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }


              // remainder value
              var n = new Boolean_((this.value != other.value)? 1 : 0);
              n.set_context(this.context);

              return {'n':n, 'error':null}


        }

        and_by(other){

          const Number_ = number;
          const Boolean_ = boolean;

          if (
            !((other instanceof Number_)
            ||
            (other instanceof String_$1)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }



          // remainder value
          var n = new Boolean_((this.value && other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}



        }

        or_by(other){


          const Number_ = number;
          const Boolean_ = boolean;

          if (
            !((other instanceof Number_)
            ||
            (other instanceof String_$1)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }


          // remainder value
          var n = new Boolean_((this.value || other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}


        }

        notted(){
            const Boolean_ = boolean;

            var n = new Boolean_((this.value == 0)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }

        get(){

            var s = new String_$1(this.value);
            s.set_position(this.pos_start, this.pos_end);
            s.set_context(this.context);
            return s;
        }
        is_true(){

            return this.value != '';
        }
    }

    var string = String_$1;

    const Value$1 = value;
    const e$4 = error;

    class Number_$3 extends Value$1{
        constructor(value){
            super();
            this.value = value;
        }

        as_string(){
            return this.value;
        }
        add(other){
            if (other instanceof Number_$3){
                var n = new Number_$3(this.value + other.value);
                n.set_context(this.context);
                return {'n':n, 'error':null}
            }
            else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        minus(other){
            if(other instanceof Number_$3){
                var n = new Number_$3(this.value - other.value);
                n.set_context(this.context);
                return {'n':n, 'error':null}
            }
            else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        mul(other){

            if(other instanceof Number_$3){

                var n = new Number_$3(this.value * other.value);
                n.set_context(this.context);
                return {'n':n, 'error':null}
            }
            else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        div(other){

            if(other instanceof Number_$3){

                if (other.value == 0) {
                    return {
                        'n':null,
                        'error': new e$4.RunTimeError(
                            other.pos_start,
                            other.pos_end,
                            'División por cero',
                            this.context
                        ),
                    }
                }

                var n = new Number_$3(this.value / other.value);
                n.set_context(this.context);
                return {'n':n, 'error':null}
            }
            else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        mod(other){

            if(other instanceof Number_$3){

                if (other.value == 0) {
                    //console.log("RUN CERO")
                    return {
                        'n':null,
                        'error': new e$4.RunTimeError(
                            other.pos_start,
                            other.pos_end,
                            'División por cero',
                            this.context
                        ),
                    }
                }

                // remainder value
                var n = new Number_$3(this.value % other.value);
                n.set_context(this.context);
                return {'n':n, 'error':null}

            }else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }

        }
        pow(other){

            if(other instanceof Number_$3){


                // remainder value
                var n = new Number_$3(this.value ** other.value);
                n.set_context(this.context);
                return {'n':n, 'error':null}

            }else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }

        }

        get_comparation_equals(other){

          const String_ = string;
          const Boolean_ = boolean;

          if (
            !((other instanceof String_)
            ||
            (other instanceof Number_$3)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }



            // remainder value
            var n = new Boolean_((this.value == other.value)? 1 : 0);
            n.set_context(this.context);

            return {'n':n, 'error':null}


        }
        get_comparation_not_equals(other){

          const String_ = string;
          const Boolean_ = boolean;

          if (
            !((other instanceof String_)
            ||
            (other instanceof Number_$3)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }


          // remainder value
          var n = new Boolean_((this.value != other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}


        }
        get_comparation_lt(other){

            if(other instanceof Number_$3){

                const Boolean_ = boolean;
                // remainder value
                var n = new Boolean_((this.value < other.value)? 1 : 0);
                n.set_context(this.context);
                return {'n':n, 'error':null}
            }else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        get_comparation_gt(other){

            if(other instanceof Number_$3){

                const Boolean_ = boolean;

                // remainder value
                var n = new Boolean_((this.value > other.value)? 1 : 0);
                n.set_context(this.context);
                return {'n':n, 'error':null}

            }else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        get_comparation_lte(other){

            if(other instanceof Number_$3){

                const Boolean_ = boolean;

                // remainder value
                var n = new Boolean_((this.value <= other.value)? 1 : 0);
                n.set_context(this.context);
                return {'n':n, 'error':null}

            }else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        get_comparation_gte(other){

            if(other instanceof Number_$3){

                const Boolean_ = boolean;
                // remainder value
                var n = new Boolean_((this.value >= other.value)? 1 : 0);
                n.set_context(this.context);
                return {'n':n, 'error':null}

            }else {
                return {'n':null,'error': this.illegal_operaction(other)}
            }
        }
        and_by(other){

          const String_ = string;
          const Boolean_ = boolean;

          if (
            !((other instanceof String_)
            ||
            (other instanceof Number_$3)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }

          // remainder value
          var n = new Boolean_((this.value && other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}


        }
        or_by(other){

          const String_ = string;
          const Boolean_ = boolean;

          if (
            !((other instanceof String_)
            ||
            (other instanceof Number_$3)
            ||
            (other instanceof Boolean_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }

          // remainder value
          var n = new Boolean_((this.value || other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}


        }
        is_true(){
            return this.value != 0;
        }

        notted(){
            const Boolean_ = boolean;

            var n = new Boolean_((this.value == 0)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }
        get(){
            var copy = new Number_$3(this.value);
            copy.set_position(this.pos_start, this.pos_end);
            copy.set_context(this.context);
            return copy;
        }
    }

    Number_$3.null = new Number_$3(0);
    Number_$3.math_pi = new Number_$3(Math.PI);

    var number = Number_$3;

    const Number_$2 = number;

    class Boolean_$1 extends Number_$2{

        constructor(value=null){
            super(value);
            this.value = value;
        }

        as_string(){

            if(this.value == 0){
                return 'falso';
            }
            else {
                return 'verdadero';
            }
        }
        get(){
            const b = new Boolean_$1(this.value);
            b.set_position(this.pos_start, this.pos_end);
            b.set_context(this.context);
            return b;
        }

        get_comparation_equals(other){

          const String_ = string;
          const Number_ = number;

          if (
            !((other instanceof String_)
            ||
            (other instanceof Boolean_$1)
            ||             
            (other instanceof Number_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }


            // remainder value
            var n = new Boolean_$1((this.value == other.value)? 1 : 0);
            n.set_context(this.context);

            return {'n':n, 'error':null}


        }

        get_comparation_not_equals(other){

          const String_ = string;
          const Number_ = number;

          if (
            !((other instanceof String_)
            ||
            (other instanceof Boolean_$1)
            ||
            (other instanceof Number_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }


              // remainder value
              var n = new Boolean_$1((this.value != other.value)? 1 : 0);
              n.set_context(this.context);

              return {'n':n, 'error':null}


        }

        and_by(other){

          const Number_ = number;
          const String_ = string;

          if (
            !((other instanceof Number_)
            ||
            (other instanceof String_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }

          // remainder value
          var n = new Boolean_$1((this.value && other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}

        }

        or_by(other){

          const Number_ = number;
          const String_ = string;

          if (
            !((other instanceof Number_)
            ||
            (other instanceof String_))
          ) {
            return {'n':null,'error': this.illegal_operaction(other)}
          }

          // remainder value
          var n = new Boolean_$1((this.value || other.value)? 1 : 0);
          n.set_context(this.context);
          return {'n':n, 'error':null}

        }

        notted(){


            var n = new Boolean_$1((this.value == 0)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }

        is_true(){

            return this.value != 0;
        }






    }

    Boolean_$1.null = new Boolean_$1(0);
    Boolean_$1.false = new Boolean_$1(0);
    Boolean_$1.true = new Boolean_$1(1);


    var boolean = Boolean_$1;

    const Identifiers$2 = identifiers;
    const Token = token;
    const e$3 = error;
    const Position = position;
    const Boolean_ = boolean;



    const It$2 = new Identifiers$2();


    //console.log(Tk)

    class Tokenization$1 {

      constructor(fn, txt) {
        this.fn = fn;
        this.txt = txt;
        this.position = new Position(-1,0,1,fn,txt);
        this.current = null;
        this.next();
      }
      next(){

        this.position.next(this.current);

        if (this.position.idx < this.txt.length){
            this.current = this.txt[this.position.idx];
        }else {
            this.current = null;
        }
      }
      create_string(quote){

        

        var string = '';
        var pos_start = this.position;
        this.next();

        while(this.current != null
              && this.current != quote){

            string = string + this.current;
            this.next();
        }

        this.next();

        return new Token(It$2.TK_STRING, string, pos_start, this.position);
      }
      create_equals(){
        var id_type = It$2.TK_EQUALS;
        var pos_start = this.position.get();

        this.next();

        if (this.current == '=') {
            this.next();
            id_type = It$2.TK_IS_EQ;
        }
        return new Token(id_type, null, pos_start, this.position);

      }
      create_not_equals(){

        var pos_start = this.position.get();
        this.next();

        if (this.current != '=') {
            this.next();

            return {
                't':null,
                'e': new e$3.IllegalCharError(
                        pos_start,
                        this.position,
                        "Tal vez quiso decir '!='"
                    ),
            }
        }
        this.next();

        return {
            't':new Token(It$2.TK_IS_NEQ, null, pos_start, this.position),
            'e':null,
        }
      }
      create_greater_than(){

        var id_type = It$2.TK_IS_GT;
        var pos_start = this.position.get();

        this.next();

        if (this.current == '=') {
            this.next();
            id_type = It$2.TK_IS_GTE;
        }

        return new Token(
            id_type,
            null,
            pos_start,
            this.position
        )
      }
      create_less_than(){

        var id_type = It$2.TK_IS_LT;
        var pos_start = this.position.get();

        this.next();

        if (this.current == '=') {
            this.next();
            id_type = It$2.TK_IS_LTE;
        }
        return new Token(
            id_type,
            null,
            pos_start,
            this.position
        )
      }
      create_keyword(){
        var id_str = '';
        var id_type = It$2.TK_IDENTIFIER;
        var pos_start = this.position;

        while(this.current != null
              &&  (It$2.nums()+It$2.letters()+'_').indexOf(this.current) != -1){

            id_str = id_str + this.current;
            this.next();
        }

        if (It$2.spanish_keywords().indexOf(id_str) != -1) {
            id_type = It$2.TK_KEYWORD;
        }

        else if ([
            Boolean_.true.as_string(),
            Boolean_.false.as_string()].indexOf(id_str) != -1) {

            id_type = It$2.TK_BOOLEAN;
        }
        else if(id_str.toLowerCase() == 'mod'){
            id_type = It$2.TK_MOD;
        }


        return {
            't':new Token(id_type,id_str,pos_start,this.position),
            'error':null,
        }
      }
      create_minus_or_arrow(){

        var id_type = It$2.TK_MINUS;
        var pos_start = this.position.get();

        this.next();

        if (this.current == '>') {
            this.next();
            id_type = It$2.TK_ARROW;
        }
        return {
            't':new Token(id_type,null,pos_start,this.position),
            'error':null,
        }

      }
      create_comment(){

        this.position.get();
        this.next();

        while (this.current != '\n'){
          this.next();
        }

        return true;
      }

      create_number(){

        var tmp = '';
        var has_dot = false;
        var pos_start = this.position.get();

        while (this.current != null
               && It$2.nums().indexOf(this.current) != -1 ){

            if (this.current == '.') {

                if (has_dot)
                    break

                has_dot = true;
                tmp = tmp + '.';
            }
            else {
                tmp = tmp + this.current;
            }
            this.next();
        }
        if(has_dot){
            return new Token(It$2.TK_FLOAT, parseFloat(tmp), pos_start, this.position);
        }else {
            return new Token(It$2.TK_INT, parseInt(tmp), pos_start, this.position);
        }

      }
      create_tokens(){

        var tokens = [];


        while (this.current != null){

            if ( ' \t'.indexOf(this.current) != -1 ) {
                this.next();
            }

            else if([';','\n'].indexOf(this.current) != -1){


                tokens.push(new Token(
                    It$2.TK_NEWLINE,
                    null,
                    this.position,
                ));
                this.next();

            }
            else if(It$2.nums().indexOf(this.current) != -1){

                tokens.push(this.create_number());
            }
            else if(It$2.letters().indexOf(this.current) != -1){

                var a = this.create_keyword();
                if (a.error) {
                    return {
                        'tokens':null,
                        'error':a.error
                    }
                }

                tokens.push(a.t);
            }
            else if(['\'','"'].indexOf(this.current) != -1){

                var a = this.create_string(this.current);
                tokens.push(a);

            }
            else if(this.current == '#'){

                this.create_comment();

            }
            else if(this.current == '+'){
                tokens.push(new Token(
                    It$2.TK_PLUS,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == '-'){
                var a = this.create_minus_or_arrow();
                if (a.t == null) {
                    return {'tokens':null, 'error':a.e}
                }
                tokens.push(a.t);
            }
            else if(this.current == '*'){
                tokens.push(new Token(
                    It$2.TK_MUL,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == '/'){
                tokens.push(new Token(
                    It$2.TK_DIV,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == '('){
                tokens.push(new Token(
                    It$2.TK_LPAREN,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == ')'){
                tokens.push(new Token(
                    It$2.TK_RPAREN,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == '['){
                tokens.push(new Token(
                    It$2.TK_LSQBRA,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == ']'){
                tokens.push(new Token(
                    It$2.TK_RSQBRA,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == '^'){
                tokens.push(new Token(
                    It$2.TK_POW,
                    null,
                    this.position,
                ));
                this.next();
            }
            else if(this.current == '='){
                var a = this.create_equals();
                tokens.push(a);
            }
            else if(this.current == '!'){

                var a = this.create_not_equals();

                if (a.t == null) {
                    return {
                        'tokens':null,
                        'error':a.e
                    }
                }
                tokens.push(a.t);
            }
            else if(this.current == '<'){
                var a = this.create_less_than();
                tokens.push(a);
            }
            else if(this.current == '>'){
                var a = this.create_greater_than();
                tokens.push(a);
            }
            else if(this.current == ','){
                tokens.push(new Token(
                    It$2.TK_COMMA,
                    null,
                    this.position,
                ));
                this.next();
            }
            else {

                var pos_start = this.position.get();
                var char = this.current;
                this.next();
                return {
                    'tokens':null,
                    'error':new e$3.IllegalCharError(pos_start,this.position,`'${char}'`)
                }
            }
        }


        tokens.push(new Token(It$2.TK_EOF, null, this.position));



        return {
            'tokens':tokens,
            'error':null
        };
      }
    }

    var tokenization = Tokenization$1;

    class Context$2{
        constructor(display_name, parent=null, parent_entry_pos=null){
            this.display_name = display_name;
            this.parent = parent;
            this.parent_entry_pos = parent_entry_pos;
            this.symbol_table = null;
        }
    }

    var context = Context$2;

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
            }else {
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
            }else {
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


    var nodes$1 = {
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


    };

    class Result$1{
        constructor(){
            this.error = null;
            this.node = null;
            this.next_count = 0;
            this.last_registered_next_count = 0;
            this.to_reverse_count = 0;
        }

        register_next(){
            this.last_registered_next_count = 1;
            this.next_count++;
        }
        register(res){

            if (res instanceof Result$1) {

                this.last_registered_next_count = res.next_count;
                this.next_count = this.next_count + res.next_count;

                if (res.error){
                    this.error = res.error;
                }

                return res.node;

            }
            return res;

            
        }
        try_register(res){
            if(res.error){
                
                this.to_reverse_count = res.next_count;
                return null;
            }
            return this.register(res);
        }

        success(node){
            this.node = node;
            return this;
        }
        failure(error){
            if(! this.error || this.last_registered_next_count == 0){
                this.error = error;
            }

            return this;
        }
    }

    var result = Result$1;

    const Identifiers$1 = identifiers;
    const nodes = nodes$1;
    const Result = result;
    const e$2 = error;
    const It$1 = new Identifiers$1();

    // parser

    class Parser$1{
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

              var tmp_token = this.tokens[this.token_idx - plus];
              return tmp_token;

          }
          else {
              return null;
          }
        }

        tmp_next_token(plus=1){
            if (this.token_idx + plus < this.tokens.length) {

                var tmp_token = this.tokens[this.token_idx + plus];
                return tmp_token;

            }
            else {
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




            if (this.current_token.type != It$1.TK_LSQBRA) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba '['",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            if (this.current_token.type == It$1.TK_RSQBRA) {
                res.register_next();
                this.next();
            }
            else {
                elements_nodes.push(res.register(this.expr()));
                if (res.error) {
                    return res;
                }

                while(this.current_token.type == It$1.TK_COMMA){
                    res.register_next();
                    this.next();

                    elements_nodes.push(res.register(this.expr()));
                    if (res.error) {
                        return res;
                    }
                }

                if (this.current_token.type != It$1.TK_RSQBRA) {
                    return res.failure(new e$2.InvalidSyntaxError(
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

            if (!this.current_token.matches(It$1.TK_KEYWORD, 'mientras')) {
                return res.failure(new e$2.InvalidSyntaxError(
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

            if (!this.current_token.matches(It$1.TK_KEYWORD, 'hacer')) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'hacer'",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            if (this.current_token.type == It$1.TK_NEWLINE) {

                res.register_next();
                this.next();

                var body = res.register(this.statements());
                if (res.error) {
                    return res;
                }

                if (!this.current_token.matches(It$1.TK_KEYWORD, 'finmientras')) {
                    return res.failure(new e$2.InvalidSyntaxError(
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
            if (!this.current_token.matches(It$1.TK_KEYWORD, 'funcion')) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'funcion'",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            if ( this.current_token.type == It$1.TK_IDENTIFIER) {

                var var_name_token = this.current_token;

                if ( It$1.reserved().indexOf(var_name_token.value) != -1) {
                    return res.failure(new e$2.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        `'${var_name_token.value}' es una palabra reservada`,
                        this.context,
                    ));
                }


                res.register_next();
                this.next();

                if (this.current_token.type != It$1.TK_LPAREN) {
                    return res.failure(new e$2.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba '('",
                        this.context,
                    ));

                }
            }
            else {
                var var_name_token = null;
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba una variable o '('",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            var args_tokens = [];

            if ( this.current_token.type == It$1.TK_IDENTIFIER) {

                args_tokens.push(this.current_token);
                res.register_next();
                this.next();

                while(this.current_token.type == It$1.TK_COMMA){
                    res.register_next();
                    this.next();

                    if (this.current_token.type != It$1.TK_IDENTIFIER) {
                        return res.failure(new e$2.InvalidSyntaxError(
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



                if (this.current_token.type != It$1.TK_RPAREN) {

                    return res.failure(new e$2.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba ',' o ')'",
                        this.context,
                    ));
                }

            }
            else {


                if (this.current_token.type != It$1.TK_RPAREN) {
                    // we excepeted a function without arguments o return error

                    return res.failure(new e$2.InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Se esperaba ',' o ')'",
                        this.context,
                    ));

                }

            }

            res.register_next();
            this.next();
            if (this.current_token.type == It$1.TK_ARROW) {

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

            if (this.current_token.type != It$1.TK_NEWLINE) {

                return res.failure(new e$2.InvalidSyntaxError(
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

            if (!this.current_token.matches(It$1.TK_KEYWORD, 'finfuncion')) {
                return res.failure(new e$2.InvalidSyntaxError(
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
            if (!this.current_token.matches(It$1.TK_KEYWORD, 'para')) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'para'",
                    this.context,
                ));
            }
            res.register_next();
            this.next();

            if (
                (this.current_token.type != It$1.TK_IDENTIFIER)

            ) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba una variable",
                    this.context,
                ));
            }

            var var_name = this.current_token;
            res.register_next();
            this.next();

            if (this.current_token.type != It$1.TK_EQUALS) {
                return res.failure(new e$2.InvalidSyntaxError(
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
            if (!this.current_token.matches(It$1.TK_KEYWORD, 'hasta')) {
                return res.failure(new e$2.InvalidSyntaxError(
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

            if (this.current_token.matches(It$1.TK_KEYWORD,'con')) {

                res.register_next();
                this.next();

                if (!this.current_token.matches(It$1.TK_KEYWORD, 'paso')) {
                    return res.failure(new e$2.InvalidSyntaxError(
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

            if (!this.current_token.matches(It$1.TK_KEYWORD, 'hacer')) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba 'hacer'",
                    this.context,
                ));
            }

            res.register_next();
            this.next();

            if (this.current_token.type == It$1.TK_NEWLINE) {

                res.register_next();
                this.next();

                var body = res.register(this.statements());
                if (res.error) {
                    return res;
                }
                if (!this.current_token.matches(It$1.TK_KEYWORD, 'finpara')) {
                    return res.failure(new e$2.InvalidSyntaxError(
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

            if (this.current_token.matches(It$1.TK_KEYWORD,'sino')) {
                res.register_next();
                this.next();

                if (this.current_token.type == It$1.TK_NEWLINE) {
                    var statements = res.register(this.statements());
                    if (res.error) {
                        return res;
                    }
                    else_case = [statements, true];

                    if (this.current_token.matches(It$1.TK_KEYWORD,'finsi')) {

                        res.register_next();
                        this.next();
                    }
                    else {
                        return res.failure(new e$2.InvalidSyntaxError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "Se esperaba 'finsi'",
                            this.context,
                        ));
                    }
                }
                else {
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

            if (this.current_token.matches(It$1.TK_KEYWORD,'sino')
                &&
                this.tmp_next_token().matches(It$1.TK_KEYWORD,'si')
                ) {

                var all_cases = res.register(this.if_expr_b());
                if (res.error) {
                    return res;
                }

                cases = all_cases[0];
                else_case = all_cases[1];
            }

            else {
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

            if (!this.current_token.matches(It$1.TK_KEYWORD, case_keyword)) {

                return res.failure(new e$2.InvalidSyntaxError(
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


            if (!this.current_token.matches(It$1.TK_KEYWORD, 'entonces')) {

                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    `Se esperaba 'entonces'`,
                    this.context,
                ));

            }
            res.register_next();
            this.next();

            if (this.current_token.type == It$1.TK_NEWLINE) {

                res.register_next();
                this.next();

                var statements = res.register(this.statements());
                if (res.error) {
                    return res;
                }

                cases.push([condition,statements,true]);

                if (this.current_token.matches(It$1.TK_KEYWORD,'finsi')) {

                    res.register_next();
                    this.next();
                }
                else {
                    var all_cases = res.register(this.if_expr_b_or_c());
                    if (res.error) {
                        return res;
                    }
                    var new_cases = all_cases[0];
                    else_case = all_cases[1];

                    cases = cases.concat(new_cases);
                }
            }
            else {
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

                cases = cases.concat(new_cases);
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
            if (this.current_token.type == It$1.TK_LPAREN) {
                res.register_next();
                this.next();

                var arg_nodes = [];

                if (this.current_token.type == It$1.TK_RPAREN) {
                    res.register_next();
                    this.next();

                }else {


                    arg_nodes.push(res.register(this.expr()));
                    if (res.error) {
                        return res;
                    }

                    while(this.current_token.type == It$1.TK_COMMA){

                        res.register_next();
                        this.next();

                        arg_nodes.push(res.register(this.expr()));
                        if (res.error) {
                            return res;
                        }
                    }

                    if (this.current_token.type != It$1.TK_RPAREN) {


                        return res.failure(new e$2.InvalidSyntaxError(
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

            if( [It$1.TK_INT, It$1.TK_FLOAT].indexOf(token.type) != -1 ){

                res.register_next();
                this.next();
                return res.success(new nodes.NumberNode(token));
            }
            else if ( token.type == It$1.TK_STRING) {

                res.register_next();
                this.next();
                return res.success(new nodes.StringNode(token))
            }
            else if ([It$1.TK_IDENTIFIER, It$1.TK_BOOLEAN].indexOf(token.type) != -1) {

                res.register_next();
                this.next();


                if (this.current_token.type == It$1.TK_LSQBRA) {

                    res.register_next();
                    this.next();

                    var expr = res.register(this.expr());
                    if (res.error) {
                        return res;
                    }


                    if (this.current_token.type != It$1.TK_RSQBRA) {
                        return res.failure(new e$2.InvalidSyntaxError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "Se esperaba ']'",
                            this.context,
                        ));

                    }

                    res.register_next();
                    this.next();

                    if (this.current_token.type == It$1.TK_EQUALS) {

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
            else if (token.type == It$1.TK_LPAREN) {
                res.register(this.next());
                var expr = res.register(this.expr());
                if (res.error)
                    return res;

                if (this.current_token.type == It$1.TK_RPAREN) {
                    res.register(this.next());
                    return res.success(expr);
                }
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Se esperaba ')'",
                    this.context,
                ));
            }
            else if (token.type == It$1.TK_LSQBRA) {

                var list_expr = res.register(this.list_expr());
                if (res.error) {
                    return res;
                }
                return res.success(list_expr)
            }
            else if (token.matches(It$1.TK_KEYWORD,'si')) {

                 var if_expr = res.register(this.if_expr());
                 if (res.error) {
                    return res;
                 }
                 return res.success(if_expr);
            }
            else if (token.matches(It$1.TK_KEYWORD,'para')) {

                 var for_expr = res.register(this.for_expr());
                 if (res.error) {
                    return res;
                 }
                 return res.success(for_expr);
            }
            else if (token.matches(It$1.TK_KEYWORD,'mientras')) {

                 var while_expr = res.register(this.while_expr());
                 if (res.error) {
                    return res;
                 }
                 return res.success(while_expr);
            }
            else if (token.matches(It$1.TK_KEYWORD,'funcion')) {

                 var func_expr = res.register(this.func_expr());
                 if (res.error) {
                    return res;
                 }

                 return res.success(func_expr);
            }


            return res.failure(new e$2.InvalidSyntaxError(
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

            while([It$1.TK_POW].indexOf(this.current_token.type) != -1){

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
            if( [It$1.TK_PLUS, It$1.TK_MINUS].indexOf(token.type) != -1  ){





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
                    It$1.TK_MUL,
                    It$1.TK_DIV,
                    It$1.TK_MOD,
                    It$1.TK_ARROW,
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

            if (this.current_token.type == It$1.TK_IDENTIFIER) {

                if(this.tmp_next_token(1).type == It$1.TK_EQUALS){


                    var var_name = this.current_token;

                    if ( It$1.reserved().indexOf(var_name.value) != -1) {
                        return res.failure(new e$2.InvalidSyntaxError(
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
                    (this.current_token.type == It$1.TK_KEYWORD)
                    &&
                    (this.current_token.value == "y")
                )
                ||
                (
                    (this.current_token.type == It$1.TK_KEYWORD)
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
            while([It$1.TK_PLUS, It$1.TK_MINUS].indexOf(this.current_token.type) != -1){

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
            if (this.current_token.matches(It$1.TK_KEYWORD, 'no')) {
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
                It$1.TK_IS_EQ,
                It$1.TK_IS_NEQ,
                It$1.TK_IS_LT,
                It$1.TK_IS_GT,
                It$1.TK_IS_LTE,
                It$1.TK_IS_GTE,
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

            if (this.current_token.matches(It$1.TK_KEYWORD, 'retornar')) {
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
            if (this.current_token.matches(It$1.TK_KEYWORD, 'continuar')) {
                res.register_next();
                this.next();

                return res.success(new nodes.ContinueNode(
                    pos_start,
                    this.current_token.pos_start.get()
                ))
            }
            if (this.current_token.matches(It$1.TK_KEYWORD, 'detener')) {
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

            while(this.current_token.type == It$1.TK_NEWLINE){
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

                while  (this.current_token.type == It$1.TK_NEWLINE){
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
                (this.current_token.type != It$1.TK_EOF)
            ) {
                return res.failure(new e$2.InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "sintaxis inválida",
                    this.context,
                ));

            }

            return res;
        }

    }

    var parser = Parser$1;

    class Runtime$4{
        constructor(){
            this.reset();
        }

        reset(){
            this.error = null;
            this.value = null;
            this.func_return_value = null;
            this.loop_should_continue = false;
            this.loop_should_break = false;
        }
        register(res){

            this.error = res.error;
            this.func_return_value = res.func_return_value;
            this.loop_should_break = res.loop_should_break;
            this.loop_should_continue = res.loop_should_continue;

            return res.value;
        }
        success(value){
            this.reset();
            this.value = value;
            return this;
        }
        success_return(value){
            this.reset();
            this.func_return_value = value;
            return this;
        }
        success_continue(){
            this.reset();
            this.loop_should_continue = true;
            return this;
        }
        success_break(){
            this.reset();
            this.loop_should_break = true;
            return this;
        }
        failure(error){
            this.reset();
            this.error = error;
            return this;
        }
        should_return(){


            return (
                this.error
                || this.func_return_value
                || this.loop_should_continue
                || this.loop_should_break
            );


        }
    }

    var runtime = Runtime$4;

    const Value = value;

    class List$2 extends Value{

        constructor(elements){
          super();
          this.elements = elements;
        }

        as_string(){

          const String_ = string;

          return "[ " +
            this.elements.map(e => {
              if(e instanceof String_){
                return "'" + e.value + "'";
              }
              else {
                return e.as_string()
              }
            }).join(", ")
            +" ]";
        }

        add(other){

          var new_list = this.get();
          new_list.elements.push(other);


          return {
              'n':new_list,
              'error':null
          }


        }

        retrieve(other){

            const Number_ = number;

          if (other instanceof Number_) {

            
            if (this.elements[other.value] /* != undefined */){
              return {
                'n': this.elements[other.value],
                'error': null
              }

            }else {
              return { 'n': null, 'error': this.out_of_range(other) }
            }

          }
          else {
            return { 'n': null, 'error': this.illegal_operaction(other) }
          }
        }


        is_true(){

            return this.elements.length > 0;
        }

        get(){
          var copy = new List$2(this.elements);
          copy.set_position(this.pos_start, this.pos_end);
          copy.set_context(this.context);

          return copy;
        }
        repr(){

          return `[${this.elements.map(e => e.value).join(",")}]`;

        }
    }

    var list = List$2;

    class Symbol_$2{
        constructor(parent=null){
            this.symbols = {};
            this.parent = parent;
        }
        set(name, value){
            this.symbols[name] = value;
        }
        get(name){
            const value = this.symbols[name];

            if (value == undefined && this.parent != null)
                return this.parent.get(name);

            return value;

        }
        reset(){
          this.symbols = {};
        }
        remove(name){
            delete this.symbols[name];
        }
    }

    var symbol = Symbol_$2;

    const Runtime$3 = runtime;
    const Value_ = value;
    const Context$1 = context;
    const Symbol_$1 = symbol;
    const e$1 = error;

    class FunctionBase$2 extends Value_{
        constructor(name){
            super();
            this.name = name || "<anonimo>";
        }
        generate_new_context(){
            var new_context = new Context$1(this.name, this.context, this.pos_start);
            new_context.symbol_table = new Symbol_$1(new_context.parent.symbol_table);

            return new_context;
        }
        check_args(arg_names, args){
            var res = new Runtime$3();

            if (args.length != arg_names.length) {
                return res.failure(
                    new e$1.RunTimeError(
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

            var res = new Runtime$3();

            for (var i = 0; i < args.length; i++) {

                var arg_value = args[i];
                arg_value.set_context(exec_ctx);
                exec_ctx.symbol_table.set(i, arg_value);
            }

            return res.success(null);

        }

        check_and_populate_args(arg_names, args, exec_ctx){

            var res = new Runtime$3();

            res.register(this.check_args(arg_names, args));
            if (res.should_return()) {
                return res;
            }

            this.populate_args(arg_names, args, exec_ctx);
            return res.success(null);
        }
    }

    var funcbase = FunctionBase$2;

    const FunctionBase$1 =  funcbase;
    const Runtime$2 = runtime;

    class Function_$1 extends FunctionBase$1{

        constructor(name, body_node, arg_names, should_auto_return){
            super(name);
            this.body_node = body_node;
            this.arg_names = arg_names;
            this.should_auto_return = should_auto_return;
        }
        execute(args){

            const Interpreter = interpreter;

            var res = new Runtime$2();
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

            else {
                const Number_ = number;
                return res.success(new Number_(0));
            }

        }
        get(){
            var get = new Function_$1(
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

    var func = Function_$1;

    const Runtime$1 = runtime;
    const Number_$1 = number;
    const String_ = string;
    const List$1 = list;
    const e = error;
    const Identifiers = identifiers;
    const Function_ = func;

    const It = new Identifiers();

    class Interpreter$1{

        run(node, context, from){

            if(node != null){
              return new Interpreter$1()[
                 `run_${node.constructor.name}`
              ](node, context);

            }else {
               return new Interpreter$1()[`method_not_exists`]();
            }



        }
        method_not_exists(){
            console.log("not exists");
        }
        run_NumberNode(node, context){



            //cont++;
            //console.log(Function.name, ":", cont);

            var n = new Number_$1(node.token.value);
            n.set_position(node.pos_start,node.pos_end);
            n.set_context(context);

            return new Runtime$1().success(n);

        }
        run_StringNode(node, context){
            var s = new String_(node.token.value);
            s.set_context(context);
            s.set_position(
                node.pos_start,
                node.pos_end
            );

            return new Runtime$1().success(s);


        }
        run_BinaryOperationNode(node, context){



            var res = new Runtime$1();

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

            var res = new Runtime$1();

            var number = res.register(this.run(node.node, context));

            if (res.should_return())
                return res;

            if (node.op_token.type == It.TK_MINUS) {
                number = number.mul(new Number_$1(-1));
            }
            else if (node.op_token.matches(It.TK_KEYWORD,'no')) {
                number = number.notted();
            }

            if (number.error) {
                return res.failure(number.error);
            }

            return res.success(
                number.n.set_position(node.pos_start, node.pos_end)
            );

        }
        run_ReturnNode(node, context){



            var res = new Runtime$1();
            if (node.node_to_return) {
                var value = res.register(this.run(node.node_to_return, context));



                if (res.should_return()) {
                    return res;
                }
            }
            else {
                var value = new Number_$1(0);
            }


            return res.success_return(value);

        }
        run_ContinueNode(node,context){
            var res = new Runtime$1();
            return res.success_continue();
        }
        run_BreakNode(node, context){

            var res = new Runtime$1();
            return res.success_break();
        }
        run_VarAssignNode(node, context){


            var res = new Runtime$1();
            var var_name = node.var_name_token.value;


            var value = res.register(this.run(
                node.value_node,
                context,
            ));


            if (res.should_return()){
                return res;
            }

            context.symbol_table.set(var_name,value);

            return res.success(value);

        }
        run_VarAccessNode(node, context){

            var res = new Runtime$1();
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

            var res = new Runtime$1();
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

            var res = new Runtime$1();
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



            var l = new List$1(elements);
            l.set_context(context);
            l.set_position(node.pos_start, node.pos_end);


            return res.success(l);

        }


        run_WhileNode(node, context){

            var res = new Runtime$1();

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

            var l = new List$1(elements);
            l.set_context(context);
            l.set_position(node.pos_start, node.pos_end);

            if (node.should_return_null) {

                return res.success(new Number_$1(0));
            }else {
                return res.success(l);
            }
        }
        run_IfNode(node,context){




            var res = new Runtime$1();


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
                        return res.success(new Number_$1(0));
                    }else {
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
                    return res.success(new Number_$1(0));
                }else {
                    return res.success(expr_value);
                }
            }

         return res.success(new Number_$1(0));

        }
        run_ForNode(node,context){

            var res = new Runtime$1();
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
            else {
                var step_value = new Number_$1(1);
            }

            var i = start_value.value;

            if (step_value.value > 0) {
                var condition = () => i < end_value.value;
            }else {
                var condition = () => i > end_value.value;
            }

            while(condition()){

                context.symbol_table.set(node.var_name_token.value, new Number_$1(i));
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

            var l = new List$1(elements);
            l.set_context(context);
            l.set_position(node.pos_start, node.pos_end);


            if (node.should_return_null) {
                return res.success(new Number_$1(0));
            }
            else {
                return res.success(l);
            }

        }
        run_FunctionNode(node, context){



            var res = new Runtime$1();

            if (node.var_name_token) {
                var func_name = node.var_name_token.value;
            }else {
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


            var res = new Runtime$1();
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

    var interpreter = Interpreter$1;

    const FunctionBase =  funcbase;
    const Runtime = runtime;
    const List = list;



    function failed_params_count(expected,args_len, node){

      const e = error;
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


    class BuiltIn$1 extends FunctionBase{
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
                new BuiltIn$1()[`execute_${this.name}`](exec_ctx)
            );

            if (res.error) {
                return res;
            }
            return res.success(return_value);

        }
        get(){
            const copy = new BuiltIn$1(this.name);
            copy.set_context(this.context);
            copy.set_position(this.pos_start, this.pos_end);

            return copy;
        }

        execute_print(exec_ctx){
        //execute_print(exec_ctx){

            const Number_ = number;

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

            const Number_ = number;

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

          const String_ = string;
          const List = list;
          const Number_ = number;
          const e = error;
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

          const Number_ = number;
          const e = error;
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
          const String_ = string;
          const res = new Runtime();


          const args_len = Object.keys(exec_ctx.symbol_table.symbols).length;
          const node = exec_ctx.symbol_table.symbols[0];

          if(args_len > 1 ){
            return failed_params_count(1,args_len,node);
          }

          if (args_len == 0) {
            var prompt = "";
          }else {
            var prompt = node.value;
          }

          var user_input = window.prompt(prompt,"");

          if (user_input) {
            return res.success(new String_(user_input));
          }
          else {
            return res.success(new String_(""));
          }

        }

        execute_is_number(exec_ctx){

          const Number_ = number;
          const Boolean_ = boolean;
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
          }else {
            return res.success(new Boolean_(0));
          }

        }

        execute_is_string(exec_ctx){


          const String_ = string;
          const Boolean_ = boolean;
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
          }else {
            return res.success(new Boolean_(0));
          }

        }


        execute_is_list(exec_ctx){


          const List = list;
          const Boolean_ = boolean;
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
          }else {
            return res.success(new Boolean_(0));
          }

        }

        execute_push_back(exec_ctx){

          const List = list;
          const e = error;
          const Number_ = number;
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

          const List = list;
          const e = error;
          const Number_ = number;
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

          const List = list;
          const e = error;
          const Number_ = number;
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

          const List = list;
          const e = error;
          const Number_ = number;
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

          const List = list;
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const String_ = string;
          const e = error;
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
          const String_ = string;
          const e = error;
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

          const String_ = string;
          const Number_ = number;
          const e = error;
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

          const String_ = string;
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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

          }else {

            return res.success(
              new Number_(parseInt(node1.value))
            );

          }

        }


        execute_to_string(exec_ctx){

          const String_ = string;
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
          const res = new Runtime();

          Object.keys(exec_ctx.symbol_table.symbols).length;

          const len = Object.keys(exec_ctx.symbol_table.symbols).length;

          var response = [];
          for (var i = 0; i < len ; i++) {

            var instance = exec_ctx.symbol_table.symbols[i];

            if(instance instanceof Number_){
              response.push(parseInt(instance.value));
            }else {
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
          const Number_ = number;
          const e = error;
          const res = new Runtime();

          Object.keys(exec_ctx.symbol_table.symbols).length;

          const len = Object.keys(exec_ctx.symbol_table.symbols).length;

          var response = [];
          for (var i = 0; i < len ; i++) {

            var instance = exec_ctx.symbol_table.symbols[i];

            if(instance instanceof Number_){
              response.push(parseInt(instance.value));
            }else {
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
          const Number_ = number;
          const e = error;
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
          const Number_ = number;
          const e = error;
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

          const Number_ = number;
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

    var builtin = BuiltIn$1;

    const Tokenization = tokenization;
    const Context = context;
    const Parser = parser;
    const Interpreter = interpreter;
    const Symbol_ = symbol;
    const BuiltIn = builtin;
    const Number_ = number;


    var symbol_table = new Symbol_();


    function create_default_symbol_table(){

      const Boolean_ = boolean;

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


    var run_1 = precodigo.run = run;

    exports['default'] = precodigo;
    exports.run = run_1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
