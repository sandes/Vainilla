const e = require('./error.js');

class Value{

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
        this.context = context
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
        return new e.RunTimeError(
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
        return new e.RunTimeError(
            this.pos_start,
            other.pos_end,
            'El indice está fuera de rango',
            this.context
        );
    }
}
module.exports = Value;