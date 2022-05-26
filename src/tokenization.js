const Identifiers = require('./identifiers.js');
const Token = require('./token.js');
const e = require('./error.js');
const Position = require('./position.js');
const Boolean_ = require('./boolean.js');



const It = new Identifiers();


//console.log(Tk)

class Tokenization {

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
    }else{
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

    return new Token(It.TK_STRING, string, pos_start, this.position);
  }
  create_equals(){
    var id_type = It.TK_EQUALS;
    var pos_start = this.position.get();

    this.next();

    if (this.current == '=') {
        this.next();
        id_type = It.TK_IS_EQ;
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
            'e': new e.IllegalCharError(
                    pos_start,
                    this.position,
                    "Tal vez quiso decir '!='"
                ),
        }
    }
    this.next();

    return {
        't':new Token(It.TK_IS_NEQ, null, pos_start, this.position),
        'e':null,
    }
  }
  create_greater_than(){

    var id_type = It.TK_IS_GT;
    var pos_start = this.position.get();

    this.next();

    if (this.current == '=') {
        this.next();
        id_type = It.TK_IS_GTE;
    }

    return new Token(
        id_type,
        null,
        pos_start,
        this.position
    )
  }
  create_less_than(){

    var id_type = It.TK_IS_LT;
    var pos_start = this.position.get();

    this.next();

    if (this.current == '=') {
        this.next();
        id_type = It.TK_IS_LTE;
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
    var special = false;
    var id_type = It.TK_IDENTIFIER;
    var pos_start = this.position;

    while(this.current != null
          &&  (It.nums()+It.letters()+'_').indexOf(this.current) != -1){

        id_str = id_str + this.current;
        this.next();
    }

    if (It.spanish_keywords().indexOf(id_str) != -1) {
        id_type = It.TK_KEYWORD;
    }

    else if ([
        Boolean_.true.as_string(),
        Boolean_.false.as_string()].indexOf(id_str) != -1) {

        id_type = It.TK_BOOLEAN;
    }
    else if(id_str.toLowerCase() == 'mod'){
        id_type = It.TK_MOD;
    }


    return {
        't':new Token(id_type,id_str,pos_start,this.position),
        'error':null,
    }
  }
  create_minus_or_arrow(){

    var id_type = It.TK_MINUS;
    var pos_start = this.position.get();

    this.next();

    if (this.current == '>') {
        this.next();
        id_type = It.TK_ARROW;
    }
    return {
        't':new Token(id_type,null,pos_start,this.position),
        'error':null,
    }

  }
  create_comment(){

    var pos_start = this.position.get();
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
           && It.nums().indexOf(this.current) != -1 ){

        if (this.current == '.') {

            if (has_dot)
                break

            has_dot = true;
            tmp = tmp + '.';
        }
        else{
            tmp = tmp + this.current;
        }
        this.next();
    }
    if(has_dot){
        return new Token(It.TK_FLOAT, parseFloat(tmp), pos_start, this.position);
    }else{
        return new Token(It.TK_INT, parseInt(tmp), pos_start, this.position);
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
                It.TK_NEWLINE,
                null,
                this.position,
            ));
            this.next();

        }
        else if(It.nums().indexOf(this.current) != -1){

            tokens.push(this.create_number());
        }
        else if(It.letters().indexOf(this.current) != -1){

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
                It.TK_PLUS,
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
                It.TK_MUL,
                null,
                this.position,
            ));
            this.next();
        }
        else if(this.current == '/'){
            tokens.push(new Token(
                It.TK_DIV,
                null,
                this.position,
            ));
            this.next();
        }
        else if(this.current == '('){
            tokens.push(new Token(
                It.TK_LPAREN,
                null,
                this.position,
            ));
            this.next();
        }
        else if(this.current == ')'){
            tokens.push(new Token(
                It.TK_RPAREN,
                null,
                this.position,
            ));
            this.next();
        }
        else if(this.current == '['){
            tokens.push(new Token(
                It.TK_LSQBRA,
                null,
                this.position,
            ));
            this.next();
        }
        else if(this.current == ']'){
            tokens.push(new Token(
                It.TK_RSQBRA,
                null,
                this.position,
            ));
            this.next();
        }
        else if(this.current == '^'){
            tokens.push(new Token(
                It.TK_POW,
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
                It.TK_COMMA,
                null,
                this.position,
            ));
            this.next();
        }
        else{

            var pos_start = this.position.get();
            var char = this.current;
            this.next();
            return {
                'tokens':null,
                'error':new e.IllegalCharError(pos_start,this.position,`'${char}'`)
            }
        }
    }


    tokens.push(new Token(It.TK_EOF, null, this.position));



    return {
        'tokens':tokens,
        'error':null
    };
  }
}

module.exports = Tokenization;
