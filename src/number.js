const Value = require('./value.js');
const e = require('./error.js');

class Number_ extends Value{
    constructor(value){
        super();
        this.value = value;
    }

    as_string(){
        return this.value;
    }
    add(other){
        if (other instanceof Number_){
            var n = new Number_(this.value + other.value);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }
        else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    minus(other){
        if(other instanceof Number_){
            var n = new Number_(this.value - other.value);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }
        else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    mul(other){

        if(other instanceof Number_){

            var n = new Number_(this.value * other.value);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }
        else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    div(other){

        if(other instanceof Number_){

            if (other.value == 0) {
                return {
                    'n':null,
                    'error': new e.RunTimeError(
                        other.pos_start,
                        other.pos_end,
                        'División por cero',
                        this.context
                    ),
                }
            }

            var n = new Number_(this.value / other.value);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }
        else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    mod(other){

        if(other instanceof Number_){

            if (other.value == 0) {
                //console.log("RUN CERO")
                return {
                    'n':null,
                    'error': new e.RunTimeError(
                        other.pos_start,
                        other.pos_end,
                        'División por cero',
                        this.context
                    ),
                }
            }

            // remainder value
            var n = new Number_(this.value % other.value);
            n.set_context(this.context);
            return {'n':n, 'error':null}

        }else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }

    }
    pow(other){

        if(other instanceof Number_){


            // remainder value
            var n = new Number_(this.value ** other.value);
            n.set_context(this.context);
            return {'n':n, 'error':null}

        }else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }

    }

    get_comparation_equals(other){

      const String_ = require('./string.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof String_)
        ||
        (other instanceof Number_)
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

      const String_ = require('./string.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof String_)
        ||
        (other instanceof Number_)
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

        if(other instanceof Number_){

            const Boolean_ = require('./boolean.js');
            // remainder value
            var n = new Boolean_((this.value < other.value)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}
        }else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    get_comparation_gt(other){

        if(other instanceof Number_){

            const Boolean_ = require('./boolean.js');

            // remainder value
            var n = new Boolean_((this.value > other.value)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}

        }else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    get_comparation_lte(other){

        if(other instanceof Number_){

            const Boolean_ = require('./boolean.js');

            // remainder value
            var n = new Boolean_((this.value <= other.value)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}

        }else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    get_comparation_gte(other){

        if(other instanceof Number_){

            const Boolean_ = require('./boolean.js');
            // remainder value
            var n = new Boolean_((this.value >= other.value)? 1 : 0);
            n.set_context(this.context);
            return {'n':n, 'error':null}

        }else{
            return {'n':null,'error': this.illegal_operaction(other)}
        }
    }
    and_by(other){

      const String_ = require('./string.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof String_)
        ||
        (other instanceof Number_)
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

      const String_ = require('./string.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof String_)
        ||
        (other instanceof Number_)
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
        const Boolean_ = require('./boolean.js');

        var n = new Boolean_((this.value == 0)? 1 : 0);
        n.set_context(this.context);
        return {'n':n, 'error':null}
    }
    get(){
        var copy = new Number_(this.value);
        copy.set_position(this.pos_start, this.pos_end);
        copy.set_context(this.context);
        return copy;
    }
}

Number_.null = new Number_(0)
Number_.math_pi = new Number_(Math.PI);

module.exports = Number_;
