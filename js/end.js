/*

    let endState = {
        create: function(){},
        update: function(){},
        ---------------------------- end of phaser functions
    };

*/

endState = {

    create: function(){

        // Background
        game.add.image(0, 0, 'bgimage');
        
        //Clouds
        game.add.image(300, 100, 'cloud');
        game.add.image(660, 80, 'cloud');
        game.add.image(110, 85, 'cloud').scale.setTo(0.8);
                
        //Floor
        for(let i=0;i<9;i++){
            game.add.image(i*100, 501, 'floor');
        }
        
        // Progress bar
        for(let p=1;p<=5;p++){
            let block = game.add.image(660+(p-1)*30, 10, 'block');
            block.scale.setTo(2, 1); //Scaling to double width
        }
        game.add.text(820, 10, '100%', textStyles.subtitle3);
        game.add.text(650, 10, lang.difficulty + ' ' + levelDifficulty, textStyles.subtitle3).anchor.setTo(1,0);
        game.add.image(660, 10, 'pgbar');
        
        //School and trees
        game.add.sprite(600, 222 , 'school').scale.setTo(0.7);
        game.add.sprite(30, 280 , 'tree4');
        game.add.sprite(360, 250 , 'tree2');
        
        if(currentGameState == 'gameCircleOne'){
            //kid
            this.kid = game.add.sprite(0, -152 , 'kid_run');

            this.kid.anchor.setTo(0.5,0.5);
            this.kid.scale.setTo(0.7);
            this.kid.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11]);
            //globo
            this.balloon = game.add.sprite(0, -260, 'balloon');
            this.balloon.anchor.setTo(0.5,0.5);
            this.basket = game.add.sprite(0, -150, 'balloon_basket');
            this.basket.anchor.setTo(0.5,0.5);
        }else{
            //kid
            this.kid = game.add.sprite(0, 460 , 'kid_run');
            
            this.kid.anchor.setTo(0.5,0.5);
            this.kid.scale.setTo(0.7);
            this.kid.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11]);

            this.kid.animations.play('walk', 6, true);
        }

    },

    update: function(){

        if(currentGameState == 'gameCircleOne'){
            
            if(this.kid.y>=460){
                this.kid.animations.play('walk', 6, true);
                if(this.kid.x<=700){
                    this.kid.x += 2;
                }else{
                    passedLevels = 0;
                    game.state.start('menu');
                }
            }else{
                this.balloon.y += 2;
                this.basket.y += 2;
                this.kid.y +=2;
                this.balloon.x += 1;
                this.basket.x += 1;
                this.kid.x +=1;
            }

        }else{    
                    
            if(this.kid.x <= 700){
                this.kid.x += 2;
            }else{
                passedLevels = 0;
                game.state.start('menu');
            }
        }

    },

}