'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import img from './images/icon-120x120.png';

import { a } from './tree-shaking';

// 样式文件后缀可为.css也可为.less
import './search.less';

class Search extends React.Component {

    render() {
        // a=1; 此处使用一个未定义的变量，cheap-source-map会将报错定位到此处，但不会定位到js具体的执行部分
        return <div className="search-text">this is demo...<img src={ img } /></div>
    }

}

// npm run build打包后需在dist目录创建HTML文件，再引入dist目录下的search.js包，创建root节点并进行关联
ReactDOM.render(
    <Search />,
    document.getElementById('root')
);