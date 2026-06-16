import {io} from 'socket.io-client';

export class NetworkManager{
    constructor(){
        this.socket = null;
        
        this.players = new Map();
        
        this.onPlayerJoined = null;
        this.onPlayerMovement = null;
        this.onPlayerLeave = null;
        
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0};
    }
    connect(){
        this.socket = io();
        this.socket.on('connect', (socket) => {
            socket.on('join', (socket) => {
                
            });
        });
    }
    
    sendPosition(position, rotation) {
        this.position = position;
        this.position = position;
    }
}

