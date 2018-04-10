require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
//获取图片数据
let imageData=require('../data/imagesData.json');
//利用自执行函数获取图片路径url
imageData=(function getImageUrl(imageData){
  for(let i=0;i<imageData.lengh;i++){
    let imgDataArr=imageData[i];
    imgDataArr.imageUrl=require('../images'+imgDataArr.fileName);
    imageData[i]=imgDataArr.imageUrl
  }
  return imageData
})(imageData);
console.log(imageData);
class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

//export default AppComponent;
module.exports = AppComponent;
