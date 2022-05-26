const Value = require('./value.js');
const e = require('./error.js');

class String_ extends Value{

    constructor(value){
        super();
        this.value = value;
    }
    as_string(){
        return this.value;
    }
    add(other){
        const Number_ = require('./number.js');
        if(
            (other instanceof String_)

        ){
            var s = new String_(this.value + (other.value).toString());
            s.set_context(this.context);
            //return [s, null];
            return {
                'n':s,
                'error':null
            }
        }
        else{
            return {
                'n':null,
                'error':this.illegal_operaction(other)
            }
        }
    }


    get_comparation_equals(other){

      const Number_ = require('./number.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof Number_)
        ||
        (other instanceof String_)
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

      const Number_ = require('./number.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof Number_)
        ||
        (other instanceof String_)
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

      const Number_ = require('./number.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof Number_)
        ||
        (other instanceof String_)
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


      const Number_ = require('./number.js');
      const Boolean_ = require('./boolean.js');

      if (
        !((other instanceof Number_)
        ||
        (other instanceof String_)
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
        const Boolean_ = require('./boolean.js');

        var n = new Boolean_((this.value == 0)? 1 : 0);
        n.set_context(this.context);
        return {'n':n, 'error':null}
    }

    get(){

        var s = new String_(this.value);
        s.set_position(this.pos_start, this.pos_end);
        s.set_context(this.context);
        return s;
    }
    is_true(){

        return this.value != '';
    }
}

module.exports = String_;
