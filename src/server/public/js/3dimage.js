/* eslint-disable new-cap */
import * as PIXI from 'pixi.js';
import { install } from '@pixi/unsafe-eval';

const render3dImage = (idSelector, filepathMain, filepathMap) => {
  // Apply the patch to PIXI
  install(PIXI);

  // Create the renderer with patch applied
  // eslint-disable-next-line no-unused-vars
  const renderer = new PIXI.Renderer();

  const cWidth = Math.trunc(
    window.innerWidth < 768
      ? Math.max(window.innerWidth / 2.2, window.innerHeight / 2.2)
      : Math.min(window.innerWidth / 2.2, 600)
  );
  const cHeight = cWidth;

  //for 3:2ratio
  // if (cHeight / cWidth < 0.75) {
  //   cWidth = cHeight;
  // } else if (cHeight / cWidth > 0.75) {
  //   cHeight = cWidth;
  // }
  const app = new PIXI.Application({ width: cWidth, height: cHeight });

  document.body.querySelector(idSelector).appendChild(app.view);
  const img = new PIXI.Sprite.from(filepathMain);
  img.width *= cHeight / img.height;
  img.height = cHeight;

  app.stage.addChild(img);

  const depthMap = new PIXI.Sprite.from(filepathMap);
  depthMap.width *= cHeight / depthMap.height;
  depthMap.height = cHeight;

  app.stage.addChild(depthMap);

  const displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
  app.stage.filters = [displacementFilter];

  window.onmousemove = (e) => {
    displacementFilter.scale.x = (cWidth - e.clientX) / 70;
    displacementFilter.scale.y = (cHeight - e.clientY) / 50;
  };
};

export default render3dImage;
