import React from 'react';
import {BoxHelper, Box3, ObjectLoader} from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';
import convert from 'convert-units';
import mtl from './commercialkitchenpack1.mtl'
import obj from './commercialkitchenpack1.obj'
import './ckp1_1_d.png'
import './ckp1_2_d.png'
import './ckp1_3_d.png'
import './ckp1_4_d.png'
import './ckp1_5_d.png'

const width = {length: 120 * 2, unit: 'cm'};
const depth = {length: 30 * 2, unit: 'cm'};
const height = {length: 70 * 2, unit: 'cm'};

let cachedJSONSofa = null;

export default {
    name: 'commercial kitchen',
    prototype: 'items',

    info: {
        title: 'commercial kitchen',
        tag: ['furnishings', 'metal'],
        description: 'Commercial Kitchen',
        image: require('../stove/kitchen.png')
    },

    properties: {},

    render2D: function (element, layer, scene) {
        let angle = element.rotation + 90;
        let textRotation = Math.sin(angle * Math.PI / 180) < 0 ? 180 : 0;

        let style = {stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: '#84e1ce'};
        let arrow_style = {stroke: element.selected ? '#0096fd' : null, strokeWidth: '2px', fill: '#84e1ce'};

        return (
            <g transform={`translate(${-width.length / 2},${-depth.length / 2})`}>
                <rect x="0" y="0" width={width.length} height={depth.length} style={style}/>
                <line x1={width.length / 2} x2={width.length / 2} y1={depth.length} y2={1.5 * depth.length}
                      style={arrow_style}/>
                <line
                    x1={.35 * width.length}
                    x2={width.length / 2}
                    y1={1.2 * depth.length}
                    y2={1.5 * depth.length}
                    style={arrow_style}
                />
                <line
                    x1={width.length / 2}
                    x2={.65 * width.length}
                    y1={1.5 * depth.length}
                    y2={1.2 * depth.length}
                    style={arrow_style}
                />
                <text
                    x="0"
                    y="0"
                    transform={`translate(${width.length / 2}, ${depth.length / 2}) scale(1,-1) rotate(${textRotation})`}
                    style={{textAnchor: 'middle', fontSize: '11px'}}
                >
                    {element.type}
                </text>
            </g>
        );
    },

    render3D: function (element, layer, scene) {

        let onLoadItem = (object) => {

            let newWidth = convert(width.length).from(width.unit).to(scene.unit);
            let newHeight = convert(height.length).from(height.unit).to(scene.unit);
            let newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

            object.scale.set(newWidth / width.length, newHeight / height.length, newDepth / depth.length);

            let box = new BoxHelper(object, 0x99c3fb);
            box.material.linewidth = 2;
            box.material.depthTest = false;
            box.renderOrder = 1000;
            box.visible = element.selected;
            object.add(box);

            object.scale.set(2, 2, 2)
            object.rotateX(-1.5708)

            // Normalize the origin of this item
            const boundingBox = new Box3().setFromObject(object);
            const center = [(boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
                (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
                (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z];
            object.position.x -= center[0];

            return object;
        };

        if (cachedJSONSofa) {
            let loader = new ObjectLoader();
            let object = loader.parse(cachedJSONSofa);
            return Promise.resolve(onLoadItem(object));
        }

        return loadObjWithMaterial(mtl, obj)
            .then(object => {
                cachedJSONSofa = object.toJSON();
                let loader = new ObjectLoader();
                return onLoadItem(loader.parse(cachedJSONSofa))
            });
    },

    updateRender3D: (element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) => {

        let noPerf = () => {
            selfDestroy();
            return selfBuild();
        };

        if (differences.indexOf('selected') !== -1) {
            mesh.traverse((child) => {
                if (child instanceof BoxHelper) {
                    child.visible = element.selected;
                }
            });

            return Promise.resolve(mesh);
        }

        if (differences.indexOf('rotation') !== -1) {
            mesh.rotation.y = element.rotation * Math.PI / 180;
            return Promise.resolve(mesh);
        }

        return noPerf();
    }
};
