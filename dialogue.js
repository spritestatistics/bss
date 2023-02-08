//"pre_dialogue",function(){player.addQuest('questName',[['pollen',1000000]],'blackBear');},"post_dialogue",function(){addReward([['honey',1000000]])}

window.dialogue_blackBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='blackBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Black Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hi, I'm Black Bear, and I'm a bear! I give you quests, rewards, and information about the game so you can progress!","Don't skip my dialogue you lazy people, cuz I'm useful and don't blab blab like in the real game!","Here's your first quest:",function(){player.addQuest('Sunflower Start',[['pollenFromSunflowerField',100]],'blackBear');},"Wow! Ya did it! Now here's your rewards:",function(){addReward([['honey',200]])},"With your brand-new honey, go buy a basic egg from the shop near the dandelion field over there!(shop is non-existsent rn ;-;)","Hatch it to get more bees and increase your honey making!","Here's your next quest:",function(){player.addQuest('Dandelion Deed',[['pollenFromDandelionField',200]],'blackBear');},"Great! Now here's more honey and a Royal Jelly! Use the jelly on a basic bee to transform it into a better type of bee!",function(){addReward([['honey',250],['royalJelly',1]])},"Here's another quest:",function(){player.addQuest('Pollen Fetcher',[['pollen',500]],'blackBear');},"Cool! Here's a lot more honey:",function(){addReward([['honey',400]])},"It's time to upgrade your tools! Go into the green shop over there, and buy a new collector or backpack! After you do that, complete this quest:",function(){player.addQuest('Red Request',[['redPollen',500]],'blackBear');},"Cool! Try buying more bee eggs using honey when you can afford them!",function(){addReward([['honey',800],['royalJelly',1]])},"Why not try exploring and talking to other bears while completing this quest?",function(){player.addQuest('Hiding in the Blue',[['bluePollen',900]],'blackBear');},"Awesome! Here's more Royal Jelly and honey!",function(){addReward([['honey',900],['royalJelly',1],['blueberry',1]])},"Remember, keep getting more bees and using Royal Jelly on them. Try to not use Royal Jelly on the transformed bees, and make your basic bees better first!","If you have more than 5 bees already, try going into the 5 bee zone! It has many more flowers, but beware of the monsters! Anyways, here's a new quest:",function(){player.addQuest('Variety Fetcher',[['bluePollen',1000],['redPollen',1000],['whitePollen',1000]],'blackBear');},"Nice! Here's your first special reward, a Silver Egg!",function(){addReward([['honey',1150],['silverEgg',1],['gumdrops',3]])},"You're done with the beginner quests! Now, you can complete questlines to recieve special rewards!","This is the start of the Gold Egg questlines! After 3 more quests, you will recieve a new type of egg, hatching improved bees! Ready for more?",function(){player.addQuest('Bamboo Boogie',[['pollenFromBambooField',2500]],'blackBear');},"Great! Many of the special bees have better stats and abilities! They can boost you pollen collection by large amounts.","Here are your rewards:",function(){addReward([['honey',1250],['royalJelly',1],['treat',1]])},"You have 2 more quest to complete before earning the Gold Egg! Here's the next quest:",function(){player.addQuest('Cobweb Sweeper',[['pollenFromSpiderField',3250]],'blackBear');},"Great job! Keep unlocking more gear and bees!",function(){addReward([['honey',2000],['sunflowerSeed',3],['pineapple',3]])},"Many fields have different colors of flowers, and those give different pollen types. Bees perform better in their own color's field!","Try collecting more red pollen:",function(){player.addQuest('Red Request 2',[['redPollen',4000]],'blackBear');},"Epic! It's good to have a nice with different types of bees to better collect pollen from all the fields!",function(){addReward([['honey',2500],['strawberry',1]])},"There are many rarities of bees, like: common, rare, epic, legendary, and mythic! Legendary and mythic bees are some of the rarest, and only good beekeepers like me own them.","Anyways, it's your last quest until the prized Gold Egg! Get to work!",function(){player.addQuest('Red + Blue = Gold',[['redPollen',6000],['bluePollen',6000]],'blackBear');},"Wow! Not a lot of players are able to get their hands on the Gold Egg, but you're special! Hatch it for an epic bee!",function(){addReward([['honey',4000],['goldEgg',1],['royalJelly',1]])},"It's the start of a new questline: The Diamond Egg!","Remember the special legendary bees I showed you? Hatch one with the Diamond Egg! Complete 7 more quests to discover a new legendary bee!",function(){player.addQuest('Lucky Landscaping',[['pollenFromCloverField',10000]],'blackBear');},"Good job! Here's a lot of honey!",function(){addReward([['honey',7500],['moonCharm',3]])},"While progressing through the game, make sure to keep upgrading your tools and hive!","If you haven't, hatch 10 bees to explore the 10 bee zone. Discover new fields and shops around the map!","Also, remember to complete other bear's quests, too. They may give even better rewards than mine!",function(){player.addQuest('Pineapple Picking',[['pollenFromPineapplePatch',15000]],'blackBear');},"Cool! Keep expanding and improving your hive and gear for more honey!",function(){addReward([['honey',10000],['royalJelly',1],['ticket',1]])},"5 more quests to go until the Diamond Egg! Here's the next one:",function(){player.addQuest('Azure Adventure',[['bluePollen',17500]],'blackBear');},"Good! From now on, the quests will ramp up in difficulty, but the rewards will be worth it!",function(){addReward([['honey',15000],['blueExtract',1]])},'4 more quests until the Diamond Egg!',function(){player.addQuest('Blue Mushrooms',[['pollenFromBlueFlowerField',20000],['pollenFromMushroomField',20000]],'blackBear');},"Great! Was that hard? 3 more quests to the Diamond Egg!",function(){addReward([['honey',30000],['treat',5]])},"Have you been progressing through the game? If so, you should have at least 15 bees by now!","As you get more bees, the fields you get access to have better flowers and give more pollen. But beware! In those fields live dangerous monsters!",function(){player.addQuest('The 15 Bee Zone',[['pollenFromCactusField',25000],['pollenFromPumpkinPatch',25000],['pollenFromPineTreeForest',25000],['pollenFromRoseField',25000]],'blackBear');},"Good job! Those scary monsters stand no chance!",function(){addReward([['honey',50000],['royalJelly',1],['stinger',1]])},"Just 2 more quests until the legendary Diamond Egg!",function(){player.addQuest('Collecting Cliffside',[['pollenFromStrawberryField',40000],['pollenFromSpiderField',40000],['pollenFromBambooField',40000]],'blackBear');},"Noice! Here is some more honey to help you prepare for the next quest!",function(){addReward([['honey',100000],['enzymes',1],['gumdrops',3]])},"Ready for the Diamond Egg? Collect 75,000 pollen of all colors!",function(){player.addQuest('Quest of Legends',[['redPollen',75000],['bluePollen',75000],['whitePollen',75000]],'blackBear');},"Wow! I didn't think you'll make it this far! You are one of the best players in this game!","Here's the legendary Diamond Egg I promised:",function(){addReward([['honey',250000],['diamondEgg',1],['treat',100],['ticket',3]])},"Have you ever heard of gifted bees? They are special versions of bees with better stats!","Having a gifted bee in your hive also applies a special 'Gifted Hive Bonus' that gives you buffs!","They don't stack with multiple gifted bees, but some are very good! It's good to have many different types of gifted bees in your hive.","Now's your chance to earn a gifted bee! If you didn't get lucky and get one, you can transform one with a Star Jelly!","Complete the next 6 quests for my Star Jelly!",function(){player.addQuest('Pink Pineapples',[['redPollen',100000],['pollenFromPineapplePatch',100000]],'blackBear');},"Good! Now the rewards and quests requirements go much higher!",function(){addReward([['honey',300000],['enzymes',1]])},"Ready? 5 more quests until your Star Jelly!",function(){player.addQuest('White As Snow',[['whitePollen',1000000],['pollenFromPumpkinPatch',400000],['pollenFromPineapplePatch',300000],['pollenFromSpiderField',200000],['pollenFromDandelionField',100000]],'blackBear');},"Nice job!",function(){addReward([['honey',500000],['royalJelly',1],['glue',1]])},"How many bees do you have now? Get 25 bees to unlock the 25 bee zone!","4 more quests for the Star Jelly!",function(){player.addQuest('Blinding Sunlight',[['pollenFromMountainTopField',700000],['pollenFromCloverField',400000],['pollenFromSunflowerField',300000]],'blackBear');},"Awesome! The mountain top field gives so much more pollen and has bigger flowers!",function(){addReward([['honey',750000],['oil',1],['treat',50]])},"If you've been in the stump field, you've probably seen the Stump Snail boss!","While your bees try to defeat it, collect 100,000 pollen!",function(){player.addQuest('Solo Stump',[['pollenFromStumpField',200000]],'blackBear');},"Cool! Was it hard to collect pollen without your bee's help?",function(){addReward([['honey',900000],['stinger',1],['ticket',1]])},"As you progress through the game, make sure to use your resources wisely and craft better gear.","2 more quests until I give you my Star Jelly!!!",function(){player.addQuest('Blissfully Blue',[['bluePollen',1250000],['pollenFromPineTreeForest',700000],['pollenFromBambooField',450000],['pollenFromBlueFlowerField',200000]],'blackBear');},"Nice! Here are extra rewards for the last quest in the Star Jelly questlines.",function(){addReward([['honey',1000000],['blueExtract',1],['glitter',1],['royalJelly',1],['blueberry',50]])},
    "After this quest, you'll get the rare Star Jelly!","But beware, this quest is the most difficult yet!",function(){player.addQuest('To My Star',[['whitePollen',4000000],['redPollen',3000000],['pollenFromRoseField',1000000],['pollenFromCactusField',800000],['pollenFromPumpkinPatch',800000],['pollenFromPineapplePatch',600000],['pollenFromStrawberryField',500000]],'blackBear');},"I can't believe you've made it this far! Here's the Star Jelly, as promised:",function(){addReward([['honey',1500000],['starJelly',1],['royalJelly',1],['treat',35],['glitter',1]])},"Next up: The Mythic Egg questline! It rewards the magical Mythic Egg, which will hatch into the rarest, strongest, and most powerful of bees to exist!","The difficulty will reallyyyy start to pick up! You have 12 painful quests to go if you want a mythic bee(assuming you didn't just yet lucky and royal jellied it :/).",function(){player.addQuest('Bamboo Boogie 2: Bamboo Boogaloo',[['pollenFromBambooField',7500000]],'blackBear');},"Ok cool...",function(){addReward([['honey',5000000]])},"11 quests until the Mythic Egg!",function(){player.addQuest('Rocky Red Mountain',[['redPollen',10000000],['pollenFromMountainTopField',4000000],,['pollenFromDandelionField',1000000]],'blackBear');},"Epic! Now that the quests are ramping up, I'll give you better rewards!",function(){addReward([['honey',8000000],['royalJelly',1],['redExtract',1]])},"10 more unbearable quests to go!",function(){player.addQuest("Can't Without Ants",[['pollen',10000000],['pollenFromAntField',1000000]],'blackBear');},"Cool!",function(){addReward([['honey',10000000],['stinger',1]])},"Did you know that this Mythic Egg questline is also the last questline from me? Just 9 more quests until I say goodbye...",function(){player.addQuest('Rare Red Clover',[['pollenFromStrawberryField',6000000],['pollenFromCloverField',5000000],['pollenFromMushroomField',4000000]],'blackBear');},"Awesome! (I really don't know what to say after you complete a quest so I'll continue to shout verbal applauses)",function(){addReward([['honey',12500000],['strawberry',35]])},"As you continue to level up and upgrade your gear, make sure to keep buying now hive slots to expand your hive!","This quest requires pollen from the 35 bee zone!",function(){player.addQuest('Mountain Mix',[['pollenFromMountainTopField',10000000],['pollenFromPepperPatch',9000000],['pollenFromCactusField',7500000],['pollenFromSpiderField',6000000]],'blackBear');},"Terrific!",function(){addReward([['honey',17500000],['royalJelly',3],['coconut',15],['redExtract',1],['blueExtract',1],['gumdrops',5]])},"7 more quests to go!",function(){player.addQuest('Getting Stumped',[['redPollen',15000000],['pollenFromStumpField',5000000]],'blackBear');},"Magnificent!",function(){addReward([['honey',25000000],['sunflowerSeed',50],['stinger',1],['treat',175],['moonCharm',10]])},"6 more quests!",function(){player.addQuest('Da Ba Dee',[['bluePollen',40000000],['pollenFromPineTreeForest',15000000]],'blackBear');},"Amazing!",function(){addReward([['honey',35000000],['blueberry',10],['blueExtract',1]])},"Have you been leveling up your bees? If your bees are low level, you'll have trouble defeating bosses around the map.","Prepare you and your bees for my final quests coming soon! hehe >:D","These final 5 quests are going to be a pain to get through...",function(){player.addQuest('Capsaicin Collector',[['pollenFromPepperPatch',40000000],['pollenFromSpiderField',20000000],,['pollenFromDandelionField',20000000]],'blackBear');},"I can't believe it! You made the quests look so easy!","Here are better rewards:",function(){addReward([['honey',50000000],['redExtract',1],['pineapple',10]])},"Just 4 quests left!",function(){player.addQuest('Smorgasborg',[['pollenFromRoseField',40000000],['pollenFromPineTreeForest',40000000],['pollenFromPineapplePatch',40000000],['pollenFromBambooField',40000000],['pollenFromStrawberryField',40000000],['pollenFromSunflowerField',40000000]],'blackBear');},"Excellent!",function(){addReward([['honey',100000000],['royalJelly',5],['pineapple',75],['tropicalDrink',3]])},"These are the last 3 quests, so prepare for them, cuz they won't be easy :)",function(){player.addQuest('All-Whitey Then',[['whitePollen',250000000],['pollenFromPumpkinPatch',100000000],['pollenFromSpiderField',75000000],['pollenFromDandelionField',30000000]],'blackBear');},"How did you manage do to that??? I made sure to make them impossible!!!","Welp here are your rewards:",function(){addReward([['honey',300000000],['oil',3],['glue',3],['treat',25]])},"This is the second to last quest you'll have to deal with!","Try collecting pollen while being attacked!",function(){player.addQuest('Boss Battles',[['pollenFromStumpField',75000000],['pollenFromCoconutField',50000000],['pollenFromAntField',20000000]],'blackBear');},"Woah! You're so close to the Mythic Egg!","Here is some stuffs to help with the quest!",function(){addReward([['honey',200000000],['stinger',3],['glue',2],['royalJelly',2],['glitter',1],['treat',250]])},"This is it...the final quest. Complete this big task and you'll earn the rare and mysterious Mythic Egg!",function(){player.addQuest('Myth in the Making',[['redPollen',1000000000],['bluePollen',1000000000],['pollenFromSunflowerField',50000000],['pollenFromDandelionField',50000000],['pollenFromMushroomField',50000000],['pollenFromBlueFlowerField',50000000],['pollenFromCloverField',50000000],['pollenFromStrawberryField',50000000],['pollenFromSpiderField',50000000],['pollenFromBambooField',50000000],['pollenFromPineapplePatch',50000000],['pollenFromRoseField',50000000],['pollenFromPineTreeForest',50000000],['pollenFromCactusField',50000000],['pollenFromPumpkinPatch',50000000],['pollenFromMountainTopField',50000000],['pollenFromCoconutField',50000000],['pollenFromPepperPatch',50000000]],'blackBear');},"WOW! YOU DID IT!","Here's the ultimate Mythic Egg!",function(){addReward([['honey',1000000000],['mythicEgg',1],['royalJelly',5],['glitter',1],['glue',1],['treat',1000],['redExtract',1],['blueExtract',1],['enzymes',1],['oil',1]])},"Sadly these is the final few words from Black Bear ;-; Unlike the original game, I won't have more infinite repeatable quests.","You've become such a good beekeeper and progressed so far!","Goodbye, and...","btw there are many subtle refrences to random things like songs and shows in my quest names that you probably missed lol"]
  
}

window.dialogue_polarBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='polarBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Polar Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hey there! You hungry? If you collect the ingredients, I'll cook us up something good.","So good it'll permanently increase the maximum energy of your bees by 5%! I'll even throw in some honey for dessert!","Check the Quest menu to see our next recipe.",

        function(){

            switch((Math.random()*1)|0){

                case 0:

                        player.addQuest('Spiky Stew',[['pollenFromCactusField',100000],['whitePollen',75000]],'polarBear');
                        
                break;
            }
        }

    ,"That's all the ingredients I need! Ok, let me whip something up...","...(chop)...(chop)... ...(sizzle)...","A dash of honey... ...(stir)...","All done! Enjoy!","Well, I'm always ready to eat. I'll be waiting when you're ready for more cooking!",function(){addReward([['honey',100000]])}
    
    ]
}

window.brownBearQuestDifficulty=0

window.dialogue_brownBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='brownBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Brown Bear)')
        }
        
        player.updateInventory()
    }

    let diff=window.brownBearQuestDifficulty++
    
    let rew=[['honey',750+diff*2500]]
    
    if(!diff%2){
        
        rew.push(['royalJelly',1])
    }
    
    if(diff){
        
        if(!diff%3){
            
            rew.push(['treat',3])
        }
        
        if(!diff%4){
            
            rew.push(['ticket',1])
        }
        
        if(!diff%6){
            
            rew.push(['gumdrop',2])
        }
        
        if(!diff%7){
            
            rew.push(['enzymes',1])
        }
        
        if(!diff%8){
            
            rew.push(['oil',1])
        }
        
        if(diff===15){
            
            rew.push(['silverEgg',1])
        }
        
        if(diff===30){
            
            rew.push(['goldEgg',1])
        }
        
        if(diff===50){
            
            rew.push(['diamondEgg',1])
        }
        
        if(!diff%75){
            
            rew.push(['mythicEgg',1])
        }
        
        if(!diff%100){
            
            rew.push(['starEgg',1])
        }
    }
    
    return ["Welcome! Ready for one of my repeatable quests?","I'll give honey and rewards for every quest, but special prizes at certain milestones!","Check your quest menu to see what you need.",

        function(){
            
            let name='',req=[]
            
            let types=['pollenFromSunflowerField','pollenFromDandelionField','pollenFromMushroomField','pollenFromBlueFlowerField','pollenFromCloverField','pollenFromSpiderField','pollenFromStrawberryField','pollenFromBambooField','pollenFromPineapplePatch','pollenFromStumpField','pollenFromCactusField','pollenFromPumpkinPatch','pollenFromPineTreeForest','pollenFromRoseField','pollenFromMountainTopField','pollenFromPepperPatch','pollenFromCoconutField']
            
            if(Math.random()<0.35){
                
                let n=['redPollen','bluePollen','whitePollen'][(Math.random()*3)|0]
                req.push([n,500+diff*2000])
                
                name+=n.replace('Pollen','')+'-'
                
            }
            
            for(let i=0,r=Math.round(Math.random())+2;i<r;i++){
                
                let n=types[(Math.random()*types.length)|0]
                
                types.splice(types.indexOf(n))
                
                req.push([n,500+diff*(i===2?1600:1500)])
                
                n=n.replace('pollenFrom','').replace('Field','').replace('Patch','').replace('Field','').replace('Forest','').toLowerCase()
                
                n={sunflower:'Sunf',dandelion:'Dand',mushroom:'Mush',blueflower:'Bluf',spider:'spi',strawberry:'Straw',bamboo:'Bamb',pineapple:'Pineap',stump:'Stump',cactus:'Cac',pumpkin:'Pump',pinetree:'Pine',rose:'Rose',mountaintop:'Moun',pepper:'Pep',coconut:'Coco'}[n]
                
                name+=n+'-'
            }
            
            player.addQuest(name[name.length-1]==='-'?name.substring(0,name.length-1):name,req,'brownBear')
            
        }

    ,"Great! Here are some rewards!","Come back to me every 5 minutes for a new quest!",function(){addReward(rew)}
    
    ]

}

window.dialogue_roboBear=function(player,items,NPCs){

    return ["Beep boop. I'm Robo Bear!","Talk to me whenever you want to start or learn about the Robo Challenge!",'What do you want to do?',[['Robo Challenge Instructions',function(){NPCs.roboBear.dialogue.push('',"The Robo Challenge is a special questing challenge. To play, you'll a need Robo Pass. At the start, you can select 2 bees to activate and use. The other inactive bees will sleep at the hive.","Then, you can select a quest to complete. You have 3 mins to complete and turn in the quest to me. If you're not happy with the quests given, you can choose to reroll them.","After selecting a quest, you can select an upgrade to help you with challenges. Upgrades can give buffs(or debuffs) to bee attack or pollen, while some can give more rewards like more bees per round.","When the challenge starts, you are given a Robo Challenge debuff, decreasing more pollen and capacity per round. Each round, you need to complete and turn in the quest before the time limit.","While you complete quests, many mobs like Mechquitos and Cogmowers may spawn. They'll try to stop you from completing the challenge. Some quests may require you to defeat them.","After completing and turning in quests, you can get Cogs and Drives, with the amount depending on how fast you complete the quest.","Cogs can be used to buy more quest rerolls and items like drives. There are 4 colors of drives, which can be used to buff your pollen and bee attack depending on which color the drives are.","The challenge ends when you run out of time. You can get many rewards based on how many rounds you completed. You can also get Cog Amulets, which give many permanent buffs to your hive."," Amulet stats are increased based on how many rounds you do. With enough drives, you can also buy a Digital Bee, which is an event bee that can be hatched and used in your hive!","That's it! Have fun!");NPCs.roboBear.dialogueIndex++}],['Start Robo Challenge(1 Robo Pass)',function(){if(items.roboPass.amount){NPCs.roboBear.dialogue.push('','ok *runs function to start robo challenge here idk*');}else{NPCs.roboBear.dialogue.push('','You need a Robo Pass to start the challenge!');}NPCs.roboBear.dialogueIndex++}]]
    
    ]
}
//"pre_dialogue",function(){player.addQuest('questName',[['pollen',1000000]],'blackBear');},"post_dialogue",function(){addReward([['honey',1000000]])}

window.dialogue_blackBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='blackBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Black Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hi, I'm Black Bear, and I'm a bear! I give you quests, rewards, and information about the game so you can progress!","Don't skip my dialogue you lazy people, cuz I'm useful and don't blab blab like in the real game!","Here's your first quest:",function(){player.addQuest('Sunflower Start',[['pollenFromSunflowerField',100]],'blackBear');},"Wow! Ya did it! Now here's your rewards:",function(){addReward([['honey',200]])},"With your brand-new honey, go buy a basic egg from the shop near the dandelion field over there!(shop is non-existsent rn ;-;)","Hatch it to get more bees and increase your honey making!","Here's your next quest:",function(){player.addQuest('Dandelion Deed',[['pollenFromDandelionField',200]],'blackBear');},"Great! Now here's more honey and a Royal Jelly! Use the jelly on a basic bee to transform it into a better type of bee!",function(){addReward([['honey',250],['royalJelly',1]])},"Here's another quest:",function(){player.addQuest('Pollen Fetcher',[['pollen',500]],'blackBear');},"Cool! Here's a lot more honey:",function(){addReward([['honey',400]])},"It's time to upgrade your tools! Go into the green shop over there, and buy a new collector or backpack! After you do that, complete this quest:",function(){player.addQuest('Red Request',[['redPollen',500]],'blackBear');},"Cool! Try buying more bee eggs using honey when you can afford them!",function(){addReward([['honey',800],['royalJelly',1]])},"Why not try exploring and talking to other bears while completing this quest?",function(){player.addQuest('Hiding in the Blue',[['bluePollen',900]],'blackBear');},"Awesome! Here's more Royal Jelly and honey!",function(){addReward([['honey',900],['royalJelly',1],['blueberry',1]])},"Remember, keep getting more bees and using Royal Jelly on them. Try to not use Royal Jelly on the transformed bees, and make your basic bees better first!","If you have more than 5 bees already, try going into the 5 bee zone! It has many more flowers, but beware of the monsters! Anyways, here's a new quest:",function(){player.addQuest('Variety Fetcher',[['bluePollen',1000],['redPollen',1000],['whitePollen',1000]],'blackBear');},"Nice! Here's your first special reward, a Silver Egg!",function(){addReward([['honey',1150],['silverEgg',1]])},"You're done with the beginner quests! Now, you can complete questlines to recieve special rewards!","This is the start of the Gold Egg questlines! After 3 more quests, you will recieve a new type of egg, hatching improved bees! Ready for more?",function(){player.addQuest('Bamboo Boogie',[['pollenFromBambooField',2500]],'blackBear');},"Great! Many of the special bees have better stats and abilities! They can boost you pollen collection by large amounts.","Here are your rewards:",function(){addReward([['honey',1250],['royalJelly',1],['treat',1]])},"You have 2 more quest to complete before earning the Gold Egg! Here's the next quest:",function(){player.addQuest('Cobweb Sweeper',[['pollenFromSpiderField',3250]],'blackBear');},"Great job! Keep unlocking more gear and bees!",function(){addReward([['honey',2000],['sunflowerSeed',3],['pineapple',3]])},"Many fields have different colors of flowers, and those give different pollen types. Bees perform better in their own color's field!","Try collecting more red pollen:",function(){player.addQuest('Red Request 2',[['redPollen',4000]],'blackBear');},"Epic! It's good to have a nice with different types of bees to better collect pollen from all the fields!",function(){addReward([['honey',2500],['strawberry',1]])},"There are many rarities of bees, like: common, rare, epic, legendary, and mythic! Legendary and mythic bees are some of the rarest, and only good beekeepers like me own them.","Anyways, it's your last quest until the prized Gold Egg! Get to work!",function(){player.addQuest('Red + Blue = Gold',[['redPollen',6000],['bluePollen',6000]],'blackBear');},"Wow! Not a lot of players are able to get their hands on the Gold Egg, but you're special! Hatch it for an epic bee!",function(){addReward([['honey',4000],['goldEgg',1],['royalJelly',1]])},"It's the start of a new questline: The Diamond Egg!","Remember the special legendary bees I showed you? Hatch one with the Diamond Egg! Complete 7 more quests to discover a new legendary bee!",function(){player.addQuest('Lucky Landscaping',[['pollenFromCloverField',10000]],'blackBear');},"Good job! Here's a lot of honey!",function(){addReward([['honey',7500],['moonCharm',3]])},"While progressing through the game, make sure to keep upgrading your tools and hive!","If you haven't, hatch 10 bees to explore the 10 bee zone. Discover new fields and shops around the map!","Also, remember to complete other bear's quests, too. They may give even better rewards than mine!",function(){player.addQuest('Pineapple Picking',[['pollenFromPineapplePatch',15000]],'blackBear');},"Cool! Keep expanding and improving your hive and gear for more honey!",function(){addReward([['honey',10000],['royalJelly',1],['pineapple',10]])},"5 more quests to go until the Diamond Egg! Here's the next one:",function(){player.addQuest('Azure Adventure',[['bluePollen',17500]],'blackBear');},"Good! From now on, the quests will ramp up in difficulty, but the rewards will be worth it!",function(){addReward([['honey',15000],['blueExtract',1]])},'4 more quests until the Diamond Egg!',function(){player.addQuest('Blue Mushrooms',[['pollenFromBlueFlowerField',20000],['pollenFromMushroomField',20000]],'blackBear');},"Great! Was that hard? 3 more quests to the Diamond Egg!",function(){addReward([['honey',30000],['treat',5]])},"Have you been progressing through the game? If so, you should have at least 15 bees by now!","As you get more bees, the fields you get access to have better flowers and give more pollen. But beware! In those fields live dangerous monsters!",function(){player.addQuest('The 15 Bee Zone',[['pollenFromCactusField',25000],['pollenFromPumpkinPatch',25000],['pollenFromPineTreeForest',25000],['pollenFromRoseField',25000]],'blackBear');},"Good job! Those scary monsters stand no chance!",function(){addReward([['honey',50000],['royalJelly',1],['stinger',1],['pineapple',15]])},"Just 2 more quests until the legendary Diamond Egg!",function(){player.addQuest('Collecting Cliffside',[['pollenFromStrawberryField',40000],['pollenFromSpiderField',40000],['pollenFromBambooField',40000]],'blackBear');},"Noice! Here is some more honey to help you prepare for the next quest!",function(){addReward([['honey',100000],['enzymes',1]])},"Ready for the Diamond Egg? Collect 75,000 pollen of all colors!",function(){player.addQuest('Quest of Legends',[['redPollen',75000],['bluePollen',75000],['whitePollen',75000]],'blackBear');},"Wow! I didn't think you'll make it this far! You are one of the best players in this game!","Here's the legendary Diamond Egg I promised:",function(){addReward([['honey',250000],['diamondEgg',1],['treat',100]])},"Have you ever heard of gifted bees? They are special versions of bees with better stats!","Having a gifted bee in your hive also applies a special 'Gifted Hive Bonus' that gives you buffs!","They don't stack with multiple gifted bees, but some are very good! It's good to have many different types of gifted bees in your hive.","Now's your chance to earn a gifted bee! If you didn't get lucky and get one, you can transform one with a Star Jelly!","Complete the next 6 quests for my Star Jelly!",function(){player.addQuest('Pink Pineapples',[['redPollen',100000],['pollenFromPineapplePatch',100000]],'blackBear');},"Good! Now the rewards and quests requirements go much higher!",function(){addReward([['honey',300000],['enzymes',1]])},"Ready? 5 more quests until your Star Jelly!",function(){player.addQuest('White As Snow',[['whitePollen',1000000],['pollenFromPumpkinPatch',400000],['pollenFromPineapplePatch',300000],['pollenFromSpiderField',200000],['pollenFromDandelionField',100000]],'blackBear');},"Nice job!",function(){addReward([['honey',500000],['royalJelly',1],['glue',1]])},"How many bees do you have now? Get 25 bees to unlock the 25 bee zone!","4 more quests for the Star Jelly!",function(){player.addQuest('Blinding Sunlight',[['pollenFromMountainTopField',700000],['pollenFromCloverField',400000],['pollenFromSunflowerField',300000]],'blackBear');},"Awesome! The mountain top field gives so much more pollen and has bigger flowers!",function(){addReward([['honey',750000],['oil',1],['treat',50]])},"If you've been in the stump field, you've probably seen the Stump Snail boss!","While your bees try to defeat it, collect 100,000 pollen!",function(){player.addQuest('Solo Stump',[['pollenFromStumpField',200000]],'blackBear');},"Cool! Was it hard to collect pollen without your bee's help?",function(){addReward([['honey',900000],['stinger',1]])},"As you progress through the game, make sure to use your resources wisely and craft better gear.","2 more quests until I give you my Star Jelly!!!",function(){player.addQuest('Blissfully Blue',[['bluePollen',1250000],['pollenFromPineTreeForest',700000],['pollenFromBambooField',450000],['pollenFromBlueFlowerField',200000]],'blackBear');},"Nice! Here are extra rewards for the last quest in the Star Jelly questlines.",function(){addReward([['honey',1000000],['blueExtract',1],['glitter',1],['royalJelly',1],['blueberry',50]])},"After this quest, you'll get the rare Star Jelly!","But beware, this quest is the most difficult yet!",function(){player.addQuest('To My Star',[['whitePollen',4000000],['redPollen',3000000],['pollenFromRoseField',1000000],['pollenFromCactusField',800000],['pollenFromPumpkinPatch',800000],['pollenFromPineapplePatch',600000],['pollenFromStrawberryField',500000]],'blackBear');},"I can't believe you've made it this far! Here's the Star Jelly, as promised:",function(){addReward([['honey',1500000],['starJelly',1],['royalJelly',1],['treat',35],['glitter',1]])},"Next up: The Mythic Egg questline! It rewards the magical Mythic Egg, which will hatch into the rarest, strongest, and most powerful of bees to exist!","The difficulty will reallyyyy start to pick up! You have 12 painful quests to go if you want a mythic bee(assuming you didn't just yet lucky and royal jellied it :/).",function(){player.addQuest('Bamboo Boogie 2: Bamboo Boogaloo',[['pollenFromBambooField',7500000]],'blackBear');},"Ok cool...",function(){addReward([['honey',5000000]])},"11 quests until the Mythic Egg!",function(){player.addQuest('Rocky Red Mountain',[['redPollen',10000000],['pollenFromMountainTopField',4000000],,['pollenFromDandelionField',1000000]],'blackBear');},"Epic! Now that the quests are ramping up, I'll give you better rewards!",function(){addReward([['honey',8000000],['royalJelly',1],['redExtract',1]])},"10 more unbearable quests to go!",function(){player.addQuest("Can't Without Ants",[['pollen',10000000],['pollenFromAntField',1000000]],'blackBear');},"Cool!",function(){addReward([['honey',10000000],['stinger',1]])},"Did you know that this Mythic Egg questline is also the last questline from me? Just 9 more quests until I say goodbye...",function(){player.addQuest('Rare Red Clover',[['pollenFromStrawberryField',6000000],['pollenFromCloverField',5000000],['pollenFromMushroomField',4000000]],'blackBear');},"Awesome! (I really don't know what to say after you complete a quest so I'll continue to shout verbal applauses)",function(){addReward([['honey',12500000],['strawberry',35]])},"As you continue to level up and upgrade your gear, make sure to keep buying now hive slots to expand your hive!","This quest requires pollen from the 35 bee zone!",function(){player.addQuest('Mountain Mix',[['pollenFromMountainTopField',10000000],['pollenFromPepperPatch',9000000],['pollenFromCactusField',7500000],['pollenFromSpiderField',6000000]],'blackBear');},"Terrific!",function(){addReward([['honey',17500000],['royalJelly',3],['coconut',15],['redExtract',1],['blueExtract',1]])},"7 more quests to go!",function(){player.addQuest('Getting Stumped',[['redPollen',15000000],['pollenFromStumpField',5000000]],'blackBear');},"Magnificent!",function(){addReward([['honey',25000000],['sunflowerSeed',50],['stinger',1],['treat',175],['moonCharm',10]])},"6 more quests!",function(){player.addQuest('Da Ba Dee',[['bluePollen',40000000],['pollenFromPineTreeForest',15000000]],'blackBear');},"Amazing!",function(){addReward([['honey',35000000],['blueberry',10],['blueExtract',1]])},"Have you been leveling up your bees? If your bees are low level, you'll have trouble defeating bosses around the map.","Prepare you and your bees for my final quests coming soon! hehe >:D","These final 5 quests are going to be a pain to get through...",function(){player.addQuest('Capsaicin Collector',[['pollenFromPepperPatch',40000000],['pollenFromSpiderField',20000000],,['pollenFromDandelionField',20000000]],'blackBear');},"I can't believe it! You made the quests look so easy!","Here are better rewards:",function(){addReward([['honey',50000000],['redExtract',1]])},"Just 4 quests left!",function(){player.addQuest('Smorgasborg',[['pollenFromRoseField',40000000],['pollenFromPineTreeForest',40000000],['pollenFromPineapplePatch',40000000],['pollenFromBambooField',40000000],['pollenFromStrawberryField',40000000],['pollenFromSunflowerField',40000000]],'blackBear');},"Excellent!",function(){addReward([['honey',100000000],['royalJelly',5],['pineapple',75],['tropicalDrink',3]])},"These are the last 3 quests, so prepare for them, cuz they won't be easy :)",function(){player.addQuest('All-Whitey Then',[['whitePollen',250000000],['pollenFromPumpkinPatch',100000000],['pollenFromSpiderField',75000000],['pollenFromDandelionField',30000000]],'blackBear');},"How did you manage do to that??? I made sure to make them impossible!!!","Welp here are your rewards:",function(){addReward([['honey',300000000],['oil',3],['glue',3],['treat',25]])},"This is the second to last quest you'll have to deal with!","Try collecting pollen while being attacked!",function(){player.addQuest('Boss Battles',[['pollenFromStumpField',75000000],['pollenFromCoconutField',50000000],['pollenFromAntField',20000000]],'blackBear');},"Woah! You're so close to the Mythic Egg!","Here is some stuffs to help with the quest!",function(){addReward([['honey',200000000],['stinger',3],['glue',2],['royalJelly',2],['glitter',1],['treat',250]])},"This is it...the final quest. Complete this big task and you'll earn the rare and mysterious Mythic Egg!",function(){player.addQuest('Myth in the Making',[['redPollen',1000000000],['bluePollen',1000000000],['pollenFromSunflowerField',50000000],['pollenFromDandelionField',50000000],['pollenFromMushroomField',50000000],['pollenFromBlueFlowerField',50000000],['pollenFromCloverField',50000000],['pollenFromStrawberryField',50000000],['pollenFromSpiderField',50000000],['pollenFromBambooField',50000000],['pollenFromPineapplePatch',50000000],['pollenFromRoseField',50000000],['pollenFromPineTreeForest',50000000],['pollenFromCactusField',50000000],['pollenFromPumpkinPatch',50000000],['pollenFromMountainTopField',50000000],['pollenFromCoconutField',50000000],['pollenFromPepperPatch',50000000]],'blackBear');},"WOW! YOU DID IT!","Here's the ultimate Mythic Egg!",function(){addReward([['honey',1000000000],['mythicEgg',1],['royalJelly',5],['glitter',1],['glue',1],['treat',1000],['redExtract',1],['blueExtract',1],['enzymes',1],['oil',1]])},"Sadly these is the final few words from Black Bear ;-; Unlike the original game, I won't have more infinite repeatable quests.","You've become such a good beekeeper and progressed so far!","Goodbye, and...","btw there are many subtle refrences to random things like songs and shows in my quest names that you probably missed lol"]
  
}

window.dialogue_polarBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='polarBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Polar Bear)')
        }
        
        player.updateInventory()
    }

    return ["Hey there! You hungry? If you collect the ingredients, I'll cook us up something good.","So good it'll permanently increase the maximum energy of your bees by 5%! I'll even throw in some honey for dessert!","Check the Quest menu to see our next recipe.",

        function(){

            switch((Math.random()*1)|0){

                case 0:

                        player.addQuest('Spiky Stew',[['pollenFromCactusField',100000],['whitePollen',75000]],'polarBear');
                        
                break;
            }
        }

    ,"That's all the ingredients I need! Ok, let me whip something up...","...(chop)...(chop)... ...(sizzle)...","A dash of honey... ...(stir)...","All done! Enjoy!","Well, I'm always ready to eat. I'll be waiting when you're ready for more cooking!",function(){addReward([['honey',100000]])}
    
    ]
}

window.brownBearQuestDifficulty=0

window.dialogue_brownBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='brownBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Brown Bear)')
        }
        
        player.updateInventory()
    }

    let diff=window.brownBearQuestDifficulty++
    
    let rew=[['honey',750+diff*2500]]
    
    if(!diff%2){
        
        rew.push(['royalJelly',1])
    }
    
    if(diff){
        
        if(!diff%3){
            
            rew.push(['treat',3])
        }
        
        if(!diff%4){
            
            rew.push(['ticket',1])
        }
        
        if(!diff%6){
            
            rew.push(['gumdrop',2])
        }
        
        if(!diff%7){
            
            rew.push(['enzymes',1])
        }
        
        if(!diff%8){
            
            rew.push(['oil',1])
        }
        
        if(diff===15){
            
            rew.push(['silverEgg',1])
        }
        
        if(diff===30){
            
            rew.push(['goldEgg',1])
        }
        
        if(diff===50){
            
            rew.push(['diamondEgg',1])
        }
        
        if(!diff%75){
            
            rew.push(['mythicEgg',1])
        }
        
        if(!diff%100){
            
            rew.push(['starEgg',1])
        }
    }
    
    return ["Welcome! Ready for one of my repeatable quests?","I'll give honey and rewards for every quest, but special prizes at certain milestones!","Check your quest menu to see what you need.",

        function(){
            
            let name='',req=[]
            
            let types=['pollenFromSunflowerField','pollenFromDandelionField','pollenFromMushroomField','pollenFromBlueFlowerField','pollenFromCloverField','pollenFromSpiderField','pollenFromStrawberryField','pollenFromBambooField','pollenFromPineapplePatch','pollenFromStumpField','pollenFromCactusField','pollenFromPumpkinPatch','pollenFromPineTreeForest','pollenFromRoseField','pollenFromMountainTopField','pollenFromPepperPatch','pollenFromCoconutField']
            
            if(Math.random()<0.35){
                
                let n=['redPollen','bluePollen','whitePollen'][(Math.random()*3)|0]
                req.push([n,500+diff*2000])
                
                name+=n.replace('Pollen','')+'-'
                
            }
            
            for(let i=0,r=Math.round(Math.random())+2;i<r;i++){
                
                let n=types[(Math.random()*types.length)|0]
                
                types.splice(types.indexOf(n))
                
                req.push([n,500+diff*(i===2?1600:1500)])
                
                n=n.replace('pollenFrom','').replace('Field','').replace('Patch','').replace('Field','').replace('Forest','').toLowerCase()
                
                n={sunflower:'Sunf',dandelion:'Dand',mushroom:'Mush',blueflower:'Bluf',spider:'spi',strawberry:'Straw',bamboo:'Bamb',pineapple:'Pineap',stump:'Stump',cactus:'Cac',pumpkin:'Pump',pinetree:'Pine',rose:'Rose',mountaintop:'Moun',pepper:'Pep',coconut:'Coco'}[n]
                
                name+=n+'-'
            }
            
            player.addQuest(name[name.length-1]==='-'?name.substring(0,name.length-1):name,req,'brownBear')
            
        }

    ,"Great! Here are some rewards!","Come back to me every 5 minutes for a new quest!",function(){addReward(rew)}
    
    ]

}

window.dialogue_roboBear=function(player,items,NPCs){

    return ["Beep boop. I'm Robo Bear!","Talk to me whenever you want to start or learn about the Robo Challenge!",'What do you want to do?',[['Robo Challenge Instructions',function(){NPCs.roboBear.dialogue.push('',"The Robo Challenge is a special questing challenge. To play, you'll a need Robo Pass. At the start, you can select 2 bees to activate and use. The other inactive bees will sleep at the hive.","Then, you can select a quest to complete. You have 3 mins to complete and turn in the quest to me. If you're not happy with the quests given, you can choose to reroll them.","After selecting a quest, you can select an upgrade to help you with challenges. Upgrades can give buffs(or debuffs) to bee attack or pollen, while some can give more rewards like more bees per round.","When the challenge starts, you are given a Robo Challenge debuff, decreasing more pollen and capacity per round. Each round, you need to complete and turn in the quest before the time limit.","While you complete quests, many mobs like Mechquitos and Cogmowers may spawn. They'll try to stop you from completing the challenge. Some quests may require you to defeat them.","After completing and turning in quests, you can get Cogs and Drives, with the amount depending on how fast you complete the quest.","Cogs can be used to buy more quest rerolls and items like drives. There are 4 colors of drives, which can be used to buff your pollen and bee attack depending on which color the drives are.","The challenge ends when you run out of time. You can get many rewards based on how many rounds you completed. You can also get Cog Amulets, which give many permanent buffs to your hive."," Amulet stats are increased based on how many rounds you do. With enough drives, you can also buy a Digital Bee, which is an event bee that can be hatched and used in your hive!","That's it! Have fun!");NPCs.roboBear.dialogueIndex++}],['Start Robo Challenge(1 Robo Pass)',function(){if(items.roboPass.amount){NPCs.roboBear.dialogue.push('','ok *runs function to start robo challenge here idk*');}else{NPCs.roboBear.dialogue.push('','You need a Robo Pass to start the challenge!');}NPCs.roboBear.dialogueIndex++}]]
    
    ]
}

window.dialogue_dddatt=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='blackBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Dat)')
        }
        
        player.updateInventory()
    }
    
    // return ["Hi! I'm Dat, the creator of this awesome game!","This NPC was supposed to be Onett, the creator of the original game, but I didn't think that was cool so I replaced it with the best WebGL game developer alive!","Onett gives 5 hard quests, the Star Journey questline, rewarding a Star Treat at the end. A Star Treat can be used to make any bee gifted.","I'll do the same, but I'll rename the quest names to something better.","So here's the first quest:",function(){player.addQuest('wip',[['pollen',1000000]],'dddatt');},"wip",function(){addReward([['honey',1000000]])},'bye']

    return ["here",function(){player.addQuest('*very* specific quest requirements',[['hasteTokens',1],['redExtract',1],['goo',1],['flames',8],['bubbles',8],['fallingCoconuts',1],['fireAnt',1],['itemsUsingTheBlender',1],['timesUsingTheRedCannon',1],['tokensFromSprouts',10],['tokensFromPlanters',5],['hoursOfInvigoratingNectar',1]],'blackBear');},"a",function(){addReward([['honey',1000000]])},'bye']
  
}

window.dialogue_pandaBear=function(player,items){
    
    let addCommas=(s)=>{for(let i=s.length-3;i>0;i-=3){s=s.substring(0,i)+','+s.substr(i,s.length)}return s},doGrammar=(s)=>{let str=s.slice(),_s='';for(let i in str){if(str[i].toUpperCase()===str[i]){_s=_s+' '+str[i]}else{_s=_s+str[i]}}return _s[0].toUpperCase()+_s.substring(1,_s.length)},addReward=(arr)=>{
        
        for(let i in player.quests){
            
            if(player.quests[i].NPC==='pandaBear') player.quests.splice(i,1)
            
        }
        
        for(let i in arr){
            
            if(arr[i][0]==='honey'){
                
                player.honey+=arr[i][1]
                
            } else {
                
                items[arr[i][0]].amount+=arr[i][1]
            }
            
            player.addMessage('+'+addCommas(arr[i][1]+'')+' '+doGrammar(arr[i][0])+' (from Panda Bear)')
        }
        
        player.updateInventory()
    }
    
    //"pre_dialogue",function(){player.addQuest('questName',[['req',1]],'pandaBear');},"post_dialogue",function(){addReward([['honey',300]])}

    return ["Poof! I'm panda bear!","I stay safe in this dAnEGrOuS mountain by learning to defeat the evil creatures!","I'll show you how to do the same with your bees by giving you quests. I'll give you rewards like treats and some rare items.","After you complete my training, you'll be rewarded with a special Star Treat! It makes any bee gifted when you feed it, and is very good!","Here's the start of your training!",function(){player.addQuest('Ladybug Learning',[['ladybug',1]],'pandaBear');},"Cool! As you go through my questline, you'll need to defeat lots of monsters and learn how to properly fight bugs!",function(){addReward([['honey',300]])},"Whenever you defeat a mob, it'll respawn within a couple minutes. Ladybugs and rhino beetles respawn every 3 minutes, but spiders respawn every 10 minutes!","However, mobs won't respawn when you're in their field. They'll wait for you to leave then wake up.","As you complete my quests, I'll tell you more info about the creatures here. Here's another quest:",function(){player.addQuest('8 Legged Dreams',[['spider',1]],'pandaBear');},"Did you have trouble defeating the spider?(and more importantly realize the cool song refrence)?","Here are your rewards:",function(){addReward([['honey',400],['treat',5]])},"As you progress and unlock more zones, you'll see higher level mobs.","Your bees may miss their attack when the mob's level is higher than their's.","That's why it's important to level up your bees. You can use the treats I give you or go through Mother Bear's quests about bee bonding.","Here's another quest:",function(){player.addQuest('Rhino Rumble',[['rhinoBeetle',3]],'pandaBear');},"Nice! I'll keep giving you some stuffs for bee leveing:",function(){addReward([['honey',500],['blueberry',3]])},"Another good tool for defeating monsters are...stingers!","You can use them to boost your bee's attack for 45 seconds!","There are quite rare though. You can often get them from defeating Rogue Vicous Bees hiding in fields, but they are quite powerful.","Instead, you can also get them from me, since I have lots!","Get started!!!",function(){player.addQuest('Stinger Stumble',[['rhinoBeetle',2],['ladybug',2]],'pandaBear');},"Awesome! Rememeber, be wise with your items! You might need them later on, so it's best to save them for when you need them.",function(){addReward([['honey',750],['royalJelly',1],['stinger',3],['strawberry',3],['blueberry',3]])},"Have you unlocked the 10 bee zone? You'll need to have 10 bees in your hive to enter.","In the pineapple patch, you'll find the dangerous mantis you need to defeat for this quest:",function(){player.addQuest('Preying Mantis',[['mantis',1]],'pandaBear');},"Good! Was it hard?",function(){addReward([['honey',1000],['treat',10]])},"Keep going through these quests to hatch and level up your bees!",function(){player.addQuest('Spider Spawner',[['spider',1],['ladybug',3],['rhinoBeetle',3]],'pandaBear');},"Great!",function(){addReward([['honey',1250],['treat',20],['sunflowerSeed',5],['ticket',1],['royalJelly',1]])},"If you haven't, now is a good time to buy the Helmet from the Noob Shop.","It improves pollen collection, and your defense!","With a higher defense percentage, you'll take less damage from mob hits.","Try doing this quest:",function(){player.addQuest('Rhino Rumble 2, U',[['rhinoBeetle',5]],'pandaBear');},"Cool!",function(){addReward([['honey',1500],['treat',20],['pineapple',5],['royalJelly',1]])},"Here's another quest to help you get ready. I'll give good reward to help you unlock the 15 bee zone!",function(){player.addQuest('Peaceful Place',[['ladybug',6]],'pandaBear');},"Great! Get ready for the next quest!",function(){addReward([['honey',1800],['stinger',1],['treat',25],['gumdrops',3],['moonCharm',3]])},"Now, defeat the scary werewolf in the 15 bee zone!",function(){player.addQuest('Weirdwolf',[['werewolf',1]],'pandaBear');},"Amazing! Here are extra rewards:",function(){addReward([['honey',2000],['moonCharm',3],['gumdrops',3],['ticket',2],['royalJelly',1]])},"Great! Level up your bees to defeat creatures in new zones faster!","Here's the next quest:",function(){player.addQuest('Rainbow Connection',[['scorpion',2],['mantis',2],['ladybug',4],['rhinoBeetle',4]],'pandaBear');},"Awesome",function(){addReward([['honey',2150],['redExtract',1],['blueExtract',1],['gumdrops',5],['ticket',2]])},"Keep expanding your hive! Soon you'll reach the 20 bee zone, where I like to have lots of fun!","Meanwhile, do another quest:",function(){player.addQuest('Bug Exterminator',[['ladybug',3],['rhinoBeetle',3],['spider',1],['mantis',1]],'pandaBear');},"Great!",function(){addReward([['honey',2350],['oil',1],['treat',30]])}]
  
}





