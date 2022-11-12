import React from 'react';
import './Planner.css';
import ContainerDimensions from 'react-container-dimensions';
import MyCatalog from '../../catalog/mycatalog';

import {
    ReactPlanner,
    Plugins as PlannerPlugins,
} from 'react-planner'; //react-planner


let plugins = [
    PlannerPlugins.Keyboard(),
    PlannerPlugins.Autosave('react-planner_v0'),
    PlannerPlugins.ConsoleDebugger(),
];

let toolbarButtons = [];

function Planner() {
    return (
        <div className="App">
            <ContainerDimensions>
                {({width, height}) =>
                    <ReactPlanner
                        catalog={MyCatalog}
                        width={width}
                        height={height}
                        plugins={plugins}
                        toolbarButtons={toolbarButtons}
                        stateExtractor={state => state.get('react-planner')}
                    />
                }
            </ContainerDimensions>
        </div>
    );
}

export default Planner;
