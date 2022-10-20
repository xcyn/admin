import { businessRequest,systemRequest } from '@/plugin/axios/index';
import { CALCULATION_URL,EXTEND_URL } from '@/api/baseUrl';

/**
 * 机组控制
 * @param {*} formData
 */
 export function doControling(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/units/doControling',
      data: formData
    });
  }


  /**
   * 获取机组控制测点值
   */
  export function getUnitsControlData(formData) {
    return businessRequest({
      method: 'post',
      url: CALCULATION_URL() + '/api/units/getUnitsControlData',
      data: formData
    });
  }

  /**TEMP_VAL 转成tempVal */
  export function upperToCamel(upperStr) {
    var b = upperStr.split("_");
    var c = [];
    for (var i = 0; i < b.length; i++) {
        if (i == 0) {
            c.push(b[i].toLowerCase());
        } else {
            console.log(b[i].charAt(0));
            c.push(b[i].replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
                }
            ));
        }
    }
    return c.join("");
}

 /**tempVal 转成 TEMP_VAL */
export function camelToUpper(param) {
  var result = "";
  if (param != null && param.length > 0) {
      // 将第一个字符处理成大写
      result+=param.substring(0, 1).toUpperCase();
      // 循环处理其余字符
      for (var i = 1; i < param.length; i++) {
          var s = param.substring(i, i + 1);
          // 在大写字母前添加下划线
          if (s == s.toUpperCase() && (/^[0-9A-Z]*$/.test(s.charAt(0)))) {
              result += "_";
          }
          // 其他字符直接转成大写
          result += s.toUpperCase();
      }
  }
  return result;
}

export function handleDialogSave(that, formName){
    //组织表单数据 
    let reqData = {
      "ctrlType": that.ctrlType,
      "dateStr": [
        /*  {
          "datename": "string",
          "dateval": "string"
          } */
      ],
      "locaIds": that.locaIds,
      "userid": that.userid,
      "username": that.username
    }

    let dateStr = [];

    let keys = Object.keys(that.dialogForm);
    for(let key of keys){
      if(that.dialogForm[key] != ""){
          let dateObj = {};
          dateObj.datename = key;
          dateObj.dateval = that.dialogForm[key];
          dateStr.push(dateObj);
      }
    }
    if(dateStr.length == 0){
      that.$message.warning("请至少提交一条数据");
      return;
    }
    reqData.dateStr = dateStr;

    doControling(reqData).then((res) => {
      if (res.code===0) {
          //
          let data = res.data;
          let x=0;//控制失败的个数
          let y=0;
          let address="";
          let offset="";
          for(let t=0;t<that.locaIds.length;t++){
              let data_flags = data[t].split(";");
              for(let i=0;i<data_flags.length-1;i++){
                  let str=data_flags[i].split('_');
                  if(str[1] =="3"){
                      x++;
                      if(address != ""){
                          address=str[0]+','+address;
                      }else{
                          address=str[0];
                      }
                  }
                  else if(str[1]=="0"){
                      y++;
                      if(offset != ""){
                          offset=str[0]+','+offset;
                      }else{
                          offset=str[0];
                      }
                  }
                      
              }
          }
          if(x>0||y>0){
              let msg = "";
              if(x > 0){
                  msg += "地址为"+address+"有"+ x+"条控制参数配置存在错误;";
              }
              if(y>0){
                  msg += y+"条偏移量为"+offset+"的控制命令下发失败!"
              }
              that.$message.error(msg);
          }else{
              that.$message.success('保存成功');
          }

          that.handleDialogClose(formName);
      } else {
          that.$message.error('保存失败');
      }
    });
}
