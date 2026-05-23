import * as THREE from 'three';
import {Pane} from '../../node_modules/tweakpane/dist/tweakpane.min.js';
import {LightManager} from '../core/LightManager.js'
import {game} from '../main.js'

export class PaneConstructor{
    constructor(){
        this.pane = new Pane();
        //this.lightManager = game.lightManager;
    }

    createAll(group){
        this._createGroupPosition(group);
        this._updateGroupScale(group);
        //this._updateLighting();
    }

    _createGroupPosition(group){
        const folder = this.pane.addFolder({
            title: 'Position',
            expanded: false,
            });

        const children = group.children[0].position;

        folder.addBinding(children, 'x', {min: -5,max: 5,step: 0.1, label: 'Position X'});
        folder.addBinding(children, 'y', {min: -5,max: 5,step: 0.1, label: 'Position Y'});
        folder.addBinding(children, 'z', {min: -5,max: 5,step: 0.1, label: 'Position Z'});
    }

    _updateLighting(){
        const main_light = this.lightManager.lights.main;
        console.log(main_light);
        //this.pane.addBinding(main_light, 'x', {min: -5,max: 5,step: 0.1});
    }

    _updateGroupScale(group){
        const children = group.children[0].scale;

        this.pane.addBinding(children, 'x', {min: -5,max: 5,step: 0.1, label: 'Scale X'});
        this.pane.addBinding(children, 'y', {min: -5,max: 5,step: 0.1, label: 'Scale Y'});
        this.pane.addBinding(children, 'z', {min: -5,max: 5,step: 0.1, label: 'Scale Z'});
    }
}

