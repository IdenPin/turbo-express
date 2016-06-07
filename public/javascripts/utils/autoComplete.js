/* cubic add code
 this plugin is used for auto complete the input field;
 works with ajaxFun and checkLoginTimeout.
 commonjs is required
 A typical use expamle is shown in next line:
 <input zgk-type="autoComplete" zgk-api="/Realitive/Path/To/Api" />
 */
define(['commonjs'], function(commonjs) {

  ! function($, commonjs) {
    "use strict"
    var targetDom = '[zgk-type="autoComplete"]';
    var itemDom = '[zgk-type="autoComplete-item"]';
    var itemContainerDom = '[zgk-type="autoComplete-container"]';
    var targetAPI;
    var zgkAutoComlete = function() {
      this.timer = null;
    };

    zgkAutoComlete.prototype.startListening = function(e) {
      var $dom = $(e.target);
      $dom.attr('autocomplete', 'off');
      var zgk = window.zgkActive || {};
      zgk.zgkAutoComlete = $dom;
      window.zgkActive = zgk;
      loadData();
    };

    zgkAutoComlete.prototype.listeningKeyDown = function(e) {
      var keyCode = e.keyCode;
      var $dom = $(e.target);
      switch (keyCode) {
        case 13:
        case 38:
        case 40:
          {
            elementControl($dom, keyCode);
            return false;
          }
        default:
          {
            $dom.data('zgk.zgkAutoComlete.instruction', 'input');
            window.clearTimeout($dom.data('zgk.zgkAutoComlete.timer'));
            if ($dom.val().length > 1) {
              $dom.data('zgk.zgkAutoComlete.timer',
                window.setTimeout(loadData, 500)
              );
            }
          }
      }
    };

    function loadData() {
      var $dom = window.zgkActive.zgkAutoComlete;
      var api = $dom.attr('zgk-api');
      var input = $dom.val();
      //var requestURI = api + '?keywords=' + input;
      //call back with data
      switch (api) {
        case 'U':
          {
            api = commonjs.INTERFACE_URL.getMatchedUniversity;
            break;
          }
        case 'M':
          {
            api = commonjs.INTERFACE_URL.getMatchedMajor;
            break;
          }
        case 'P':
          {
            api = commonjs.INTERFACE_URL.getMatchedProfessional;
            break;
          }
      }
      if (input === '') {
        return false;
      }
      commonjs.ajaxFun(api, 'GET', {
        "keywords": input
      }, dataLoaded);
    }

    function dataLoaded(data) {
      var returnData;
      if (data.rtnCode === '0000000') {
        returnData = data.bizData;
      } else {
        return false;
      }
      var resultArray = [];
      $.each(returnData, function(key, value) {
        resultArray.push([key, value]);
      });
      if (resultArray.length) {
        window.zgkActive.zgkAutoComlete.data(
          'zgk.zgkAutoComlete.matchedData', resultArray);
      } else {
        window.zgkActive.zgkAutoComlete.data(
          'zgk.zgkAutoComlete.matchedData', {});
      }
      elementControl(window.zgkActive.zgkAutoComlete, 'dataLoaded');
    }

    function elementControl($dom, instruction) {
      var data = $dom.data('zgk.zgkAutoComlete.matchedData');
      var currentDataIndex = $dom.data('zgk.zgkAutoComlete.dataIndex');
      switch (instruction) {
        case 'dataLoaded':
          {
            currentDataIndex = 0;
            $dom.data('zgk.zgkAutoComlete.dataIndex', currentDataIndex);
            break;
          }
        case 38:
          {
            if (currentDataIndex > 0) {
              currentDataIndex--;
            } else {
              currentDataIndex = data.length - 1;
            }
            $dom.data('zgk.zgkAutoComlete.dataIndex', currentDataIndex);
            $dom.val(data[currentDataIndex][1]);
            break;
          }
        case 40:
          {
            if (currentDataIndex < data.length - 1) {
              currentDataIndex++;
            } else {
              currentDataIndex = 0;
            }
            $dom.data('zgk.zgkAutoComlete.dataIndex', currentDataIndex);
            $dom.val(data[currentDataIndex][1]);
            break;
          }
        case 13:
          {
            var inputData = data[currentDataIndex] ? data[
                currentDataIndex]
              [1] : '';
            $dom.val(inputData);
            $dom.blur();
            break;
          }
      }
      var boxTop = $dom.offset().top + $dom.outerHeight(false);
      var boxLeft = $dom.offset().left;
      var boxWidth = $dom.outerWidth(false);
      $(itemContainerDom).remove();
      if (data && data.length) {
        var $insert = $(
          '<div zgk-type="autoComplete-container" class="autoComplete-container"  style="top:' +
          boxTop + 'px;left:' + boxLeft + 'px;width:' + boxWidth +
          'px;"></div>');
        var appendHtml = '';
        $.each(data, function(key, value) {
          if (key == currentDataIndex) {
            appendHtml +=
              '<div class="autoComplete-item active" index="' + key +
              '" zgk-type="autoComplete-item">' +
              value[1] + '</div>';
          } else {
            appendHtml +=
              '<div class="autoComplete-item" index="' + key +
              '" zgk-type="autoComplete-item">' +
              value[1] + '</div>';
          }
        });
        $insert.html(appendHtml);
        $(document.body).append($insert);
      }
    }

    function closeHintBox() {
      try {
        var $dom = window.zgkActive.zgkAutoComlete;
        var data = $dom.data('zgk.zgkAutoComlete.matchedData');
        var currentDataIndex = $dom.data('zgk.zgkAutoComlete.dataIndex');
        var inputData = data && data[currentDataIndex][1] ? data[
          currentDataIndex][1] : '';
        window.zgkActive.zgkAutoComlete =
          null;
        $dom.data('zgk.zgkAutoComlete.matchedData', '');
        $dom.data(
          'zgk.zgkAutoComlete.dataIndex', '');
        //$dom.val($dom.val() ? inputData : '');
        $(itemContainerDom).remove();
        //$dom.blur();
      } catch (e) {}
      $(itemContainerDom).remove();
    }

    zgkAutoComlete.prototype.selectItem = function(e) {
      var $dom = $(e.target);
      var index = $dom.attr('index');
      var $input = window.zgkActive.zgkAutoComlete;
      $input.data('zgk.zgkAutoComlete.dataIndex', index);
    };

    zgkAutoComlete.prototype.togleItem = function(e) {
      var $dom = $(e.target);
      var index = $dom.attr('index');
      var $input = window.zgkActive.zgkAutoComlete;
      $input.val($dom.html());
      $input.data('zgk.zgkAutoComlete.dataIndex', index);
      elementControl($input, '');
    };

    /*zgkAutoComlete.prototype.mouseout = function(e) {
      console.log($(e.target).attr('zgk-type'));
      if ($(e.currentTarget).attr('zgk-type') ===
        'autoComplete-container') {
        var $input = window.zgkActive.zgkAutoComlete;
        $input.blur();
      }
    };*/

    zgkAutoComlete.prototype.stopListening = function(e) {
      setTimeout(closeHintBox, 200);
    };

    $.fn.zgkAutoComlete = zgkAutoComlete;

    $(document)
      .on('keydown', targetDom, zgkAutoComlete.prototype.listeningKeyDown)
      .on('click', itemDom, zgkAutoComlete.prototype.selectItem)
      .on('mouseover', itemDom, zgkAutoComlete.prototype.togleItem)
      //.on('mouseout', itemContainerDom, zgkAutoComlete.prototype.mouseout)
      .on('focus', targetDom, zgkAutoComlete.prototype.startListening)
      .on('blur', targetDom, zgkAutoComlete.prototype.stopListening);
  }(jQuery, commonjs);
});
