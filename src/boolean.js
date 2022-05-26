const Number_ = require('./number.js');

class Boolean_ extends Number_{

    constructor(value=null){
        super(value);
        this.value = value;
    }

    as_string(){

        if(this.value == 0){
            return 'falso';
        }
        else{
            return 'verdadero';
        }
    }
    get(){
        const b = new Boolean_(this.value);
        b.set_position(this.pos_start, this.pos_end);
        b.set_context(this.context);
        return b;
    }

    get_comparation_equals(other){

      const String_ = require('./string.js');
      const Number_ = require('./number.js');

      if (
        !((other instanceof String_)
        ||
        (other instanceof Boolean_)
        ||             
        (other instanceof Number_))
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
      const Number_ = require('./number.js');

      if (
        !((other instanceof String_)
        ||
        (other instanceof Boolean_)
        ||
        (other instanceof Number_))
      ) {
        return {'n':null,'error': this.illegal_operaction(other)}
      }


          // remainder value
          var n = new Boolean_((this.value != other.value)? 1 : 0);
          n.set_context(this.context);

          return {'n':n, 'error':null}


    }

    and_by(other){

      const Number_ = require('./number.js');
      const String_ = require('./string.js');

      if (
        !((other instanceof Number_)
        ||
        (other instanceof String_))
      ) {
        return {'n':null,'error': this.illegal_operaction(other)}
      }

      // remainder value
      var n = new Boolean_((this.value && other.value)? 1 : 0);
      n.set_context(this.context);
      return {'n':n, 'error':null}

    }

    or_by(other){

      const Number_ = require('./number.js');
      const String_ = require('./string.js');

      if (
        !((other instanceof Number_)
        ||
        (other instanceof String_))
      ) {
        return {'n':null,'error': this.illegal_operaction(other)}
      }

      // remainder value
      var n = new Boolean_((this.value || other.value)? 1 : 0);
      n.set_context(this.context);
      return {'n':n, 'error':null}

    }

    notted(){


        var n = new Boolean_((this.value == 0)? 1 : 0);
        n.set_context(this.context);
        return {'n':n, 'error':null}
    }

    is_true(){

        return this.value != 0;
    }






}

Boolean_.null = new Boolean_(0);
Boolean_.false = new Boolean_(0);
Boolean_.true = new Boolean_(1);


module.exports = Boolean_;
