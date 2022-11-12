In order to add a 3D model with `.OBJ` format in the catalog, following files are required:

- file_name.obj (object file)
- file_name.mtl (material file)
- feature.jpg (a feature image of your model that's used in catalog gallery)

Besides these files, if your `.mtl` file has reference to any textures then you would need them as well (without textures the model might appear in plain white color). Please note that the app is only tested with `.png/.jpg/.jpeg` texture formats. So if your model textures are in different format then convert them to supported formats first (don't forget to update references in .mtl file as well).

Once you have above-mentioned files you can proceed to next steps.


## 1. Import Model files

Go to [items directory in catalog](../../catalog/items) and create a new folder with any suitable name (i.e. hood). Paste your `.obj` `.mtl` and feature/texture files in the folder. Here's an example for Hood model:

```
.
|-- items
|   |-- hood
|   |   |-- hood.obj
|   |   |-- hood.mtl
|   |   |-- hood_texture.png
|   |   `-- hood_feature.png
```

<b>NOTE:</b> If names of any `.png/.jpg/.jpeg` files inside your model folder clash with existing files in other sub-folders of `items` directory then you would encounter an error when you try to run/build the app. In that case, please change the name of the conflicting files and edit references of textures in `.mtl` if needed.  


## 2. Create a .jsx file to render model in 2D/3D Scene

Create a `planner-element.jsx` inside your model directory. This file will hold the rendering logic of your model. This is how your model folder should look like after adding this file:

```
.
|-- items
|   |-- hood
|   |   |-- hood.obj
|   |   |-- hood.mtl
|   |   |-- hood_texture.png
|   |   `-- hood_feature.png
|   |   `-- planner-element.jsx
```
and here's an example code:

```es6
import React from 'react';
import {BoxHelper, Box3, ObjectLoader} from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';
import convert from 'convert-units';
import './hood_texture.png'; // if multiple textures then import all of them

const mtl = require('./hood.mtl');
const obj = require('./hood.obj');

// width, depth, height determines the size of your object in 2D mode
const width = {length: 220, unit: 'cm'};
const depth = {length: 60, unit: 'cm'};
const height = {length: 70, unit: 'cm'};

let cachedJSONHood = null;

export default {
    name: 'hood',
    prototype: 'items',

    info: {
        title: 'hood',
        tag: ['furnishings', 'leather'],
        description: 'Leather hood',
        image: require('./hood_feature.png')
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

            // Normalize the origin of this item
            let boundingBox = new Box3().setFromObject(object);

            let center = [
                (boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
                (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
                (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z];

            object.position.x -= center[0];
            object.position.y -= center[1] - (boundingBox.max.y - boundingBox.min.y) / 2;
            object.position.z -= center[2];

            return object;
        };

        if (cachedJSONHood) {
            let loader = new ObjectLoader();
            let object = loader.parse(cachedJSONHood);
            return Promise.resolve(onLoadItem(object));
        }

        return loadObjWithMaterial(mtl, obj)
            .then(object => {
                cachedJSONHood = object.toJSON();
                let loader = new ObjectLoader();
                return onLoadItem(loader.parse(cachedJSONHood))
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
```

### Element:

| Property Name | Type      | Value   | Possible Values               | Optional  |
| ------------- |:---------:|:-------:|:-----------------------------:|:---------:|
| name          | String    | 'cube'  | any                           |           |
| prototype     | String    | 'items' | 'items' or 'lines' or 'holes' |           |
| info          | Object    | ...     | ...                           |           |
| properties    | Object    | ...     | ...                           |           |
| render2D      | Function  | ...     | ...                           |           |
| render3D      | Function  | ...     | ...                           |           |
| updateRender3D| Function  | ...     | ...                           |      x    |

### Element's Info:

| Property Name | Type   | Value    | Description                             |
| ------------- |:------:|:--------:|:---------------------------------------:|
| title         | String | 'cube'   | Catalog's tile title                    |
| tag           | Array  | ['demo'] | Catalog's tile tags description         |
| description   | String | 'Demo item'  | Catalog's tile description          |
| image         | String | require('./cube.png')  | Catalog's tile image url  |

### Element's Properties:

You can specify any prevoiusly registered Catalog's Property. For register a property you should call the *Catalog.registerPropertyType* function.
> See [Create a Property](HOW_TO_CREATE_A_PROPERTY.md)

### Element's render2D:

This function take as input parameteres ( element, layer, scene ) and need to return a jsx representation of an svg tag

### Element's render3D:

This function take as input parameteres ( element, layer, scene ) and need to return a Promise containing a [Three.js Mesh](https://threejs.org/docs/#api/objects/Mesh)

### Element's updateRender3D:

This function take as input parameteres ( element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild ) and need to return a Promise containing a [Three.js Mesh](https://threejs.org/docs/#api/objects/Mesh). Usually after an Element variation it will be destroyed and recreated. This is a common use while you're manipulating not so complex Elements. You can bypass this approach and specify the Element's updateRender3D function allowing to directly modify the Mesh instead destroying it.
> For an example you can look at *updateRender3D in WallFactory*


## 3. Add model element to the catalog:

See [Create a Catalog](HOW_TO_CREATE_A_CATALOG.md) guide for more details.


