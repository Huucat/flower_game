(function(){
    var Flower = window.Flower = function(){
        this.fwObj = new createjs.Container();
        this.flowerObj = new createjs.Container();
        this.waterObj = new createjs.Container();
        this.fwObj.addChild(this.flowerObj , this.waterObj);
        this.fw = [];
        this.wt = [];
        this.growTime = 15;
        this.state = true;
        this.time_2 = [0,0,0,0,0,0,0,0,0];
        this.waterNum = 20;
        this.waterData = new createjs.SpriteSheet({
            "images": [game.assets.images.water_2],
            "frames": {"width": 100 , "height": 150, "regX": 50, "regY": 100 , "count": 12},
            "animations": {
                "wt":[0,12, ,0.5]
            }
        });
        var self = this;
        for(let i = 0 ;i < game.playerObj.flowerpot.length ; i++){
            this.fw[i] = new createjs.Bitmap();
            this.fw[i].regX = 50;
            this.fw[i].regY = 100;
            this.fw[i].scale = 0.6;
            this.fw[i].x = game.flowerpot.fp[i].x;
            this.fw[i].y = game.flowerpot.fp[i].y - 35;
            this.flowerObj.addChild(this.fw[i]);
            if(game.playerObj.flowerpot[i].water){
                this.wt[i] = new createjs.Sprite(this.waterData,"wt");
                this.wt[i].x = this.fw[i].x;
                this.wt[i].y = this.fw[i].y + 20;
                this.waterObj.addChild(this.wt[i]);
                // this.time_2[i] = parseInt((game.nowtime - game.playerObj.flowerpot[i].watertime) / 1000);
            }
            if(game.playerObj.flowerpot[i].watertime <= 0){
                this.time_2[i] = 0;
            }
        }
    }

    Flower.prototype.update = function(){
        var self = this;
        for(let i = 0 ;i < game.playerObj.flowerpot.length ; i++){
            if(parseInt((game.nowtime - game.playerObj.flowerpot[i].watertime)/1000) >= this.waterNum  && game.playerObj.flowerpot[i].water && game.playerObj.flowerpot[i].have && game.playerObj.flowerpot[i].watertime != 0){
                let time_1 = game.playerObj.flowerpot[i].time
                let time2 = parseInt((game.nowtime - game.playerObj.flowerpot[i].watertime) / 1000) / 10;
                game.playerData.child('flowerpot/' + i).update({
                    time : time_1 + time2,
                    water : 0
                });
                this.time_2[i] = 0;
                this.waterObj.removeChild(this.wt[i]);
            }
            if(parseInt((game.nowtime - game.playerObj.flowerpot[i].watertime)/1000) < this.waterNum && game.playerObj.flowerpot[i].have){
                this.time_2[i] = parseInt((game.nowtime - game.playerObj.flowerpot[i].watertime) / 1000);
            }
            if(game.playerObj.flowerpot[i].have){
                if(game.playerObj.flowerpot[i].time * 10 + this.time_2[i] > this.growTime){
                    this.fw[i].image = game.assets.images["flower_" + game.gameObj.plantData[game.playerObj.flowerpot[i].id].name + "_5"];
                }else if(game.playerObj.flowerpot[i].time * 10 + this.time_2[i] > this.growTime / 5 * 4){
                    this.fw[i].image = game.assets.images["flower_" + game.gameObj.plantData[game.playerObj.flowerpot[i].id].name + "_4"];
                }else if(game.playerObj.flowerpot[i].time * 10 + this.time_2[i] > this.growTime / 5 * 3){
                    this.fw[i].image = game.assets.images["flower_" + game.gameObj.plantData[game.playerObj.flowerpot[i].id].name + "_3"];
                }else if(game.playerObj.flowerpot[i].time * 10 + this.time_2[i] > this.growTime / 5 * 2){
                    this.fw[i].image = game.assets.images["flower_" + game.gameObj.plantData[game.playerObj.flowerpot[i].id].name + "_2"];
                }else if(game.playerObj.flowerpot[i].time * 10 + this.time_2[i] > this.growTime / 5){
                    this.fw[i].image = game.assets.images["flower_" + game.gameObj.plantData[game.playerObj.flowerpot[i].id].name + "_1"];
                }else if(game.playerObj.flowerpot[i].time * 10 + this.time_2[i] <= this.growTime / 5){
                    this.fw[i].image = game.assets.images.flower_seed;
                }
            }
        }
    }

    Flower.prototype.watering = function(i){
        console.log(i);
        var self = this;
        if(this.state == true){
            //浇水
            this.state = false;
            game.playerData.child('flowerpot/' + i).update({
                water : 1,
                watertime : game.nowtime,
            },function() {
                game.sounds.playSound_1("water");
                self.wt[i] = new createjs.Sprite(self.waterData,"wt");
                self.wt[i].x = self.fw[i].x;
                self.wt[i].y = self.fw[i].y + 20;
                self.waterObj.addChild(self.wt[i]);
                self.state = true;
            });
        }
    }

    Flower.prototype.harvest = function(i){
        var self = this;
        var plantId = game.playerObj.flowerpot[i].id;
        var plantExp = game.gameObj.plantData[plantId].exp;
        var addNumber;

        Math.random() < 0.05 ? addNumber = 2 : addNumber = 1;
        
        if(game.playerObj.flowerpot[i].have && game.playerObj.flowerpot[i].time * 10 + this.time_2[i] > this.growTime && this.state == true){
            this.state = false;
            game.playerObj.flowerpot[i].have = 0;
            game.playerObj.flowerpot[i].time = 0;
            game.playerObj.flowerpot[i].water = 0;
            game.playerObj.flowerpot[i].watertime = 0;
            game.playerObj.flowerpot[i].id = -1;
            if(game.playerObj.depository == undefined){
                game.playerObj.depository = {
                    exchange : [{
                        id : plantId,
                        num : addNumber
                    }]
                }
                this.expUp(plantExp);
                game.playerData.set(game.playerObj ,function(){
                    game.sounds.playSound_1("get");
                    removeFlower(i);
                });
            }else if(game.playerObj.depository.exchange == undefined){
                game.playerObj.depository.exchange = [{
                    id : plantId,
                    num : addNumber
                }];
                this.expUp(plantExp);
                game.playerData.set(game.playerObj ,function(){
                    game.sounds.playSound_1("get");
                    removeFlower(i);
                });
            }else{
                for(let n = 0 ; n < game.playerObj.depository.exchange.length ; n++){
                    if(game.playerObj.depository.exchange[n].id == plantId){
                        game.playerObj.depository.exchange[n].num += addNumber;
                        this.expUp(plantExp);
                        game.playerData.set(game.playerObj , function(){
                            game.sounds.playSound_1("get");
                            removeFlower(i);
                        });
                        return;
                    }
                }
                game.playerObj.depository.exchange.push({
                    id : plantId,
                    num : addNumber
                });
                this.expUp(plantExp);
                game.playerData.set(game.playerObj , function(){
                    game.sounds.playSound_1("get");
                    removeFlower(i);
                });
            }
        }
        function removeFlower(i){
            self.waterObj.removeChild(self.wt[i]);
            self.fw[i].image = null;
            self.time_2[i] = 0;
            self.state = true;
        }
    }

    Flower.prototype.expUp = function(exp){
        if(game.playerObj.level < 10){
            game.playerObj.exp += exp;
            while(game.playerObj.exp >= game.gameObj.levelData[game.playerObj.level - 1]){
                if(game.sounds.sound_2.paused == true){
                    game.sounds.playSound_2("levelup");
                }
                game.playerObj.exp -= game.gameObj.levelData[game.playerObj.level - 1];
                game.playerObj.level += 1;
                if(game.playerObj.level >= 10){
                    game.player.playerDataBg.image = game.assets.images.player_bg_10;
                    game.playerObj.exp = 0;
                }else{
                    game.player.playerDataBg.image = game.assets.images["player_bg_" + game.playerObj.level];
                }
            }
        }
    }

    Flower.prototype.bindEvent = function(name){
        var self = this;
        switch(name){
            case "water":
                for (let i = 0 ; i < game.playerObj.flowerpot.length ; i++) {
                    this.fw[i].addEventListener("click",function(){
                        if(game.playerObj.flowerpot[i].have && !game.playerObj.flowerpot[i].water){
                            self.watering(i);
                        }
                    });
                }
            break;
            case "harvest":
                    for (let i = 0 ; i < game.playerObj.flowerpot.length ; i++) {
                        this.fw[i].addEventListener("click",function(){
                            self.harvest(i);
                        });
                    }
            break;
        }
    }

    Flower.prototype.removeEvent = function(){
        for (let i = 0 ; i < game.playerObj.flowerpot.length ; i++) {
            this.fw[i].removeAllEventListeners();
        }
    }
})()