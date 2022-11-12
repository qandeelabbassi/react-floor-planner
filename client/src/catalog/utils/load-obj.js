import MTLLoader from './mtl-loader';
import OBJLoader from './obj-loader';
import {LoadingManager} from 'three'
import * as path from 'path-browserify';

export function loadObjWithMaterial(mtlFile, objFile, imgPath) {
    return new Promise((resolve, reject) => {
        let model = null;
        const loadingManager = new LoadingManager((load) => resolve(model));
        let mtlLoader = new MTLLoader(loadingManager);
        mtlLoader.setTexturePath(path.dirname(mtlFile) + "/")
        mtlLoader.load(mtlFile, materials => {
            materials.preload();
            let objLoader = new OBJLoader(loadingManager);
            objLoader.setMaterials(materials);
            objLoader.load(objFile, object => {
                model = object
            });
        });
    });
}

