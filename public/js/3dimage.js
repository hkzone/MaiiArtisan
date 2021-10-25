//jshint esversion:6
// import * as PIXI from "./pixi.min.js";
// import "./unsafe-eval.min.js";
export const render3dImage = (
  id_selector,
  filepath_main,
  filepath_map,
  PIXI
) => {
  let cWidth = window.innerWidth;
  let cHeight = window.innerHeight;
  if (cHeight / cWidth < 0.75) {
    cWidth = Math.trunc(cHeight / 0.75);
  } else if (cHeight / cWidth > 0.75) {
    cHeight = Math.trunc(cWidth * 0.75);
  }
  let app = new PIXI.Application({ width: cWidth, height: cHeight });
  document.body.querySelector(id_selector).appendChild(app.view);
  let img = new PIXI.Sprite.from(filepath_main);
  img.width = cWidth;
  img.height = cHeight;
  app.stage.addChild(img);
  let depthMap = new PIXI.Sprite.from(filepath_map);
  depthMap.width = cWidth;
  depthMap.height = cHeight;
  // depthMap.width = window.innerWidth;
  // depthMap.height = window.innerHeight;
  app.stage.addChild(depthMap);
  let displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
  app.stage.filters = [displacementFilter];
  window.onmousemove = function (e) {
    displacementFilter.scale.x = (window.innerWidth / 2 - e.clientX) / 50;
    displacementFilter.scale.y = (window.innerHeight / 2 - e.clientY) / 30;
  };
};

// render3dImage(".image3d", "./image.jpg", "./image_depth.jpg");
