import {Catalog} from '../react-planner';
import * as Areas from './areas/**/planner-element.jsx';
import * as Lines from './lines/**/planner-element.jsx';
import * as Holes from './holes/**/planner-element.jsx';
import * as Items from './items/**/planner-element.jsx';

let catalog = new Catalog();

for (let x in Areas) catalog.registerElement(Areas[x]);
for (let x in Lines) catalog.registerElement(Lines[x]);
for (let x in Holes) catalog.registerElement(Holes[x]);
for (let x in Items) catalog.registerElement(Items[x]);

catalog.registerCategory('walls', 'Walls', [Lines.wall, Holes.gate, Items.column, Items.columnSquare]);
catalog.registerCategory('kitchen', 'Kitchen', [Items.stove, Items.fridge, Items.commercialKitchen]);

const others = [];
for (let item in Items)
    others.push(Items[item])
for (let item in Holes)
    others.push(Holes[item]);
for (let item in Areas)
    others.push(Areas[item])
for (let item in Lines)
    others.push(Lines[item]);
catalog.registerCategory('others', 'Others', others);

export default catalog;
