//jshint esversion:6
// import * as PIXI from "./pixi.min.js";
// import "./unsafe-eval.min.js";
export const render3dImage = (
  id_selector,
  filepath_main,
  filepath_map,
  PIXI
) => {
  let cWidth = Math.trunc(
    window.innerWidth < 768
      ? Math.max(window.innerWidth / 2.2, window.innerHeight / 2.2)
      : Math.min(window.innerWidth / 2.2, 600)
  );
  let cHeight = cWidth;

  //for 3:2ratio
  // if (cHeight / cWidth < 0.75) {
  //   cWidth = cHeight;
  // } else if (cHeight / cWidth > 0.75) {
  //   cHeight = cWidth;
  // }
  let app = new PIXI.Application({ width: cWidth, height: cHeight });

  document.body.querySelector(id_selector).appendChild(app.view);
  let img = new PIXI.Sprite.from(filepath_main);
  img.width = (cHeight / img.height) * img.width;
  img.height = cHeight;
  // img.x = cWidth / 2 - img.width / 2;
  app.stage.addChild(img);

  let depthMap = new PIXI.Sprite.from(filepath_map);
  depthMap.width = (cHeight / depthMap.height) * depthMap.width;
  depthMap.height = cHeight;
  // depthMap.x = cWidth / 2 - depthMap.width / 2;
  app.stage.addChild(depthMap);

  let displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
  app.stage.filters = [displacementFilter];

  window.onmousemove = function (e) {
    displacementFilter.scale.x = (cWidth - e.clientX) / 70;
    displacementFilter.scale.y = (cHeight - e.clientY) / 50;
  };
};

// render3dImage(".image3d", "./image.jpg", "./image_depth.jpg");
