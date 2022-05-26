

    function resize_panel(resizer){

      const leftSide = resizer.previousElementSibling;
      const rightSide = resizer.nextElementSibling;

      let x = 0;
      let leftWidth = 0;


      const tmpw = (leftSide.getBoundingClientRect().width ) * 100 / resizer.parentNode.getBoundingClientRect().width;

      if(!localStorage.getItem('rightSide')){
        localStorage.setItem('last', `calc(${tmpw}% - 8.5px)`);
      }


      const mouseDownHandler = function(e) {
          // Get the current mouse position
          x = e.clientX;

          leftWidth = leftSide.getBoundingClientRect().width;
          //rightWidth = rightSide.getBoundingClientRect().width;


          // Attach the listeners to `document`
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
      };

      resizer.addEventListener('mousedown', mouseDownHandler);

      const mouseMoveHandler = function(e) {
          // How far the mouse has been moved
          const dx = e.clientX - x;

          const newLeftWidth = (leftWidth + dx) * 100 / resizer.parentNode.getBoundingClientRect().width;

          const newRightWidth = 100 - newLeftWidth;

          if (newRightWidth > 5 && newRightWidth < 85) {
            leftSide.style.width = `calc(${newLeftWidth}% - 5.5px)`;


            localStorage.setItem('last', `calc(${newLeftWidth}% - 5.5px)`);

            rightSide.style.width = `calc(${newRightWidth}% - 8.5px)`;

            localStorage.setItem('leftSide', newRightWidth);
            localStorage.setItem('rightSide', newLeftWidth);

            resizer.style.cursor = 'col-resize';
            document.body.style.cursor = 'col-resize';
            leftSide.style.userSelect = 'none';
            leftSide.style.pointerEvents = 'none';
            rightSide.style.userSelect = 'none';
            rightSide.style.pointerEvents = 'none';

          }

      };

      const mouseUpHandler = function() {
          resizer.style.removeProperty('cursor');
          document.body.style.removeProperty('cursor');

          leftSide.style.removeProperty('user-select');
          leftSide.style.removeProperty('pointer-events');

          rightSide.style.removeProperty('user-select');
          rightSide.style.removeProperty('pointer-events');

          // Remove the handlers of `mousemove` and `mouseup`
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
      };


      window.addEventListener('resize', function(event) {



        if(window.innerWidth <= 700){
          leftSide.style.width = window.innerWidth + 'px';
        }else{
          leftSide.style.width = localStorage.getItem('last');
        }



      }, true);


      if(window.innerWidth <= 700){
        leftSide.style.width = window.innerWidth + 'px';
      }

    }



module.exports = {
  resize_panel: resize_panel,
};
