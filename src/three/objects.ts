import * as THREE from 'three';

const HALL_SIZE_X = 100;
const HALL_SIZE_Y = 100;
const HEMISPHERELIGHT_INTENSITY = 0.4;

export const makeRandom = (scale: number = 1) => scale * (Math.random() - Math.random());

export const makeBreathing = (
  mesh: THREE.Mesh, startScale: number, endScale: number, interval: number,
) => {
  const seg = (endScale - startScale) / (interval * 10);
  window.setInterval((() => {
    let scale = startScale + (endScale - startScale) * Math.random();
    let direction = 1;
    return () => {
      if (scale > endScale) {
        direction = -direction;
      } else if (scale < startScale) {
        direction = -direction;
      }
      scale += (seg * direction);
      mesh.scale.set(scale, scale, scale);
    };
  })(), 100);
};

export const makeFloor = () => {
  const floorGeometry = new THREE.PlaneBufferGeometry(HALL_SIZE_X, HALL_SIZE_Y);
  floorGeometry.rotateX((-Math.PI) / 2);

  const floorMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color('#7D3F9B'),
    // color: new THREE.Color('#2D2889'),
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.castShadow = true;
  floor.position.set(0, -2, 0);
  floor.name = 'floorMesh';

  return floor;
};

export const makeLights = () => {
  const lights: THREE.Light[] = [];

  const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, HEMISPHERELIGHT_INTENSITY);
  hemisphereLight.position.set(0, 10, 0);
  lights.push(hemisphereLight);

  const directionLight = new THREE.DirectionalLight(0xeeeeff, 0.5);
  directionLight.position.set(600, 400, 200);
  lights.push(directionLight);

  return lights;
};

export const makeBreathingBall = (radius: number, position: THREE.Vector3) => {
  const smallGeometry = new THREE.SphereGeometry(radius, 16, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  material.transparent = true;
  material.opacity = 0.3;

  const smallBall = new THREE.Mesh(smallGeometry, material);
  smallBall.position.set(position.x, position.y, position.z);

  const middleGeometry = new THREE.SphereGeometry(radius, 16, 16);
  const middleBall = new THREE.Mesh(middleGeometry, material);
  middleBall.position.set(position.x, position.y, position.z);
  makeBreathing(middleBall, 1.1, 2, 1);

  const bigGeometry = new THREE.SphereGeometry(radius, 16, 16);
  const bigBall = new THREE.Mesh(bigGeometry, material);
  bigBall.position.set(position.x, position.y, position.z);
  makeBreathing(bigBall, 2.1, 3, 1);

  const ball = new THREE.Object3D();
  ball.add(smallBall);
  ball.add(middleBall);
  ball.add(bigBall);

  return ball;
};

export const makeWords = (text: string, font: opentype.Font, position: THREE.Vector3) => {
  const path = font.getPath(text, 0, 0, 1);
  const threePath = new THREE.ShapePath();
  path.commands.forEach((command) => {
    switch (command.type) {
      case 'M':
        threePath.moveTo(command.x, command.y);
        break;
      case 'L':
        threePath.lineTo(command.x, command.y);
        break;
      case 'Q':
        threePath.quadraticCurveTo(command.x1, command.y1, command.x, command.y);
        break;
      case 'C':
        threePath.bezierCurveTo(
          command.x1, command.y1,
          command.x2, command.y2,
          command.x, command.y,
        );
        break;
      case 'Z':
        // threePath.closePath();
        break;
      default:
        break;
    }
  });
  const shapes = threePath.toShapes(true, false);
  const object = new THREE.Object3D();
  shapes.forEach((shape) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xccccff,
      side: THREE.DoubleSide,
    });
    material.blending = THREE.CustomBlending;
    material.blendEquation = THREE.AddEquation;
    material.blendSrc = THREE.SrcColorFactor;
    material.blendDst = THREE.DstAlphaFactor;
    const geometry = new THREE.ShapeGeometry(shape);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.3, 0.3, 0.3);
    mesh.rotateX(Math.PI);
    mesh.position.set(position.x, position.y, position.z);
    // object.position.set(-2.2, 0.7, 2.7);
    object.add(mesh);
  });
  return object;
};
