
import * as THREE from 'three';
import {Pane} from '../../node_modules/tweakpane/dist/tweakpane.min.js';
import {LightManager} from '../core/LightManager.js'
import {game} from '../main.js'

export class PaneConstructor{
    constructor(){
        this.pane = new Pane();
    }
     
    createAll(group){

        this._createGroupPosition(group, this.createFolder(`${group.name} Position`));
        this._updateGroupScale(group, this.createFolder(`${group.name} Scale`));
        this._updateGroupTexture(group, this.createFolder(`${group.name} Texture`));
    }

    createFolder(name){
        const folder = this.pane.addFolder({title: name,expanded: false,});
        return folder;
    }

    _createGroupPosition(group, folder){
        const children = group.children[0].position;

        folder.addBinding(children, 'x', {min: -5,max: 5,step: 0.1, label: 'Position X'});
        folder.addBinding(children, 'y', {min: -5,max: 5,step: 0.1, label: 'Position Y'});
        folder.addBinding(children, 'z', {min: -5,max: 5,step: 0.1, label: 'Position Z'});
    }

    _updateGroupScale(group, folder){
        const children = group.children[0].scale;

        folder.addBinding(children, 'x', {min: -5,max: 5,step: 0.1, label: 'Scale X'});
        folder.addBinding(children, 'y', {min: -5,max: 5,step: 0.1, label: 'Scale Y'});
        folder.addBinding(children, 'z', {min: -5,max: 5,step: 0.1, label: 'Scale Z'});
    }

    _updateGroupTexture(group, folder){
        const children = group.children[1].material;

        folder.addBinding(children, 'metalness', {min: 0,max: 1,step: 0.01, label: 'Metalness'});
        folder.addBinding(children, 'roughness', {min: 0,max: 1,step: 0.01, label: 'Roughness'});
        folder.addBinding(children, 'displacementScale', {min: 0,max: 1,step: 0.01, label: 'Height'});

    }
}

