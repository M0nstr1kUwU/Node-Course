import {io} from 'socket.io-client';

export class NetworkManager{
    constructor(){
        this.socket = null;
        
        this.players = new Map();
        
        this.onPlayerJoined = null;
        this.onPlayerMovement = null;
        this.onPlayerLeave = null;
        
        this.position = null;
        this.rotation = null;
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

