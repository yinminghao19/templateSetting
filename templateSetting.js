exports.olcCodeGenerationTool = function(jsonUrl, templateUrl, outputUrl){
    var fs = require('fs');
    var data = fs.readFileSync(jsonUrl, {flag: 'r+', encoding: 'utf8'});
    var str = "var data=" + data + "\r\n" + "var str = ''" + ";\r\n";
    initSetting(templateUrl, outputUrl, str);
}

function initSetting(url, outputUrl, str){
    var fs = require('fs');
    const readline = require('readline');
    const rl = readline.createInterface({
        input: fs.createReadStream(url),
        crlfDelay: Infinity
    });
    
    rl.on('line', (line) => {
        str = str + yfzh(line)+ "\r\n";
    }).on('close', ()=>{
        str = str + "var fs = require('fs');"
        str = str + "fs.writeFileSync("+ "\""+outputUrl+ "\""+", str,'utf8');";
        str = str + "console.log('写入成功');";
        fs.writeFileSync('result.js', str,'utf8');
        cmdRun();
    });
}

function yfzh(readLine){
    var str = "";
    if (readLine.indexOf("$y-for") > -1) {
        var forObj = forParamGet(readLine);
        str = str + dataCheck(forObj.list) + ".forEach((" + forObj.item + ")=>{" + "\r\n"
    } else if (readLine.indexOf("$y-endFor") > -1) {
        str = str + "});" + "\r\n"
    } else if (readLine.indexOf("$y-if") > -1) {
        str = "if(" + ifCheck(readLine.split("\"")[1]) + "){"
    } else if (readLine.indexOf("$y-endIf") > -1) {
        str = str + "};" + "\r\n"
    } else {
        str = str + "str = str + " + ruleParam(readLine) + "+\"\\r\\n\";" + "\r\n";
    }
    return str;
}

function ifCheck(param){
    var P_L_P = '<--';
    var P_R_P = '-->';
    var result = "";
    if (param.indexOf(P_L_P) > -1) {
        var f = param.split(P_L_P);
        f.forEach((val)=>{
            if (val.indexOf(P_R_P) > -1) {
                result = dataCheck(val.substr(0, val.indexOf(P_R_P)));
            }
        });
    }
    return result
}

function forParamGet(readLine){
    var obj = { item: undefined, list: undefined };
    obj.item = trim(readLine.split("\"")[1].split("of")[0]);
    obj.list = trim(readLine.split("\"")[1].split("of")[1]);
    return obj;
}

// <--viewId-->
function ruleParam(oneLine){
    var P_L_P = '<--';
    var P_R_P = '-->';
    var result = "";
    if (oneLine.indexOf(P_L_P) > -1) {
        var f = oneLine.split(P_L_P);
        f.forEach((val)=>{
            if (val.indexOf(P_R_P) > -1) {
                var param = val.substr(0, val.indexOf(P_R_P));
                result = result + "+" + dataCheck(param) + "+" + "\"" + val.substr(val.indexOf(P_R_P) + 3, val.length - 1) + "\"";
            } else {
                result = result + "\"" + val + "\"";
            }
        });
    } else {
        result = "\"" +oneLine+ "\"";
    }
    return result;
}

function dataCheck(param){
    if(param.indexOf(".") > -1){
        return param;
    }

    return "data." + param;
}

function trim(s){  
    return s.replace(/(^\s*)|(\s*$)/, "");
 }

function cmdRun(){
    var process = require('child_process');
    var cmd = 'node result.js';
    process.exec(cmd, function(error, stdout, stderr) {
        console.log(stdout);
    });
}