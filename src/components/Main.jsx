require('normalize.css/normalize.css');
require('styles/App.css');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//获取图片数据
let imageData=require('../data/imagesData.json');
//利用自执行函数获取图片路径url
let imagesData=(function getImageUrl(imageData){
  for(let i=0;i<imageData.length;i++){
    let imgDataArr=imageData[i];
    imgDataArr.imageUrl=require('../images/'+imgDataArr.fileName);
    imageData[i]=imgDataArr;
  }
  return imageData
})(imageData);
function getRangeRandom(low,high){//从区间随机取值
  return Math.ceil(Math.random() * (high - low) + low)
}
function getRotateRandom(){//获取一个随机的正负30度
  return (Math.random() >0.5 ? '' : '-' +Math.ceil(Math.random() * 30));
}
class ImgFigure extends Component{
  render(){
    let styleObj={},
      Position=this.props.position,
      imgFigureClassName="img-figure";
      imgFigureClassName += Position.isInverse ? ' is-inverse' : '';
    if(!!Position.pos){
      styleObj=Position.pos;
    }
    if(!!Position.rotate){
      (['Moz','ms','Webkit','']).forEach(function(item){
        styleObj[item+'Transform']='rotate('+Position.rotate+'deg)'
      });
    }
    if(Position.isCenter){
      styleObj.zIndex=10
    }
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={
      (e)=>{
        e.stopPropagation();
        e.preventDefault();
        if(Position.isCenter){
          this.props.inverse(this.props.index);
        }else{
           this.props.centerImage(this.props.index);
        }
      }
      }>
        <img src={this.props.data.imageUrl} alt={this.props.data.title} width="240" height="240"/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className='img-back' onClick={
      (e)=>{
        e.stopPropagation();
        e.preventDefault();
         if(Position.isCenter==true){//如果图片居中则翻转
          this.props.inverse(this.props.index);
        }else{//否则居中
           this.props.centerImage(this.props.index);
        }
      }
      }>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}
class AppComponent extends Component{
  Constant={
    centerPos:{
      left:0,
      top:0
      },
    hPosRan:{//水平方向取值范围
      leftSecx:[0,0],
      rightSecx:[0,0],
      y:[0,0]
    },
    VPosRan:{//垂直方向取值范围
      topY:[0,0],
      x:[0,0]
      }
   };
  constructor(props) {
    super(props);
    this.state={
      imagesArray:[]
    };
  }
  /*
  *翻转图片
  * index 输入当前被执行操作的图片对应在图片数组里的index值
  * 这是一个闭包函数,其内return一个真正的待被执行的函数
  * */
  //inverse(index){
  //  return function(){//采用闭包的方式
  //    let imagesArray=this.state.imagesArray;
  //    imagesArray[index].isInverse= !imagesArray[index].isInverse;
  //    this.setState({
  //      imagesArray:imagesArray
  //    })
  //  }.bind(this)
  //}
  inverse(index){
    let imagesArray=this.state.imagesArray;
    imagesArray[index].isInverse= !imagesArray[index].isInverse;
    this.setState({
      imagesArray:imagesArray
    });
    console.log(this.state.imagesArray);
  }
  //居中图片的index
  rearRange(centerIndex){
    let imagesArray=this.state.imagesArray,
      Constant=this.Constant,
      centerPos=Constant.centerPos,
      hPosRan=Constant.hPosRan,
      hPosRanLeftSecx=hPosRan.leftSecx,
      hPosRanRightSecx=hPosRan.rightSecx,
      hPosRanY=hPosRan.y,
      VPosRan=Constant.VPosRan;
      let VPosRanTopY=VPosRan.topY,
      VPosRanX=VPosRan.x;

      //上侧图片
      let imagesTopArray=[],
      topImgNum=Math.ceil(Math.random() *2),//取一个或不取图片
      topImgSpliceIndex=0,//图片在数组中的位置

      //居中图片
      imagesMiddleArray=imagesArray.splice(centerIndex,1);
      imagesMiddleArray[0]={
          pos:centerPos,
          rotate:0,
          isCenter:true
      };

      //取出要在上侧的图片状态信息
      topImgSpliceIndex= Math.ceil(Math.random() * (imagesArray.length - topImgNum));//向下取整
      imagesTopArray = imagesArray.splice(topImgSpliceIndex,topImgNum);

      imagesTopArray.forEach(function(item,index){
        imagesTopArray[index]={
          pos:{
            left:getRangeRandom(VPosRanX[0],VPosRanX[1]),
            top:getRangeRandom(VPosRanTopY[0],VPosRanTopY[1])
          },
          rotate:getRotateRandom(),
          isCenter:false
        };

      });

      //取出要在左右两侧的图片状态信息
      for(var i=0, j=imagesArray.length, k= j / 2 ; i<j; i++){
        let hPosRanLORX=null;
        //前半部分布局左边,后半部分布局右边
        if(i<k){
          hPosRanLORX=hPosRanLeftSecx
        }else{
          hPosRanLORX=hPosRanRightSecx
        }
        imagesArray[i]={
          rotate:getRotateRandom(),
          pos:{
          top:getRangeRandom(hPosRanY[0],hPosRanY[1]),
          left:getRangeRandom(hPosRanLORX[0],hPosRanLORX[1])
          },
          isCenter:false
        }
      }

      if(imagesTopArray && imagesTopArray[0]){
        imagesArray.splice(topImgSpliceIndex,0,imagesTopArray[0])
      }
    imagesArray.splice(centerIndex,0,imagesMiddleArray[0]);

    this.setState({
      imagesArray:imagesArray
    })
  }

  /*
  *利用rearRange,居中对应index的图片
  *index需要被居中图片在图片信息状态组里的位置
   */
  centerImage(index){
    this.rearRange(index)
  }

  //getInitialState(){//React.createClass的用法
  //  return {
  //    imagesArray:[
  //      //{
  //      //  pos:{
  //      //    left:0,
  //      //    top:0
  //      //  },
  //      //  rotate:0,
  //      // isInverse:false
  //      //}
  //    ]
  //  }
  //}

  //组件加载以后,为每张图片定位范围
  componentDidMount(){
    //获取dom元素及舞台大小
    let stageDom=ReactDOM.findDOMNode(this.refs.stage),
      stageW=stageDom.scrollWidth,
      stageH=stageDom.scrollHeight,
      halfStageW=Math.ceil( stageW / 2),
      halfStageH=Math.ceil( stageH / 2);
    //获得每张照片的dom及大小
    let imgFigureDom=ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgFigureW=imgFigureDom.scrollWidth,
      imgFigureH=imgFigureDom.scrollHeight,
      halfImgFigureW=Math.ceil( imgFigureW / 2),
      halfImgFigureH=Math.ceil( imgFigureH / 2);

    //居中图片的位置范围
    this.Constant.centerPos={
      left:halfStageW - halfImgFigureW,
      top:halfStageH - halfImgFigureH
    };
    //计算左右两侧图片的位置范围
    this.Constant.hPosRan.leftSecx[0]= -halfImgFigureW;
    this.Constant.hPosRan.leftSecx[1]= halfStageW - halfImgFigureW * 3;
    this.Constant.hPosRan.rightSecx[0]= halfStageW + halfImgFigureW;
    this.Constant.hPosRan.rightSecx[1]= stageW - halfImgFigureW;
    this.Constant.hPosRan.y[0]= -halfImgFigureH;
    this.Constant.hPosRan.y[1]= stageH - halfImgFigureH;

    //计算上侧图片的位置范围
    this.Constant.VPosRan.topY[0]= -halfImgFigureH;
    this.Constant.VPosRan.topY[1]= halfStageH - halfImgFigureH * 3;
    this.Constant.VPosRan.x[0]= halfStageW - imgFigureW;
    this.Constant.VPosRan.x[1]= halfStageW;

    this.rearRange(0);//指定第一张图片居中
  }
  render(){
    let imgFigures=[],
      controllers=[];
    imagesData.forEach(function(value,index){
      if(!this.state.imagesArray[index]){//初始化状态对象
        this.state.imagesArray[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,//旋转角度
          isInverse:false,//控制图片的正反面
          isCenter:false//图片是否居中
        }
      }
      imgFigures.push(<ImgFigure
        key={index}
        index={index}
        data={value}
        ref={'imgFigure'+index}
        position={this.state.imagesArray[index]}
        inverse={this.inverse.bind(this)}
        centerImage={this.centerImage.bind(this)}
      />)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller">
          {controllers}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

//export default AppComponent;
module.exports = AppComponent;
