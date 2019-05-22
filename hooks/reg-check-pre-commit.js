/**
 * SVN 代码正则校验
 * @Author GM20171202
 * @Date 2019-05-21 16:42:58
 * @Last Modified by: GM20171202
 * @Last Modified time: 2019-05-22 09:23:15
 */
var fs = require("fs");
var path = require("path");

// 需要校验的文件后缀名
var needCheckSuffixs = [".js"];
// 需要校验的目录
var needCheckFilePaths = ["../src"];
// 需要校验的规则
// prettier-ignore
var needCheckRegs = ["\\s+(const|let)\\s","\s+=>",]
var errorMsgs = [];

needCheckFilePaths.forEach(function(filePath) {
  recursiveReadFile(filePath);
});
if (errorMsgs.length) {
  throw errorMsgs.join("\n");
}

function recursiveReadFile(fileName) {
  if (isFile(fileName) && checkFileSuffixs(fileName, needCheckSuffixs)) {
    check(fileName);
  }
  if (isDirectory(fileName)) {
    var files = fs.readdirSync(fileName);
    files.forEach(function(val) {
      var temp = path.join(fileName, val);
      if (isDirectory(temp)) {
        recursiveReadFile(temp);
      }
      if (isFile(temp) && checkFileSuffixs(temp, needCheckSuffixs)) {
        check(temp);
      }
    });
  }
}
function check(fileName) {
  var data = readFile(fileName);
  needCheckRegs.forEach(function(regItem) {
    var exc = new RegExp(regItem, "gmi");
    if (exc.test(data)) {
      errorMsgs.push(
        "[check-es6-code-pre-commit-Error] File:" +
          fileName +
          " not pass,plz check"
      );
    }
  });
}
function isDirectory(fileName) {
  if (fs.existsSync(fileName)) return fs.statSync(fileName).isDirectory();
}
function isFile(fileName) {
  if (fs.existsSync(fileName)) return fs.statSync(fileName).isFile();
}
function readFile(fileName) {
  if (fs.existsSync(fileName)) return fs.readFileSync(fileName, "utf-8");
}

function checkFileSuffixs(fileName, suffixsArr) {
  var result = false;
  suffixsArr.forEach(function(suffixs) {
    if (fileName.endsWith(suffixs)) {
      result = true;
    }
  });
  return result;
}
