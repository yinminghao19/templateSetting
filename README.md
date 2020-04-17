# 模板代码生成小工具

### 接口名：olcCodeGenerationTool

### 需要参数：
@数据模板：jsonUrl(json格式数据路径)
@模板路径：templateUrl(参数模板路径)
@生成代码路径：outputUrl(生成最终文件路径)

### 基本语法
声明参数：<--参数名-->
例：
import { <--a--> } from 'xxx';

FOR循环：$y-for="参数名"(开始符) $y-endFor(结束符号)
例：(支持多重循环，循环写法变更)
$y-for="item of colbCntrtList"
export class <--item.name--> {
    $y-for="item2 of item.list2"
    public <--item2.name-->: TitleSet[] = [];
    $y-endFor
}
$y-endFor

IF语句：$y-if="<--参数名-->"
$y-if="<--ss-->"
private URL_<--dsadsa-->: string = xxx;
$y-endIf