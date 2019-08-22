(function(){
    var Manager = window.Manager = function(){
        game.background = new Background();
        game.flowerpot = new Flowerpot();
        game.flower = new Flower();
        game.gameicon = new Gameicon();
        game.depository = new Depository();
        game.shop = new Shop();
        game.settings = new Settings();
        game.illustrate = new Illustrate();
        this.managerNum = 1;
        this.nowManager = new createjs.Text("","15px UDDigiKyokashoN","").set({
            x : 10,
            y : 10
        });
        this.money = new createjs.Text(game.playerObj.money,"15px UDDigiKyokashoN","").set({
            x : 10,
            y : 30
        });
        game.stage.addChild(game.background.bgObj , game.flowerpot.fpObj , game.flower.fwObj , game.gameicon.iconObj , game.settings.settingsObj , game.depository.depositoryObj , game.shop.shopObj , game.illustrate.illustrateObj ,this.nowManager , this.money);
        this.enter(1);
    }
    
    Manager.prototype.enter = function(number){
        var self = this;
        self.managerNum = number;
        game.flowerpot.removeEvent();
        game.flower.removeEvent();
        switch (this.managerNum) {
            case 1:

            break;
            case 2:
                game.depository.open();
            break;
                case 2.5:
                    game.flowerpot.addArrow();
                break;
            case 3:
                game.flowerpot.bindEvent("water");
                game.flower.bindEvent("water");
            break;
            case 4:
                game.flower.bindEvent("harvest");
            break;
            case 5:
                game.shop.open();
            break;
            case 6:
                game.illustrate.open();
            break;
        }
    }

    Manager.prototype.update = function(){
        this.nowManager.text = this.managerNum;
        this.money.text = game.playerObj.money;
        switch (this.managerNum) {
            case 1:
                game.flower.update();
                game.settings.update();
            break;
            case 2:
                game.flower.update();
                game.depository.update();
                // game.settings.update();
                // game.gameicon.rotate();
            break;
                case 2.5:
                    game.flower.update();
                    game.flowerpot.arrowMove();
                break;
            case 3:
                game.flower.update();
                game.settings.update();
                game.gameicon.rotate();
            break;
            case 4:
                game.flower.update();
                game.settings.update();
                game.gameicon.rotate();
            break;
            case 5:
                game.flower.update();
                game.shop.update();
            break;
            case 6:
                game.flower.update();
                game.settings.update();
                game.illustrate.update();
            break;
        }
    }
})()