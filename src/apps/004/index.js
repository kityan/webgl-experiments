import { prepareCanvas } from '../../misc/utils'
import getNormals from 'polyline-normals'
import drawThinBorders from './drawThinBorders'
import drawThin from './drawThin'
import drawThick from './drawThick'

const randomInt = (range, min) => {
  let res = Math.floor(Math.random() * range)
  return (min && res < min) ? min : res
}

export default function draw() {

  const gl = prepareCanvas('Click to redraw', draw)

  let data, str

  // что за артефакты?
  // str = '{"path":[[299,879],[376,293],[863,197],[902,7],[836,468],[967,586]],"thickness":35}'
  // str = '{"path":[[555,339],[974,23],[63,826],[29,681],[263,17],[693,560]],"thickness":49}'
  // str = '{"path":[[833,92],[255,478],[686,145],[201,330],[619,709],[33,519]],"thickness":43}'
  // str = '{"path":[[512,771],[483,540],[296,311],[828,291],[494,293],[501,434]],"thickness":25}'
  // str = '{"path":[[482,520],[99,457],[54,340],[72,73],[616,212],[179,107]],"thickness":26}'

  if (str) { data = JSON.parse(str) }

  if (!data) {
    const segmentsQty = 5
    const path = []
    Array(segmentsQty + 1).fill(null).map(() => path.push([randomInt(700), randomInt(700)]))
    const thickness = randomInt(50, 10)
    data = { path, thickness }
    console.log(JSON.stringify(data))
  }


  data.normals = getNormals(data.path, false)

  drawThick(gl, data)
  // drawThinBorders(gl, data)
  drawThin(gl, data)

}