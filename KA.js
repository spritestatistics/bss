var _M=Math

function main(){

let audio_ctx=new AudioContext(),soundCache={}

function dataURItoBlob(dataURI) {
	
	let byteString=atob(dataURI.split(',')[1]),
	    mimeString=dataURI.split(',')[0].split(':')[1].split(';')[0],
	    ab=new ArrayBuffer(byteString.length),
	    ia=new Uint8Array(ab)
	
	for(let i=0;i<byteString.length;i++){
        
        ia[i]=byteString.charCodeAt(i)
	}
	
	return new Blob([ab],{type:mimeString})
}

function resample(sourceAudioBuffer,desiredSampleRate,resolve){
    
	let offlineCtx=new OfflineAudioContext(sourceAudioBuffer.numberOfChannels,sourceAudioBuffer.duration*desiredSampleRate,desiredSampleRate),
	cloneBuffer=offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels,sourceAudioBuffer.length,sourceAudioBuffer.sampleRate)
	
	for(let channel=0;channel<sourceAudioBuffer.numberOfChannels;channel++){
	   
        cloneBuffer.copyToChannel(sourceAudioBuffer.getChannelData(channel),channel)
	}
	
	let source=offlineCtx.createBufferSource()
	
	source.buffer=cloneBuffer
	source.connect(offlineCtx.destination)
	
	offlineCtx.oncomplete=e=>resolve(e.renderedBuffer)
	offlineCtx.startRendering()
	
	source.start(0)
}

function playSound(sound,vol) {

    //SOUND IS DISABLED
    return
	
	let src=window['music_'+sound]
	
	let SAMPLE_RATE=16000
	
	if(!soundCache['blob_'+sound]){
	    
	    soundCache['blob_'+sound]=dataURItoBlob(src)
	}
	
	let audioBufferPromise=new Promise(resolve=>soundCache['blob_'+sound].arrayBuffer().then(arrBuffer=>audio_ctx.decodeAudioData(arrBuffer,resolve)))
	
	audioBufferPromise.then(buffer=>new Promise(resolve=>soundCache['resampled_'+sound]||(function(){soundCache['resampled_'+sound]=resample(buffer,SAMPLE_RATE,resolve);return soundCache['resampled_'+sound]})())).then(buffer=>{
	    
		let phase=200,skipLength=5.25,freq=1/(phase*MATH.TWO_PI)
		
		if(!soundCache['channelData_'+sound]){
		    
		    soundCache['channelData_'+sound]=buffer.getChannelData(0)
		}
		
		let channelData=soundCache['channelData_'+sound]
		
		let pcm=new Float32Array(SAMPLE_RATE*phase*2)
		
		let numSeconds=channelData.length/SAMPLE_RATE

		let gain=audio_ctx.createGain()
		gain.connect(audio_ctx.destination)
	    
		gain.gain.value=vol
		
		for (let i=0,j=0;i<numSeconds;i+=skipLength,j++){
		    
			let start=SAMPLE_RATE*i,end=SAMPLE_RATE*(i+phase)
            
			pcm.set(channelData.subarray(start|0,end|0),SAMPLE_RATE*phase)
			
			if(!soundCache['wave'+j+'_'+sound]){
			    
				let waveShaper=audio_ctx.createWaveShaper()
				let oscA=audio_ctx.createOscillator()
				
				oscA.connect(waveShaper)
    			waveShaper.connect(gain)
				
				waveShaper.curve=pcm
				
				soundCache['wave'+j+'_'+sound]=waveShaper
				
				oscA.frequency.value=freq
				
				oscA.start(i+audio_ctx.currentTime)
				oscA.stop(i+skipLength+audio_ctx.currentTime)
				soundCache['osc'+j+'_'+sound]=oscA
				
			} else {
			    
			    soundCache['osc'+j+'_'+sound].disconnect(soundCache['wave'+j+'_'+sound])
			    
				let oscA=audio_ctx.createOscillator()
				
				oscA.connect(soundCache['wave'+j+'_'+sound])
				
				oscA.frequency.value=freq
				
				oscA.start(i+audio_ctx.currentTime)
				oscA.stop(i+skipLength+audio_ctx.currentTime)
				soundCache['osc'+j+'_'+sound]=oscA
			}
		}
	})
}

let Math=_M,GIFTED_BEE_TEXTURE_OFFSET=768/2048

let width=window.thisProgramIsInFullScreen?500:window.innerWidth+1,height=window.thisProgramIsInFullScreen?500:window.innerHeight+1,half_width=width*0.5,half_height=height*0.5,aspect=width/height,FETCHED_CODE={},beeCanvas,UPDATE_FLOWER_MESH=true

let glCanvas=document.getElementById('gl-canvas')
let gl=glCanvas.getContext('webgl2',{antialias:true})

let uiCanvas=document.getElementById('ui-canvas')
let ctx=uiCanvas.getContext('2d')

let texCanvas=document.getElementById('tex-canvas')
let tex_ctx=texCanvas.getContext('2d',{willReadFrequently:true})

if(!gl){
    
    alert('WebGL2 is not supported on your brower')
    return
}

glCanvas.width=width
glCanvas.height=height
uiCanvas.width=width
uiCanvas.height=height

gl.canvas.width=width
gl.canvas.height=height

gl.viewport(0,0,width,height)

window.onresize=()=>{
    
    width=window.thisProgramIsInFullScreen?500:window.innerWidth+1
    height=window.thisProgramIsInFullScreen?500:window.innerHeight+1
    
    glCanvas.width=width
    glCanvas.height=height
    uiCanvas.width=width
    uiCanvas.height=height
    
    gl.canvas.width=width
    gl.canvas.height=height
    
    gl.viewport(0,0,width,height)
    
    half_width=width*0.5
    half_height=height*0.5
    aspect=width/height
    
    player.setProjectionMatrix(player.fov,aspect,0.1,500)
    
    staticGeometryProgram=createProgram('static_geometry_vsh','static_geometry_fsh')
    dynamicGeometryProgram=createProgram('dynamic_geometry_vsh','dynamic_geometry_fsh')
    tokenGeometryProgram=createProgram('token_geometry_vsh','token_geometry_fsh')
    flowerGeometryProgram=createProgram('flower_geometry_vsh','flower_geometry_fsh')
    beeGeometryProgram=createProgram('bee_geometry_vsh','bee_geometry_fsh')
    particleRendererProgram=createProgram('particle_renderer_vsh','particle_renderer_fsh')
    explosionRendererProgram=createProgram('explosion_renderer_vsh','explosion_renderer_fsh')
    textRendererProgram=createProgram('text_renderer_vsh','text_renderer_fsh')
    mobRendererProgram=createProgram('mob_renderer_vsh','mob_renderer_fsh')
    trailRendererProgram=createProgram('trail_renderer_vsh','trail_renderer_fsh')

    glCache=initGlCache({})
    
    gl.useProgram(staticGeometryProgram)
    gl.uniform1f(glCache.static_isNight,player.isNight)
    gl.useProgram(dynamicGeometryProgram)
    gl.uniform1f(glCache.dynamic_isNight,player.isNight)
    gl.useProgram(tokenGeometryProgram)
    gl.uniform1f(glCache.token_isNight,player.isNight)
    gl.useProgram(flowerGeometryProgram)
    gl.uniform1f(glCache.flower_isNight,player.isNight)
    gl.useProgram(beeGeometryProgram)
    gl.uniform1f(glCache.bee_isNight,player.isNight)
    gl.useProgram(mobRendererProgram)
    gl.uniform1f(glCache.mob_isNight,player.isNight)
    gl.useProgram(trailRendererProgram)
    gl.uniform1f(glCache.trail_isNight,player.isNight)
}

document.getElementById('runFullScreen').addEventListener('click',function(){

    let w=window.open()
    w.document.open()
    w.document.write('<!doctype html><html>'+document.querySelector('html').innerHTML.replace('var _M=Math','var _M=Math;window.thisProgramIsInFullScreen=true'))
    w.document.close()
})

let PLAYER_PHYSICS_GROUP=2,STATIC_PHYSICS_GROUP=4,BEE_COLLECT=0,BEE_FLY=0,then,dt,frameCount=0,TIME=0,player,honeyMarkConvert=TIME,NIGHT_DARKNESS=0.6,NPCs

gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)

gl.enable(gl.DEPTH_TEST)
gl.depthFunc(gl.LEQUAL)
gl.enable(gl.CULL_FACE)
gl.cullFace(gl.BACK)

let blenderRecipes=[
    
    {item:'gumdrops',req:[['pineapple',2],['strawberry',2],['blueberry',2]]},
    {item:'moonCharm',req:[['royalJelly',2],['pineapple',3],['gumdrops',3]]},
    {item:'redExtract',req:[['strawberry',35],['royalJelly',5]]},
    {item:'blueExtract',req:[['blueberry',35],['royalJelly',5]]},
    {item:'enzymes',req:[['pineapple',35],['royalJelly',5]]},
    {item:'oil',req:[['sunflowerSeed',35],['royalJelly',5]]},
    {item:'glue',req:[['gumdrops',35],['royalJelly',5]]},
    {item:'tropicalDrink',req:[['coconut',5],['oil',1],['enzymes',1]]},
    {item:'glitter',req:[['moonCharm',20],['magicBean',1]]},
    {item:'starJelly',req:[['royalJelly',75],['glitter',3]]},
    {item:'purplePotion',req:[['neonberry',3],['redExtract',2],['blueExtract',2],['glue',2]]},
    {item:'superSmoothie',req:[['neonberry',3],['starJelly',1],['purplePotion',1],['tropicalDrink',3]]},
    {item:'fieldDice',req:[['softWax',1],['whirligig',1],['redExtract',1],['blueExtract',1]]},
    {item:'smoothDice',req:[['fieldDice',2],['whirligig',2],['softWax',2],['oil',2]]},
    {item:'loadedDice',req:[['smoothDice',2],['hardWax',1],['oil',2],['glue',1]]},
    {item:'softWax',req:[['honeysuckle',5],['oil',1],['enzymes',1],['royalJelly',5]]},
    {item:'hardWax',req:[['softWax',2],['enzymes',2],['bitterberry',5],['royalJelly',25]]},
    {item:'swirledWax',req:[['hardWax',1],['softWax',2],['purplePotion',1],['royalJelly',75]]},
    {item:'causticWax',req:[['hardWax',3],['neonberry',5],['gumdrops',10],['royalJelly',175]]},
    {item:'turpentine',req:[['superSmoothie',3],['causticWax',3],['starJelly',5],['honeysuckle',50]]},

]

let passiveActivationPopup=document.getElementById('passiveActivationPopup')
let pollenAmount=document.getElementById('pollenAmount')
let honeyAmount=document.getElementById('honeyAmount')
let pollenAmount2=document.getElementById('pollenAmount2')
let honeyAmount2=document.getElementById('honeyAmount2')
let healthBar=document.getElementById('healthBar')
let capacityBar=document.getElementById('capacityBar')
let inventoryButton=document.getElementById('inventoryButton')
let questButton=document.getElementById('questButton')
let beesButton=document.getElementById('beesButton')
let settingsButton=document.getElementById('settingsButton')
let beequipButton=document.getElementById('beequipButton')
let pages=document.getElementsByClassName('uiPage')
let currentPage=null
let hotbarSlots=document.getElementsByClassName('hotbarSlot')
let autoHotbarButtons=document.getElementsByClassName('autoHotbarButton')

let _code=pages[0].innerHTML

let _svgs=_code.split('<svg id="'),itemSVGCode={}

_svgs.shift()

for(let i in _svgs){
    
    let name=_svgs[i].substr(0,_svgs[i].indexOf('"'))
    
    _svgs[i]='<svg id="'+_svgs[i]

    itemSVGCode[name+'_description']=_svgs[i].split('<text')

    for(let j in itemSVGCode[name+'_description']){

        itemSVGCode[name+'_description'][j]=itemSVGCode[name+'_description'][j].substring(itemSVGCode[name+'_description'][j].indexOf('>')+1,itemSVGCode[name+'_description'][j].indexOf('<'))
    }

    itemSVGCode[name+'_description'].shift()
    itemSVGCode[name+'_description'].shift()
    itemSVGCode[name+'_description']=itemSVGCode[name+'_description'].join(' ')
    
    itemSVGCode[name]=_svgs[i].split('</text>')
    itemSVGCode[name]='<svg style="transform:translate(0px,7px);width:150px;height:36px;"><g transform="scale(0.77,0.77) translate(0,-5)"><text x="70" y="45" stroke="rgb(0,0,0)" stroke-width="3" style="font-family:cursive;font-size:20px;">AMOUNTOFITEMREQUIREDTOCRAFT</text><text x="70" y="45" fill="TEXTCOLORDEPENDINGONIFENOUGHITEMS" style="font-family:cursive;font-size:20px;">AMOUNTOFITEMREQUIREDTOCRAFT</text>'+(itemSVGCode[name][itemSVGCode[name].length-1]).substr(0,itemSVGCode[name][itemSVGCode[name].length-1].indexOf('</svg>'))+'</g><title>'+MATH.doGrammar(name)+'</title><text x="36" y="34" fill="rgb(0,0,0)" style="font-family:cursive;font-size:10px;" text-anchor="end">AMOUNTININVENTORY</text></svg>'
}

for(let i in hotbarSlots){
    
    hotbarSlots[i].onmousedown=function(){
        
        if(player.itemDragging&&player.itemDragging!==hotbarSlots[i].itemType){
            
            hotbarSlots[i].innerHTML=itemSVGCode[player.itemDragging].replaceAll('AMOUNTININVENTORY',items[player.itemDragging].amount).replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','').replace('translate(0px,7px)','translate(-2px,2px)').replace('scale(0.77,0.77)','scale(0.5,0.5)')
            
            hotbarSlots[i].style.backgroundColor='rgb(235,235,235)'
            hotbarSlots[i].itemType=player.itemDragging
            
            autoHotbarButtons[i].style.display=items[player.itemDragging].autoUse?'block':'none'
            autoHotbarButtons[i].autoEnabled=false
            autoHotbarButtons[i].style.backgroundColor='rgb(255,0,0,0.85)'
            autoHotbarButtons[i].innerHTML='AUTO: OFF'
            autoHotbarButtons[i].onmousedown=function(){
                
                autoHotbarButtons[i].autoEnabled=!autoHotbarButtons[i].autoEnabled
                autoHotbarButtons[i].style.backgroundColor=autoHotbarButtons[i].autoEnabled?'rgb(0,255,0,0.7)':'rgb(255,0,0,0.7)'
                autoHotbarButtons[i].innerHTML='AUTO: '+(autoHotbarButtons[i].autoEnabled?'ON':'OFF')
                
                if(autoHotbarButtons[i].autoEnabled){
                    
                    autoHotbarButtons[i].interval=window.setInterval(function(){

                        player.stats[hotbarSlots[i].itemType]++
                        items[hotbarSlots[i].itemType].use()
                        items[hotbarSlots[i].itemType].cooldown=TIME
                        player.updateInventory()
                        
                    },1000*items[hotbarSlots[i].itemType].maxCooldown)
                    
                } else {
                    
                    window.clearInterval(autoHotbarButtons[i].interval)
                }
            }
            
            for(let j in hotbarSlots){
                
                if(hotbarSlots[j].itemType===player.itemDragging&&i!==j){
                    hotbarSlots[j].innerHTML=''
                    hotbarSlots[j].style.backgroundColor='rgb(0,0,0,0)'
                    hotbarSlots[j].itemType=false
                    autoHotbarButtons[j].style.display='none'
                    autoHotbarButtons[j].autoEnabled=false
                }
            }
            
            player.itemDragging=false
            
        } else if(player.itemDragging===hotbarSlots[i].itemType){
            hotbarSlots[i].innerHTML=''
            hotbarSlots[i].style.backgroundColor='rgb(0,0,0,0)'
            hotbarSlots[i].itemType=false
            autoHotbarButtons[i].style.display='none'
            autoHotbarButtons[i].autoEnabled=false
            player.itemDragging=false
            
        } else if(!player.itemDragging&&hotbarSlots[i].itemType){
            if(items[hotbarSlots[i].itemType].canUseOnSlot){
                
                player.itemDragging=hotbarSlots[i].itemType
                
            } else {
                
                if(TIME-items[hotbarSlots[i].itemType].cooldown>items[hotbarSlots[i].itemType].maxCooldown){
                    
                    player.stats[hotbarSlots[i].itemType]++
                    items[hotbarSlots[i].itemType].use()
                    items[hotbarSlots[i].itemType].cooldown=TIME
                    player.updateInventory()
                    
                } else {
                    
                    player.addMessage('Item is on a cooldown of '+MATH.doTime(items[hotbarSlots[i].itemType].maxCooldown-(TIME-items[hotbarSlots[i].itemType].cooldown))+'!',COLORS.redArr)
                }
            }
        }
    }
}

document.getElementById('honey').style.display='none'

inventoryButton.onclick=function(e){
    
    if(currentPage!==0){
        
        if(currentPage!==null)
        pages[currentPage].style.display='none'
        currentPage=0
        pages[currentPage].style.display='block'
        player.itemDragging=false
        player.beequipDragging=false
        
    } else {
        
        pages[currentPage].style.display='none'
        currentPage=null
        player.itemDragging=false
        player.beequipDragging=false
    }
}

questButton.onclick=function(e){
    
    if(currentPage!==1){
        
        if(currentPage!==null)
        pages[currentPage].style.display='none'
        currentPage=1
        pages[currentPage].style.display='block'
        player.itemDragging=false
        player.beequipDragging=false
        
    } else {
        
        pages[currentPage].style.display='none'
        currentPage=null
        player.itemDragging=false
        player.beequipDragging=false
    }
}

beesButton.onclick=function(e){
    
    if(currentPage!==2){
        
        if(currentPage!==null)
        pages[currentPage].style.display='none'
        currentPage=2
        pages[currentPage].style.display='block'
        player.itemDragging=false
        player.beequipDragging=false
        player.updateBeesPage()
        
    } else {
        
        pages[currentPage].style.display='none'
        currentPage=null
        player.itemDragging=false
        player.beequipDragging=false
    }
}

settingsButton.onclick=function(e){
    
    if(currentPage!==3){
        
        if(currentPage!==null)
        pages[currentPage].style.display='none'
        currentPage=3
        pages[currentPage].style.display='block'
        player.itemDragging=false
        player.beequipDragging=false
        
    } else {
        
        pages[currentPage].style.display='none'
        currentPage=null
        player.itemDragging=false
        player.beequipDragging=false
    }
}

beequipButton.onclick=function(e){
    
    if(currentPage!==4){
        
        if(currentPage!==null)
        pages[currentPage].style.display='none'
        currentPage=4
        pages[currentPage].style.display='block'
        player.itemDragging=false
        player.beequipDragging=false
        player.updateBeequipPage()
        
    } else {
        
        pages[currentPage].style.display='none'
        currentPage=null
        player.itemDragging=false
        player.beequipDragging=false
    }
}

let world=new CANNON.World(),
raycastWorld=new CANNON.World()

world.broadphase=new CANNON.SAPBroadphase(world)
world.broadphase.useBoundingBoxes=true

world.gravity.set(0,-25,0)

world.quatNormalizeSkip=10
world.quatNormalizeFast=true

let solver=new CANNON.GSSolver()

solver.iterations=2
solver.tolerance=100000

world.solver=solver

world.defaultContactMaterial.friction=0
world.defaultContactMaterial.restitution=0.01

let triggers={

    blender:{

        minX:59-3-1,maxX:59+3,minY:10,maxY:19,minZ:50.5-3,maxZ:50.5+3+1,isMachine:true,message:'Use Blender',requirements:function(player){
            
            if(document.getElementById('blenderMenu').style.display==='block') return "You're using the Blender"        
        },
        func:function(player){
            
            document.exitPointerLock()
            player.blenderIndex=0
            player.updateBlenderMenu()
        }
    },
    
    enter_ant_challenge:{

        minX:-21-2.5,maxX:-21+2.5,minY:5-3,maxY:5+5,minZ:-44-2.5,maxZ:-44+2.5,isMachine:true,message:'Enter Ant Challenge<br>(1 Ant Pass)',requirements:function(player){
            
            if(items.antPass.amount<1) return 'You need 1 ant pass to enter the Ant Challenge'
        
        },func:function(player){
            
            player.body.position.x=-21
            player.body.position.y=7
            player.body.position.z=-50
            player.yaw=0
            player.antChallenge={timer:5*60,score:0,pollenReq:1000,pollenBeforeReq:player.stats.pollenFromAntField,spawnDelay:0,round:0,lawnMowerTimer:25}
            items.antPass.amount--

            textRenderer.add((player.pollen*player.honeyPerPollen)|0,[player.body.position.x,player.body.position.y+1.5,player.body.position.z],COLORS.honey,1,'⇆')
            player.honey+=(player.pollen*player.honeyPerPollen)|0
            player.pollen=0
            player.addEffect('antChallenge')

            player.updateInventory()
        }
    },

    blue_portal:{

        minX:-73-2,maxX:-73+2,minY:-3,maxY:3,minZ:31-2,maxZ:31+2,isMachine:true,message:'Use Blue Teleporter',func:function(player){

            player.body.position.x=34.5
            player.body.position.y=9.5
            player.body.position.z=-23.2
        }
    },

    red_portal:{

        minX:48.75-2,maxX:48.75+2,minY:2,maxY:6,minZ:26.95-2,maxZ:26.95+2,isMachine:true,message:'Use Red Teleporter',func:function(player){
            
            player.body.position.x=-78.5
            player.body.position.y=31.5
            player.body.position.z=48
        }
    },

    demon_killbrick:{

        minX:-45-20,maxX:-45+20,minY:-10,maxY:-5,minZ:-20-15,maxZ:-20+15,contactFunc:function(player){player.health=-Infinity}
    },

    hive:{
        
        minX:-5.9-4.5*0.5,
        maxX:-5.9+4.5*0.5,
        minY:-1.95-4*0.5,
        maxY:-1.95+4*0.5+4,
        minZ:-4-4.5*0.5,
        maxZ:-4+4.5*0.5
    },
    
    blackBear_NPC:{
        
        minX:29-2.5,maxX:29+2.5,minY:-2,maxY:4,minZ:0.5-2.5,maxZ:0.5+2.5
    },
    
    polarBear_NPC:{
        
        minX:-1.5-2,maxX:-1.5+2,minY:20,maxY:26,minZ:66-2,maxZ:66+2
    },

    roboBear_NPC:{

        minX:54-3,maxX:54+0.5,minY:0,maxY:10,minZ:40-2,maxZ:40+2
    },

    pandaBear_NPC:{

        minX:-37-2.5,maxX:-37+2.5,minY:3,maxY:9,minZ:46.5-2.5,maxZ:46.5+2.5
    },
    
    cool_shop:{
        
        minX:23-1,maxX:23+1,minY:-2,maxY:5,minZ:10-1,maxZ:10+1
    },
    
    become_red_hive:{
        
        isMachine:true,minX:23-1,maxX:23+1,minY:-2,maxY:5,minZ:4-1,maxZ:4+1,message:'become red hive',func:function(player){
            player.currentGear={
                
                tool:'darkScythe',
                boots:'gummyBoots',
                belt:'petalBelt',
                backpack:'coconutCanister',
                mask:'demonMask',
                leftGuard:'crimsonGuard',
                rightGuard:'cobaltGuard',
                glider:'glider',
                supremeStarAmulet:'*2.5 capacityMultiplier,*1.5 convertRate,*1.1 redPollen,*1.1 bluePollen,*1.1 whitePollen,*1.6 redPollen,+0.1 instantBlueConversion,+0.1 instantWhiteConversion,+0.1 instantRedConversion,+0.05 criticalChance,P scorchingStarPassive,P starSawPassive',
                beequips:[],
            }
            
            player.updateGear()
            player.addEffect('superSmoothieBuff')
            player.addEffect('comfortingNectar',1)
            player.addEffect('refreshingNectar',1)
            player.addEffect('invigoratingNectar',1)
            player.addEffect('motivatingNectar',1)
            player.addEffect('satisfyingNectar',1)
            player.hive=[[]]
            player.addSlot('basic')
            player.addSlot('looker')
            player.addSlot('fire')
            player.addSlot('rage')
            player.addSlot('rad')
            player.addSlot('rascal')
            player.addSlot('commander')
            player.addSlot('riley')
            player.addSlot('riley')
            player.addSlot('shy')
            player.addSlot('brave')
            player.addSlot('windy')
            player.addSlot('tabby')
            player.addSlot('hasty')
            player.addSlot('fuzzy')
            player.addSlot('music')
            player.addSlot('music')
            player.addSlot('music')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('gummy')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('carpenter')
            player.addSlot('carpenter')
            player.addSlot('carpenter')
            player.addSlot('photon')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('spicy')
            player.addSlot('crimson')
            player.addSlot('digital')
            player.updateHive()
        }
    },
    
    become_blue_hive:{
        
        isMachine:true,minX:23-1,maxX:23+1,minY:-2,maxY:5,minZ:6-1,maxZ:6+1,message:'become blue hive',func:function(player){
            
            player.currentGear={
                
                tool:'tidePopper',
                boots:'gummyBoots',
                belt:'petalBelt',
                backpack:'coconutCanister',
                mask:'diamondMask',
                leftGuard:'crimsonGuard',
                rightGuard:'cobaltGuard',
                glider:'glider',
                supremeStarAmulet:'*2.5 capacityMultiplier,*1.5 convertRate,*1.1 redPollen,*1.1 bluePollen,*1.1 whitePollen,*1.6 bluePollen,+0.1 instantBlueConversion,+0.1 instantWhiteConversion,+0.1 instantRedConversion,+0.05 criticalChance,P popStarPassive,P starShowerPassive',
                beequips:[],
            }
            
            player.updateGear()
            player.addEffect('superSmoothieBuff')
            player.addEffect('comfortingNectar',1)
            player.addEffect('refreshingNectar',1)
            player.addEffect('invigoratingNectar',1)
            player.addEffect('motivatingNectar',1)
            player.addEffect('satisfyingNectar',1)
            player.hive=[[]]
            player.addSlot('basic')
            player.addSlot('looker')
            player.addSlot('bomber')
            player.addSlot('bubble')
            player.addSlot('bumble')
            player.addSlot('bucko')
            player.addSlot('cool')
            player.addSlot('frosty')
            player.addSlot('commander')
            player.addSlot('windy')
            player.addSlot('tabby')
            player.addSlot('diamond')
            player.addSlot('hasty')
            player.addSlot('fuzzy')
            player.addSlot('ninja')
            player.addSlot('vicious')
            player.addSlot('music')
            player.addSlot('music')
            player.addSlot('music')
            player.addSlot('gummy')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('buoyant')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('photon')
            player.addSlot('cobalt')
            player.addSlot('digital')
            player.updateHive()
            player.addEffect('balloonBlessing',false,50)
            player.addEffect('tideBlessing',1)
            player.addEffect('bubbleBloat',1)
        }
    },
    
    become_white_hive:{
        
        isMachine:true,minX:23-1,maxX:23+1,minY:-2,maxY:5,minZ:8-1,maxZ:8+1,message:'become white hive',func:function(player){
            player.currentGear={
                
                tool:'gummyBaller',
                boots:'gummyBoots',
                belt:'petalBelt',
                backpack:'coconutCanister',
                mask:'gummyMask',
                leftGuard:'crimsonGuard',
                rightGuard:'cobaltGuard',
                glider:'glider',
                supremeStarAmulet:'*2.5 capacityMultiplier,*1.5 convertRate,*1.1 redPollen,*1.1 bluePollen,*1.1 whitePollen,*1.6 whitePollen,+0.1 instantBlueConversion,+0.1 instantWhiteConversion,+0.1 instantRedConversion,+0.05 criticalChance,P gummyStarPassive,P starSawPassive',
                beequips:[],
            }
            
            player.updateGear()
            player.addEffect('superSmoothieBuff')
            player.addEffect('comfortingNectar',1)
            player.addEffect('refreshingNectar',1)
            player.addEffect('invigoratingNectar',1)
            player.addEffect('motivatingNectar',1)
            player.addEffect('satisfyingNectar',1)
            player.hive=[[]]
            player.addSlot('basic')
            player.addSlot('bomber')
            player.addSlot('looker')
            player.addSlot('rage')
            player.addSlot('stubborn')
            player.addSlot('brave')
            player.addSlot('windy')
            player.addSlot('honey')
            player.addSlot('commander')
            player.addSlot('shocked')
            player.addSlot('hasty')
            player.addSlot('music')
            player.addSlot('music')
            player.addSlot('music')
            player.addSlot('crimson')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('tadpole')
            player.addSlot('lion')
            player.addSlot('gummy')
            player.addSlot('photon')
            player.addSlot('tabby')
            player.addSlot('carpenter')
            player.addSlot('carpenter')
            player.addSlot('carpenter')
            player.addSlot('carpenter')
            player.addSlot('carpenter')
            player.addSlot('demo')
            player.addSlot('exhausted')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('vector')
            player.addSlot('fuzzy')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('precise')
            player.addSlot('digital')
            player.updateHive()
            
        }
    },
    
    red_cannon:{
        
        isMachine:true,minX:33-4,maxX:33+4,minY:0,maxY:3,minZ:-13-4,maxZ:-13+4,message:'Use Red Cannon',func:function(player){
            
            player.stats.timesUsingTheRedCannon++
            player.body.position.x=34
            player.body.position.y=3
            player.body.position.z=-12
            player.body.velocity.x=-18.1
            player.body.velocity.y=52
            player.body.velocity.z=27
            player.removeAirFrictionUntilGrounded=true
            player.isGliding=false
            player.grounded=false
            player.updateGear()
        }
    },
    
    yellow_cannon:{
        
        isMachine:true,minX:-67-3,maxX:-67+3,minY:22,maxY:26,minZ:49-3,maxZ:49+3,message:'Use Yellow Cannon',func:function(player){
            
            player.stats.timesUsingTheYellowCannon++
            player.body.position.x=-67
            player.body.position.y=24
            player.body.position.z=49
            player.body.velocity.x=31
            player.body.velocity.y=20
            player.body.velocity.z=-19
            player.removeAirFrictionUntilGrounded=true
            player.isGliding=false
            player.grounded=false
            player.updateGear()
        }
    },

    blue_cannon:{
        
        isMachine:true,minX:36.5-4,maxX:36.5+4,minY:10,maxY:16,minZ:57.25-4,maxZ:57.25+4,message:'Use Blue Cannon',func:function(player){
            
            player.stats.timesUsingTheBlueCannon++
            player.body.position.x=36.5
            player.body.position.y=13
            player.body.position.z=58
            player.body.velocity.x=-35
            player.body.velocity.y=25
            player.body.velocity.z=-18
            player.removeAirFrictionUntilGrounded=true
            player.isGliding=false
            player.grounded=false
            player.updateGear()
        }
    },
    
    slingshot:{
        
        isMachine:true,minX:-25-2.5,maxX:-25+2.5,minY:1,maxY:8,minZ:24.5-2.5,maxZ:24.5+2.5,message:'Use Slingshot',func:function(player){
            
            player.stats.timesUsingTheSlingshot++
            player.body.position.x=-25
            player.body.position.y=3.5
            player.body.position.z=24.5
            player.body.velocity.x=-12
            player.body.velocity.y=32
            player.body.velocity.z=21
            player.removeAirFrictionUntilGrounded=true
            player.isGliding=false
            player.grounded=false
            player.updateGear()
        }
    },
    
    mountain_instant_converter:{
        
        isMachine:true,requirements:function(player){
            
            if(player.pollen<1) return 'You must have pollen to use the instant converter'
            if(items.ticket.amount<1) return 'You need 1 ticket to use the instant converter'
        
        },minX:-39-4,maxX:-39+4,minY:30,maxY:37,minZ:88-4,maxZ:88+4,message:'Use Instant Converter<br>(1 Ticket)',func:function(player){
            
            textRenderer.add(player.pollen,[player.body.position.x,player.body.position.y+1,player.body.position.z],COLORS.honey,1,'⇆')
            player.honey+=Math.ceil(player.pollen*player.honeyPerPollen)
            player.pollen=0
            items.ticket.amount--
            player.updateInventory()
            
        }
    },
    
    pineapple_instant_converter:{
        
        isMachine:true,requirements:function(player){
            
            if(player.pollen<1) return 'You must have pollen to use the instant converter'
            if(items.ticket.amount<1) return 'You need 1 ticket to use the instant converter'
        
        },minX:-69-3,maxX:-69+3,minY:11,maxY:17,minZ:62.5-2.5,maxZ:62.5+2.5,message:'Use Instant Converter<br>(1 Ticket)',func:function(player){
            
            textRenderer.add(player.pollen,[player.body.position.x,player.body.position.y+1,player.body.position.z],COLORS.honey,1,'⇆')
            player.honey+=Math.ceil(player.pollen*player.honeyPerPollen)
            player.pollen=0
            items.ticket.amount--
            player.updateInventory()
            
        }
    },

    bronze_star_amulet_generator:{
        
        isMachine:true,requirements:function(player){
            
            

        },minX:-35.5-Math.sin(45.6*0.0174533)*3-Math.cos(45.6*0.0174533)*12.5-3,maxX:-35.5-Math.sin(45.6*0.0174533)*3-Math.cos(45.6*0.0174533)*12.5+3,minY:11,maxY:50,minZ:-2.75+Math.cos(45.6*0.0174533)*3-Math.sin(45.6*0.0174533)*12.5-3,maxZ:-2.75+Math.cos(45.6*0.0174533)*3-Math.sin(45.6*0.0174533)*12.5+3,message:'Generate a Bronze Star Amulet',func:function(player){
            
            let amulet=['*1.25 capacityMultiplier'],final=[]

            amulet.push(...MATH.selectFromArray(['*'+MATH.random(1.05,1.15).toFixed(2)+' POLLEN','*'+MATH.random(1.15,1.3).toFixed(2)+' redPollen','*'+MATH.random(1.15,1.3).toFixed(2)+' bluePollen','*'+MATH.random(1.15,1.3).toFixed(2)+' whitePollen','*'+MATH.random(1.15,1.3).toFixed(2)+' pollenFromBees','+'+MATH.random(0.03,0.08).toFixed(2)+' INSTANT_CONVERSION','*'+MATH.random(1.1,1.2).toFixed(2)+' convertRate','+'+MATH.random(0.01,0.05).toFixed(2)+' beeAbilityRate','+'+MATH.random(0.01,0.05).toFixed(2)+' criticalChance'],2))

            player.showGeneratedAmulet('bronzeStarAmulet',amulet)
        }
    },

    silver_star_amulet_generator:{
        
        isMachine:true,requirements:function(player){

        },minX:-35.5+Math.sin(45.6*0.0174533)*6-Math.cos(45.6*0.0174533)*19.5-3,maxX:-35.5+Math.sin(45.6*0.0174533)*6-Math.cos(45.6*0.0174533)*19.5+3,minY:11,maxY:50,minZ:-2.75-Math.cos(45.6*0.0174533)*6-Math.sin(45.6*0.0174533)*19.5-3,maxZ:-2.75-Math.cos(45.6*0.0174533)*6-Math.sin(45.6*0.0174533)*19.5+3,message:'Generate a Silver Star Amulet',func:function(player){
            
            let amulet=['*1.5 capacityMultiplier'],final=[]

            amulet.push(...MATH.selectFromArray(['*'+MATH.random(1.05,1.15).toFixed(2)+' POLLEN','*'+MATH.random(1.15,1.4).toFixed(2)+' redPollen','*'+MATH.random(1.15,1.4).toFixed(2)+' bluePollen','*'+MATH.random(1.15,1.4).toFixed(2)+' whitePollen','*'+MATH.random(1.15,1.4).toFixed(2)+' pollenFromBees','+'+MATH.random(0.03,0.1).toFixed(2)+' INSTANT_CONVERSION','*'+MATH.random(1.1,1.25).toFixed(2)+' convertRate','+'+MATH.random(0.01,0.05).toFixed(2)+' beeAbilityRate','+'+MATH.random(0.01,0.05).toFixed(2)+' criticalChance'],3))

            player.showGeneratedAmulet('silverStarAmulet',amulet)
        }
    },

    gold_star_amulet_generator:{
        
        isMachine:true,requirements:function(player){
            
            

        },minX:-35.5-Math.sin(45.6*0.0174533)*3-Math.cos(45.6*0.0174533)*26.5-3,maxX:-35.5-Math.sin(45.6*0.0174533)*3-Math.cos(45.6*0.0174533)*26.5+3,minY:11,maxY:50,minZ:-2.75+Math.cos(45.6*0.0174533)*3-Math.sin(45.6*0.0174533)*26.5-3,maxZ:-2.75+Math.cos(45.6*0.0174533)*3-Math.sin(45.6*0.0174533)*26.5+3,message:'Generate a Gold Star Amulet',func:function(player){
            
            let amulet=['*1.75 capacityMultiplier'],final=[]

            amulet.push(...MATH.selectFromArray(['*'+MATH.random(1.05,1.15).toFixed(2)+' POLLEN','*'+MATH.random(1.15,1.5).toFixed(2)+' redPollen','*'+MATH.random(1.15,1.5).toFixed(2)+' bluePollen','*'+MATH.random(1.15,1.5).toFixed(2)+' whitePollen','*'+MATH.random(1.15,1.5).toFixed(2)+' pollenFromBees','+'+MATH.random(0.03,0.1).toFixed(2)+' INSTANT_CONVERSION','*'+MATH.random(1.1,1.25).toFixed(2)+' convertRate','+'+MATH.random(0.01,0.05).toFixed(2)+' beeAbilityRate','+'+MATH.random(0.01,0.05).toFixed(2)+' criticalChance'],4))

            player.showGeneratedAmulet('goldStarAmulet',amulet)
        }
    },

    diamond_star_amulet_generator:{
        
        isMachine:true,requirements:function(player){
            
        },minX:-35.5+Math.sin(45.6*0.0174533)*6-Math.cos(45.6*0.0174533)*33.5-3,maxX:-35.5+Math.sin(45.6*0.0174533)*6-Math.cos(45.6*0.0174533)*33.5+3,minY:11,maxY:50,minZ:-2.75-Math.cos(45.6*0.0174533)*6-Math.sin(45.6*0.0174533)*33.5-3,maxZ:-2.75-Math.cos(45.6*0.0174533)*6-Math.sin(45.6*0.0174533)*33.5+3,message:'Generate a Diamond Star Amulet',func:function(player){
            
            let amulet=['*2 capacityMultiplier'],final=[]

            amulet.push(...MATH.selectFromArray(['*'+MATH.random(1.05,1.15).toFixed(2)+' POLLEN','*'+MATH.random(1.15,1.5).toFixed(2)+' redPollen','*'+MATH.random(1.15,1.5).toFixed(2)+' bluePollen','*'+MATH.random(1.15,1.5).toFixed(2)+' whitePollen','*'+MATH.random(1.15,1.5).toFixed(2)+' pollenFromBees','+'+MATH.random(0.03,0.1).toFixed(2)+' INSTANT_CONVERSION','*'+MATH.random(1.1,1.3).toFixed(2)+' convertRate','+'+MATH.random(0.01,0.05).toFixed(2)+' beeAbilityRate','+'+MATH.random(0.01,0.05).toFixed(2)+' criticalChance'],5))

            if(Math.random()<0.5){

                let ps=['guidingStarPassive','starShowerPassive']
                amulet.push('P '+ps[(Math.random()*ps.length)|0])
            }

            player.showGeneratedAmulet('diamondStarAmulet',amulet)
        }
    },

    supreme_star_amulet_generator:{
        
        isMachine:true,requirements:function(player){
            

        },minX:-35.5+Math.sin(45.6*0.0174533)*1.5-Math.cos(45.6*0.0174533)*43-3,maxX:-35.5+Math.sin(45.6*0.0174533)*1.5-Math.cos(45.6*0.0174533)*43+3,minY:11,maxY:50,minZ:-2.75-Math.cos(45.6*0.0174533)*1.5-Math.sin(45.6*0.0174533)*43-3,maxZ:-2.75-Math.cos(45.6*0.0174533)*1.5-Math.sin(45.6*0.0174533)*43+3,message:'Generate a Supreme Star Amulet',func:function(player){
            
            let amulet=['*2.5 capacityMultiplier'],final=[]

            amulet.push(...MATH.selectFromArray(['*'+MATH.random(1.05,1.2).toFixed(2)+' POLLEN','*'+MATH.random(1.2,1.7).toFixed(2)+' redPollen','*'+MATH.random(1.2,1.7).toFixed(2)+' bluePollen','*'+MATH.random(1.2,1.7).toFixed(2)+' whitePollen','*'+MATH.random(1.2,1.7).toFixed(2)+' pollenFromBees','+'+MATH.random(0.03,0.15).toFixed(2)+' INSTANT_CONVERSION','*'+MATH.random(1.1,1.4).toFixed(2)+' convertRate','+'+MATH.random(0.01,0.08).toFixed(2)+' beeAbilityRate','+'+MATH.random(0.01,0.08).toFixed(2)+' criticalChance'],5))

            let gotten=['guidingStarPassive','starShowerPassive','popStarPassive','scorchingStarPassive','gummyStarPassive','starSawPassive']

            gotten=gotten[(Math.random()*gotten.length)|0]

            amulet.push('P '+gotten)

            if(Math.random()<0.3333){

                let ps=['guidingStarPassive','starShowerPassive','popStarPassive','scorchingStarPassive','gummyStarPassive','starSawPassive']
                ps.splice(ps.indexOf(gotten),1)
                amulet.push('P '+ps[(Math.random()*ps.length)|0])
            }

            player.showGeneratedAmulet('supremeStarAmulet',amulet)
        }
    },
}

let hoverText=document.getElementById('hoverText')

let beeInfo={
    
    basic:{
        
        u:0,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:14,convertSpeed:4,convertAmount:80,attack:1,energy:20,favoriteTreat:'sunflowerSeed',rarity:'common',color:'white',description:'An ordinary bee. Well rounded and hard working!',giftedHiveBonus:{oper:'*',stat:'redPollen,bluePollen,whitePollen',num:1.2}
    },
    
    looker:{
        
        u:128/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:13,speed:14,tokens:['focus'],convertSpeed:4,convertAmount:160,attack:1,attackTokens:['focus'],energy:162,favoriteTreat:'sunflowerSeed',rarity:'rare',color:'white',description:'This silent bee is always watching and gaining valuable insights.',giftedHiveBonus:{oper:'+',stat:'criticalPower',num:0.25}
        
    },
    
    music:{
        
        u:256/2048,v:0,meshPartId:5,gatherSpeed:4,gatherAmount:16,speed:16.1,tokens:['focus','melody','link'],convertSpeed:4,convertAmount:240,attack:1,attackTokens:['focus','melody','link'],energy:20,favoriteTreat:'blueberry',rarity:'legendary',color:'white',description:"This bee's buzz is so beautiful it can bring anyone to tears. It uses this gift to motivate others.",giftedHiveBonus:{oper:'*',stat:'pollenFromBees',num:1.25}
        
    },
    
    fire:{
        
        u:(256+128)/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:11.5,gatheringPassive:function(bee){if(Math.random()<(bee.gifted?0.5:0.35)){objects.explosions.push(new Explosion({col:[1,0.5,0],pos:[Math.round(bee.pos[0]),bee.pos[1]-0.225,Math.round(bee.pos[2])],life:0.5,size:1.5,speed:0.5,aftershock:0.01,height:0.01}));objects.flames.push(new Flame(player.fieldIn,bee.flowerCollecting[0],bee.flowerCollecting[1]))}},particles:function(bee){ParticleRenderer.add({x:bee.pos[0],y:bee.pos[1],z:bee.pos[2],vx:MATH.random(-0.3,0.3),vy:MATH.random(-0.3,0.3),vz:MATH.random(-0.3,0.3),grav:0,size:MATH.random(80,120),col:[player.isNight,MATH.random(0.4,0.7)*player.isNight,0],life:1.5,rotVel:MATH.random(-3,3),alpha:2.5})},convertSpeed:4,convertAmount:80,attack:4,tokens:['redBomb'],energy:25,favoriteTreat:'pineapple',rarity:'epic',color:'red',description:'As an egg, this bee was accidentally left in the trunk of a car in the middle of the summer for over 3 days!',giftedHiveBonus:{oper:'*',stat:'flamePollen',num:1.5}
    },
    
    bubble:{
        
        u:(256+256)/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:16.1,gatheringPassive:function(bee){if(Math.random()<(bee.gifted?0.5:0.35)){objects.bubbles.push(new Bubble(player.fieldIn,bee.flowerCollecting[0],bee.flowerCollecting[1]))}},particles:function(bee){ParticleRenderer.add({x:bee.pos[0],y:bee.pos[1],z:bee.pos[2],vx:MATH.random(-0.3,0.3),vy:MATH.random(-0.3,0.3),vz:MATH.random(-0.3,0.3),grav:0,size:MATH.random(35,70),col:[MATH.random(0.1,0.3)*player.isNight,MATH.random(0.4,0.6)*player.isNight,MATH.random(0.8,1)*player.isNight],life:1.5,rotVel:MATH.random(-3,3),alpha:2.5})},convertSpeed:4,convertAmount:160,attack:3,tokens:['blueBomb'],energy:20,favoriteTreat:'blueberry',rarity:'epic',color:'blue',description:'As a larva, this bee lived in the ocean. It loves Blue flowers cause they remind it of home.',giftedHiveBonus:{oper:'*',stat:'bubblePollen',num:1.5}
    },
    
    hasty:{
        
        u:128*5/2048,v:0,meshPartId:0,gatherSpeed:3,gatherAmount:10,speed:19.6,tokens:['haste'],convertSpeed:3,convertAmount:80,attack:1,attackTokens:['haste'],energy:20,favoriteTreat:'pineapple',rarity:'rare',color:'white',description:'A quick bee who always zips arounds. Sometimes it even makes YOU move faster.',giftedHiveBonus:{oper:'*',stat:'walkSpeed',num:1.1}
        
    },
    
    bomber:{
        
        u:128*6/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:15.4,tokens:['whiteBomb'],convertSpeed:4,convertAmount:120,attack:2,energy:20,favoriteTreat:'sunflowerSeed',rarity:'rare',color:'white',description:'This crafty bee makes bombs which collect pollen from all nearby flowers.',giftedHiveBonus:{oper:'*',stat:'redBombPollen,blueBombPollen,whiteBombPollen',num:1.25}
        
    },
    
    fuzzy:{
        
        u:128*7/2048,v:0,meshPartId:7,gatherSpeed:6,gatherAmount:100,speed:11.9,convertSpeed:6,convertAmount:40,attack:3,energy:50,gatheringPassive:function(bee){
            
            let fs=[
                
                [0,0],[-1,-1],[1,-1],[1,1],[-1,1],[0,1],[0,-1],[1,0],[-1,0],[0,2],[2,0],[0,-2],[-2,0]
                
            ]
            
            let f=fieldInfo[player.fieldIn]
            
            for(let i=0,l=MATH.random(-1+(bee.level*0.05),6);i<l;i++){
                
                let r=(Math.random()*fs.length)|0
                let x=fs[r][0]+bee.flowerCollecting[0],z=fs[r][1]+bee.flowerCollecting[1]
                
                fs.splice(r,1)
                
                if(x>=0&&x<f.width&&z>=0&&z<f.length){
                    
                    updateFlower(player.fieldIn,x,z,function(f){
                        
                        if(f.level<5){
                            
                            f.level++
                            f.pollinationTimer=1
                            
                        } else {
                            
                            f.height=1
                        }
                        
                    },true,false,true)
                    
                    for(let j=0;j<6;j++){
                        
                        ParticleRenderer.add({x:x+f.x,y:f.y+0.5,z:z+f.z,vx:MATH.random(-1,1),vy:Math.random()*2,vz:MATH.random(-1,1),grav:-3,size:100,col:[player.isNight,player.isNight,MATH.random(0.6,1)*player.isNight],life:2.5,rotVel:MATH.random(-3,3),alpha:2})
                    }
                }
            }
            
        },particles:function(bee){ParticleRenderer.add({x:bee.pos[0],y:bee.pos[1],z:bee.pos[2],vx:MATH.random(-1,1),vy:MATH.random(0.5,1.4),vz:MATH.random(-1,1),grav:-3,size:MATH.random(25,60),col:[player.isNight,player.isNight,MATH.random(0.6,1)*player.isNight],life:0.75,rotVel:MATH.random(-3,3),alpha:10})},tokens:['pollenHaze*','fuzzBomb','whiteBomb_'],favoriteTreat:'pineapple',rarity:'mythic',color:'white',description:'This unkempt ball of fluff is actually a bee. Its fur aids in the pollination of flowers.',giftedHiveBonus:{oper:'*',stat:'whiteBombPollen',num:1.1}
        
    },
    
    stubborn:{
        
        u:128*8/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:11.9,tokens:['pollenMarkToken'],convertSpeed:3,convertAmount:80,attack:2,energy:20,favoriteTreat:'strawberry',rarity:'rare',color:'white',description:"A hardheaded bee who can't be bossed around. It tells others where to go.",giftedHiveBonus:{oper:'*',stat:'tokenLifespan',num:1.25}
        
    },
    
    spicy:{
        
        u:128*9/2048,v:0,meshPartId:4,gatherSpeed:4,gatherAmount:14,speed:14,convertSpeed:2,convertAmount:200,tokens:['inferno','flameFuel*'],attack:5,attackTokens:['inferno','flameFuel*','rage'],energy:20,particles:function(bee){if(player.flameHeatStack){ParticleRenderer.add({x:bee.pos[0],y:bee.pos[1],z:bee.pos[2],vx:MATH.random(-0.7,0.7),vy:MATH.random(-0.3,0.3),vz:MATH.random(-0.7,0.7),grav:1.25,size:110,col:[player.isNight,player.isNight,player.isNight],life:1.5,rotVel:MATH.random(-3,3),alpha:(player.flameHeatStack-1)*2})}},favoriteTreat:'strawberry',rarity:'mythic',color:'red',description:'Some like it hot - this bee likes it scorching. Even the honey it makes is spicy.',giftedHiveBonus:{oper:'*',stat:'flameLife',num:1.25}
        
    },
    
    vector:{
        
        u:1280/2048,v:0,meshPartId:2,gatherSpeed:4,gatherAmount:18,speed:16.24,convertSpeed:2.72,convertAmount:144,tokens:['pollenMarkToken','markSurge*','triangulate'],attack:5,energy:45.6,favoriteTreat:'pineapple',rarity:'mythic',color:'white',description:'A bee brought to life by an extremely complex trigonometric equation.',giftedHiveBonus:{oper:'*',stat:'markDuration',num:1.15}
        
    },
    
    tadpole:{
        
        u:128*11/2048,v:0,meshPartId:0,gatherSpeed:6,gatherAmount:10,speed:11.2,convertSpeed:4,convertAmount:120,tokens:['summonFrog','blueBoost','babyLove*'],attack:0.5,energy:10,gatheringPassive:function(bee){if(Math.random()<(bee.gifted?0.75:0.55)){objects.bubbles.push(new Bubble(player.fieldIn,bee.flowerCollecting[0],bee.flowerCollecting[1]))}},favoriteTreat:'blueberry',rarity:'mythic',color:'blue',description:'A tiny amphibious bee who wants to become a frog when it grows up.',giftedHiveBonus:{oper:'*',stat:'bluePollen',num:1.1},trails:[{length:8,size:0.14,color:[29/215, 133/215, 72/215,1],skipFrame:3,skipAdd:3,vertical:true}]
    },
    
    buoyant:{
        
        u:128*12/2048,v:0,meshPartId:3,gatherSpeed:5,gatherAmount:15,speed:14,convertSpeed:3,convertAmount:150,tokens:['inflateBalloons','surpriseParty*','blueBomb_'],attack:3,energy:60,favoriteTreat:'blueberry',rarity:'mythic',color:'blue',description:"Just like a balloon, nothing can keep this bee down. It's always ready to party.",giftedHiveBonus:{oper:'*',stat:'capacityMultiplier',num:1.2}
        
    },
    
    gummy:{
        
        u:128*13/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:14,convertSpeed:4,convertAmount:700,tokens:['gummyBlob','gummyBarrage','whiteBoost'],attack:3,energy:50,rarity:'event',color:'white',description:"A squishy bee who's sweet as sugar. Covers flowers in goo to grant you bonus honey!",giftedHiveBonus:{oper:'*',stat:'honeyPerPollen',num:1.05}
        
    },
    
    precise:{
        
        u:128*14/2048,v:0,meshPartId:1,gatherSpeed:4,gatherAmount:20,speed:11.2,convertSpeed:4,convertAmount:130,tokens:['targetPractice','redBomb_'],attack:8,energy:40,attackTokens:['targetPractice'],favoriteTreat:'sunflowerSeed',rarity:'mythic',color:'red',description:'This sharpshooting bee is always on point and expects the same of you.',giftedHiveBonus:{oper:'+',stat:'superCritChance',num:0.05},trails:[{length:4,size:0.25,triangle:true,color:[219/255,72/255,92/255,1],skipFrame:5,skipAdd:5}]
    },
    
    rage:{
        
        u:128*15/2048,v:0,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:15.4,convertSpeed:4,convertAmount:80,attack:4,tokens:['link'],energy:20,attackTokens:['rage','link'],favoriteTreat:'strawberry',rarity:'epic',color:'red',description:'A very angry bee who has been wronged its whole life. It harnesses its rage to become more powerful.',giftedHiveBonus:{oper:'+',stat:'whiteBeeAttack,redBeeAttack,blueBeeAttack',num:1}
    },
    
    crimson:{
        
        u:128*0/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:18.2,convertSpeed:3,convertAmount:120,tokens:['redPulse','redBombSync'],attack:6,energy:35,rarity:'event',color:'red',description:"A superhero and defender of all things Red! Together with Cobalt Bee it works to unite bees of all colors.",giftedHiveBonus:{oper:'+',stat:'instantRedConversion',num:0.1},trails:[{length:7,size:0.2,triangle:true,color:[1,0,0,1],skipFrame:3,skipAdd:3,beeOffset:-0.05},{length:7,size:0.075,triangle:true,color:[1,1,1,1],skipFrame:3,skipAdd:3,beeOffset:0.05}]
    },
    
    cobalt:{
        
        u:128*1/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:18.2,convertSpeed:3,convertAmount:120,tokens:['bluePulse','blueBombSync'],attack:6,energy:35,rarity:'event',color:'blue',description:"A superhero and defender of all things Blue! Together with Crimson Bee it works to unite bees of all colors.",giftedHiveBonus:{oper:'+',stat:'instantBlueConversion',num:0.1},trails:[{length:7,size:0.2,triangle:true,color:[0,0,1,1],skipFrame:3,skipAdd:3,beeOffset:-0.05},{length:7,size:0.075,triangle:true,color:[1,1,1,1],skipFrame:3,skipAdd:3,beeOffset:0.05}]
    },
    
    photon:{
        
        u:128*2/2048,v:256/2048,meshPartId:6,gatherSpeed:2,gatherAmount:20,speed:21,convertSpeed:2,convertAmount:240,tokens:['beamStorm','haste','whiteBoost'],attackTokens:['haste'],attack:3,energy:Infinity,rarity:'event',color:'white',description:"An entity made of pure light temporarily taking on the form of a bee.",giftedHiveBonus:{oper:'+',stat:'instantWhiteConversion,instantBlueConversion,instantRedConversion',num:0.05},trails:[{length:10,size:0.25,color:[1,1,0,0.5],skipFrame:2,skipAdd:2}]
    },
    
    bumble:{
        
        u:128*3/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:18,speed:10.5,tokens:['blueBomb'],convertSpeed:4,convertAmount:80,attack:1,attackTokens:[],energy:50,favoriteTreat:'blueberry',rarity:'rare',color:'blue',description:'A mellow fellow who moves a little slow, but works harder and longer than others.',giftedHiveBonus:{oper:'*',stat:'capacityMultiplier',num:1.1}
    },
    
    rascal:{
        
        u:128*4/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:16.1,tokens:['redBomb'],convertSpeed:4,convertAmount:80,attack:3,attackTokens:[],energy:20,favoriteTreat:'strawberry',rarity:'rare',color:'red',description:'A mischevious bee who moves quick and hits hard. Keep an eye out on this one!',giftedHiveBonus:{oper:'*',stat:'redBombPollen',num:1.3}
    },
    
    cool:{
        
        u:128*5/2048,v:256/2048,meshPartId:0,gatherSpeed:3,gatherAmount:10,speed:14,tokens:['blueBoost'],convertSpeed:4,convertAmount:80,attack:2,attackTokens:[],energy:20,favoriteTreat:'blueberry',rarity:'rare',color:'blue',description:"A sarcastic bee who's a little better than the others. Sometimes boosts pollen from blue flowers.",giftedHiveBonus:{oper:'*',stat:'bluePollen',num:1.15}
    },
    
    rad:{
        
        u:128*6/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:13,speed:14,tokens:['redBomb'],convertSpeed:3,convertAmount:80,attack:1,attackTokens:[],energy:20,favoriteTreat:'strawberry',rarity:'rare',color:'red',description:'A stylish bee with a taste for red flowers. Everyone wants to be this bee.',giftedHiveBonus:{oper:'*',stat:'redPollen',num:1.15}
    },
    
    brave:{
        
        u:128*7/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:16.8,convertSpeed:4,convertAmount:200,attack:5,energy:30,favoriteTreat:'pineapple',rarity:'rare',color:'white',description:'This loyal bee will do anything to protect its owner.',giftedHiveBonus:{oper:'+',stat:'whiteBeeAttack,redBeeAttack,blueBeeAttack',num:1}
    },
    
    windy:{
        
        u:128*8/2048,v:256/2048,meshPartId:0,gatherSpeed:3,gatherAmount:10,speed:19.6,convertSpeed:2,convertAmount:180,tokens:['whiteBoost','rainCloud','tornado'],attackTokens:[],attack:3,energy:20,rarity:'event',color:'white',description:"An entity made of pure light temporarily taking on the form of a bee.",giftedHiveBonus:{oper:'+',stat:'instantWhiteConversion',num:0.15},trails:[{length:15,size:0.4,color:[0.5,0.5,0.5,0.4],skipFrame:4,skipAdd:4},{length:15,size:0.4,color:[0.5,0.5,0.5,0.4],skipFrame:4,skipAdd:4,vertical:true}]
    },
    
    bucko:{
        
        u:128*9/2048,v:256/2048,meshPartId:8,gatherSpeed:4,gatherAmount:17,speed:15.4,convertSpeed:3,convertAmount:80,attack:5,energy:30,tokens:['blueBoost'],favoriteTreat:'blueberry',rarity:'epic',color:'blue',description:"Leader of the blue bees, and a long time rival of Riley Bee. It's tenacity is it's greatest strength.",giftedHiveBonus:{oper:'*',stat:'blueFieldCapacity',num:1.25}
    },
    
    riley:{
        
        u:128*10/2048,v:256/2048,meshPartId:8,gatherSpeed:2,gatherAmount:10,speed:15.4,convertSpeed:4,convertAmount:140,attack:5,energy:25,tokens:['redBoost'],favoriteTreat:'strawberry',rarity:'epic',color:'red',description:"Leader of the red bees, and a long time rival of Bucko Bee. It's fiery nature has elevated it above the rest.",giftedHiveBonus:{oper:'*',stat:'redFieldCapacity',num:1.25}
    },
    
    commander:{
        
        u:128*11/2048,v:256/2048,meshPartId:9,gatherSpeed:4,gatherAmount:15,speed:14,convertSpeed:4,convertAmount:80,attack:4,energy:30,tokens:['focus','whiteBomb'],attackTokens:['focus'],favoriteTreat:'sunflowerSeed',rarity:'epic',color:'white',description:"A strong, no-nonsense bee who stays level headed when things get rough.",giftedHiveBonus:{oper:'+',stat:'criticalChance',num:0.03}
    },
    
    honey:{
        
        u:128*12/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:14,convertSpeed:2,convertAmount:360,attack:1,energy:20,tokens:['honeyMarkToken'],favoriteTreat:'sunflowerSeed',rarity:'epic',color:'white',description:"A satisfied bee always full with the finest honey. If you're lucky it will share some.",giftedHiveBonus:{oper:'*',stat:'honeyFromTokens',num:1.5}
    },
    
    tabby:{
        
        u:128*13/2048,v:256/2048,meshPartId:10,gatherSpeed:4,gatherAmount:10,speed:16.1,convertSpeed:3,convertAmount:160,attack:4,energy:28,tokens:['scratch','tabbyLove'],rarity:'event',color:'white',description:"This affectionate bee was raised by cats. It becomes a better worker as it warms up to you",giftedHiveBonus:{oper:'+',stat:'criticalPower',num:0.5}
    },
    
    diamond:{
        
        u:128*14/2048,v:256/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:14,convertSpeed:4,convertAmount:1000,attack:1,energy:20,tokens:['blueBomb_'],rarity:'legendary',color:'blue',description:"This affectionate bee was raised by cats. It becomes a better worker as it warms up to you",giftedHiveBonus:{oper:'*',stat:'convertRate',num:1.5},particles:function(bee){ParticleRenderer.add({x:bee.pos[0]+MATH.random(-0.5,0.5),y:bee.pos[1]+MATH.random(-0.5,0.5),z:bee.pos[2]+MATH.random(-0.5,0.5),vx:0,vy:0,vz:0,grav:0,size:MATH.random(15,70),col:[1,1,1],life:0.25,rotVel:MATH.random(-6,6),alpha:1})},favoriteTreat:'blueberry'
    },
    
    demon:{
        
        u:128*15/2048,v:256/2048,meshPartId:11,gatherSpeed:4,gatherAmount:35,speed:10.5,convertSpeed:4,convertAmount:60,attack:8,energy:20,tokens:['redBomb','redBomb_'],rarity:'legendary',color:'red',description:"A powerful bee with magical powers fueled by pure hatred.",giftedHiveBonus:{oper:'+',stat:'instantBombConversion',num:0.15},gatheringPassive:function(bee){if(Math.random()<(bee.gifted?0.75:0.55)){objects.explosions.push(new Explosion({col:[1,0.5,0],pos:[Math.round(bee.pos[0]),bee.pos[1]-0.225,Math.round(bee.pos[2])],life:0.5,size:1.5,speed:0.5,aftershock:0.01,height:0.01}));objects.flames.push(new Flame(player.fieldIn,bee.flowerCollecting[0],bee.flowerCollecting[1]))}},particles:function(bee){ParticleRenderer.add({x:bee.pos[0],y:bee.pos[1],z:bee.pos[2],vx:MATH.random(-0.3,0.3),vy:MATH.random(-0.3,0.3),vz:MATH.random(-0.3,0.3),grav:0,size:MATH.random(80,130),col:[1,MATH.random(0.4,0.7),0],life:1.5,rotVel:MATH.random(-3,3),alpha:2.5})},favoriteTreat:'pineapple'
    },
    
    carpenter:{
        
        u:128*0/2048,v:256*2/2048,meshPartId:12,gatherSpeed:3,gatherAmount:10,speed:11.2,convertSpeed:4,convertAmount:120,attack:4,energy:25,tokens:['pollenMarkToken','honeyMarkToken'],rarity:'legendary',color:'white',description:"A bee with a knack for construction. It built its own body out of wood.",giftedHiveBonus:{oper:'*',stat:'pollenFromTools',num:1.25},favoriteTreat:'sunflowerSeed'
    },
    
    lion:{
        
        u:128*1/2048,v:256*2/2048,meshPartId:13,gatherSpeed:4,gatherAmount:20,speed:19.6,convertSpeed:2,convertAmount:160,attack:9,energy:60,tokens:['whiteBomb_'],rarity:'legendary',color:'white',description:"Half lion, half bee. This is the king of both the jungle and bee hive.",giftedHiveBonus:{oper:'+',stat:'whiteBeeAttack',num:2},favoriteTreat:'pineapple'
    },
    
    ninja:{
        
        u:128*2/2048,v:256*2/2048,meshPartId:0,gatherSpeed:2,gatherAmount:10,speed:21,convertSpeed:2,convertAmount:80,attack:4,energy:20,tokens:['haste','blueBomb_'],rarity:'legendary',color:'white',description:"This bee trained vigorously for years to become the swiftest bee that has ever lived.",giftedHiveBonus:{oper:'*',stat:'beeSpeed',num:1.05},favoriteTreat:'sunflowerSeed'
    },
    
    shy:{
        
        u:128*3/2048,v:256*2/2048,meshPartId:0,gatherSpeed:2,gatherAmount:10,speed:18.2,convertSpeed:4,convertAmount:320,attack:2,energy:40,tokens:['redBoost','redBomb_'],rarity:'legendary',color:'white',description:"This talented bee doesn't like to socialize, it just wants to work and be left alone.",giftedHiveBonus:{oper:'*',stat:'redBeeAbilityRate',num:1.15},favoriteTreat:'sunflowerSeed',particles:function(bee){if(Math.random()<0.2){ParticleRenderer.add({x:bee.pos[0],y:bee.pos[1],z:bee.pos[2],vx:MATH.random(-0.1,0.1),vy:MATH.random(-0.1,0.1),vz:MATH.random(-0.1,0.1),grav:0,size:MATH.random(200,350),col:[0.6,0.6,0.6],life:1.5,rotVel:MATH.random(-2,2),alpha:0.25})}}
    },
    
    demo:{
        
        u:128*4/2048,v:256*2/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:16.8,convertSpeed:4,convertAmount:200,attack:3,energy:20,tokens:['whiteBomb_'],rarity:'epic',color:'white',description:"An elite Bomber Bee who has worked its way up the ranks. It is an expert in explosives.",giftedHiveBonus:{oper:'*',stat:'whiteBombPollen',num:1.3},favoriteTreat:'sunflowerSeed'
    },
    
    exhausted:{
        
        u:128*5/2048,v:256*2/2048,meshPartId:0,gatherSpeed:4.6,gatherAmount:10,speed:10.5,convertSpeed:4,convertAmount:240,attack:1,energy:Infinity,tokens:['whiteBomb','link'],rarity:'epic',color:'white',description:"This bee suffers from insomnia. It moves slowly, but it never has to sleep.",giftedHiveBonus:{oper:'*',stat:'whiteFieldCapacity',num:1.2},favoriteTreat:'pineapple'
    },
    
    shocked:{
        
        u:128*6/2048,v:256*2/2048,meshPartId:0,gatherSpeed:4,gatherAmount:10,speed:19.6,convertSpeed:2,convertAmount:80,attack:2,energy:Infinity,tokens:['haste','link'],rarity:'epic',color:'white',description:"This bee is startled by everything it comes across. It has learned special talents to cope.",giftedHiveBonus:{oper:'*',stat:'whitePollen',num:1.25},favoriteTreat:'pineapple'
    },
    
    frosty:{
        
        u:128*7/2048,v:256*2/2048,meshPartId:14,gatherSpeed:4,gatherAmount:10,speed:11.2,convertSpeed:4,convertAmount:80,attack:1,energy:25,tokens:['blueBoost','blueBomb_'],rarity:'epic',color:'white',description:"A bee made of snow. It magically came to life after someone put a top hat on its head.",giftedHiveBonus:{oper:'*',stat:'blueBombPollen',num:1.3},favoriteTreat:'blueberry'
    },
    
    baby:{
        
        u:128*8/2048,v:256*2/2048,meshPartId:0,gatherSpeed:5,gatherAmount:10,speed:10.5,convertSpeed:5,convertAmount:80,attack:0,energy:15,tokens:['babyLove'],rarity:'legendary',color:'white',description:"This little bee isn't very good at bee tasks yet, but it's guaranteed to bring you joy (and luck).",giftedHiveBonus:{oper:'+',stat:'lootLuck',num:0.25},favoriteTreat:'strawberry'
    },

    vicious:{
        
        u:128*9/2048,v:256*2/2048,meshPartId:15,gatherSpeed:4,gatherAmount:10,speed:17.5,convertSpeed:4,convertAmount:80,attack:8,energy:50,tokens:['blueBomb_'],attackTokens:['impale'],rarity:'event',color:'blue',description:"This cold-blooded bee takes great pleasure in inflicting pain.",giftedHiveBonus:{oper:'*',stat:'monsterRespawnTime',num:1.15}
    },

    bear:{
        
        u:128*10/2048,v:256*2/2048,meshPartId:16,gatherSpeed:2,gatherAmount:15,speed:14,convertSpeed:2,convertAmount:200,attack:5,energy:35,tokens:[],attackTokens:[],rarity:'event',color:'white',description:"A friendly bee who periodically transforms you into a bear!",giftedHiveBonus:{oper:'*',stat:'redPollen,bluePollen,whitePollen',num:1.1}
    },

    puppy:{
        
        u:128*11/2048,v:256*2/2048,meshPartId:17,gatherSpeed:4,gatherAmount:25,speed:16.1,convertSpeed:4,convertAmount:280,attack:2,energy:40,tokens:[],attackTokens:[],rarity:'event',color:'white',description:"A playful bee who only cares about two things, its tennis ball and you!",giftedHiveBonus:{oper:'*',stat:'bondFromTreats',num:1.2}
    },

    festive:{
        
        u:128*12/2048,v:256*2/2048,meshPartId:18,gatherSpeed:4,gatherAmount:40,speed:16.1,convertSpeed:1,convertAmount:150,attack:1,energy:20,tokens:['redBomb_','honeyMarkToken'],attackTokens:[],rarity:'event',color:'red',description:"A jolly bee who loves giving gifts! It's purely motivated by the joy of others.",giftedHiveBonus:{oper:'*',stat:'redPollen',num:1.15}
    },

    digital:{
        
        u:128*13/2048,v:256*2/2048,meshPartId:19,gatherSpeed:4,gatherAmount:10,speed:11.9,convertSpeed:4,convertAmount:80,attack:1,energy:20,tokens:['glitch','mapCorruption*'],attackTokens:['mindHack'],rarity:'event',color:'white',description:"A virtual bee with malfunctioning AI. It corrupts the game itself.",giftedHiveBonus:{oper:'+',stat:'abilityDuplicationChance',num:0.01}
    },
}

let effects={

    dandelionFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('dandelionFieldBoost'),
        cooldown:document.getElementById('dandelionFieldBoost_cooldown'),
        amount:document.getElementById('dandelionFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='DandelionField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Dandelion Field Boost\nx'+(amount+1)+' pollen in dandelion field'
        }
    },

    sunflowerFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('sunflowerFieldBoost'),
        cooldown:document.getElementById('sunflowerFieldBoost_cooldown'),
        amount:document.getElementById('sunflowerFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='SunflowerField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Sunflower Field Boost\nx'+(amount+1)+' pollen in sunflower field'
        }
    },

    blueFlowerFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('blueFlowerFieldBoost'),
        cooldown:document.getElementById('blueFlowerFieldBoost_cooldown'),
        amount:document.getElementById('blueFlowerFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='BlueFlowerField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Flower Field Boost\nx'+(amount+1)+' pollen in blue flower field'
        }
    },

    mushroomFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('mushroomFieldBoost'),
        cooldown:document.getElementById('mushroomFieldBoost_cooldown'),
        amount:document.getElementById('mushroomFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='MushroomField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Mushroom Field Boost\nx'+(amount+1)+' pollen in mushroom field'
        }
    },

    cloverFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('cloverFieldBoost'),
        cooldown:document.getElementById('cloverFieldBoost_cooldown'),
        amount:document.getElementById('cloverFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='CloverField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Clover Field Boost\nx'+(amount+1)+' pollen in clover field'
        }
    },

    strawberryFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('strawberryFieldBoost'),
        cooldown:document.getElementById('strawberryFieldBoost_cooldown'),
        amount:document.getElementById('strawberryFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='StrawberryField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Strawberry Field Boost\nx'+(amount+1)+' pollen in strawberry field'
        }
    },

    spiderFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('spiderFieldBoost'),
        cooldown:document.getElementById('spiderFieldBoost_cooldown'),
        amount:document.getElementById('spiderFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='SpiderField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Spider Field Boost\nx'+(amount+1)+' pollen in spider field'
        }
    },

    bambooFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('bambooFieldBoost'),
        cooldown:document.getElementById('bambooFieldBoost_cooldown'),
        amount:document.getElementById('bambooFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='BambooField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Bamboo Field Boost\nx'+(amount+1)+' pollen in bamboo field'
        }
    },

    pineapplePatchBoost:{
        
        u:0,v:0,
        svg:document.getElementById('pineapplePatchBoost'),
        cooldown:document.getElementById('pineapplePatchBoost_cooldown'),
        amount:document.getElementById('pineapplePatchBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PineapplePatch'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pineapple Patch Boost\nx'+(amount+1)+' pollen in pineapple patch'
        }
    },

    stumpFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('stumpFieldBoost'),
        cooldown:document.getElementById('stumpFieldBoost_cooldown'),
        amount:document.getElementById('stumpFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='StumpField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Stump Field Boost\nx'+(amount+1)+' pollen in stump field'
        }
    },

    cactusFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('cactusFieldBoost'),
        cooldown:document.getElementById('cactusFieldBoost_cooldown'),
        amount:document.getElementById('cactusFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='CactusField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Cactus Field Boost\nx'+(amount+1)+' pollen in cactus field'
        }
    },

    pumpkinPatchBoost:{
        
        u:0,v:0,
        svg:document.getElementById('pumpkinPatchBoost'),
        cooldown:document.getElementById('pumpkinPatchBoost_cooldown'),
        amount:document.getElementById('pumpkinPatchBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PumpkinPatch'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pumpkin Patch Boost\nx'+(amount+1)+' pollen in pumpkin patch'
        }
    },

    pineTreeForestBoost:{
        
        u:0,v:0,
        svg:document.getElementById('pineTreeForestBoost'),
        cooldown:document.getElementById('pineTreeForestBoost_cooldown'),
        amount:document.getElementById('pineTreeForestBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PineTreeForest'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pine Tree Forest Boost\nx'+(amount+1)+' pollen in pine tree forest'
        }
    },

    roseFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('roseFieldBoost'),
        cooldown:document.getElementById('roseFieldBoost_cooldown'),
        amount:document.getElementById('roseFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='RoseField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Rose Field Boost\nx'+(amount+1)+' pollen in rose field'
        }
    },

    mountainTopFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('mountainTopFieldBoost'),
        cooldown:document.getElementById('mountainTopFieldBoost_cooldown'),
        amount:document.getElementById('mountainTopFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='MountainTopField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Mountain Top Field Boost\nx'+(amount+1)+' pollen in mountain top field'
        }
    },

    coconutFieldBoost:{
        
        u:0,v:0,
        svg:document.getElementById('coconutFieldBoost'),
        cooldown:document.getElementById('coconutFieldBoost_cooldown'),
        amount:document.getElementById('coconutFieldBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='CoconutField'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Coconut Field Boost\nx'+(amount+1)+' pollen in coconut field'
        }
    },

    pepperPatchBoost:{
        
        u:0,v:0,
        svg:document.getElementById('pepperPatchBoost'),
        cooldown:document.getElementById('pepperPatchBoost_cooldown'),
        amount:document.getElementById('pepperPatchBoost_amount'),
        maxCooldown:10*60,
        maxAmount:4,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PepperPatch'){

                player.redPollen*=amount+1
                player.whitePollen*=amount+1
                player.bluePollen*=amount+1
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pepper Patch Boost\nx'+(amount+1)+' pollen in pepper patch'
        }
    },

    dandelionFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('dandelionFieldWinds'),
        cooldown:document.getElementById('dandelionFieldWinds_cooldown'),
        amount:document.getElementById('dandelionFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='DandelionField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Dandelion Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in dandelion field'+'\n+'+((amount-1)*3+25)+'% instant conversion in dandelion field'
        }
    },

    sunflowerFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('sunflowerFieldWinds'),
        cooldown:document.getElementById('sunflowerFieldWinds_cooldown'),
        amount:document.getElementById('sunflowerFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='SunflowerField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Sunflower Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in sunflower field'+'\n+'+((amount-1)*3+25)+'% instant conversion in sunflower field'
        }
    },

    blueFlowerFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('blueFlowerFieldWinds'),
        cooldown:document.getElementById('blueFlowerFieldWinds_cooldown'),
        amount:document.getElementById('blueFlowerFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='BlueFlowerField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Flower Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in blue flower field'+'\n+'+((amount-1)*3+25)+'% instant conversion in blue flower field'
        }
    },

    mushroomFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('mushroomFieldWinds'),
        cooldown:document.getElementById('mushroomFieldWinds_cooldown'),
        amount:document.getElementById('mushroomFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='MushroomField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Mushroom Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in mushroom field'+'\n+'+((amount-1)*3+25)+'% instant conversion in mushroom field'
        }
    },

    cloverFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('cloverFieldWinds'),
        cooldown:document.getElementById('cloverFieldWinds_cooldown'),
        amount:document.getElementById('cloverFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='CloverField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Clover Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in clover field'+'\n+'+((amount-1)*3+25)+'% instant conversion in clover field'
        }
    },

    strawberryFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('strawberryFieldWinds'),
        cooldown:document.getElementById('strawberryFieldWinds_cooldown'),
        amount:document.getElementById('strawberryFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='StrawberryField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Strawberry Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in strawberry field'+'\n+'+((amount-1)*3+25)+'% instant conversion in strawberry field'
        }
    },

    spiderFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('spiderFieldWinds'),
        cooldown:document.getElementById('spiderFieldWinds_cooldown'),
        amount:document.getElementById('spiderFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='SpiderField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Spider Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in spider field'+'\n+'+((amount-1)*3+25)+'% instant conversion in spider field'
        }
    },

    bambooFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('bambooFieldWinds'),
        cooldown:document.getElementById('bambooFieldWinds_cooldown'),
        amount:document.getElementById('bambooFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='BambooField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Bamboo Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in bamboo field'+'\n+'+((amount-1)*3+25)+'% instant conversion in bamboo field'
        }
    },

    pineapplePatchWinds:{
        
        u:0,v:0,
        svg:document.getElementById('pineapplePatchWinds'),
        cooldown:document.getElementById('pineapplePatchWinds_cooldown'),
        amount:document.getElementById('pineapplePatchWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PineapplePatch'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pineapple Patch Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in pineapple patch'+'\n+'+((amount-1)*3+25)+'% instant conversion in pineapple patch'
        }
    },

    stumpFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('stumpFieldWinds'),
        cooldown:document.getElementById('stumpFieldWinds_cooldown'),
        amount:document.getElementById('stumpFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='StumpField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Stump Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in stump field'+'\n+'+((amount-1)*3+25)+'% instant conversion in stump field'
        }
    },

    cactusFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('cactusFieldWinds'),
        cooldown:document.getElementById('cactusFieldWinds_cooldown'),
        amount:document.getElementById('cactusFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='CactusField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Cactus Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in cactus field'+'\n+'+((amount-1)*3+25)+'% instant conversion in cactus field'
        }
    },

    pumpkinPatchWinds:{
        
        u:0,v:0,
        svg:document.getElementById('pumpkinPatchWinds'),
        cooldown:document.getElementById('pumpkinPatchWinds_cooldown'),
        amount:document.getElementById('pumpkinPatchWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PumpkinPatch'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pumpkin Patch Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in pumpkin patch'+'\n+'+((amount-1)*3+25)+'% instant conversion in pumpkin patch'
        }
    },

    pineTreeForestWinds:{
        
        u:0,v:0,
        svg:document.getElementById('pineTreeForestWinds'),
        cooldown:document.getElementById('pineTreeForestWinds_cooldown'),
        amount:document.getElementById('pineTreeForestWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PineTreeForest'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pine Tree Forest Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in pine tree forest'+'\n+'+((amount-1)*3+25)+'% instant conversion in pine tree forest'
        }
    },

    roseFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('roseFieldWinds'),
        cooldown:document.getElementById('roseFieldWinds_cooldown'),
        amount:document.getElementById('roseFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='RoseField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Rose Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in rose field'+'\n+'+((amount-1)*3+25)+'% instant conversion in rose field'
        }
    },

    mountainTopFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('mountainTopFieldWinds'),
        cooldown:document.getElementById('mountainTopFieldWinds_cooldown'),
        amount:document.getElementById('mountainTopFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='MountainTopField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Mountain Top Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in mountain top field'+'\n+'+((amount-1)*3+25)+'% instant conversion in mountain top field'
        }
    },

    coconutFieldWinds:{
        
        u:0,v:0,
        svg:document.getElementById('coconutFieldWinds'),
        cooldown:document.getElementById('coconutFieldWinds_cooldown'),
        amount:document.getElementById('coconutFieldWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='CoconutField'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Coconut Field Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in coconut field'+'\n+'+((amount-1)*3+25)+'% instant conversion in coconut field'
        }
    },

    pepperPatchWinds:{
        
        u:0,v:0,
        svg:document.getElementById('pepperPatchWinds'),
        cooldown:document.getElementById('pepperPatchWinds_cooldown'),
        amount:document.getElementById('pepperPatchWinds_amount'),
        maxCooldown:10*60,
        maxAmount:15,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            if(player.fieldIn==='PepperPatch'){

                player.redPollen*=(amount-1)*0.05+1.35
                player.whitePollen*=(amount-1)*0.05+1.35
                player.bluePollen*=(amount-1)*0.05+1.35
                player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,(amount-1)*0.03+0.25)
                player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,(amount-1)*0.03+0.25)
                player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,(amount-1)*0.03+0.25)
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Pepper Patch Winds\nx'+((amount-1)*0.05+1.35).toFixed(2)+' pollen in pepper patch'+'\n+'+((amount-1)*3+25)+'% instant conversion in pepper patch'
        }
    },
    
    haste:{
        
        trialCooldown:15,trialRate:0.5,
        statsToAddTo:['hasteTokens'],
        u:0,v:0,
        svg:document.getElementById('haste'),
        cooldown:document.getElementById('haste_cooldown'),
        amount:document.getElementById('haste_amount'),
        maxCooldown:20,
        maxAmount:10,
        tokenLife:4,
        sound:function(){playSound('haste',0.35)},
        
        update:(amount,player)=>{
            
            player.walkSpeed*=amount*0.1+1
            player.hasteStacks=amount
        },
        
        getMessage:(amount)=>{
            
            return 'Haste\nx'+((player.defaultStats.walkSpeed*(amount*0.1+1))/player.defaultStats.walkSpeed).toFixed(1)+' movespeed'
        }
    },
    
    haste__:{
        
        svg:document.getElementById('haste__'),
        cooldown:document.getElementById('haste___cooldown'),
        amount:document.getElementById('haste___amount'),
        maxCooldown:45*99,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.walkSpeed*=2
        },
        
        getMessage:(amount)=>{
            
            return 'Haste++\nx2 movespeed'
        }
    },
    
    focus:{
        
        trialCooldown:20,trialRate:0.5,
        statsToAddTo:['focusTokens','battleTokens'],
        u:128/2048,v:0,
        svg:document.getElementById('focus'),
        cooldown:document.getElementById('focus_cooldown'),
        amount:document.getElementById('focus_amount'),
        maxCooldown:20,
        maxAmount:10,
        tokenLife:4,
        sound:function(){playSound('focusToken',0.3)},
        
        update:(amount,player)=>{
            
            player.criticalChance+=0.03*amount
        },
        
        getMessage:(amount)=>{
            
            return 'Focus\n'+amount*3+'% critical chance'
        }
    },
    
    melody:{
        
        trialCooldown:35,trialRate:0.35,
        statsToAddTo:['melodyTokens','battleTokens'],
        u:256/2048,v:0,
        svg:document.getElementById('melody'),
        cooldown:document.getElementById('melody_cooldown'),
        amount:document.getElementById('melody_amount'),
        maxCooldown:30,
        maxAmount:1,
        tokenLife:8,
        sound:function(){playSound('melodyToken',0.5)},
        
        update:(amount,player)=>{
            
            player.criticalPower+=1
        },
        
        getMessage:(amount)=>{
            
            return 'Melody\n+100% critical power'
        }
    },
    
    link:{
        
        trialCooldown:20,trialRate:0.75,
        statsToAddTo:['battleTokens'],
        u:128*3/2048,v:0,
        canBeLinked:false,
        tokenLife:4,
        
        func:function(){
            
            for(let i in objects.tokens){
                
                if(objects.tokens[i].canBeLinked&&!(objects.tokens[i] instanceof DupedToken)){
                    
                    objects.tokens[i].collect()
                }
            }
        },
        backupFunc:function(){
            
            for(let i in objects.tokens){
                
                if(objects.tokens[i].canBeLinked&&!(objects.tokens[i] instanceof DupedToken)){
                    
                    objects.tokens[i].collect()
                }
            }
        }
    },
    
    bombCombo:{
        
        u:128*4/2048,v:0,
        svg:document.getElementById('bombCombo'),
        cooldown:document.getElementById('bombCombo_cooldown'),
        amount:document.getElementById('bombCombo_amount'),
        maxCooldown:5,
        maxAmount:10,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.redBombPollen*=amount*0.2+1
            player.whiteBombPollen*=amount*0.2+1
            player.blueBombPollen*=amount*0.2+1
        },
        
        getMessage:(amount)=>{
            
            return 'Bomb Combo\nx'+(amount*0.2+1).toFixed(1)+' bomb power'
        }
    },
    
    whiteBomb:{
        
        trialCooldown:15,trialRate:0.3,
        statsToAddTo:['bombTokens'],
        u:128*4/2048,v:0,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                let b=(params.bee.level-1)*0.1+1
                
                collectPollen({x:params.x,z:params.z,pattern:[[-3,0],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[3,0]],amount:7.5,stackOffset:0.4+Math.random()*0.5,multiplier:b*player.whiteBombPollen,instantConversion:player.instantBombConversion})
                
                objects.explosions.push(new Explosion({col:[1,1,1],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.3,size:4,speed:0.35,aftershock:0.05}))
                
            }
            
            player.addEffect('bombCombo')
            playSound('bombToken',0.5)
        }
    },
    
    redBomb:{
        
        trialCooldown:15,trialRate:0.3,
        statsToAddTo:['redBombTokens','redAbilityTokens','bombTokens'],
        u:128*5/2048,v:0,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                let b=(params.bee.level-1)*0.1+1
                
                collectPollen({x:params.x,z:params.z,pattern:[[-3,0],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[3,0]],amount:{r:10,w:player.redBombSync?7.5:0,b:player.redBombSync&&player.blueBombSync?5:0},stackOffset:0.4+Math.random()*0.5,multiplier:b*player.redBombPollen,instantConversion:player.instantBombConversion})
                
                objects.explosions.push(new Explosion({col:[1,0,0],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.3,size:4,speed:0.35,aftershock:0.05}))
                
            }
            
            player.addEffect('bombCombo')
            playSound('bombToken',0.5)
        }
    },
    
    blueBomb:{
        
        trialCooldown:15,trialRate:0.3,
        statsToAddTo:['blueBombTokens','blueAbilityTokens','bombTokens'],
        u:128*6/2048,v:0,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                let b=(params.bee.level-1)*0.1+1
                
                collectPollen({x:params.x,z:params.z,pattern:[[-3,0],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[2,-2],[2,-1],[2,0],[2,1],[2,2],[3,0]],amount:{r:player.blueBombSync&&player.redBombSync?5:0,w:player.blueBombSync?7.5:0,b:10},stackOffset:0.4+Math.random()*0.5,multiplier:b*player.blueBombPollen,instantConversion:player.instantBombConversion})
                
                objects.explosions.push(new Explosion({col:[0,0,1],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.3,size:4,speed:0.35,aftershock:0.05}))
                
            }
            
            player.addEffect('bombCombo')
            playSound('bombToken',0.5)
        }
    },
    
    whiteBomb_:{
        
        trialCooldown:15,trialRate:0.4,
        statsToAddTo:['bombTokens'],
        u:128*7/2048,v:0,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                let b=(params.bee.level-1)*0.15+1
                
                collectPollen({x:params.x,z:params.z,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:10,stackHeight:0.4+Math.random()*0.5,multiplier:b*player.whiteBombPollen,instantConversion:player.instantBombConversion})
                
                objects.explosions.push(new Explosion({col:[1,1,1],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.3,size:4,speed:0.35,aftershock:0.05}))
                
            }
            
            player.addEffect('bombCombo')
            playSound('bombToken',0.5)
        }
    },
    
    redBomb_:{
        
        trialCooldown:20,trialRate:0.3,
        statsToAddTo:['redBombTokens','redAbilityTokens','bombTokens'],
        u:0,v:128/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                let b=(params.bee.level-1)*0.2+1
                
                collectPollen({x:params.x,z:params.z,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:{r:12.5,w:player.redBombSync?10:0,b:player.redBombSync&&player.blueBombSync?7.5:0},stackHeight:0.4+Math.random()*0.5,multiplier:b*player.redBombPollen,instantConversion:player.instantBombConversion})
                
                objects.explosions.push(new Explosion({col:[1,0,0],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.3,size:4,speed:0.35,aftershock:0.05}))
                
            }
            
            player.addEffect('bombCombo')
            playSound('bombToken',0.5)
        }
    },
    
    blueBomb_:{
        
        trialCooldown:20,trialRate:0.3,
        statsToAddTo:['blueBombTokens','blueAbilityTokens','bombTokens'],
        u:128/2048,v:128/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                let b=(params.bee.level-1)*0.2+1
                
                collectPollen({x:params.x,z:params.z,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:{b:12.5,w:player.blueBombSync?10:0,r:player.blueBombSync&&player.redBombSync?7.5:0},stackHeight:0.4+Math.random()*0.5,multiplier:b*player.blueBombPollen})
                
                objects.explosions.push(new Explosion({col:[0,0,1],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.3,size:4,speed:0.35,aftershock:0.05,instantConversion:player.instantBombConversion}))
                
            }
            
            player.addEffect('bombCombo')
            playSound('bombToken',0.5)
        }
    },
    
    blueBoost:{
        
        trialCooldown:25,trialRate:0.6,
        statsToAddTo:['blueBoostTokens','blueAbilityTokens','boostTokens','markOrBoostTokens'],
        u:128*2/2048,v:128/2048,
        svg:document.getElementById('blueBoost'),
        cooldown:document.getElementById('blueBoost_cooldown'),
        amount:document.getElementById('blueBoost_amount'),
        maxCooldown:15,
        maxAmount:10,
        tokenLife:4,
        sound:function(){playSound('boostToken',0.2)},
        
        update:(amount,player)=>{
            
            player.bluePollen*=amount*0.2+1
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Boost\nx'+(amount*0.2+1).toFixed(1)+' blue pollen'
        }
    },
    
    redBoost:{
        
        trialCooldown:25,trialRate:0.6,
        statsToAddTo:['redBoostTokens','redAbilityTokens','boostTokens','markOrBoostTokens'],
        u:128*3/2048,v:128/2048,
        svg:document.getElementById('redBoost'),
        cooldown:document.getElementById('redBoost_cooldown'),
        amount:document.getElementById('redBoost_amount'),
        maxCooldown:15,
        maxAmount:10,
        tokenLife:4,
        sound:function(){playSound('boostToken',0.2)},
        
        update:(amount,player)=>{
            
            player.redPollen*=amount*0.2+1
        },
        
        getMessage:(amount)=>{
            
            return 'Red Boost\nx'+(amount*0.2+1).toFixed(1)+' red pollen'
        }
    },
    
    whiteBoost:{
        
        trialCooldown:15,trialRate:0.8,
        statsToAddTo:['boostTokens','markOrBoostTokens'],
        u:128*4/2048,v:128/2048,
        svg:document.getElementById('whiteBoost'),
        cooldown:document.getElementById('whiteBoost_cooldown'),
        amount:document.getElementById('whiteBoost_amount'),
        maxCooldown:15,
        maxAmount:10,
        tokenLife:4,
        sound:function(){playSound('boostToken',0.2)},
        
        update:(amount,player)=>{
            
            player.whitePollen*=amount*0.2+1
        },
        
        getMessage:(amount)=>{
            
            return 'White Boost\nx'+(amount*0.2+1).toFixed(1)+' white pollen'
        }
    },
    
    babyLove:{
        
        trialCooldown:35,trialRate:0.6,
        u:128*1/2048,v:256*4/2048,
        svg:document.getElementById('babyLove'),
        cooldown:document.getElementById('babyLove_cooldown'),
        amount:document.getElementById('babyLove_amount'),
        maxCooldown:30,
        maxAmount:1,
        tokenLife:8,
        sound:function(){playSound('babyLove',0.4)},
        
        update:(amount,player)=>{
            
            player.redPollen*=2
            player.whitePollen*=2
            player.bluePollen*=2
            player.lootLuck+=0.5
        },
        
        getMessage:(amount)=>{
            
            return 'Baby Love\nx2 pollen\n+50% Loot Luck'
        }
    },
    
    inspire:{
        
        trialCooldown:60,trialRate:0.02,
        statsToAddTo:['inspireTokens'],
        u:128*2/2048,v:256*4/2048,
        svg:document.getElementById('inspire'),
        cooldown:document.getElementById('inspire_cooldown'),
        amount:document.getElementById('inspire_amount'),
        maxCooldown:7.5,
        maxAmount:50,
        tokenLife:8,
        sound:function(){playSound('inspireToken',0.4)},
        
        update:(amount,player)=>{
            
            player.redPollen*=amount+1
            player.whitePollen*=amount+1
            player.bluePollen*=amount+1
        },
        
        getMessage:(amount)=>{
            
            return 'Inspire\nx'+(amount+1)+' pollen'
        }
    },
    
    rage:{
        
        trialCooldown:25,trialRate:0.8,
        statsToAddTo:['rageTokens','battleTokens','redAbilityTokens'],
        u:128*6/2048,v:256*2/2048,
        svg:document.getElementById('rage'),
        cooldown:document.getElementById('rage_cooldown'),
        amount:document.getElementById('rage_amount'),
        maxCooldown:30,
        maxAmount:3,
        tokenLife:24,
        sound:function(){playSound('rageToken',1)},
        
        update:(amount,player)=>{
            
            player.whiteBeeAttack+=amount
            player.blueBeeAttack+=amount
            player.redBeeAttack+=amount
        },
        
        getMessage:(amount)=>{
            
            return 'Rage\n+'+amount+' bee attack'
        }
    },
    
    flameHeat:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('flameHeat'),
        cooldown:document.getElementById('flameHeat_cooldown'),
        amount:document.getElementById('flameHeat_amount'),
        maxCooldown:20,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.redPollen*=amount+1
            player.beeAttack*=amount*0.2+1
            player.flameHeatStack=amount+1
        },
        
        getMessage:(amount)=>{
            
            return 'Flame Heat\nx'+(amount+1).toFixed(2)+'  red pollen\nx'+(amount*0.2+1).toFixed(2)+' bee attack'
        }
    },
    
    darkHeat:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('darkHeat'),
        cooldown:document.getElementById('darkHeat_cooldown'),
        amount:document.getElementById('darkHeat_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:100,
        
        update:(amount,player)=>{
            
            player.superCritPower*=amount*0.06+1
            player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,amount*0.0025)
            player.beeAttack*=amount*0.02+1
        },
        
        getMessage:(amount)=>{
            
            return 'Dark Heat\nx'+(amount*0.06+1).toFixed(2)+' super-crit power\n+'+((amount*0.25)|0)+'% instant red conversion\nx'+(amount*0.02+1)+' bee attack'
        }
    },
    
    pollenMarkToken:{
        
        trialCooldown:20,trialRate:0.4,
        statsToAddTo:['markTokens','markOrBoostTokens'],
        u:128*6/2048,v:128/2048,
        tokenLife:8,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                objects.marks.push(new Mark(params.field,(Math.random()*fieldInfo[params.field].width)|0,(Math.random()*fieldInfo[params.field].length)|0,'pollenMark',params.bee.level))
                
            }
            
            playSound('markToken',0.6)
        }
    },
    
    honeyMarkToken:{
        
        trialCooldown:17.5,trialRate:0.5,
        statsToAddTo:['markTokens','markOrBoostTokens'],
        u:128*7/2048,v:128/2048,
        tokenLife:8,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                objects.marks.push(new Mark(params.field,(Math.random()*fieldInfo[params.field].width)|0,(Math.random()*fieldInfo[params.field].length)|0,'honeyMark',params.bee.level))
                
            }
            
            playSound('markToken',0.6)
        }
    },
    
    preciseMarkToken:{
        
        trialCooldown:30,trialRate:0.5,
        statsToAddTo:['markTokens','markOrBoostTokens'],
        u:128*0/2048,v:128*8/2048,
        tokenLife:8,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                objects.marks.push(new Mark(params.field,(Math.random()*fieldInfo[params.field].width)|0,(Math.random()*fieldInfo[params.field].length)|0,'preciseMark',params.bee.level))
                
            }
        }
    },
    
    pollenMark:{
        
        u:0,v:0,
        svg:document.getElementById('pollenMark'),
        cooldown:document.getElementById('pollenMark_cooldown'),
        amount:document.getElementById('pollenMark_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:3,
        
        update:(amount,player)=>{
            
            let a=amount*0.5+1
            player.whitePollen*=a
            player.redPollen*=a
            player.bluePollen*=a
        },
        
        getMessage:(amount)=>{
            
            return 'Pollen Mark\nx'+(amount*0.5+1)+' pollen'
        }
    },
    
    honeyMark:{
        
        u:0,v:0,
        svg:document.getElementById('honeyMark'),
        cooldown:document.getElementById('honeyMark_cooldown'),
        amount:document.getElementById('honeyMark_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:3,
        
        update:(amount,player)=>{
            
            if(TIME-honeyMarkConvert>1){
                
                honeyMarkConvert=TIME
                
                let a=Math.min(Math.round(player.capacity*amount*0.05),player.pollen)
                player.pollen-=a
                player.honey+=Math.ceil(a*player.honeyPerPollen)
                if(player.setting_enablePollenText)
                    textRenderer.add(a,[player.body.position.x,player.body.position.y+2,player.body.position.z],COLORS.honey,0,'+')
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Honey Mark\nConverts '+Math.round(player.convertTotal*amount*0.15)+' pollen/sec.'
        }
    },
    
    preciseMark:{
        
        u:0,v:0,
        svg:document.getElementById('preciseMark'),
        cooldown:document.getElementById('preciseMark_cooldown'),
        amount:document.getElementById('preciseMark_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:3,
        
        update:(amount,player)=>{
            
            player.criticalChance+=amount*0.07
            player.superCritChance+=amount*0.07
        },
        
        getMessage:(amount)=>{
            
            return 'Precise Mark\n+'+amount*7+'% critical chance\n+'+amount*7+'% super-crit chance'
        }
    },
    
    inferno:{
        
        trialCooldown:20,trialRate:0.5,
        statsToAddTo:['redAbilityTokens','battleTokens'],
        u:0,v:256/2048,
        tokenLife:4,
        sound:function(){playSound('infernoToken',0.4)},
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                if(params.x>=0&&params.x<fieldInfo[params.field].width&&params.z-1>=0&&params.z-1<fieldInfo[params.field].length){
                    
                    objects.flames.push(new Flame(params.field,params.x,params.z-1))
                }
                
                if(params.x>=0&&params.x<fieldInfo[params.field].width&&params.z+1>=0&&params.z+1<fieldInfo[params.field].length){
                    
                    objects.flames.push(new Flame(params.field,params.x,params.z+1))
                }
                
                if(params.x-1>=0&&params.x-1<fieldInfo[params.field].width&&params.z>=0&&params.z<fieldInfo[params.field].length){
                    
                    objects.flames.push(new Flame(params.field,params.x-1,params.z))
                }
                
                if(params.x+1>=0&&params.x+1<fieldInfo[params.field].width&&params.z>=0&&params.z<fieldInfo[params.field].length){
                    
                    objects.flames.push(new Flame(params.field,params.x+1,params.z))
                }
                
                objects.tempBees.push(new TempBee([fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],'fire',Math.max(params.bee.level-2,1),15+params.bee.level,params.bee.gifted))
                
                objects.tempBees.push(new TempBee([fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],'fire',Math.max(params.bee.level-2,1),15+params.bee.level,params.bee.gifted))
                
                objects.explosions.push(new Explosion({col:[1,0.5,0],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.5,size:5,speed:0.25,aftershock:0.005}))
            }
        },
        backupFunc:function(params){
            
            objects.tempBees.push(new TempBee(params.pos,'fire',Math.max(params.bee.level-2,1),15+params.bee.level,params.bee.gifted))
            
            objects.flames.push(new Flame(params.pos[0]-1,params.pos[1],params.pos[2],true))
            objects.flames.push(new Flame(params.pos[0]+1,params.pos[1],params.pos[2],true))
            objects.flames.push(new Flame(params.pos[0],params.pos[1],params.pos[2]+1,true))
            objects.flames.push(new Flame(params.pos[0],params.pos[1],params.pos[2]-1,true))
        }
    },
    
    flameFuel:{
        
        trialCooldown:30,trialRate:0.3,
        u:128/2048,v:256/2048,
        svg:document.getElementById('flameFuel'),
        cooldown:document.getElementById('flameFuel_cooldown'),
        amount:document.getElementById('flameFuel_amount'),
        maxCooldown:15,
        maxAmount:1,
        tokenLife:4,
        sound:function(){playSound('flameFuelToken',0.4)},
        
        update:(amount,player)=>{
            
            player.flameFuel=true
        },
        
        getMessage:(amount)=>{
            
            return 'Flame Fuel\nx1.5 flame life'
        }
    },
    
    markSurge:{
        
        trialCooldown:20,trialRate:0.25,
        u:256/2048,v:256/2048,
        tokenLife:4,
        
        func:function(){
            
            for(let i in objects.marks){
                
                objects.marks[i].surge((i/objects.marks.length)*0.5)
            }
            
        },
    },
    
    triangulate:{
        
        trialCooldown:20,trialRate:0.25,
        u:128*7/2048,v:256*2/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                params.bee.startTriangulate([fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.75,fieldInfo[params.field].z+params.z])
                objects.triangulates.push(new Triangulate(params.bee,[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.75,fieldInfo[params.field].z+params.z]))
            }
            
            player.addEffect('bombCombo')
        }
    },
    
    pollenHaze:{
        
        trialCooldown:150,trialRate:1,
        u:0,v:256*2.5/2048,
        tokenLife:8,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                if(!fieldInfo[params.field].haze.start){
                    
                    objects.explosions.push(new Explosion({col:[1,1,0],pos:[(fieldInfo[params.field].width-1)*0.5+fieldInfo[params.field].x,fieldInfo[params.field].y+0.75,(fieldInfo[params.field].length-1)*0.5+fieldInfo[params.field].z],life:30,size:(fieldInfo[params.field].width+fieldInfo[params.field].length)*0.5*1.5,speed:0.1,aftershock:0,maxAlpha:0.15,backface:true,primitive:'cylinder_explosions',height:8/((fieldInfo[params.field].width+fieldInfo[params.field].length)*0.5*1.5)}))
                    
                }
                
                fieldInfo[params.field].haze={start:TIME,delay:TIME}
            }
        }
    },
    
    fuzzBomb:{
        
        trialCooldown:25,trialRate:0.5,
        u:128/2048,v:256*2.5/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(player.fieldIn===params.field){
                
                for(let i=0;i<2+((params.bee.level*0.2)|0);i++){
                    
                    objects.fuzzBombs.push(new FuzzBomb(params.field,params.bee.level))
                }
            }
        }
    },
    
    precision:{
        
        u:128*5/2048,v:256*2/2048,
        svg:document.getElementById('precision'),
        cooldown:document.getElementById('precision_cooldown'),
        amount:document.getElementById('precision_amount'),
        maxCooldown:60,
        tokenLife:4,
        maxAmount:10,
        
        update:(amount,player)=>{
            
            player.superCritChance+=amount*0.02
        },
        
        getMessage:(amount)=>{
            
            return 'Precision\n+'+amount*2+'% super-crit chance'
        }
    },
    
    summonFrog:{
        
        trialCooldown:30,trialRate:0.33,
        statsToAddTo:['blueAbilityTokens','battleTokens'],
        u:128*3/2048,v:256/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(params.field===player.fieldIn){
                
                objects.mobs.push(new Frog(params.field,params.x,params.z,params.bee))
            }
            
            playSound('frog',0.45)
        }
    },
    
    inflateBalloons:{
        
        trialCooldown:30,trialRate:0.25,
        statsToAddTo:['blueAbilityTokens'],
        u:128*4/2048,v:256/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(params.field===player.fieldIn){
                
                for(let i in objects.balloons){
                    
                    let b=objects.balloons[i]
                    
                    if(b.state==='float'&&b.inflateCounter>0){
                        
                        b.inflateCounter--
                        
                        b.pollen+=b.cap*(0.01+params.bee.level*0.001)
                        objects.explosions.push(new ReverseExplosion({col:b.golden?[0.9,0.9,0]:[0,0,0.8],pos:b.pos,life:0.75,size:b.displaySize+1,alpha:0.9,height:1,primitive:'explosions',transformHeight:true}))
                        
                    }
                }
                
                objects.balloons.push(new Balloon(params.field,params.x,params.z,params.bee.gifted&&Math.random()<0.1+params.bee.level*0.01,params.bee.level-1))
            }
            
            playSound('inflateBalloons',1)
        }
    },
    
    surpriseParty:{
        
        trialCooldown:150,trialRate:0.05,
        statsToAddTo:['blueAbilityTokens'],
        u:128*5/2048,v:256/2048,
        tokenLife:4,
        
        func:function(params){
            
            if(params.field===player.fieldIn){
                
                for(let i=objects.balloons.length;i--;){
                    
                    let b=objects.balloons[i]
                    
                    let type=['focus','melody','haste','whiteBomb','link','blueBomb','whiteBomb_','blueBomb_','whiteBoost','blueBoost']
                    
                    type=type[(Math.random()*type.length)|0]
                    
                    objects.tokens.push(new Token(effects[type].tokenLife,[b.pos[0],Math.round(params.bee.pos)+0.5,b.pos[2]],type,{field:b.field,x:b.x,z:b.z,bee:params.bee}))
                }
                
                objects.balloons.push(new Balloon(params.field,params.x,params.z,true,params.bee.level))
                
            }
            
            playSound('surpriseParty',0.8)
        }
    },
    
    balloonAura:{
        
        u:0,v:0,
        svg:document.getElementById('balloonAura'),
        cooldown:document.getElementById('balloonAura_cooldown'),
        amount:document.getElementById('balloonAura_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:10,
        
        update:(amount,player)=>{
            
            let a=amount*0.02+1
            player.bluePollen*=a
            player.redPollen*=a
            player.whitePollen*=a
            player.honeyFromTokens*=a
        },
        
        getMessage:(amount)=>{
            
            return 'Balloon Aura\nx'+(amount*0.02+1)+' pollen\nx'+(amount*0.02+1)+' honey from tokens'
        }
    },
    
    balloonBlessing:{
        
        u:0,v:0,
        svg:document.getElementById('balloonBlessing'),
        cooldown:document.getElementById('balloonBlessing_cooldown'),
        amount:document.getElementById('balloonBlessing_amount'),
        maxCooldown:60*60,
        tokenLife:4,
        maxAmount:10000,
        
        update:(amount,player)=>{
            
            player.capacity*=amount*0.03+1
            player.honeyAtHive*=amount*0.015+1
        },
        
        getMessage:(amount)=>{
            
            return 'Balloon Blessing\nx'+(amount*0.0125+1).toFixed(2)+' capacity\nx'+(amount*0.006+1).toFixed(3)+' honey at hive'
        }
    },
    
    gummyBlob:{
        
        trialCooldown:10,trialRate:0.6,
        u:128*6/2048,v:256/2048,
        tokenLife:8,
        
        func:function(params){
            
            player.stats.gummyMorph+=3

            if(params.field===player.fieldIn){
                
                let r=params.bee.gifted?4:2,f=function(f){f.goo=1;f.height=1}
                
                for(let x=-r;x<=r;x++){
                    
                    let _x=x+params.x
                    
                    for(let z=-r;z<=r;z++){
                        
                        let _z=z+params.z
                        
                        if(Math.abs(_x-params.x)+Math.abs(_z-params.z)<=r&&_x>=0&&_x<fieldInfo[params.field].width&&_z>=0&&_z<fieldInfo[params.field].length){
                            
                            updateFlower(params.field,_x,_z,f,true,true,false)
                        }
                    }
                }
                
                objects.explosions.push(new Explosion({col:[1,0.2,1],pos:[fieldInfo[params.field].x+params.x,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+params.z],life:0.75,size:r,speed:0.5,aftershock:0.005,height:0.3}))
            }
        }
    },
    
    gummyBarrage:{
        
        trialCooldown:15,trialRate:0.6,
        u:128*7/2048,v:256/2048,
        tokenLife:8,
        
        func:function(params){
            
            player.stats.gummyMorph+=3

            if(params.field===player.fieldIn){
                
                for(let i=0,l=MATH.random(2,5)|0;i<l;i++){
                    
                    let r=MATH.random(2,5)|0,f=function(f){f.goo=1;f.height=1},ox=(Math.random()*fieldInfo[params.field].width)|0,oz=(Math.random()*fieldInfo[params.field].length)|0
                    
                    for(let x=-r;x<=r;x++){
                        
                        let _x=x+ox
                        
                        for(let z=-r;z<=r;z++){
                            
                            let _z=z+oz
                            
                            if(Math.abs(_x-ox)+Math.abs(_z-oz)<=r&&_x>=0&&_x<fieldInfo[params.field].width&&_z>=0&&_z<fieldInfo[params.field].length){
                                
                                updateFlower(params.field,_x,_z,f,true,true,false)
                            }
                        }
                    }
                    
                    objects.explosions.push(new Explosion({col:[1,0.2,1],pos:[fieldInfo[params.field].x+ox,fieldInfo[params.field].y+0.5,fieldInfo[params.field].z+oz],life:0.75,size:r*1.5,speed:0.5,aftershock:0.005,height:0.3}))
                    
                }
            }
        }
    },
    
    targetPractice:{
        
        trialCooldown:22.5,trialRate:0.25,
        statsToAddTo:['redAbilityTokens','battleTokens'],
        u:128*4/2048,v:256*2/2048,
        tokenLife:8,
        
        func:function(params){
            
            if(params.field===player.fieldIn&&player.fieldIn&&!player.attacked.length&&params.bee.state!=='shootTargetPractice'&&params.bee.state!=='moveToTargetPractice'){
                
                params.bee.startTargetPractice()
                
            } else {
                
                player.addEffect('precision')
                player.addEffect('focus')
                player.stats.focusTokens++
                player.addEffect('redBoost')
                player.stats.redBoostTokens++
            }
        }
    },
    
    glueBuff:{
        
        u:0,v:0,
        svg:document.getElementById('glueBuff'),
        cooldown:document.getElementById('glueBuff_cooldown'),
        amount:document.getElementById('glueBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.pollenFromTools*=1.25
            player.pollenFromBees*=1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Glue\nx1.25 pollen from bees\nx1.25 pollen from tools'
        }
    },
    
    oilBuff:{
        
        u:0,v:0,
        svg:document.getElementById('oilBuff'),
        cooldown:document.getElementById('oilBuff_cooldown'),
        amount:document.getElementById('oilBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.walkSpeed*=1.2
            player.beeSpeed*=1.2
        },
        
        getMessage:(amount)=>{
            
            return 'Oil\nx1.2 player and bee movespeed'
        }
    },
    
    enzymesBuff:{
        
        u:0,v:0,
        svg:document.getElementById('enzymesBuff'),
        cooldown:document.getElementById('enzymesBuff_cooldown'),
        amount:document.getElementById('enzymesBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.convertRate*=1.5
            player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,0.12)
            player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,0.12)
            player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,0.12)
        },
        
        getMessage:(amount)=>{
            
            return 'Enzymes\nx1.5 convert rate\n+12% instant conversion'
        }
    },
    
    redExtractBuff:{
        
        u:0,v:0,
        svg:document.getElementById('redExtractBuff'),
        cooldown:document.getElementById('redExtractBuff_cooldown'),
        amount:document.getElementById('redExtractBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.redPollen*=1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Red Extract\nx1.25 red pollen'
        }
    },
    
    blueExtractBuff:{
        
        u:0,v:0,
        svg:document.getElementById('blueExtractBuff'),
        cooldown:document.getElementById('blueExtractBuff_cooldown'),
        amount:document.getElementById('blueExtractBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.bluePollen*=1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Extract\nx1.25 blue pollen'
        }
    },
    
    tropicalDrinkBuff:{
        
        u:0,v:0,
        svg:document.getElementById('tropicalDrinkBuff'),
        cooldown:document.getElementById('tropicalDrinkBuff_cooldown'),
        amount:document.getElementById('tropicalDrinkBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.whitePollen*=1.25
            player.criticalChance+=0.05
        },
        
        getMessage:(amount)=>{
            
            return 'Tropical Drink\nx1.25 white pollen\n+5% critical chance'
        }
    },
    
    purplePotionBuff:{
        
        u:0,v:0,
        svg:document.getElementById('purplePotionBuff'),
        cooldown:document.getElementById('purplePotionBuff_cooldown'),
        amount:document.getElementById('purplePotionBuff_amount'),
        maxCooldown:10*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.capacity*=1.25
            player.redPollen*=1.5
            player.bluePollen*=1.5
            player.pollenFromTools*=1.3
            player.pollenFromBees*=1.3
        },
        
        getMessage:(amount)=>{
            
            return 'Purple Potion\nx1.25 capacity\nx1.5 pollen\nx1.3 pollen from tools\nx1.3 pollen from bees'
        }
    },
    
    superSmoothieBuff:{
        
        u:0,v:0,
        svg:document.getElementById('superSmoothieBuff'),
        cooldown:document.getElementById('superSmoothieBuff_cooldown'),
        amount:document.getElementById('superSmoothieBuff_amount'),
        maxCooldown:20*60,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.capacity*=1.5
            player.whitePollen*=1.6
            player.redPollen*=1.6
            player.bluePollen*=1.6
            player.pollenFromBees*=1.4
            player.pollenFromTools*=1.4
            player.convertRate*=2
            player.honeyAtHive*=1.1
            player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,0.17)
            player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,0.17)
            player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,0.17)
            player.walkspeed*=1.25
            player.beeSpeed*=1.25
            player.criticalChance+=0.07
            player.superCritChance+=0.01
        },
        
        getMessage:(amount)=>{
            
            return 'Super Smoothie\nx1.5 capacity\nx1.6 pollen\nx1.4 pollen from bees\nx1.4 pollen from tools\nx2 convert rate\nx1.1 honey at hive\n+17% instant conversion\n+7% critical chance\nx1.25 walkspeed\nx1.25 bee movespeed\n+1% super-crit chance'
        }
    },
    
    stingerBuff:{
        
        u:0,v:0,
        svg:document.getElementById('stingerBuff'),
        cooldown:document.getElementById('stingerBuff_cooldown'),
        amount:document.getElementById('stingerBuff_amount'),
        maxCooldown:45,
        maxAmount:1,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.beeAttack*=1.5
        },
        
        getMessage:(amount)=>{
            
            return 'Stinger\nx1.5 bee attack'
        }
    },
    
    popStarAura:{
        
        svg:document.getElementById('popStarAura'),
        cooldown:document.getElementById('popStarAura_cooldown'),
        amount:document.getElementById('popStarAura_amount'),
        maxCooldown:45,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.bluePollen*=Math.min(player.popStarSize*0.0125+2,5)
            player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,0.2)
            player.bubblePollen*=1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Pop Star Aura\nx'+Math.min(player.popStarSize*0.0125+2,5)+' blue pollen\n+20% instant blue conversion\nx1.25 bubble pollen'
        }
    },
    
    scorchingStarAura:{
        
        svg:document.getElementById('scorchingStarAura'),
        cooldown:document.getElementById('scorchingStarAura_cooldown'),
        amount:document.getElementById('scorchingStarAura_amount'),
        maxCooldown:45,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.redPollen*=Math.min(player.scorchingStarSize*0.000425+2,5)
            player.convertRate*=Math.min(player.scorchingStarSize*0.000425+2,5)
            player.beeAttack*=Math.min(player.scorchingStarSize*0.0003+1,3)
            player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,0.2)
        },
        
        getMessage:(amount)=>{
            
            return 'Scorching Star Aura\nx'+Math.min(player.scorchingStarSize*0.000425+2,5).toFixed(2)+' red pollen\nx'+Math.min(player.scorchingStarSize*0.000425+2,5).toFixed(2)+' convert rate\nx'+Math.min(player.scorchingStarSize*0.0003+1,3).toFixed(2)+' bee attack\n+20% instant red conversion'
        }
    },
    
    gummyStarAura:{
        
        svg:document.getElementById('gummyStarAura'),
        cooldown:document.getElementById('gummyStarAura_cooldown'),
        amount:document.getElementById('gummyStarAura_amount'),
        maxCooldown:45,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.goo*=Math.min(player.gummyStarSize*0.00000000035+1,2)
            player.whitePollen*=Math.min(player.gummyStarSize*0.00000000035+1,2)
            player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,0.2)
        },
        
        getMessage:(amount)=>{
            
            return 'Gummy Star Aura\nx'+Math.min(player.gummyStarSize*0.00000000035+1,2).toFixed(2)+' goo\nx'+Math.min(player.gummyStarSize*0.00000000035+1,2).toFixed(2)+' white pollen\n+20% instant white conversion'
        }
    },
    
    bubbleBloat:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('bubbleBloat'),
        cooldown:document.getElementById('bubbleBloat_cooldown'),
        amount:document.getElementById('bubbleBloat_amount'),
        maxCooldown:60*60,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.convertRate*=(amount*5+1).toFixed(2)
            player.blueFieldCapacity*=(amount*5+1).toFixed(2)
        },
        
        getMessage:(amount)=>{
            
            return 'Bubble Bloat\nx'+(amount*5+1).toFixed(2)+' convert rate\nx'+(amount*5+1).toFixed(2)+' blue field capacity'
        }
    },
    
    gummyBall:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('gummyBall'),
        cooldown:document.getElementById('gummyBall_cooldown'),
        amount:document.getElementById('gummyBall_amount'),
        maxCooldown:180,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.gummyBallSize*=amount*1.5+1
            player.whitePollen*=amount*0.15+1
            
            if(amount>=0.99||user.keys[' ']&&player.grounded&&amount>=0.3){
                if(player.fieldIn){
                    
                    player.addEffect('gummyBall',-amount)
                    objects.mobs.push(new GummyBall())
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Gummyball\nx'+(amount*1.5+1).toFixed(2)+' gummyball size\nx'+(amount*0.2+1).toFixed(2)+' white pollen'
        }
    },
    
    gummyBallCombo:{
        
        u:0,v:0,
        svg:document.getElementById('gummyBallCombo'),
        cooldown:document.getElementById('gummyBallCombo_cooldown'),
        amount:document.getElementById('gummyBallCombo_amount'),
        maxCooldown:10,
        maxAmount:1000,
        tokenLife:4,
        
        update:(amount,player)=>{
            
            player.goo*=MATH.lerp(1,2,amount*0.001)
            player.whitePollen*=1.1
        },
        
        getMessage:(amount)=>{
            
            return 'Gummyball Combo\nx'+MATH.lerp(1,2,amount*0.001).toFixed(2)+' goo\nx1.1 white pollen'
        }
    },
    
    guidingStarAura:{
        
        u:0,v:0,
        svg:document.getElementById('guidingStarAura'),
        cooldown:document.getElementById('guidingStarAura_cooldown'),
        amount:document.getElementById('guidingStarAura_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.whitePollen*=2
            player.redPollen*=2
            player.bluePollen*=2
            player.capacity*=2
        },
        
        getMessage:(amount)=>{
            
            return 'Guiding Star Aura\nx2 pollen\nx2 capacity'
        }
    },
    
    popStarPassive:{
        
        isPassive:true,
        svg:document.getElementById('popStarPassive'),
        cooldown:document.getElementById('popStarPassive_cooldown'),
        amount:document.getElementById('popStarPassive_amount'),
        maxCooldown:60,
        triggerVal:30,
        triggerType:'blueBombTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            objects.mobs.push(new PopStar())
            playSound('popStar',1)
            window.setTimeout(function(){playSound('popStar',1)},15250)
            window.setTimeout(function(){playSound('popStar',1)},15250*2)
        },
        
        getMessage:(amount)=>{
            
            return "Pop Star\nEvery 30 blue bomb tokens summons a Pop Star, lasting for 45s, and applies 1m of bubble bloat. It grows for every bubble popped, x1.25 bubble pollen, 20% instant blue conversion, and up to x5 blue pollen. Upon summoning, it also applies 30s of Bubble Bloat. Popping a bubble while the star is active gives 1s(2s if golden) of Bubble Bloat, up to 1h. Bubble Bloat gives up to x6 convert rate and x6 blue field capacity. When the Pop Star disappears, it spawns 1 bubble for every 10 of the star's size, with an extra 5. Cooldown: 1m"
        }
    },
    
    scorchingStarPassive:{
        
        isPassive:true,
        svg:document.getElementById('scorchingStarPassive'),
        cooldown:document.getElementById('scorchingStarPassive_cooldown'),
        amount:document.getElementById('scorchingStarPassive_amount'),
        maxCooldown:60,
        triggerVal:15,
        triggerType:'redBoostTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            objects.mobs.push(new ScorchingStar())
            playSound('scorchingStar',1)
            window.setTimeout(function(){playSound('scorchingStar',1)},15250)
            window.setTimeout(function(){playSound('scorchingStar',1)},15250*2)
        },
        
        getMessage:(amount)=>{
            
            return "Scorching Star\nEvery 15 red boost tokens summons a Scorching Star, lasting for 45s. It grows by 75(100 if dark) every second for every flame nearby. It grants up to x5 red pollen, x5 convert rate, and +20% instant red conversion. Cooldown: 1m"
        }
    },
    
    gummyStarPassive:{
        
        isPassive:true,
        svg:document.getElementById('gummyStarPassive'),
        cooldown:document.getElementById('gummyStarPassive_cooldown'),
        amount:document.getElementById('gummyStarPassive_amount'),
        maxCooldown:60,
        triggerVal:25,
        triggerType:'gummyStar',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            objects.mobs.push(new GummyStar())
            playSound('gummyStar',1)
            window.setTimeout(function(){playSound('gummyStar',1)},15250)
            window.setTimeout(function(){playSound('gummyStar',1)},15250*2)
        },
        
        getMessage:(amount)=>{
            
            return "Gummy Star\nEvery gumdrop used or after 25 gumdrops has a 7% chance to summon a Gummy Star, lasting for 45s. It grows based on how much goo you collect, giving up to x2 goo and x2 white pollen, while always giving +15% instant white conversion and +15% instant goo conversion. After disappearing, it spreads 20(+the amount of digits in the star's size) honey tokens, with a total value of approximately 1,000(+7.5% of the star's size). Cooldown: 1m"
        }
    },
    
    guidingStarPassive:{
        
        isPassive:true,
        svg:document.getElementById('guidingStarPassive'),
        cooldown:document.getElementById('guidingStarPassive_cooldown'),
        amount:document.getElementById('guidingStarPassive_amount'),
        maxCooldown:60*5,
        triggerVal:250,
        triggerType:'boostTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            let f=[]
            
            for(let i in fieldInfo){
                
                f.push(i)
            }
            
            for(let i in objects.mobs){
                
                let o=objects.mobs[i]
                
                if(o.guidingstarinstance){
                    
                    if(f.indexOf(o.field)>-1){
                        
                        f.splice(f.indexOf(o.field),1)
                    }
                }
            }
            
            if(f.length){
                
                f=f[(Math.random()*f.length)|0]
                objects.mobs.push(new GuidingStar(f))
                player.addMessage('⭐Guiding Star on '+MATH.doGrammar(f)+'!⭐')
            }
            
        },
        
        getMessage:(amount)=>{
            
            return "Guiding Star\nEvery 250th boost token summons a guiding star over a random field, granting x2.5 capacity and pollen for 10m. Cooldown: 5m"
        }
    },
    
    starShowerPassive:{
        
        isPassive:true,
        svg:document.getElementById('starShowerPassive'),
        cooldown:document.getElementById('starShowerPassive_cooldown'),
        amount:document.getElementById('starShowerPassive_amount'),
        maxCooldown:25,
        triggerVal:35,
        triggerType:'markOrBoostTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            if(player.fieldIn){
                
                objects.mobs.push(new StarShower(player.fieldIn))
            }
        },
        
        getMessage:(amount)=>{
            
            return "star shower wip"
        }
    },
    
    starSawPassive:{
        
        isPassive:true,
        svg:document.getElementById('starSawPassive'),
        cooldown:document.getElementById('starSawPassive_cooldown'),
        amount:document.getElementById('starSawPassive_amount'),
        maxCooldown:40,
        triggerVal:2,
        triggerType:'stingerUsed',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            items.stinger.amount++
            player.updateInventory()
            player.addMessage('+1 Stinger (from Star Saw Refund)')
            objects.mobs.push(new StarSaw())
        },
        
        getMessage:(amount)=>{
            
            return "star saw wip"
        }
    },
    
    petalStormPassive:{
        
        isPassive:true,
        svg:document.getElementById('petalStormPassive'),
        cooldown:document.getElementById('petalStormPassive_cooldown'),
        amount:document.getElementById('petalStormPassive_amount'),
        maxCooldown:30,
        triggerVal:30,
        triggerType:'boostTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            for(let i=0;i<30;i++){
                
                window.setTimeout(function(){objects.mobs.push(new PetalShuriken([player.body.position.x,player.body.position.y+0.25,player.body.position.z],[Math.cos(i*0.75),0,Math.sin(i*0.75)]))},1000*i*0.15)
                
            }
        },
        
        getMessage:(amount)=>{
            
            return "petal storm wip"
        }
    },
    
    tidePower:{
        
        u:0,v:0,
        svg:document.getElementById('tidePower'),
        cooldown:document.getElementById('tidePower_cooldown'),
        amount:document.getElementById('tidePower_amount'),
        maxCooldown:20,
        maxAmount:500,
        
        update:(amount,player)=>{
            
            player.collectorSpeed*=amount*0.00175+1
            player.tidePower*=amount*0.0025+1
            
            if(amount>=500){
                
                player.addEffect('tidalSurge',1)
                player.addEffect('tidePower',false,false,0)
                player.addEffect('tideBlessing',25/(4*60*60))
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Tide Power\nx'+(amount*0.00175+1).toFixed(3)+' collector speed\nx'+(amount*0.0025+1).toFixed(3)+' wave size'
        }
    },
    
    tidalSurge:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('tidalSurge'),
        cooldown:document.getElementById('tidalSurge_cooldown'),
        amount:document.getElementById('tidalSurge_amount'),
        maxCooldown:10,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.collectorSpeed=3
            player.tidalSurge=true
            player.addEffect('tidePower',false,false,0)
        },
        
        getMessage:(amount)=>{
            
            return 'Tidal Surge\nx5 collector speed'
        }
    },
    
    tideBlessing:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('tideBlessing'),
        cooldown:document.getElementById('tideBlessing_cooldown'),
        amount:document.getElementById('tideBlessing_amount'),
        maxCooldown:4*60*60,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.bluePollen*=amount*0.15+1
            player.honeyFromTokens*=amount*0.15+1
            player.convertRate*=amount*0.15+1
            player.pollenFromTools*=amount*0.15+1
            player.pollenFromBees*=amount*0.15+1
        },
        
        getMessage:(amount)=>{
            
            return 'Tidal Blessing\nx'+(amount*0.15+1).toFixed(2)+' blue pollen\nx'+(amount*0.15+1).toFixed(2)+' convert rate\nx'+(amount*0.15+1).toFixed(2)+' honey from tokens\nx'+(amount*0.15+1).toFixed(2)+' pollen from tools\nx'+(amount*0.15+1).toFixed(2)+' pollen from bees'
        }
    },
    
    coconutShield:{
        
        u:128*6/2048,v:256*2/2048,
        svg:document.getElementById('coconutShield'),
        cooldown:document.getElementById('coconutShield_cooldown'),
        amount:document.getElementById('coconutShield_amount'),
        maxCooldown:10,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.beeAttack*=1.5
            player.defense=1
            
            meshes.explosions.instanceData.push(player.body.position.x+player.body.velocity.x*dt,player.body.position.y+player.body.velocity.y*dt,player.body.position.z+player.body.velocity.z*dt,0.1,0.05,0,Math.sin(TIME*10)*0.1+0.5,2,1)
        },
        
        getMessage:(amount)=>{
            
            return 'Coconut Shield\n+100% defense\nx1.5 bee attack'
        }
    },
    
    gummyMorph:{
        
        u:128*6/2048,v:256*2/2048,
        svg:document.getElementById('gummyMorph'),
        cooldown:document.getElementById('gummyMorph_cooldown'),
        amount:document.getElementById('gummyMorph_amount'),
        maxCooldown:10,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.goo*=1.75
            player.instantRedConversion=1
            player.instantWhiteConversion=1
            player.instantBlueConversion=1
            player.walkSpeed*=1.1
            player.jumpPower*=1.2
        },
        
        getMessage:(amount)=>{
            
            return 'Gummy Morph\nx1.75 goo\n+100% instant conversion\nx1.1 walkspeed\nx1.2 jump power'
        }
    },
    
    focusPulserPassive:{
        
        isPassive:true,
        svg:document.getElementById('focusPulserPassive'),
        cooldown:document.getElementById('focusPulserPassive_cooldown'),
        amount:document.getElementById('focusPulserPassive_amount'),
        maxCooldown:20,
        triggerVal:25,
        triggerType:'focusTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            objects.mobs.push(new Pulse('red'))
        },
        
        getMessage:(amount)=>{
            
            return 'Focus Pulser\nEvery 25 focus tokens collected activates a red pulse, hopping to every red bee twice, collecting pollen. Pollen collection increases with each hop. Cooldown: 20s'
        }
    },
    
    hastePulserPassive:{
        
        isPassive:true,
        svg:document.getElementById('hastePulserPassive'),
        cooldown:document.getElementById('hastePulserPassive_cooldown'),
        amount:document.getElementById('hastePulserPassive_amount'),
        maxCooldown:20,
        triggerVal:25,
        triggerType:'hasteTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            objects.mobs.push(new Pulse('blue'))
        },
        
        getMessage:(amount)=>{
            
            return 'Haste Pulser\nEvery 25 haste tokens collected activates a blue pulse, hopping to every blue bee twice, collecting pollen. Pollen collection increases with each hop. Cooldown: 20s'
        }
    },
    
    inspireCoconutsPassive:{
        
        isPassive:true,
        svg:document.getElementById('inspireCoconutsPassive'),
        cooldown:document.getElementById('inspireCoconutsPassive_cooldown'),
        amount:document.getElementById('inspireCoconutsPassive_amount'),
        maxCooldown:0.5,
        triggerVal:5,
        triggerType:'inspireTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            if(player.fieldIn){
                
                for(let i=0;i<5;i++){
                    
                    objects.mobs.push(new Coconut((Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0,i*0.4))
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Inspire Coconuts\nEvery 5 inspire tokens collected summons 5 falling coconuts which collect pollen when the land. Standing under the coconut instantly converts the player\'s convert total into honey tokens.'
        }
    },
    
    emergencyCoconutShieldPassive:{
        
        isPassive:true,
        svg:document.getElementById('emergencyCoconutShieldPassive'),
        cooldown:document.getElementById('emergencyCoconutShieldPassive_cooldown'),
        amount:document.getElementById('emergencyCoconutShieldPassive_amount'),
        maxCooldown:60,
        triggerVal:1,
        triggerType:'coconutShield',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            if(player.fieldIn){
                
                for(let i=0;i<5;i++){
                    
                    objects.mobs.push(new Coconut((Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0,i*0.4))
                }
            }
            
            player.addEffect('coconutShield')
        },
        
        getMessage:(amount)=>{
            
            return 'Emergency Coconut Shield\nTaking damage from a monster will activate a shield, granting 100% defense, x1.5 bee attack and will drop 5 falling coconuts if in a field. Cooldown: 1m'
        }
    },
    
    xFlamePassive:{
        
        isPassive:true,
        svg:document.getElementById('xFlamePassive'),
        cooldown:document.getElementById('xFlamePassive_cooldown'),
        amount:document.getElementById('xFlamePassive_amount'),
        maxCooldown:25,
        triggerVal:20,
        triggerType:'battleTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            let dirs=[[-1,1],[1,-1],[-1,-1],[1,1]]
            
            if(player.fieldIn&&!player.attacked.length){
                
                objects.flames.push(new Flame(player.fieldIn,player.flowerIn.x,player.flowerIn.z))
                
                for(let j in dirs){
                    
                    for(let i=1;i<8;i++){
                        
                        let x=dirs[j][0]*i+player.flowerIn.x,z=dirs[j][1]*i+player.flowerIn.z
                        
                        if(x>=0&&x<fieldInfo[player.fieldIn].width&&z>=0&&z<fieldInfo[player.fieldIn].length)
                            objects.flames.push(new Flame(player.fieldIn,x,z))
                    }
                }
                
            } else {
                
                objects.flames.push(new Flame(player.body.position.x,player.body.position.y,player.body.position.z,true))
                
                for(let j in dirs){
                    
                    for(let i=1;i<8;i++){
                        
                        let x=dirs[j][0]*i,z=dirs[j][1]*i
                        
                        objects.flames.push(new Flame(player.body.position.x+x,player.body.position.y,player.body.position.z+z,true))
                    }
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return 'X Flame\nEvery 20 battle tokens collected summons 29 flames in an X shape, lasting for 3 secs. Each flame collects 6R/3W/1B pollen from nearby flowers and deals 15 damage to nearby enemies every sec. Cooldown: 15s'
        }
    },
    
    ignitePassive:{
        
        isPassive:true,
        svg:document.getElementById('ignitePassive'),
        cooldown:document.getElementById('ignitePassive_cooldown'),
        amount:document.getElementById('ignitePassive_amount'),
        maxCooldown:0.5,
        triggerVal:10,
        triggerType:'redAbilityTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            let dirs=[[-1,0],[0,-1],[0,1],[1,0]]
            
            if(player.fieldIn&&!player.attacked.length){
                
                objects.flames.push(new Flame(player.fieldIn,player.flowerIn.x,player.flowerIn.z))
                
                for(let j in dirs){
                    
                    for(let i=1;i<2;i++){
                        
                        let x=dirs[j][0]*i+player.flowerIn.x,z=dirs[j][1]*i+player.flowerIn.z
                        
                        if(x>=0&&x<fieldInfo[player.fieldIn].width&&z>=0&&z<fieldInfo[player.fieldIn].length)
                            objects.flames.push(new Flame(player.fieldIn,x,z))
                    }
                }
                
            } else {
                
                objects.flames.push(new Flame(player.body.position.x,player.body.position.y,player.body.position.z,true))
                
                for(let j in dirs){
                    
                    for(let i=1;i<2;i++){
                        
                        let x=dirs[j][0]*i,z=dirs[j][1]*i
                        
                        objects.flames.push(new Flame(player.body.position.x+x,player.body.position.y,player.body.position.z+z,true))
                    }
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Ignite\nEvery 10 red ability tokens collected summons 5 flames in a + shape, lasting for 3 secs. Each flame collects 9R/5W/2B pollen from nearby flowers and deals 15 damage to nearby enemies every sec.'
        }
    },
    
    bubbleBombsPassive:{
        
        isPassive:true,
        svg:document.getElementById('bubbleBombsPassive'),
        cooldown:document.getElementById('bubbleBombsPassive_cooldown'),
        amount:document.getElementById('bubbleBombsPassive_amount'),
        maxCooldown:0.5,
        triggerVal:10,
        triggerType:'bombTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            if(player.fieldIn){
                
                for(let i=0;i<3;i++){
                    
                    objects.bubbles.push(new Bubble(player.fieldIn,(Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0))
                    
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return 'Bubble Bombs\nEvery 10 blue bomb tokens collected summons 3 bubbles around the field, lasting for 10 secs. Each bubble collects 2R/6W/10B pollen from nearby flowers and replenish them when popped.'
        }
    },
    
    coinScatterPassive:{
        
        isPassive:true,
        svg:document.getElementById('coinScatterPassive'),
        cooldown:document.getElementById('coinScatterPassive_cooldown'),
        amount:document.getElementById('coinScatterPassive_amount'),
        maxCooldown:45,
        triggerVal:20,
        triggerType:'markTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            if(player.fieldIn){
                
                let amc=Math.min(Math.ceil(player.convertTotal*3),player.pollen)
                
                if(amc<=0){return}
                
                player.pollen-=amc
                
                let amountPerToken=Math.ceil(amc/24)
                
                for(let i=0;i<24;i++){
                    
                    objects.tokens.push(new LootToken(30,[fieldInfo[player.fieldIn].x+((Math.random()*fieldInfo[player.fieldIn].width)|0),fieldInfo[player.fieldIn].y+1,fieldInfo[player.fieldIn].z+((Math.random()*fieldInfo[player.fieldIn].length)|0)],'honey',amountPerToken,false,'Coin Scatter'))
                    
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return "Coin Scatter\nConverts 300% of the player's convert total into 24 honey tokens, which are scattered randomly in the field. Cooldown: 45s"
        }
    },
    
    diamondDrainPassive:{
        
        isPassive:true,
        svg:document.getElementById('diamondDrainPassive'),
        cooldown:document.getElementById('diamondDrainPassive_cooldown'),
        amount:document.getElementById('diamondDrainPassive_amount'),
        maxCooldown:35,
        triggerVal:35,
        triggerType:'blueAbilityTokens',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            if(player.fieldIn){
                
                objects.mobs.push(new DrainingDiamond())
                
                for(let i=0;i<15;i++){
                    
                    updateFlower(player.fieldIn,(Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0,function(f){
                        
                        if(f.level<5){
                            
                            f.level++
                            f.pollinationTimer=1
                            
                        } else {
                            
                            f.height=1
                        }
                        
                        for(let j=0;j<6;j++){
                            
                            ParticleRenderer.add({x:f.x+fieldInfo[player.fieldIn].x,y:fieldInfo[player.fieldIn].y+0.5,z:f.z+fieldInfo[player.fieldIn].z,vx:MATH.random(-1,1),vy:Math.random()*2,vz:MATH.random(-1,1),grav:-3,size:100,col:[1,1,MATH.random(0.6,1)],life:2.5,rotVel:MATH.random(-3,3),alpha:2})
                        }
                        
                    },true,false,true)
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return "Diamond Drain\nEvery 35th blue ability token summons a diamond that converts the sqrt of (convert rate x blue pollen) x capacity x 0.05. Honey converted is multiplied by 2x, and the diamond pollinates 15 flowers in the field. Cooldown: 35s"
        }
    },
    
    gummyMorphPassive:{
        
        isPassive:true,
        svg:document.getElementById('gummyMorphPassive'),
        cooldown:document.getElementById('gummyMorphPassive_cooldown'),
        amount:document.getElementById('gummyMorphPassive_amount'),
        maxCooldown:25,
        triggerVal:30,
        triggerType:'gummyMorph',
        currentVal:0,
        currentCooldown:0,
        startVal:0,
        
        activate(){
            
            player.addEffect('gummyMorph')
            
            if(player.fieldIn){
                
                let func=function(f){f.goo=1;f.height=1}
                
                for(let i in flowers[player.fieldIn]){
                    
                    for(let j in flowers[player.fieldIn][i]){
                        
                        updateFlower(player.fieldIn,j,i,func,true,true,false)
                    }
                }
            }
        },
        
        getMessage:(amount)=>{
            
            return "Gummy Morph\nEvery 10 gummy bee tokens or 30 gumdrops used covers the field in goo and grants x1.75 goo, 100% instant goo conversion, +30 walkspeed and +3 jump power for 10s. Cooldown: 25s"
        }
    },
    
    redPulse:{
        
        trialCooldown:25,trialRate:0.6,
        statsToAddTo:['redAbilityTokens'],
        u:128*1/2048,v:128*6/2048,
        tokenLife:12,
        
        func:function(params){
            
            objects.mobs.push(new Pulse('red'))
            
            if(player.ownsCobaltBee){
                
                objects.mobs.push(new Pulse('blue'))
            }
        },
    },
    
    bluePulse:{
        
        trialCooldown:25,trialRate:0.6,
        statsToAddTo:['blueAbilityTokens'],
        u:128*2/2048,v:128*6/2048,
        tokenLife:12,
        
        func:function(params){
            
            objects.mobs.push(new Pulse('blue'))
            
            if(player.ownsCrimsonBee){
                
                objects.mobs.push(new Pulse('red'))
            }
        },
    },
    
    redBombSync:{
        
        trialCooldown:35,trialRate:0.7,
        statsToAddTo:['redAbilityTokens','redBombTokens'],
        u:128*3/2048,v:128*6/2048,
        svg:document.getElementById('redBombSync'),
        cooldown:document.getElementById('redBombSync_cooldown'),
        amount:document.getElementById('redBombSync_amount'),
        maxCooldown:25,
        maxAmount:1,
        tokenLife:24,
        
        update:(amount,player)=>{
            
            player.redBombSync=true
        },
        
        getMessage:(amount)=>{
            
            return 'Red Bomb Sync\nAllows red bombs to collect from white flowers. If blue bomb sync is active, applies to blue flowers aswell.'
        }
    },
    
    blueBombSync:{
        
        trialCooldown:35,trialRate:0.7,
        statsToAddTo:['blueAbilityTokens','blueBombTokens'],
        u:128*4/2048,v:128*6/2048,
        svg:document.getElementById('blueBombSync'),
        cooldown:document.getElementById('blueBombSync_cooldown'),
        amount:document.getElementById('blueBombSync_amount'),
        maxCooldown:25,
        maxAmount:1,
        tokenLife:24,
        
        update:(amount,player)=>{
            
            player.blueBombSync=true
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Bomb Sync\nAllows blue bombs to collect from white flowers. If red bomb sync is active, applies to red flowers aswell.'
        }
    },
    
    beamStorm:{
        
        trialCooldown:30,trialRate:0.4,
        statsToAddTo:[],
        u:128*5/2048,v:128*6/2048,
        tokenLife:12,
        
        func:function(params){
            
            if(player.fieldIn){
                
                player.beamStormRayData=[]
                
                for(let i=0;i<25+params.bee.level*2;i++){
                    
                    objects.mobs.push(new Beam(params,i*0.075,player.fieldIn))
                }
            }
        },
    },
    
    rainCloud:{
        
        trialCooldown:60,trialRate:0.5,
        statsToAddTo:[],
        u:128*6/2048,v:128*6/2048,
        tokenLife:24,
        
        func:function(params){
            
            player.addEffect('whiteBoost')
            
            let f=Math.random()<0.25&&player.fieldIn?player.fieldIn:0
                
            if(!f){
                
                f=[]
                
                for(let i in fieldInfo){
                    
                    f.push(i)
                }
                
                f=f[(Math.random()*f.length)|0]
            }
            
            objects.mobs.push(new Cloud(f,(Math.random()*fieldInfo[f].width)|0,(Math.random()*fieldInfo[f].length)|0,60+params.bee.level*5))
            
            player.addMessage('☁️Your windy bee made a cloud in the '+MATH.doGrammar(f)+'!☁️')
            
        },
    },
    
    tornado:{
        
        trialCooldown:75,trialRate:0.5,
        statsToAddTo:[],
        u:128*7/2048,v:128*6/2048,
        tokenLife:24,
        
        func:function(params){
            
            player.addEffect('whiteBoost')
            
            if(player.fieldIn){
                
                objects.mobs.push(new Tornado(params.bee.level))
            }
        },
    },
    
    cloudBoost:{
        
        u:128*5/2048,v:128/2048,
        svg:document.getElementById('cloudBoost'),
        cooldown:document.getElementById('cloudBoost_cooldown'),
        amount:document.getElementById('cloudBoost_amount'),
        maxCooldown:7.5,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.redPollen*=player.cloudBoostAmount
            player.bluePollen*=player.cloudBoostAmount
            player.whitePollen*=player.cloudBoostAmount
        },
        
        getMessage:(amount)=>{
            
            return 'Cloud Boost\nx'+player.cloudBoostAmount+'  pollen'+(player.cloudBoostAmount>1.25?'(you have gifted windy bee, so x1.5, not x1.25)':'')
        }
    },
    
    scratch:{
        
        trialCooldown:35,trialRate:0.333,
        statsToAddTo:[],
        u:128*4/2048,v:128*7/2048,
        tokenLife:12,
        
        func:function(params){
            
            if(player.fieldIn){
                
                objects.mobs.push(new Scratch(params.bee,params.x,params.z))
            }
        },
    },
    
    tabbyLove:{
        
        trialCooldown:90,trialRate:1,
        statsToAddTo:[],
        u:128*5/2048,v:128*7/2048,
        svg:document.getElementById('tabbyLove'),
        cooldown:document.getElementById('tabbyLove_cooldown'),
        amount:document.getElementById('tabbyLove_amount'),
        maxCooldown:Infinity,
        maxAmount:1000,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.tabbyLoveStacks=amount*0.01+1
        },
        
        getMessage:(amount)=>{
            
            return 'Tabby Love\nx'+player.tabbyLoveStacks+' Tabby Bee convert rate\nx'+player.tabbyLoveStacks+' Tabby Bee gather amount\nx'+player.tabbyLoveStacks+' pollen from "Scratch"'
        }
    },

    impale:{
        
        trialCooldown:35,trialRate:0.8,
        statsToAddTo:['blueAbilityTokens','attackTokens'],
        u:128*6/2048,v:128*9/2048,
        tokenLife:24,
        
        func:function(params){
            
            for(let i=0;i<params.bee.level;i++){

                window.setTimeout(function(){objects.mobs.push(new Spike(params.bee))},300*i)
            }
        },
    },

    comfortingNectar:{
        
        u:128*5/2048,v:128/2048,hideAmount:true,
        svg:document.getElementById('comfortingNectar'),
        cooldown:document.getElementById('comfortingNectar_cooldown'),
        amount:document.getElementById('comfortingNectar_amount'),
        maxCooldown:60*60*6,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.whiteConvertRate*=(amount*0.9+1.1).toFixed(2)
            player.bluePollen*=(amount*0.45+1.05).toFixed(2)
            player.convertRateAtHive*=(amount*0.9+1.1).toFixed(2)
            player.honeyPerPollen*=(amount*0.04+1.01).toFixed(2)
        },
        
        getMessage:(amount)=>{
            
            return 'Comforting Nectar\nx'+(amount*0.9+1.1).toFixed(2)+' white bee convert rate\nx'+(amount*0.45+1.05).toFixed(2)+' blue pollen\nx'+(amount*0.9+1.1).toFixed(2)+' convert rate at hive\nx'+(amount*0.04+1.01).toFixed(2)+' honey per pollen'
        }
    },

    invigoratingNectar:{
        
        u:128*5/2048,v:128/2048,hideAmount:true,
        svg:document.getElementById('invigoratingNectar'),
        cooldown:document.getElementById('invigoratingNectar_cooldown'),
        amount:document.getElementById('invigoratingNectar_amount'),
        maxCooldown:60*60*6,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.convertRate*=(amount*0.45+1.05).toFixed(2)
            player.redPollen*=(amount*0.45+1.05).toFixed(2)
            player.convertRateAtHive*=(amount*0.09+1.01).toFixed(2)
            player.honeyPerPollen*=(amount*0.04+1.01).toFixed(2)
        },
        
        getMessage:(amount)=>{
            
            return 'Invigorating Nectar\nx'+(amount*0.45+1.05).toFixed(2)+' convert rate\nx'+(amount*0.45+1.05).toFixed(2)+' red pollen\nx'+(amount*0.09+1.01).toFixed(2)+' bee attack\nx'+(amount*0.04+1.01).toFixed(2)+' honey per pollen'
        }
    },

    motivatingNectar:{
        
        u:128*5/2048,v:128/2048,hideAmount:true,
        svg:document.getElementById('motivatingNectar'),
        cooldown:document.getElementById('motivatingNectar_cooldown'),
        amount:document.getElementById('motivatingNectar_amount'),
        maxCooldown:60*60*6,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.convertRate*=(amount*0.45+1.05).toFixed(2)
            player.bluePollen*=(amount*0.45+1.05).toFixed(2)
            player.beeAbilityRate*=(amount*0.04+1.01).toFixed(2)
            player.honeyPerPollen*=(amount*0.04+1.01).toFixed(2)
        },
        
        getMessage:(amount)=>{
            
            return 'Motivating Nectar\nx'+(amount*0.45+1.05).toFixed(2)+' convert rate\nx'+(amount*0.45+1.05).toFixed(2)+' blue pollen\nx'+(amount*0.04+1.01).toFixed(2)+' bee ability rate\nx'+(amount*0.04+1.01).toFixed(2)+' honey per pollen'
        }
    },

    refreshingNectar:{
        
        u:128*5/2048,v:128/2048,hideAmount:true,
        svg:document.getElementById('refreshingNectar'),
        cooldown:document.getElementById('refreshingNectar_cooldown'),
        amount:document.getElementById('refreshingNectar_amount'),
        maxCooldown:60*60*6,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.blueConvertRate*=(amount*0.9+1.1).toFixed(2)
            player.redPollen*=(amount*0.45+1.05).toFixed(2)
            player.beeEnergy*=(amount*0.45+1.05).toFixed(2)
            player.honeyPerPollen*=(amount*0.04+1.01).toFixed(2)
        },
        
        getMessage:(amount)=>{
            
            return 'Refreshing Nectar\nx'+(amount*0.9+1.1).toFixed(2)+' blue bee convert rate\nx'+(amount*0.45+1.05).toFixed(2)+' red pollen\nx'+(amount*0.45+1.05).toFixed(2)+' bee energy\nx'+(amount*0.04+1.01).toFixed(2)+' honey per pollen'
        }
    },

    satisfyingNectar:{
        
        u:128*5/2048,v:128/2048,hideAmount:true,
        svg:document.getElementById('satisfyingNectar'),
        cooldown:document.getElementById('satisfyingNectar_cooldown'),
        amount:document.getElementById('satisfyingNectar_amount'),
        maxCooldown:60*60*6,
        tokenLife:4,
        amountFromCooldown:true,
        
        update:(amount,player)=>{
            
            player.redConvertRate*=(amount*0.9+1.1).toFixed(2)
            player.whitePollen*=(amount*0.9+1.1).toFixed(2)
            player.honeyAtHive*=(amount*0.45+1.05).toFixed(2)
            player.honeyPerPollen*=(amount*0.04+1.01).toFixed(2)
        },
        
        getMessage:(amount)=>{
            
            return 'Satisfying Nectar\nx'+(amount*0.9+1.1).toFixed(2)+' red bee convert rate\nx'+(amount*0.9+1.1).toFixed(2)+' white pollen\nx'+(amount*0.45+1.05).toFixed(2)+' honey at hive\nx'+(amount*0.04+1.01).toFixed(2)+' honey per pollen'
        }
    },

    corruption:{
        
        u:0,v:0,
        svg:document.getElementById('corruption'),
        cooldown:document.getElementById('corruption_cooldown'),
        amount:document.getElementById('corruption_amount'),
        maxCooldown:0,
        tokenLife:4,
        maxAmount:100,
        
        update:(amount,player)=>{
            
            player.abilityDuplicationChance+=amount*0.001+0.05
        },
        
        getMessage:(amount)=>{
            
            return 'Corruption\n+'+((amount*0.1+5)|0)+'% ability duplication chance'
        }
    },
    
    glitch:{
        
        trialCooldown:120,trialRate:0.35,
        u:128*7/2048,v:128*9/2048,
        tokenLife:8,
        
        func:function(params){
            
            if(player.fieldIn){

                fieldInfo[player.fieldIn].corruption=Math.min(fieldInfo[player.fieldIn].corruption+15+params.bee.level*0.5+(((fieldInfo[player.fieldIn].generalColorComp.r*player.drives.red/50)+(fieldInfo[player.fieldIn].generalColorComp.w*player.drives.white/50)+(fieldInfo[player.fieldIn].generalColorComp.b*player.drives.blue/50)+(player.drives.glitched/50))*15/4),100)
                
                objects.mobs.push(new GlitchEffect(player.fieldIn,5))
                15+10+15
            }
        },
    },

    mindHack:{
        
        trialCooldown:25,trialRate:0.4,
        u:128*0/2048,v:128*10/2048,
        tokenLife:8,
        
        func:function(params){
            
            let m=[]

            for(let i in player.attacked){

                m.push(player.attacked[i])
            }

            for(let i=0;i<3+(params.bee.level*0.25)&&m.length;i++){

                let r=(Math.random()*m.length)|0

                m[r].mindHacked=3+(params.bee.level*0.1)
                m.splice(r,1)
            }
        },
    },
    
    mapCorruption:{
        
        trialCooldown:100,trialRate:0.25,
        u:128*1/2048,v:128*10/2048,
        tokenLife:8,
        
        func:function(params){
            
            let f=[]
            
            for(let i in fieldInfo){
                
                f.push(i)
            }
            
            if(params.field){
                
                f.splice(f.indexOf(params.field),1)
            }
            
            f=f[(Math.random()*f.length)|0]
            
            fieldInfo[f].corruption=Math.min(fieldInfo[f].corruption+30+params.bee.level*2+(((fieldInfo[player.fieldIn].generalColorComp.r*player.drives.red/50)+(fieldInfo[player.fieldIn].generalColorComp.w*player.drives.white/50)+(fieldInfo[player.fieldIn].generalColorComp.b*player.drives.blue/50)+(player.drives.glitched/50))*15/4),100)
            
            objects.mobs.push(new GlitchEffect(f,5))
            
            player.addMessage('Your Digital Bee corrupted the'+MATH.doGrammar(f)+'!',[255*0.5,0,200*0.5])
            
        },
    },
    
    smiley:{
        
        trialCooldown:0,trialRate:0,
        u:128*2/2048,v:128*10/2048,
        tokenLife:12,
        
        func:function(params){
            
            let tokensCollected=0
            
            for(let i in objects.tokens){
                
                if(objects.tokens[i] instanceof DupedToken){
                    
                    objects.tokens[i].collect()
                    tokensCollected++
                }
            }
            
            if(player.fieldIn){
                
                fieldInfo[player.fieldIn].corruption=Math.min(fieldInfo[player.fieldIn].corruption+3,100)
                
                collectPollen({x:params.x,z:params.z,pattern:[[-4,0],[-4,1],[-4,2],[-3,3],[-2,4],[-1,4],[0,4],[1,4],[2,4],[3,3],[4,2],[4,1],[4,0],[4,-1],[4,-2],[3,-3],[2,-4],[1,-4],[0,-4],[-1,-4],[-2,-4],[-3,-3],[-4,-2],[-4,-1],[-1,-1],[1,-1],[2,1],[1,2],[0,2],[-1,2],[-2,1]],amount:params.bee.gatherAmount*3,stackOffset:0.4+Math.random()*0.5,multiplier:tokensCollected*0.25+1,instantConversion:0.5})
                
                objects.mobs.push(new GlitchEffect(player.fieldIn,3))
                
            }
        },
    },

    redJellyBean:{
        
        u:128*4/2048,v:128*11/2048,
        svg:document.getElementById('redJellyBean'),
        cooldown:document.getElementById('redJellyBean_cooldown'),
        amount:document.getElementById('redJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.redPollen*=0.083333*amount+1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Red Jelly Bean\nx'+(0.083333*amount+1.25).toFixed(1)+' red pollen'
        }
    },
    
    whiteJellyBean:{
        
        u:128*5/2048,v:128*11/2048,
        svg:document.getElementById('whiteJellyBean'),
        cooldown:document.getElementById('whiteJellyBean_cooldown'),
        amount:document.getElementById('whiteJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.whitePollen*=0.083333*amount+1.25
        },
        
        getMessage:(amount)=>{
            
            return 'White Jelly Bean\nx'+(0.083333*amount+1.25).toFixed(1)+' white pollen'
        }
    },

    blueJellyBean:{
        
        u:128*6/2048,v:128*11/2048,
        svg:document.getElementById('blueJellyBean'),
        cooldown:document.getElementById('blueJellyBean_cooldown'),
        amount:document.getElementById('blueJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.bluePollen*=0.083333*amount+1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Jelly Bean\nx'+(0.083333*amount+1.25).toFixed(1)+' blue pollen'
        }
    },
    
    pinkJellyBean:{
        
        u:128*7/2048,v:128*11/2048,
        svg:document.getElementById('pinkJellyBean'),
        cooldown:document.getElementById('pinkJellyBean_cooldown'),
        amount:document.getElementById('pinkJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.pollenFromBees*=0.083333*amount+1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Pink Jelly Bean\nx'+(0.083333*amount+1.25).toFixed(1)+' pollen from bees'
        }
    },

    brownJellyBean:{
        
        u:128*0/2048,v:128*12/2048,
        svg:document.getElementById('brownJellyBean'),
        cooldown:document.getElementById('brownJellyBean_cooldown'),
        amount:document.getElementById('brownJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.pollenFromTools*=0.083333*amount+1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Brown Jelly Bean\nx'+(0.083333*amount+1.25).toFixed(1)+' pollen from tools'
        }
    },

    greenJellyBean:{
        
        u:128*1/2048,v:128*12/2048,
        svg:document.getElementById('greenJellyBean'),
        cooldown:document.getElementById('greenJellyBean_cooldown'),
        amount:document.getElementById('greenJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.criticalChance+=0.01*amount+0.03
        },
        
        getMessage:(amount)=>{
            
            return 'Green Jelly Bean\n+'+(amount+3)+'% critical chance'
        }
    },

    blackJellyBean:{
        
        u:128*2/2048,v:128*12/2048,
        svg:document.getElementById('blackJellyBean'),
        cooldown:document.getElementById('blackJellyBean_cooldown'),
        amount:document.getElementById('blackJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.whiteBombPollen*=0.083333*amount+1.25
            player.redBombPollen*=0.083333*amount+1.25
            player.blueBombPollen*=0.083333*amount+1.25
        },
        
        getMessage:(amount)=>{
            
            return 'Black Jelly Bean\nx'+(0.083333*amount+1.25).toFixed(1)+' bomb pollen'
        }
    },

    yellowJellyBean:{
        
        u:128*3/2048,v:128*12/2048,
        svg:document.getElementById('yellowJellyBean'),
        cooldown:document.getElementById('yellowJellyBean_cooldown'),
        amount:document.getElementById('yellowJellyBean_amount'),
        maxCooldown:60,
        maxAmount:3,
        tokenLife:16,
        
        update:(amount,player)=>{
            
            player.instantWhiteConversion=MATH.applyPercentage(player.instantWhiteConversion,0.05*amount+0.1)
            player.instantRedConversion=MATH.applyPercentage(player.instantRedConversion,0.05*amount+0.1)
            player.instantBlueConversion=MATH.applyPercentage(player.instantBlueConversion,0.05*amount+0.1)
        },
        
        getMessage:(amount)=>{
            
            return 'Yellow Jelly Bean\n+'+(5*amount+10)+'% instant conversion'
        }
    },
    
    redDriveBuff:{
        
        u:0,v:0,
        svg:document.getElementById('redDriveBuff'),
        cooldown:document.getElementById('redDriveBuff_cooldown'),
        amount:document.getElementById('redDriveBuff_amount'),
        maxCooldown:3*60,
        tokenLife:4,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.redPollen*=1.25
            player.redFieldCapacity*=1.25
            player.redBeeAttack++
        },
        
        getMessage:(amount)=>{
            
            return 'Red Drive\nx1.25 red pollen\nx1.25 red field capacity\n+1 red bee attack'
        }
    },
    
    blueDriveBuff:{
        
        u:0,v:0,
        svg:document.getElementById('blueDriveBuff'),
        cooldown:document.getElementById('blueDriveBuff_cooldown'),
        amount:document.getElementById('blueDriveBuff_amount'),
        maxCooldown:3*60,
        tokenLife:4,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.bluePollen*=1.25
            player.blueFieldCapacity*=1.25
            player.blueBeeAttack++
        },
        
        getMessage:(amount)=>{
            
            return 'Blue Drive\nx1.25 blue pollen\nx1.25 blue field capacity\n+1 blue bee attack'
        }
    },
    
    whiteDriveBuff:{
        
        u:0,v:0,
        svg:document.getElementById('whiteDriveBuff'),
        cooldown:document.getElementById('whiteDriveBuff_cooldown'),
        amount:document.getElementById('whiteDriveBuff_amount'),
        maxCooldown:3*60,
        tokenLife:4,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.whitePollen*=1.25
            player.whiteFieldCapacity*=1.25
            player.whiteBeeAttack++
        },
        
        getMessage:(amount)=>{
            
            return 'White Drive\nx1.25 white pollen\nx1.25 white field capacity\n+1 white bee attack'
        }
    },
    
    glitchedDriveBuff:{
        
        u:0,v:0,
        svg:document.getElementById('glitchedDriveBuff'),
        cooldown:document.getElementById('glitchedDriveBuff_cooldown'),
        amount:document.getElementById('glitchedDriveBuff_amount'),
        maxCooldown:3*60,
        tokenLife:4,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.redPollen*=1.25
            player.bluePollen*=1.25
            player.whitePollen*=1.25
            player.capacity*=1.25
            player.whiteBeeAttack++
            player.blueBeeAttack++
            player.redBeeAttack++
        },
        
        getMessage:(amount)=>{
            
            return 'Glitched Drive\nx1.25 pollen\nx1.25 capacity\n+1 bee attack'
        }
    },

    antChallenge:{
        
        u:0,v:0,
        svg:document.getElementById('antChallenge'),
        cooldown:document.getElementById('antChallenge_cooldown'),
        amount:document.getElementById('antChallenge_amount'),
        maxCooldown:5*60,
        tokenLife:4,
        maxAmount:1,
        
        update:(amount,player)=>{
            
            player.instantRedConversion=1
            player.instantWhiteConversion=1
            player.instantBlueConversion=1
        },
        
        getMessage:(amount)=>{
            
            return 'Ant Challenge\n+100% instant conversion'
        }
    },
}

let LIST_OF_STATS_FOR_PLAYER=[]

for(let i in effects){
    
    if(effects[i].statsToAddTo){
        
        for(let j in effects[i].statsToAddTo){
            
            if(LIST_OF_STATS_FOR_PLAYER.indexOf(effects[i].statsToAddTo[j])<0){
                
                LIST_OF_STATS_FOR_PLAYER.push(effects[i].statsToAddTo[j])
                
            }
        }
    }
    
    if(!effects[i].svg){continue}
    
    effects[i].svg.addEventListener('mousemove',function(e){
        
        hoverText.style.display='block'
        hoverText.style.left=e.x+10+'px'
        hoverText.style.top=e.y+10+'px'
        hoverText.style.bottom=''
        hoverText.style.right=''
        
        let index
        
        for(let j in player.effects){
            
            if(player.effects[j].type===i){
                
                index=j
                break
            }
        }
        
        let m=effects[i].getMessage(player.effects[index].amount),_i=m.indexOf('\n')
        
        if(!effects[i].amountFromCooldown&&player.effects[index].amount!==1)
            m=m.substr(0,_i)+' (x'+player.effects[index].amount+')'+m.substr(_i,m.length)
        
        hoverText.innerText=m+'\n'+(effects[i].isPassive||effects[i].maxCooldown===0||effects[i].maxCooldown===Infinity?'':MATH.doTime((player.effects[index].cooldown|0).toString()))
        
    })
    
    effects[i].svg.addEventListener('mouseleave',function(){
        
        hoverText.style.display='none'
    })
}

let toolParticle=0

let howManyToFeed=document.getElementById('howManyToFeed'),howManyMessage=document.getElementById('howManyMessage'),feedAmount=document.getElementById('feedAmount')

let items={

    jellyBeans:{
        
        amount:0,u:128*3/2048,v:128*11/2048,value:20,
        use:function(){
            
            if(!player.fieldIn){
                
                player.addMessage('You must be in a field to use Jelly Beans!',COLORS.redArr)
                return
            }
            
            items.jellyBeans.amount--
            
            for(let i=0;i<12;i++){

                window.setTimeout(function(){
                    
                    if(player.fieldIn){
                        
                        let vel=player.bodyDir.slice()
                        vel[1]=MATH.random(5,9)
                        vec3.rotateY(vel,vel,MATH.ORIGIN,MATH.random(-0.7,0.7))
                        vel[0]*=MATH.random(3,9)
                        vel[2]*=MATH.random(3,9)

                        let arr=[]

                        arr.push('redJellyBean','blueJellyBean','whiteJellyBean')
                        arr.push('redJellyBean','blueJellyBean','whiteJellyBean')
                        arr.push('redJellyBean','blueJellyBean','whiteJellyBean')
                        arr.push('pinkJellyBean','brownJellyBean','blackJellyBean','yellowJellyBean','greenJellyBean')

                        objects.mobs.push(new JellyBean(player.fieldIn,vel,arr[(Math.random()*arr.length)|0]))
                    }
                
                },250*i)
            }
        }
    },

    ticket:{
        
        amount:0,u:128*3/2048,v:128*10/2048,value:15,
        use:function(){}
    },

    antPass:{
        
        amount:0,u:128*4/2048,v:128*10/2048,value:30,
        use:function(){}
    },
    
    cloudVial:{
        
        amount:0,u:128*5/2048,v:128*12/2048,value:25,
        use:function(){
            
            if(!player.fieldIn){
                
                player.addMessage('You must be in a field to use Cloud Vials!',COLORS.redArr)
                return
            }

            let count=0

            for(let i in objects.mobs){

                if(objects.mobs[i] instanceof Cloud&&objects.mobs[i].field===player.fieldIn){

                    count++
                }
            }
            
            if(count>6){

                player.addMessage('There are too many clouds in this field!',COLORS.redArr)
                return
            }

            items.cloudVial.amount--
            
            objects.mobs.push(new Cloud(player.fieldIn,player.flowerIn.x,player.flowerIn.z,3*60))
        }
    },

    magicBean:{
        
        amount:0,u:128*4/2048,v:128*12/2048,value:25,
        use:function(){
            
            if(!player.fieldIn){
                
                player.addMessage('You must be in a field to use Magic Beans!',COLORS.redArr)
                return
            }
            
            for(let i in objects.mobs){

                if(objects.mobs[i] instanceof Sprout&&objects.mobs[i].field===player.fieldIn){

                    player.addMessage('There is already a sprout in this field!',COLORS.redArr)
                    return
                }
            }

            items.magicBean.amount--
            
            let type=['basic','rare','epic','legendary','supreme','gummy','moon']

            type=type[(Math.random()*type.length)|0]

            player.addMessage('You planted a '+MATH.doGrammar(type)+' Sprout!',{basic:undefined,rare:[130,130,130],epic:[210,170,0],legendary:[0,190,220],supreme:[30,220,90],gummy:[230,70,230],moon:[140,200,230]}[type])

            objects.mobs.push(new Sprout(player.fieldIn,type))
        }
    },
    
    comfortingVial:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.comfortingVial.amount--
            player.addEffect('comfortingNectar',(60*60)/(60*60*6))
        }
    },
    
    invigoratingVial:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.invigoratingVial.amount--
            player.addEffect('invigoratingNectar',(60*60)/(60*60*6))
        }
    },
    
    motivatingVial:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.motivatingVial.amount--
            player.addEffect('motivatingNectar',(60*60)/(60*60*6))
        }
    },
    
    refreshingVial:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.refreshingVial.amount--
            player.addEffect('refreshingNectar',(60*60)/(60*60*6))
        }
    },
    
    satisfyingVial:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.satisfyingVial.amount--
            player.addEffect('satisfyingNectar',(60*60)/(60*60*6))
        }
    },
    
    redDrive:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.redDrive.amount--
            player.addEffect('redDriveBuff')
            player.drives.red++
        }
    },
    
    blueDrive:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.blueDrive.amount--
            player.addEffect('blueDriveBuff')
            player.drives.blue++
        }
    },
    
    whiteDrive:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.whiteDrive.amount--
            player.addEffect('whiteDriveBuff')
            player.drives.white++
        }
    },
    
    glitchedDrive:{
        
        amount:0,u:128*0/2048,v:128*0/2048,value:35,
        use:function(){
            
            items.glitchedDrive.amount--
            player.addEffect('glitchedDriveBuff')
            player.drives.glitched++
        }
    },
    
    roboPass:{
        
        amount:0,u:128*6/2048,v:128*12/2048,value:50,
        use:function(){}
    },
    
    fieldDice:{
        
        amount:0,u:128*5/2048,v:128*10/2048,value:12,
        use:function(){

            items.fieldDice.amount--

            let f=[]

            for(let i in fieldInfo){

                if(i!=='AntField'){

                    f.push(i)
                }
            }

            for(let i=0;i<1;i++){

                let r=(Math.random()*f.length)|0

                player.addEffect(f[r][0].toLowerCase()+f[r].substring(1,f[r].length)+'Boost',false,false,undefined,1)
            }
        }
    },

    smoothDice:{
        
        amount:0,u:128*6/2048,v:128*10/2048,value:30,
        use:function(){

            items.smoothDice.amount--

            let f=[]

            for(let i in fieldInfo){

                if(i!=='AntField'){

                    f.push(i)
                }
            }

            for(let i=0;i<2;i++){

                let r=(Math.random()*f.length)|0

                player.addEffect(f[r][0].toLowerCase()+f[r].substring(1,f[r].length)+'Boost',false,false,undefined,2)
            }
        }
    },

    loadedDice:{
        
        amount:0,u:128*7/2048,v:128*10/2048,value:50,
        use:function(){

            items.loadedDice.amount--

            let f=[]

            for(let i in fieldInfo){

                if(i!=='AntField'){

                    f.push(i)

                    if(i===player.fieldIn){

                        f.push(i)
                        f.push(i)
                        f.push(i)
                        f.push(i)
                        f.push(i)
                        f.push(i)
                    }
                }
            }

            for(let i=0;i<3;i++){

                let r=(Math.random()*f.length)|0

                player.addEffect(f[r][0].toLowerCase()+f[r].substring(1,f[r].length)+'Boost',false,false,undefined,3)

                for(let j in f){

                    if(f[j]===f[r]){

                        f.splice(j,1)
                    }
                }
            }
        }
    },

    microConverter:{
        
        amount:0,u:128*0/2048,v:128*11/2048,value:16,cooldown:2,
        use:function(){

            if(player.pollen<1){

                player.addMessage('You must have pollen to use a micro-converter!',COLORS.redArr)
                return
            }

            items.microConverter.amount--

            textRenderer.add((player.pollen*player.honeyPerPollen)|0,[player.body.position.x,player.body.position.y+2,player.body.position.z],COLORS.honey,1,'⇆')
            player.honey+=(player.pollen*player.honeyPerPollen)|0
            player.pollen=0
        }
    },

    honeysuckle:{
        
        amount:0,u:128*1/2048,v:128*11/2048,value:13,cooldown:15,
        use:function(){

            player.addMessage('im too lazy to make a whole system for the',COLORS.redArr)
            player.addMessage('honeysuckle so ig ill make it a weak micro converter',COLORS.redArr)

            items.honeysuckle.amount--

        }
    },

    whirligig:{
        
        amount:0,u:128*2/2048,v:128*11/2048,value:30,cooldown:15,
        use:function(){

            if(player.antChallenge){

                out.endAntChallenge()
                return
            }

            items.whirligig.amount--

            player.hivePos[0]+=1.5
            player.hivePos[2]+=2

            player.body.velocity.x=0
            player.body.velocity.y=0
            player.body.velocity.z=0

            player.body.position.x=player.hivePos[0]
            player.body.position.y=player.hivePos[1]
            player.body.position.z=player.hivePos[2]

            for(let i in objects.bees){

                objects.bees[i].pos=player.hivePos.slice()
                objects.bees[i].state='moveToPlayer'
            }

            player.hivePos[0]-=1.5
            player.hivePos[2]-=2

        }
    },
    
    softWax:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.beequip&&slot.beequip.waxes.length<5
        },
        amount:0,u:128*2/2048,v:128*9/2048,value:16,
        use:function(){
            
            player.addMessage('The wax improved the beequip!')

            items.softWax.amount--

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.waxes.push('softWax')

            let beeStats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(','),numStatsToAdd=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.potential>=3?2:1,statsToAdd=[],permBeeStats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(',')

            for(let i in beeStats){

                if(beeStats[i][1]==='0'){

                    beeStats.splice(i,1)
                }
            }

            for(let i=0;i<numStatsToAdd;i++){

                let j=(Math.random()*beeStats.length)|0
                statsToAdd.push(beeStats[j])
                beeStats.splice(j,1)
            }

            for(let i in statsToAdd){

                for(let j in permBeeStats){
                    
                    if(statsToAdd[i]===permBeeStats[j]){
                        
                        let np=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.potential/5

                        let improvement=Number(permBeeStats[j][0]==='*'?(MATH.random(0.05,0.1)*(np*0.15+1)).toFixed(2):((MATH.random(1,5)*(np*0.5+1))|0))
                        
                        permBeeStats[j]=permBeeStats[j].substring(0,permBeeStats[j].indexOf('(')+2)+(Number(permBeeStats[j].substring(permBeeStats[j].indexOf('(')+2,permBeeStats[j].indexOf(')')))+improvement).toFixed(2).replaceAll('.00','')+')'
                    }
                }
            }

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee=permBeeStats.join(',')

            player.updateBeequipPage()
            player.updateHive()

        }
    },

    hardWax:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.beequip&&slot.beequip.waxes.length<5
        },
        amount:0,u:128*3/2048,v:128*9/2048,value:26,
        use:function(){
            
            items.hardWax.amount--

            if(Math.random()>0.6){

                player.addMessage('The wax failed to improve the beequip!',COLORS.redArr)
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.waxes.push('hardWax')
                player.updateBeequipPage()
                player.updateHive()
                return
            }

            player.addMessage('The wax improved the beequip!')

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.waxes.push('hardWax')

            let beeStats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(','),numStatsToAdd=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.potential>=3&&Math.random()<0.5?3:2,statsToAdd=[],permBeeStats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(',')

            for(let i in beeStats){

                if(beeStats[i][1]==='0'){

                    beeStats.splice(i,1)
                }
            }

            for(let i=0;i<numStatsToAdd;i++){

                let j=(Math.random()*beeStats.length)|0
                statsToAdd.push(beeStats[j])
                beeStats.splice(j,1)
            }

            for(let i in statsToAdd){

                for(let j in permBeeStats){
                    
                    if(statsToAdd[i]===permBeeStats[j]){
                        
                        let np=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.potential/5

                        let improvement=Number(permBeeStats[j][0]==='*'?(MATH.random(0.075,0.125)*(np*0.15+1)).toFixed(2):((MATH.random(2,6)*(np*0.5+1))|0))
                        
                        permBeeStats[j]=permBeeStats[j].substring(0,permBeeStats[j].indexOf('(')+2)+(Number(permBeeStats[j].substring(permBeeStats[j].indexOf('(')+2,permBeeStats[j].indexOf(')')))+improvement).toFixed(2).replaceAll('.00','')+')'
                    }
                }
            }

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee=permBeeStats.join(',')

            player.updateBeequipPage()
            player.updateHive()
        }
    },

    causticWax:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.beequip&&slot.beequip.waxes.length<5
        },
        amount:0,u:128*4/2048,v:128*9/2048,value:55,
        use:function(){
            
            items.causticWax.amount--

            if(Math.random()<0.75){

                player.addMessage('The wax destroyed the beequip!',COLORS.redArr)
                player.beequipLookingAt=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.id
                window.deleteBeequip()
                return
            }

            player.addMessage('The wax improved the beequip!')

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.waxes.push('causticWax')

            let beeStats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(','),numStatsToAdd=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.potential>=4&&Math.random()<0.75?4:3,statsToAdd=[],permBeeStats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(',')

            for(let i in beeStats){

                if(beeStats[i][1]==='0'){

                    beeStats.splice(i,1)
                }
            }

            for(let i=0;i<numStatsToAdd;i++){

                let j=(Math.random()*beeStats.length)|0
                statsToAdd.push(beeStats[j])
                beeStats.splice(j,1)
            }

            for(let i in statsToAdd){

                for(let j in permBeeStats){
                    
                    if(statsToAdd[i]===permBeeStats[j]){
                        
                        let np=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.potential/5

                        let improvement=Number(permBeeStats[j][0]==='*'?(MATH.random(0.1,0.175)*(np*0.15+1)).toFixed(2):((MATH.random(4,9)*(np*0.5+1))|0))
                        
                        permBeeStats[j]=permBeeStats[j].substring(0,permBeeStats[j].indexOf('(')+2)+(Number(permBeeStats[j].substring(permBeeStats[j].indexOf('(')+2,permBeeStats[j].indexOf(')')))+improvement).toFixed(2).replaceAll('.00','')+')'
                    }
                }
            }

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee=permBeeStats.join(',')

            player.updateBeequipPage()
            player.updateHive()
        }
    },

    swirledWax:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.beequip&&slot.beequip.waxes.length<5
        },
        amount:0,u:128*5/2048,v:128*9/2048,value:42,
        use:function(){
            
            items.swirledWax.amount--

            player.addMessage('The wax rerolled the beequip stats!')

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.waxes.push('swirledWax')

            let stats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(',')

            for(let i in stats){

                let newNum=Number(stats[i].substring(1,stats[i].indexOf(' ')))*(stats[i][0]==='*'?MATH.random(0.8,1.25):MATH.random(0.5,2))

                stats[i]=stats[i][0]+(stats[i][0]==='+'?Math.round(newNum):newNum.toFixed(2).replace('.00',''))+stats[i].substring(stats[i].indexOf(' '),stats[i].length)
            }

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee=stats.join(',')

            player.updateBeequipPage()
            player.updateHive()
        }
    },

    turpentine:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.beequip&&slot.beequip.waxes.length>0
        },
        amount:0,u:128*0/2048,v:128*13/2048,value:60,
        use:function(){
            
            items.turpentine.amount--

            player.addMessage('The turpentine removed all waxes on the beequip!')

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.waxes=[]

            let stats=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee.split(',')

            for(let i in stats){

                stats[i]=stats[i].substr(0,stats[i].indexOf('('))+'(+0)'                
            }

            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip.stats.bee=stats.join(',')

            player.updateBeequipPage()
            player.updateHive()
        }
    },

    paperPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                for(let i in objects.planters){

                    if(player.fieldIn===objects.planters[i].field){

                        player.addMessage('You can only have 1 planter in a field!',COLORS.redArr)
                        return
                    }
                }

                items.paperPlanter.amount--
                objects.planters.push(new Planter('paper'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    plasticPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.plasticPlanter.amount--
                objects.planters.push(new Planter('plastic'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    candyPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.candyPlanter.amount--
                objects.planters.push(new Planter('candy'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    redClayPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.redClayPlanter.amount--
                objects.planters.push(new Planter('redClay'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    blueClayPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.blueClayPlanter.amount--
                objects.planters.push(new Planter('blueClay'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    tackyPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.tackyPlanter.amount--
                objects.planters.push(new Planter('tacky'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    pesticidePlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.pesticidePlanter.amount--
                objects.planters.push(new Planter('pesticide'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    petalPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.petalPlanter.amount--
                objects.planters.push(new Planter('petal'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    plentyPlanter:{
        
        amount:1,u:0,v:0,value:Infinity,
        use:function(){
            
            if(objects.planters.length>3){

                player.addMessage('You can only have 3 planters at once!',COLORS.redArr)
                return
            }

            if(player.fieldIn){
                
                items.plentyPlanter.amount--
                objects.planters.push(new Planter('plenty'))
                
            } else {
                
                player.addMessage('You must be in a field to place a planter!',COLORS.redArr)
            }
        }
    },

    gumdrops:{
        
        amount:0,u:128/2048,v:128*7/2048,cooldown:4,autoUse:true,value:5,
        use:function(){

            if(player.fieldIn){
                
                player.stats.gummyMorph++
                player.stats.gummyStar++

                if(Math.random()<0.07)
                    player.stats.gummyStar+=25
                    
                items.gumdrops.amount--
                
                for(let i=0,l=MATH.random(2,5)|0;i<l;i++){
                    
                    let r=MATH.random(2,5)|0,f=function(f){f.goo=1;f.height=1},ox=(Math.random()*fieldInfo[player.fieldIn].width)|0,oz=(Math.random()*fieldInfo[player.fieldIn].length)|0
                    
                    for(let x=-r;x<=r;x++){
                        
                        let _x=x+ox
                        
                        for(let z=-r;z<=r;z++){
                            
                            let _z=z+oz
                            
                            if(Math.abs(_x-ox)+Math.abs(_z-oz)<=r&&_x>=0&&_x<fieldInfo[player.fieldIn].width&&_z>=0&&_z<fieldInfo[player.fieldIn].length){
                                
                                updateFlower(player.fieldIn,_x,_z,f,true,true,false)
                            }
                        }
                    }
                    
                    objects.explosions.push(new Explosion({col:[1,0.2,1],pos:[fieldInfo[player.fieldIn].x+ox,fieldInfo[player.fieldIn].y+0.5,fieldInfo[player.fieldIn].z+oz],life:0.75,size:r*1.5,speed:0.5,aftershock:0.005,height:0.3}))
                    
                }
            } else {
                
                player.addMessage('You must be standing in a field to use gumdrops!',COLORS.redArr)
            }
        }
    },
    
    coconut:{
        
        amount:0,u:128*2/2048,v:128*7/2048,cooldown:10,autoUse:true,value:4,
        use:function(){
            
            if(player.fieldIn){
                
                items.coconut.amount--
                
                objects.mobs.push(new Coconut((Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0,0))
                
            } else {
                
                player.addMessage('You must be standing in a field to use coconuts!',COLORS.redArr)
            }
        }
    },
    
    stinger:{
        
        amount:0,u:128*3/2048,v:128*7/2048,value:10,
        use:function(){
            
            items.stinger.amount--
            player.addEffect('stingerBuff')
            player.stats.stingerUsed++
        }
    },
    
    glue:{
        
        amount:0,u:0,v:128*3/2048,value:19,
        use:function(){
            
            items.glue.amount--
            player.addEffect('glueBuff')
        }
    },
    
    oil:{
        
        amount:0,u:128/2048,v:128*3/2048,value:17,
        use:function(){
            
            items.oil.amount--
            player.addEffect('oilBuff')
        }
    },
    
    enzymes:{
        
        amount:0,u:128*2/2048,v:128*3/2048,value:17,
        use:function(){
            
            items.enzymes.amount--
            player.addEffect('enzymesBuff')
        }
    },
    
    redExtract:{
        
        amount:0,u:128*3/2048,v:128*3/2048,value:17,
        use:function(){
            
            items.redExtract.amount--
            player.addEffect('redExtractBuff')
        }
    },
    
    blueExtract:{
        
        amount:0,u:128*4/2048,v:128*3/2048,value:17,
        use:function(){
            
            items.blueExtract.amount--
            player.addEffect('blueExtractBuff')
        }
    },
    
    tropicalDrink:{
        
        amount:0,u:128*5/2048,v:128*3/2048,value:22,
        use:function(){
            
            items.tropicalDrink.amount--
            player.addEffect('tropicalDrinkBuff')
        }
    },
    
    purplePotion:{
        
        amount:0,u:128*6/2048,v:128*3/2048,value:95,
        use:function(){
            
            items.purplePotion.amount--
            player.addEffect('purplePotionBuff')
        }
    },
    
    superSmoothie:{
        
        amount:0,u:128*7/2048,v:128*3/2048,value:120,
        use:function(){
            
            items.superSmoothie.amount--
            player.addEffect('superSmoothieBuff')
        }
    },
    
    bitterberry:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*6/2048,v:128*7/2048,value:10,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many bitterberries will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            document.getElementById('feedUntilGifted').style.display='none'

            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.bitterberry.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            document.getElementById('feedThisAmount').onclick=function(){
                howManyToFeed.style.display='none'
                
                let amount=feedAmount.value
                items.bitterberry.amount-=amount
                player.updateInventory()
                
                if(Math.random()<1-Math.pow(1-(1/(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].radioactive>0?30:100)),amount)){
                    
                    player.addMessage('☢️ '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' bee gained a mutation! ☢️',[50,225,90])
                    
                    let stat=['abilityRate','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack'],oper,num,level=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.level-1
                    
                    stat=stat[(Math.random()*stat.length)|0]
                    
                    oper=stat==='attack'||stat==='convertAmount'||stat==='gatherAmount'?Math.random()<0.5?'+':'*':'*'
                    
                    switch(stat){
                        
                        case 'attack':num=oper==='+'?MATH.random(1+level*(2/20),3+level*(4/20))|0:MATH.random(1.05,1.35+level*(0.02));break
                        case 'gatherAmount':num=oper==='+'?MATH.random(4+level*(8/20),10+level*(16/20))|0:MATH.random(1.1,1.3+level*(0.04));break
                        case 'convertAmount':num=oper==='+'?MATH.random(7+level*(10/20),15+level*(20/20))|0:MATH.random(1.15,1.4+level*(0.04));break
                        case 'maxEnergy':num=MATH.random(1.2,1.5+level*(0.04));break
                        case 'abilityRate':num=MATH.random(1.05,1.15+level*(0.0175));break
                        
                    }
                        
                    num=Number(num.toFixed(2))
                    
                    player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.mutation=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].mutation={stat:stat,num:num,oper:oper}
                    
                    player.addMessage('☢️ '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' got '+oper.replace('*','x')+num+' '+MATH.doGrammar(stat.replace('max','')).toLowerCase()+'! ☢️',[50,225,90])
                    
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=amount*100
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(amount*100+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas((amount*100)+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
        }
    },
    
    neonberry:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*7/2048,v:128*7/2048,value:16,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many neonberries will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            document.getElementById('feedUntilGifted').style.display='none'

            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.neonberry.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            document.getElementById('feedThisAmount').onclick=function(){
                howManyToFeed.style.display='none'
                
                let amount=feedAmount.value
                items.neonberry.amount-=amount
                player.updateInventory()
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].radioactive=(3*60)+((amount-1)*5)
                
                player.addMessage('☢️ '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' bee became radioactive for '+MATH.doTime(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].radioactive)+' ☢️',[50,225,90])
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=amount*500
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(amount*500+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas((amount*500)+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
        }
    },
    
    moonCharm:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*7/2048,v:128*12/2048,value:10,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many moon charms will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            document.getElementById('feedUntilGifted').style.display='none'

            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.moonCharm.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            document.getElementById('feedThisAmount').onclick=function(){
                howManyToFeed.style.display='none'
                
                let amount=feedAmount.value
                items.moonCharm.amount-=amount
                player.updateInventory()
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=amount*250
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(amount*250+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas((amount*250)+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
        }
    },

    treat:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:0,v:128*4/2048,value:1,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many treats will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            document.getElementById('feedUntilGifted').style.display='none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.treat.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            document.getElementById('feedThisAmount').onclick=function(){
                howManyToFeed.style.display='none'
                
                let amount=feedAmount.value
                items.treat.amount-=amount
                player.updateInventory()
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=amount*10
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(amount*10+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas((amount*10)+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
        }
    },

    starTreat:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*1/2048,v:128*13/2048,value:500,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many star treats will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            document.getElementById('feedUntilGifted').style.display='none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.starTreat.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            document.getElementById('feedThisAmount').onclick=function(){
                howManyToFeed.style.display='none'
                
                let amount=feedAmount.value
                items.starTreat.amount-=amount
                player.updateInventory()
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=amount*1000
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }

                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
                player.addMessage('⭐ The treat made the bee gifted! ⭐',COLORS.honey)
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(amount*1000+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas((amount*1000)+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)

                player.updateHive()
                
            }
        }
    },

    atomicTreat:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*2/2048,v:128*13/2048,value:40,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many atomic treats will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            document.getElementById('feedUntilGifted').style.display='none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.atomicTreat.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            document.getElementById('feedThisAmount').onclick=function(){
                howManyToFeed.style.display='none'
                
                let amount=feedAmount.value
                items.atomicTreat.amount-=amount
                player.updateInventory()
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=amount*1000
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }

                player.addMessage('☢️ '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' bee gained a mutation! ☢️',[50,225,90])
                
                let stat=['abilityRate','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack','gatherAmount','convertAmount','maxEnergy','attack'],oper,num,level=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.level-1
                
                stat=stat[(Math.random()*stat.length)|0]
                
                oper=stat==='attack'||stat==='convertAmount'||stat==='gatherAmount'?Math.random()<0.5?'+':'*':'*'
                
                switch(stat){
                    
                    case 'attack':num=oper==='+'?MATH.random(1+level*(2/20),3+level*(4/20))|0:MATH.random(1.05,1.35+level*(0.02));break
                    case 'gatherAmount':num=oper==='+'?MATH.random(4+level*(8/20),10+level*(16/20))|0:MATH.random(1.1,1.3+level*(0.04));break
                    case 'convertAmount':num=oper==='+'?MATH.random(7+level*(10/20),15+level*(20/20))|0:MATH.random(1.15,1.4+level*(0.04));break
                    case 'maxEnergy':num=MATH.random(1.2,1.5+level*(0.04));break
                    case 'abilityRate':num=MATH.random(1.05,1.15+level*(0.0175));break
                    
                }
                
                num=Number(num.toFixed(2))
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.mutation=player.hive[player.hiveIndex[1]][player.hiveIndex[0]].mutation={stat:stat,num:num,oper:oper}
                
                player.addMessage('☢️ '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' got '+oper.replace('*','x')+num+' '+MATH.doGrammar(stat.replace('max','')).toLowerCase()+'! ☢️',[50,225,90])
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(amount*1000+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas((amount*1000)+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)

                player.updateHive()
                
            }
        }
    },
    
    blueberry:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128/2048,v:128*4/2048,value:2,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many blueberries will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            
            document.getElementById('feedUntilGifted').style.display=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='blueberry'&&!player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted?'block':'none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.blueberry.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            let feed=function(amount){
                
                howManyToFeed.style.display='none'
                
                items.blueberry.amount-=amount
                player.updateInventory()
                
                let isFavorite=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='blueberry',bondToAdd=amount*25*(isFavorite?2:1)
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=bondToAdd
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(bondToAdd+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                if(isFavorite){
                    
                    player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee loves blueberries! ╰(*°▽°*)╯",COLORS.bondArr)
                }
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas(bondToAdd+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
            
            document.getElementById('feedThisAmount').onclick=function(){feed(feedAmount.value)}
            
            document.getElementById('feedUntilGifted').onclick=function(){
                
                let am=MATH.simulateProbabilityTries(1/15000)
                
                if(am<items.blueberry.amount){
                    
                    player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
                    player.addMessage('After '+MATH.abvNumber(am+'')+' treats.....',COLORS.honey)
                    player.addMessage('⭐ The treat made the bee gifted! ⭐',COLORS.honey)
                    feed(am)
                    player.updateHive()
                    
                } else {
                    
                    player.addMessage('The treat failed to make the bee gifted :(',COLORS.redArr)
                    feed(items.blueberry.amount)
                }
            }
            
        }
    },
    
    strawberry:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*2/2048,v:128*4/2048,value:2,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many strawberries will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            
            document.getElementById('feedUntilGifted').style.display=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='strawberry'&&!player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted?'block':'none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.strawberry.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            let feed=function(amount){
                
                howManyToFeed.style.display='none'
                
                items.blueberry.amount-=amount
                player.updateInventory()
                
                let isFavorite=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='strawberry',bondToAdd=amount*25*(isFavorite?2:1)
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=bondToAdd
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(bondToAdd+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                if(isFavorite){
                    
                    player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee loves strawberries! ╰(*°▽°*)╯",COLORS.bondArr)
                }
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas(bondToAdd+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
            
            document.getElementById('feedThisAmount').onclick=function(){feed(feedAmount.value)}
            
            document.getElementById('feedUntilGifted').onclick=function(){
                
                let am=MATH.simulateProbabilityTries(1/15000)
                
                if(am<items.strawberry.amount){
                    
                    player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
                    player.addMessage('After '+MATH.abvNumber(am+'')+' treats.....',COLORS.honey)
                    player.addMessage('⭐ The treat made the bee gifted! ⭐',COLORS.honey)
                    feed(am)
                    player.updateHive()
                    
                } else {
                    
                    player.addMessage('The treat failed to make the bee gifted :(',COLORS.redArr)
                    feed(items.strawberry.amount)
                }
            }
            
        }
    },
    
    pineapple:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*2/2048,v:128*5/2048,value:2,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many pineapples will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            
            document.getElementById('feedUntilGifted').style.display=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='pineapple'&&!player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted?'block':'none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.pineapple.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            let feed=function(amount){
                
                howManyToFeed.style.display='none'
                
                items.pineapple.amount-=amount
                player.updateInventory()
                
                let isFavorite=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='pineapple',bondToAdd=amount*25*(isFavorite?2:1)
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=bondToAdd
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(bondToAdd+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                if(isFavorite){
                    
                    player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee loves pineapple! ╰(*°▽°*)╯",COLORS.bondArr)
                }
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas(bondToAdd+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
            
            document.getElementById('feedThisAmount').onclick=function(){feed(feedAmount.value)}
            
            document.getElementById('feedUntilGifted').onclick=function(){
                
                let am=MATH.simulateProbabilityTries(1/15000)
                
                if(am<items.pineapple.amount){
                    
                    player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
                    player.addMessage('After '+MATH.abvNumber(am+'')+' treats.....',COLORS.honey)
                    player.addMessage('⭐ The treat made the bee gifted! ⭐',COLORS.honey)
                    feed(am)
                    player.updateHive()
                    
                } else {
                    
                    player.addMessage('The treat failed to make the bee gifted :(',COLORS.redArr)
                    feed(items.pineapple.amount)
                }
            }
            
        }
    },
    
    sunflowerSeed:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!==null
        },
        amount:0,u:128*3/2048,v:128*5/2048,value:2,
        use:function(){
            
            howManyToFeed.style.display='block'
            feedAmount.value=1
            howManyMessage.innerHTML='How many sunflower seeds will you feed to '+MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+' Bee?'
            
            document.getElementById('feedUntilGifted').style.display=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='sunflowerSeed'&&!player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted?'block':'none'
            
            howManyToFeed.onmousemove=feedAmount.onchange=function(){
                
                let a=feedAmount.value
                feedAmount.value=MATH.constrain(a,1,items.sunflowerSeed.amount)
            }
            
            document.getElementById('cancelFeeding').onclick=function(){
                howManyToFeed.style.display='none'
            }
            
            let feed=function(amount){
                
                howManyToFeed.style.display='none'
                
                items.sunflowerSeed.amount-=amount
                player.updateInventory()
                
                let isFavorite=beeInfo[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type].favoriteTreat==='sunflowerSeed',bondToAdd=amount*25*(isFavorite?2:1)
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond+=bondToAdd
                
                let l,r=[0,10,50,250,1000,5000,20000,80000,350000,800000,2000000,4000000,8000000,15000000,30000000,150000000,600000000,2500000000,10000000000,25000000000]
                
                for(let i in r){
                    
                    if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond>=r[i]){
                        
                        l=i
                    }
                }
                
                if(l<20){
                    
                    l++
                }
                
                let leveled
                
                if(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level!==l){
                    
                    leveled=true
                }
                
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level=l
                player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.computeLevel(l)
                textRenderer.add(bondToAdd+'',[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[0],player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[1]+1,player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.pos[2]],COLORS.bondArr,0,'+',1.2)
                
                if(isFavorite){
                    
                    player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee loves sunflower seeds! ╰(*°▽°*)╯",COLORS.bondArr)
                }
                
                player.addMessage(MATH.doGrammar(player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bee.type)+" Bee's bond improved",COLORS.bondArr)
                player.addMessage('by '+MATH.addCommas(bondToAdd+'')+(leveled?' and advanced to level '+l+'!':'!'),COLORS.bondArr)
                player.addMessage('('+MATH.addCommas((player.hive[player.hiveIndex[1]][player.hiveIndex[0]].bond-r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level-1])+'')+'/'+MATH.addCommas(r[player.hive[player.hiveIndex[1]][player.hiveIndex[0]].level]+'')+') to level up',COLORS.bondArr)
                
            }
            
            document.getElementById('feedThisAmount').onclick=function(){feed(feedAmount.value)}
            
            document.getElementById('feedUntilGifted').onclick=function(){
                
                let am=MATH.simulateProbabilityTries(1/15000)
                
                if(am<items.sunflowerSeed.amount){
                    
                    player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
                    player.addMessage('After '+MATH.abvNumber(am+'')+' treats.....',COLORS.honey)
                    player.addMessage('⭐ The treat made the bee gifted! ⭐',COLORS.honey)
                    feed(am)
                    player.updateHive()
                    
                } else {
                    
                    player.addMessage('The treat failed to make the bee gifted :(',COLORS.redArr)
                    feed(items.sunflowerSeed.amount)
                }
            }
            
        }
    },
    
    basicEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type!=='basic'
        },
        amount:0,u:128*4/2048,v:128*5/2048,value:60,
        use:function(){
            
            items.basicEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type='basic'
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=Math.random()<1/100
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            
            player.updateHive()
        }
    },
    
    silverEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*5/2048,v:128*5/2048,value:90,
        use:function(){
            
            let types={mythic:1/4000,legendary:0.075-(1/4000),epic:0.325,rare:0.6},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.silverEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=Math.random()<1/100
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            
            player.updateHive()
        }
    },
    
    goldEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*6/2048,v:128*5/2048,value:125,
        use:function(){
            
            let types={mythic:1/500,legendary:0.3-(1/500),epic:0.7},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.goldEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=Math.random()<1/100
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    diamondEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*7/2048,v:128*5/2048,value:200,
        use:function(){
            
            let types={mythic:0.05,legendary:0.95},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.diamondEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=Math.random()<1/100
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    mythicEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*0/2048,v:128*6/2048,value:250,
        use:function(){
            
            let types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity==='mythic'){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.mythicEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=Math.random()<1/100
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    giftedSilverEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*5/2048,v:128*8/2048,value:150,
        use:function(){
            
            let types={mythic:1/4000,legendary:0.075-(1/4000),epic:0.325,rare:0.6},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.giftedSilverEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            
            player.updateHive()
        }
    },
    
    giftedGoldEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*6/2048,v:128*8/2048,value:225,
        use:function(){
            
            let types={mythic:1/500,legendary:0.3-(1/500),epic:0.7},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.giftedGoldEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    giftedDiamondEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*7/2048,v:128*8/2048,value:300,
        use:function(){
            
            let types={mythic:0.05,legendary:0.95},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.giftedDiamondEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    giftedMythicEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*0/2048,v:128*9/2048,value:375,
        use:function(){
            
            let types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity==='mythic'){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.giftedMythicEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    starEgg:{
        
        canUseOnSlot:(slot)=>{
            
            return true
        },
        amount:0,u:128*1/2048,v:128*9/2048,value:350,
        use:function(){
            
            let types=[],alreadyGot=[]
            
            for(let i in objects.bees){
                
                if(objects.bees[i].gifted){
                    
                    alreadyGot.push(objects.bees[i].type)
                }
            }
            
            for(let i in beeInfo){
                
                if(alreadyGot.indexOf(i)<0){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.starEgg.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You hatched a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    royalJelly:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type
        },
        amount:0,u:128*3/2048,v:128*8/2048,value:10,
        use:function(){
            
            let types={mythic:1/4000,legendary:0.075-(1/4000),epic:0.325,rare:0.6},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.royalJelly.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=Math.random()<1/100
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You got a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    starJelly:{
        
        canUseOnSlot:(slot)=>{
            
            return slot.type
        },
        amount:0,u:128*4/2048,v:128*8/2048,value:90,
        use:function(){
            
            let types={mythic:1/4000,legendary:0.075-(1/4000),epic:0.325,rare:0.6},r=Math.random(),type,c=0
            
            for(let i in types){
                
                if(r<=types[i]+c){
                    
                    type=i
                    break
                }
                
                c+=types[i]
            }
            
            types=[]
            
            for(let i in beeInfo){
                
                if(beeInfo[i].rarity===type){
                    
                    types.push(i)
                }
            }
            
            type=types[(Math.random()*types.length)|0]
            
            items.starJelly.amount--
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type=type
            player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted=true
            
            player.beePopup={type:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].type,message:'You got a...',time:TIME,gifted:player.hive[player.hiveIndex[1]][player.hiveIndex[0]].gifted}
            
            player.updateHive()
        }
    },
    
    glitter:{
        
        amount:0,u:0,v:128*7/2048,value:25,
        use:function(){
            
            if(player.fieldIn){

                let f=player.fieldIn
                player.addEffect(f[0].toLowerCase()+f.substring(1,f.length)+'Boost')
                player.addEffect(f[0].toLowerCase()+f.substring(1,f.length)+'Winds')
                player.addEffect(f[0].toLowerCase()+f.substring(1,f.length)+'Winds')
                player.addEffect(f[0].toLowerCase()+f.substring(1,f.length)+'Winds')
                items.glitter.amount--

            } else {

                player.addMessge('You must be standing in a field to use glitter!',COLORS.redArr)
            }
        }
    },
}

for(let i in items){
    
    items[i].maxCooldown=items[i].cooldown||0
    items[i].cooldown=-Infinity
    
    if(i!=='honey'){

        items[i].svg=document.getElementById(i)
        items[i].amountText=document.getElementById(i+'_amount')
        items[i].svg.onmousedown=function(e){
            
            if(player.itemDragging===i){
                
                player.itemDragging=false
                
            } else {
                
                player.itemDragging=i
            }
        }
    }
}

let beequips={
    
    candycane:{
        
        svgCode:`<svg onmousedown='window.functionToRunOnBeequipClick(#ID)' style='width:200;height:70;cursor:pointer;border-radius:8px'><rect width='200' height='70' fill='rgb(255,255,255)'></rect><rect width='70' height='70' fill='rgb(225,225,225)'></rect><text x='132' y='15' style='font-family:trebuchet ms;font-size:16.5px;' fill='rgb(0,0,0)' text-anchor='middle'>Candy Cane</text><text x='132' y='31' style='font-family:trebuchet ms;font-size:10px;' fill='rgb(0,0,0)' text-anchor='middle'>This stick of candy causes</text><text x='132' y='43' style='font-family:trebuchet ms;font-size:9.9px;' fill='rgb(0,0,0)' text-anchor='middle'>dramatic bee hyperactivity,</text><text x='132' y='54' style='font-family:trebuchet ms;font-size:10px;' fill='rgb(0,0,0)' text-anchor='middle'>sticks to pollen, and turns</text><text x='133' y='65' style='font-family:trebuchet ms;font-size:9.7px;' fill='rgb(0,0,0)' text-anchor='middle'>into a sharp, deadly weapon.</text><text style=''></text><defs><linearGradient id='candyStripes' x1='0' y1='0' x2='1' y2='-0.1'><stop offset='10%' stop-color='rgb(255,0,0)'/><stop offset='10%' stop-color='rgb(255,255,225)'/><stop offset='20%' stop-color='rgb(255,255,225)'/><stop offset='20%' stop-color='rgb(255,0,0)'/><stop offset='30%' stop-color='rgb(255,0,0)'/><stop offset='30%' stop-color='rgb(255,255,225)'/><stop offset='40%' stop-color='rgb(255,255,225)'/><stop offset='40%' stop-color='rgb(255,0,0)'/><stop offset='50%' stop-color='rgb(255,0,0)'/><stop offset='50%' stop-color='rgb(255,255,225)'/><stop offset='60%' stop-color='rgb(255,255,225)'/><stop offset='60%' stop-color='rgb(255,0,0)'/><stop offset='70%' stop-color='rgb(255,0,0)'/><stop offset='70%' stop-color='rgb(255,255,225)'/><stop offset='80%' stop-color='rgb(255,255,225)'/><stop offset='80%' stop-color='rgb(255,0,0)'/><stop offset='90%' stop-color='rgb(255,0,0)'/><stop offset='90%' stop-color='rgb(255,255,225)'/></linearGradient></defs><path fill='url(#candyStripes)' stroke='black' stroke-width='1' d='M-14 7L10 6C15 6 15 -5 10 -5L 8 -3C12 -3 12 3 8 3z' transform='translate(32,34) scale(1.75,1.75) rotate(-19.2)'></path></svg>`,
        potentials:[2,4,4,3,3,3,3,3],
        level:6,
        color:'any',
        // reqStr:"<br><br><p style='font-size:15px;'>Bee</p><br>",
        reqStr:"<br><br><br><br>",
        canUseOnSlot:function(slot){
            
            return slot.type
        },
        
        generateStats:function(potential){
            
            let b='',p='',np=potential/5 
            
            if(Math.random()<np){
                
                b+='+'+((MATH.random(2,7)*(np*0.15+1))|0)+' gatherAmount(+0),'
            }
            
            if(Math.random()<np*0.65){
                
                b+='*1.05 abilityRate(+0),'
            }
            
            b+='*'+(MATH.random(1.075,1.2)*(np*0.1+1)).toFixed(2)+' attack(+0),'
            b+='*'+MATH.random(0.8,0.95).toFixed(2)+' maxEnergy(+0),'
            b+='*'+(MATH.random(1.075,1.15)*(np*0.1+1)).toFixed(2)+' speed(+0),'
            
            if(Math.random()<np*0.5){
                
                p+='*'+(MATH.random(1.01,1.04)*(np*0.01+1)).toFixed(2)+' beeSpeed(+0),'
                
            }
            
            if(Math.random()<np*0.5){
                
                p+='*'+(MATH.random(1.01,1.03)*(np*0.01+1)).toFixed(2)+' redPollen(+0),'
                
            }
            
            return {bee:b[b.length-1]===','?b.substr(0,b.length-1):b,player:p[p.length-1]===','?p.substr(0,p.length-1):p}
        }
    },
    
    boombox:{
        
        svgCode:`<svg onmousedown='window.functionToRunOnBeequipClick(#ID)' style='width:200;height:70;cursor:pointer;border-radius:8px'><rect width='200' height='70' fill='rgb(255,255,255)'></rect><rect width='70' height='70' fill='rgb(225,225,225)'></rect><text x='132' y='15' style='font-family:trebuchet ms;font-size:16.5px;' fill='rgb(0,0,0)' text-anchor='middle'>Boombox</text><text x='132' y='31' style='font-family:trebuchet ms;font-size:10px;' fill='rgb(0,0,0)' text-anchor='middle'>Energize and motivate your</text><text x='132' y='43' style='font-family:trebuchet ms;font-size:9.9px;' fill='rgb(0,0,0)' text-anchor='middle'>bees with upbeat musical</text><text x='132' y='54' style='font-family:trebuchet ms;font-size:10px;' fill='rgb(0,0,0)' text-anchor='middle'>hits by Bee Gees or</text><text x='133' y='65' style='font-family:trebuchet ms;font-size:9.7px;' fill='rgb(0,0,0)' text-anchor='middle'>Beethoven!</text><text style=''></text><rect x='26' y='23' width='20' height='22' rx='6' stroke='rgb(0,170,0)' stroke-width='3.5' fill='rgb(0,0,0,0)'></rect>
<rect x='19' y='30' width='35' height='20' rx='4' stroke='black' stroke-width='1.5' fill='rgb(19, 93, 212)'></rect>
<circle cx='30' cy='38' r='5' stroke='black' stroke-width='1' fill='rgb(251, 255, 0)'></circle>
<circle cx='45' cy='38' r='5' stroke='black' stroke-width='1' fill='rgb(251, 255, 0)'></circle>
<circle cx='30' cy='38' r='1.5' fill='rgb(0, 0, 0)'></circle>
<circle cx='45' cy='38' r='1.5' fill='rgb(0, 0, 0)'></circle>
<rect x='32' y='45' width='5' height='3' fill='rgb(255,0,255)'></rect><rect x='39' y='45' width='5' height='3' fill='rgb(255,0,0)'></rect></svg>`,
        potentials:[4,4,4,4,3,5,5],
        level:7,
        color:'any',
        // reqStr:"<br><br><p style='font-size:15px;'>Bee</p><br>",
        reqStr:"<br><br><br><br>",
        canUseOnSlot:function(slot){
            
            return slot.type
        },
        
        generateStats:function(potential){
            
            let b='',p='',np=potential/5 
            
            b+='*'+(MATH.random(1.1,1.2)*(np*0.1+1)).toFixed(2)+' abilityRate(+0),'
            
            b+='*'+MATH.random(1.1,np*0.25+1).toFixed(2)+' maxEnergy(+0),'
            b+='*'+(MATH.random(1.05,1.175)*(np*0.1+1)).toFixed(2)+' speed(+0)'
            
            if(Math.random()<np*0.35){
                
                p+='*'+(MATH.random(1.01,1.04)*(np*0.01+1)).toFixed(2)+' convertRate(+0)'
                
            }
            
            return {bee:b[b.length-1]===','?b.substr(0,b.length-1):b,player:p[p.length-1]===','?p.substr(0,p.length-1):p}
        },
        
        extraAbility:'gathering_melody'
    },
    
    pencil:{
        
        svgCode:`<svg onmousedown='window.functionToRunOnBeequipClick(#ID)' style='width:200;height:70;cursor:pointer;border-radius:8px'><rect width='200' height='70' fill='rgb(255,255,255)'></rect><rect width='70' height='70' fill='rgb(225,225,225)'></rect><text x='132' y='15' style='font-family:trebuchet ms;font-size:16.5px;' fill='rgb(0,0,0)' text-anchor='middle'>Pencil</text><text x='132' y='33' style='font-family:trebuchet ms;font-size:11px;' fill='rgb(0,0,0)' text-anchor='middle'>A special pencil only</text><text x='132' y='46' style='font-family:trebuchet ms;font-size:11px;' fill='rgb(0,0,0)' text-anchor='middle'>for the smartest of</text><text x='132' y='59' style='font-family:trebuchet ms;font-size:11px;' fill='rgb(0,0,0)' text-anchor='middle'>bees(and people).</text><text style=''></text><g transform='scale(0.9,0.9) rotate(20) translate(12,-15)'><rect x='34' y='16' width='7' height='40' stroke='black' stroke-width='2' fill='rgb(86, 252, 136)'></rect><rect x='34' y='15' width='7' height='7' stroke='black' stroke-width='2' fill='rgb(250, 110, 147)'></rect><rect x='34' y='20' width='7' height='4' stroke='black' stroke-width='2' fill='rgb(170,170,170)'></rect><path stroke='black' stroke-width='2' fill='rgb(214, 193, 101)' d='M 34 57 L 41 57L 37.5 65z'></path><rect x='36.6' y='61' width='1' height='1' stroke='black' stroke-width='2' fill='rgb(0,0,0)'></rect></g></svg>`,
        potentials:[2,3,3,3,3],
        level:4,
        color:'any',
        // reqStr:"<br><br><p style='font-size:15px;'>Bee</p><br>",
        reqStr:"<br><br><br><br>",
        canUseOnSlot:function(slot){
            
            return slot.type
        },
        
        generateStats:function(potential){
            
            let b='',p='',np=potential/5 
            
            b+='*'+MATH.random(1.15,1.35).toFixed(2)+' abilityRate(+0),'
            
            if(Math.random()<np*0.85){
                
                b+='*'+MATH.random(1.1,np*0.35+1).toFixed(2)+' maxEnergy(+0),'
            }

            if(Math.random()<np*0.35){
                
                b+='+'+(MATH.random(5,potential*3+10)|0)+' convertAount(+0)'
                
            }
            
            return {bee:b[b.length-1]===','?b.substr(0,b.length-1):b,player:p[p.length-1]===','?p.substr(0,p.length-1):p}
        },
        
        extraAbility:'gathering_focus'
    }
}

let COLORS={
    
    blue:'rgb(20,84,186)',
    red:'rgb(255,0,0)',
    white:'rgb(255,255,255)',
    blueArr:[20,84,186],
    redArr:[255,0,0],
    whiteArr:[255,255,255],
    honey:[255,226,8],
    honey_normalized:[1,226/255,8/255],
    bondArr:[240,72,218],
}

let objects={
    
    tokens:[],
    bees:[],
    tempBees:[],
    explosions:[],
    flames:[],
    bubbles:[],
    marks:[],
    balloons:[],
    mobs:[],
    targets:[],
    triangulates:[],
    fuzzBombs:[],
    planters:[],
    
},meshes={
    
    tokens:{
        
        instanceBuffer:gl.createBuffer(),
        instanceData:[],
    },
    
    bees:{
        
        instanceBuffer:gl.createBuffer(),
        instanceData:[],
    },
    
    explosions:{
        
        instanceBuffer:gl.createBuffer(),
        instanceData:[],
    },
    
    cylinder_explosions:{
        
        instanceBuffer:gl.createBuffer(),
        instanceData:[],
    },
}

class Bee {
    
    constructor(pos,type,lvl,gifted,x,y,mutation){
        
        this.meshScale=type==='baby'||type==='tadpole'?0.65:1
        this.GIFTED_BEE_TEXTURE_OFFSET=beeInfo[type].v+(gifted?GIFTED_BEE_TEXTURE_OFFSET:0)

        this.mutation=mutation
        this.hiveX=x
        this.hiveY=y
        this.gifted=gifted
        this.hivePos=pos.slice()
        this.pos=pos.slice()
        this.type=type
        this.flowerIn=null
        this.moveTo=[player.body.position.x,player.body.position.y,player.body.position.z]
        this.moveOffset=[MATH.random(-5,5),0,MATH.random(-5,5)]
        this.moveDir=[]
        
        // this.computeLevel(lvl||1)
        this.computeLevel(20)
        
        this.convertTimer=0
        this.flowerCollecting=[]
        this.state='moveToPlayer'
        this.emitParticle=TIME
        this.collectRot=[]
        this.pollen=0
        this.attackTimer=1
        this.trail={addPos:function(){}}
        
        this.trails=[]
        this.beeOffsets=[]
        
        for(let i in beeInfo[this.type].trails){
            
            this.trails.push(new TrailRenderer.ConstantTrail(beeInfo[this.type].trails[i]))
            this.beeOffsets.push(beeInfo[this.type].trails[i].beeOffset||0)
            
        }
    }
    
    computeLevel(newLevel){
        
        this.gatheringTokens=[{type:'inspire',cooldown:effects.inspire.trialCooldown,rate:effects.inspire.trialRate,timer:-10000,requireGifted:true}]
        
        for(let i in beeInfo[this.type].tokens){
            
            let t=beeInfo[this.type].tokens[i].replace('*',''),g=beeInfo[this.type].tokens[i].indexOf('*')>-1
            
            this.gatheringTokens.push({type:t,cooldown:effects[t].trialCooldown,rate:effects[t].trialRate,timer:-10000,requireGifted:g})
            
        }
        
        this.attackTokens=[]
        
        for(let i in beeInfo[this.type].attackTokens){
            
            let t=beeInfo[this.type].attackTokens[i].replace('*',''),g=beeInfo[this.type].attackTokens[i].indexOf('*')>-1
            
            this.attackTokens.push({type:t,cooldown:effects[t].trialCooldown,rate:effects[t].trialRate,timer:-10000,requireGifted:g})
            
        }
        
        this.level=newLevel
        
        newLevel--
        
        this.speed=beeInfo[this.type].speed
        this.gatherSpeed=beeInfo[this.type].gatherSpeed
        this.gatherAmount=beeInfo[this.type].gatherAmount
        this.convertAmount=beeInfo[this.type].convertAmount
        this.convertSpeed=beeInfo[this.type].convertSpeed
        this.maxEnergy=beeInfo[this.type].energy
        this.attack=beeInfo[this.type].attack
        this.abilityRate=1

        if(this.type==='digital'){

            this.attack+=player.drives.red*0.3
            this.convertAmount+=player.drives.blue*20
            this.gatherAmount+=player.drives.white*2.5
            this.abilityRate+=player.drives.glitched*0.0075

            if(player.drives.red>=50&&player.drives.blue>=50&&player.drives.white>=50&&player.drives.glitched>=50){

                this.speed+=10
                player.drives.maxed=true
            }
        }
        
        if(this.mutation){
            
            if(this.mutation.oper==='*'){
                
                this[this.mutation.stat]*=this.mutation.num
                
            } else {
                
                this[this.mutation.stat]+=this.mutation.num
            }
        }
        
        if(player.hive[this.hiveY][this.hiveX].beequip){
            
            let stats=player.hive[this.hiveY][this.hiveX].beequip.stats.bee
            
            stats=stats.split(',')
            
            for(let i in stats){
                
                let str=stats[i]
                
                if(str[0]==='*'){   
                    
                    this[str.substring(str.indexOf(' ')+1,str.indexOf('('))]*=Number(str.substr(1,str.indexOf(' ')-1))+Number(str.substr(str.indexOf('(')+2,str.length).replace(')',''))

                } else {
                    
                    this[str.substring(str.indexOf(' ')+1,str.indexOf('('))]+=Number(str.substr(1,str.indexOf(' ')-1))+Number(str.substr(str.indexOf('(')+2,str.length).replace(')',''))
                }
            }
            
            if(beequips[player.hive[this.hiveY][this.hiveX].beequip.type].extraAbility){
                
                let ab=beequips[player.hive[this.hiveY][this.hiveX].beequip.type].extraAbility.split('_')
                
                this[ab[0]+'Tokens'].push({type:ab[1],cooldown:effects[ab[1]].trialCooldown,rate:effects[ab[1]].trialRate,timer:-10000})
                
            }
        }
        
        this.speed*=newLevel*0.03+1
        this.gatherAmount*=newLevel*0.1+1
        this.convertAmount*=newLevel*0.1+1
        this.maxEnergy*=newLevel*0.05+1
        
        if(this.gifted){
            
            this.gatherAmount*=1.5
            this.convertAmount*=1.5
            this.attack*=1.5
        }
        
        this.speed/=6
        
        this.energy=MATH.random(0.25,1)*this.maxEnergy
    }
    
    update(){
        
        if(player.hive[this.hiveY][this.hiveX].radioactive>0){
            
            textRenderer.addDecalRaw(...this.pos,0,0,...textRenderer.decalUV['glow'],0,1,0,2.5,2.5,0)
        }
        
        for(let i in this.trails){
            
            this.trails[i].addPos([this.pos[0],this.pos[1]+this.beeOffsets[i],this.pos[2]])
        }
        
        if(this.energy<=0&&this.state!=='sleep'&&this.state!=='moveToTriangulate'&&this.state!=='moveToTargetPractice'&&this.state!=='shootTargetPractice'){
            
            this.state='moveToSleep'
        }
        
        if(player.attacked.length>0&&(this.state!=='sleep'&&this.state!=='moveToSleep'&&this.state!=='attack'&&this.state!=='moveToAttack')&&this.state!=='moveToTriangulate'&&this.state!=='moveToTargetPractice'&&this.state!=='shootTargetPractice'){
            
            this.attackMob=player.attacked[(Math.random()*player.attacked.length)|0]
            this.state='moveToAttack'
            let _a=Math.random()*MATH.TWO_PI
            this.attackOffset=[Math.cos(_a)*2,Math.sin(_a)*2]
        }
        
        switch(this.state){
            
            case 'moveToAttack':
                
                if(!player.attacked.length||!this.attackMob||this.attackMob.state!=='attack'){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.moveTo=[this.attackMob.pos[0]+this.attackOffset[0],this.attackMob.pos[1]+(this.type==='precise'?1.25:0.25),this.attackMob.pos[2]+this.attackOffset[1]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<0.8){
                    
                    this.state='attack'
                    
                    let _a=Math.random()*MATH.TWO_PI,r=this.type==='precise'?5:2
                    this.attackOffset=[Math.cos(_a)*r,Math.sin(_a)*r]
                    this.attackTimer=1.25+Math.random()*0.5*(this.type==='precise'?1.75:1)
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'attack':
                
                if(!player.attacked.length||!this.attackMob||this.attackMob.state!=='attack'){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.attackTimer-=dt
                
                if(this.attackTimer<=0){
                    
                    this.energy--
                    
                    this.state='moveToAttack'
                    
                    this.attackMob=player.attacked[(Math.random()*player.attacked.length)|0]
                    
                    if(Math.random()<(this.attackMob.blocking?0.85:0)){
                        this.energy--
                        
                        textRenderer.add('BLOCK',[this.attackMob.pos[0],this.attackMob.pos[1]+Math.random()*2.75+1.5,this.attackMob.pos[2]],[255,255,255],0,'',1.75,false)
                        
                    } else {
                    
                        if(Math.random()<(this.type==='precise'?Math.max(Math.pow(2,(this.gifted?2:1)+this.level-this.attackMob.level),0.05):Math.pow(2,this.level-this.attackMob.level))){
                            
                            let h=(this.attack+player[beeInfo[this.type].color+'BeeAttack'])*player.beeAttack*(this.type==='precise'?this.gifted?2.25:1.5:1)
                            
                            this.attackMob.damage(h)
                            
                            if(this.type==='precise'){
                                
                                objects.explosions.push(new Explosion({col:[1,0,0],pos:this.pos,life:0.75,size:1.75,speed:0.3,aftershock:0}))
                            }
                            
                        } else {
                            
                            this.energy--
                            
                            textRenderer.add('MISS',[this.attackMob.pos[0],this.attackMob.pos[1]+Math.random()*2.75+1.5,this.attackMob.pos[2]],[255,255,255],0,'',1.75,false)
                            
                        }
                    }
                    
                    let token,openTokens=[]
                    
                    for(let i in this.attackTokens){
                        
                        let g=this.attackTokens[i]
                        
                        if((TIME-g.timer)*player[beeInfo[this.type].color+'BeeAbilityRate']*this.abilityRate>=g.cooldown&&Math.random()<=g.rate&&(g.requireGifted&&this.gifted||!g.requireGifted)){
                            
                            openTokens.push(i)
                        }
                    }
                    
                    if(openTokens.length){
                        
                        token=openTokens[(Math.random()*openTokens.length)|0]
                        this.attackTokens[token].timer=TIME
                        
                        token=this.attackTokens[token].type
                        
                        objects.tokens.push(new Token(effects[token].tokenLife,[Math.round(this.pos[0]),player.body.position.y+0.5,Math.round(this.pos[2])],token,{field:player.fieldIn,x:this.flowerCollecting[0],z:this.flowerCollecting[1],bee:this},true))
                        
                    }
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],TIME*5,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'moveToPlayer':
                
                if(player.fieldIn&&player.pollen<player.capacity){
                    
                    if(fieldInfo[player.fieldIn].planter){

                        let chance=0.07,p=fieldInfo[player.fieldIn].planter

                        if(p.type==='redClay'){

                            if(beeInfo[this.type]==='red'){

                                chance*=1.5

                            } else if(beeInfo[this.type]==='blue'){

                                chance=0
                            }
                        }

                        if(p.type==='blueClay'){

                            if(beeInfo[this.type]==='blue'){

                                chance*=1.5

                            } else if(beeInfo[this.type]==='red'){

                                chance=0
                            }
                        }

                        if(p.type==='pesticide'&&this.mutation){

                            chance*=1.6
                        }

                        if(p.type==='petal'&&beeInfo[this.type]==='white'){

                            chance*=1.75
                        }

                        if(p.type==='plenty'&&this.gifted){

                            chance*=1.75
                        }

                        if(Math.random()<chance){

                            this.state='moveToPlanter'
                            let t=Math.random()*MATH.TWO_PI
                            this.collectRot=[Math.sin(t),-4,Math.cos(t)]
                            
                            return
                        }
                    }

                    this.state='moveToFlower'
                    return
                }
                
                this.moveTo=[player.body.position.x+this.moveOffset[0],player.body.position.y,player.body.position.z+this.moveOffset[2]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<0.8){
                    
                    this.moveOffset=[MATH.random(-4,4),0,MATH.random(-4,4)]
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
                if(player.converting&&player.pollen){
                    
                    this.state='moveToHiveToConvert'
                    return
                }
                
                if(player.convertingBalloon&&player.hiveBalloon.pollen){
                    
                    this.state='moveToHiveToConvertBalloon'
                }
                
            break

            case 'moveToPlanter':
                
                if(!player.fieldIn||player.pollen>=player.capacity||!fieldInfo[player.fieldIn].planter){
                    
                    this.state='moveToPlayer'
                    break
                }
                
                let p=fieldInfo[player.fieldIn].planter
                
                this.moveTo=[p.pos[0],p.pos[1]+p.height+p.displaySize+0.2,p.pos[2]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                
                if(vec3.sqrDist(this.moveTo,this.pos)<0.075){
                    
                    this.state='collectPlanter'
                    this.collectTimer=this.gatherSpeed*(this.type==='spicy'?1/player.flameHeatStack:1)
                    this.planterSipTime=this.collectTimer
                    return
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break

            case 'collectPlanter':
                
                if(!player.fieldIn||player.pollen>=player.capacity||!fieldInfo[player.fieldIn].planter){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.collectTimer-=dt
                
                if(this.collectTimer<=0){
                    
                    this.energy--

                    fieldInfo[player.fieldIn].planter.beeSipped(this)
                    
                    let token,openTokens=[]
                    
                    for(let i in this.gatheringTokens){
                        
                        let g=this.gatheringTokens[i]
                        
                        if((TIME-g.timer)*player[beeInfo[this.type].color+'BeeAbilityRate']*this.abilityRate>=g.cooldown&&Math.random()<=g.rate&&(g.requireGifted&&this.gifted||!g.requireGifted)){
                            
                            openTokens.push(i)
                        }
                    }
                    
                    if(openTokens.length){
                        
                        token=openTokens[(Math.random()*openTokens.length)|0]
                        this.gatheringTokens[token].timer=TIME
                        
                        token=this.gatheringTokens[token].type
                        
                        objects.tokens.push(new Token(effects[token].tokenLife,[Math.round(this.pos[0]),fieldInfo[player.fieldIn].y+1,Math.round(this.pos[2])],token,{field:player.fieldIn,x:fieldInfo[player.fieldIn].x|0,z:fieldInfo[player.fieldIn].z|0,bee:this}))
                        
                    }
                    
                    this.state='moveToFlower'
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.collectRot[0],this.collectRot[1],this.collectRot[2],BEE_COLLECT,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'moveToFlower':
                
                if(!player.fieldIn||player.pollen>=player.capacity){
                    
                    this.state='moveToPlayer'
                    break
                }
                
                let f=fieldInfo[player.fieldIn]
                
                while(this.flowerCollecting[0]===undefined||this.flowerCollecting[1]===undefined||this.flowerCollecting[0]<0||this.flowerCollecting[0]>=f.width||this.flowerCollecting[1]<0||this.flowerCollecting[1]>=f.length){
                    
                    this.flowerCollecting[0]=player.flowerIn.x+(Math.round(MATH.random(-7,7)))
                    this.flowerCollecting[1]=player.flowerIn.z+(Math.round(MATH.random(-7,7)))
                    
                    let t=Math.random()*MATH.TWO_PI
                    this.collectRot=[Math.sin(t),-4,Math.cos(t)]
                }
                
                this.moveTo=[f.x+this.flowerCollecting[0],f.y+flowers[player.fieldIn][this.flowerCollecting[1]][this.flowerCollecting[0]].height*0.5+0.25,f.z+this.flowerCollecting[1]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                
                if(vec3.sqrDist(this.moveTo,this.pos)<0.075){
                    
                    this.state='collectPollen'
                    this.collectTimer=this.gatherSpeed*(this.type==='spicy'?1/player.flameHeatStack:1)
                    return
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'collectPollen':
                
                if(!player.fieldIn||player.pollen>=player.capacity){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.collectTimer-=dt
                
                if(this.collectTimer<=0){
                    
                    this.energy--
                    collectPollen({x:this.flowerCollecting[0],z:this.flowerCollecting[1],pattern:[[0,0]],amount:this.gatherAmount,yOffset:MATH.random(0.7,1.3),multiplier:{r:beeInfo[this.type].color==='red'?player.pollenFromBees*1.2:player.pollenFromBees,b:beeInfo[this.type].color==='blue'?player.pollenFromBees*1.2:player.pollenFromBees,w:player.pollenFromBees}})
                    
                    if(beeInfo[this.type].gatheringPassive){
                        
                        beeInfo[this.type].gatheringPassive(this)
                    }
                    
                    let token,openTokens=[]
                    
                    for(let i in this.gatheringTokens){
                        
                        let g=this.gatheringTokens[i]
                        
                        if((TIME-g.timer)*player[beeInfo[this.type].color+'BeeAbilityRate']*this.abilityRate>=g.cooldown&&Math.random()<=g.rate&&(g.requireGifted&&this.gifted||!g.requireGifted)){
                            
                            openTokens.push(i)
                        }
                    }
                    
                    if(openTokens.length){
                        
                        token=openTokens[(Math.random()*openTokens.length)|0]
                        this.gatheringTokens[token].timer=TIME
                        
                        token=this.gatheringTokens[token].type
                        
                        objects.tokens.push(new Token(effects[token].tokenLife,[Math.round(this.pos[0]),fieldInfo[player.fieldIn].y+1,Math.round(this.pos[2])],token,{field:player.fieldIn,x:this.flowerCollecting[0],z:this.flowerCollecting[1],bee:this}))
                        
                    }
                    
                    this.flowerCollecting=[]
                    this.state='moveToPlayer'
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.collectRot[0],this.collectRot[1],this.collectRot[2],BEE_COLLECT,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'moveToHiveToConvert':
                
                if(!player.converting||!player.pollen){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.moveTo=this.hivePos.slice()
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<0.8){
                    
                    this.pos=this.hivePos.slice()
                    this.state='convertHoney'
                    this.convertTimer=this.convertSpeed
                    
                    let amountToTake=Math.min(Math.round(this.convertAmount*player.convertRate*player[beeInfo[this.type].color+'ConvertRate']*player.convertRateAtHive),player.pollen)
                    
                    if(amountToTake===player.pollen){
                        
                        this.lastBeeToConvert=true
                    }
                    
                    player.pollen-=amountToTake
                    this.pollen=amountToTake
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
        
            break
            
            case 'convertHoney':
                
                if(!player.converting){
                    
                    player.pollen+=this.pollen
                    this.pollen=0
                    this.state='moveToPlayer'
                    return
                }
                
                this.convertTimer-=dt
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,0,1,0,TIME*5,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                if(this.convertTimer<=0){
                    
                    this.state='moveToHiveToConvert'
                    player.honey+=Math.ceil(this.pollen*player.honeyAtHive*player.honeyPerPollen)
                    
                    textRenderer.add(Math.ceil(this.pollen*player.honeyAtHive*player.honeyPerPollen),[player.body.position.x,player.body.position.y+Math.random()*2+0.5,player.body.position.z],COLORS.honey,0,'+')
                    
                    this.pollen=0
                    
                    if(!player.pollen&&this.lastBeeToConvert){
                        
                        this.lastBeeToConvert=false
                        player.converting=false
                        player.stopConverting=true
                    }
                    
                    for(let i=0;i<10;i++){
                        
                        ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:MATH.random(-1,1),vy:MATH.random(-1,1),vz:MATH.random(0,3),grav:0,size:MATH.random(60,100),col:COLORS.honey_normalized,life:0.75,rotVel:MATH.random(-3,3),alpha:5})
                    }
                }
                
            break
            
            case 'moveToHiveToConvertBalloon':
                
                if(!player.convertingBalloon||!player.hiveBalloon.pollen){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.moveTo=this.hivePos.slice()
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<0.8){
                    
                    this.pos=this.hivePos.slice()
                    this.state='convertBalloon'
                    this.convertTimer=this.convertSpeed
                    
                    let amountToTake=Math.min(Math.round(this.convertAmount*player.convertRate*(this.type==='buoyant'?3:1)*player[beeInfo[this.type].color+'ConvertRate']*player.convertRateAtHive),player.hiveBalloon.pollen)
                    
                    if(amountToTake===player.hiveBalloon.pollen){
                        
                        this.lastBeeToConvert=true
                    }
                    
                    player.hiveBalloon.pollen-=amountToTake
                    this.pollen=amountToTake
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
        
            break
            
            case 'convertBalloon':
                
                if(!player.convertingBalloon){
                    
                    player.hiveBalloon.pollen+=this.pollen
                    this.pollen=0
                    this.state='moveToPlayer'
                    return
                }
                
                this.convertTimer-=dt
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,0,1,0,TIME*5,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                if(this.convertTimer<=0){
                    
                    this.state='moveToHiveToConvertBalloon'
                    player.honey+=Math.ceil(this.pollen*player.honeyAtHive*player.honeyPerPollen)
                    
                    textRenderer.add(Math.ceil(this.pollen*player.honeyAtHive*player.honeyPerPollen),[player.body.position.x,player.body.position.y+Math.random()*2+0.5,player.body.position.z],COLORS.honey,0,'+')
                    
                    this.pollen=0
                    
                    if(!player.pollen&&this.lastBeeToConvert){
                        
                        this.lastBeeToConvert=false
                        player.convertingBalloon=false
                        player.stopConverting=true
                        
                    }
                    
                    for(let i=0;i<10;i++){
                        
                        ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:MATH.random(-1,1),vy:MATH.random(-1,1),vz:MATH.random(0,3),grav:0,size:MATH.random(60,100),col:COLORS.honey_normalized,life:0.75,rotVel:MATH.random(-3,3),alpha:5})
                    }
                }
                
            break
            
            case 'moveToSleep':
                
                this.moveTo=this.hivePos.slice()
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<1){
                    
                    this.pos=this.hivePos.slice()
                    this.sleepTimer=20
                    this.zzzTimer=0
                    this.state='sleep'
                    this.sleepRotate=Math.random()*MATH.TWO_PI
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'sleep':
                
                this.sleepTimer-=dt
                this.zzzTimer-=dt
                
                if(this.sleepTimer<=0){
                    
                    this.energy=this.maxEnergy*player.beeEnergy
                    this.state='moveToPlayer'
                }
                
                if(this.zzzTimer<=0){
                    
                    this.zzzTimer=5
                    textRenderer.add('zzz',[this.pos[0]+MATH.random(-1,1),this.pos[1]+MATH.random(-1,1),this.pos[2]+Math.random()+0.25],[255,255,255],0,'',1.25)
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,0,1,0,this.sleepRotate,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'moveToTargetPractice':
                
                if(!player.fieldIn){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*3)
                if(vec3.sqrDist(this.moveTo,this.pos)<0.7){
                    
                    this.pos=this.moveTo.slice()
                    this.targetPracticeTimer=4
                    this.targetExplosionTimer=0
                    this.state='shootTargetPractice'
                    this.targetLookDir=[(((fieldInfo[player.fieldIn].width*0.5)|0)+fieldInfo[player.fieldIn].x)-this.pos[0],fieldInfo[player.fieldIn].y,(((fieldInfo[player.fieldIn].length*0.5)|0)+fieldInfo[player.fieldIn].z)-this.pos[2]]
                    this.targets=[]
                    
                    for(let i=0;i<3;i++){
                        
                        let _x=((fieldInfo[player.fieldIn].width*0.5)+(Math.random()*this.targetPractice_q[0]*fieldInfo[player.fieldIn].width*0.5))|0,_z=((fieldInfo[player.fieldIn].length*0.5)+(Math.random()*this.targetPractice_q[1]*fieldInfo[player.fieldIn].length*0.5))|0
                        
                        this.targets.push(new Target(player.fieldIn,_x,_z,i+1,this))
                        objects.targets.push(this.targets[this.targets.length-1])
                        
                    }
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'shootTargetPractice':
                
                this.targetPracticeTimer-=dt
                this.targetExplosionTimer-=dt
                
                if(this.targets[0].activated&&this.targets[1].activated&&this.targets[2].activated&&this.targetPracticeTimer>0.75){
                    
                    this.targetPracticeTimer=0.75
                }
                
                if(this.targetPracticeTimer<=0.5&&!this.shotParticleProjectile){
                    this.shotParticleProjectile=true
                    
                    for(let i in this.targets){
                        
                        let vx=this.targets[i].pos[0]-this.pos[0],vy=this.targets[i].pos[1]-this.pos[1],vz=this.targets[i].pos[2]-this.pos[2],d=Math.sqrt(vx*vx+vy*vy+vz*vz),s=d/0.5,m=s/d
                        
                        ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:vx*m,vy:vy*m,vz:vz*m,grav:0,size:400,col:[1,0,0],life:0.4,rotVel:MATH.random(-9,9),alpha:1000})
                    
                    }
                }
                
                if(this.targetPracticeTimer<=0){
                    
                    this.shotParticleProjectile=false
                        
                    let t=[this.targets[0].activated,this.targets[1].activated,this.targets[2].activated]
                    
                    if(t[0]&&t[1]&&t[2]){
                        
                        for(let i in objects.tokens){
                            
                            if(objects.tokens[i].canBeLinked&&!(objects.tokens[i] instanceof DupedToken)){
                                
                                objects.tokens[i].collect()
                            }
                        }
                        
                        objects.tokens.push(new Token(effects.precision.tokenLife,[this.targets[2].pos[0],this.targets[2].pos[1]+0.5,this.targets[2].pos[2]],'precision',{field:this.targets[2].field,x:this.targets[2].x,z:this.targets[2].z,bee:this}))
                        objects.tokens.push(new Token(effects.focus.tokenLife,[this.targets[2].pos[0]+1,this.targets[2].pos[1]+0.5,this.targets[2].pos[2]],'focus',{field:this.targets[2].field,x:this.targets[2].x+1,z:this.targets[2].z,bee:this}))
                        objects.tokens.push(new Token(effects.redBoost.tokenLife,[this.targets[2].pos[0]-1,this.targets[2].pos[1]+0.5,this.targets[2].pos[2]],'redBoost',{field:this.targets[2].field,x:this.targets[2].x-1,z:this.targets[2].z,bee:this}))
                        
                    }
                    
                    if(t[2]&&this.gifted){
                        
                        if(!t[0]||!t[1]){
                            
                            objects.marks.push(new Mark(this.targets[2].field,this.targets[2].x,this.targets[2].z,'preciseMark',this.level))
                            playSound('markToken',0.6)
                        }
                    }
                    
                    for(let i in this.targets){
                        
                        let _t=this.targets[i]
                        
                        if(_t.activated){
                            
                            if(i!==2)
                                objects.tokens.push(new Token(effects.focus.tokenLife,[_t.pos[0],_t.pos[1]+0.5,_t.pos[2]],'focus',{field:_t.field,x:_t.x,z:_t.z,bee:this}))
                            
                            collectPollen({x:_t.x,z:_t.z,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:(this.attack+player[beeInfo[this.type].color+'BeeAttack'])*player.beeAttack*(this.level*0.1+1)*0.5,yOffset:2+Math.random()*0.4,stackHeight:0.5+Math.random()*0.5,instantConversion:(player.flameHeatStack-1)*0.5,multiplier:player.flameHeatStack*3,field:_t.field})
                            
                        } else {
                            
                            objects.tokens.push(new Token(effects.redBoost.tokenLife,[_t.pos[0],_t.pos[1]+0.5,_t.pos[2]],'redBoost',{field:_t.field,x:_t.x,z:_t.z,bee:this}))
                        }
                    }
                    
                    this.targets[0].splice=true
                    this.targets[1].splice=true
                    this.targets[2].splice=true
                    
                    this.state='moveToPlayer'
                    return
                }
                
                if(this.targetExplosionTimer<=0){
                    
                    this.targetExplosionTimer=0.8
                    objects.explosions.push(new Explosion({col:[1,0,0],pos:this.pos,life:0.75,size:1.75,speed:0.3,aftershock:0}))
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.targetLookDir[0],this.targetLookDir[1],this.targetLookDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
            
            break
            
            case 'moveToTriangulate':
                
                this.triangulateTimer-=dt
                
                let d=[player.body.position.x-this.triangulateTokenPos[0],player.body.position.z-this.triangulateTokenPos[2]],
                    rd=[-d[1],d[0]],
                    tb=[this.pos[0]-player.body.position.x,this.pos[2]-player.body.position.z]
                
                if(rd[0]*tb[0]+rd[1]*tb[1]>0){
                    
                    this.moveDir=[rd[0],0,rd[1]]
                    
                } else {
                    
                    this.moveDir=[d[1],0,-d[0]]
                }
                
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed)
                
                if(this.triangulateTimer<=0){
                    
                    this.state='moveToPlayer'
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
        }
        
        if(beeInfo[this.type].particles&&TIME-this.emitParticle>0.2){
            beeInfo[this.type].particles(this)
            this.emitParticle=TIME
        }
    }
    
    startTargetPractice(){
        
        this.state='moveToTargetPractice'
        
        let rx=MATH.random(0.4,0.9)*fieldInfo[player.fieldIn].width*(Math.random()<0.5?1:-1),rz=MATH.random(0.4,0.9)*fieldInfo[player.fieldIn].length*(Math.random()<0.5?1:-1),t=Math.random()*MATH.TWO_PI,x=Math.sin(t)*rx,z=Math.cos(t)*rz
        
        this.moveTo=[fieldInfo[player.fieldIn].x+fieldInfo[player.fieldIn].width*0.5+x,this.pos[1]+4+Math.random()*2,fieldInfo[player.fieldIn].z+fieldInfo[player.fieldIn].length*0.5+z]
        
        this.targetPractice_q=[Math.sign(-x)||1,Math.sign(-z)||1]
        
    }
    
    startTriangulate(tokenPos){
        
        this.state='moveToTriangulate'
        this.triangulateTimer=3
        this.triangulateTokenPos=tokenPos
        
        objects.triangulates.push(new Triangulate(this,tokenPos))
    }
}

class TempBee {
    
    constructor(pos,type,lvl,lifespan,gifted){
        
        this.meshScale=type==='baby'||type==='tadpole'?0.65:1
        this.GIFTED_BEE_TEXTURE_OFFSET=beeInfo[type].v+(gifted?GIFTED_BEE_TEXTURE_OFFSET:0)

        this.life=lifespan
        this.gifted=gifted
        this.hivePos=pos.slice()
        this.pos=pos.slice()
        this.type=type
        this.flowerIn=null
        this.moveTo=[player.body.position.x,player.body.position.y,player.body.position.z]
        this.moveOffset=[MATH.random(-5,5),0,MATH.random(-5,5)]
        this.moveDir=[]
        
        this.computeLevel(lvl||1)
        
        this.convertTimer=0
        this.flowerCollecting=[]
        this.state='moveToPlayer'
        this.emitParticle=TIME
        this.collectRot=[]
        this.pollen=0
        this.attackTimer=1
        this.trail={addPos:function(){}}
        
        this.trails=[]
        this.beeOffsets=[]
        
        for(let i in beeInfo[this.type].trails){
            
            this.trails.push(new TrailRenderer.ConstantTrail(beeInfo[this.type].trails[i]))
            this.beeOffsets.push(beeInfo[this.type].trails[i].beeOffset||0)
            
        }
        
        this.gatheringTokens=[]
        
        for(let i in beeInfo[this.type].tokens){
            
            this.gatheringTokens[i]={type:beeInfo[this.type].tokens[i],cooldown:effects[beeInfo[this.type].tokens[i]].trialCooldown,rate:effects[beeInfo[this.type].tokens[i]].trialRate,timer:-10000}
            
        }
        
        this.attackTokens=[]
        
        for(let i in beeInfo[this.type].attackTokens){
            
            this.attackTokens[i]={type:beeInfo[this.type].attackTokens[i],cooldown:effects[beeInfo[this.type].attackTokens[i]].trialCooldown,rate:effects[beeInfo[this.type].attackTokens[i]].trialRate,timer:-10000}
            
        }
        
    }
    
    computeLevel(newLevel){
        
        this.level=newLevel
        
        newLevel--
        
        this.speed=beeInfo[this.type].speed
        this.gatherSpeed=beeInfo[this.type].gatherSpeed
        this.gatherAmount=beeInfo[this.type].gatherAmount
        this.attack=beeInfo[this.type].attack
        
        this.speed*=newLevel*0.03+1
        this.gatherAmount*=newLevel*0.1+1
        
        if(this.gifted){
            
            this.gatherAmount*=1.5
            this.attack*=1.5
        }
        
        this.speed/=6
    }
    
    update(){
        
        this.life-=dt
        
        for(let i in this.trails){
            
            this.trails[i].addPos([this.pos[0],this.pos[1]+this.beeOffsets[i],this.pos[2]])
        }
        
        if(player.attacked.length>0&&(this.state!=='sleep'&&this.state!=='moveToSleep'&&this.state!=='attack'&&this.state!=='moveToAttack')){
            
            this.attackMob=player.attacked[(Math.random()*player.attacked.length)|0]
            this.state='moveToAttack'
            let _a=Math.random()*MATH.TWO_PI
            this.attackOffset=[Math.cos(_a)*2,Math.sin(_a)*2]
        }
        
        switch(this.state){
            
            case 'moveToAttack':
                
                if(!player.attacked.length||!this.attackMob||this.attackMob.state!=='attack'){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.moveTo=[this.attackMob.pos[0]+this.attackOffset[0],this.attackMob.pos[1]+(this.type==='precise'?1.25:0.25),this.attackMob.pos[2]+this.attackOffset[1]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<0.8){
                    
                    this.state='attack'
                    
                    let _a=Math.random()*MATH.TWO_PI,r=this.type==='precise'?5:2
                    this.attackOffset=[Math.cos(_a)*r,Math.sin(_a)*r]
                    this.attackTimer=1.25+Math.random()*0.5*(this.type==='precise'?1.75:1)
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'attack':
                
                if(!player.attacked.length||!this.attackMob||this.attackMob.state!=='attack'){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.attackTimer-=dt
                
                if(this.attackTimer<=0){
                    
                    this.energy--
                    
                    this.state='moveToAttack'
                    
                    this.attackMob=player.attacked[(Math.random()*player.attacked.length)|0]
                    
                    if(Math.random()<(this.type==='precise'?Math.max(Math.pow(2,(this.gifted?2:1)+this.level-this.attackMob.level),0.05):Math.pow(2,this.level-this.attackMob.level))){
                        
                        let h=(this.attack+player[beeInfo[this.type].color+'BeeAttack'])*player.beeAttack*(this.type==='precise'?this.gifted?2.25:1.5:1)
                        
                        this.attackMob.damage(h)
                        
                        if(this.type==='precise'){
                            
                            objects.explosions.push(new Explosion({col:[1,0,0],pos:this.pos,life:0.75,size:1.75,speed:0.3,aftershock:0}))
                        }
                        
                    } else {
                        
                        textRenderer.add('MISS',[this.attackMob.pos[0],this.attackMob.pos[1]+Math.random()*2.75+1.5,this.attackMob.pos[2]],[255,255,255],0,'',1.25,false)
                        
                    }
                    
                    let token,openTokens=[]
                    
                    for(let i in this.attackTokens){
                        
                        let g=this.attackTokens[i]
                        
                        if((TIME-g.timer)*player[beeInfo[this.type].color+'BeeAbilityRate']>=g.cooldown&&Math.random()<=g.rate){
                            
                            openTokens.push(i)
                        }
                    }
                    
                    if(openTokens.length){
                        
                        token=openTokens[(Math.random()*openTokens.length)|0]
                        this.attackTokens[token].timer=TIME
                        
                        token=this.attackTokens[token].type
                        
                        objects.tokens.push(new Token(effects[token].tokenLife,[Math.round(this.pos[0]),Math.round(this.pos[1])+0.5,Math.round(this.pos[2])],token,{field:player.fieldIn,x:this.flowerCollecting[0],z:this.flowerCollecting[1],bee:this},true))
                        
                    }
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],TIME*5,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'moveToPlayer':
                
                if(player.fieldIn&&player.pollen<player.capacity){
                    
                    this.state='moveToFlower'
                    return
                }
                
                this.moveTo=[player.body.position.x+this.moveOffset[0],player.body.position.y,player.body.position.z+this.moveOffset[2]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                if(vec3.sqrDist(this.moveTo,this.pos)<0.8){
                    
                    this.moveOffset=[MATH.random(-4,4),0,MATH.random(-4,4)]
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
                if(player.converting&&player.pollen){
                    
                    this.state='moveToHiveToConvert'
                    return
                }
                
                if(player.convertingBalloon&&player.hiveBalloon.pollen){
                    
                    this.state='moveToHiveToConvertBalloon'
                }
                
            break
            
            case 'moveToFlower':
                
                if(!player.fieldIn||player.pollen>=player.capacity){
                    
                    this.state='moveToPlayer'
                    break
                }
                
                let f=fieldInfo[player.fieldIn]
                
                while(this.flowerCollecting[0]===undefined||this.flowerCollecting[1]===undefined||this.flowerCollecting[0]<0||this.flowerCollecting[0]>=f.width||this.flowerCollecting[1]<0||this.flowerCollecting[1]>=f.length){
                    
                    this.flowerCollecting[0]=player.flowerIn.x+(Math.round(MATH.random(-7,7)))
                    this.flowerCollecting[1]=player.flowerIn.z+(Math.round(MATH.random(-7,7)))
                    
                    let t=Math.random()*MATH.TWO_PI
                    this.collectRot=[Math.sin(t),-4,Math.cos(t)]
                }
                
                this.moveTo=[f.x+this.flowerCollecting[0],f.y+flowers[player.fieldIn][this.flowerCollecting[1]][this.flowerCollecting[0]].height*0.5+0.25,f.z+this.flowerCollecting[1]]
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*(this.type==='spicy'?player.flameHeatStack:1))
                
                if(vec3.sqrDist(this.moveTo,this.pos)<0.075){
                    
                    this.state='collectPollen'
                    this.collectTimer=this.gatherSpeed*(this.type==='spicy'?1/player.flameHeatStack:1)
                    return
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'collectPollen':
                
                if(!player.fieldIn||player.pollen>=player.capacity){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                this.collectTimer-=dt
                
                if(this.collectTimer<=0){
                    
                    this.energy--
                    
                    collectPollen({x:this.flowerCollecting[0],z:this.flowerCollecting[1],pattern:[[0,0]],amount:this.gatherAmount,yOffset:MATH.random(0.7,1.3),multiplier:player.pollenFromBees})
                    if(beeInfo[this.type].gatheringPassive){
                        
                        beeInfo[this.type].gatheringPassive(this)
                    }
                    
                    let token,openTokens=[]
                    
                    for(let i in this.gatheringTokens){
                        
                        let g=this.gatheringTokens[i]
                        
                        if((TIME-g.timer)*player[beeInfo[this.type].color+'BeeAbilityRate']>=g.cooldown&&Math.random()<=g.rate){
                            
                            openTokens.push(i)
                        }
                    }
                    
                    if(openTokens.length){
                        
                        token=openTokens[(Math.random()*openTokens.length)|0]
                        this.gatheringTokens[token].timer=TIME
                        
                        token=this.gatheringTokens[token].type
                        
                        objects.tokens.push(new Token(effects[token].tokenLife,[Math.round(this.pos[0]),fieldInfo[player.fieldIn].y+1,Math.round(this.pos[2])],token,{field:player.fieldIn,x:this.flowerCollecting[0],z:this.flowerCollecting[1],bee:this}))
                        
                    }
                    
                    this.flowerCollecting=[]
                    this.state='moveToFlower'
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.collectRot[0],this.collectRot[1],this.collectRot[2],BEE_COLLECT,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'moveToTargetPractice':
                
                if(!player.fieldIn){
                    
                    this.state='moveToPlayer'
                    return
                }
                
                vec3.sub(this.moveDir,this.moveTo,this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed*3)
                if(vec3.sqrDist(this.moveTo,this.pos)<0.7){
                    
                    this.pos=this.moveTo.slice()
                    this.targetPracticeTimer=4
                    this.targetExplosionTimer=0
                    this.state='shootTargetPractice'
                    this.targetLookDir=[(((fieldInfo[player.fieldIn].width*0.5)|0)+fieldInfo[player.fieldIn].x)-this.pos[0],fieldInfo[player.fieldIn].y,(((fieldInfo[player.fieldIn].length*0.5)|0)+fieldInfo[player.fieldIn].z)-this.pos[2]]
                    this.targets=[]
                    
                    for(let i=0;i<3;i++){
                        
                        let _x=((fieldInfo[player.fieldIn].width*0.5)+(Math.random()*this.targetPractice_q[0]*fieldInfo[player.fieldIn].width*0.5))|0,_z=((fieldInfo[player.fieldIn].length*0.5)+(Math.random()*this.targetPractice_q[1]*fieldInfo[player.fieldIn].length*0.5))|0
                        
                        this.targets.push(new Target(player.fieldIn,_x,_z,i+1,this))
                        objects.targets.push(this.targets[this.targets.length-1])
                        
                    }
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
            
            case 'shootTargetPractice':
                
                this.targetPracticeTimer-=dt
                this.targetExplosionTimer-=dt
                
                if(this.targetPracticeTimer<=0.35&&!this.shotParticleProjectile){
                    this.shotParticleProjectile=true
                    
                    for(let i in this.targets){
                        
                        let vx=this.targets[i].pos[0]-this.pos[0],vy=this.targets[i].pos[1]-this.pos[1],vz=this.targets[i].pos[2]-this.pos[2],d=Math.sqrt(vx*vx+vy*vy+vz*vz),s=d/0.35,m=s/d
                        
                        ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:vx*m,vy:vy*m,vz:vz*m,grav:0,size:MATH.random(300,350),col:[1,0,0],life:0.4,rotVel:MATH.random(-9,9),alpha:1000})
                    
                    }
                
                }
                
                if(this.targetPracticeTimer<=0){
                    
                    this.shotParticleProjectile=false
                        
                    let t=[this.targets[0].activated,this.targets[1].activated,this.targets[2].activated]
                    
                    if(t[0]&&t[1]&&t[2]){
                        
                        for(let i in objects.tokens&&!(objects.tokens[i] instanceof DupedToken)){
                            
                            if(objects.tokens[i].canBeLinked){
                                
                                objects.tokens[i].collect()
                            }
                        }
                        
                        objects.tokens.push(new Token(effects.precision.tokenLife,[this.targets[2].pos[0],this.targets[2].pos[1]+0.5,this.targets[2].pos[2]],'precision',{field:this.targets[2].field,x:this.targets[2].x,z:this.targets[2].z,bee:this}))
                        objects.tokens.push(new Token(effects.focus.tokenLife,[this.targets[2].pos[0]+1,this.targets[2].pos[1]+0.5,this.targets[2].pos[2]],'focus',{field:this.targets[2].field,x:this.targets[2].x+1,z:this.targets[2].z,bee:this}))
                        objects.tokens.push(new Token(effects.redBoost.tokenLife,[this.targets[2].pos[0]-1,this.targets[2].pos[1]+0.5,this.targets[2].pos[2]],'redBoost',{field:this.targets[2].field,x:this.targets[2].x-1,z:this.targets[2].z,bee:this}))
                        
                    }
                    
                    if(t[2]&&this.gifted){
                        
                        if(!t[0]||!t[1]){
                            
                            objects.marks.push(new Mark(this.targets[2].field,this.targets[2].x,this.targets[2].z,'preciseMark',this.level))
                            playSound('markToken',0.6)
                        }
                    }
                    
                    for(let i in this.targets){
                        
                        let _t=this.targets[i]
                        
                        if(_t.activated){
                            
                            if(i!==2)
                                objects.tokens.push(new Token(effects.focus.tokenLife,[_t.pos[0],_t.pos[1]+0.5,_t.pos[2]],'focus',{field:_t.field,x:_t.x,z:_t.z,bee:this}))
                            
                            collectPollen({x:_t.x,z:_t.z,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:(this.attack+player[beeInfo[this.type].color+'BeeAttack'])*player.beeAttack*0.75,yOffset:2+Math.random()*0.4,stackHeight:0.5+Math.random()*0.5,instantConversion:(player.flameHeatStack-1)*0.5,multiplier:player.flameHeatStack*5,field:_t.field})
                            
                        } else {
                            
                            objects.tokens.push(new Token(effects.redBoost.tokenLife,[_t.pos[0],_t.pos[1]+0.5,_t.pos[2]],'redBoost',{field:_t.field,x:_t.x,z:_t.z,bee:this}))
                        }
                    }
                    
                    this.targets[0].splice=true
                    this.targets[1].splice=true
                    this.targets[2].splice=true
                    
                    this.state='moveToPlayer'
                    return
                }
                
                if(this.targetExplosionTimer<=0){
                    
                    this.targetExplosionTimer=0.8
                    objects.explosions.push(new Explosion({col:[1,0,0],pos:this.pos,life:0.75,size:1.75,speed:0.3,aftershock:0}))
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.targetLookDir[0],this.targetLookDir[1],this.targetLookDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
            
            break
            
            case 'moveToTriangulate':
                
                this.triangulateTimer-=dt
                
                let d=[player.body.position.x-this.triangulateTokenPos[0],player.body.position.z-this.triangulateTokenPos[2]],
                    rd=[-d[1],d[0]],
                    tb=[this.pos[0]-player.body.position.x,this.pos[2]-player.body.position.z]
                
                if(rd[0]*tb[0]+rd[1]*tb[1]>0){
                    
                    this.moveDir=[rd[0],0,rd[1]]
                    
                } else {
                    
                    this.moveDir=[d[1],0,-d[0]]
                }
                
                vec3.normalize(this.moveDir,this.moveDir)
                vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt*this.speed*player.beeSpeed)
                
                if(this.triangulateTimer<=0){
                    
                    this.state='moveToPlayer'
                }
                
                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.meshScale,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo[this.type].u,this.GIFTED_BEE_TEXTURE_OFFSET,beeInfo[this.type].meshPartId)
                
            break
        }
        
        if(beeInfo[this.type].particles&&TIME-this.emitParticle>0.2){
            beeInfo[this.type].particles(this)
            this.emitParticle=TIME
        }
        
        return this.life<=0
    }
    
    startTargetPractice(){
        
        this.state='moveToTargetPractice'
        
        let rx=MATH.random(0.4,0.9)*fieldInfo[player.fieldIn].width*(Math.random()<0.5?1:-1),rz=MATH.random(0.4,0.9)*fieldInfo[player.fieldIn].length*(Math.random()<0.5?1:-1),t=Math.random()*MATH.TWO_PI,x=Math.sin(t)*rx,z=Math.cos(t)*rz
        
        this.moveTo=[fieldInfo[player.fieldIn].x+fieldInfo[player.fieldIn].width*0.5+x,this.pos[1]+4+Math.random()*2,fieldInfo[player.fieldIn].z+fieldInfo[player.fieldIn].length*0.5+z]
        
        this.targetPractice_q=[Math.sign(-x)||1,Math.sign(-z)||1]
        
    }
    
    startTriangulate(tokenPos){
        
        this.state='moveToTriangulate'
        this.triangulateTimer=3
        this.triangulateTokenPos=tokenPos
        
        objects.triangulates.push(new Triangulate(this,tokenPos))
    }
}

class Explosion {
    
    constructor(params){
        
        this.lifespan=1/params.life
        this.params=params
        this.size=this.reverse?params.size:0
        this.params.height=this.params.height||1
        this.maxAlpha=params.maxAlpha||1
        this.backface=params.backface===undefined?false:params.backface
        this.primitive=params.primitive||'explosions'
    }
    
    die(index){
        
        objects.explosions.splice(index,1)
    }
    
    update(){
        
        this.params.life-=dt
        this.size+=Math.max((this.params.size-this.size)*this.params.speed,this.params.aftershock)
        
        meshes[this.primitive].instanceData.push(this.params.pos[0],this.params.pos[1],this.params.pos[2],this.params.col[0],this.params.col[1],this.params.col[2],Math.min(this.params.life*this.lifespan,this.maxAlpha),this.backface?-this.size:this.size,this.params.height)
        
        return this.params.life<=0
    }
}

class ReverseExplosion {
    
    constructor(params){
        
        this.transformHeight=params.transformHeight
        this.primitive=params.primitive||'cylinder_explosions'
        this.lifespan=1/params.life
        this.params=params
        this.size=params.size
        this.params.height=this.params.height||1
        this.backface=params.backface===undefined?false:params.backface
    }
    
    die(index){
        
        objects.explosions.splice(index,1)
    }
    
    update(){
        
        this.params.life-=dt
        let s=this.params.life*this.lifespan*this.size
        
        meshes[this.primitive].instanceData.push(this.params.pos[0],this.params.pos[1],this.params.pos[2],this.params.col[0],this.params.col[1],this.params.col[2],this.params.life*this.lifespan*this.params.alpha,this.backface?-s:s,this.transformHeight?this.params.height:this.params.height/s)
        
        return this.params.life<=0
    }
}

class Flame {
    
    constructor(field,x,z,isStatic){
        
        player.stats.flames++

        this.life=3*(player.flameFuel?1.5:1)*player.flameLife
        this.isStatic=isStatic
        
        if(isStatic){
            
            this.pos=[field,x,z]
            
        } else {
            
            this.field=field
            this.x=x
            this.z=z
            this.pos=[this.x+fieldInfo[this.field].x,fieldInfo[this.field].y+0.5,this.z+fieldInfo[this.field].z]
        }
        
        this.collectTimer=TIME+MATH.random(0.5,1)
        this.particleTimer=TIME
        
        if(player.flameFuel){
            
            this.getRidOfOilTrailTimer=2
            this.oilT=0
            this.oilPos=[player.body.position.x,player.body.position.y+0.3,player.body.position.z]
            this.oilTrail=new TrailRenderer.Trail({length:10,size:0.75,triangle:true,color:[0.1,0,0,1]})
            
            player.pollen-=Math.min(Math.ceil(player.convertTotal*0.03),player.pollen)
            player.honey+=Math.ceil(Math.min(Math.ceil(player.convertTotal*0.03),player.pollen)*player.honeyPerPollen)
            if(player.setting_enablePollenText)
                textRenderer.add(Math.ceil(Math.min(Math.ceil(player.convertTotal*0.03),player.pollen)*player.honeyPerPollen),[player.body.position.x,player.body.position.y+Math.random()*2+0.5,player.body.position.z],COLORS.honey,0,'+')
        }
    }
    
    die(index){
        
        if(this.oilTrail)
            this.oilTrail.splice=true
            
        objects.flames.splice(index,1)
    }
    
    turnDark(){
        
        if(!this.dark){
            
            objects.explosions.push(new ReverseExplosion({col:[1,0,1],pos:this.pos,life:0.5,size:2,alpha:1,height:3}))
            
            this.dark=true
            
            if(player.flameFuel){
                
                this.life*=1.5
                player.pollen-=Math.min(Math.ceil(player.convertTotal*0.03),player.pollen)
                player.honey+=Math.ceil(Math.min(Math.ceil(player.convertTotal*0.03),player.pollen)*player.honeyPerPollen)
                if(player.setting_enablePollenText)
                    textRenderer.add(Math.ceil(Math.min(Math.ceil(player.convertTotal*0.03),player.pollen)*player.honeyPerPollen),[player.body.position.x,player.body.position.y+Math.random()*2+0.5,player.body.position.z],COLORS.honey,0,'+')
                this.getRidOfOilTrailTimer=2
                this.oilT=0
                this.oilPos=[player.body.position.x,player.body.position.y+0.3,player.body.position.z]
                
                if(!this.oilTrail){
                    
                    this.oilTrail=new TrailRenderer.Trail({length:15,size:0.75,triangle:true,color:[0.1,0,0,1]})
                } else {
                    
                    this.oilTrail.addPos([])
                }
            }
        }
    }
    
    update(){
        
        this.life-=dt
        
        if(this.oilTrail){
            
            this.oilPos[0]=MATH.lerp(this.oilPos[0],this.pos[0],this.oilT)
            this.oilPos[2]=MATH.lerp(this.oilPos[2],this.pos[2],this.oilT)
            this.oilT=Math.min(this.oilT+dt*0.5,1) 
            this.oilTrail.addPos([...this.oilPos])
            
            this.getRidOfOilTrailTimer-=dt
            
            if(this.getRidOfOilTrailTimer<=0){
                
                this.oilTrail.splice=true
                this.oilTrail=undefined
            }
        }
        
        if(TIME-this.collectTimer>1){
            
            this.collectTimer=TIME
            
            if(!this.isStatic&&player.fieldIn===this.field){
                
                collectPollen({x:this.x,z:this.z,pattern:this.dark?[[0,0],[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,-2],[0,2]]:[[0,0],[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],amount:{r:10,w:4,b:1},stackHeight:0.7,multiplier:player.flamePollen*player.flameBonus,instantConversion:player.instantFlameConversion,field:this.field})
            }
        }
        
        if(this.dark){player.addEffect('darkHeat')}
        
        if(TIME-this.particleTimer>0.5){
            
            this.particleTimer=TIME
            
            if(this.dark){
                
                ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:MATH.random(-0.1,0.1),vy:MATH.random(0,0.3),vz:MATH.random(-0.1,0.1),grav:1,size:MATH.random(110,180),col:[1,0,Math.random()],life:1.5,rotVel:MATH.random(-3,3),alpha:4.5})
                
            } else {
                
                ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:MATH.random(-0.1,0.1),vy:MATH.random(0,0.3),vz:MATH.random(-0.1,0.1),grav:1,size:MATH.random(110,180),col:[1,MATH.random(0.3,1),0],life:1.5,rotVel:MATH.random(-3,3),alpha:4.5})
            }
        }
        
        if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<2){
            
            player.stats.scorchingStar+=dt*(this.dark?120:90)
            player.addEffect('flameHeat',this.dark?0.00025:0.0001)
        }
        
        return this.life<=0
    }
}

class Bubble {
    
    constructor(field,x,z,golden){
        
        this.golden=golden
        this.col=this.golden?[1,0.6,0.1]:[0,0.4,0.9]
        this.life=10
        this.field=field
        this.x=x
        this.z=z
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.5,fieldInfo[this.field].z+this.z]
        this.birth=TIME
    }
    
    die(index){

        objects.bubbles.splice(index,1)
    }
    
    turnGolden(){
        
        if(this.golden) return
        
        this.golden=true
        this.col=[0.875*0.85,0.85*0.85,0.1*0.85]
        
        for(let i=0;i<10;i++){
            
            ParticleRenderer.add({x:this.pos[0],y:this.pos[1],z:this.pos[2],vx:MATH.random(-2,2),vy:MATH.random(0,2),vz:MATH.random(-2,2),grav:0,size:MATH.random(30,100),col:[1,1,0],life:1.75,rotVel:MATH.random(-3,3),alpha:3})
        }
    }
    
    pop(){

        player.stats.bubbles++

        if(player.popStarActive){

            player.popStarActive.popParticles.push(this.pos)
        }
        
        if(player.popStarActive){
            
            player.stats.popStar+=this.golden?2:1
            player.addEffect('bubbleBloat',(this.golden?4:2)/(60*60))
        }
        
        if(player.tool==='tidePopper'){
            
            player.addEffect('tidePower')
            
            if(this.golden) player.addEffect('tidePower')
            
            if(player.tidalSurge){
                
                player.addEffect('tidalSurge',this.golden?0.00003:0.00001)
            }
        }
        
        objects.explosions.push(new Explosion({col:this.col,pos:this.pos.slice(),life:0.2,size:4,speed:0.5,aftershock:0.05}))
        let g=this.golden?1.5*player.bubblePollen:player.bubblePollen
        
        let p=collectPollen({x:this.x,z:this.z,pattern:[[0,0],[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1],[0,1],[0,-1],[-2,0],[2,0],[0,2],[0,-2],[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2],[3,0],[-3,0],[0,-3],[0,3],[3,1],[3,-1],[1,3],[-1,3],[-1,-3],[1,-3],[-3,1],[-3,-1]],amount:{r:2,w:6,b:10},stackHeight:0.45+Math.random()*0.5,replenish:1,field:this.field,multiplier:g*player.bubbleBonus})
        
        if(this.golden&&p&&Math.random()<0.25){
            
            objects.tokens.push(new LootToken(30,[this.pos[0],this.pos[1]+0.7,this.pos[2]],'honey',Math.ceil(p*0.5),true,'Gold Bubble'))
        }
        
        this.life=0
    }
    
    update(){
        
        this.life-=dt
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=4){
            
            this.pop()
        }
        
        meshes.explosions.instanceData.push(this.pos[0],this.pos[1]+0.3,this.pos[2],this.col[0]*player.isNight,this.col[1]*player.isNight,this.col[2]*player.isNight,Math.min(this.life*0.35,this.golden?0.8:0.7),Math.min((TIME-this.birth)*15,3),1)
        
        return this.life<=0
    }
}

class Sprinkler {
    
    constructor(){
        
        this.field=null
        this.x=null
        this.z=null
        this.timer=TIME
        
        this.power=0.5
        this.rate=1
        this.diameter=15
        
        let p=this.power
        this.func=function(f){
            
            f.height+=p
        }
    }
    
    set(f,x,z){
        
        if(!fieldInfo[f]) return
        
        this.field=f
        this.x=x
        this.z=z
        this.timeOffset=TIME
        
        this.flowers=[]
        
        let rad=(this.diameter*0.5)|0
        
        for(let x=-rad;x<=rad;x++){
            
            for(let z=-rad;z<=rad;z++){
                
                let _x=x+this.x,_z=z+this.z
                
                if(x*x+z*z<=rad*rad&&_x>=0&&_x<fieldInfo[this.field].width&&_z>=0&&_z<fieldInfo[this.field].length){
                    
                    this.flowers.push([_x,_z])
                }
            }
        }
    }
    
    update(){
        
        if(this.field&&TIME+this.timeOffset-this.timer>this.rate){
            
            this.timer=TIME+this.timeOffset
            
            for(let i in this.flowers){
                
                updateFlower(this.field,this.flowers[i][0],this.flowers[i][1],this.func,true,false,false)
            }
            
            objects.explosions.push(new Explosion({col:[0.1,0.4,1],pos:[this.x+fieldInfo[this.field].x,fieldInfo[this.field].y+0.5,this.z+fieldInfo[this.field].z],life:1,size:this.diameter,speed:0.15,aftershock:0.01,height:0.1}))
            
        }
        
    }
}

class Mark {
    
    constructor(field,x,z,type,beeLevel){
        
        this.gummyBallHitTimer=0
        this.beeLevel=beeLevel
        this.life=((type==='precise'?12:7)+(beeLevel-1)*0.2)*player.markDuration
        this.field=field
        this.x=x
        this.z=z
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.5,fieldInfo[this.field].z+this.z]
        this.surgeLimit=5
        this.rot=Math.random()*6.12
        
        this.diameter=(type==='precise'?13:9)
        this.sqSize=(this.diameter*0.5)*(this.diameter*0.5)
        
        this.type=type
        this.typeCol={pollenMark:[0,1,0],honeyMark:COLORS.honey_normalized,preciseMark:[1,0,1]}[this.type]
        
        this.flowers=[]
        
        let rad=(this.diameter*0.5)|0
        
        for(let x=-rad;x<=rad;x++){
            
            for(let z=-rad;z<=rad;z++){
                
                if(x*x+z*z<=rad*rad){
                    
                    this.flowers.push([x,z])
                }
            }
        }
        
    }
    
    surge(time=0){
        
        if(this.surgeLimit>0)
            this.surgeAfter=time
    }
    
    die(index){
        
        objects.marks.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        this.rot+=dt*2
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=this.sqSize){
            
            player.addEffect(this.type)
            
            meshes.explosions.instanceData.push(this.pos[0],this.pos[1]+3.6,this.pos[2],0,1,0,1,0.45,1)
            
        } else {
            
            meshes.explosions.instanceData.push(this.pos[0],this.pos[1]+3.6,this.pos[2],0.8,0.4,0,0.85,0.45,1)
        }
        
        meshes.explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1,1,1,0.075,this.diameter,0.01)
        
        meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1]+1.5,this.pos[2],0.9*player.isNight,0.8*player.isNight,0.4*player.isNight,1,0.125,27)
        meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1]+3.3,this.pos[2],0.9,0.8,0.4,1,0.4,0.5)
        meshes.tokens.instanceData.push(this.pos[0],this.pos[1]+2.25,this.pos[2],this.rot,effects[this.type+'Token'].u,effects[this.type+'Token'].v,1,1.35)
        
        this.surgeAfter-=dt
        
        if(this.surgeAfter<=0){
            
            this.surgeAfter=Infinity
            this.surgeLimit--
            this.life+=1+this.beeLevel*0.1
            
            let f=this
            
            objects.explosions.push(new ReverseExplosion({col:[1,1,0],pos:f.pos,life:0.3,size:this.diameter*0.8,alpha:0.75}))
            
            if(f.type==='honeyMark'){
                
                collectPollen({x:f.x,z:f.z,pattern:f.flowers,amount:7,yOffset:2.25+Math.random()*0.5,stackOffset:0.4+Math.random()*0.6,field:this.field,instantConversion:1,multiplier:this.beeLevel*0.1+1})
                
            } else if(f.type==='pollenMark'){
                
                collectPollen({x:f.x,z:f.z,pattern:f.flowers,amount:7,yOffset:2.25+Math.random()*0.5,stackOffset:0.4+Math.random()*0.6,field:this.field,multiplier:this.beeLevel*0.1+1})
                
            } else if(f.type==='preciseMark'){
                
                collectPollen({x:f.x,z:f.z,pattern:f.flowers,amount:12,yOffset:2.25+Math.random()*0.5,stackOffset:0.4+Math.random()*0.6,field:this.field,alwaysCrit:true,multiplier:this.beeLevel*0.1+1})
            }
        }
        
        return this.life<=0
    }
}

class Frog {
    
    constructor(field,x,z,bee){
        
        this.life=25+bee.level
        this.gifted=Math.random()<0.1+0.02*bee.level&&bee.gifted
        this.mesh=this.gifted?'giftedFrog':'frog'
        this.field=field
        this.y=fieldInfo[field].y+0.75
        this.pos=[fieldInfo[field].x+x,this.y,fieldInfo[field].z+z]
        this.moveTo=[this.pos[0],this.pos[2]+0.1]
        
        this.vel=0
        this.jumpDelay=0
        this.state=0
        this.jumpCount=0
        
        this.jumpPattern=[[-5,-3],[-5,-2],[-5,-1],[-5,0],[-5,1],[-5,2],[-5,3],[-4,-4],[-4,-3],[-4,3],[-4,4],[-3,-5],[-3,-4],[-3,4],[-3,5],[-2,-5],[-2,5],[-1,-5],[-1,5],[0,-5],[0,5],[1,-5],[1,5],[2,-5],[2,5],[3,-5],[3,-4],[3,4],[3,5],[4,-4],[4,-3],[4,3],[4,4],[5,-3],[5,-2],[5,-1],[5,0],[5,1],[5,2]]
        
    }
    
    die(index){
        
        objects.explosions.push(new Explosion({col:[0,0.5,1],pos:this.pos.slice(),life:0.2,size:4,speed:0.5,aftershock:0.05}))
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        if(this.state===0){
            
            this.jumpDelay-=dt
            
            if(this.jumpDelay<=0){
                
                this.state=1
            }
            
        } else {
            
            let dir=[this.moveTo[0]-this.pos[0],this.moveTo[1]-this.pos[2]],m=Math.sqrt(dir[0]*dir[0]+dir[1]*dir[1]),d=1/m,s=dt*d*4
            
            this.pos[0]+=dir[0]*s
            this.pos[2]+=dir[1]*s
            
            if(m<1){
                
                let index=(Math.random()*this.jumpPattern.length)|0,x=this.jumpPattern[index][0],z=this.jumpPattern[index][1]
                
                while(Math.round(this.moveTo[0]-fieldInfo[this.field].x+x)<0||Math.round(this.moveTo[0]-fieldInfo[this.field].x+x)>=fieldInfo[this.field].width||Math.round(this.moveTo[1]-fieldInfo[this.field].z+z)<0||Math.round(this.moveTo[1]-fieldInfo[this.field].z+z)>=fieldInfo[this.field].length){
                    
                    index=(Math.random()*this.jumpPattern.length)|0
                    x=this.jumpPattern[index][0]
                    z=this.jumpPattern[index][1]
                }
                
                this.moveTo=[this.moveTo[0]+x,this.moveTo[1]+z]
                
                this.state=0
                this.jumpDelay=0.5
                this.vel=0.12
                this.pos[1]=this.y
                this.jumpCount++
                
                if(this.jumpCount%3!==0)
                    objects.bubbles.push(new Bubble(this.field,(this.pos[0]-fieldInfo[this.field].x)|0,(this.pos[2]-fieldInfo[this.field].z)|0))
                
                for(let i in objects.tokens){
                    
                    let b=objects.tokens[i]
                    
                    if(!b.collected&&vec3.sqrDist(b.pos,this.pos)<(this.gifted?14:9)&&Math.random()<(this.gifted?0.25:0.4)&&!(objects.tokens[i] instanceof DupedToken)){
                        
                        objects.explosions.push(new Explosion({col:[0.9,0,0.15],pos:b.pos.slice(),life:1.25,size:1.8,speed:0.2,aftershock:0.005}))
                        let bx=(b.pos[0]-fieldInfo[this.field].x)|0,bz=(b.pos[2]-fieldInfo[this.field].z)|0
                        
                        if(bx>=0&&bx<fieldInfo[this.field].width&&bz>=0&&bz<fieldInfo[this.field].length)
                            objects.bubbles.push(new Bubble(this.field,bx,bz))
                        
                        b.collect()
                        break
                    }
                }
            }
            
            this.pos[3]=Math.atan2(dir[1]*d,dir[0]*d)+MATH.HALF_PI
            this.vel-=dt*0.2
            this.pos[1]=Math.max(this.pos[1]+this.vel,this.y)
        
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.mesh].vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.mesh].indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,0.9,1)
        gl.drawElements(gl.TRIANGLES,meshes[this.mesh].indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.life<=0
    }
}

let globalBalloonID=0

class Balloon {
    
    constructor(field,x,z,golden,beeLevel=0){
        
        this.id=globalBalloonID++
        this.golden=golden
        this.col=this.golden?[0.875*0.85,0.7*0.85,0.1*0.85,0.8]:[0,0,0.6,0.7]
        this.checkBubble=TIME
        this.life=20+beeLevel
        this.field=field
        this.x=x
        this.z=z
        this._x=x
        this._z=z
        this.moveTo=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].z+this.z]
        this.moveDir=[0,0]
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.55+4,fieldInfo[this.field].z+this.z]
        this.y=fieldInfo[this.field].y+0.55+4
        this.pollen=0
        this.cap=Math.round(player.capacity*(this.golden?0.4:0.35)*(beeLevel*0.0375+1))
        this.invCap=1/this.cap
        this.displaySize=0
        this.state='float'
        this.inflateCounter=4+((beeLevel*(4/20))|0)+(fieldInfo[this.field].generalColorComp.b>=0.5?4:fieldInfo[this.field].generalColorComp.w>=0.5?2:0)
        
        this.prevFlowers=[]
        this.flowers=[]
        
        let rad=4,sqRad=3.7*3.7
        
        for(let x=-rad;x<=rad;x++){
            
            for(let z=-rad;z<=rad;z++){
                
                if(x*x+z*z<=sqRad){
                    
                    this.flowers.push([x,z])
                }
            }
        }
    }
    
    die(index,deflated=false){
        
        if(deflated===false){
            
            player.hiveBalloon.pollen+=this.pollen
            player.hiveBalloon.maxPollen+=this.pollen
            
        }
        
        objects.balloons.splice(index,1)
    }
    
    update(){
        
        if(this.state==='float'){
            
            this.life-=dt
            
            this.pos[0]+=this.moveDir[0]*dt
            this.pos[2]+=this.moveDir[1]*dt
            
            this.x=Math.round(this.pos[0]-fieldInfo[this.field].x)
            this.z=Math.round(this.pos[2]-fieldInfo[this.field].z)
            if(this.x!==this._x||this.z!==this._z){
                
                for(let j in this.prevFlowers){
                    
                    if(flowers[this.field][this.prevFlowers[j][1]][this.prevFlowers[j][0]].balloon===this){
                        
                        flowers[this.field][this.prevFlowers[j][1]][this.prevFlowers[j][0]].balloon=false
                        
                    }
                }
                
                this.prevFlowers=[]
                
                for(let j in this.flowers){
                    
                    let f=this.flowers[j]
                    
                    let nx=f[0]+this.x,nz=f[1]+this.z
                    
                    if(nx>=0&&nx<fieldInfo[this.field].width&&nz>=0&&nz<fieldInfo[this.field].length){
                        
                        if(!flowers[this.field][nz][nx].balloon||flowers[this.field][nz][nx].balloon.pollen>this.pollen){
                            
                            flowers[this.field][nz][nx].balloon=this
                        }
                        
                        this.prevFlowers.push([nx,nz])
                    }
                }
            }
            
            this._x=this.x
            this._z=this.z
            
            this.pollen=Math.min(Math.round(this.pollen),this.cap)
            
            let t=this.pollen*this.invCap-1
            
            t*=t
            t*=t
            
            this.size=(1-t)*(1.4+this.pollen.toString().length*0.075)+0.8
            
            this.displaySize+=(this.size-this.displaySize)*0.025
            this.pos[1]=this.y+this.displaySize*0.5-1
            
            meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1]-this.displaySize*0.5-1,this.pos[2],player.isNight,player.isNight,player.isNight,0.5,0.03,67)
            meshes.explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.col[0]*player.isNight,this.col[1]*player.isNight,this.col[2]*player.isNight,this.col[3],this.displaySize,1.03)
            
            meshes.explosions.instanceData.push(this.pos[0],this.y-4,this.pos[2],0,0,0,0.35,7,0.01)
            
            if(this.golden){
                
                textRenderer.addDecalRaw(...this.pos,0,0,...textRenderer.decalUV['lightrays'],1,1,0.85,2,2,TIME)
            }
            
            textRenderer.addSingle(this.pollen+'/'+this.cap,this.pos,COLORS.whiteArr,-0.465,true,true,0.175)
            
            textRenderer.addDecalRaw(...this.pos,0,0,...textRenderer.decalUV['rect'],0,0.4,0,1,0.25,0)
            
            textRenderer.addDecalRaw(...this.pos,(-0.5+(this.pollen*this.invCap)*0.5)/(this.pollen*this.invCap),0,...textRenderer.decalUV['rect'],0.1,0.85,0.1,this.pollen*this.invCap,0.25,0)
            textRenderer.addDecalRaw(...this.pos,1.1,-0.1,...textRenderer.decalUV['flower'],1,1,1,-0.44,-0.44,0)
            
            if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y+4,player.body.position.z])<=6.25){
                
                player.addEffect('balloonAura')
                
            }
            
            if(Math.abs(this.pos[0]-this.moveTo[0])+Math.abs(this.pos[2]-this.moveTo[1])<1){
                
                this.moveTo=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
                
                this.moveDir=[this.moveTo[0]-this.pos[0],this.moveTo[1]-this.pos[2]]
                
                vec2.normalize(this.moveDir,this.moveDir)
                vec2.scale(this.moveDir,this.moveDir,0.35)
            }
            
            if(this.golden&&TIME-this.checkBubble>0.5){
                
                this.checkBubble=TIME
                
                for(let j in objects.bubbles){
                    
                    let b=objects.bubbles[j]
                    
                    if(Math.abs(this.pos[0]-b.pos[0])+Math.abs(this.pos[2]-b.pos[2])<3.5){
                        
                        b.turnGolden()
                    }
                }
            }
            
            if(this.life<=0||this.pollen>=this.cap){
                
                this.state='moveToHive'
                
                this.moveDir=vec3.sub([],[player.hivePos[0]+1.5,player.hivePos[1],player.hivePos[2]],this.pos)
                vec3.normalize(this.moveDir,this.moveDir)
                
                for(let i in this.flowers){
                    
                    let x=this.flowers[i][0]+this.x,
                        z=this.flowers[i][1]+this.z
                    
                    if(x>=0&&x<fieldInfo[this.field].width&&z>=0&&z<fieldInfo[this.field].length){
                    flowers[this.field][z][x].balloon=false
                    }
                }
            }
            
        } else {
            
            this.pollen=Math.min(Math.round(this.pollen),this.cap)
            
            let t=this.pollen*this.invCap-1
            
            t*=t
            t*=t
            
            this.size=(1-t)*(1.4+this.pollen.toString().length*0.075)+0.8
            
            this.displaySize+=(this.size-this.displaySize)*0.025
            
            vec3.scaleAndAdd(this.pos,this.pos,this.moveDir,dt)
            
            meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1]-this.displaySize*0.5-1,this.pos[2],player.isNight,player.isNight,player.isNight,0.5,0.03,67)
            
            meshes.explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.col[0]*player.isNight,this.col[1]*player.isNight,this.col[2]*player.isNight,this.col[3],this.displaySize,1.05)
            
            if(this.golden){
                
                textRenderer.addDecalRaw(...this.pos,0,0,...textRenderer.decalUV['lightrays'],1,1,0.85,2,2,TIME)
            }
            
            textRenderer.addSingle(this.pollen+'/'+this.cap,this.pos,COLORS.whiteArr,-0.465,true,true,0.175)
            
            textRenderer.addDecalRaw(...this.pos,1.1,-0.1,...textRenderer.decalUV['flower'],1,1,1,-0.44,-0.44,0)
            
            if(vec3.sqrDist(this.pos,player.hivePos)<9){
                
                return true
            }
        }
    }
}

class Target {
    
    constructor(field,x,z,type,bee){
        
        this.bee=bee
        this.field=field
        this.x=x
        this.z=z
        this.type=type
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y,fieldInfo[this.field].z+this.z]
        this.col=this.type===3&&bee.gifted?[0.9,0,0.9]:[1,0.7,0]
        
        this.trail=new TrailRenderer.Trail({length:2,size:0.04,color:[1,0,0,1]})
    }
    
    die(index){
        
        this.trail.splice=true
        
        objects.explosions.push(new ReverseExplosion({col:this.activated?[0,1,0]:[1,0,0],pos:this.pos,life:0.5,size:3,alpha:1,height:3}))
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=4.5){
            
            let amountToConvert=Math.min((player.convertTotal*0.5)+(10*this.bee.convertAmount*player.convertRate*player[beeInfo[this.bee.type].color+'ConvertRate'])*(player.flameHeatStack*10),player.pollen)
            
            player.pollen-=amountToConvert
            
            if(player.setting_enablePollenText)
                textRenderer.add(Math.ceil(amountToConvert*0.5),[player.body.position.x,player.body.position.y+Math.random()*2+0.5,player.body.position.z],COLORS.honey,0,'+')
            
            let hpt=amountToConvert/5
            
            for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/5){
                
                objects.tokens.push(new LootToken(30,[this.pos[0]+Math.cos(i),fieldInfo[this.field].y+1,this.pos[2]+Math.sin(i)],'honey',Math.ceil(hpt),true,'Target Practice'))
            }
            
            player.addEffect('flameHeat',-1)
        }
        
        objects.targets.splice(index,1)
    }
    
    update(){
        
        this.trail.addPos(this.pos)
        this.trail.addPos(this.bee.pos)
        this.trail.color=[...this.col,0.75]
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=4){
            
            this.col=[0,1,0]
            this.activated=true
        }
        
        meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.col[0],this.col[1],this.col[2],0.5,1.75,0.75)
        
        return this.splice
    }
}

class Triangulate {
    
    constructor(bee,tokenPos){
        
        this.life=MATH.random(2.9,3.1)
        this.field=player.fieldIn
        this.tokenPos=tokenPos
        this.bee=bee
        this.mesh=new Mesh(true)
        this.offset=(Math.random()-0.5)*0.075
    }
    
    die(index){
        
        let px=Math.round(player.body.position.x-fieldInfo[this.field].x),
            pz=Math.round(player.body.position.z-fieldInfo[this.field].z),
            tx=Math.round(this.tokenPos[0]-fieldInfo[this.field].x),
            tz=Math.round(this.tokenPos[2]-fieldInfo[this.field].z),
            bx=Math.round(this.bee.pos[0]-fieldInfo[this.field].x),
            bz=Math.round(this.bee.pos[2]-fieldInfo[this.field].z),
            minX=Math.min(Math.min(bx,px),tx),
            maxX=Math.max(Math.max(bx,px),tx),
            minZ=Math.min(Math.min(bz,pz),tz),
            maxZ=Math.max(Math.max(bz,pz),tz)
        
        minX=MATH.constrain(minX,0,fieldInfo[this.field].width)
        maxX=MATH.constrain(maxX,0,fieldInfo[this.field].width)
        minZ=MATH.constrain(minZ,0,fieldInfo[this.field].length)
        maxZ=MATH.constrain(maxZ,0,fieldInfo[this.field].length)
        
        let f=[]
        
        for(let x=minX;x<maxX;x++){
            
            for(let z=minZ;z<maxZ;z++){
                
                if(MATH.pointInTriangle(x,z,px,pz,tx,tz,bx,bz)){
                    
                    f.push([x,z])
                }
            }
        }
        
        for(let i in objects.tokens){
            
            if(MATH.pointInTriangle(Math.round(objects.tokens[i].pos[0]-fieldInfo[this.field].x),Math.round(objects.tokens[i].pos[2]-fieldInfo[this.field].z),px,pz,tx,tz,bx,bz)&&!(objects.tokens[i] instanceof DupedToken)){
                
                objects.tokens[i].collect()
            }
        }
        
        let containsPollenMark=1,containsHoneyMark,containsPreciseMark,extraPollenFromMarks=1
        
        for(let i in objects.marks){
            
            if(MATH.pointInTriangle(objects.marks[i].x,objects.marks[i].z,px,pz,tx,tz,bx,bz)){
                
                extraPollenFromMarks=1.5
                
                if(objects.marks[i].type==='pollenMark'){
                    
                    containsPollenMark=2
                    
                } else if(objects.marks[i].type==='honeyMark'){
                    
                    containsHoneyMark=true
                    
                } else {
                    
                    containsPreciseMark=true
                }
            }
        }
        
        collectPollen({x:0,z:0,pattern:f,amount:10+this.bee.level*2,yOffset:2.5,stackHeight:0.8,field:this.field,otherPos:[(minX+maxX)*0.5+fieldInfo[this.field].x,player.body.position.y+0.5,(minZ+maxZ)*0.5+fieldInfo[this.field].z],multiplier:{r:extraPollenFromMarks,b:extraPollenFromMarks,w:containsPollenMark*extraPollenFromMarks},alwaysCrit:containsPreciseMark,instantConversion:containsHoneyMark?0.5:0})
        
        objects.explosions.push(new ReverseExplosion({col:[1,1,1],pos:this.bee.pos.slice(),life:0.25,size:2,alpha:1,height:1}))
        objects.explosions.push(new ReverseExplosion({col:[1,1,1],pos:this.tokenPos,life:0.25,size:2,alpha:1,height:1}))
        objects.explosions.push(new ReverseExplosion({col:[1,1,1],pos:[player.body.position.x,player.body.position.y,player.body.position.z],life:0.25,size:2,alpha:1,height:1}))
        
        objects.triangulates.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        let c=Math.max(1-this.life*0.25,0.2)
        
        this.mesh.setMesh([
            
            this.tokenPos[0],this.tokenPos[1]+this.offset,this.tokenPos[2],c,c,c,1,0,0,0,
            this.bee.pos[0],this.tokenPos[1]+this.offset,this.bee.pos[2],c,c,c,1,0,0,0,
            player.body.position.x,this.tokenPos[1]+this.offset,player.body.position.z,c,c,c,1,0,0,0,
            
        ],[0,1,2,2,1,0])
        
        this.mesh.setBuffers()
        this.mesh.render()
        
        return this.life<=0
    }
}

class FuzzBomb {
    
    constructor(field,beeLevel){
        
        this.beeLevel=beeLevel
        this.life=5+(beeLevel-1)*0.25
        this.field=field
        this.x=(fieldInfo[field].width*Math.random())|0
        this.z=(fieldInfo[field].length*Math.random())|0
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.5,fieldInfo[this.field].z+this.z]
        this.moveTo=[this.pos[0],this.pos[1]]
        this.moveTimer=0
        this.moveTo=[((Math.random()*fieldInfo[this.field].width)|0)+fieldInfo[this.field].x,fieldInfo[this.field].y+0.5,((Math.random()*fieldInfo[this.field].length)|0)+fieldInfo[this.field].z]
        
        objects.explosions.push(new Explosion({col:[0.5,0.2,0],pos:this.pos.slice(),life:0.4,size:4,speed:0.5,aftershock:0.05}))
    }
    
    die(index){
        
        objects.fuzzBombs.splice(index,1)
    }
    
    pop(){
        
        if(player.fieldIn===this.field){
            
            this.x=Math.round(this.pos[0]-fieldInfo[this.field].x)
            this.z=Math.round(this.pos[2]-fieldInfo[this.field].z)
            objects.explosions.push(new Explosion({col:[0.5,0.2,0],pos:this.pos.slice(),life:0.4,size:4,speed:0.5,aftershock:0.05}))
            let p=[[0,0],[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1],[0,1],[0,-1],[0,2],[2,0],[-2,0],[0,-2],[-1,2],[1,2],[2,-1],[2,1],[-1,-2],[1,-2],[-2,1],[-2,-1],[3,0],[-3,0],[0,-3],[0,3]]
            
            for(let i in p){
                
                let x=p[i][0]+this.x,z=p[i][1]+this.z
                
                if(x>=0&&x<fieldInfo[this.field].width&&z>=0&&z<fieldInfo[this.field].length){
                    
                    updateFlower(this.field,x,z,function(f){
                        
                        if(f.level<5){
                            
                            f.level++
                            f.pollinationTimer=1
                            
                        } else {
                            
                            f.height=1
                        }
                        
                    },true,false,true)
                }
            }
            
            collectPollen({x:this.x,z:this.z,pattern:p,amount:{r:10,w:15,b:10},stackOffset:0.35+Math.random()*0.7,multiplier:player.whiteBombPollen+this.beeLevel*0.075,field:this.field})
            
            player.addEffect('bombCombo')
            
            for(let j=0;j<40;j++){
                
                ParticleRenderer.add({x:this.pos[0]+MATH.random(-2,2),y:this.pos[1],z:this.pos[2]+MATH.random(-2,2),vx:MATH.random(-1,1),vy:Math.random()*2,vz:MATH.random(-1,1),grav:-3,size:100,col:[1,1,MATH.random(0.6,1)],life:1,rotVel:MATH.random(-3,3),alpha:2})
            }
            
        }
        
        this.life=0
    }
    
    update(){
        
        this.life-=dt
        this.moveTimer-=dt
        
        if(this.moveTimer<=0){
            
            this.moveTimer=1
            let md=[[0,0,1],[1,0,0]][(Math.random()*2)|0]
            
            if(md[2]===0){
                
                let px=Math.round(this.pos[0]-fieldInfo[this.field].x),
                am=MATH.random(-px,fieldInfo[this.field].width-px)
                am|=0
                this.movePos=vec3.scale([],md,am)
                vec3.add(this.movePos,this.movePos,this.pos)
            }
            
            if(md[0]===0){
                
                let pz=Math.round(this.pos[2]-fieldInfo[this.field].z),
                am=MATH.random(-pz,fieldInfo[this.field].length-pz)
                am|=0
                this.movePos=vec3.scale([],md,am)
                vec3.add(this.movePos,this.movePos,this.pos)
            }
        }
        
        this.pos[0]+=(this.movePos[0]-this.pos[0])*dt*5
        this.pos[2]+=(this.movePos[2]-this.pos[2])*dt*5
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=4){
            
            this.pop()
        }
        
        meshes.explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],0.5,0.2,0,Math.min(this.life,0.85),1.25,1)
        
        return this.life<=0
    }
}

class PetalShuriken {
    
    constructor(pos,vel){
        
        this.pos=[...pos,0]
        this.vel=vel
        this.life=1.5
        
        vec3.scale(vel,vel,10)
        
        this.hitBees=[]
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        this.pos[0]+=this.vel[0]*dt
        this.pos[2]+=this.vel[2]*dt
        this.pos[3]+=dt*10
        
        for(let i in objects.bees){
            
            let b=objects.bees[i]
            
            if(this.hitBees.indexOf(i)<0&&Math.abs(b.pos[0]-this.pos[0])+Math.abs(b.pos[1]-this.pos[1])+Math.abs(b.pos[2]-this.pos[2])<1){
                
                objects.explosions.push(new Explosion({col:Math.random()<0.5?[1,0.9,0]:[1,0,0.825],pos:this.pos.slice(),life:0.5,size:1.2,speed:0.35,aftershock:0.005}))
                
                this.hitBees.push(i)
                
                let amountToConvert=Math.ceil(Math.min(player.pollen,10000+b.convertAmount*7.5*player[beeInfo[b.type].color+'ConvertRate']))
                
                player.pollen-=amountToConvert
                player.honey+=Math.ceil(amountToConvert*player.honeyPerPollen)
                
                if(amountToConvert)
                    textRenderer.add(Math.ceil(amountToConvert*player.honeyPerPollen)+'',[b.pos[0],b.pos[1]+0.75,b.pos[2]],COLORS.honey,1,'⇆')
            }
        }
        
        for(let i in objects.bubbles){
            
            let b=objects.bubbles[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=4.5){
                
                b.pop()
            }
        }
        
        for(let i in objects.fuzzBombs){
            
            let b=objects.fuzzBombs[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=3.5){
                
                b.pop()
            }
        }
        
        for(let i in objects.tokens){
            
            let b=objects.tokens[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=3.5&&!(objects.tokens[i] instanceof DupedToken)){
                
                b.collect()
            }
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.petalShuriken.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.petalShuriken.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,1,this.life*1.75)
        gl.drawElements(gl.TRIANGLES,meshes.petalShuriken.indexAmount,gl.UNSIGNED_SHORT,0)
    
        return this.life<=0
    }
}

class BugMob {
    
    constructor(spawnPos,bounds,level,health,type){
        
        this.type=type
        this.starSawHitTimer=0
        this.level=level
        this.health=health
        this.maxHealth=this.health
        this.spawnPos=spawnPos
        this.pos=spawnPos
        this.state='hide'
        this.bounds=bounds
        this.checkTimer=TIME
        this.respawnTimer=0
        this.flameTimer=0
        this.damageTimer=0
        this.mindHacked=0
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0

        let l=d.toString().length

        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',1.25)        
    }
    
    update(){
        
        switch(this.state){
            
            case 'hide':
                
                if(TIME-this.checkTimer>0.5){
                    
                    this.checkTimer=TIME+Math.random()*0.2
                    let b=this.bounds,p=player.body.position
                    
                    if(p.x>b.minX&&p.x<b.maxX&&p.y>b.minY&&p.y<b.maxY&&p.z>b.minZ&&p.z<b.maxZ){
                        
                        this.state='attack'
                        this.pos=this.spawnPos.slice()
                        this.aimPos=false
                    }
                }
                
            break
            
            case 'attack':
                
                if(this.health<=0){
                    
                    player.stats[this.type]++
                    this.state='dead'
                    this.respawnTimer=0
                    
                    let amountOfTokens=((player.lootLuck-1)|0)
                    
                    let dropTable,dropAmountTable

                    switch(this.type){

                        case 'rhinoBeetle':

                            amountOfTokens+=4
                            dropTable=['blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueExtract','treat','treat','gumdrops','gumdrops']
                            dropAmountTable={blueberry:[1,1,1,1,1,1,1,1,1,1,1,3,3,5],blueExtract:[1,1,1,1,1,1,1,1,1,3],treat:[1,1,1,1,1,1,1,1,1,3,3,3,5,5,10],gumdrops:[1,1,1,1,1,1,1,3,3,5]}

                        break

                        case 'ladybug':

                            amountOfTokens+=4
                            dropTable=['strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','redExtract','treat','treat','gumdrops','gumdrops']
                            dropAmountTable={strawberry:[1,1,1,1,1,1,1,1,1,1,1,3,3,5],redExtract:[1,1,1,1,1,1,1,1,1,3],treat:[1,1,1,1,1,1,1,1,1,3,3,3,5,5,10],gumdrops:[1,1,1,1,1,1,1,3,3,5]}

                        break

                        case 'spider':

                            amountOfTokens+=7
                            dropTable=['treat','treat','treat','pineapple','sunflowerSeed','gumdrops','treat','treat','treat','pineapple','sunflowerSeed','gumdrops','glue','enzymes','oil','fieldDice','ticket','royalJelly','ticket','royalJelly','moonCharm','moonCharm']
                            dropAmountTable={treat:[1,1,1,1,5,5,5,10,10,15],enzymes:[1,1,1,1,1,1,1,2,2,3],oil:[1,1,1,1,1,1,1,2,2,3],fieldDice:[1,1,1,1,1,2,2,3],glue:[1,1,1,1,1,1,3,3,5],pineapple:[1,1,1,1,1,1,1,3,3,3,5,5,10],sunflowerSeed:[1,1,1,1,1,1,1,3,3,3,5,5,10],gumdrops:[1,1,1,1,1,1,1,5,5,10],ticket:[1,1,1,1,1,1,1,1,3,3,5],royalJelly:[1,1,1,1,1,1,1,3,3,5],moonCharm:[1,1,1,1,3,3,5]}

                        break

                        case 'werewolf':

                            amountOfTokens+=9
                            dropTable=['treat','treat','treat','pineapple','sunflowerSeed','gumdrops','treat','treat','treat','pineapple','sunflowerSeed','gumdrops','gumdrops','glue','enzymes','oil','fieldDice','fieldDice','smoothDice','treat','treat','treat','pineapple','sunflowerSeed','gumdrops','treat','treat','treat','pineapple','sunflowerSeed','gumdrops','glue','glue','enzymes','oil','fieldDice','fieldDice','smoothDice','loadedDice','ticket','royalJelly','ticket','royalJelly','ticket','royalJelly','antPass','moonCharm','moonCharm']
                            dropAmountTable={treat:[1,1,1,1,5,5,5,15,20,35],enzymes:[1,1,1,1,1,1,1,2,2,3],oil:[1,1,1,1,1,1,1,2,2,3],fieldDice:[1,1,1,1,1,2,2,3],smoothDice:[1,1,1,1,1,1,1,1,1,1,3],loadedDice:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],glue:[1,1,1,1,1,1,1,3,3,5,10,15],pineapple:[1,1,1,1,1,1,3,3,3,5,5,10,15,25],sunflowerSeed:[1,1,1,1,1,1,3,3,3,5,5,10,15,25],gumdrops:[1,1,1,1,1,1,5,5,5,10,10,15],ticket:[1,1,1,1,1,1,3,3,5,10],royalJelly:[1,1,1,1,1,1,3,3,5,10,15],antPass:[1],moonCharm:[1,1,1,1,3,3,5]}

                        break

                        case 'scorpion':

                            amountOfTokens+=7
                            dropTable=['strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','strawberry','redExtract','treat','treat','treat','gumdrops','gumdrops','gumdrops','ticket','royalJelly','ticket','royalJelly']
                            dropAmountTable={strawberry:[1,1,1,1,1,1,3,3,3,5,5,15],redExtract:[1,1,1,1,1,1,3,3,5],treat:[1,1,1,1,1,5,5,5,15,15,30],gumdrops:[1,1,1,1,1,1,3,3,5,15],ticket:[1,1,1,1,1,1,3,3,5],royalJelly:[1,1,1,1,1,1,3,3,5,10]}

                        break

                        case 'mantis':

                            amountOfTokens+=7
                            dropTable=['blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueberry','blueExtract','treat','treat','treat','gumdrops','gumdrops','gumdrops','ticket','royalJelly','ticket','royalJelly']
                            dropAmountTable={blueberry:[1,1,1,1,1,1,3,3,3,5,5,15],blueExtract:[1,1,1,1,1,1,3,3,5],treat:[1,1,1,1,1,5,5,5,15,15,30],gumdrops:[1,1,1,1,1,1,3,3,5,15],ticket:[1,1,1,1,1,1,3,3,5],royalJelly:[1,1,1,1,1,1,3,3,5,10]}

                        break

                        case 'kingBeetle':

                            amountOfTokens+=12

                            dropTable=['treat','treat','treat','treat','treat','redExtract','blueExtract','redExtract','blueExtract','redExtract','blueExtract','gumdrops','ticket','royalJelly','gumdrops','ticket','royalJelly','gumdrops','ticket','royalJelly','microConverter','fieldDice','fieldDice','fieldDice','smoothDice','smoothDice','loadedDice','antPass','moonCharm','antPass','moonCharm','oil','enzymes','glitter','glue']
                            dropAmountTable={treat:[15,15,15,20,25,25,25,50,50,50,50,100,100,100,150,150,175,175,250,350,500],redExtract:[1,1,1,1,1,1,1,3,3,3,5,5,10],blueExtract:[1,1,1,1,1,1,1,3,3,3,5,5,10],gumdrops:[3,3,3,3,5,5,5,15,15,25],ticket:[1,1,1,1,3,3,3,5,5,10],royalJelly:[1,1,3,3,3,3,3,5,5,10],microConverter:[1,1,1,1,1,3,3,5],fieldDice:[1,1,1,1,1,3,3,5],smoothDice:[1,1,1,1,1,1,2,2,2,3],loadedDice:[1],antPass:[1,1,1,1,1,3,3,3,5],moonCharm:[3,3,3,3,5,5,5,15,15,25],oil:[1,1,1,1,1,3,3,5],enzymes:[1,1,1,1,1,3,3,5],glitter:[1,1,1,1,1,3,3,5],glue:[1,1,1,1,1,3,3,5]}

                        break
                    }
                    
                    let radius=amountOfTokens*0.2+1.5

                    for(let i=0,inc=MATH.TWO_PI/amountOfTokens;i<MATH.TWO_PI;i+=inc){
                        
                        let r=1-Math.pow(1-0.2,player.lootLuck*1.5)
                        
                        if(Math.random()<r){
                            
                            let ty=dropTable[(Math.random()*dropTable.length)|0],am=dropAmountTable[ty][(Math.random()*dropAmountTable[ty].length)|0]
                            
                            objects.tokens.push(new LootToken(45,[this.pos[0]+Math.cos(i)*radius,this.pos[1],this.pos[2]+Math.sin(i)*radius],ty,am,true,MATH.doGrammar(this.type)))
                            
                        } else {
                            
                            objects.tokens.push(new LootToken(45,[this.pos[0]+Math.cos(i)*radius,this.pos[1],this.pos[2]+Math.sin(i)*radius],'honey',{rhinoBeetle:15,ladybug:15,spider:50,werewolf:500,scorpion:300,mantis:300,kingBeetle:1500}[this.type],true,MATH.doGrammar(this.type)))
                            
                        }
                    }
                    
                    return
                }
                
                this.mindHacked-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<2.25){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                player.attacked.push(this)
                
                if(this.mindHacked<=0){

                    if(TIME-this.checkTimer>0.25){
                        
                        this.checkTimer=TIME+Math.random()*0.2
                        let b=this.bounds,p=player.body.position
                        
                        if(!(p.x>b.minX&&p.x<b.maxX&&p.y>b.minY&&p.y<b.maxY&&p.z>b.minZ&&p.z<b.maxZ)){
                            
                            this.state='moveToHide'
                        }
                    }
                    
                    this.damageTimer-=dt
                    
                    if(this.damageTimer<=0&&this.aimTimer>0&&Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<1.5){
                        
                        player.damage({rhinoBeetle:20,ladybug:18,spider:25,werewolf:35,scorpion:30,mantis:30,kingBeetle:75,tunnelBear:10000}[this.type])
                        this.damageTimer=1.5
                    }
                    
                    let d=[player.body.position.x-this.pos[0],player.body.position.z-this.pos[2]]
                    
                    vec2.normalize(d,d)
                    
                    if(!this.aimPos){
                        
                        if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.z-this.pos[2])>(this.type==='tunnelBear'?0:6)){
                            
                            this.pos[0]+=d[0]*dt*5
                            this.pos[2]+=d[1]*dt*5
                            
                        } else {
                            
                            this.aimPos=[player.body.position.x,player.body.position.y,player.body.position.z]
                            this.landPos=this.pos.slice()
                            this.lungeState=0
                            this.aimTimer=1.5
                        }
                        
                    } else {
                        
                        this.aimTimer-=dt
                        
                        if(this.aimTimer<=0){
                            
                            if(!this.lungeState){
                                
                                d=[this.aimPos[0]-this.pos[0],this.aimPos[2]-this.pos[2]]
                        
                                vec2.normalize(d,d)
                                
                                this.pos[0]+=d[0]*dt*15
                                this.pos[2]+=d[1]*dt*15
                                
                                if(Math.abs(this.aimPos[0]-this.pos[0])+Math.abs(this.aimPos[2]-this.pos[2])<1){
                                    
                                    this.lungeState=1
                                    
                                    if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<2){
                                        
                                        player.damage({rhinoBeetle:20,ladybug:18,spider:25,werewolf:35,scorpion:30,mantis:30,kingBeetle:75,tunnelBear:10000}[this.type])
                                    }
                                }
                                
                            } else {
                                
                                d=[this.landPos[0]-this.pos[0],this.landPos[2]-this.pos[2]]
                        
                                vec2.normalize(d,d)
                                
                                this.pos[0]+=d[0]*dt*15
                                this.pos[2]+=d[1]*dt*15
                                
                                if(Math.abs(this.landPos[0]-this.pos[0])+Math.abs(this.landPos[2]-this.pos[2])<0.75){
                                    
                                    this.aimPos=undefined
                                    this.aimTimer=1.5
                                }
                            }
                        }
                    }
                    
                    this.pos[3]=Math.atan2(d[1],d[0])+MATH.HALF_PI+(!this.aimPos?BEE_FLY*0.5:0)

                } else {

                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,1,1)
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.type].vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.type].indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.drawElements(gl.TRIANGLES,meshes[this.type].indexAmount,gl.UNSIGNED_SHORT,0)
                
                this.pos[1]+=this.type==='werewolf'||this.type==='mantis'?3:1
                textRenderer.addCTX(MATH.doGrammar(this.type)+' (Level '+this.level+')',[this.pos[0],this.pos[1]+0.4,this.pos[2]],COLORS.whiteArr,100)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
                this.pos[1]-=this.type==='werewolf'||this.type==='mantis'?3:1
                
            break
            
            case 'moveToHide':
                
                let b=this.bounds,p=player.body.position
                
                if(p.x>b.minX&&p.x<b.maxX&&p.y>b.minY&&p.y<b.maxY&&p.z>b.minZ&&p.z<b.maxZ){
                    
                    this.state='attack'
                    return
                }
                
                if(Math.abs(this.spawnPos[0]-this.pos[0])+Math.abs(this.spawnPos[2]-this.pos[2])<1){
                    
                    this.state='hide'
                    return
                }
                
                let _d=[this.spawnPos[0]-this.pos[0],this.spawnPos[2]-this.pos[2]]
                
                vec2.normalize(_d,_d)
                
                this.pos[0]+=_d[0]*dt*4
                this.pos[2]+=_d[1]*dt*4
                
                this.pos[3]=Math.atan2(_d[1],_d[0])+MATH.HALF_PI
                
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,1,1)
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.type].vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.type].indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.drawElements(gl.TRIANGLES,meshes[this.type].indexAmount,gl.UNSIGNED_SHORT,0)
                
                this.pos[1]+=this.type==='werewolf'||this.type==='mantis'?3:1
                textRenderer.addCTX('Rhino Beetle (Level '+this.level+')',[this.pos[0],this.pos[1]+0.4,this.pos[2]],COLORS.whiteArr,100)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
                this.pos[1]-=this.type==='werewolf'||this.type==='mantis'?3:1
                
            break
            
            case 'dead':
                
                this.respawnTimer-=dt
                
                if(this.respawnTimer<=0&&!player.fieldIn){
                    
                    this.state='hide'
                    this.health=this.maxHealth
                }
                
            break
        }
        
    }
}

class MondoChick {
    
    constructor(field,level){
        
        this.field=field
        this.state='attack'
        this.starSawHitTimer=0
        this.level=level
        this.health=300000
        this.maxHealth=this.health
        this.pos=[fieldInfo[this.field].x+0.5*fieldInfo[this.field].width,fieldInfo[this.field].y+2.5,fieldInfo[this.field].z+0.5*fieldInfo[this.field].length]
        this.checkTimer=TIME
        this.flameTimer=0
        this.waitTimer=0
        this.target=[this.pos[0],this.pos[2]]
        this.damageTimer=0
        this.bodySize=2.5
        this.timeLimit=10*60
        this.maxTimeLimit=this.timeLimit
        this.fallenEggShellEffect=0
        this.runningAmount=0
        this.mindHacked=0
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
        
    }
    
    update(){
        
        switch(this.state){
            
            case 'dead':
                
                return true
                
            break
            
            case 'attack':
                
                if(this.health<=0||this.timeLimit<=0){
                    
                    player.stats.mondoChicken++
                    this.state='dead'
                    
                    return
                }
                
                this.mindHacked-=dt
                this.timeLimit-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                if(player.fieldIn===this.field){
                    
                    player.attacked.push(this)
                }
                
                if(this.mindHacked<=0){

                    let d=[this.target[0]-this.pos[0],this.target[1]-this.pos[2]]
                    if(Math.abs(d[0])+Math.abs(d[1])<0.75){
                        
                        this.target=[fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length]
                        d=[this.target[0]-this.pos[0],this.target[1]-this.pos[2]]
                        this.runningAmount--

                        if(this.runningAmount<=0){
                            
                            this.waitTimer=5
                            this.runningAmount=MATH.random(4,8)|0
                        }
                    }
                    
                    vec2.normalize(d,d)
                    
                    this.running=false
                    this.waitTimer-=dt
                    
                    if(this.waitTimer<=0){
                        
                        this.pos[0]+=d[0]*dt*7
                        this.pos[2]+=d[1]*dt*7
                        this.running=true
                    }
                    
                    this.damageTimer-=dt
                    
                    if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1]-2.5)+Math.abs(player.body.position.z-this.pos[2])<this.bodySize&&this.damageTimer<=0){
                        
                        player.damage(35)
                        this.damageTimer=1
                    }

                    this.pos[3]=Math.atan2(d[1],d[0])+MATH.HALF_PI+Math.sin(TIME*30)*0.2

                } else {

                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1
                textRenderer.addCTX('Mondo Chick (Level '+this.level+')',[this.pos[0],this.pos[1]+0.9,this.pos[2]],COLORS.whiteArr,100)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,1.5,...textRenderer.decalUV['rect'],0.61*0.5,0.42*0.5,0.27*0.5,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.timeLimit/this.maxTimeLimit)*0.5)/(this.timeLimit/this.maxTimeLimit),1.5,...textRenderer.decalUV['rect'],0.61,0.42,0.27,this.timeLimit*2.5/this.maxTimeLimit,0.4,0)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
                textRenderer.addSingle('Time: '+MATH.doTime((this.timeLimit|0)+''),this.pos,COLORS.whiteArr,-1,false,false,0,0.6)
            
                this.pos[1]-=1
                this.blocking=false
                
                meshes.explosions.instanceData.push(this.pos[0],this.pos[1]+this.fallenEggShellEffect,this.pos[2],0.9*player.isNight,0.9*player.isNight,0.9*player.isNight,this.fallenEggShellEffect*0.5+1,4,1.15)
                
                if(!this.running){
                    
                    this.blocking=true
                    this.fallenEggShellEffect=0
                    return
                }
                
                this.fallenEggShellEffect-=dt*15
                
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,1,1)
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes.mondoChick.vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.mondoChick.indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.drawElements(gl.TRIANGLES,meshes.mondoChick.indexAmount,gl.UNSIGNED_SHORT,0)
                
            break
            
        }
        
    }
}

class RogueViciousBee {
    
    constructor(field,level){
        
        this.spikes=[]

        this.field=field
        this.state='hiding'
        this.starSawHitTimer=0
        this.level=level
        this.health=1000+(level-1)*2000
        this.maxHealth=this.health
        this.pos=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].y+3,fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
        this.flameTimer=0
        this.waitTimer=0
        this.target=[this.pos[0],this.pos[2]]
        this.bodySize=1.5
        this.timeLimit=10*60
        this.maxTimeLimit=this.timeLimit

        this.addSpikeAttackTimer=0
        this.nextAttackTimer=0
        this.attackAlternate=0

        this.mindHacked=0
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
    }
    
    update(){
        
        switch(this.state){
            
            case 'dead':
                
                return true
                
            break

            case 'hiding':

                if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.z-this.pos[2])+Math.abs(this.pos[1]-2.5-player.body.position.y)<2){

                    objects.explosions.push(new Explosion({col:[1,0,0],pos:[this.pos[0],this.pos[1]+0.5,this.pos[2]],life:1,size:5,speed:0.25,aftershock:0.005}))

                    player.addMessage("⚠️You've found a Rogue Vicious Bee!⚠️",[0,0,0])
                    this.state='attack'
                    player.damage(20)
                }

                gl.bindBuffer(gl.ARRAY_BUFFER,meshes.spike.vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.spike.indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.uniform2f(glCache.mob_instanceInfo2,0.5,1)
                gl.uniform4fv(glCache.mob_instanceInfo1,[this.pos[0],this.pos[1]-4,this.pos[2],0])
                gl.drawElements(gl.TRIANGLES,meshes.spike.indexAmount,gl.UNSIGNED_SHORT,0)

            break
            
            case 'attack':
                
                if(this.health<=0||this.timeLimit<=0){
                    
                    player.stats.rogueViciousBee++
                    this.state='dead'
                    
                    return
                }
                
                this.mindHacked-=dt
                this.timeLimit-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                if(player.fieldIn===this.field){
                    
                    player.attacked.push(this)
                }
                
                if(this.mindHacked<=0){

                    let d=[this.target[0]-this.pos[0],this.target[1]-this.pos[2]]

                    if(Math.abs(d[0])+Math.abs(d[1])<0.75&&this.attackState===undefined){

                        this.attackState=(this.attackAlternate++)%2
                        this.nextAttackTimer=7.5

                    } else if(this.attackState===undefined){
                        
                        vec2.normalize(d,d)
                        
                        this.pos[0]+=d[0]*dt*6
                        this.pos[2]+=d[1]*dt*6

                        meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,d[0],0,d[1],BEE_FLY,beeInfo.vicious.u,beeInfo.vicious.v,beeInfo.vicious.meshPartId)
                    }

                    if(this.nextAttackTimer<=0){

                        this.target=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
                        this.attackState=undefined
                        this.nextAttackTimer=Infinity
                    }

                    if(this.attackState===0){

                        this.nextAttackTimer-=dt
                        this.addSpikeAttackTimer-=dt

                        meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,Math.sin(TIME*8),0,Math.cos(TIME*8),BEE_FLY,beeInfo.vicious.u,beeInfo.vicious.v,beeInfo.vicious.meshPartId)

                        if(this.addSpikeAttackTimer<=0){

                            this.spikes.push({pos:[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].y+0.51-10,fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0),0],life:2.5,glow:0,y:fieldInfo[this.field].y+0.51})

                            this.addSpikeAttackTimer=0.15
                        }

                    } else if(this.attackState===1){
                        
                        this.nextAttackTimer-=dt
                        this.addSpikeAttackTimer-=dt

                        meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,player.body.position.x-this.pos[0],player.body.position.y-this.pos[1],player.body.position.z-this.pos[2],BEE_FLY,beeInfo.vicious.u,beeInfo.vicious.v,beeInfo.vicious.meshPartId)

                        if(this.addSpikeAttackTimer<=0){

                            this.spikes.push({pos:[fieldInfo[this.field].x+player.flowerIn.x,fieldInfo[this.field].y+0.51-10,fieldInfo[this.field].z+player.flowerIn.z,0],life:2.5,glow:0,y:fieldInfo[this.field].y+0.51})

                            this.addSpikeAttackTimer=0.5
                        }
                    }

                    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.spike.vertBuffer)
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.spike.indexBuffer)
                    gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                    gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                    gl.uniform2f(glCache.mob_instanceInfo2,0.5,1)
                    
                    for(let i=this.spikes.length;i--;){

                        let s=this.spikes[i]

                        this.spikes[i].life-=dt
                        this.spikes[i].glow+=dt

                        if(s.life<1&&s.life>0.5){
                            
                            s.pos[1]+=(s.y+2-s.pos[1])*dt*22

                            meshes.cylinder_explosions.instanceData.push(s.pos[0],s.y,s.pos[2],1,0,0,s.glow,1.5,0.001)

                        } else if(s.life<0.5){
                            
                            s.pos[1]+=(s.y-10-s.pos[1])*dt*10

                        } else {

                            meshes.cylinder_explosions.instanceData.push(s.pos[0],s.y,s.pos[2],1,0,0,s.glow,1.5,0.001)
                        }

                        if(Math.abs(player.body.position.x-s.pos[0])+Math.abs(player.body.position.z-s.pos[2])+Math.abs(s.pos[1]-player.body.position.y)<1.5&&!s.damaged){

                            s.damaged=true
                            player.damage(40)
                        }

                        gl.uniform4fv(glCache.mob_instanceInfo1,s.pos)
                        gl.drawElements(gl.TRIANGLES,meshes.spike.indexAmount,gl.UNSIGNED_SHORT,0)

                        if(s.life<=0){

                            this.spikes.splice(i,1)
                        }
                    }

                } else {

                    meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,Math.random()-0.5,Math.random()-0.5,Math.random()-0.5,BEE_FLY,beeInfo.vicious.u,beeInfo.vicious.v,beeInfo.vicious.meshPartId)

                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1.25
                textRenderer.addCTX('Rogue Vicious Bee (Level '+this.level+')',[this.pos[0],this.pos[1]+0.9,this.pos[2]],COLORS.whiteArr,100)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,1.5,...textRenderer.decalUV['rect'],0.61*0.5,0.42*0.5,0.27*0.5,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.timeLimit/this.maxTimeLimit)*0.5)/(this.timeLimit/this.maxTimeLimit),1.5,...textRenderer.decalUV['rect'],0.61,0.42,0.27,this.timeLimit*2.5/this.maxTimeLimit,0.4,0)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
                textRenderer.addSingle('Time: '+MATH.doTime((this.timeLimit|0)+''),this.pos,COLORS.whiteArr,-1,false,false,0,0.6)
                this.pos[1]-=1.25
                
            break
            
        }
        
    }
}

class WildWindyBee {
    
    constructor(field,pos){

        this.field=field
        this.starSawHitTimer=0
        this.level=1
        this.health=250
        this.maxHealth=this.health
        this.pos=pos
        this.pos[1]-=2
        this.flameTimer=0
        this.waitTimer=0
        this.target=[this.pos[0],this.pos[2]]
        this.bodySize=1.5
        this.timeLimit=5*60
        this.maxTimeLimit=this.timeLimit
        this.state='attack'

        this.mindHacked=0

        this.tornados=[]
        this.nextAttackTimer=0
        this.attackAlternate=0

        this.trails=[new TrailRenderer.ConstantTrail({length:9,size:0.4,color:[0.5,0.5,0.5,0.6]}),new TrailRenderer.ConstantTrail({length:9,size:0.4,color:[0.5,0.5,0.5,0.6],vertical:true})]
        this.whipWarning=new TrailRenderer.ConstantTrail({length:5,size:0.05,color:[0.85,0,0,1]})

        this.windWhipTrails=[{trail:new TrailRenderer.ConstantTrail({length:10,triangle:true,size:1.1,color:[0.5,0.6,0.6,1]})},{trail:new TrailRenderer.ConstantTrail({length:10,triangle:true,size:1.9,color:[0.8,0.8,0.8,1]})},{trail:new TrailRenderer.ConstantTrail({length:10,triangle:true,size:1.55,color:[0.4,0.5,0.7,1]})}]
        
    }
    
    die(index){
        
        this.trails[0].splice=true
        this.trails[1].splice=true
        this.whipWarning.splice=true

        for(let i in this.windWhipTrails){

            this.windWhipTrails[i].trail.splice=true
        }

        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
    }
    
    update(){

        if(!(frameCount%6)){

            this.trails[0].addPos(this.pos.slice())
            this.trails[1].addPos(this.pos.slice())
        }

        switch(this.state){

            case 'flee':

                this.mindHacked=0
                this.pos[0]+=this.moveDir[0]*dt
                this.pos[1]+=this.moveDir[1]*dt
                this.pos[2]+=this.moveDir[2]*dt

                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)

                if(this.pos[1]>55){

                    return true
                }

            break

            case 'move':

                this.mindHacked=0
                this.pos[0]+=this.moveDir[0]*dt
                this.pos[1]+=this.moveDir[1]*dt
                this.pos[2]+=this.moveDir[2]*dt

                meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,this.moveDir[0],this.moveDir[1],this.moveDir[2],BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)

                if(TIME>this.timeAtArrival){

                    this.state='attack'
                    this.pos=this.moveTo
                    this.target=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
                }

            break

            case 'attack':

                if(this.health<=0){

                    let f=[]

                    for(let i in fieldInfo){

                        if(i!=='AntField'&&i!=='StumpField'&&i!==this.field)f.push(i)
                    }

                    f=f[(Math.random()*f.length)|0]

                    let center=[fieldInfo[this.field].x+fieldInfo[this.field].width*0.5,this.pos[1]-1.5,fieldInfo[this.field].z+fieldInfo[this.field].length*0.5],_f=this.field

                    objects.mobs.push(new Cloud(this.field,(fieldInfo[this.field].width*0.5)|0,(fieldInfo[this.field].length*0.5)|0,3*60))


                    this.tornados=[]
                    this.state='move'
                    this.field=f
                    this.moveTo=[fieldInfo[f].x+((Math.random()*fieldInfo[f].width)|0),fieldInfo[f].y+0.55+2,fieldInfo[f].z+((Math.random()*fieldInfo[f].length)|0)]
                    this.moveDir=vec3.sub([],this.moveTo,this.pos)
                    let dist=vec3.len(this.moveDir)
                    this.timeAtArrival=TIME+(dist/7)
                    vec3.scale(this.moveDir,this.moveDir,7/dist)
                    this.level++
                    this.health=this.level*this.level*250+250
                    this.maxHealth=this.health

                    let amountOfTokens=MATH.random(10,14)|0,
                    dropTable=['treat','treat','sunflowerSeed','sunflowerSeed','ticket','royalJelly','cloudVial','fieldDice','treat','treat','sunflowerSeed','sunflowerSeed','ticket','royalJelly','cloudVial','fieldDice','tropicalDrink','oil','glitter','magicBean','starJelly'],radius=amountOfTokens*0.2+1.5

                    if(_f==='CoconutField') dropTable.push('tropicalDrink')

                    for(let i=0,inc=MATH.TWO_PI/amountOfTokens;i<MATH.TWO_PI;i+=inc){
                        
                        if(Math.random()<0.5){
                            
                            let ty=dropTable[(Math.random()*dropTable.length)|0]
                            
                            objects.tokens.push(new LootToken(45,[center[0]+Math.cos(i)*radius,center[1],center[2]+Math.sin(i)*radius],ty,1,true,'Wild Windy Bee'))
                            
                        } else {
                            
                            objects.tokens.push(new LootToken(45,[center[0]+Math.cos(i)*radius,center[1],center[2]+Math.sin(i)*radius],'honey',(this.level-2)*10000+1000,true,'Wild Windy Bee'))
                        }
                    }

                    this.whipWarning.addPos([])
                    this.whipWarning.addPos([])
                    this.whipWarning.addPos([])
                    this.whipWarning.addPos([])
                    this.whipWarning.addPos([])

                    for(let i in this.windWhipTrails){

                        let t=this.windWhipTrails[i]

                        t.trail.addPos([])
                        t.trail.addPos([])
                        t.trail.addPos([])
                        t.trail.addPos([])
                        t.trail.addPos([])
                        t.trail.addPos([])
                        t.trail.addPos([])
                    }
                }

                if(this.timeLimit<=0){
                    
                    this.state='flee'
                    this.moveDir=[100-this.pos[0],50-this.pos[1],-30-this.pos[2]]
                    vec3.normalize(this.moveDir,this.moveDir)
                    vec3.scale(this.moveDir,this.moveDir,7)

                    return
                }
                
                this.mindHacked-=dt
                this.timeLimit-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                if(player.fieldIn===this.field){
                    
                    player.attacked.push(this)
                }
                
                if(this.mindHacked<=0){

                    let d=[this.target[0]-this.pos[0],this.target[1]-this.pos[2]]

                    if(Math.abs(d[0])+Math.abs(d[1])<0.75&&this.attackState===undefined){

                        let skip=Math.random()<0.35
                        this.nextAttackTimer=skip?0:1.5
                        this.skipAttack=skip

                        if(!skip){
                            
                            this.attackState=(this.attackAlternate++)%2===0||this.tornados.length>=3?1:0

                            if(player.fieldIn===this.field&&this.attackState){

                                this.windWhipTimer=1
                                this.whipA=[this.pos[0],this.pos[1]-1.9,this.pos[2]]
                                this.whipB=[player.body.position.x,this.pos[1]-1.9,player.body.position.z]

                                let dir=vec3.sub([],this.whipB,this.whipA)
                                vec3.normalize(dir,dir)
                                dir[0]*=2
                                dir[2]*=2
                                let c=[dir[2],dir[1],-dir[0]]
                                
                                this.whipWarning.addPos(vec3.add([],this.whipA,c))
                                this.whipWarning.addPos(vec3.sub([],this.whipA,c))
                                this.whipWarning.addPos(vec3.add([],vec3.sub([],this.whipB,c),dir))
                                this.whipWarning.addPos(vec3.add([],vec3.add([],this.whipB,c),dir))
                                this.whipWarning.addPos(vec3.add([],this.whipA,c))

                                for(let i in this.windWhipTrails){

                                    let t=this.windWhipTrails[i]

                                    let y=MATH.random(-0.01,0.01)+0.5,s=MATH.random(-0.5,0.5),l=MATH.random(0.8,1)

                                    t.speed=MATH.random(10,14)

                                    t.pos=vec3.add([],this.whipA,[c[0]*s,y,c[2]*s])
                                    t.target=vec3.add([],vec3.add([],this.whipB,[c[0]*s,y,c[2]*s]),[dir[0]*l,0,dir[2]*l])
                                }
                            }
                        }

                    } else if(this.attackState===undefined){
                        
                        vec2.normalize(d,d)
                        
                        this.pos[0]+=d[0]*dt*6
                        this.pos[2]+=d[1]*dt*6

                        meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,d[0],0,d[1],BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)
                    }

                    if(this.nextAttackTimer<=0){

                        if(!this.skipAttack&&!this.attackState)this.tornados.push({pos:[...this.pos,0],timer:0,timeAtArrival:-1})

                        this.skipAttack=false

                        this.target=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
                        this.attackState=undefined
                        this.nextAttackTimer=Infinity
                    }

                    if(this.attackState===0){

                        this.nextAttackTimer-=dt

                        meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,Math.sin(TIME*8),0,Math.cos(TIME*8),BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)

                    } else if(this.attackState===1){
                        
                        this.nextAttackTimer-=dt

                        meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,player.body.position.x-this.pos[0],player.body.position.y-this.pos[1],player.body.position.z-this.pos[2],BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)
                    }

                    if(this.windWhipTimer>-0.25){

                        this.windWhipTimer-=dt

                        if(this.windWhipTimer<=0.25){

                            for(let i in this.windWhipTrails){

                                let t=this.windWhipTrails[i]

                                vec3.lerp(t.pos,t.pos,t.target,dt*t.speed)

                                t.trail.addPos(t.pos.slice())
                            }
                        }

                        if(this.windWhipTimer<=-0.25){

                            for(let i in this.windWhipTrails){

                                let t=this.windWhipTrails[i]

                                t.trail.addPos([])
                                t.trail.addPos([])
                                t.trail.addPos([])
                                t.trail.addPos([])
                                t.trail.addPos([])
                                t.trail.addPos([])
                                t.trail.addPos([])
                            }

                            let p=MATH.closestPointOnLine(this.whipA,this.whipB,[player.body.position.x,this.pos[1]-1.9,player.body.position.z])

                            let d=vec3.sqrDist(p,[player.body.position.x,this.pos[1]-1.9,player.body.position.z])

                            if(d<4){

                                player.damage(15)
                                let dir=vec3.sub([],this.whipB,this.whipA)
                                vec3.normalize(dir,dir)
                                player.body.position.y+=0.5
                                player.body.velocity.x=dir[0]*50
                                player.body.velocity.y=(4-d)*5+5
                                player.body.velocity.z=dir[2]*50
                                player.removeAirFrictionUntilGrounded=true
                                player.isGliding=false
                                player.grounded=false
                                player.updateGear()
                            }

                            this.whipWarning.addPos([])
                            this.whipWarning.addPos([])
                            this.whipWarning.addPos([])
                            this.whipWarning.addPos([])
                            this.whipWarning.addPos([])
                        }
                    }

                    let m=TIME*2
                    m=m-(m|0)<0.5?'tornado_red':'tornado'

                    gl.bindBuffer(gl.ARRAY_BUFFER,meshes[m].vertBuffer)
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[m].indexBuffer)
                    gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                    gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                    gl.uniform2f(glCache.mob_instanceInfo2,0.6,0.7)

                    for(let i=this.tornados.length;i--;){

                        let s=this.tornados[i]

                        s.timer-=dt
                        s.pos[3]+=dt*15

                        if(!s.rised){

                            if(!s.init){

                                s.y=s.pos[1]-1
                                s.pos[1]-=15
                                s.init=true
                            }

                            s.pos[1]+=(s.y-s.pos[1])*dt*5
                            
                            if(Math.abs(s.y-s.pos[1])<0.1){
                                
                                s.rised=true
                                s.pos[1]=s.y
                            }
                        }

                        if(TIME>s.timeAtArrival){

                            s.target=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]

                            let d=[s.target[0]-s.pos[0],s.target[1]-s.pos[2]],m=vec2.len(d)
                            d[0]*=7/m
                            d[1]*=7/m
                            s.moveDir=d
                            s.timeAtArrival=TIME+(m/7)
                        }

                        s.pos[0]+=s.moveDir[0]*dt
                        s.pos[2]+=s.moveDir[1]*dt

                        if(s.timer<=0){

                            if(Math.abs(player.body.position.x-s.pos[0])+Math.abs(player.body.position.z-s.pos[2])+Math.abs(s.pos[1]-player.body.position.y-1)<2.5){

                                s.timer=0.5
                                player.damage(this.level*0.25+5)
                            }

                            collectPollen({x:Math.round(s.pos[0]-fieldInfo[this.field].x),z:Math.round(s.pos[2]-fieldInfo[this.field].z),field:this.field,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:0.35,multiplier:0.00000000001})
                        }

                        s.pos[1]-=1
                        gl.uniform4fv(glCache.mob_instanceInfo1,s.pos)
                        s.pos[1]+=1
                        gl.drawElements(gl.TRIANGLES,meshes[m].indexAmount,gl.UNSIGNED_SHORT,0)
                    }
                    
                } else {

                    meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,Math.random()-0.5,Math.random()-0.5,Math.random()-0.5,BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)

                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1.25
                textRenderer.addCTX('Wild Windy Bee (Level '+this.level+')',[this.pos[0],this.pos[1]+0.9,this.pos[2]],COLORS.whiteArr,100)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,1.5,...textRenderer.decalUV['rect'],0.61*0.5,0.42*0.5,0.27*0.5,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.timeLimit/this.maxTimeLimit)*0.5)/(this.timeLimit/this.maxTimeLimit),1.5,...textRenderer.decalUV['rect'],0.61,0.42,0.27,this.timeLimit*2.5/this.maxTimeLimit,0.4,0)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
                textRenderer.addSingle('Time: '+MATH.doTime((this.timeLimit|0)+''),this.pos,COLORS.whiteArr,-1,false,false,0,0.6)
                this.pos[1]-=1.25

            break
        }
    }
}

class Mechsquito {
    
    constructor(field,level,isMega){
        
        this.mega=isMega?'megaMechsquito':'mechsquito'
        this.isMega=isMega
        this.field=field
        this.state='attack'
        this.starSawHitTimer=0
        this.level=level
        this.health=(level-1)*750+250

        if(isMega) this.health=this.health*1.5+500

        this.maxHealth=this.health
        this.pos=[fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,fieldInfo[this.field].y+4,fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length]
        this.checkTimer=TIME
        this.flameTimer=0
        this.waitTimer=0
        this.target=[this.pos[0],this.pos[2]]
        this.damageTimer=0
        this.bodySize=1.5
        this.runningAmount=0
        this.mindHacked=0

        this.bullets=[]
        this.bulletTrail1=new TrailRenderer.ConstantTrail({length:2,size:0.1,color:[0,1,0]})
        this.bulletTrail2=new TrailRenderer.ConstantTrail({length:2,size:0.1,color:[0,1,0],vertical:true})
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
        
    }
    
    update(){
        
        switch(this.state){
            
            case 'attack':
                
                if(this.health<=0){
                    
                    player.stats.mechsquito++
                    
                    return true
                }
                
                this.mindHacked-=dt
                this.timeLimit-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                if(player.fieldIn===this.field){
                    
                    player.attacked.push(this)
                }
                
                if(this.mindHacked<=0){

                    let d=[this.target[0]-this.pos[0],this.target[1]-this.pos[2]]

                    if(Math.abs(d[0])+Math.abs(d[1])<0.75){
                        
                        this.target=[fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length]
                        d=[this.target[0]-this.pos[0],this.target[1]-this.pos[2]]

                        this.runningAmount--

                        if(this.runningAmount<=0){
                            
                            this.waitTimer=1
                            this.runningAmount=3

                            let DIS=this,t

                            window.setTimeout(function(){

                                t=[player.body.position.x-DIS.pos[0],player.body.position.y-DIS.pos[1],player.body.position.z-DIS.pos[2]]

                            },450)

                            window.setTimeout(function(){
                                    
                                vec3.normalize(t,t)
                                vec3.scale(t,t,35)

                                if(DIS.isMega){

                                    for(let i=0;i<6;i++){

                                        let _t=[t[0]+MATH.random(-5,5),t[1]+MATH.random(-5,5),t[2]+MATH.random(-5,5)]

                                        DIS.bullets.push({pos:DIS.pos.slice(),vel:_t,life:0.5})
                                        
                                        ParticleRenderer.add({x:DIS.pos[0],y:DIS.pos[1],z:DIS.pos[2],vx:_t[0],vy:_t[1],vz:_t[2],grav:0,size:100,col:[0,1,0],life:0.5,rotVel:MATH.random(-15,15),alpha:1000})
                                    }

                                } else {

                                    DIS.bullets.push({pos:DIS.pos.slice(),vel:t,life:0.5})
                                    
                                    ParticleRenderer.add({x:DIS.pos[0],y:DIS.pos[1],z:DIS.pos[2],vx:t[0],vy:t[1],vz:t[2],grav:0,size:200,col:[0,1,0],life:0.5,rotVel:MATH.random(-15,15),alpha:1000})

                                }

                            },600)
                        }
                    }
                    
                    vec2.normalize(d,d)
                    
                    this.running=false
                    this.waitTimer-=dt
                    
                    if(this.waitTimer<=0){
                        
                        this.pos[0]+=d[0]*dt*6
                        this.pos[2]+=d[1]*dt*6
                        this.running=true
                    }
                    
                    this.damageTimer-=dt
                    
                    if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1]-2.5)+Math.abs(player.body.position.z-this.pos[2])<this.bodySize&&this.damageTimer<=0){
                        
                        player.damage(20)
                        this.damageTimer=1
                    }

                    this.pos[3]=Math.atan2(d[1],d[0])+MATH.HALF_PI+Math.sin(TIME*40)*0.1+(!this.running?TIME*10:0)

                    for(let i in this.bullets){
                    
                        this.bullets[i].life-=dt

                        vec3.scaleAndAdd(this.bullets[i].pos,this.bullets[i].pos,this.bullets[i].vel,dt)

                        if(Math.abs(this.bullets[i].pos[0]-player.body.position.x)+Math.abs(this.bullets[i].pos[1]-player.body.position.y)+Math.abs(this.bullets[i].pos[2]-player.body.position.z)<2){

                            player.damage(7)
                            this.bullets[i].damaged=true
                        }

                        if(this.bullets[i].life<=0||this.bullets[i].damaged) this.bullets.splice(i,1)
                    }

                } else {

                    this.pos[3]=Math.random()*6.2
                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1
                textRenderer.addCTX(MATH.doGrammar(this.mega)+' (Level '+this.level+')',[this.pos[0],this.pos[1]+0.4,this.pos[2]],COLORS.whiteArr,100)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
            
                this.pos[1]-=1
                
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,this.isMega?1.25:0.8,1)
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.mega].vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.mega].indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.drawElements(gl.TRIANGLES,meshes[this.mega].indexAmount,gl.UNSIGNED_SHORT,0)
                
            break
            
        }
        
    }
}

class Cogmower {
    
    constructor(field,level,isGold){
        
        this.gold=isGold?'goldenCogmower':'cogmower'
        this.isGold=isGold
        this.field=field
        this.state='attack'
        this.starSawHitTimer=0
        this.level=level
        this.health=(level-1)*850+1000

        if(isGold) this.health=this.health*1.5+1500

        this.maxHealth=this.health
        this.pos=[fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,fieldInfo[this.field].y+0.75,fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length]

        this.moveDir=[Math.random()-0.5,Math.random()-0.5]
        vec2.normalize(this.moveDir,this.moveDir)
        vec2.scale(this.moveDir,this.moveDir,4)

        this.checkTimer=TIME
        this.flameTimer=0
        this.waitTimer=0
        this.damageTimer=0
        this.bodySize=1.5
        this.mindHacked=0

        let r=1

        this.bounds={
            
            minX:fieldInfo[this.field].x+r-0.5,
            maxX:fieldInfo[this.field].x+fieldInfo[this.field].width-r-0.5,
            minZ:fieldInfo[this.field].z+r-0.5,
            maxZ:fieldInfo[this.field].z+fieldInfo[this.field].length-r-0.5,
        }
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
        
    }
    
    update(){
        
        switch(this.state){
            
            case 'attack':
                
                if(this.health<=0){
                    
                    player.stats.mechsquito++
                    
                    return true
                }
                
                this.mindHacked-=dt
                this.timeLimit-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                if(player.fieldIn===this.field){
                    
                    player.attacked.push(this)
                }
                
                if(this.mindHacked<=0){

                    this.pos[0]+=this.moveDir[0]*dt
                    this.pos[2]+=this.moveDir[1]*dt

                    if(this.pos[0]<=this.bounds.minX){
                        
                        this.pos[0]=this.bounds.minX
                        this.moveDir[0]=-this.moveDir[0]
                    }
                    
                    if(this.pos[0]>=this.bounds.maxX){
                        
                        this.pos[0]=this.bounds.maxX
                        this.moveDir[0]=-this.moveDir[0]
                    }
                    
                    if(this.pos[2]<=this.bounds.minZ){
                        
                        this.pos[2]=this.bounds.minZ
                        this.moveDir[1]=-this.moveDir[1]
                    }
                    
                    if(this.pos[2]>=this.bounds.maxZ){
                        
                        this.pos[2]=this.bounds.maxZ
                        this.moveDir[1]=-this.moveDir[1]
                    }

                    this.damageTimer-=dt

                    if(this.damageTimer<=0){
                        
                        if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<this.bodySize) player.damage(15+(this.level-1))

                        this.damageTimer=0.5

                        collectPollen({x:Math.round(this.pos[0]-fieldInfo[this.field].x),z:Math.round(this.pos[2]-fieldInfo[this.field].z),field:this.field,pattern:[[0,0],[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]],amount:30+this.level,multiplier:0.00000000001})
                    }

                    this.pos[3]=TIME*7

                } else {

                    this.pos[3]=Math.random()*6.2
                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1
                textRenderer.addCTX(MATH.doGrammar(this.gold)+' (Level '+this.level+')',[this.pos[0],this.pos[1]+0.4,this.pos[2]],COLORS.whiteArr,100)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
            
                this.pos[1]-=1
                
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,1,1)
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.gold].vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.gold].indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.drawElements(gl.TRIANGLES,meshes[this.gold].indexAmount,gl.UNSIGNED_SHORT,0)
                
            break
            
        }
        
    }
}

class CogTurret {
    
    constructor(field,level,side){

        this.side=side
        this.field=field
        this.state='attack'
        this.starSawHitTimer=0
        this.level=level
        this.health=(level-1)*750+750
        this.maxHealth=this.health

        switch(this.side){

            case 0:

                this.pos=[fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,fieldInfo[this.field].y+1,fieldInfo[this.field].z-0.5,-MATH.HALF_PI]
                this.constraintAxis=0
                this.constraintRange=[fieldInfo[this.field].x-0.5,fieldInfo[this.field].x+fieldInfo[this.field].width-0.5]

            break

            case 1:

                this.pos=[fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,fieldInfo[this.field].y+1,fieldInfo[this.field].z+fieldInfo[this.field].length-0.5,MATH.HALF_PI]
                this.constraintAxis=0
                this.constraintRange=[fieldInfo[this.field].x-0.5,fieldInfo[this.field].x+fieldInfo[this.field].width-0.5]

            break

            case 2:

                this.pos=[fieldInfo[this.field].x-0.5,fieldInfo[this.field].y+1,fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length,Math.PI]
                this.constraintAxis=2
                this.constraintRange=[fieldInfo[this.field].z-0.5,fieldInfo[this.field].z+fieldInfo[this.field].length-0.5]

            break

            case 3:

                this.pos=[fieldInfo[this.field].x+fieldInfo[this.field].width-0.5,fieldInfo[this.field].y+1,fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length,0]
                this.constraintAxis=2
                this.constraintRange=[fieldInfo[this.field].z,fieldInfo[this.field].z+fieldInfo[this.field].length]

            break
        }
        
        this.checkTimer=TIME
        this.flameTimer=0
        this.waitTimer=0
        this.damageTimer=0
        this.bodySize=1.5
        this.mindHacked=0

        this.cogs=[]
        this.cogFireTimer=2
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
        
    }
    
    update(){
        
        switch(this.state){
            
            case 'attack':
                
                if(this.health<=0){
                    
                    player.stats.mechsquito++
                    
                    return true
                }
                
                this.mindHacked-=dt
                this.timeLimit-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                if(player.fieldIn===this.field){
                    
                    player.attacked.push(this)
                }
                
                if(this.mindHacked<=0){

                    this.cogFireTimer-=dt

                    if(player.fieldIn===this.field){

                        if(this.cogFireTimer<=0){

                            let v=[0,0,0]

                            v[2-this.constraintAxis]=Math.sign(player.body.position[this.constraintAxis?'x':'z']-this.pos[2-this.constraintAxis])*8

                            this.cogs.push({pos:[this.pos[0],this.pos[1]-0.75,this.pos[2],0],vel:v,timer:0,deathY:this.pos[1]-3})

                            this.cogFireTimer=2
                        }

                        this.desiredPos=MATH.constrain(player.body.position[this.constraintAxis?'z':'x'],this.constraintRange[0],this.constraintRange[1])

                        this.pos[this.constraintAxis]+=(this.desiredPos-this.pos[this.constraintAxis])*dt*5
                    }
                    

                    this.damageTimer-=dt

                    if(this.damageTimer<=0&&Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<this.bodySize){
                        
                        player.damage(20+(this.level-1))
                        this.damageTimer=0.5
                    }

                } else {

                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1
                textRenderer.addCTX('Cogturret (Level '+this.level+')',[this.pos[0],this.pos[1]+0.4,this.pos[2]],COLORS.whiteArr,100)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)
            
                this.pos[1]-=1
                
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,1,1)
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cogTurret.vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cogTurret.indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.drawElements(gl.TRIANGLES,meshes.cogTurret.indexAmount,gl.UNSIGNED_SHORT,0)
                
                gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cog.vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cog.indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.uniform2f(glCache.mob_instanceInfo2,0.6,1)

                for(let i=this.cogs.length;i--;){

                    let s=this.cogs[i]

                    s.timer-=dt

                    s.pos[0]+=s.vel[0]*dt
                    s.pos[2]+=s.vel[2]*dt
                    s.pos[3]+=dt*8

                    s.fx=Math.round(s.pos[0]-fieldInfo[this.field].x)
                    s.fz=Math.round(s.pos[2]-fieldInfo[this.field].z)

                    if(s.fx<0||s.fx>=fieldInfo[this.field].width||s.fz<0||s.fz>=fieldInfo[this.field].length){

                        s.pos[1]-=dt*10
                    }

                    if(s._fx!==s.fx||s._fz!==s.fz){

                        collectPollen({x:Math.round(s.pos[0]-fieldInfo[this.field].x),z:Math.round(s.pos[2]-fieldInfo[this.field].z),field:this.field,pattern:[[0,0]],amount:1000,multiplier:0.00000000001})
                    }

                    s._fx=s.fx
                    s._fz=s.fz


                    if(Math.abs(player.body.position.x-s.pos[0])+Math.abs(player.body.position.z-s.pos[2])+Math.abs(s.pos[1]-player.body.position.y)<1.5&&s.timer<=0){

                        s.timer=0.5
                        player.damage(15)
                    }

                    gl.uniform4fv(glCache.mob_instanceInfo1,s.pos)
                    gl.drawElements(gl.TRIANGLES,meshes.cog.indexAmount,gl.UNSIGNED_SHORT,0)

                    if(s.pos[1]<s.deathY){

                        this.cogs.splice(i,1)
                    }
                }
                
            break
            
        }
        
    }
}

class Ant {
    
    constructor(round,x,z,type){

        this.type=type
        this.displayName=MATH.doGrammar(type)
        this.mesh=type
        this.meshScale=0.75
        this.level=((round*MATH.random(0.4,0.6)*0.5)|0)+1
        this.health=((this.level*MATH.random(125,250))|0)+15
        this.movespeed=2
        this.attack=10
        this.bodySize=0.75

        switch(type){

            case 'ant':break
            case 'fireAnt':break
            case 'armyAnt':
                this.health=(this.health*1.5)|0
                this.attack*=2
            break
            case 'flyingAnt':
                this.health=(this.health*0.65)|0
                this.movespeed*=1.5
                this.attack*=1.25
            break
            case 'giantAnt':
                this.health=(this.health*2)|0
                this.movespeed*=0.75
                this.attack*=2
                this.meshScale=1.5
                this.mesh='ant'
                this.bodySize=1
            break
        }

        this.state='spawning'
        this.field='AntField'
        this.starSawHitTimer=0
        this.maxHealth=this.health
        this.spawnPos=[-21,7,-61]
        this.pos=[fieldInfo[this.field].x+((x*fieldInfo[this.field].width)|0),fieldInfo[this.field].y+this.meshScale,fieldInfo[this.field].z+((z*fieldInfo[this.field].length)|0)]
        this.flameTimer=0
        this.waitTimer=0
        this.damageTimer=0

        this.mindHacked=0

        this.dir=[x-0.5,z-0.5]

        this.dir[1]=this.dir[1]===0&&this.dir[0]===0?Math.random()<0.5?-1:1:this.dir[1]

        vec2.normalize(this.dir,this.dir)

        this.bounds={
            
            minX:fieldInfo[this.field].x+1,
            maxX:fieldInfo[this.field].x+fieldInfo[this.field].width-1,
            minZ:fieldInfo[this.field].z+1,
            maxZ:fieldInfo[this.field].z+fieldInfo[this.field].length-1,
        }

        this.fireTrailTimer=0
    }
    
    die(index){
        
        if(player.antChallenge)
            player.antChallenge.score++

        objects.mobs.splice(index,1)
    }
    
    damage(am){
        
        let crit=Math.random()<player.criticalChance,superCrit=Math.random()<player.superCritChance,d=am*(crit?superCrit?player.superCritPower*player.criticalPower:player.criticalPower:1)
        
        if(this.mindHacked>0)
            d*=1.25

        this.health-=d|0
        textRenderer.add((d|0)+'',[this.pos[0],this.pos[1]+Math.random()*2.75+1.5,this.pos[2]],[255,0,0],crit?superCrit?2:1:0,'',[0,1.25,1.275,1.3,1.65,1.75][Math.min(d.toString().length),5])
    }
    
    update(){
        
        switch(this.state){

            case 'spawning':

                this.spawnPos[0]+=(this.pos[0]-this.spawnPos[0])*dt*5
                this.spawnPos[1]+=(this.pos[1]-this.spawnPos[1])*dt*5
                this.spawnPos[2]+=(this.pos[2]-this.spawnPos[2])*dt*5

                if(Math.abs(this.pos[1]-this.spawnPos[1])<0.1){

                    this.state='attack'
                }

                gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.mesh].vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.mesh].indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.uniform2f(glCache.mob_instanceInfo2,this.meshScale,1)
                gl.uniform4fv(glCache.mob_instanceInfo1,[this.spawnPos[0],this.spawnPos[1],this.spawnPos[2],0])
                gl.drawElements(gl.TRIANGLES,meshes[this.mesh].indexAmount,gl.UNSIGNED_SHORT,0)

            break
            
            case 'attack':
                
                if(this.health<=0){
                    
                    player.stats.ant++

                    if(this.type!=='ant')player.stats[this.type]++

                    return true
                }
                
                this.mindHacked-=dt
                this.starSawHitTimer-=dt
                this.flameTimer-=dt
                
                if(this.flameTimer<=0){
                    
                    this.flameTimer=1
                    
                    for(let f in objects.flames){
                        
                        if(Math.abs(this.pos[0]-objects.flames[f].pos[0])+Math.abs(this.pos[2]-objects.flames[f].pos[2])<this.bodySize){
                            
                            this.damage(objects.flames[f].dark?25:15)
                        }
                    }
                }
                
                player.attacked.push(this)
            
                if(this.mindHacked<=0){

                    if(this.type==='fireAnt'){

                        this.fireTrailTimer-=dt

                        if(this.fireTrailTimer<=0){

                            objects.mobs.push(new FireTrail(this.pos.slice()))
                            this.fireTrailTimer=0.75
                        }
                    }
                    
                    if(this.type==='armyAnt'||this.type==='flyingAnt'||this.type==='giantAnt'){

                        this.dir=[player.body.position.x-this.pos[0],player.body.position.z-this.pos[2]]

                        vec2.normalize(this.dir,this.dir)
                    }

                    this.pos[0]+=this.dir[0]*dt*this.movespeed
                    this.pos[2]+=this.dir[1]*dt*this.movespeed

                    this.pos[3]=Math.atan2(this.dir[1],this.dir[0])+MATH.HALF_PI

                    if(this.pos[0]<=this.bounds.minX){
                        
                        this.pos[0]=this.bounds.minX
                        this.dir[0]=-this.dir[0]
                    }
                    
                    if(this.pos[0]>=this.bounds.maxX){
                        
                        this.pos[0]=this.bounds.maxX
                        this.dir[0]=-this.dir[0]
                    }
                    
                    if(this.pos[2]<=this.bounds.minZ){
                        
                        this.pos[2]=this.bounds.minZ
                        this.dir[1]=-this.dir[1]
                    }
                    
                    if(this.pos[2]>=this.bounds.maxZ){
                        
                        this.pos[2]=this.bounds.maxZ
                        this.dir[1]=-this.dir[1]
                    }

                    this.damageTimer-=dt
                    
                    if(Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<this.bodySize*1.5&&this.damageTimer<=0){
                        
                        player.damage(this.attack)
                        this.damageTimer=0.75
                    }

                } else {

                    textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,0.75,0,0,-2,-2,0)
                }
                
                this.pos[1]+=1.25
                textRenderer.addCTX(this.displayName+' (Level '+this.level+')',[this.pos[0],this.pos[1]+0.5,this.pos[2]],COLORS.whiteArr,100)
                
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV['rect'],0.6,0,0,2.5,0.4,0)
                textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],(-0.5+(this.health/this.maxHealth)*0.5)/(this.health/this.maxHealth),0,...textRenderer.decalUV['rect'],0.2,0.85,0.2,this.health*2.5/this.maxHealth,0.4,0)
                
                textRenderer.addSingle('HP: '+MATH.addCommas((this.health|0)+''),this.pos,COLORS.whiteArr,-1,false,false)

                this.pos[1]-=1.25

                gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.mesh].vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.mesh].indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
                gl.uniform2f(glCache.mob_instanceInfo2,this.meshScale,1)
                gl.drawElements(gl.TRIANGLES,meshes[this.mesh].indexAmount,gl.UNSIGNED_SHORT,0)
                
            break
            
        }
        
        return !player.antChallenge
    }
}

class FireTrail {

    constructor(pos){

        this.life=7.5
        this.pos=pos
        this.damageTimer=0
        this.particleTimer=0
    }

    die(index){

        objects.mobs.splice(index,1)
    }

    update(){

        this.life-=dt
        this.damageTimer-=dt
        this.particleTimer-=dt

        if(this.particleTimer<=0){

            this.particleTimer=0.75
            ParticleRenderer.add({x:this.pos[0]+MATH.random(-0.5,0.5),y:this.pos[1],z:this.pos[2]+MATH.random(-0.5,0.5),vx:0,vy:0,vz:0,grav:0,size:200,col:[0.9,0,0],life:2,rotVel:MATH.random(-0.3,0.3),alpha:2})
        }

        if(this.damageTimer<=0&&Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.y-this.pos[1])+Math.abs(player.body.position.z-this.pos[2])<0.75){

            this.damageTimer=1
            player.damage(8)
        }

        return this.life<=0
    }
}

class LawnMower {

    constructor(round){

        this.dir=Math.random()<0.5?-1:1

        this.pos=[-21+this.dir*13,6,-55+(Math.random()<0.3333?-2.5:Math.random()<0.5?1.5:5.5),(this.dir+1)*MATH.HALF_PI]

        this.warning=2
        this.speed=Math.min(12.5+round*0.25,27.5)
    }

    die(index){

        objects.mobs.splice(index,1)
    }

    update(){

        if(this.warning>0){

            this.warning-=dt

            if(((this.warning*this.speed*0.35)|0)%2){

                gl.bindBuffer(gl.ARRAY_BUFFER,meshes.lawnMowerWarning.vertBuffer)
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.lawnMowerWarning.indexBuffer)
                gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
                gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
                gl.uniform2f(glCache.mob_instanceInfo2,1,1)
                gl.uniform4fv(glCache.mob_instanceInfo1,[-21+this.dir*9.4,7.5,this.pos[2],0])
                gl.drawElements(gl.TRIANGLES,meshes.lawnMowerWarning.indexAmount,gl.UNSIGNED_SHORT,0)

            }

        } else {

            if(!this.damaged&&Math.abs(player.body.position.x-this.pos[0])+Math.abs(player.body.position.z-this.pos[2])<1.667){

                this.damaged=true
                player.damage(20)
            }

            this.pos[0]-=this.dir*dt*this.speed

            gl.bindBuffer(gl.ARRAY_BUFFER,meshes.lawnMower.vertBuffer)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.lawnMower.indexBuffer)
            gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
            gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
            gl.uniform2f(glCache.mob_instanceInfo2,1,1)
            gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
            gl.drawElements(gl.TRIANGLES,meshes.lawnMower.indexAmount,gl.UNSIGNED_SHORT,0)
        }

        return this.pos[0]>-21+14||this.pos[0]<-21-14
    }
}

class PopStar {
    
    constructor(pos){
        
        this.size=0.5
        this.life=45
        this.startValue=player.stats.popStar
        this.value=0
        player.popStarSize=0
        player.popStarActive=this
        this.popParticles=[]
        
        player.addEffect('bubbleBloat',60/(60*60))
        player.addEffect('popStarAura')
    }
    
    die(index){
        
        player.popStarSize=0
        player.popStarActive=undefined

        let dir=player.bodyDir.slice(),theta=TIME*2,st=Math.sin(theta)*(this.size+1),ct=Math.cos(theta)*(this.size+1)
        
        dir[0]=dir[0]*st-dir[2]*ct
        dir[2]=player.bodyDir[0]*ct+dir[2]*st
        
        let p=[player.body.position.x+dir[0],player.body.position.y+this.size*2+Math.sin(TIME*3)*this.size-0.5,player.body.position.z+dir[2]]
        
        objects.explosions.push(new Explosion({col:[0,0.5,1],pos:p,life:0.4,size:this.size*1.25,speed:0.25,aftershock:0.05,maxAlpha:0.5}))
        
        objects.explosions.push(new Explosion({col:[0,0.5,1],pos:p,life:0.4,size:this.size*1.5,speed:0.7,aftershock:0.1,maxAlpha:0.3}))
        
        if(player.fieldIn){
            
            for(let i=0,l=this.value*0.1+5;i<l;i++){
                
                objects.bubbles.push(new Bubble(player.fieldIn,(Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0))
                
            }
        }

        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        this.value=player.stats.popStar-this.startValue
        this.size=Math.min(Math.sqrt(this.value)*0.05+0.5,2)
        player.popStarSize=this.value
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.popStar.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.popStar.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        let dir=player.bodyDir.slice(),theta=TIME*2,st=Math.sin(theta)*(this.size+1),ct=Math.cos(theta)*(this.size+1)
        
        dir[0]=dir[0]*st-dir[2]*ct
        dir[2]=player.bodyDir[0]*ct+dir[2]*st
        
        let p=[player.body.position.x+dir[0],player.body.position.y+this.size*2+Math.sin(TIME*3)*this.size-0.5,player.body.position.z+dir[2],-player.playerAngle+Math.PI]

        for(let i in this.popParticles){

            let a=this.popParticles[i]

            vec3.lerp(a,a,p,dt*7+0.075)

            meshes.explosions.instanceData.push(a[0],a[1],a[2],1,1,1,1,0.5,1)

            if(Math.abs(a[0]-p[0])+Math.abs(a[1]-p[1])+Math.abs(a[2]-p[2])<1.75){

                this.popParticles.splice(i,1)
            }
        }

        gl.uniform4fv(glCache.mob_instanceInfo1,p)
        gl.uniform2f(glCache.mob_instanceInfo2,this.size,0.7)
        gl.drawElements(gl.TRIANGLES,meshes.popStar.indexAmount,gl.UNSIGNED_SHORT,0)
        
        p[0]+=player.cameraDir[0]
        p[1]+=player.cameraDir[1]
        p[2]+=player.cameraDir[2]
        p[1]+=0.1
        textRenderer.addSingle(this.value.toString(),p.slice(),COLORS.whiteArr,-2)
        p[1]-=0.3
        textRenderer.addSingle(MATH.doTime(this.life),p,COLORS.whiteArr,-1)
        
        return this.life<=0
    }
}

class ScorchingStar {
    
    constructor(pos){
        
        this.size=0.5
        this.life=45
        this.startValue=player.stats.scorchingStar
        this.value=0
        player.scorchingStarSize=0
        player.addEffect('scorchingStarAura')
        this.particleTimer=0
    }
    
    die(index){
        
        player.scorchingStarSize=0
        let dir=player.bodyDir.slice(),theta=TIME*2+MATH.THIRD_PI*2,st=Math.sin(theta)*(this.size+1),ct=Math.cos(theta)*(this.size+1)
        
        dir[0]=dir[0]*st-dir[2]*ct
        dir[2]=player.bodyDir[0]*ct+dir[2]*st
        
        let p=[player.body.position.x+dir[0],player.body.position.y+this.size*2+Math.sin(TIME*3)*this.size-0.5,player.body.position.z+dir[2]]
        
        objects.explosions.push(new Explosion({col:[0.75,0,0],pos:p,life:0.4,size:this.size*1.25,speed:0.25,aftershock:0.05,maxAlpha:0.5}))
        
        objects.explosions.push(new Explosion({col:[0.75,0,0],pos:p,life:0.4,size:this.size*1.5,speed:0.7,aftershock:0.1,maxAlpha:0.3}))
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        this.value=player.stats.scorchingStar-this.startValue
        this.size=Math.min(Math.sqrt(this.value*0.045)*0.05+0.5,2)
        player.scorchingStarSize=this.value
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.scorchingStar.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.scorchingStar.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        let dir=player.bodyDir.slice(),theta=TIME*2+MATH.THIRD_PI*2,st=Math.sin(theta)*(this.size+1),ct=Math.cos(theta)*(this.size+1)
        
        dir[0]=dir[0]*st-dir[2]*ct
        dir[2]=player.bodyDir[0]*ct+dir[2]*st
        
        let p=[player.body.position.x+dir[0],player.body.position.y+this.size*2+Math.sin(TIME*3)*this.size-0.5,player.body.position.z+dir[2],-player.playerAngle+Math.PI]
        
        this.particleTimer-=dt
        
        if(this.particleTimer<0){
            
            ParticleRenderer.add({x:p[0]+MATH.random(-this.size,this.size),y:p[1]+MATH.random(-this.size,this.size),z:p[2]+MATH.random(-this.size,this.size),vx:0,vy:0,vz:0,grav:0,size:80,col:[1,Math.random()*0.3+0.6,0],life:1,rotVel:0,alpha:2,rot:MATH.HALF_PI})
            this.particleTimer=0.1
        }
        
        gl.uniform4fv(glCache.mob_instanceInfo1,p)
        gl.uniform2f(glCache.mob_instanceInfo2,this.size,1)
        gl.drawElements(gl.TRIANGLES,meshes.scorchingStar.indexAmount,gl.UNSIGNED_SHORT,0)
        
        p[0]+=player.cameraDir[0]
        p[1]+=player.cameraDir[1]
        p[2]+=player.cameraDir[2]
        p[1]+=0.1
        textRenderer.addSingle((this.value|0).toString(),p.slice(),COLORS.whiteArr,-2)
        p[1]-=0.3
        textRenderer.addSingle(MATH.doTime(this.life),p,COLORS.whiteArr,-1)
        
        
        return this.life<=0
    }
}

class GummyStar {
    
    constructor(pos){
        
        this.size=0.5
        this.life=45
        this.startValue=player.stats.goo
        this.value=0
        player.gummyStarSize=0
        player.addEffect('gummyStarAura')
    }
    
    die(index){
        
        player.gummyStarSize=0
        let dir=player.bodyDir.slice(),theta=TIME*2+MATH.THIRD_PI*4,st=Math.sin(theta)*(this.size+1),ct=Math.cos(theta)*(this.size+1)
        
        dir[0]=dir[0]*st-dir[2]*ct
        dir[2]=player.bodyDir[0]*ct+dir[2]*st
        
        let p=[player.body.position.x+dir[0],player.body.position.y+this.size*2+Math.sin(TIME*3)*this.size-0.5,player.body.position.z+dir[2]]
        
        objects.explosions.push(new Explosion({col:[0.1,1,0.5],pos:p,life:0.4,size:this.size*1.25,speed:0.25,aftershock:0.05,maxAlpha:0.5}))
        
        objects.explosions.push(new Explosion({col:[1,0.2,1],pos:p,life:0.4,size:this.size*1.5,speed:0.7,aftershock:0.1,maxAlpha:0.3}))
        
        if(player.fieldIn){
            
            let amountPerToken=Math.ceil(this.value*0.05/20)+1000
            
            for(let i=0,l=20+(this.value.toString().length);i<l;i++){
                
                objects.tokens.push(new LootToken(30,[fieldInfo[player.fieldIn].x+((Math.random()*fieldInfo[player.fieldIn].width)|0),fieldInfo[player.fieldIn].y+1,fieldInfo[player.fieldIn].z+((Math.random()*fieldInfo[player.fieldIn].length)|0)],'honey',amountPerToken,false,'Gummy Star'))
                
            }
        }
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        this.value=(player.stats.goo-this.startValue)
        player.gummyStarSize=this.value
        this.size=Math.min(Math.sqrt(this.value/75000000)*0.055+0.5,2)
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.gummyStar.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.gummyStar.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        let dir=player.bodyDir.slice(),theta=TIME*2+MATH.THIRD_PI*4,st=Math.sin(theta)*(this.size+1),ct=Math.cos(theta)*(this.size+1)
        
        dir[0]=dir[0]*st-dir[2]*ct
        dir[2]=player.bodyDir[0]*ct+dir[2]*st
        
        let p=[player.body.position.x+dir[0],player.body.position.y+this.size*2+Math.sin(TIME*3)*this.size-0.5,player.body.position.z+dir[2],-player.playerAngle+Math.PI]
        
        gl.uniform4fv(glCache.mob_instanceInfo1,p)
        gl.uniform2f(glCache.mob_instanceInfo2,this.size,0.9)
        gl.drawElements(gl.TRIANGLES,meshes.gummyStar.indexAmount,gl.UNSIGNED_SHORT,0)
        
        p[0]+=player.cameraDir[0]
        p[1]+=player.cameraDir[1]
        p[2]+=player.cameraDir[2]
        p[1]+=0.1
        textRenderer.addSingle(this.value.toString(),p.slice(),COLORS.whiteArr,-2)
        p[1]-=0.3
        textRenderer.addSingle(MATH.doTime(this.life),p,COLORS.whiteArr,-1)
        
        return this.life<=0
    }
}

class StarSaw {
    
    constructor(pos){
        
        this.collectTimer=0
        this.lastCollectedAmount=0
        this.life=45
    }
    
    die(index){
        
        let theta=TIME*3,dx=Math.sin(theta)*4,dz=Math.cos(theta)*4
        
        let p=[player.body.position.x+dx,player.body.position.y+0.1,player.body.position.z+dz]
        
        objects.explosions.push(new Explosion({col:[0.9,0.9,0.9],pos:p,life:0.4,size:1,speed:0.25,aftershock:0.05,maxAlpha:0.5,height:0.25}))
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.starSaw.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.starSaw.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        let theta=TIME*3.5,dx=Math.sin(theta)*4,dz=Math.cos(theta)*4
        
        let p=[player.body.position.x+dx,player.body.position.y+0.1,player.body.position.z+dz,TIME*10]
        
        gl.uniform4fv(glCache.mob_instanceInfo1,p)
        gl.uniform2f(glCache.mob_instanceInfo2,0.65,1)
        gl.drawElements(gl.TRIANGLES,meshes.starSaw.indexAmount,gl.UNSIGNED_SHORT,0)
        
        for(let i in objects.bubbles){
            
            let b=objects.bubbles[i]
            
            if(vec3.sqrDist(p,b.pos)<=5){
                
                b.pop()
            }
        }
        
        for(let i in objects.fuzzBombs){
            
            let b=objects.fuzzBombs[i]
            
            if(vec3.sqrDist(p,b.pos)<=4){
                
                b.pop()
            }
        }
        
        for(let i in objects.tokens){
            
            let b=objects.tokens[i]
            
            if(vec3.sqrDist(p,b.pos)<=4&&!(objects.tokens[i] instanceof DupedToken)){
                
                b.collect()
            }
        }
        
        for(let i in objects.mobs){
            
            let b=objects.mobs[i]
            
            if(b.health&&b.state==='attack'&&b.starSawHitTimer<=0&&vec3.sqrDist(p,b.pos)<=6){
                
                b.starSawHitTimer=0.75
                b.damage(player.attackTotal*0.3)
            }
        }
        
        this.collectTimer-=dt
        
        if(this.collectTimer<=0&&player.fieldIn){
            
            this.collectTimer=0.1

            let x=Math.round(p[0]-fieldInfo[player.fieldIn].x),
                z=Math.round(p[2]-fieldInfo[player.fieldIn].z),
                a=Math.min(collectPollen({x:x,z:z,pattern:[[0,0],[-1,0],[1,0],[0,1],[0,-1]],amount:5+0.05*player.attackTotal,stackHeight:0.5,instantConversion:1})*3,player.pollen)

            if(a){
                
                player.pollen-=a
                player.honey+=Math.ceil(a*player.honeyPerPollen)
            }
        }
        
        return this.life<=0
    }
}

class GuidingStar {
    
    constructor(field){
        
        this.guidingstarinstance=true
        this.life=600
        this.field=field
        this.center=[fieldInfo[this.field].x+0.5*fieldInfo[this.field].width,fieldInfo[this.field].y+3,fieldInfo[this.field].z+0.5*fieldInfo[this.field].length]
        this.particleTimer=0
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        if(player.fieldIn===this.field){
            
            player.addEffect('guidingStarAura')
        }
        
        this.life-=dt
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.guidingStar.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.guidingStar.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        let theta=TIME*0.75,st=Math.sin(theta)*fieldInfo[this.field].width*0.4,ct=Math.cos(theta)*fieldInfo[this.field].length*0.4
        
        let p=[this.center[0]+st,this.center[1],this.center[2]+ct,TIME*2]
        
        gl.uniform4fv(glCache.mob_instanceInfo1,p)
        gl.uniform2f(glCache.mob_instanceInfo2,1.5,0.4)
        gl.drawElements(gl.TRIANGLES,meshes.guidingStar.indexAmount,gl.UNSIGNED_SHORT,0)
        
        this.particleTimer-=dt
        
        if(this.particleTimer<=0){
            
            if(Math.random()<0.25)
                
                ParticleRenderer.add({x:p[0]+MATH.random(-2,2),y:p[1]+MATH.random(-0.5,0.5),z:p[2]+MATH.random(-2,2),vx:MATH.random(-0.1,0.1),vy:0,vz:MATH.random(-0.1,0.1),grav:1,size:30,col:[1,0.8,0],life:1.5,rotVel:MATH.random(-3,3),alpha:0.25})
            
            else
                ParticleRenderer.add({x:fieldInfo[this.field].x+Math.random()*fieldInfo[this.field].width,y:fieldInfo[this.field].y+3,z:fieldInfo[this.field].z+Math.random()*fieldInfo[this.field].length,vx:MATH.random(-0.1,0.1),vy:0,vz:MATH.random(-0.1,0.1),grav:1,size:60,col:[1,0.8,0],life:1.5,rotVel:MATH.random(-3,3),alpha:0.5})
            
            this.particleTimer=0.2
        }
        
        return this.life<=0
    }
}

class StarShower {
    
    constructor(field){
        
        this.life=3
        this.field=field
        this.center=[fieldInfo[this.field].x+MATH.random(0.25,0.75)*fieldInfo[this.field].width,fieldInfo[this.field].y+1.5,fieldInfo[this.field].z+MATH.random(0.25,0.75)*fieldInfo[this.field].length]
        this.pos=[player.body.position.x,fieldInfo[this.field].y+1.5,player.body.position.z,10]
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        if(this.life<2.5){
            
            this.pos[0]+=(this.center[0]-this.pos[0])*dt
            this.pos[2]+=(this.center[2]-this.pos[2])*dt
            this.pos[3]*=0.98
        }
        
        if(this.life<1&&!this.startShower){
            
            let t=this
            
            for(let i=0;i<3.5;i+=0.35){
                
                window.setTimeout(function(){objects.mobs.push(new FallingStar(t))},1000*i)
                
            }
            
            this.startShower=true
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.levitatingStarShower.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.levitatingStarShower.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,Math.min((this.life)*3,1)*1.5,Math.min((3-this.life)*0.5,1))
        gl.drawElements(gl.TRIANGLES,meshes.levitatingStarShower.indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.life<=0
    }
}

class FallingStar {
    
    constructor(parent){
        
        this.life=2.25
        this.field=parent.field
        this.land=parent.center.slice()
        
        this.land[0]+=MATH.random(-3,3)
        this.land[1]-=1
        this.land[2]+=MATH.random(-3,3)
        
        this.x=Math.round(this.land[0]-fieldInfo[this.field].x)
        this.z=Math.round(this.land[2]-fieldInfo[this.field].z)
        
        this.pos=[this.land[0]+3,this.land[1]+10,this.land[2]+3]
        this.theta=Math.random()*6.2
        
        this.dir=vec3.sub([],this.pos,this.land)
        vec3.normalize(this.dir,this.dir)
    }
    
    die(index){
        
        collectPollen({x:this.x,z:this.z,pattern:[[0,0],[1,0],[-1,0],[0,-1],[0,1]],amount:{r:30,w:30,b:30},stackHeight:0.465+Math.random()*0.7,field:this.field,instantConversion:1})
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=6){
            
            let amountToConvert=Math.min(player.convertTotal*0.5,player.pollen)
            
            player.pollen-=amountToConvert
            
            if(player.setting_enablePollenText)
                textRenderer.add(Math.ceil(Math.abs(amountToConvert)),[player.body.position.x,player.body.position.y+Math.random()*2+0.5,player.body.position.z],COLORS.honey,0,'+')
            
            player.addEffect('inspire')
        }
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        if(this.life<0.75){
            
            this.life-=dt
            this.pos[3]+=dt*5
            
            vec3.scaleAndAdd(this.pos,this.pos,this.dir,-dt*30)
        }
        
        this.theta+=dt*20
        this.pos[3]=this.theta
        
        meshes.explosions.instanceData.push(this.land[0],this.land[1]+0.1,this.land[2],0,10,0,(2.25-this.life)*3,1.5,0.001)
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.fallingStar.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.fallingStar.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,0.8,1)
        gl.drawElements(gl.TRIANGLES,meshes.fallingStar.indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.life<=0
    }
}

class Wave {
    
    constructor(pos,vel){
        
        let size=player.tidalSurge?3.4:player.tidePower*0.85+0.45
        this.pos=[...pos,Math.atan2(vel[2],vel[0])+Math.PI*0.5]
        this.vel=vel
        this.lifespan=3.5+size*0.25
        this.life=3.5+size*0.25
        this.y=pos[1]
        
        vec3.scale(vel,vel,size+5)
        
        this.size=size
        this.collectTimer=0
        this.balloonsHit=[]
        this.hitBees=[]
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        this.pos[0]+=this.vel[0]*dt
        this.pos[2]+=this.vel[2]*dt
        this.pos[1]=Math.min(this.y,this.y-(this.lifespan-this.life)*this.size)+Math.sin(TIME*12.5)*0.35*this.size
        
        for(let i in objects.bees){
            
            let b=objects.bees[i]
            
            if(this.hitBees.indexOf(i)<0&&Math.abs(b.pos[0]-this.pos[0])+Math.abs(b.pos[1]-this.y)+Math.abs(b.pos[2]-this.pos[2])<1){
                
                objects.explosions.push(new Explosion({col:[0.2,0.5,1],pos:[this.pos[0],this.y,this.pos[2]],life:0.5,size:1.2,speed:0.35,aftershock:0.005}))
                
                this.hitBees.push(i)
                
                let amountToConvert=Math.ceil(Math.min(player.pollen,10000+b.convertAmount*10*player[beeInfo[b.type].color+'ConvertRate']))
                
                player.pollen-=amountToConvert
                player.honey+=Math.ceil(amountToConvert*player.honeyPerPollen)
                
                if(amountToConvert)
                    textRenderer.add(Math.ceil(amountToConvert*player.honeyPerPollen)+'',[b.pos[0],b.pos[1]+0.75,b.pos[2]],COLORS.honey,1,'⇆')
            }
        }
        
        for(let i in objects.bubbles){
            
            let b=objects.bubbles[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=4.5*this.size){
                
                b.pop()
            }
        }
        
        for(let i in objects.fuzzBombs){
            
            let b=objects.fuzzBombs[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=3.5*this.size){
                
                b.pop()
            }
        }
        
        for(let i in objects.tokens){
            
            let b=objects.tokens[i]
            
            if(b.from!=='Balloon'&&vec3.sqrDist(this.pos,b.pos)<=3.5*this.size&&!(objects.tokens[i] instanceof DupedToken)){
                
                b.collect()
            }
        }
        
        if(this.size>=3.25){
            
            for(let i in objects.balloons){
                
                let b=objects.balloons[i]
                
                if(Math.random()<0.3333&&b.state==='float'&&this.balloonsHit.indexOf(b.id)<0&&Math.abs(this.pos[0]-b.pos[0])+Math.abs(this.pos[2]-b.pos[2])<=this.size*0.8){
                    
                    this.balloonsHit.push(b.id)
                    objects.explosions.push(new Explosion({col:[0.1,0.5,1],pos:[this.pos[0],this.y+4,this.pos[2]],life:0.5,size:b.displaySize*1.5,speed:0.4,aftershock:0.01}))
                    
                    let am=Math.round(Math.min(b.pollen,b.cap*0.01))
                    b.pollen-=am
                    
                    let hpt=Math.round(am*(b.golden?1.05:1)/3),off=Math.random()*MATH.TWO_PI
                    
                    if(hpt){
                        
                        for(let i=off;i<MATH.TWO_PI+off;i+=MATH.TWO_PI/3){
                            objects.tokens.push(new LootToken(30,[this.pos[0]+Math.cos(i)*1.5,fieldInfo[b.field].y+1,this.pos[2]+Math.sin(i)*1.5],'honey',hpt,true,'Balloon'))
                        }
                    }
                    
                    player.addEffect('tideBlessing',((b.golden?45:30)/(4*60*60))*2)
                    
                    if(b.pollen<=0){
                        
                        b.die(i,true)
                    }
                }
            }
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.wave.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.wave.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,this.size,0.6)
        gl.drawElements(gl.TRIANGLES,meshes.wave.indexAmount,gl.UNSIGNED_SHORT,0)
        
        this.collectTimer-=dt
        
        if(this.collectTimer<=0&&player.fieldIn){
            
            this.collectTimer=0.35
            
            let x=Math.round(this.pos[0]-fieldInfo[player.fieldIn].x),
                z=Math.round(this.pos[2]-fieldInfo[player.fieldIn].z)
                
            collectPollen({x:x,z:z,pattern:[[0,0],[-1,0],[1,0],[0,1],[0,-1],[-1,-1],[1,1],[-1,1],[1,-1]],amount:{r:this.size*this.life*0.5,w:2*this.size*this.life,b:3*this.size*this.life},yOffset:2.2,stackHeight:0.5+Math.random()*0.85})
            
        }
    
        return this.life<=0
    }
}

class Pulse {
    
    constructor(color){
        
        this.color=color
        this.trail1=new TrailRenderer.Trail({length:15,size:0.55,triangle:true,color:[1,1,1,1]})
        this.trail2=new TrailRenderer.Trail({length:15,size:0.2,triangle:true,color:color==='red'?[1,0,0,1]:[0,0,1,1]})
        this.path=[]
        
        for(let i in objects.bees){
            
            if(['moveToSleep','sleep'].indexOf(objects.bees[i].state)<0&&vec3.sqrDist(objects.bees[i].pos,[player.body.position.x,player.body.position.y,player.body.position.z])<30*30&&beeInfo[objects.bees[i].type].color===color){
                this.path.push(objects.bees[i].pos)
            }
        }
        
        this.path.push(...this.path)
        
        this.t=0
        this.spliceTimer=3
        this.lastPoint=0
    }
    
    die(index){
        
        this.trail1.splice=true
        this.trail2.splice=true
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.t+=dt*20
        
        if(this.spliceTimer<=0){
            
            return true
        }
        
        if(Math.ceil(this.t)>=this.path.length){
            
            this.spliceTimer-=dt
            this.trail1.addPos([])
            this.trail2.addPos([])
            
            return 
        }
        
        let a=this.path[this.t|0],b=this.path[Math.ceil(this.t)],t=this.t-(this.t|0),p=[MATH.lerp(a[0],b[0],t),MATH.lerp(a[1],b[1],t),MATH.lerp(a[2],b[2],t)]
        
        this.trail1.addPos(p)
        this.trail2.addPos(p)
        
        if((this.t|0)!==this.lastPoint&&player.fieldIn){
            
            this.lastPoint=this.t|0
            
            let am=this.lastPoint*0.75+4,x=Math.round(p[0]-fieldInfo[player.fieldIn].x),z=Math.round(p[2]-fieldInfo[player.fieldIn].z)
            
            collectPollen({x:x,z:z,pattern:[[0,0],[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,-2],[0,2],[2,1],[2,-1],[-2,1],[-2,-1],[1,-2],[1,2],[-1,2],[-1,-2],[-3,0],[3,0],[0,-3],[0,3]],amount:am,stackOffset:0.4+Math.random()*(0.3+((am*0.05)-2))})
            
        }
        
    }
}

class Beam {
    
    constructor(params,delay){
        
        this.bee=params.bee
        this.delay=delay
        this.life=0.5
        this.center=[params.x,params.z]
        this.field=params.field
        
        while(1){
            
            let x=Math.round(MATH.random(-7,7))+this.center[0],z=Math.round(MATH.random(-7,7))+this.center[1]
            
            if(x>=0&&x<fieldInfo[this.field].width&&z>=0&&z<fieldInfo[this.field].length&&player.beamStormRayData.indexOf(x.toString()+','+z.toString())<15){
                
                player.beamStormRayData.push(x.toString()+','+z.toString())
                this.x=x
                this.z=z
                break
            }
        }
        
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y,fieldInfo[this.field].z+this.z]
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        if(this.delay>0){
            
            this.delay-=dt
            
            if(this.delay<=0){
                
                collectPollen({x:this.x,z:this.z,pattern:[[0,0]],amount:100000,field:this.field,instantConversion:this.bee.gifted?1:0,depleteAll:true})
                
            }
            
        } else {
            
            this.life-=dt
            
            meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1,1,this.bee.gifted?1:0,1,0.1,10000)
            
            return this.life<=0
        }
        
    }
}

class GummyBall {
    
    constructor(){
        
        this.size=(player.gummyBallSize-1)/1.5
        this.field=player.fieldIn
        this.vel=player.bodyDir.slice()
        vec3.scale(this.vel,this.vel,17.5)
        this.life=this.size*15+0.5
        this.collectTimer=0
        this.rad=this.size*0.35+0.5
        this.pos=[player.body.position.x,fieldInfo[player.fieldIn].y+0.5+this.rad,player.body.position.z,0]
        this.trail=new TrailRenderer.Trail({length:MATH.lerp(20,50,this.size)|0,size:this.rad,triangle:true,color:[1,0.2,1,1],fadeTo:[0.1,1,0.6,0]})
        this.bounds={
            
            minX:fieldInfo[this.field].x+this.rad,
            maxX:fieldInfo[this.field].x+fieldInfo[this.field].width-this.rad,
            minZ:fieldInfo[this.field].z+this.rad,
            maxZ:fieldInfo[this.field].z+fieldInfo[this.field].length-this.rad,
        }
        this.amount=0
    }
    
    die(index){
        
        this.trail.splice=true
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        if(this.pos[0]<=this.bounds.minX){
            
            this.pos[0]=this.bounds.minX
            this.vel[0]=-this.vel[0]
            player.addEffect('gummyBallCombo',false,false,undefined,2)
            this.amount+=2
        }
        
        if(this.pos[0]>=this.bounds.maxX){
            
            this.pos[0]=this.bounds.maxX
            this.vel[0]=-this.vel[0]
            player.addEffect('gummyBallCombo',false,false,undefined,2)
            this.amount+=2
        }
        
        if(this.pos[2]<=this.bounds.minZ){
            
            this.pos[2]=this.bounds.minZ
            this.vel[2]=-this.vel[2]
            player.addEffect('gummyBallCombo',false,false,undefined,2)
            this.amount+=2
        }
        
        if(this.pos[2]>=this.bounds.maxZ){
            
            this.pos[2]=this.bounds.maxZ
            this.vel[2]=-this.vel[2]
            player.addEffect('gummyBallCombo',false,false,undefined,2)
            this.amount+=2
        }
        
        vec3.scaleAndAdd(this.pos,this.pos,this.vel,dt)
        
        for(let i in objects.tokens){
            
            let b=objects.tokens[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=this.rad*this.rad*1.5&&!(objects.tokens[i] instanceof DupedToken)){
                
                b.collect()
                player.addEffect('gummyBallCombo',false,false,undefined,b.type==='honey'?3:1)
                this.amount+=b.type==='honey'?3:1
            }
        }
        
        for(let i in objects.marks){
            
            let b=objects.marks[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=25&&TIME-b.gummyBallHitTimer>1){
                
                b.gummyBallHitTimer=TIME
                player.addEffect('gummyBallCombo',false,false,undefined,b.type==='precise'?30:8)
                this.amount+=b.type==='precise'?30:8
            }
        }
        
        this.trail.addPos([this.pos[0],this.pos[1],this.pos[2]])
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.gummyBall.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.gummyBall.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,this.rad*2,this.life*0.5)
        gl.drawElements(gl.TRIANGLES,meshes.gummyBall.indexAmount,gl.UNSIGNED_SHORT,0)
        
        textRenderer.addSingle('x'+MATH.addCommas(this.amount+''),this.pos,COLORS.whiteArr,-3,true,false)
        
        this.collectTimer-=dt
        
        if(this.collectTimer<=0&&player.fieldIn){
            
            this.collectTimer=0.15
            
            let x=Math.round(this.pos[0]-fieldInfo[player.fieldIn].x),
                z=Math.round(this.pos[2]-fieldInfo[player.fieldIn].z)
            
            collectPollen({x:x,z:z,pattern:[[-2,-1],[-2,0],[-2,1],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[0,-2],[0,-1],[0,0],[0,1],[0,2],[1,-2],[1,-1],[1,0],[1,1],[1,2],[2,-1],[2,0],[2,1]],amount:{r:3,w:10,b:3},stackHeight:0.75,field:this.field,gooTrail:true,multiplier:this.size+1})
            
        }
        
        return this.life<=0
    }
}

class Coconut {
    
    constructor(x=player.flowerIn.x,z=player.flowerIn.z,delay=0){
        
        this.delay=delay
        this.field=player.fieldIn
        this.x=x
        this.z=z
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.51,fieldInfo[this.field].z+this.z]
        this.y=this.pos[1]+25
        this.glow=0
        this.vel=0
        this.displaySize=4.5
    }
    
    die(index){
        
        collectPollen({x:this.x,z:this.z,pattern:[[-2,-1],[-2,0],[-2,1],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[0,-2],[0,-1],[0,0],[0,1],[0,2],[1,-2],[1,-1],[1,0],[1,1],[1,2],[2,-1],[2,0],[2,1]],amount:50,yOffset:2.25,stackHeight:0.75+Math.random()*0.25,field:this.field,multiplier:player.pollenFromCoconuts})
        
        let hpt=Math.ceil(Math.min(player.convertTotal,player.pollen)/5)
        
        if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y,player.body.position.z])<=this.displaySize){

            player.stats.fallingCoconuts++

            if(hpt){

                player.pollen-=Math.ceil(Math.min(player.convertTotal,player.pollen))
                
                for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/5){
                    
                    objects.tokens.push(new LootToken(30,[this.pos[0]+Math.cos(i)*this.displaySize*0.6,fieldInfo[this.field].y+1,this.pos[2]+Math.sin(i)*this.displaySize*0.6],'honey',Math.ceil(hpt),true,'Coconut'))
                }
            }
        }

        let d=this.displaySize+1

        d*=d

        for(let i in objects.mobs){

            if(objects.mobs[i].state==='attack'&&vec3.sqrDist(this.pos,objects.mobs[i].pos)<d){

                objects.mobs[i].damage(2500)
            }
        }
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        if(this.delay>0){
            
            this.delay-=dt
            
            return !player.fieldIn
            
        } else {
            
            this.vel-=dt*20
            this.glow+=dt
            this.y+=this.vel*dt
            
            meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],0,1,0,this.glow,this.displaySize,0.001)
            meshes.explosions.instanceData.push(this.pos[0],this.y,this.pos[2],1,1,1,0.15,-this.displaySize-1,1)
            meshes.explosions.instanceData.push(this.pos[0],this.y,this.pos[2],0.3*player.isNight,0.1*player.isNight,0,1,this.displaySize,1)
            
            return this.y+this.displaySize<this.pos[1]||!player.fieldIn
        }
    }
}

class DrainingDiamond {
    
    constructor(){
        
        this.life=2.5
        this.pos=[player.body.position.x,player.body.position.y,player.body.position.z,0]
        this.y=this.pos[1]+2
        this.r=15
    }
    
    die(index){
        
        let am=Math.ceil(Math.min(Math.sqrt(player.convertRate*player.bluePollen)*player.capacity*0.05,player.pollen))
        
        player.honey+=Math.ceil(am*2*player.honeyPerPollen)
        player.pollen-=am
        
        player.addMessage('+'+MATH.addCommas(Math.ceil(am*2*player.honeyPerPollen)+'')+' Honey (from Diamond Drain)')
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        if(this.life<0.1){
            
            this.pos[1]-=dt*40
            
        } else {
            
            this.pos[1]+=(this.y-this.pos[1])*dt*4
        }
        
        if(this.life>0.7){
            
            this.pos[3]+=(this.r-this.pos[3])*dt*4
            gl.bindBuffer(gl.ARRAY_BUFFER,meshes.drainingDiamond.vertBuffer)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.drainingDiamond.indexBuffer)
            gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
            gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
            gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
            gl.uniform2f(glCache.mob_instanceInfo2,1.6,0.75)
            gl.drawElements(gl.TRIANGLES,meshes.drainingDiamond.indexAmount,gl.UNSIGNED_SHORT,0)
            
        } else {
            
            gl.bindBuffer(gl.ARRAY_BUFFER,meshes.shiningDiamond.vertBuffer)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.shiningDiamond.indexBuffer)
            gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
            gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
            gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
            gl.uniform2f(glCache.mob_instanceInfo2,1.6,1)
            gl.drawElements(gl.TRIANGLES,meshes.shiningDiamond.indexAmount,gl.UNSIGNED_SHORT,0)
        }
        
        
        
        return this.life<=0
    }
}

class Cloud {
    
    constructor(field,x,z,life,windyBee){
        
        this.windyBee=windyBee

        if(windyBee){

            this.trails=[new TrailRenderer.ConstantTrail({length:9,size:0.4,color:[0.5,0.5,0.5,0.6]}),new TrailRenderer.ConstantTrail({length:9,size:0.4,color:[0.5,0.5,0.5,0.6],vertical:true})]
        }

        this.life=life
        this.field=field
        this.x=x
        this.z=z
        this._x=x
        this._z=z
        this.moveTo=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].z+this.z]
        this.moveDir=[0,0]
        this.y=fieldInfo[this.field].y+0.55+4
        this.pos=[fieldInfo[this.field].x+this.x,this.y-10,fieldInfo[this.field].z+this.z]
        
        this.flowers=[]
        this.timer=0
        
        let rad=3,sqRad=2*2
        
        for(let x=-rad;x<=rad;x++){
            
            for(let z=-rad;z<=rad;z++){
                
                if(x*x+z*z<=sqRad){
                    
                    this.flowers.push([x,z])
                }
            }
        }
    }
    
    die(index){
        
        if(this.windyBee){

            this.trails[0].splice=true
            this.trails[1].splice=true
        }

        objects.mobs.splice(index,1)
    }
    
    update(){

        if(this.pos[1]-0.1<this.y){

            this.pos[1]+=(this.y-this.pos[1])*dt*5
        }
        
        this.life-=dt
        
        this.pos[0]+=this.moveDir[0]*dt
        this.pos[2]+=this.moveDir[1]*dt
        
        this.x=Math.round(this.pos[0]-fieldInfo[this.field].x)
        this.z=Math.round(this.pos[2]-fieldInfo[this.field].z)
        
        this.timer-=dt
        
        if(this.timer<=0){
            
            this.timer=0.15
            
            ParticleRenderer.add({x:this.pos[0]+MATH.random(-1.5,1.5),y:this.pos[1]-0.75,z:this.pos[2]+MATH.random(-1.5,1.5),vx:0,vy:-6,vz:0,grav:-7,size:MATH.random(30,60),col:[0.6,0.6,0.7],life:0.75,rotVel:MATH.random(-6,6),alpha:25})
            
            if(player.fieldIn===this.field){
                
                for(let i in this.flowers){
                    
                    let p=this.flowers[i]
                    
                    let _x=this.x+p[0],_z=this.z+p[1]
                    
                    if(_x>=0&&_x<fieldInfo[this.field].width&&_z>=0&&_z<fieldInfo[this.field].length){
                        
                        updateFlower(this.field,_x,_z,function(f){
                            
                            f.height+=0.25
                            
                        },true,false,false)
                    }
                }
            }
            
            if(vec3.sqrDist(this.pos,[player.body.position.x,player.body.position.y+4,player.body.position.z])<=6.25){
                
                player.addEffect('cloudBoost',0.1)

                if(this.windyBee){

                    objects.mobs.push(new WildWindyBee(this.field,this.pos.slice()))
                    this.trails[0].splice=true
                    this.trails[1].splice=true
                    this.windyBee=false
                }
            }
        }
        
        let c=0.7*player.isNight
        
        meshes.explosions.instanceData.push(this.pos[0]-0.45,this.pos[1],this.pos[2],c,c,c,0.8,2.1,0.9)
        meshes.explosions.instanceData.push(this.pos[0]+0.45,this.pos[1],this.pos[2]+0.7,c,c,c,0.8,1.8,0.9)
        meshes.explosions.instanceData.push(this.pos[0]-0.5,this.pos[1],this.pos[2]-0.8,c,c,c,0.8,1.9,0.9)
        meshes.explosions.instanceData.push(this.pos[0]+0.75,this.pos[1],this.pos[2]-0.3,c,c,c,0.8,2.2,0.9)
        
        if(Math.abs(this.pos[0]-this.moveTo[0])+Math.abs(this.pos[2]-this.moveTo[1])<1){
            
            this.flowerTo=this.moveTo.slice()

            this.flowerTo[0]-=fieldInfo[this.field].x
            this.flowerTo[1]-=fieldInfo[this.field].z

            this.moveTo=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
            
            this.moveDir=[this.moveTo[0]-this.pos[0],this.moveTo[1]-this.pos[2]]
            
            vec2.normalize(this.moveDir,this.moveDir)

            if(this.windyBee)vec3.scale(this.moveDir,this.moveDir,1.25)

        }

        if(this.windyBee){

            meshes.bees.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1.5,this.moveDir[0],0,this.moveDir[1],BEE_FLY,beeInfo.windy.u,beeInfo.windy.v,beeInfo.windy.meshPartId)
            
            if(!(frameCount%12)){

                this.trails[0].addPos(this.pos.slice())
                this.trails[1].addPos(this.pos.slice())
            }
        }
        
        return this.life<=0
    }
}

class Tornado {
    
    constructor(beeLevel){
        
        this.life=player.hasteStacks+7.5+beeLevel*0.5
        this.field=player.fieldIn
        this.speed=1+player.hasteStacks*0.25+beeLevel*0.05
        this.x=player.flowerIn.x
        this.z=player.flowerIn.z
        this._x=player.flowerIn.x
        this._z=player.flowerIn.z
        this.moveTo=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].z+this.z]
        this.moveDir=[0,0]
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.5,fieldInfo[this.field].z+this.z]
        
        this.flowers=[]
        this.timer=0
        
        let rad=3,sqRad=2*2
        
        for(let x=-rad;x<=rad;x++){
            
            for(let z=-rad;z<=rad;z++){
                
                if(x*x+z*z<=sqRad){
                    
                    this.flowers.push([x,z])
                }
            }
        }
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        this.pos[0]+=this.moveDir[0]*dt
        this.pos[2]+=this.moveDir[1]*dt
        
        this.x=Math.round(this.pos[0]-fieldInfo[this.field].x)
        this.z=Math.round(this.pos[2]-fieldInfo[this.field].z)
        
        this.timer-=dt
        
        if(this.timer<=0){
            
            this.timer=0.25
            
            collectPollen({x:this.x,z:this.z,pattern:[[-2,-1],[-2,0],[-2,1],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[0,-2],[0,-1],[0,0],[0,1],[0,2],[1,-2],[1,-1],[1,0],[1,1],[1,2],[2,-1],[2,0],[2,1]],amount:7.5,field:this.field})
        }
        
        if(Math.abs(this.pos[0]-this.moveTo[0])+Math.abs(this.pos[2]-this.moveTo[1])<1){
            
            this.moveTo=[fieldInfo[this.field].x+((Math.random()*fieldInfo[this.field].width)|0),fieldInfo[this.field].z+((Math.random()*fieldInfo[this.field].length)|0)]
            
            this.moveDir=[this.moveTo[0]-this.pos[0],this.moveTo[1]-this.pos[2]]
            
            vec2.normalize(this.moveDir,this.moveDir)
            vec2.scale(this.moveDir,this.moveDir,this.speed)
        }
        
        for(let i in objects.tokens){
            
            let b=objects.tokens[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=16&&!(objects.tokens[i] instanceof DupedToken)){
                
                b.collect()
            }
        }
        
        for(let i in objects.bubbles){
            
            let b=objects.bubbles[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=16){
                
                b.pop()
            }
        }
        
        for(let i in objects.fuzzBombs){
            
            let b=objects.fuzzBombs[i]
            
            if(vec3.sqrDist(this.pos,b.pos)<=16){
                
                b.pop()
            }
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.tornado.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.tornado.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        this.pos[3]=TIME*(this.speed+5)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,0.65,0.7)
        gl.drawElements(gl.TRIANGLES,meshes.tornado.indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.life<=0
    }
}

class Planter {
    
    constructor(type){
        
        this.growth=0
        this.maxGrowth={paper:10*60,plastic:13*60,candy:16*60,redClay:20*60,blueClay:20*60,tacky:24*60,pesticide:27*60,petal:30*60,plenty:35*60}[type]
        this.invGrowth=1/this.maxGrowth
        this.height={paper:1.5,plastic:1.175,candy:1.175,redClay:1.175,blueClay:1.175,tacky:1.175,pesticide:1.5,petal:1.175,plenty:2.4}[type]
        this.type=type
        this.field=player.fieldIn
        this.x=player.flowerIn.x
        this.z=player.flowerIn.z
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+0.5,fieldInfo[this.field].z+this.z,0]
        this.hasGrown=false

        this.flowers=[]
        
        let rad=5,sqRad=5.5*5.5
        
        for(let x=-rad;x<=rad;x++){
            
            for(let z=-rad;z<=rad;z++){
                
                if(x*x+z*z<=sqRad&&x+this.x>=0&&x+this.x<fieldInfo[this.field].width&&z+this.z>=0&&z+this.z<fieldInfo[this.field].length){
                    
                    this.flowers.push([x,z])
                }
            }
        }

        let DIS=this

        triggers['harvest_'+this.type+'_planter']={

            minX:this.pos[0]-2,maxX:this.pos[0]+2,minY:this.pos[1]-1,maxY:this.pos[1]+4,minZ:this.pos[2]-2,maxZ:this.pos[2]+2,isMachine:true,message:'Harvest '+MATH.doGrammar(this.type+'Planter')+'<br>(not fully grown)',func:function(player){

                DIS.harvested=true
            }
        }

        this.growthRate=1

        switch(this.type){

            case 'candy':

                if(this.field==='StrawberryField'||this.field==='CoconutField'||this.field==='PineapplePatch'){
                    
                    this.growthRate*=1.25
                }

            break

            case 'redClay':

                if(fieldInfo[this.field].generalColorComp.r>0.5){
                    
                    this.growthRate*=1.25
                }

            break

            case 'blueClay':

                if(fieldInfo[this.field].generalColorComp.b>0.5){
                    
                    this.growthRate*=1.25
                }

            break

            case 'tacky':

                if(this.field==='CoconutField'||this.field==='DandelionField'||this.field==='MushroomField'||this.field==='SunflowerField'||this.field==='BlueFlowerField'){
                    
                    this.growthRate*=1.25
                }

            break

            case 'pesticide':

                if(this.field==='StrawberryField'||this.field==='SpiderField'||this.field==='BambooField'){
                    
                    this.growthRate*=1.35
                }

            break

            case 'petal':

                if(fieldInfo[this.field].generalColorComp.w>0.5){
                    
                    this.growthRate*=1.5
                }

            break

            case 'plenty':

                if(this.field==='PepperPatch'||this.field==='StumpField'||this.field==='CoconutField'||this.field==='MountainTopField'){
                    
                    this.growthRate*=1.5
                }

            break
        }
        
        fieldInfo[this.field].planter=this
    }

    beeSipped(bee){

        this.growth+=bee.gatherAmount*0.025+2
        player.addEffect(fieldInfo[this.field].nectarType,(bee.planterSipTime*4)/(6*60*60))
    }
    
    die(index){

        fieldInfo[this.field].degration=Math.min(fieldInfo[this.field].degration+((this.maxGrowth+(10*60))*0.00027777777),1)
        fieldInfo[this.field].planter=undefined

        triggers['harvest_'+this.type+'_planter'].minY=100000
        triggers['harvest_'+this.type+'_planter'].maxY=100000

        items[this.type+'Planter'].amount++
        player.updateInventory()

        let perc=this.growth/this.maxGrowth,nectarBonus

        switch(this.type){

            case 'paper':

                nectarBonus={comforting:0.75,invigorating:0.75,satisfying:0.75,motivating:0.75,refreshing:0.75}

            break

            case 'plastic':

                nectarBonus={comforting:1,invigorating:1,satisfying:1,motivating:1,refreshing:1}

            break

            case 'candy':

                nectarBonus={comforting:1,invigorating:1,satisfying:1,motivating:1.25,refreshing:1}

            break

            case 'redClay':

                nectarBonus={comforting:1,invigorating:1.25,satisfying:1.25,motivating:1,refreshing:1}

            break

            case 'blueClay':

                nectarBonus={comforting:1.25,invigorating:1,satisfying:1,motivating:1,refreshing:1.25}

            break

            case 'tacky':

                nectarBonus={comforting:1.3,invigorating:1,satisfying:1.3,motivating:1,refreshing:1}

            break

            case 'pesticide':

                nectarBonus={comforting:1,invigorating:1,satisfying:1.35,motivating:1.35,refreshing:1}

            break

            case 'petal':

                nectarBonus={comforting:1.5,invigorating:1,satisfying:1.5,motivating:1,refreshing:1}

            break

            case 'plenty':

                nectarBonus={comforting:1.5,invigorating:1.5,satisfying:1.5,motivating:1.5,refreshing:1.5}

            break
        }

        let seconds=(this.maxGrowth*perc*perc*1.95*nectarBonus[fieldInfo[this.field].nectarType.replace('Nectar','')])

        player.addEffect(fieldInfo[this.field].nectarType,seconds/(6*60*60))

        
        player.stats['hoursOf'+MATH.doGrammar(fieldInfo[this.field].nectarType).replace(' ','')]+=seconds/(60*60)
        
        let amountOfTokens=Math.ceil({paper:9,plastic:13,candy:16,redClay:19,blueClay:19,tacky:22,pesticide:25,petal:27,plenty:30}[this.type]*perc*perc),dropTable=[],dropRates={}

        for(let i in items){

            if(i.toLowerCase().indexOf('egg')>-1||i.toLowerCase().indexOf('pass')>-1||i.toLowerCase().indexOf('drive')>-1||i.toLowerCase().indexOf('vial')>-1)
                continue
            
            dropTable.push(i)
            dropRates[i]=1/items[i].value
        }

        dropTable.splice(dropTable.indexOf('smoothDice'),1)
        dropTable.splice(dropTable.indexOf('loadedDice'),1)
        dropTable.splice(dropTable.indexOf('moonCharm'),1)
        dropTable.splice(dropTable.indexOf('turpentine'),1)

        if(this.field!=='CoconutField'){
                
            dropTable.splice(dropTable.indexOf('coconut'),1)
            dropTable.splice(dropTable.indexOf('tropicalDrink'),1)
        }

        if(this.field==='PineTreeForest'){

            dropRates.whirligig*=45

        } else {

            dropRates.whirligig*=0.25
        }

        if(this.field==='BlueFlowerField'||this.field==='RoseField'||this.field==='SunflowerField'){

            dropRates.honeysuckle*=10

        }

        if(this.field==='SpiderField'||this.field==='CactusField'){
                
            dropRates.stinger*=2.5
            
        } else {

            dropTable.splice(dropTable.indexOf('stinger'),1)
        }

        if(this.field==='StumpField'){
                
            dropTable.splice(dropTable.indexOf('strawberry'),1)
            dropTable.splice(dropTable.indexOf('redExtract'),1)
        }

        if(this.type!=='pesticide'){

            dropTable.splice(dropTable.indexOf('bitterberry'),1)
            dropTable.splice(dropTable.indexOf('neonberry'),1)

        } else {

            dropRates.bitterberry*=28
            dropRates.neonberry*=25
            dropRates.royalJelly*=1.5
            dropRates.stinger*=2
            dropRates.causticWax*=4
        }

        if(this.type==='redClay'){

            dropRates.blueberry*=0.25
            dropRates.blueExtract=0
            dropRates.redExtract*=2.25
            dropRates.strawberry*=2
            dropRates.pineapple*=0.5
            dropRates.sunflowerSeed*=0.5
            dropRates.treat*=0.5
            dropRates.softWax*=2.75
            dropRates.hardWax*=2.15
            dropRates.swirledWax*=1.75
            dropRates.causticWax*=1.75
        }

        if(this.type==='blueClay'){

            dropRates.strawberry*=0.25
            dropRates.redExtract=0
            dropRates.blueExtract*=2.25
            dropRates.blueberry*=2
            dropRates.pineapple*=0.5
            dropRates.sunflowerSeed*=0.5
            dropRates.treat*=0.5
            dropRates.microConverter*=7
            dropRates.honeysuckle*=7
            dropTable.splice(dropTable.indexOf('softWax'),1)
        }

        if(this.type==='candy'){

            dropRates.gumdrops*=40
            dropRates.glue*=30
            dropRates.treat=0
            dropTable.splice(dropTable.indexOf('purplePotion'),1)
            dropTable.splice(dropTable.indexOf('superSmoothie'),1)
        }

        if(this.type==='paper'){

            dropTable.splice(dropTable.indexOf('glitter'),1)
            dropTable.splice(dropTable.indexOf('royalJelly'),1)
            dropTable.splice(dropTable.indexOf('starJelly'),1)
            dropTable.splice(dropTable.indexOf('purplePotion'),1)
            dropTable.splice(dropTable.indexOf('superSmoothie'),1)
            dropTable.splice(dropTable.indexOf('gumdrops'),1)
            dropTable.splice(dropTable.indexOf('glue'),1)

        } else {

            dropRates.blueExtract*=1.5
            dropRates.redExtract*=1.5
            dropRates.glitter*=1.5
            dropRates.royalJelly*=2
            dropRates.starJelly*=0.75
        }

        if(this.type==='tacky'){

            dropRates.sunflowerSeed*=2
            dropRates.oil*=1.5
            dropRates.fieldDice*=2
            dropRates.smoothDice*=1.5
            dropRates.loadedDice*=1.25
            dropTable.push('smoothDice')
            dropTable.push('loadedDice')
        }

        if(this.type==='petal'){

            dropRates.glitter*=4.5
            dropRates.royalJelly*=4
            dropRates.starJelly*=4
            dropRates.gumdrops*=2.5
            dropRates.glue*=3
            dropRates.tropicalDrink*=2
            dropRates.coconut*=1.5
            dropRates.bitterberry*=3
            dropRates.fieldDice*=2
            dropRates.smoothDice*=1.75
            dropRates.loadedDice*=1.5
            dropRates.whirligig*=3
            dropTable.push('bitterberry')
            dropTable.splice(dropTable.indexOf('strawberry'),1)
            dropTable.splice(dropTable.indexOf('blueberry'),1)
            dropTable.splice(dropTable.indexOf('redExtract'),1)
            dropTable.splice(dropTable.indexOf('blueExtract'),1)
            dropTable.push('smoothDice')
            dropTable.push('loadedDice')
            dropTable.push('turpentine')
        }

        if(this.type==='plenty'){

            dropRates.gumdrops*=3
            dropRates.glitter*=3
            dropRates.neonberry*=4
            dropRates.bitterberry*=4
            dropRates.enzymes*=4
            dropRates.oil*=4
            dropRates.redExtract*=4
            dropRates.blueExtract*=4
            dropRates.glue*=3.5
            dropRates.tropicalDrink*=3
            dropRates.royalJelly*=4
            dropRates.starJelly*=6
            dropRates.superSmoothie*=3
            dropRates.purplePotion*=3
            dropRates.coconut*=1.5
            dropRates.softWax*=1.75
            dropRates.hardWax*=1.8
            dropRates.swirledWax*=1.85
            dropRates.causticWax*=1.95
            dropRates.whirligig*=2
            dropTable.push('bitterberry')
            dropTable.push('neonberry')
            dropTable.push('turpentine')
            dropTable.splice(dropTable.indexOf('treat'),1)
            dropTable.splice(dropTable.indexOf('strawberry'),1)
            dropTable.splice(dropTable.indexOf('blueberry'),1)
            dropTable.splice(dropTable.indexOf('sunflowerSeed'),1)
            dropTable.splice(dropTable.indexOf('pineapple'),1)
        }

        dropRates.strawberry*=fieldInfo[this.field].generalColorComp.r*3.5
        dropRates.redExtract*=fieldInfo[this.field].generalColorComp.r*2
        dropRates.pineapple*=fieldInfo[this.field].generalColorComp.w+0.2
        dropRates.enzymes*=fieldInfo[this.field].generalColorComp.b*0.5+0.5
        dropRates.sunflowerSeed*=fieldInfo[this.field].generalColorComp.w+0.2
        dropRates.oil*=fieldInfo[this.field].generalColorComp.r*0.5+0.5
        dropRates.treat*=fieldInfo[this.field].generalColorComp.w<0.5?0.3:2.5
        dropRates.blueberry*=fieldInfo[this.field].generalColorComp.b*3.5
        dropRates.blueExtract*=fieldInfo[this.field].generalColorComp.b*2

        if(this.field==='PineapplePatch'){

            dropRates.pineapple*=10
            dropRates.enzymes*=17
            dropRates.treats*=0.15
        }

        if(this.field==='PepperPatch'){

            dropRates.sunflowerSeed*=10
        }

        if(this.field==='SunflowerField'){

            dropRates.sunflowerSeed*=10
            dropRates.oil*=17
            dropRates.treats*=0.15
        }

        if(this.field==='CoconutField'){

            dropRates.coconut*=20
            dropRates.tropicalDrink*=20
            dropRates.treats*=2
        }

        let totalChance=0

        for(let i in dropTable){

            totalChance+=dropRates[dropTable[i]]
        }

        for(let i in dropRates){

            dropRates[i]/=totalChance
        }
        
        for(let i=0;i<amountOfTokens;i++){

            let c=0,it,r=Math.random()

            for(let j in dropTable){

                if(r<=dropRates[dropTable[j]]+c){

                    it=dropTable[j]
                    break
                }

                c+=dropRates[dropTable[j]]
            }

            let f=this.flowers[(Math.random()*this.flowers.length)|0],DIS=this

            window.setTimeout(function(){

                objects.tokens.push(new LootToken(45,[DIS.pos[0]+f[0],DIS.pos[1]+0.5,DIS.pos[2]+f[1]],it,MATH.random(1,(({paper:5,plastic:6,candy:7,redClay:8,blueClay:8,tacky:9,pesticide:9.5,petal:13,plenty:15}[DIS.type]*(perc*0.5+0.5))/items[it].value)+1)|0,true,'Planter'))

            },225*i)
            
        }
        
        objects.planters.splice(index,1)
    }
    
    update(){
        
        this.growth+=dt*this.growthRate*(1-(fieldInfo[this.field].degration*0.75))

        if(this.growth>this.maxGrowth){

            if(!this.hasGrown){

                this.hasGrown=true
                
                let DIS=this

                triggers['harvest_'+this.type+'_planter']={

                    minX:this.pos[0]-2,maxX:this.pos[0]+2,minY:this.pos[1]-1,maxY:this.pos[1]+4,minZ:this.pos[2]-2,maxZ:this.pos[2]+2,isMachine:true,message:'Harvest '+MATH.doGrammar(this.type+'Planter'),func:function(player){

                        DIS.harvested=true
                    }
                }
            }

            this.growth=this.maxGrowth
        }

        textRenderer.addSingle(MATH.doGrammar(this.type+'Planter')+' ('+(this.growth*this.invGrowth*100).toFixed(1)+' %)',[this.pos[0],this.pos[1]+this.height+this.displaySize+0.5,this.pos[2]],COLORS.whiteArr,-0.6,false)
        
        textRenderer.addDecalRaw(this.pos[0],this.pos[1]+this.height+this.displaySize+0.5,this.pos[2],0,0,...textRenderer.decalUV['rect'],0,0.4,0,2.25,0.35,0)
        
        textRenderer.addDecalRaw(this.pos[0],this.pos[1]+this.height+this.displaySize+0.5,this.pos[2],(-0.5+(this.growth*this.invGrowth)*0.5)/(this.growth*this.invGrowth),0,...textRenderer.decalUV['rect'],0.1,0.85,0.1,this.growth*this.invGrowth*2.25,0.35,0)

        this.displaySize={paper:1,plastic:1.25,candy:1.3,redClay:1.35,blueClay:1.35,tacky:1.4,pesticide:1.5,petal:1.75,plenty:2}[this.type]*this.growth*this.invGrowth+0.3

        meshes.explosions.instanceData.push(this.pos[0],this.pos[1]+this.height+this.displaySize*0.5,this.pos[2],0.54*fieldInfo[this.field].degration*player.isNight,MATH.lerp(0.8,0.46,fieldInfo[this.field].degration)*player.isNight,0,1,this.displaySize,1.03)

        gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.type+'Planter'].vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.type+'Planter'].indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,1,1)
        gl.drawElements(gl.TRIANGLES,meshes[this.type+'Planter'].indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.harvested
    }
}

class Scratch {
    
    constructor(bee,x,z,goldenRake){
        
        this.mesh=goldenRake?'goldenRakeScratch':'scratch'
        this.bee=bee
        this.life=1
        this.field=player.fieldIn
        this.x=x
        this.z=z
        this.pos=[fieldInfo[this.field].x+this.x,fieldInfo[this.field].y+1,fieldInfo[this.field].z+this.z,0]
        this.targetZ=this.pos[2]+(this.mesh==='scratch'?-4:-7)
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        if(this.life<0.8)
            this.pos[2]+=(this.targetZ-this.pos[2])*dt*12.5
        
        if(this.life<=0.35&&!this.collectedPollen){
            
            if(this.mesh==='scratch'){

                collectPollen({x:this.x,z:this.z,field:this.field,pattern:[[-2,0],[-2,1],[-2,-1],[-2,-2],[0,0],[0,1],[0,-1],[0,-2],[2,0],[2,1],[2,-1],[2,-2]],amount:40+this.bee.level*1.5})

            } else {

                collectPollen({x:this.x,z:this.z,field:this.field,pattern:[[-3,-1],[-3,-2],[-3,-3],[-3,-4],[-3,-5],[-3,-6],[-3,-7],[3,-1],[3,-2],[3,-3],[3,-4],[3,-5],[3,-6],[3,-7],[-1,-1],[-1,-2],[-1,-3],[-1,-4],[-1,-5],[-1,-6],[-1,-7],[1,-1],[1,-2],[1,-3],[1,-4],[1,-5],[1,-6],[1,-7]],amount:7})
            }

            this.collectedPollen=true
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.mesh].vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.mesh].indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,0.65,1)
        gl.drawElements(gl.TRIANGLES,meshes[this.mesh].indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.life<=0
    }
}

class DarkScoopingTrail {
    
    constructor(){
        
        this.bodyPos=[player.body.position.x,player.body.position.y,player.body.position.z]
        
        let d=player.bodyDir.slice(),
            r=[-d[2],0,d[0]]
        
        this.startPos=[d[0]*2+r[0]*4,0.05,d[2]*2+r[2]*4]
        this.endPos=[d[0]*2-r[0]*4,0.05,d[2]*2-r[2]*4]
        
        this.control2=vec3.scale([],this.startPos,2)
        this.control1=vec3.scale([],this.endPos,5.25)
        
        this.lifespan=0.3
        this.life=this.lifespan
        this.trail=new TrailRenderer.Trail({length:15,size:0.5,triangle:true,color:[0.8,0,0.8,0.6],fadeTo:[0.5,0,0,0.6]})
        
        this.lastPos=[]
    }
    
    die(index){
        
        this.trail.splice=true
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        if(this.waitTimer>0){
            
            this.waitTimer-=dt
            this.trail.addPos(vec3.add(this.lastPos,this.lastPos,this.lastVel))
            
            return this.waitTimer<=0
        }
        
        this.life-=dt
        
        let p=MATH.generateBezierCurve(this.endPos,this.control1,this.control2,this.startPos,MATH.constrain(this.life*(1/this.lifespan),0,1))
        
        vec3.add(p,p,this.bodyPos)
        
        this.trail.addPos(p)
        
        this.lastVel=vec3.sub([],this.lastPos,p)
        
        this.lastPos=p
        
        if(this.life<=0){
            
            this.waitTimer=0.5
            vec3.scale(this.lastVel,this.lastVel,-0.01)
        }
    }
}

class Spike {
    
    constructor(bee){
        
        this.bee=bee
        this.target=player.attacked.length>0?player.attacked[(Math.random()*player.attacked.length)|0]:false
        this.life=1

        if(this.target){

            this.y=this.target.pos[1]+MATH.random(-4,-1)
            this.pos=[this.target.pos[0]+MATH.random(-1,1),this.y-5,this.target.pos[2]+MATH.random(-1,1),0]
        }
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){

        if(!this.target) return true

        this.life-=dt
        
        if(this.life>0.5){
            
            this.pos[1]+=(this.y-this.pos[1])*dt*22.5

            if(!this.hitTarget&&this.life<0.75){

                this.hitTarget=true

                let d=this.target.health*0.05+((this.bee.attack+player[beeInfo[this.bee.type].color+'BeeAttack'])*player.beeAttack)

                if(d>1000){

                    d=(d-1000)*0.05+1000
                }

                if(!this.target.lastTimeImpaled||TIME-this.target.lastTimeImpaled>5){

                    this.target.impaledSessionCount=0
                }

                d*=1-(Math.min(this.target.impaledSessionCount,20)*0.0375)

                d*=MATH.random(0.740740741,1.35)

                this.target.damage(d)

                this.target.impaledSessionCount++
                this.target.lastTimeImpaled=TIME
            }
            
        } else {
            
            this.pos[1]+=(this.y-10-this.pos[1])*dt*10
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,meshes.spike.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.spike.indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,1,1)
        gl.drawElements(gl.TRIANGLES,meshes.spike.indexAmount,gl.UNSIGNED_SHORT,0)
        
        return this.life<=0
    }
}

class GlitchEffect {
    
    constructor(field,life){
        
        this.life=life
        this.field=field
        this.blocks=[]

        for(let i=0;i<MATH.random(6,10)|0;i++){

            this.blocks.push({pos:[fieldInfo[this.field].x+((MATH.random(0.1,0.9)*fieldInfo[this.field].width)|0),fieldInfo[this.field].y+MATH.random(1,4),fieldInfo[this.field].z+((MATH.random(0.1,0.9)*fieldInfo[this.field].length)|0)],col:[Math.round(Math.random()),Math.round(Math.random()),Math.round(Math.random())],timer:0})
        }
    }
    
    die(index){
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.life-=dt
        
        for(let i in this.blocks){

            let b=this.blocks[i]

            b.timer-=dt

            if(b.timer<=0){

                b.timer=MATH.random(0,1)
                b.timer*=b.timer
                b._pos=[b.pos[0]+MATH.random(-2,2),b.pos[1]+MATH.random(-1,1),b.pos[2]+MATH.random(-2,2)]
                b.alpha=MATH.random(0.2,0.5)
                b.rad=MATH.random(0.5,5)
                b.hei=MATH.random(0.1,1.25)/b.rad
            }

            meshes.cylinder_explosions.instanceData.push(...b._pos,...b.col,b.alpha,b.rad,b.hei)
        }
        
        return this.life<=0
    }
}

class JellyBean {
    
    constructor(field,vel,type){
        
        this.field=field
        this.vel=vel
        this.type=type
        this.y=fieldInfo[this.field].y
        this.pos=[player.body.position.x,this.y+0.5,player.body.position.z]

        switch(this.type.replace('JellyBean','')){

            case 'red':this.col=[0.85,0,0];break
            case 'white':this.col=[0.9,0.9,0.9];break
            case 'blue':this.col=[0,0.5,0.9];break
            case 'pink':this.col=[0.9,0.45,0.9];break
            case 'brown':this.col=[0.3,0.2,0.1];break
            case 'green':this.col=[0,0.5,0];break
            case 'black':this.col=[0.075,0.075,0.075];break
            case 'yellow':this.col=[0.95,0.9,0.1];break
        }
    }
    
    die(index){

        if(this.pos[0]>fieldInfo[this.field].x&&this.pos[0]<fieldInfo[this.field].x+fieldInfo[this.field].width-1&&this.pos[2]>fieldInfo[this.field].z&&this.pos[2]<fieldInfo[this.field].z+fieldInfo[this.field].length-1){

            objects.tokens.push(new Token(effects[this.type].tokenLife,[this.pos[0],this.pos[1]+1.1,this.pos[2]],this.type))
        }
        
        
        objects.mobs.splice(index,1)
    }
    
    update(){
        
        this.vel[1]-=dt*16

        vec3.scaleAndAdd(this.pos,this.pos,this.vel,dt)

        meshes.explosions.instanceData.push(...this.pos,...this.col,1,0.35,1)

        return this.pos[1]<=this.y
    }
}

class Sprout {
    
    constructor(field,type){
        
        this.amount={basic:50000,rare:150000,epic:500000,legendary:1500000,supreme:3000000,gummy:750000,moon:100000}[type]

        this.invAmount=1/this.amount
        this.growth=1

        this.pollenBefore=player.stats['pollenFrom'+field]+this.amount
        this.type=type
        this.field=field
        this.pos=[fieldInfo[this.field].x+fieldInfo[this.field].width*0.5,fieldInfo[this.field].y+0.5,fieldInfo[this.field].z+fieldInfo[this.field].length*0.5,0]
    }
    
    die(index){

        let amountOfTokens={basic:60,rare:75,epic:95,legendary:120,supreme:150,gummy:90,moon:70}[this.type],dropTable=[],dropRates={}

        for(let i in items){

            if(i.toLowerCase().indexOf('egg')>-1||i.toLowerCase().indexOf('pass')>-1||i.toLowerCase().indexOf('drive')>-1||i.toLowerCase().indexOf('dice')>-1||i.toLowerCase().indexOf('wax')>-1||i.toLowerCase().indexOf('vial')>-1)
                continue
            
            dropTable.push(i)
            dropRates[i]=1/items[i].value
        }

        if(this.field!=='CoconutField'){
                
            dropTable.splice(dropTable.indexOf('coconut'),1)
            dropTable.splice(dropTable.indexOf('tropicalDrink'),1)
        }

        dropTable.splice(dropTable.indexOf('stinger'),1)

        if(this.field==='StumpField'){
                
            dropTable.splice(dropTable.indexOf('strawberry'),1)
            dropTable.splice(dropTable.indexOf('redExtract'),1)
        }

        dropTable.splice(dropTable.indexOf('bitterberry'),1)
        dropTable.splice(dropTable.indexOf('neonberry'),1)
        dropTable.splice(dropTable.indexOf('whirligig'),1)
        dropTable.splice(dropTable.indexOf('honeysuckle'),1)
        dropTable.splice(dropTable.indexOf('microConverter'),1)
        dropTable.splice(dropTable.indexOf('jellyBeans'),1)
        dropTable.splice(dropTable.indexOf('purplePotion'),1)
        dropTable.splice(dropTable.indexOf('superSmoothie'),1)

        dropRates.strawberry*=fieldInfo[this.field].generalColorComp.r*3.5
        dropRates.redExtract*=fieldInfo[this.field].generalColorComp.r*2
        dropRates.pineapple*=fieldInfo[this.field].generalColorComp.w+0.2
        dropRates.enzymes*=fieldInfo[this.field].generalColorComp.b*0.5+0.5
        dropRates.sunflowerSeed*=fieldInfo[this.field].generalColorComp.w+0.2
        dropRates.oil*=fieldInfo[this.field].generalColorComp.r*0.5+0.5
        dropRates.treat*=fieldInfo[this.field].generalColorComp.w<0.5?0.3:1
        dropRates.blueberry*=fieldInfo[this.field].generalColorComp.b*3.5
        dropRates.blueExtract*=fieldInfo[this.field].generalColorComp.b*2

        dropRates.royalJelly*=4
        dropRates.ticket*=0.75

        if(this.field==='PineapplePatch'){

            dropRates.pineapple*=6
            dropRates.enzymes*=8
            dropRates.treats*=0.15
        }

        if(this.field==='PepperPatch'){

            dropRates.sunflowerSeed*=6
        }

        if(this.field==='SunflowerField'){

            dropRates.sunflowerSeed*=6
            dropRates.oil*=8
            dropRates.treats*=0.15
        }

        if(this.field==='CoconutField'){

            dropRates.coconut*=7
            dropRates.tropicalDrink*=7
            dropRates.treats*=1.5
        }

        if(this.type==='basic'){

            dropTable.splice(dropTable.indexOf('redExtract'),1)
            dropTable.splice(dropTable.indexOf('blueExtract'),1)
            dropTable.splice(dropTable.indexOf('oil'),1)
            dropTable.splice(dropTable.indexOf('enzymes'),1)
            dropTable.splice(dropTable.indexOf('glitter'),1)
            dropTable.splice(dropTable.indexOf('magicBean'),1)
            dropTable.splice(dropTable.indexOf('tropicalDrink'),1)
        }

        if(this.type==='rare'){

            dropRates.royalJelly*=1.5
            dropRates.redExtract*=3
            dropRates.blueExtract*=3
            dropRates.oil*=2 
            dropRates.enzymes*=2 
            dropRates.magicBean*=1.5       
            dropRates.treats*=0.65

            dropRates.pineapple*=0.85
            dropRates.blueberry*=0.85
            dropRates.strawberry*=0.85
            dropRates.sunflowerSeed*=0.85
        }

        if(this.type==='epic'){

            dropRates.royalJelly*=2
            dropRates.redExtract*=4.5
            dropRates.blueExtract*=4.5
            dropRates.oil*=3.5
            dropRates.enzymes*=3.5 
            dropRates.magicBean*=2.5 
            dropRates.tropicalDrink*=1.5 
            dropRates.glitter*=1.5    
            dropRates.treats*=0.35  

            dropRates.pineapple*=0.65
            dropRates.blueberry*=0.65
            dropRates.strawberry*=0.65
            dropRates.sunflowerSeed*=0.65
        }

        if(this.type==='legendary'){

            dropRates.royalJelly*=2.5
            dropRates.redExtract*=6
            dropRates.blueExtract*=6
            dropRates.oil*=4
            dropRates.enzymes*=4 
            dropRates.magicBean*=2.5 
            dropRates.tropicalDrink*=2  
            dropRates.glitter*=1.75   
            dropRates.treats*=0.25     
              
            dropRates.pineapple*=0.4
            dropRates.blueberry*=0.4
            dropRates.strawberry*=0.4
            dropRates.sunflowerSeed*=0.4
        }

        if(this.type==='supreme'){

            dropRates.royalJelly*=3
            dropRates.redExtract*=6
            dropRates.blueExtract*=6 
            dropRates.oil*=5
            dropRates.enzymes*=5 
            dropRates.magicBean*=3
            dropRates.tropicalDrink*=2.5  
            dropRates.glitter*=2
            dropRates.treats*=0.15 

            dropRates.pineapple*=0.25
            dropRates.blueberry*=0.25
            dropRates.strawberry*=0.25
            dropRates.sunflowerSeed*=0.25
        }

        if(this.type==='gummy'){

            dropTable=['gumdrops','glue']
            dropRates.glue=8
            dropRates.gumdrops=1

        } else {

            dropTable.splice(dropTable.indexOf('gumdrops'),1)
            dropTable.splice(dropTable.indexOf('glue'),1)
        }

        if(this.type==='moon'){

            dropTable=['treat','moonCharm']
            dropRates.moonCharm=4
            dropRates.treat=1

        } else {

            dropTable.splice(dropTable.indexOf('moonCharm'),1)
        }

        let totalChance=0

        for(let i in dropTable){

            totalChance+=dropRates[dropTable[i]]
        }

        for(let i in dropRates){

            dropRates[i]/=totalChance
        }
        
        for(let i=0;i<amountOfTokens;i++){

            let c=0,it,r=Math.random()

            for(let j in dropTable){

                if(r<=dropRates[dropTable[j]]+c){

                    it=dropTable[j]
                    break
                }

                c+=dropRates[dropTable[j]]
            }

            let DIS=this

            window.setTimeout(function(){

                objects.tokens.push(new LootToken(10,[fieldInfo[DIS.field].x+((fieldInfo[DIS.field].width*Math.random())|0),fieldInfo[DIS.field].y+1,fieldInfo[DIS.field].z+((fieldInfo[DIS.field].length*Math.random())|0),0],it,1,false,'Sprout'))

            },200*i)
            
        }
        
        objects.explosions.push(new Explosion({col:[1,1,0.6],pos:this.pos,life:1,size:10,speed:0.1,aftershock:0.05,maxAlpha:1,primitive:'cylinder_explosions',height:500}))

        objects.mobs.splice(index,1)
    }
    
    update(){

        let pollen=Math.max(this.pollenBefore-player.stats['pollenFrom'+this.field],0)

        this.growth+=((pollen*this.invAmount)-this.growth)*dt*15

        textRenderer.addSingle(MATH.addCommas(pollen+''),[this.pos[0],this.pos[1]+4,this.pos[2]],COLORS.whiteArr,-3.5,false)
        
        meshes.cylinder_explosions.instanceData.push(this.pos[0],this.pos[1],this.pos[2],1,1,0.6,0.15,5,500)

        gl.bindBuffer(gl.ARRAY_BUFFER,meshes[this.type+'Sprout'].vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes[this.type+'Sprout'].indexBuffer)
        gl.vertexAttribPointer(glCache.mob_vertPos,3,gl.FLOAT,gl.FLASE,24,0)
        gl.vertexAttribPointer(glCache.mob_vertColor,3,gl.FLOAT,gl.FLASE,24,12)
        gl.uniform4fv(glCache.mob_instanceInfo1,this.pos)
        gl.uniform2f(glCache.mob_instanceInfo2,0.6+(1-this.growth)*1.6,1)
        gl.drawElements(gl.TRIANGLES,meshes[this.type+'Sprout'].indexAmount,gl.UNSIGNED_SHORT,0)
        
        return pollen<=0
    }
}

let lightDir=[1,5,1.5]

let m=1/(lightDir[0]*lightDir[0]+lightDir[1]*lightDir[1]+lightDir[2]*lightDir[2])

lightDir[0]*=m
lightDir[1]*=m
lightDir[2]*=m

let hash = (function() {
		let seed = Math.random() * 2100000000 | 0
		let PRIME32_2 = 1883677709
		let PRIME32_3 = 2034071983
		let PRIME32_4 = 668265263
		let PRIME32_5 = 374761393

		seedHash = function(s) {
			seed = s | 0
		}

		return function(x, y) {
			let h32 = 0

			h32 = seed + PRIME32_5 | 0
			h32 += 8

			h32 += Math.imul(x, PRIME32_3)
			h32 = Math.imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)
			h32 += Math.imul(y, PRIME32_3)
			h32 = Math.imul(h32 << 17 | h32 >> 32 - 17, PRIME32_4)

			h32 ^= h32 >> 15
			h32 *= PRIME32_2
			h32 ^= h32 >> 13
			h32 *= PRIME32_3
			h32 ^= h32 >> 16

			return h32 / 2147483647
		}
	})()

let currentRandom = null
function Marsaglia(i1, i2) {
// from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
	let z = (i1 | 0) || 362436069, w = i2 || hash(521288629, z) * 2147483647 | 0

	let nextInt = function() {
		z=36969*(z&65535)+(z>>>16) & 0xFFFFFFFF
		w=18000*(w&65535)+(w>>>16) & 0xFFFFFFFF
		return ((z&0xFFFF)<<16 | w&0xFFFF) & 0xFFFFFFFF
	}

	this.nextDouble = function() {
		let i = nextInt() / 4294967296
		return i < 0 ? 1 + i : i
	}
	this.nextInt = nextInt
}
let randomSeed = function(seed) {
	currentRandom = (new Marsaglia(seed)).nextDouble
}
let random = function(min, max) {
	if (!max) {
		if (min) {
			max = min
			min = 0
		} else {
			min = 0
			max = 1
		}
	}
	return currentRandom() * (max - min) + min
}
let noiseProfile = { generator: undefined, octaves: 4, fallout: 0.5, seed: undefined }
function PerlinNoise(seed) {
	let rnd = seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized()
	let i, j
	// http://www.noisemachine.com/talk1/17b.html
	// http://mrl.nyu.edu/~perlin/noise/
	// generate permutation
	let perm = new Uint8Array(512)
	for(i=0;i<256;++i) {
		perm[i] = i
	}
	for(i=0;i<256;++i) {
		let t = perm[j = rnd.nextInt() & 0xFF]; perm[j] = perm[i]; perm[i] = t
	}
	// copy to avoid taking mod in perm[0]
	for(i=0;i<256;++i) {
		perm[i + 256] = perm[i]
	}

	function grad3d(i,x,y,z) {
		let h = i & 15; // convert into 12 gradient directions
		let u = h<8 ? x : y,
			v = h<4 ? y : h===12||h===14 ? x : z
		return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v)
	}

	function grad2d(i,x,y) {
		let v = (i & 1) === 0 ? x : y
		return (i&2) === 0 ? -v : v
	}

	function grad1d(i,x) {
		return (i&1) === 0 ? -x : x
	}

	function lerp(t,a,b) {
		return a + t * (b - a)
	}

	this.noise3d = function(x, y, z) {
		let X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255
		x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z)
		let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z
		let p0 = perm[X]+Y, p00 = perm[p0] + Z, p01 = perm[p0 + 1] + Z,
			p1 = perm[X + 1] + Y, p10 = perm[p1] + Z, p11 = perm[p1 + 1] + Z
		return lerp(fz,
			lerp(fy, lerp(fx, grad3d(perm[p00], x, y, z), grad3d(perm[p10], x-1, y, z)),
				lerp(fx, grad3d(perm[p01], x, y-1, z), grad3d(perm[p11], x-1, y-1,z))),
			lerp(fy, lerp(fx, grad3d(perm[p00 + 1], x, y, z-1), grad3d(perm[p10 + 1], x-1, y, z-1)),
				lerp(fx, grad3d(perm[p01 + 1], x, y-1, z-1), grad3d(perm[p11 + 1], x-1, y-1,z-1))))
	}

	this.noise2d = function(x, y) {
		let X = Math.floor(x)&255, Y = Math.floor(y)&255
		x -= Math.floor(x); y -= Math.floor(y)
		let fx = (3-2*x)*x*x, fy = (3-2*y)*y*y
		let p0 = perm[X]+Y, p1 = perm[X + 1] + Y
		return lerp(fy,
			lerp(fx, grad2d(perm[p0], x, y), grad2d(perm[p1], x-1, y)),
			lerp(fx, grad2d(perm[p0 + 1], x, y-1), grad2d(perm[p1 + 1], x-1, y-1)))
	}

	this.noise1d = function(x) {
		let X = Math.floor(x)&255
		x -= Math.floor(x)
		let fx = (3-2*x)*x*x
		return lerp(fx, grad1d(perm[X], x), grad1d(perm[X+1], x-1))
	}
}
let noiseSeed = function(seed) {
	noiseProfile.seed = seed
	noiseProfile.generator = new PerlinNoise(noiseProfile.seed)
}

noiseSeed(0)

let noise = function(x, y, z) {
	let generator = noiseProfile.generator
	let effect = 1, k = 1, sum = 0
	for(let i = 0; i < noiseProfile.octaves; ++i) {
		effect *= noiseProfile.fallout
		switch (arguments.length) {
			case 1:
				sum += effect * (1 + generator.noise1d(k*x))/2; break
			case 2:
				sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break
			case 3:
				sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break
		}
		k *= 2
	}
	return sum
}

function createProgram(vsh,fsh){
    
    let vshText=window['glsl_'+vsh].trim().replaceAll('INV_AVG_HALF_WIDTH_HEIGHT',2/((width+height)*0.5)).replaceAll('INV_HALF_WIDTH',1/(width*0.5)).replaceAll('INV_HALF_HEIGHT',1/(height*0.5)).replaceAll('INV_WIDTH',1/width).replaceAll('INV_HEIGHT',1/height).replaceAll('HALF_WIDTH',width*0.5+0.0000001).replaceAll('HALF_HEIGHT',height*0.5+0.0000001).replaceAll('INV_ASPECT',1/(aspect)+0.00001).replaceAll('ASPECT',aspect+0.000001).replaceAll('SCREEN_CHANGE',(((width+height)*0.5)/600)+0.00001)
    let fshText=window['glsl_'+fsh].trim().replaceAll('LIGHT_DIR','vec3('+lightDir[0]+','+lightDir[1]+','+lightDir[2]+')').replaceAll('INV_AVG_HALF_WIDTH_HEIGHT',2/((width+height)*0.5)).replaceAll('INV_HALF_WIDTH',1/(width*0.5)).replaceAll('INV_HALF_HEIGHT',1/(height*0.5)).replaceAll('INV_WIDTH',1/width).replaceAll('INV_HEIGHT',1/height).replaceAll('HALF_WIDTH',width*0.5+0.0000001).replaceAll('HALF_HEIGHT',height*0.5+0.0000001).replaceAll('INV_ASPECT',1/(aspect)+0.00001).replaceAll('ASPECT',aspect+0.00001).replaceAll('SCREEN_CHANGE',(((width+height)*0.5)/600)+0.00001)
    
    vsh=gl.createShader(gl.VERTEX_SHADER)
    fsh=gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(vsh,vshText)
    gl.shaderSource(fsh,fshText)
    gl.compileShader(vsh)
    gl.compileShader(fsh)
    
    let p=gl.createProgram()
    gl.attachShader(p,vsh)
    gl.attachShader(p,fsh)
    gl.linkProgram(p)
    
    return p
}

let staticGeometryProgram=createProgram('static_geometry_vsh','static_geometry_fsh'),
    dynamicGeometryProgram=createProgram('dynamic_geometry_vsh','dynamic_geometry_fsh'),
    tokenGeometryProgram=createProgram('token_geometry_vsh','token_geometry_fsh'),
    flowerGeometryProgram=createProgram('flower_geometry_vsh','flower_geometry_fsh'),
    beeGeometryProgram=createProgram('bee_geometry_vsh','bee_geometry_fsh'),
    particleRendererProgram=createProgram('particle_renderer_vsh','particle_renderer_fsh'),
    explosionRendererProgram=createProgram('explosion_renderer_vsh','explosion_renderer_fsh'),
    textRendererProgram=createProgram('text_renderer_vsh','text_renderer_fsh'),
    mobRendererProgram=createProgram('mob_renderer_vsh','mob_renderer_fsh'),
    trailRendererProgram=createProgram('trail_renderer_vsh','trail_renderer_fsh')

let initGlCache=function(glCache){
    
    glCache.static_viewMatrix=gl.getUniformLocation(staticGeometryProgram,'viewMatrix')
    glCache.static_isNight=gl.getUniformLocation(staticGeometryProgram,'isNight')
    glCache.static_vertPos=gl.getAttribLocation(staticGeometryProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.static_vertPos)
    glCache.static_vertColor=gl.getAttribLocation(staticGeometryProgram,'vertColor')
    gl.enableVertexAttribArray(glCache.static_vertColor)
    glCache.static_vertUV=gl.getAttribLocation(staticGeometryProgram,'vertUV')
    gl.enableVertexAttribArray(glCache.static_vertUV)
    
    glCache.dynamic_viewMatrix=gl.getUniformLocation(dynamicGeometryProgram,'viewMatrix')
    glCache.dynamic_modelMatrix=gl.getUniformLocation(dynamicGeometryProgram,'modelMatrix')
    glCache.dynamic_isNight=gl.getUniformLocation(dynamicGeometryProgram,'isNight')
    glCache.dynamic_vertPos=gl.getAttribLocation(dynamicGeometryProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.dynamic_vertPos)
    glCache.dynamic_vertColor=gl.getAttribLocation(dynamicGeometryProgram,'vertColor')
    gl.enableVertexAttribArray(glCache.dynamic_vertColor)
    glCache.dynamic_vertNormal=gl.getAttribLocation(dynamicGeometryProgram,'vertNormal')
    gl.enableVertexAttribArray(glCache.dynamic_vertNormal)
    
    glCache.token_viewMatrix=gl.getUniformLocation(tokenGeometryProgram,'viewMatrix')
    glCache.token_isNight=gl.getUniformLocation(tokenGeometryProgram,'isNight')
    glCache.token_vertPos=gl.getAttribLocation(tokenGeometryProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.token_vertPos)
    glCache.token_vertUV=gl.getAttribLocation(tokenGeometryProgram,'vertUV')
    gl.enableVertexAttribArray(glCache.token_vertUV)
    glCache.token_instancePos=gl.getAttribLocation(tokenGeometryProgram,'instance_pos')
    gl.enableVertexAttribArray(glCache.token_instancePos)
    glCache.token_instanceUV=gl.getAttribLocation(tokenGeometryProgram,'instance_uv')
    gl.enableVertexAttribArray(glCache.token_instanceUV)
    
    glCache.flower_viewMatrix=gl.getUniformLocation(flowerGeometryProgram,'viewMatrix')
    glCache.flower_isNight=gl.getUniformLocation(flowerGeometryProgram,'isNight')
    glCache.flower_vertPos=gl.getAttribLocation(flowerGeometryProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.flower_vertPos)
    glCache.flower_vertUV=gl.getAttribLocation(flowerGeometryProgram,'vertUV')
    gl.enableVertexAttribArray(glCache.flower_vertUV)
    glCache.flower_vertGoo=gl.getAttribLocation(flowerGeometryProgram,'vertGoo')
    gl.enableVertexAttribArray(glCache.flower_vertGoo)
    
    glCache.bee_viewMatrix=gl.getUniformLocation(beeGeometryProgram,'viewMatrix')
    glCache.bee_isNight=gl.getUniformLocation(beeGeometryProgram,'isNight')
    glCache.bee_vertPos=gl.getAttribLocation(beeGeometryProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.bee_vertPos)
    glCache.bee_vertUV=gl.getAttribLocation(beeGeometryProgram,'vertUV')
    gl.enableVertexAttribArray(glCache.bee_vertUV)
    glCache.bee_instancePos=gl.getAttribLocation(beeGeometryProgram,'instance_pos')
    gl.enableVertexAttribArray(glCache.bee_instancePos)
    glCache.bee_instanceRotation=gl.getAttribLocation(beeGeometryProgram,'instance_rotation')
    gl.enableVertexAttribArray(glCache.bee_instanceRotation)
    glCache.bee_instanceUV=gl.getAttribLocation(beeGeometryProgram,'instance_uv')
    gl.enableVertexAttribArray(glCache.bee_instanceUV)
    
    glCache.particle_vertPos=gl.getAttribLocation(particleRendererProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.particle_vertPos)
    glCache.particle_vertColor=gl.getAttribLocation(particleRendererProgram,'vertColor')
    gl.enableVertexAttribArray(glCache.particle_vertColor)
    glCache.particle_vertSize=gl.getAttribLocation(particleRendererProgram,'vertSize')
    gl.enableVertexAttribArray(glCache.particle_vertSize)
    glCache.particle_vertRot=gl.getAttribLocation(particleRendererProgram,'vertRot')
    gl.enableVertexAttribArray(glCache.particle_vertRot)
    glCache.particle_viewMatrix=gl.getUniformLocation(particleRendererProgram,'viewMatrix')
    
    glCache.explosion_vertPos=gl.getAttribLocation(explosionRendererProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.explosion_vertPos)
    glCache.explosion_instancePos=gl.getAttribLocation(explosionRendererProgram,'instance_pos')
    gl.enableVertexAttribArray(glCache.explosion_instancePos)
    glCache.explosion_instanceColor=gl.getAttribLocation(explosionRendererProgram,'instance_color')
    gl.enableVertexAttribArray(glCache.explosion_instanceColor)
    glCache.explosion_instanceScale=gl.getAttribLocation(explosionRendererProgram,'instance_scale')
    gl.enableVertexAttribArray(glCache.explosion_instanceScale)
    glCache.explosion_viewMatrix=gl.getUniformLocation(explosionRendererProgram,'viewMatrix')
    
    glCache.text_vertPos=gl.getAttribLocation(textRendererProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.text_vertPos)
    glCache.text_vertUV=gl.getAttribLocation(textRendererProgram,'vertUV')
    gl.enableVertexAttribArray(glCache.text_vertUV)
    glCache.text_instanceOrigin=gl.getAttribLocation(textRendererProgram,'instance_origin')
    gl.enableVertexAttribArray(glCache.text_instanceOrigin)
    glCache.text_instanceOffset=gl.getAttribLocation(textRendererProgram,'instance_offset')
    gl.enableVertexAttribArray(glCache.text_instanceOffset)
    glCache.text_instanceUV=gl.getAttribLocation(textRendererProgram,'instance_uv')
    gl.enableVertexAttribArray(glCache.text_instanceUV)
    glCache.text_instanceColor=gl.getAttribLocation(textRendererProgram,'instance_color')
    gl.enableVertexAttribArray(glCache.text_instanceColor)
    glCache.text_instanceInfo=gl.getAttribLocation(textRendererProgram,'instance_info')
    gl.enableVertexAttribArray(glCache.text_instanceInfo)
    glCache.text_viewMatrix=gl.getUniformLocation(textRendererProgram,'viewMatrix')
    
    glCache.mob_viewMatrix=gl.getUniformLocation(mobRendererProgram,'viewMatrix')
    glCache.mob_isNight=gl.getUniformLocation(mobRendererProgram,'isNight')
    glCache.mob_vertPos=gl.getAttribLocation(mobRendererProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.mob_vertPos)
    glCache.mob_vertColor=gl.getAttribLocation(mobRendererProgram,'vertColor')
    gl.enableVertexAttribArray(glCache.mob_vertColor)
    glCache.mob_instanceInfo1=gl.getUniformLocation(mobRendererProgram,'instance_info1')
    glCache.mob_instanceInfo2=gl.getUniformLocation(mobRendererProgram,'instance_info2')
    
    glCache.trail_viewMatrix=gl.getUniformLocation(trailRendererProgram,'viewMatrix')
    glCache.trail_vertPos=gl.getAttribLocation(trailRendererProgram,'vertPos')
    gl.enableVertexAttribArray(glCache.trail_vertPos)
    glCache.trail_vertColor=gl.getAttribLocation(trailRendererProgram,'vertCol')
    gl.enableVertexAttribArray(glCache.trail_vertColor)
    glCache.trail_isNight=gl.getUniformLocation(trailRendererProgram,'isNight')
    
    return glCache
    
}

let glCache=initGlCache({}),globalMeshID=0

class Mesh {
    
    constructor(isStatic=true,verts,index){
        
        this.isStatic=isStatic
        this.setMesh(verts||[],index||[])
        this.meshGlobalID=globalMeshID++
        this.matrix=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
        this.ogMatrix=this.matrix.slice()
    }
    
    setMesh(verts,index){
        
        this.mesh={
            
            data:{
                verts:new Float32Array(verts),
                index:new Uint16Array(index)
            },
            buffers:{
                verts:gl.createBuffer(),
                index:gl.createBuffer()
            },
            
            indexAmount:index.length,
        }
    }
    
    setMeshFromFunction(func){
        
        let verts=[],index=[],addBox,addHiveSlot,addCylinder,addSphere,applyFinalRotation,addGiftedRing,addStar,addLimbBox,addLimbCylinder,DIS=this
        
        if(this.isStatic){
            
            for(let i in world.bodies){
                
                if(world.bodies[i].collisionFilterGroup===STATIC_PHYSICS_GROUP&&world.bodies[i].parentMeshGlobalID===this.meshGlobalID){
                    world.removeBody(world.bodies[i])
                }
            }
            
            addBox=function(x,y,z,w,h,l,rot,col,physics=true,textures=true,mesh=true){
                
                rot=rot||[0,0,0]
                
                let rotation=quat.fromEuler([],rot[0],rot[1],rot[2])
                let model=mat4.fromRotationTranslation([],rotation,[x,y,z,1]),a=col[3]||1
                
                col[0]*=1.2
                col[1]*=1.2
                col[2]*=1.2
                
                if(physics){
                    
                    let B=new CANNON.Body({
                        
                        shape:new CANNON.Box(new CANNON.Vec3(w*0.5,h*0.5,l*0.5)),
                        mass:0,
                        position:new CANNON.Vec3(x,y,z),
                        quaternion:new CANNON.Quaternion(...rotation),
                        collisionFilterGroup:STATIC_PHYSICS_GROUP,
                        collisionFilterMask:PLAYER_PHYSICS_GROUP,
                        
                    })
                    
                    B.parentMeshGlobalID=DIS.meshGlobalID
                    world.addBody(B)
                }
                
                let v=[
                    
                    [-0.5*w,0.5*h,-0.5*l],
                    [-0.5*w,0.5*h,0.5*l],
                    [0.5*w,0.5*h,0.5*l],
                    [0.5*w,0.5*h,-0.5*l],
                    [-0.5*w,-0.5*h,-0.5*l],
                    [-0.5*w,-0.5*h,0.5*l],
                    [0.5*w,-0.5*h,0.5*l],
                    [0.5*w,-0.5*h,-0.5*l],
                ]
                
                let shade=[]
                
                let normals=[
                    
                    [0,1,0],
                    [0,0,1],
                    [0,0,-1],
                    [1,0,0],
                    [-1,0,0],
                    [0,-1,0],
                ]
                
                for(let i=0,_l=v.length;i<_l;i++){
                    
                    vec3.transformMat4(v[i],v[i],model)
                    
                    if(i<6){
                        
                        vec3.transformQuat(normals[i],normals[i],rotation)
                        let n=normals[i]
                        let d=n[0]*lightDir[0]+n[1]*lightDir[1]+n[2]*lightDir[2]
                        shade[i]=d*0.8+0.65
                        
                    }
                }
                
                let vl=verts.length/10
                
                if(!textures){
                    
                    w=0
                    h=0
                    l=0
                }
                
                if(!mesh){return}
                
                verts.push(
                    
                    v[0][0],v[0][1],v[0][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,w,l,0,
                    v[1][0],v[1][1],v[1][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,w,0,0,
                    v[2][0],v[2][1],v[2][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,0,0,0,
                    v[3][0],v[3][1],v[3][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,0,l,0,
                    
                    v[1][0],v[1][1],v[1][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,0,0,0,
                    v[2][0],v[2][1],v[2][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,w,0,0,
                    v[5][0],v[5][1],v[5][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,0,h,0,
                    v[6][0],v[6][1],v[6][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,w,h,0,
                    
                    v[0][0],v[0][1],v[0][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,w,h,0,
                    v[3][0],v[3][1],v[3][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,0,h,0,
                    v[4][0],v[4][1],v[4][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,w,0,0,
                    v[7][0],v[7][1],v[7][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,0,0,0,
                    
                    v[2][0],v[2][1],v[2][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,0,0,0,
                    v[3][0],v[3][1],v[3][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,l,0,0,
                    v[6][0],v[6][1],v[6][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,0,h,0,
                    v[7][0],v[7][1],v[7][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,l,h,0,
                    
                    v[0][0],v[0][1],v[0][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,0,0,0,
                    v[1][0],v[1][1],v[1][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,l,0,0,
                    v[4][0],v[4][1],v[4][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,0,h,0,
                    v[5][0],v[5][1],v[5][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,l,h,0,
                    
                    v[4][0],v[4][1],v[4][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,0,l,0,
                    v[5][0],v[5][1],v[5][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,0,0,0,
                    v[6][0],v[6][1],v[6][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,w,0,0,
                    v[7][0],v[7][1],v[7][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,w,l,0,
                    
                )
                
                index.push(
                    
                    0+vl,1+vl,2+vl,
                    0+vl,2+vl,3+vl,
                    5+vl,6+vl,7+vl,
                    6+vl,5+vl,4+vl,
                    8+vl,9+vl,10+vl,
                    11+vl,10+vl,9+vl,
                    14+vl,13+vl,12+vl,
                    13+vl,14+vl,15+vl,
                    18+vl,17+vl,16+vl,
                    17+vl,18+vl,19+vl,
                    22+vl,21+vl,20+vl,
                    23+vl,22+vl,20+vl
                )
            }
            
            addHiveSlot=function(x,y,z,w,h,type,gifted){
                
                let t=128/2048,_x=beeInfo[type||'basic'].u,_y=beeInfo[type||'basic'].v+(gifted?768/2048:0),isNull=type===null?1:0,[r,g,b]=COLORS.honey_normalized
                
                r*=0.5
                g*=0.5
                b*=0.5
                
                let vl=verts.length/10
                
                verts.push(
                    
                    x-w,y-h,z,r,g,b,1,_x,t+_y,isNull,
                    x+w,y-h,z,r,g,b,1,t+_x,t+_y,isNull,
                    x+w,y+h,z,r,g,b,1,t+_x,_y,isNull,
                    x-w,y+h,z,r,g,b,1,_x,_y,isNull,
                )
                
                index.push(vl,vl+1,vl+2,vl+2,vl+3,vl)
            }
            
            addGiftedRing=function(x,y,z,w,h){
                
                addBox(x,y,z,w*2,h*2,0.25,false,[100,100,0],false,false)
            }
            
            addStar=function(x,y,z,innerRad,outerRad,thickness,depth,r,g,b,la=0.75,lb=0.25,rx=0,ry=0,rz=0){
                
                let rotQuat=quat.fromEuler([],rx,ry,rz)
                
                innerRad*=0.8
                let _verts=[],_index=[],pos=[],vs=[],ix=[],j=0,vl=verts.length/10
                
                for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/10){
                    
                    let r=(j++)%2===0?outerRad:innerRad
                    
                    pos.push([Math.sin(i)*r,Math.cos(i)*r,-thickness])
                }
                
                j=0
                
                for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/10){
                    
                    let r=(j++)%2===0?outerRad:innerRad
                    
                    pos.push([Math.sin(i)*r,Math.cos(i)*r,thickness])
                }
                
                pos.push([0,0,-depth],[0,0,depth])
                
                vs.push(0,1,20,1,2,20,2,3,20,3,4,20,4,5,20,5,6,20,6,7,20,7,8,20,8,9,20,9,0,20,11,10,21,12,11,21,13,12,21,14,13,21,15,14,21,16,15,21,17,16,21,18,17,21,19,18,21,10,19,21,9,10,0)
                
                ix.push(2,1,0,5,4,3,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62)
                
                for(let i=0;i<10;i++){
                    
                    vs.push(0+i,10+i,1+i,11+i,1+i,10+i)
                    ix.push(i*6,i*6+1,i*6+2,i*6+3,i*6+4,i*6+5)
                }
                
                for(let i=63;i<ix.length;i++){
                    
                    ix[i]+=63
                }
                
                for(let i=0;i<pos.length;i++){
                    
                    vec3.transformQuat(pos[i],pos[i],rotQuat)
                    vec3.add(pos[i],pos[i],[x,y,z])
                }
                
                for(let i in vs){
                    
                    vs[i]=pos[vs[i]]
                }
                
                _index=ix
                
                let findNorm=(a,b,c)=>{
                    
                    a=vs[a]
                    b=vs[b]
                    c=vs[c]
                    
                    let n=vec3.cross([],[a[0]-b[0],a[1]-b[1],a[2]-b[2]],[a[0]-c[0],a[1]-c[1],a[2]-c[2]])
                    
                    return vec3.normalize(n,n)
                }
                
                for(let i=0;i<_index.length;i+=3){
                    
                    let i1=_index[i],i2=_index[i+1],i3=_index[i+2],shade=vec3.dot([0.035,0.175,0.053],findNorm(i1,i2,i3))*la+lb
                    
                    verts.push(...vs[i1],r*shade,g*shade,b*shade,1,0,0,0,...vs[i2],r*shade,g*shade,b*shade,1,0,0,0,...vs[i3],r*shade,g*shade,b*shade,1,0,0,0)
                }
                
                for(let i in _index){
                    
                    _index[i]+=vl
                }
                
                index.push(..._index)
            }
            
            addCylinder=function(x,y,z,rad,hei,sides,r,g,b,a,rx,ry,rz,r2,shading=true){
                let rad2=r2??rad,vl=verts.length/10,_verts=[],_index=[]
                
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5,s=shading?Math.sin(t1)*0.1+0.9:1
                    _verts.push(
                        Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r*s,g*s,b*s,a,0,0,0,
                        Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r*s,g*s,b*s,a,0,0,0,
                        Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r*s,g*s,b*s,a,0,0,0,
                        Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r*s,g*s,b*s,a,0,0,0)
                    
                    let _vl=_verts.length/10
                    _index.push(_vl,_vl+1,_vl+2,_vl+3,_vl+2,_vl+1)
                }
                
                let _v=_verts.length/10
                
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r*0.9,g*0.9,b*0.9,a,0,0,0,
                        Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r*0.9,g*0.9,b*0.9,a,0,0,0)
                }
                for(let l=_verts.length/10,i=_v;i<l;i++){
                    
                    _index.push(_v,i,i+2)
                }
                _v=_verts.length/10
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        
                        Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r*0.7,g*0.7,b*0.7,a,0,0,0,
                        Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r*0.7,g*0.7,b*0.7,a,0,0,0)
                }
                for(let l=_verts.length/10,i=_v;i<l;i++){
                    
                    _index.push(i,i-1,_v)
                }
                
                for(let i in _index){
                    
                    _index[i]+=vl
                }
                
                index.push(..._index)
                
                let rotQuat=quat.fromEuler([],rx,ry,rz)
                
                for(let i=0;i<_verts.length;i+=10){
                    
                    if(rx){
                        
                        let rotated=vec3.transformQuat([],[_verts[i],_verts[i+1],_verts[i+2]],rotQuat)
                        _verts[i]=rotated[0]+x
                        _verts[i+1]=rotated[1]+y
                        _verts[i+2]=rotated[2]+z
                        
                        rotated=vec3.transformQuat(rotated,[_verts[i+7],_verts[i+8],_verts[i+9]],rotQuat)
                        
                        _verts[i+7]=rotated[0]
                        _verts[i+8]=rotated[1]
                        _verts[i+9]=rotated[2]
                        
                    } else {
                        
                        _verts[i]+=x
                        _verts[i+1]+=y
                        _verts[i+2]+=z
                    }
                }
                
                verts.push(..._verts)
                
            }
            
            addSphere=function(x,y,z,rad,detail,r,g,b,a,ys=1){
                
                let _m=MATH.icosphere(detail),_verts=[],_index=[]
                
                for(let i=0,l=_m.verts.length;i<l;i+=3){
                    
                    _verts.push(_m.verts[i]*rad+x,_m.verts[i+1]*rad*ys+y,_m.verts[i+2]*rad+z,r,g,b,a,0,0,0)
                }
                
                for(let i in _m.index){
                    
                    _index.push(_m.index[i]+verts.length/10)
                }
                
                verts.push(..._verts)
                index.push(..._index)
            }
            
            addLimbBox=function(AArot,x,y,z,w,h,l,rot,u,_v,useTex=false){
                
                rot=rot||[0,0,0]
                
                let rotation=quat.fromEuler([],rot[0],rot[1],rot[2])
                let model=mat4.fromRotationTranslation([],rotation,[x,y,z,1]),a=1
                
                let v=[
                    
                    [-0.5*w,0.5*h,-0.5*l],
                    [-0.5*w,0.5*h,0.5*l],
                    [0.5*w,0.5*h,0.5*l],
                    [0.5*w,0.5*h,-0.5*l],
                    [-0.5*w,-0.5*h,-0.5*l],
                    [-0.5*w,-0.5*h,0.5*l],
                    [0.5*w,-0.5*h,0.5*l],
                    [0.5*w,-0.5*h,-0.5*l],
                ]
                
                let shade=[]
                
                let normals=[
                    
                    [0,1,0],
                    [0,0,1],
                    [0,0,-1],
                    [1,0,0],
                    [-1,0,0],
                    [0,-1,0],
                ]
                
                for(let i=0,_l=v.length;i<_l;i++){
                    
                    vec3.transformMat4(v[i],v[i],model)
                    
                    if(i<6){
                        
                        vec3.transformQuat(normals[i],normals[i],rotation)
                        let n=normals[i]
                        let d=n[0]*lightDir[0]+n[1]*lightDir[1]+n[2]*lightDir[2]
                        shade[i]=d*0.8+0.65
                        
                    }
                    
                    switch(AArot){
                        
                        case 1:
                            
                            let _temp=v[i][0]
                            v[i][0]=-v[i][2]
                            v[i][2]=_temp
                            
                        break
                        
                        case 2:
                            
                            v[i][0]=-v[i][0]
                            v[i][2]=-v[i][2]
                            
                        break
                        
                        case 3:
                            
                            let __temp=v[i][0]
                            v[i][0]=v[i][2]
                            v[i][2]=-__temp
                            
                        break
                    }
                }
                
                let vl=verts.length/10,tv=126/1024,col=[1,1,1]
                
                if(!useTex){
                    
                    tv=0
                }
                
                u+=1/1024
                _v+=1/1024
                
                verts.push(
                    
                    v[0][0],v[0][1],v[0][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,u,_v,0,
                    v[1][0],v[1][1],v[1][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,u,_v,0,
                    v[2][0],v[2][1],v[2][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,u,_v,0,
                    v[3][0],v[3][1],v[3][2],col[0]*shade[0],col[1]*shade[0],col[2]*shade[0],a,u,_v,0,
                    
                    v[1][0],v[1][1],v[1][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,u,_v,0,
                    v[2][0],v[2][1],v[2][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,u+tv,_v,0,
                    v[5][0],v[5][1],v[5][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,u,_v+tv,0,
                    v[6][0],v[6][1],v[6][2],col[0]*shade[1],col[1]*shade[1],col[2]*shade[1],a,u+tv,_v+tv,0,
                    
                    v[0][0],v[0][1],v[0][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,u,_v,0,
                    v[3][0],v[3][1],v[3][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,u,_v,0,
                    v[4][0],v[4][1],v[4][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,u,_v,0,
                    v[7][0],v[7][1],v[7][2],col[0]*shade[2],col[1]*shade[2],col[2]*shade[2],a,u,_v,0,
                    
                    v[2][0],v[2][1],v[2][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,u,_v,0,
                    v[3][0],v[3][1],v[3][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,u,_v,0,
                    v[6][0],v[6][1],v[6][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,u,_v,0,
                    v[7][0],v[7][1],v[7][2],col[0]*shade[3],col[1]*shade[3],col[2]*shade[3],a,u,_v,0,
                    
                    v[0][0],v[0][1],v[0][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,u,_v,0,
                    v[1][0],v[1][1],v[1][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,u,_v,0,
                    v[4][0],v[4][1],v[4][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,u,_v,0,
                    v[5][0],v[5][1],v[5][2],col[0]*shade[4],col[1]*shade[4],col[2]*shade[4],a,u,_v,0,
                    
                    v[4][0],v[4][1],v[4][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,u,_v,0,
                    v[5][0],v[5][1],v[5][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,u,_v,0,
                    v[6][0],v[6][1],v[6][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,u,_v,0,
                    v[7][0],v[7][1],v[7][2],col[0]*shade[5],col[1]*shade[5],col[2]*shade[5],a,u,_v,0,
                    
                )
                
                index.push(
                    
                    0+vl,1+vl,2+vl,
                    0+vl,2+vl,3+vl,
                    5+vl,6+vl,7+vl,
                    6+vl,5+vl,4+vl,
                    8+vl,9+vl,10+vl,
                    11+vl,10+vl,9+vl,
                    14+vl,13+vl,12+vl,
                    13+vl,14+vl,15+vl,
                    18+vl,17+vl,16+vl,
                    17+vl,18+vl,19+vl,
                    22+vl,21+vl,20+vl,
                    23+vl,22+vl,20+vl
                )
            }
            
            addLimbCylinder=function(AArot,x,y,z,rad,hei,sides,r,g,b,a,rx,ry,rz,u,__v){
                
                u+=1/1024
                __v+=1/1024
                
                let rad2=rad,vl=verts.length/10,_verts=[],_index=[]
                
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5,s=Math.sin(t1)*0.1+0.9
                    _verts.push(
                        Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r*s,g*s,b*s,a,u,__v,0,
                        Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r*s,g*s,b*s,a,u,__v,0,
                        Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r*s,g*s,b*s,a,u,__v,0,
                        Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r*s,g*s,b*s,a,u,__v,0)
                    
                    let _vl=_verts.length/10
                    _index.push(_vl,_vl+1,_vl+2,_vl+3,_vl+2,_vl+1)
                }
                
                let _v=_verts.length/10
                
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r*0.9,g*0.9,b*0.9,a,u,__v,0,
                        Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r*0.9,g*0.9,b*0.9,a,u,__v,0)
                }
                for(let l=_verts.length/10,i=_v;i<l;i++){
                    
                    _index.push(_v,i,i+2)
                }
                _v=_verts.length/10
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        
                        Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r*0.7,g*0.7,b*0.7,a,u,__v,0,
                        Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r*0.7,g*0.7,b*0.7,a,u,__v,0)
                }
                for(let l=_verts.length/10,i=_v;i<l;i++){
                    
                    _index.push(i,i-1,_v)
                }
                
                for(let i in _index){
                    
                    _index[i]+=vl
                }
                
                index.push(..._index)
                
                let rotQuat=quat.fromEuler([],rx,ry,rz)
                
                for(let i=0;i<_verts.length;i+=10){
                    
                    if(rx){
                        
                        let rotated=vec3.transformQuat([],[_verts[i],_verts[i+1],_verts[i+2]],rotQuat)
                        _verts[i]=rotated[0]+x
                        _verts[i+1]=rotated[1]+y
                        _verts[i+2]=rotated[2]+z
                        
                        rotated=vec3.transformQuat(rotated,[_verts[i+7],_verts[i+8],_verts[i+9]],rotQuat)
                        
                        _verts[i+7]=rotated[0]
                        _verts[i+8]=rotated[1]
                        _verts[i+9]=rotated[2]
                        
                    } else {
                        
                        _verts[i]+=x
                        _verts[i+1]+=y
                        _verts[i+2]+=z
                    }
                    
                    switch(AArot){
                        
                        case 1:
                            
                            let _temp=_verts[i]
                            _verts[i]=-_verts[i+2]
                            _verts[i+2]=_temp
                            
                        break
                        
                        case 2:
                            
                            _verts[i]=-_verts[i]
                            _verts[i+2]=-_verts[i+2]
                            
                        break
                        
                        case 3:
                            
                            let __temp=_verts[i]
                            _verts[i]=_verts[i+2]
                            _verts[i+2]=-__temp
                            
                        break
                    }
                }
                
                verts.push(..._verts)
                
            }
            
        } else {
            
            addBox=function(x,y,z,w,h,l,rot,col,rot2=[0,0,0]){
                
                rot=rot||[0,0,0]
                
                let rotation=quat.fromEuler([],rot[0],rot[1],rot[2]),rotation2=quat.fromEuler([],rot2[0],rot2[1],rot2[2])
                let model=mat4.fromRotationTranslation([],rotation,[x,y,z,1])
                
                let v=[
                    
                    [-0.5*w,0.5*h,-0.5*l],
                    [-0.5*w,0.5*h,0.5*l],
                    [0.5*w,0.5*h,0.5*l],
                    [0.5*w,0.5*h,-0.5*l],
                    [-0.5*w,-0.5*h,-0.5*l],
                    [-0.5*w,-0.5*h,0.5*l],
                    [0.5*w,-0.5*h,0.5*l],
                    [0.5*w,-0.5*h,-0.5*l],
                ]
                
                let normals=[
                    
                    [0,1,0],
                    [0,0,1],
                    [0,0,-1],
                    [1,0,0],
                    [-1,0,0],
                    [0,-1,0],
                ]
                
                for(let i=0,_l=v.length;i<_l;i++){

                    vec3.transformMat4(v[i],v[i],model)
                    vec3.transformQuat(v[i],v[i],rotation2)
                    
                    if(i<6){
                        
                        vec3.transformQuat(normals[i],normals[i],rotation)
                    }

                    vec3.transformMat4(v[i],v[i],DIS.matrix)
                }
                
                let vl=verts.length/9,n=normals
                
                verts.push(
                    
                    v[0][0],v[0][1],v[0][2],col[0],col[1],col[2],n[0][0],n[0][1],n[0][2],
                    v[1][0],v[1][1],v[1][2],col[0],col[1],col[2],n[0][0],n[0][1],n[0][2],
                    v[2][0],v[2][1],v[2][2],col[0],col[1],col[2],n[0][0],n[0][1],n[0][2],
                    v[3][0],v[3][1],v[3][2],col[0],col[1],col[2],n[0][0],n[0][1],n[0][2],
                    
                    v[1][0],v[1][1],v[1][2],col[0],col[1],col[2],n[1][0],n[1][1],n[1][2],
                    v[2][0],v[2][1],v[2][2],col[0],col[1],col[2],n[1][0],n[1][1],n[1][2],
                    v[5][0],v[5][1],v[5][2],col[0],col[1],col[2],n[1][0],n[1][1],n[1][2],
                    v[6][0],v[6][1],v[6][2],col[0],col[1],col[2],n[1][0],n[1][1],n[1][2],
                    
                    v[0][0],v[0][1],v[0][2],col[0],col[1],col[2],n[2][0],n[2][1],n[2][2],
                    v[3][0],v[3][1],v[3][2],col[0],col[1],col[2],n[2][0],n[2][1],n[2][2],
                    v[4][0],v[4][1],v[4][2],col[0],col[1],col[2],n[2][0],n[2][1],n[2][2],
                    v[7][0],v[7][1],v[7][2],col[0],col[1],col[2],n[2][0],n[2][1],n[2][2],
                    
                    v[2][0],v[2][1],v[2][2],col[0],col[1],col[2],n[3][0],n[3][1],n[3][2],
                    v[3][0],v[3][1],v[3][2],col[0],col[1],col[2],n[3][0],n[3][1],n[3][2],
                    v[6][0],v[6][1],v[6][2],col[0],col[1],col[2],n[3][0],n[3][1],n[3][2],
                    v[7][0],v[7][1],v[7][2],col[0],col[1],col[2],n[3][0],n[3][1],n[3][2],
                    
                    v[0][0],v[0][1],v[0][2],col[0],col[1],col[2],n[4][0],n[4][1],n[4][2],
                    v[1][0],v[1][1],v[1][2],col[0],col[1],col[2],n[4][0],n[4][1],n[4][2],
                    v[4][0],v[4][1],v[4][2],col[0],col[1],col[2],n[4][0],n[4][1],n[4][2],
                    v[5][0],v[5][1],v[5][2],col[0],col[1],col[2],n[4][0],n[4][1],n[4][2],
                    
                    v[4][0],v[4][1],v[4][2],col[0],col[1],col[2],n[5][0],n[5][1],n[5][2],
                    v[5][0],v[5][1],v[5][2],col[0],col[1],col[2],n[5][0],n[5][1],n[5][2],
                    v[6][0],v[6][1],v[6][2],col[0],col[1],col[2],n[5][0],n[5][1],n[5][2],
                    v[7][0],v[7][1],v[7][2],col[0],col[1],col[2],n[5][0],n[5][1],n[5][2],
                    
                )
                
                index.push(
                    
                    0+vl,1+vl,2+vl,
                    0+vl,2+vl,3+vl,
                    5+vl,6+vl,7+vl,
                    6+vl,5+vl,4+vl,
                    8+vl,9+vl,10+vl,
                    11+vl,10+vl,9+vl,
                    14+vl,13+vl,12+vl,
                    13+vl,14+vl,15+vl,
                    18+vl,17+vl,16+vl,
                    17+vl,18+vl,19+vl,
                    22+vl,21+vl,20+vl,
                    23+vl,22+vl,20+vl
                )
                
            }
            
            addCylinder=function(x,y,z,rad,hei,sides,r,g,b,rx,ry,rz,r2){
                let rad2=r2??rad,vl=verts.length/9,_verts=[],_index=[]
                
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r,g,b,Math.cos(t1),Math.sin(t1),0,
                        Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r,g,b,Math.cos(t1),Math.sin(t1),0,
                        Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r,g,b,Math.cos(t2),Math.sin(t2),0,
                        Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r,g,b,Math.cos(t2),Math.sin(t2),0)
                    
                    let _vl=_verts.length/9
                    _index.push(_vl,_vl+1,_vl+2,_vl+3,_vl+2,_vl+1)
                }
                
                let _v=_verts.length/9
                
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r,g,b,0,0,1,
                        Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r,g,b,0,0,1)
                }
                for(let l=_verts.length/9,i=_v;i<l-1;i++){
                    
                    _index.push(_v,i,i+2)
                }
                _v=_verts.length/9
                for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
                    
                    let t1=t-inc*0.5,t2=t+inc*0.5
                    _verts.push(
                        
                        Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r,g,b,0,0,-1,
                        Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r,g,b,0,0,-1)
                }
                for(let l=_verts.length/9,i=_v;i<l;i++){
                    
                    _index.push(i,i-1,_v)
                }
                
                for(let i in _index){
                    
                    _index[i]+=vl
                }
                
                index.push(..._index)
                
                let rotQuat=quat.fromEuler([],rx,ry,rz)
                
                for(let i=0;i<_verts.length;i+=9){
                    
                    if(rx){
                        
                        let rotated=vec3.transformQuat([],[_verts[i],_verts[i+1],_verts[i+2]],rotQuat)
                        _verts[i]=rotated[0]+x
                        _verts[i+1]=rotated[1]+y
                        _verts[i+2]=rotated[2]+z
                        
                        rotated=vec3.transformQuat(rotated,[_verts[i+6],_verts[i+7],_verts[i+8]],rotQuat)
                        
                        _verts[i+6]=rotated[0]
                        _verts[i+7]=rotated[1]
                        _verts[i+8]=rotated[2]
                        
                    } else {
                        
                        _verts[i]+=x
                        _verts[i+1]+=y
                        _verts[i+2]+=z
                    }

                    [_verts[i],_verts[i+1],_verts[i+2]]=vec3.transformMat4([],[_verts[i],_verts[i+1],_verts[i+2]],DIS.matrix)
                }
                
                verts.push(..._verts)
            }
            
            addSphere=function(x,y,z,rad,detail,r,g,b,vl){
                
                let _m=MATH.icosphere(detail),_verts=[],_index=[]
                
                for(let i=0,l=_m.verts.length;i<l;i+=3){
                    
                    _verts.push(_m.verts[i]*rad+x,_m.verts[i+1]*rad+y,_m.verts[i+2]*rad+z,r,g,b,_m.verts[i],_m.verts[i+1],_m.verts[i+2])
                }
                
                for(let i in _m.index){
                    
                    _index.push(_m.index[i]+verts.length/9)
                }

                for(let i=0;i<_verts.length;i+=9){
                    
                    [_verts[i],_verts[i+1],_verts[i+2]]=vec3.transformMat4([],[_verts[i],_verts[i+1],_verts[i+2]],DIS.matrix)
                }
                
                verts.push(..._verts)
                index.push(..._index)
            }
            
            addStar=function(x,y,z,innerRad,outerRad,thickness,depth,r,g,b,la=0.75,lb=0.25,rx=0,ry=0,rz=0){
                
                let rotQuat=quat.fromEuler([],rx,ry,rz)
                
                innerRad*=0.8
                let _verts=[],_index=[],pos=[],vs=[],ix=[],j=0,vl=verts.length/9
                
                for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/10){
                    
                    let r=(j++)%2===0?outerRad:innerRad
                    
                    pos.push([Math.sin(i)*r,Math.cos(i)*r,-thickness])
                }
                
                j=0
                
                for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/10){
                    
                    let r=(j++)%2===0?outerRad:innerRad
                    
                    pos.push([Math.sin(i)*r,Math.cos(i)*r,thickness])
                }
                
                pos.push([0,0,-depth],[0,0,depth])
                
                vs.push(0,1,20,1,2,20,2,3,20,3,4,20,4,5,20,5,6,20,6,7,20,7,8,20,8,9,20,9,0,20,11,10,21,12,11,21,13,12,21,14,13,21,15,14,21,16,15,21,17,16,21,18,17,21,19,18,21,10,19,21,9,10,0)
                
                ix.push(2,1,0,5,4,3,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62)
                
                for(let i=0;i<10;i++){
                    
                    vs.push(0+i,10+i,1+i,11+i,1+i,10+i)
                    ix.push(i*6,i*6+1,i*6+2,i*6+3,i*6+4,i*6+5)
                }
                
                for(let i=63;i<ix.length;i++){
                    
                    ix[i]+=63
                }
                
                for(let i=0;i<pos.length;i++){
                    
                    vec3.transformQuat(pos[i],pos[i],rotQuat)
                    vec3.add(pos[i],pos[i],[x,y,z])
                    vec3.transformMat4(pos[i],pos[i],DIS.matrix)
                }
                
                for(let i in vs){
                    
                    vs[i]=pos[vs[i]]
                }
                
                _index=ix
                
                let findNorm=(a,b,c)=>{
                    
                    a=vs[a]
                    b=vs[b]
                    c=vs[c]
                    
                    let n=vec3.cross([],[a[0]-b[0],a[1]-b[1],a[2]-b[2]],[a[0]-c[0],a[1]-c[1],a[2]-c[2]])
                    
                    return vec3.normalize(n,n)
                }
                
                for(let i=0;i<_index.length;i+=3){
                    
                    let i1=_index[i],i2=_index[i+1],i3=_index[i+2],shade=vec3.dot([0.035,0.175,0.053],findNorm(i1,i2,i3))*la+lb
                    
                    verts.push(...vs[i1],r*shade,g*shade,b*shade,0,1,0,...vs[i2],r*shade,g*shade,b*shade,0,1,0,...vs[i3],r*shade,g*shade,b*shade,0,1,0)
                }
                
                for(let i in _index){
                    
                    _index[i]+=vl
                }
                
                index.push(..._index)
            }
            
            applyFinalRotation=function(x,y,z){
                
                if(!mat4.exactEquals(DIS.matrix,DIS.ogMatrix)) return

                let q=quat.fromEuler([],x,y,z)
                
                for(let i=0;i<verts.length;i+=9){
                    
                    let v=vec3.transformQuat([],[verts[i],verts[i+1],verts[i+2]],q)
                    
                    verts[i]=v[0]
                    verts[i+1]=v[1]
                    verts[i+2]=v[2]
                }
            }
        }
        
        func(addBox,addHiveSlot,addCylinder,addSphere,applyFinalRotation,addGiftedRing,addStar,addLimbBox,addLimbCylinder)
        this.setMesh(verts,index)
    }
    
    setBuffers(){
        
        if(this.isStatic){
            
            gl.bindBuffer(gl.ARRAY_BUFFER,this.mesh.buffers.verts)
            gl.bufferData(gl.ARRAY_BUFFER,this.mesh.data.verts,gl.STATIC_DRAW)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.buffers.index)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.mesh.data.index,gl.STATIC_DRAW)
            
        } else {
            
            gl.bindBuffer(gl.ARRAY_BUFFER,this.mesh.buffers.verts)
            gl.bufferData(gl.ARRAY_BUFFER,this.mesh.data.verts,gl.STATIC_DRAW)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.buffers.index)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.mesh.data.index,gl.STATIC_DRAW)
        }
    }
    
    render(){
        
        if(this.isStatic){
            
            gl.bindBuffer(gl.ARRAY_BUFFER,this.mesh.buffers.verts)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.buffers.index)
            
            gl.vertexAttribPointer(glCache.static_vertPos,3,gl.FLOAT,gl.FALSE,40,0)
            gl.vertexAttribPointer(glCache.static_vertColor,4,gl.FLOAT,gl.FALSE,40,12)
            gl.vertexAttribPointer(glCache.static_vertUV,3,gl.FLOAT,gl.FALSE,40,28)
            
        } else {
            
            gl.bindBuffer(gl.ARRAY_BUFFER,this.mesh.buffers.verts)
            
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.buffers.index)
            
            gl.vertexAttribPointer(glCache.dynamic_vertPos,3,gl.FLOAT,gl.FALSE,36,0)
            gl.vertexAttribPointer(glCache.dynamic_vertColor,3,gl.FLOAT,gl.FALSE,36,12)
            gl.vertexAttribPointer(glCache.dynamic_vertNormal,3,gl.FLOAT,gl.FALSE,36,24)
        }
            
        gl.drawElements(gl.TRIANGLES,this.mesh.indexAmount,gl.UNSIGNED_SHORT,0)
        
    }
}

let textures=(function(out){
    
    tex_ctx.clearRect(0,0,2048,2048)
    
    for(let i=0;i<10;i++){
        
        tex_ctx.fillStyle='rgba(0,0,0,'+Math.random()*0.2+')'
        tex_ctx.fillRect(MATH.random(12,500),MATH.random(12,500),MATH.random(25,45),MATH.random(25,45))
    }
    
    out.default=gl.createTexture()
    
    gl.bindTexture(gl.TEXTURE_2D,out.default)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,512,512,0,gl.RGBA,gl.UNSIGNED_BYTE,tex_ctx.getImageData(0,0,512,512))
    
    gl.generateMipmap(gl.TEXTURE_2D)
    
    window.textures_effects(tex_ctx)
    out.effects=gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D,out.effects)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2048,2048,0,gl.RGBA,gl.UNSIGNED_BYTE,tex_ctx.getImageData(0,0,2048,2048))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.generateMipmap(gl.TEXTURE_2D)

    window.textures_flowers(tex_ctx)
    out.flowers=gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D,out.flowers)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,1024,0,gl.RGBA,gl.UNSIGNED_BYTE,tex_ctx.getImageData(0,0,1024,1024))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.generateMipmap(gl.TEXTURE_2D)
    
    
    tex_ctx.clearRect(0,0,512,600)
    tex_ctx.font='bold 60px arial'
    tex_ctx.fillStyle='rgb(255,255,255)'
    tex_ctx.strokeStyle='rgb(0,0,0)'
    tex_ctx.lineWidth=9
    tex_ctx.textAlign='center'
    tex_ctx.textBaseline='middle'
    
    function t(m,x,y){tex_ctx.strokeText(m,x,y);tex_ctx.fillText(m,x,y)}
    
    for(let i=0;i<10;i++){
        
        t(i,i*50+30,40)
    }
    
    let chars='+⇆,/-:()%.'
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115)
    }
    
    chars='abcdefghij'
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115+75)
    }
    
    chars='klmnopqrst'
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115+75*2)
    }
    
    chars='uvwxyz'
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115+75*3)
    }
    
    chars='abcdefghij'.toUpperCase()
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115+75*4)
    }
    
    chars='klmnopqrst'.toUpperCase()
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115+75*5)
    }
    
    chars='uvwxyz'.toUpperCase()
    
    for(let i=0;i<chars.length;i++){
        
        t(chars[i],i*50+30,115+75*6)
    }
    
    tex_ctx.clearRect(110,438.5,43,21)
    
    out.text=gl.createTexture()
    
    gl.bindTexture(gl.TEXTURE_2D,out.text)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,512,600,0,gl.RGBA,gl.UNSIGNED_BYTE,tex_ctx.getImageData(0,0,512,600))
    gl.generateMipmap(gl.TEXTURE_2D)
    
    window.textures_bees(tex_ctx)
    let data=tex_ctx.getImageData(0,0,2048,2048)
    out.bees=gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D,out.bees)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,2048,2048,0,gl.RGBA,gl.UNSIGNED_BYTE,data)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.generateMipmap(gl.TEXTURE_2D)
    beeCanvas=document.createElement('canvas')
    beeCanvas.width=2048
    beeCanvas.height=2048
    let beeCanvasCtx=beeCanvas.getContext('2d')
    beeCanvasCtx.putImageData(data,0,0)
    
    window.textures_decals(tex_ctx)
    out.decals=gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D,out.decals)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,1024,0,gl.RGBA,gl.UNSIGNED_BYTE,tex_ctx.getImageData(0,0,1024,1024))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.generateMipmap(gl.TEXTURE_2D)
            
    out.bear=gl.createTexture()
    window.textures_bear(tex_ctx)
    gl.bindTexture(gl.TEXTURE_2D,out.bear)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,1024,0,gl.RGBA,gl.UNSIGNED_BYTE,tex_ctx.getImageData(0,0,1024,1024))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.generateMipmap(gl.TEXTURE_2D)
    
    return out
    
})({})

let dialogueBox=document.getElementById('dialogueBox'),
    NPCName=document.getElementById('NPCName'),
    NPCDialogue=document.getElementById('NPCDialogue'),
    actionWarning=document.getElementById('actionWarning'),
    actionName=document.getElementById('actionName'),
    shopUI=document.getElementById('shopUI'),
    leftShopButton=document.getElementById('leftShopButton'),
    rightShopButton=document.getElementById('rightShopButton'),
    itemName=document.getElementById('itemName'),
    itemDesc=document.getElementById('itemDesc'),
    itemCostSVG=document.getElementById('itemCostSVG')

let playerMesh=new Mesh(false)

let shopGearMesh=new Mesh(false)

let gear=window.playerGear

gear.tool={
    
    shovel:{
        
        collectPattern:[[0,0],[0,-1]],
        collectAmount:5,
        cooldown:1,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0,0.6,0.1,0.1,0.8,false,[0.5,0.2,0])
            box(-0.3,0,1.2,0.3,0.1,0.4,false,[0.2,0.2,0.2])
        },
        desc:'A trusty shovel.<br><br>Collects 5 pollen from 2 flowers every 1s.',
        cost:['0 honey']
    },

    rake:{
        
        collectPattern:[[0,0],[0,-1],[0,-2]],
        collectAmount:2,
        cooldown:0.7,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0,0.6,0.1,0.1,0.8,false,[0.9,0.9,0.9])
            box(-0.3+0.1,0,0.6+0.6,0.1,0.1,0.5,[0,20,0],[0.4,0.4,0.4])
            box(-0.3+0.2,0,0.6+0.5,0.1,0.1,0.5,[0,40,0],[0.4,0.4,0.4])
            box(-0.3-0.1,0,0.6+0.6,0.1,0.1,0.5,[0,-20,0],[0.4,0.4,0.4])
            box(-0.3-0.2,0,0.6+0.5,0.1,0.1,0.5,[0,-40,0],[0.4,0.4,0.4])
            box(-0.3,0,0.6+0.65,0.1,0.1,0.4,false,[0.4,0.4,0.4])
        },
        desc:'A small gardening rake.<br><br>Collects 2 pollen from 3 flowers every 0.7s.',
        cost:['800 honey']
    },

    clippers:{
        
        collectPattern:[[0,0]],
        collectAmount:9,
        cooldown:0.6,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.2-0.15,-0.15,0.4,0.25,0.25,0.1,[0,0,-30],[1.3,1.3,0])
            box(-0.2+0.15,-0.15,0.4,0.25,0.25,0.1,[0,0,30],[1.3,1.3,0])
            box(-0.2+0.15-Math.sin(30*MATH.TO_RAD)*0.41,-0.15+Math.cos(30*MATH.TO_RAD)*0.41,0.4,0.1,0.6,0.1,[0,0,30],[1.3,1.3,1.3])
            box(-0.2-0.15+Math.sin(30*MATH.TO_RAD)*0.41,-0.15+Math.cos(30*MATH.TO_RAD)*0.41,0.4,0.1,0.6,0.1,[0,0,-30],[1.3,1.3,1.3])
        },
        desc:'A little pair of yellow clippers.<br><br>Collects 9 pollen from 1 flowers every 0.6s.',
        cost:['2200 honey']
    },

    magnet:{
        
        collectPattern:[[0,0],[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1]],
        collectAmount:2,
        cooldown:0.8,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,-0.25,0.5,0.2,0.6,0.2,false,[0.8,0.8,0.8])
            box(-0.3,0.15,0.5,0.6,0.2,0.2,false,[1,0,0])
            box(-0.3-0.3,0.3,0.5,0.2,0.5,0.2,false,[1,0,0])
            box(-0.3+0.3,0.3,0.5,0.2,0.5,0.2,false,[1,0,0])
            box(-0.3-0.3,0.5,0.5,0.19,0.5,0.19,false,[1,1,1])
            box(-0.3+0.3,0.5,0.5,0.19,0.5,0.19,false,[1,1,1])
        },
        desc:'A big magnet that somehow picks up pollen particles.<br><br>Collects 2 pollen from 9 flowers every 0.8s.',
        cost:['5500 honey']
    },

    vacuum:{
        
        collectPattern:[[0,0],[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1],[0,-2],[2,0],[0,2],[-2,0]],
        collectAmount:2,
        cooldown:0.8,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0,0.65,0.1,0.8,0.1,[-20,0,0],[0.8,0.8,0.8])
            box(-0.3,-0.1,0.5,0.3,0.6,0.25,[-20,0,0],[1,0.7,0.4])
            box(-0.3,-0.3,0.7,0.4,0.3,0.3,false,[0.2,0.2,0.2])
            box(-0.3-0.1,-0.3,0.7,0.075,0.075,0.31,false,[1.4,1.4,0])
            box(-0.3+0.1,-0.3,0.7,0.075,0.075,0.31,false,[1.4,1.4,0])
        },
        desc:'A handy house-hold vacuum cleaner.<br><br>Collects 2 pollen from 13 flowers every 0.8s.',
        cost:['14000 honey']
    },

    superScooper:{
        
        collectPattern:[[0,0],[0,-1],[0,-2],[0,-3],[0,-4]],
        collectAmount:4,
        cooldown:0.5,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0,0.4,0.175,0.175,0.2,false,[1.5,1.5,0])
            box(-0.3,0,0.6,0.175,0.175,0.2,false,[0,0,1.5])
            box(-0.3,0,0.8,0.175,0.175,0.2,false,[1.5,1.5,0])
            box(-0.3,0,1,0.175,0.175,0.2,false,[0,0,1.5])
            box(-0.3,0,1.2,0.15,0.15,0.2,false,[0.6,0.4,0.1])
            box(-0.3+0.3*0.5,0,1.55,0.3,0.175,0.65,false,[1.5,1.5,0])
            box(-0.3-0.3*0.5,0,1.55,0.3,0.175,0.65,false,[0,0,1.5])
        },
        desc:'A massive toy scooper useful for pollen collection.<br><br>Collects 4 pollen from 5 flowers every 0.5s.',
        cost:['40000 honey']
    },

    pulsar:{
        
        collectPattern:[[0,0],[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1],[0,-2],[2,0],[0,2],[-2,0],[-2,-1],[-2,1],[2,-1],[2,1],[-1,-2],[-1,2],[1,-2],[1,2],[0,-3],[0,3],[-3,0],[3,0],[-2,2],[2,2],[-2,-2],[2,-2]],
        collectAmount:2,
        cooldown:1,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0.2,0.4,0.125,1.1,0.125,false,[1.5,1.5,0])
            box(-0.3,-0.2,0.4,0.175,0.3,0.175,false,[0,1.5,0])
            cylinder(-0.3,0.2+1.1*0.5+0.25,0.4,0.25,0.0005,10,0,0,0,0,0,0,0.25)
            cylinder(-0.3,0.2+1.1*0.5+0.25,0.4,0.25,0.0005,10,0,0,0,0.001,90,0,0.25)
            cylinder(-0.3,0.2+1.1*0.5+0.25,0.4,0.25,0.0005,10,0,0,0,90,0,0,0.25)

        },particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.3
            
            let x=-player.bodyDir[2],z=player.bodyDir[0]
            
            x+=player.bodyDir[0]
            z+=player.bodyDir[2]
            
            x*=0.3
            z*=0.4
            
            ParticleRenderer.add({x:player.body.position.x+x,y:player.body.position.y+0.2+1.1*0.5+0.25,z:player.body.position.z+z,vx:MATH.random(-0.3,0.3),vy:(Math.random()-0.5)*0.5,vz:MATH.random(-0.3,0.3),grav:1.5,size:MATH.random(30,70),col:[0,1,0],life:1,rotVel:MATH.random(-3,3),alpha:2})
        },
        desc:'A strange magical tool that sucks up more pollen.<br><br>Collects 2 pollen from 29 flowers every 1s.',
        cost:['125000 honey']
    },

    electroMagnet:{
        
        collectPattern:[[0,0],[0,-1],[0,1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1]],
        collectAmount:6,
        cooldown:0.5,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,-0.15,0.5,0.2,0.8,0.2,false,[0.8,0.8,0.8])
            box(-0.3,0.15+0.2,0.5,0.6,0.2,0.2,false,[1.4,1.4,0])
            box(-0.3-0.3,0.3+0.2,0.5,0.2,0.5,0.2,false,[1.4,1.4,0])
            box(-0.3+0.3,0.3+0.2,0.5,0.2,0.5,0.2,false,[1.4,1.4,0])
            box(-0.3-0.3,0.5+0.2,0.5,0.19,0.5,0.19,false,[1,1,1])
            box(-0.3+0.3,0.5+0.2,0.5,0.19,0.5,0.19,false,[1,1,1])
            box(-0.3,0.15+0.2,0.5,0.2,0.2,0.6,false,[1.4,1.4,0])
            box(-0.3,0.3+0.2,0.5-0.3,0.2,0.5,0.2,false,[1.4,1.4,0])
            box(-0.3,0.3+0.2,0.5+0.3,0.2,0.5,0.2,false,[1.4,1.4,0])
            box(-0.3,0.5+0.2,0.5-0.3,0.19,0.5,0.19,false,[1,1,1])
            box(-0.3,0.5+0.2,0.5+0.3,0.19,0.5,0.19,false,[1,1,1])
        },
        desc:'A upgraded magnet charged with electricity.<br><br>Collects 6 pollen from 9 flowers every 0.5s.',
        cost:['300000 honey']
    },
    
    scissors:{
        
        collectPattern:[[0,0]],
        collectAmount:50,
        cooldown:0.5,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.2-0.15,-0.15,0.4,0.25,0.25,0.1,[0,0,-30],[0.9,0,0])
            box(-0.2+0.15,-0.15,0.4,0.25,0.25,0.1,[0,0,30],[0,0,0.9])
            box(-0.2+0.15-Math.sin(30*MATH.TO_RAD)*0.41,-0.15+Math.cos(30*MATH.TO_RAD)*0.41,0.4,0.1,0.6,0.1,[0,0,30],[1.3,1.3,1.3])
            box(-0.2-0.15+Math.sin(30*MATH.TO_RAD)*0.41,-0.15+Math.cos(30*MATH.TO_RAD)*0.41,0.4,0.1,0.6,0.1,[0,0,-30],[1.3,1.3,1.3])
        },
        desc:'A pair of school scissors.<br><br>Collects 50 pollen from 1 flowers every 0.5s.',
        cost:['850000 honey']
    },

    honeyDipper:{
        
        collectPattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],
        collectAmount:2,
        cooldown:0.8,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0.3,0.4,0.125,1.3,0.125,false,[1,0.7,0.4])
            box(-0.3,-0.1,0.4,0.175,0.5,0.175,false,[0.7,0.5,0.2])
            cylinder(-0.3,0.25+1.2*0.5+0.5,0.4,0.2,0.075,10,1*1.4,0.7*1.4,0.4*1.4,90,0,0)
            cylinder(-0.3,0.25+1.2*0.5+0.5+0.2,0.4,0.125,0.075,10,1*1.4,0.7*1.4,0.4*1.4,90,0,0)
            cylinder(-0.3,0.25+1.2*0.5+0.5-0.2,0.4,0.125,0.075,10,1*1.4,0.7*1.4,0.4*1.4,90,0,0)
            cylinder(-0.3,0.25+1.2*0.5+0.501,0.4,0.3,-0.8,10,0.9,0.5,0.2,90,0,0)

        },
        desc:'A giant honey dipper.<br><br>Collects 2 pollen from 49 flowers every 0.8s.',
        cost:['1500000 honey']
    },

    bubbleWand:{
        
        collectPattern:[[0,3],[1,3],[-1,3],[0,-3],[1,-3],[-1,-3],[3,0],[3,1],[3,-1],[-3,0],[-3,1],[-3,-1],[2,2],[2,-2],[-2,-2],[-2,2]],
        collectAmount:{w:6,r:6,b:6*2},
        cooldown:0.8,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0.4,0.4,0.125,1.5,0.125,false,[0,0.4,1.4])
            box(-0.3,-0.1,0.4,0.175,0.5,0.175,false,[1.2,1.2,0])
            cylinder(-0.3,0.45+1.2*0.5+0.5,0.4,0.5,0.075,15,0,0.4,1.5,0,0,0)
            cylinder(-0.3,0.45+1.2*0.5+0.5,0.4,0.4,0.0755,15,0,0.9,1.2,0,0,0)
        },particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.4
            
            let x=-player.bodyDir[2],z=player.bodyDir[0]
            
            x+=player.bodyDir[0]
            z+=player.bodyDir[2]
            
            x*=0.3
            z*=0.4
            
            ParticleRenderer.add({x:player.body.position.x+x+MATH.random(-0.4,0.4),y:player.body.position.y+0.45+1.2*0.5+0.5+MATH.random(-0.4,0.4),z:player.body.position.z+z+MATH.random(-0.4,0.4),vx:MATH.random(-0.6,0.6),vy:(Math.random()-0.5)*0.5,vz:MATH.random(-0.6,0.6),grav:1.5,size:MATH.random(100,150),col:[0,0.6,0.9],life:1,rotVel:MATH.random(-3,3),alpha:0.8})
        },ability:function(){
            
            if(player.toolUses%10===0&&player.fieldIn){
                
                objects.bubbles.push(new Bubble(player.fieldIn,(Math.random()*fieldInfo[player.fieldIn].width)|0,(Math.random()*fieldInfo[player.fieldIn].length)|0))
            }
        },
        desc:'A bubble wand dipped in liquidy soap.<br><br>Collects 6 pollen from 16 flowers every 0.8s. Collects x2 more blue pollen.<br><br>Every 10th swing creates a bubble on the field.',
        cost:['3500000 honey']
    },

    scythe:{
        
        collectPattern:[[0,0],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6]],
        collectAmount:{w:8,r:8*2,b:8},
        cooldown:0.47,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0.4,0.4,0.125,1.5,0.125,false,[1.4,1.4,0])
            box(-0.3,-0.1,0.4,0.175,0.5,0.175,false,[1.4,0,0])
            box(-0.3,1,0.8,0.15,0.35,0.7,false,[1.3,1.3,1.3])
            box(-0.3,0.95,1.3,0.15,0.3,0.5,[20,0,0],[1.3,1.3,1.3])
            box(-0.3,0.8,1.55,0.15,0.2,0.3,[45,0,0],[1.3,1.3,1.3])
            box(-0.3,1+0.2,0.8,0.2,0.35,0.7,false,[1.3,0,0])
            box(-0.3,0.95+0.2,1.3,0.2,0.3,0.5,[20,0,0],[1.3,0,0])
            box(-0.3,0.775+0.15,1.65,0.2,0.3,0.5,[45,0,0],[1.3,0,0])
        },
        particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.4
            
            let x=player.bodyDir[0],y=1.5,z=player.bodyDir[2]*0
            
            x+=-player.bodyDir[2]*1.2
            z+=player.bodyDir[0]*1.2
            
            let r=Math.random()*1.5
            
            x+=player.bodyDir[0]*r
            y-=r*0.25
            z+=player.bodyDir[2]*r
            
            ParticleRenderer.add({x:player.body.position.x+x,y:player.body.position.y+y,z:player.body.position.z+z,vx:MATH.random(-0.8,0.8),vy:0.75,vz:MATH.random(-0.8,0.8),grav:1.5,size:MATH.random(70,120),col:[1,MATH.random(0.3,0.6),0],life:1,rotVel:MATH.random(-3,3),alpha:4.5})
        },ability:function(){
            
            if(player.toolUses%10===0){
                
                if(player.fieldIn){

                    objects.flames.push(new Flame(player.fieldIn,player.flowerIn.x,player.flowerIn.z))

                } else {

                    objects.flames.push(new Flame(player.body.position.x,player.body.position.y,player.body.position.z,true))
                }
            }
        },
        desc:'A red scythe forged and heated in fire.<br><br>Collects 8 pollen from 6 flowers every 0.47s. Collects x2 more red pollen.<br><br>Every 10th swing summons a flame nearby.',
        cost:['3500000 honey']
    },

    goldenRake:{
        
        collectPattern:[[-3,0],[-3,-1],[-3,-2],[-3,-3],[3,0],[3,-1],[3,-2],[3,-3],[-1,0],[-1,-1],[-1,-2],[-1,-3],[1,0],[1,-1],[1,-2],[1,-3]],
        collectAmount:7,
        cooldown:0.75,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0,0.6,0.1,0.1,0.8,false,[1.3,1.3,0.4])
            box(-0.3+0.1,0,0.6+0.6,0.1,0.1,0.5,[0,20,0],[1.3,1.3,0.4])
            box(-0.3+0.2,0,0.6+0.5,0.1,0.1,0.5,[0,40,0],[1.3,1.3,0.4])
            box(-0.3-0.1,0,0.6+0.6,0.1,0.1,0.5,[0,-20,0],[1.3,1.3,0.4])
            box(-0.3-0.2,0,0.6+0.5,0.1,0.1,0.5,[0,-40,0],[1.3,1.3,0.4])
            box(-0.3,0,0.6+0.65,0.1,0.1,0.4,false,[1.3,1.3,0.4])
        },
        ability:function(){
            
            if(player.toolUses%5===0&&player.fieldIn){
                
                objects.mobs.push(new Scratch(null,player.flowerIn.x,player.flowerIn.z,true))
            }
        },
        desc:'A shiny golden rake with improved pollen collection.<br><br>Collects 7 pollen from 16 flowers every 0.75s.<br><br>Every 5th swing is supercharged and collects more flowers from longer lines.',
        cost:['20000000 honey']
    },

    sparkStaff:{
        
        collectPattern:[[2,1],[-2,1],[0,-2]],
        collectAmount:30,
        cooldown:0.5,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0.3,0.4,0.1,1.25,0.1,false,[1,0,1])
        },ability:function(){
            
            if(!player.fieldIn){

                gear.tool.sparkStaff.collectPattern=[[2,1],[-2,1],[0,-2]]
                return
            }

            gear.tool.sparkStaff.collectPattern=[]

            let a=[[-5,0],[-4,-3],[-4,-2],[-4,-1],[-4,0],[-4,1],[-4,2],[-4,3],[-3,-4],[-3,-3],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-3,3],[-3,4],[-2,-4],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-2,4],[-1,-4],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[-1,4],[0,-5],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,-4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[1,4],[2,-4],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[2,4],[3,-4],[3,-3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[3,3],[3,4],[4,-3],[4,-2],[4,-1],[4,0],[4,1],[4,2],[4,3],[5,0]],f=fieldInfo[player.fieldIn]

            for(let i=0;i<3;i++){

                let r=(Math.random()*a.length)|0,f=a[r]

                gear.tool.sparkStaff.collectPattern.push(f)

                a.splice(r,1)
            }


        },
        desc:'A wand powered by static electricity.<br><br>Collects 30 pollen from 3 random flowers every 0.5s.<br><br>Unlike in the real game, this tool is good :D',
        cost:['60000000 honey']
    },

    porcelainDipper:{
        
        collectPattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],
        collectAmount:{w:3*1.5,r:3,b:3},
        cooldown:0.7,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3,0.4,0.4,0.125,1.5,0.125,false,[1.4,1.4,1.4])
            box(-0.3,-0.1,0.4,0.175,0.5,0.175,false,[1.2,1.2,0])
            cylinder(-0.3,0.45+1.2*0.5+0.5,0.4,0.2,0.075,10,1.5,1.5,1.5,90,0,0)
            cylinder(-0.3,0.45+1.2*0.5+0.5+0.2,0.4,0.125,0.075,10,1.5,1.5,1.5,90,0,0)
            cylinder(-0.3,0.45+1.2*0.5+0.5-0.2,0.4,0.125,0.075,10,1.5,1.5,1.5,90,0,0)
            cylinder(-0.3,0.45+1.2*0.5+0.501,0.4,0.3,-0.8,10,1.4,1.4,1.4,90,0,0)
            box(-0.5,1,0.4,0.175,0.5,0.12,[0,0,70],[0,0,1.4])
            box(-0.5,0.825,0.4,0.175,0.4,0.12,[0,0,-70],[0,0,1.4])
            box(-0.5+0.4,1,0.4,0.175,0.5,0.12,[0,0,-70],[1.4,0,0])
            box(-0.5+0.4,0.825,0.4,0.175,0.4,0.12,[0,0,70],[1.4,0,0])
        },particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.5
            
            let x=-player.bodyDir[2],z=player.bodyDir[0],r=0.325
            
            x+=player.bodyDir[0]
            z+=player.bodyDir[2]
            
            x*=r
            z*=r
            
            ParticleRenderer.add({x:player.body.position.x+x+MATH.random(-0.4,0.4),y:player.body.position.y+1.75+MATH.random(-0.4,0.4),z:player.body.position.z+z+MATH.random(-0.4,0.4),vx:MATH.random(-0.8,0.8),vy:Math.random()*0.5+0.4,vz:MATH.random(-0.8,0.8),grav:-1.25*Math.random()-0.25,size:MATH.random(20,60),col:[0.95,0.95,0.95],life:1,rotVel:MATH.random(-3,3),alpha:0.5})
        },
        ability:function(){
            
            if(player.toolUses%10===0){
                
                objects.explosions.push(new ReverseExplosion({col:[1,1,1],pos:[player.body.position.x,player.body.position.y,player.body.position.z],life:0.4,size:5,alpha:2,height:500}))

                if(player.fieldIn){

                    collectPollen({x:player.flowerIn.x,z:player.flowerIn.z,pattern:[[-4,0],[-3,-2],[-3,-1],[-3,0],[-3,1],[-3,2],[-2,-3],[-2,-2],[-2,-1],[-2,0],[-2,1],[-2,2],[-2,3],[-1,-3],[-1,-2],[-1,-1],[-1,0],[-1,1],[-1,2],[-1,3],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[0,1],[0,2],[0,3],[0,4],[1,-3],[1,-2],[1,-1],[1,0],[1,1],[1,2],[1,3],[2,-3],[2,-2],[2,-1],[2,0],[2,1],[2,2],[2,3],[3,-2],[3,-1],[3,0],[3,1],[3,2],[4,0]],amount:50,stackHeight:0.6+Math.random()*0.5})
                }
            }
        },
        desc:'A dipper drizzled with brittle liquid porcelain.<br><br>Collects 3 pollen from 49 flowers every 0.7s. Collects x1.5 more white pollen.<br><br>Every 10th swing summons a pillar of light that collects massive pollen.',
        cost:['150000000 honey'],

    },
    
    petalWand:{
        
        collectPattern:[[0,0],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[-1,-3],[-1,-4],[-1,-5],[1,-3],[1,-4],[1,-5],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[-1,3],[-1,4],[-1,5],[1,3],[1,4],[1,5],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[3,1],[4,1],[5,1],[3,-1],[4,-1],[5,-1],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-3,1],[-4,1],[-5,1],[-3,-1],[-4,-1],[-5,-1]],
        collectAmount:10,
        cooldown:0.7,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.3-0.1,0.6,0.3+0.1,0.15,1.5,0.15,false,[0,0.7,0])
            box(-0.3-0.1,1.45,0.3+0.1,0.3,0.3,0.3,[45,0,45],[1.5,1.2,0])
            for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/3){
                
                box(-0.3+Math.sin(i)*0.5-0.1,1.35,0.3+0.1+Math.cos(i)*0.5,0.7,0.1,0.7,[Math.sin(i)*-30,0,Math.cos(i)*-30],[1.2,1.2,1.2])
                
            }
            
            for(let i=MATH.QUATER_PI;i<MATH.TWO_PI+MATH.QUATER_PI;i+=MATH.TWO_PI/3){
                
                box(-0.3+Math.sin(i)*0.5-0.1,1.35,0.3+0.1+Math.cos(i)*0.5,0.7,0.1,0.7,[Math.sin(i)*30,0,Math.cos(i)*30],[1.2,1.2,1.2])
                
            }
            
            for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/3){
                
                box(-0.3-0.1+Math.sin(i)*0.5,1.2,0.3+0.1+Math.cos(i)*0.5,0.7,0.1,0.7,[60,i*MATH.TO_DEG,0],[1.2,1.2,1.2])
                box(-0.3-0.1+Math.sin(i)*0.25,1.2,0.3+0.1+Math.cos(i)*0.25,0.7,0.1,0.7,[-60,i*MATH.TO_DEG,0],[1.2,1.2,1.2])
                
            }
        },
        ability:function(){
            
            if(player.toolUses%3===0){
                
                objects.explosions.push(new ReverseExplosion({col:[1,1,0],pos:f.pos,life:0.3,size:this.diameter*0.8,alpha:0.75}))
            }
        },
        particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.3
            
            let x=-player.bodyDir[2],z=player.bodyDir[0],r=0.325
            
            x+=player.bodyDir[0]
            z+=player.bodyDir[2]
            
            x*=r
            z*=r
            
            ParticleRenderer.add({x:player.body.position.x+x,y:player.body.position.y+1.65,z:player.body.position.z+z,vx:MATH.random(-0.9,0.9),vy:Math.random()*0.5+0.2,vz:MATH.random(-0.9,0.9),grav:-1.5,size:MATH.random(20,50),col:[0.9,0.7,0.3],life:0.7,rotVel:MATH.random(-3,3),alpha:0.35})
        },
        desc:'A luxurious flower with enchanted petals.<br><br>Collects 10 pollen from 49 flowers every 0.7s.<br><br>Every 3rd swing summons a flying petal shuriken that collects tokens and causes bees to convert pollen.',
        cost:['1500000000 honey','5 starJelly','25 enzymes','25 glitter']
    },
    
    darkScythe:{
        
        collectPattern:[[0,-3],[0,-4],[1,-5],[1,-4],[1,-3],[2,-5],[2,-4],[2,-3],[3,-3],[3,-5],[4,-1],[-1,-3],[-1,-4],[-2,-3],[-3,-3],[0,-5],[-1,-5],[-2,-4],[-4,-2],[3,-4],[4,-4],[2,-2],[3,-2],[-2,-2],[-3,-2],[-4,-1]],
        collectAmount:13,
        cooldown:0.575,
        mesh:function(box,cylinder,sphere,star){
            
            box(-0.55,0.75,0.55,0.15,2.2,0.15,[0,0,0],[0.1,0,0],[0,0,30])
            box(-0.55,1.6,1.1,0.15,0.6,1.2,[0,0,0],[0.1,0,0],[0,0,30])
            box(-0.55,1.5,2,0.15,0.5,1,[20,0,0],[0.1,0,0],[0,0,30])
            box(-0.55,1.2,2.6,0.15,0.35,1,[40,0,0],[0.1,0,0],[0,0,30])
            
            box(-0.55,1.3,1.1,0.175,0.6*0.3,1.2,[0,0,0],[1.2,0,0.4],[0,0,30])
            box(-0.55,1.2,2,0.175,0.5*0.3,1,[20,0,0],[1.2,0,0.4],[0,0,30])
            box(-0.55,0.9,2.6,0.175,0.3*0.5,0.5,[40,0,0],[1.2,0,0.4],[0,0,30])
            
            box(-0.55,1.95,0.1,0.15,0.15,1.3,[20,0,0],[0.1,0,0],[0,0,30])
            box(-0.55,1.25,0.1,0.15,0.15,0.9,[-20,0,0],[0.1,0,0],[0,0,30])
            
        },
        ability:function(arr){
            
            objects.mobs.push(new DarkScoopingTrail())
            
            if(player.fieldIn&&!player.attacked.length){
                
                let x=Math.round(player.body.position.x-fieldInfo[player.fieldIn].x),z=Math.round(player.body.position.z-fieldInfo[player.fieldIn].z),a=[]
                
                for(let i in arr){
                    
                    let _x=arr[i][0]+x,_z=arr[i][1]+z
                    
                    if(_x>=0&&_x<fieldInfo[player.fieldIn].width&&_x>=0&&_z<fieldInfo[player.fieldIn].length){
                        
                        a.push([_x,_z])
                    }
                }
                
                for(let i in objects.flames){
                    
                    let f=objects.flames[i]
                    
                    if(MATH.indexOfArrays(a,[f.x,f.z])>-1){
                        
                        f.turnDark()
                    }
                }
                
            } else {
                
                for(let i in objects.flames){
                    
                    let f=objects.flames[i]
                    
                    if(f.isStatic&&vec3.sqrDist(f.pos,[player.body.position.x+player.bodyDir[0]*2,player.body.position.y,player.body.position.z+player.bodyDir[2]*2])<7){
                        
                        f.turnDark()
                    }
                }
            }
        },
        particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.05
            
            let x=player.bodyDir[0],y=1.5,z=player.bodyDir[2]*0
            
            x+=-player.bodyDir[2]*1.2
            z+=player.bodyDir[0]*1.2
            
            let r=Math.random()*2.5
            
            x+=player.bodyDir[0]*r
            y-=r*0.25
            z+=player.bodyDir[2]*r
            
            ParticleRenderer.add({x:player.body.position.x+x,y:player.body.position.y+y,z:player.body.position.z+z,vx:-player.bodyDir[2]*2,vy:1.75,vz:player.bodyDir[0]*2,grav:0,size:MATH.random(70,120),col:[1,0,Math.random()],life:1,rotVel:MATH.random(-3,3),alpha:4.5})
        },
        desc:'Swipe through flames to unlock their dark potential. Ensue dark chaos in fields and refuel burning flames, collecting more pollen and dealing more damage. Tend a destructive field of violet fire to enhance your Super-Crit power and Instant Red Conversion.',
        cost:['2500000000000 honey','1500 redExtract','200 stinger','50 hardWax','25 superSmoothie']
    },
    
    tidePopper:{
        
        collectPattern:[[0,0],[-1,0],[1,0],[-2,0],[2,0],[-1,-1],[0,-1],[1,-1],[-1,-2],[0,-2],[1,-2],[-1,-3],[0,-3],[1,-3],[-1,-4],[0,-4],[1,-4],[-1,-5],[0,-5],[1,-5],[0,-6],[0,-7],[0,-8]],
        collectAmount:13,
        cooldown:1,
        mesh:function(box,cylinder,sphere,star,finalRotation){
            
            cylinder(-0.4,2.2,0.4,0.25,0.05,15,1,3,7,90,0,0,0.25)
            cylinder(-0.4,1.6,0.4,0.3,0.05,15,1,3,7,90,0,0,0.3)
            cylinder(-0.4,1.1,0.4,0.4,0.05,15,1,3,7,90,0,0,0.4)
            cylinder(-0.4,1.7,0.4,0.3,2.25,10,0.3,1,2,90,0,0,0)
            box(-0.4,0.5,0.4,0.15,1.4,0.15,false,[0.1,0.8,1.8])
            sphere(-0.4-0.8,0.85,0.4,0.25,1,100,100,100)
            sphere(-0.4+0.8,0.85,0.4,0.25,1,100,100,100)
            sphere(-0.4,0.85,0.4-0.8,0.25,1,100,100,100)
            sphere(-0.4,0.85,0.4+0.8,0.25,1,100,100,100)
            finalRotation(20,-20,0)
            
        },
        ability:function(){
            
            if(player.toolUses%3===0){
                
                objects.mobs.push(new Wave([player.body.position.x,player.body.position.y+0.25,player.body.position.z],player.bodyDir.slice()))
            }
        },
        particles:function(){
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.1
            
            let x=-player.bodyDir[2],z=player.bodyDir[0],r=MATH.random(0.2,0.9)
            
            x+=player.bodyDir[0]
            z+=player.bodyDir[2]
            
            x*=r
            z*=r
            
            ParticleRenderer.add({x:player.body.position.x+x,y:player.body.position.y+MATH.random(0.1,2.5),z:player.body.position.z+z,vx:x,vy:1.6,vz:z,grav:0,size:MATH.random(20,50),col:[0.1,0.7,1],life:0.7,rotVel:MATH.random(-3,3),alpha:0.5})
            
            
        },
        desc:'Pierce through flowers and bubbles with torriental waves, washing away tokens and converting pollen from bees. Swings faster and ramps up the more you pop, then unleashes tidal waves in a violent surge at 500 bubbles. Splash Balloons with tall waves to earn Tide Blessing and re-energize tidal waves with the destruction of bubbles.',
        cost:['2500000000000 honey','1500 blueExtract','200 stinger','25 swirledWax','25 superSmoothie']
    },
    
    gummyBaller:{
        
        collectPattern:[[-3,-3],[-2,-5],[-2,-4],[-2,-3],[-2,-2],[-2,-1],[-1,-5],[-1,-4],[-1,-3],[-1,-2],[-1,-1],[0,-6],[0,-5],[0,-4],[0,-3],[0,-2],[0,-1],[0,0],[1,-5],[1,-4],[1,-3],[1,-2],[1,-1],[2,-5],[2,-4],[2,-3],[2,-2],[2,-1],[3,-3]],
        collectAmount:16,
        cooldown:1,
        mesh:function(box,cylinder,sphere,star){
            
            cylinder(-0.4,-0.1,0.4,0.15,0.35,15,0.26,2.7,1.1,90,0,0,0.15)
            cylinder(-0.4,0.8,0.4,0.1,1.75,15,1.5,0.15,1.5,90,0,0,0.1)
            sphere(-0.4,1.6,0.4,0.5,1,0.26,2.7,1.1)
            cylinder(-0.4,1.75,0.4,0.45,0.25,15,1.5,0.15,1.5,90,0,0,0.6)
            sphere(-0.4-0.3,1.85,0.4,0.25,1,0.26,2.7,1.1)
            sphere(-0.4+0.3,1.85,0.4,0.25,1,0.26,2.7,1.1)
            sphere(-0.4,1.85,0.4-0.3,0.25,1,1.5*1.75,0.65*1.75,1.5*1.75)
            sphere(-0.4,1.85,0.4+0.3,0.25,1,1.5*1.75,0.65*1.75,1.5*1.75)
            
        },
        particles:function(){
            
            let x=(-player.bodyDir[2]+player.bodyDir[0])*0.4,z=(player.bodyDir[0]+player.bodyDir[2])*0.4
            
            player.lagPos[0]+=(player.body.position.x-player.lagPos[0])*dt*12.5
            player.lagPos[1]+=(player.body.position.y-player.lagPos[1])*dt*12.5
            player.lagPos[2]+=(player.body.position.z-player.lagPos[2])*dt*12.5
            
            meshes.explosions.instanceData.push(player.lagPos[0]+x,player.lagPos[1]+2+player.gummyBallSize*0.3,player.lagPos[2]+z,0.9*player.isNight,0.18*player.isNight,0.9*player.isNight,1,player.gummyBallSize*0.5,1)
            
            toolParticle-=dt
            
            if(toolParticle>0){return}
            
            toolParticle=0.4/player.gummyBallSize
            
            ParticleRenderer.add({x:player.lagPos[0]+x,y:player.lagPos[1]+2+player.gummyBallSize*0.3,z:player.lagPos[2]+z,vx:MATH.random(-player.gummyBallSize,player.gummyBallSize),vy:MATH.random(-player.gummyBallSize,player.gummyBallSize),vz:MATH.random(-player.gummyBallSize,player.gummyBallSize),grav:0,size:MATH.random(20,50)*player.gummyBallSize,col:[0.1,0.8,1],life:0.75,rotVel:MATH.random(-3,3),alpha:player.gummyBallSize-0.5})
            
        },
        desc:'Absorb goo to conjure up a delectable arsenal of gummy wrecking balls. Cover the field in goo and collect pollen with a giant gummyball. Release your gummyball early by jumping. Ricochet off Marks and Honey Tokens to build up your gummyball combo for massive gooey gains.',
        cost:['10000000000000 honey','1500 glue','2500 gumdrops','50 causticWax','3 turpentine']
    },
}


player=(function(out){
    
    out.drives={
        
        red:50,
        blue:50,
        white:50,
        glitched:50
    }

    out.updateRoboChallenge=function(){

        if(!out.roboChallenge) return

        out.roboChallenge.timer-=dt

        if(out.roboChallenge.timer<=0){

            out.roboChallenge=undefined
            document.getElementById('roboMenu').style.display='none'
            return
        }
    }
    
    out.updateRoboUI=function(){

        document.getElementById('roboMenu').style.display='block'

        switch(out.roboChallenge.scene){

            case 'upgrade':

                document.getElementById('roboTitle').innerHTML="Buy Upgrades<p style='font-size:14.5px;margin-top:0px'><u style='cursor:pointer'>Reroll Upgrades</u> ("+out.roboChallenge.rerollCost+" cogs)</p>"
                document.getElementById('roboBeeChoices').style.display='none'
                document.getElementById('roboQuestChoices').style.display='none'
                document.getElementById('roboUpgradeChoices').style.display='block'
                document.getElementById('roboActiveBees').style.display='none'
                document.getElementById('roboActiveBeesAmount').style.display='none'
                document.getElementById('roboActiveUpgrades').style.display='block'
                document.getElementById('roboActiveUpgradesAmount').style.display='block'

                let upgrades={Botnet:'*1.25 pollenFromBees',Iterate:'*1.08 pollen',Sharpen:'*1.2 beeAttack,*0.9 capacity'},u=[],c=[]

                for(let i in upgrades){

                    if(out.roboChallenge.activeUpgrades.indexOf(i)<0){

                        u.push(i)
                    }
                }

                for(let i=0,_i=Math.min(3,u.length);i<_i;i++){

                    let r=(Math.random()*u.length)|0

                    c.push(u[r])
                    u.splice(r,1)
                }

                for(let i=1;i<4;i++){

                    let s='',_s=upgrades[c[i-1]].split(',')

                    for(let j in _s){

                        let n=_s[j]

                        n=n.substring(0,n.indexOf(' ')+1)+MATH.doGrammar(n.substring(n.indexOf(' ')+1,n.length))

                        s+='<div style="color:'+(Number(n.substring(1,n.indexOf(' ')))<1?'rgb(255,50,50)':'rgb(60,255,60)')+'">'+n.replace('*','x')+'<br></div>'
                    }

                    document.getElementById('roboUpgradeChoice'+i).innerHTML='&nbsp;'+c[i-1]+"<div style='border-radius:5px;position:fixed;left:10px;top:35px;right:5px;bottom:5px;background-color:rgb(0,0,0,0.75);font-family:trebuchet ms;font-size:14px;padding-left:10px;padding-top:8px'>"+s+"</div>"

                    document.getElementById('roboUpgradeChoice'+i).onclick=function(){

                        out.roboChallenge.scene=''
                        out.updateRoboUI()
                    }
                }

            break

            case 'quest':

                document.getElementById('roboTitle').innerHTML="Select Quest<p style='font-size:14.5px;margin-top:0px'><u style='cursor:pointer'>Reroll Quests</u> ("+out.roboChallenge.rerollCost+" cogs)</p>"
                document.getElementById('roboBeeChoices').style.display='none'
                document.getElementById('roboQuestChoices').style.display='block'
                document.getElementById('roboActiveBees').style.display='none'
                document.getElementById('roboActiveBeesAmount').style.display='none'
                document.getElementById('roboActiveUpgrades').style.display='none'
                document.getElementById('roboActiveUpgradesAmount').style.display='none'
                document.getElementById('roboUpgradeChoices').style.display='none'

                let types=['redPollen','whitePollen','bluePollen','pollenFromSunflowerField','pollenFromDandelionField','pollenFromMushroomField','pollenFromBlueFlowerField','pollenFromCloverField','pollenFromSpiderField','pollenFromStrawberryField','pollenFromBambooField','pollenFromPineapplePatch','pollenFromCactusField','pollenFromPumpkinPatch','pollenFromPineTreeForest','pollenFromRoseField']

                if(out.roboChallenge.round>5) types.push('pollenFromMountainTopField')
                if(out.roboChallenge.round>10) types.push('pollenFromPepperPatch')

                if(out.roboChallenge.round>2) types.push('mechsquito')
                if(out.roboChallenge.round>4) types.push('cogmower')
                if(out.roboChallenge.round>8) types.push('cogturret')
                if(out.roboChallenge.round>11) types.push('megaMechsquito')
                if(out.roboChallenge.round>15) types.push('goldenCogmower')

                for(let i=1;i<3;i++){

                    let q=[],t=types.slice(),re=[]

                    for(let j=0,c=MATH.random(2,5)|0;j<c;j++){

                        let r=(Math.random()*t.length)|0

                        re.push(t[r])
                        t.splice(r,1)
                    }

                    document.getElementById('roboQuestChoice'+i).innerHTML='<br>'

                    for(let j in re){

                        document.getElementById('roboQuestChoice'+i).innerHTML+='- '+MATH.doStatGrammar(re[j])+' '+10+' '+MATH.doGrammar(re[j])+'<br><br>'
                    }

                    document.getElementById('roboQuestChoice'+i).onclick=function(){

                        out.roboChallenge.scene='upgrade'
                        out.updateRoboUI()
                    }
                }

            break

            case 'bee':

                if(out.roboChallenge.beesPicked>=out.roboChallenge.beesPerRound){

                    out.roboChallenge.scene='quest'
                    out.updateRoboUI()
                    return
                }

                document.getElementById('roboTitle').innerHTML="<p style='margin-top:-15px'></p>Select Bees<p style='font-size:13px;margin-top:0px'>("+(out.roboChallenge.beesPicked+1)+" of "+out.roboChallenge.beesPerRound+")<br><u>Reroll Bees</u> ("+out.roboChallenge.rerollCost+" cogs)</p>"
                document.getElementById('roboActiveBeesAmount').innerHTML="Active Bees ("+out.roboChallenge.activeBees.length+")"
                document.getElementById('roboBeeChoices').style.display='block'
                document.getElementById('roboQuestChoices').style.display='none'
                document.getElementById('roboActiveBeesAmount').style.display='block'
                document.getElementById('roboActiveUpgrades').style.display='none'
                document.getElementById('roboActiveUpgradesAmount').style.display='none'
                document.getElementById('roboUpgradeChoices').style.display='none'

                let beesToSelect=[],strActiveBees='#'+out.roboChallenge.activeBees.join('#')+'#'

                for(let y in out.hive){

                    for(let x in out.hive[y]){

                        let h=out.hive[y][x]

                        if(h.type!==null&&strActiveBees.indexOf('#'+x+','+y+'#')<0){

                            beesToSelect.push([x,y])
                        }
                    }
                }

                document.getElementById('roboActiveBees').innerHTML=''
                document.getElementById('roboActiveBees').style.display='block'

                for(let i in out.roboChallenge.activeBees){

                    let b=out.roboChallenge.activeBees[i]

                    b=out.hive[b[1]][b[0]].bee

                    let img=document.createElement('canvas')

                    img.width=35
                    img.height=35
                    img.style.width=35
                    img.style.height=35
                    img.style.borderRadius='2px'
                    img.style.position='fixed'
                    img.style.left=(((i%5)+0.5-2.5)*20+50)+'%'
                    img.style.top=(((i/5)|0)*10+5)+'%'
                    img.style.transform='translate(-17px,-17px)'

                    let img_ctx=img.getContext('2d')

                    img_ctx.drawImage(beeCanvas,beeInfo[b.type].u*2048,beeInfo[b.type].v*2048+(b.gifted?768:0),128,128,0,0,35,35)

                    document.getElementById('roboActiveBees').appendChild(img)

                }

                for(let i=0;i<3;i++){

                    if(beesToSelect.length<=0){

                        document.getElementById('roboBeeChoice'+(i+1)).style.display='none'
                        return
                    }

                    let r=(Math.random()*beesToSelect.length)|0,bee=beesToSelect[r],_bee=bee.slice()

                    bee=out.hive[bee[1]][bee[0]].bee

                    beesToSelect.splice(r,1)

                    document.getElementById('roboBeeChoice'+(i+1)).style.display='block'
                    document.getElementById('roboBeeChoice'+(i+1)).style.backgroundColor=beeInfo[bee.type].color==='red'?'rgb(255,50,50,0.6)':beeInfo[bee.type].color==='blue'?'rgb(50,50,255,0.6)':'rgb(255,255,255,0.6)'

                    let img=document.createElement('canvas')

                    img.width=80
                    img.height=80
                    img.style.borderRadius='4px'
                    img.style.position='fixed'
                    img.style.left='3%'
                    img.style.top='10%'

                    let img_ctx=img.getContext('2d')

                    img_ctx.drawImage(beeCanvas,beeInfo[bee.type].u*2048,beeInfo[bee.type].v*2048+(bee.gifted?768:0),128,128,0,0,80,80)

                    let descStr='Level: '+bee.level+'<br>'+(bee.gifted?'⭐ Gifted ⭐':'')+(bee.mutation?'<br>☢️ '+bee.mutation.oper.replace('*','x')+bee.mutation.num+' '+MATH.doGrammar(bee.mutation.stat)+' ☢️':'')+(out.hive[_bee[1]][_bee[0]].beequip?'<br>Beequip: '+MATH.doGrammar(out.hive[_bee[1]][_bee[0]].beequip.type):'')

                    document.getElementById('roboBeeChoice'+(i+1)).innerHTML="<p style='position:fixed;width:200px;height:30px;left:67%;top:-3%;transform:translate(-50%,-50%)'>"+MATH.doGrammar(bee.type)+" Bee</p><p style='position:fixed;width:200px;left:67%;top:50%;transform:translate(-50%,-50%);font-size:11px'>"+descStr+"</p>"
                    document.getElementById('roboBeeChoice'+(i+1)).appendChild(img)

                    document.getElementById('roboBeeChoice'+(i+1)).onclick=function(){

                        out.roboChallenge.activeBees.push([Number(_bee[0]),Number(_bee[1])])
                        out.roboChallenge.beesPicked++
                        out.updateRoboUI()
                    }
                }

            break
        }
    }

    out.endAntChallenge=function(){

        if(!out.antChallenge) return
        
        out.addMessage('The Ant Challenge is over! Your score is '+out.antChallenge.score+'!')
        out.antChallenge=false
    }

    out.updateAntChallenge=function(){

        if(!out.antChallenge) return

        out.antChallenge.timer-=dt
        out.antChallenge.spawnDelay-=dt
        out.antChallenge.lawnMowerTimer-=dt

        if(out.antChallenge.timer<=0){

            player.body.position.x=-21
            player.body.position.y=6
            player.body.position.z=-44.5
            player.yaw=0
            out.endAntChallenge()
            return
        }

        if(out.antChallenge.lawnMowerTimer<=0){

            objects.mobs.push(new LawnMower(out.antChallenge.round))
            out.antChallenge.lawnMowerTimer=Math.max(-0.33333*out.antChallenge.round+15,2)
        }

        if(out.stats.pollenFromAntField-out.antChallenge.pollenBeforeReq>=out.antChallenge.pollenReq&&out.antChallenge.spawnDelay<=0){

            out.antChallenge.round++
            out.antChallenge.spawnDelay=2
            out.antChallenge.pollenReq+=500*out.antChallenge.round

            let _p=[
                [
                    [0.2,0.25],
                    [0.8,0.25],
                    [0.2,0.75],
                    [0.8,0.75],
                ],[
                    [0.25,0.5],
                    [0.5,0.5],
                    [0.75,0.5],
                ],[
                    [0.2,0.2],
                    [0.2,0.8],
                    [0.8,0.2],
                    [0.8,0.8],
                    [0.5,0.5],
                ],[
                    [0.5,0.25],
                    [0.25,0.5],
                    [0.5,0.75],
                    [0.75,0.5],
                ],[
                    [0.5,0.333],
                    [0.333,0.666],
                    [0.666,0.666],
                ],[
                    [0.5,0.666],
                    [0.333,0.333],
                    [0.666,0.333],
                ],[
                    [0.1,0.1],
                    [0.9,0.9],
                ],[
                    [0.9,0.1],
                    [0.1,0.9],
                ],
            ],p=_p[(Math.random()*_p.length)|0],t=['ant','ant','ant','ant','ant','armyAnt','armyAnt','armyAnt','fireAnt','fireAnt','flyingAnt','flyingAnt','flyingAnt','giantAnt']

            for(let i in p){

                objects.mobs.push(new Ant(out.antChallenge.round,...p[i],t[(Math.random()*t.length)|0]))
            }

            if(Math.random()<0.25){

                window.setTimeout(function(){
                    
                    p=_p[(Math.random()*_p.length)|0]

                    for(let i in p){

                        objects.mobs.push(new Ant(out.antChallenge.round,...p[i],t[(Math.random()*t.length)|0]))
                    }

                },750)                
            }
                
        }

        if(out.antChallenge.spawnDelay<=0){

            textRenderer.addSingle(MATH.addCommas((out.antChallenge.pollenReq-(out.stats.pollenFromAntField-out.antChallenge.pollenBeforeReq))+''),[-21,8,-61],COLORS.whiteArr,-3,false,false)

        } else {

            out.antChallenge.pollenBeforeReq=out.stats.pollenFromAntField
            textRenderer.addSingle(out.antChallenge.spawnDelay.toFixed(1)+'s',[-21,8,-61],COLORS.whiteArr,-3,false,false)
        }

        textRenderer.addSingle('Time: '+MATH.doTime(out.antChallenge.timer),[-15,9,-63],COLORS.whiteArr,-3,false,false,0,0.5)
        textRenderer.addSingle('Round: '+out.antChallenge.round,[-15,9,-63],COLORS.whiteArr,-3,false,false,0,0)
        textRenderer.addSingle('Score: '+out.antChallenge.score,[-15,9,-63],COLORS.whiteArr,-3,false,false,0,-0.5)
    }
    
    out.showGeneratedAmulet=function(type,amulet){

        let prev_type=type.indexOf('Star')>-1?'Star':0
        prev_type=prev_type||(type.indexOf('Ant')>-1?'Ant':0)
        prev_type=prev_type||(type.indexOf('Stickbug')>-1?'Stickbug':0)
        prev_type=prev_type||(type.indexOf('Shell')>-1?'Shell':0)
        prev_type=prev_type||(type.indexOf('Cog')>-1?'Cog':0)

        if(prev_type){

            for(let i in out.currentGear){

                if(i.indexOf('Amulet')>-1&&i.indexOf(prev_type)){

                    prev_type=i
                }
            }

        } else {

            prev_type=type
        }

        let final=[]

        for(let i in amulet){if(amulet[i].indexOf('POLLEN')>-1){final.push(amulet[i].replace('POLLEN','redPollen'),amulet[i].replace('POLLEN','bluePollen'),amulet[i].replace('POLLEN','whitePollen'));continue}if(amulet[i].indexOf('INSTANT_CONVERSION')>-1){final.push(amulet[i].replace('INSTANT_CONVERSION','instantRedConversion'),amulet[i].replace('INSTANT_CONVERSION','instantBlueConversion'),amulet[i].replace('INSTANT_CONVERSION','instantWhiteConversion'));continue}final.push(amulet[i])}

        final=final.join(',')

        document.getElementById('amuletUI').style.display='block'
        document.getElementById('amuletType').innerHTML=MATH.doGrammar(type)

        let uncleaned=player.currentGear[prev_type]?player.currentGear[prev_type].split(','):[],cleaned=[]

        for(let i in uncleaned){

            if(!uncleaned[i]) continue

            let a=uncleaned[i],a_num=a.substring(0,a.indexOf(' ')),a_stat=a.substring(a.indexOf(' ')+1,a.length),a_color=a_stat.toLowerCase().indexOf('red')>-1?'red':0

            a_color=a_color||(a_stat.toLowerCase().indexOf('white')>-1?'white':0)
            a_color=a_color||(a_stat.toLowerCase().indexOf('blue')>-1?'blue':0)

            let isShared,got3Instances=[a_color]

            for(let j in uncleaned){

                let b=uncleaned[j],b_num=b.substring(0,b.indexOf(' ')),b_stat=b.substring(b.indexOf(' ')+1,b.length)

                if(a!==b&&a_num===b_num){

                    let b_color=b_stat.toLowerCase().indexOf('red')>-1?'red':0
                    b_color=b_color||(b_stat.toLowerCase().indexOf('white')>-1?'white':0)
                    b_color=b_color||(b_stat.toLowerCase().indexOf('blue')>-1?'blue':0)

                    if(a_color!==b_color&&a_stat.replaceAll('White','').replaceAll('Red','').replaceAll('Blue','').replaceAll('red','').replaceAll('blue','').replaceAll('white','')===b_stat.replaceAll('White','').replaceAll('Red','').replaceAll('Blue','').replaceAll('red','').replaceAll('blue','').replaceAll('white','')){
                        
                        got3Instances.push(b_color)
                        isShared=true
                    }
                }
            }

            if(isShared&&got3Instances.length===3&&got3Instances.indexOf('red')>-1&&got3Instances.indexOf('blue')>-1&&got3Instances.indexOf('white')>-1){

                cleaned.push(a.replaceAll('White','').replaceAll('Red','').replaceAll('Blue','').replaceAll('red','').replaceAll('blue','').replaceAll('white',''))

            } else {

                cleaned.push(a)
            }
        }
        
        uncleaned=cleaned.slice()
        cleaned=[]

        for(let i in uncleaned){

            if(cleaned.indexOf(uncleaned[i])<0){

                cleaned.push(uncleaned[i])
            }
        }

        document.getElementById('oldAmuletStats').innerHTML=player.currentGear[prev_type]?cleaned.map(x=>x.split(' ')[0]+' '+MATH.doGrammar(x.split(' ')[1])).map(x=>x[0]==='+'?'+'+((Number(x.substr(1,x.indexOf(' ')))*100)|0)+'%'+x.substr(x.indexOf(' '),x.length):x).join('<br>').replaceAll('*','x').replace(' Multiplier','').replaceAll(' Passive','').replaceAll('P ','Passive: '):'<p style="font-size:25px;padding-left:10px;margin-top:2px">None</p>'

        document.getElementById('newAmuletStats').innerHTML=amulet.map(x=>x.split(' ')[0]+' '+MATH.doGrammar(x.split(' ')[1].replace('INSTANT_CONVERSION','instantConversion').replace('POLLEN','pollen'))).map(x=>x[0]==='+'?'+'+((Number(x.substr(1,x.indexOf(' ')))*100)|0)+'%'+x.substr(x.indexOf(' '),x.length):x).join('<br>').replaceAll('*','x').replace(' Multiplier','').replaceAll(' Passive','').replaceAll('P ','Passive: ')

        document.getElementById('keepAmulet').onclick=function(){

            document.getElementById('amuletUI').style.display='none'
        }
        
        document.getElementById('replaceAmulet').onclick=function(){

            document.getElementById('amuletUI').style.display='none'
            
            let isOfType=type.indexOf('Star')>-1?'Star':0
            isOfType=isOfType||type.indexOf('Ant')>-1?'Ant':0
            isOfType=isOfType||type.indexOf('Stickbug')>-1?'Stickbug':0
            isOfType=isOfType||type.indexOf('Shell')>-1?'Shell':0
            isOfType=isOfType||type.indexOf('Cog')>-1?'Cog':0

            if(isOfType){

                for(let i in out.currentGear){

                    if(i.indexOf('Amulet')>-1&&i.indexOf(isOfType)){

                        delete out.currentGear[i]
                    }
                }
            }

            out.currentGear[type]=final
            out.updateGear()
        }
    }
    
    out.eKeyDialoguePress=0

    out.sunSwitchTimer=60
    out.skyColor=[0.4,0.6,1]
    out.isNight=0.999
    
    out.targetLight=1
    
    out.radioactiveParticleTimer=0
    out.setting_enablePollenText=true
    
    out.damage=(am)=>{
        
        out.health-=am-am*out.defense
        out.stats.coconutShield++
        textRenderer.add((am|0)+'',[out.body.position.x,out.body.position.y+Math.random()*1.5+1.5,out.body.position.z],[255,0,0],0,'',1.25)
    }
    
    out.lagPos=[0,0,0]
    out.stats={
        
        hoursOfInvigoratingNectar:0,
        hoursOfMotivatingNectar:0,
        hoursOfSatisfyingNectar:0,
        hoursOfComfortingNectar:0,
        hoursOfRefreshingNectar:0,
        tokensFromPlanters:0,
        tokensFromSprouts:0,
        timesUsingTheRedCannon:0,
        timesUsingTheBlueCannon:0,
        timesUsingTheYellowCannon:0,
        timesUsingTheSlingshot:0,
        itemsUsingTheBlender:0,
        fallingCoconuts:0,
        flames:0,
        bubbles:0,
        redPollen:0,
        bluePollen:0,
        whitePollen:0,
        pollen:0,
        abilityTokens:0,
        honeyTokens:0,
        rhinoBeetle:0,
        ladybug:0,
        spider:0,
        werewolf:0,
        mantis:0,
        scorpion:0,
        kingBeetle:0,
        tunnelBear:0,
        ant:0,
        fireAnt:0,
        armyAnt:0,
        flyingAnt:0,
        giantAnt:0,
        mondoChick:0,
        rogueViciousBee:0,
        goo:0,
        popStar:0,
        scorchingStar:0,
        coconutShield:0,
        stingerUsed:0,
        gummyMorph:0,
        gummyStar:0,
    }
    
    for(let i in items){
        
        out.stats[i+'Tokens']=0
        out.stats[i]=0
    }
    
    for(let i in LIST_OF_STATS_FOR_PLAYER){
        
        out.stats[LIST_OF_STATS_FOR_PLAYER[i]]=0
    }
    
    out.precomputedStats={
        
        redFieldCapacity:1,
        blueFieldCapacity:1,
        whiteFieldCapacity:1,
        hasteStacks:0,
        gliderSpeed:0,
        gliderFall:0,
        walkSpeed:120,
        jumpPower:10,
        criticalChance:0,
        criticalPower:2,
        instantRedConversion:0,
        instantWhiteConversion:0,
        instantBlueConversion:0,
        redBombPollen:1,
        whiteBombPollen:1,
        blueBombPollen:1,
        instantBombConversion:0,
        honeyPerPollen:1,
        convertRate:1,
        redConvertRate:1,
        blueConvertRate:1,
        whiteConvertRate:1,
        convertRateAtHive:1,
        whitePollen:1,
        redPollen:1,
        bluePollen:1,
        capacity:0,
        flameFuel:false,
        beeSpeed:1,
        honeyAtHive:1,
        tokenLifespan:1,
        redBeeAbilityRate:1,
        blueBeeAbilityRate:1,
        whiteBeeAbilityRate:1,
        beeAttack:1,
        beeEnergy:1,
        flameHeatStack:1,
        superCritChance:0,
        superCritPower:2,
        lootLuck:1,
        bubblePollen:1,
        flamePollen:1,
        goo:1,
        tidePower:1,
        tidalSurge:false,
        collectorSpeed:1,
        honeyFromTokens:1,
        gummyBallSize:1,
        defense:0,
        whiteBeeAttack:0,
        redBeeAttack:0,
        blueBeeAttack:0,
        movementCollection:0,
        pollenFromBees:1,
        pollenFromTools:1,
        pollenFromCoconuts:1,
        instantFlameConversion:0,
        markDuration:1,
        redBombSync:false,
        blueBombSync:false,
        flameLife:1,
        abilityDuplicationChance:0
    }
    
    out.defaultStats={}
    
    out.quests=[]
    
    out.addQuest=function(name,req,NPC){
        
        for(let i in req){
            
            req[i].push(out.stats[req[i][0]])
        }
        
        out.quests=[{name:name,req:req,NPC:NPC},...out.quests]
        
        NPCs[NPC].activeQuest=true
    }
    
    dialogueBox.onclick=function(){
        
        if(typeof NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]==='object'){
            
            return
        }
        
        NPCs[out.currentNPC].dialogueIndex++
        
        if(typeof NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]==='string'){
            
            NPCDialogue.innerHTML=NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]
            
        } else if(typeof NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]==='function'){
            
            NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]()
            NPCs[out.currentNPC].dialogueIndex++
            out.currentNPC=null
            dialogueBox.style.display='none'
            out.viewMatrixToChange=undefined
            uiCanvas.requestPointerLock()
            
        } else if(typeof NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]==='object'){
            
            let htmlCode=''
            
            for(let i in NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]){
                
                htmlCode+='<button style="border-radius:5px;background-color:rgb(30,70,255);width:420px;height:30px;font-size:17px;font-family:cursive;text-align:start;border:none;color:rgb(255,255,255);margin-top:10px;padding-bottom:10px;" onclick="window.NPCDialogueChoice'+i+'()">• '+NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex][i][0]+'</button>'
                window['NPCDialogueChoice'+i]=NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex][i][1]
            }
            
            NPCDialogue.innerHTML=htmlCode
            
            
        } else {
            
            out.currentNPC=null
            dialogueBox.style.display='none'
            out.viewMatrixToChange=undefined
        }
    }
    
    out.onStartChat=function(i){
        
        out.eKeyDialoguePress=TIME

        if(NPCs[i].dialogue[NPCs[i].dialogueIndex]===undefined){
            
            if(NPCs[i].repeatable){
                
                NPCs[i].dialogue.push(...window['dialogue_'+i](out,items,NPCs))

            } else {

                player.addMessage(MATH.doGrammar(i)+' has nothing to say anymore!',COLORS.redArr)
                return
            }
        }
        
        out.currentNPC=i
        actionWarning.style.display='none'
        dialogueBox.style.display='block'
        document.exitPointerLock()
        NPCName.innerHTML=MATH.doGrammar(out.currentNPC)
        NPCDialogue.innerHTML=NPCs[out.currentNPC].dialogue[NPCs[out.currentNPC].dialogueIndex]
        out.viewMatrixToChange=NPCs[player.currentNPC].viewMatrix
        out.viewMatrixCopy=out.viewMatrix.slice()
        out.easeAmount=0
        
    }
    
    out.onStartShop=function(){
        
        document.exitPointerLock()
        shopUI.style.display='block'
        shops[out.currentShop].currentIndex=0
        out.viewMatrixToChange=shops[out.currentShop].items[shops[out.currentShop].currentIndex].viewMatrix
        out.viewMatrixCopy=out.viewMatrix.slice()
        out.easeAmount=0
        itemName.innerHTML=MATH.doGrammar(shops[out.currentShop].items[shops[out.currentShop].currentIndex].name)
        itemDesc.innerHTML=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].desc
        
        itemCostSVG.innerHTML=''
        
        let cost=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].cost
        
        for(let i in cost){
            
            let c=cost[i].split(' ')
            
            itemCostSVG.innerHTML+=itemSVGCode[c[1]].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','x'+(c[0].length<6?MATH.addCommas(c[0]):MATH.abvNumber(c[0]))).replaceAll('TEXTCOLORDEPENDINGONIFENOUGHITEMS',c[1]==='honey'&&player.honey<Number(c[0])||c[1]!=='honey'&&items[c[1]].amount<Number(c[0])?'rgb(255,0,0)':'rgb(255,255,255)')
        }
        
        leftShopButton.onclick=function(){
            
            shops[out.currentShop].currentIndex=(shops[out.currentShop].currentIndex+shops[out.currentShop].items.length-1)%shops[out.currentShop].items.length
            out.viewMatrixToChange=shops[out.currentShop].items[shops[out.currentShop].currentIndex].viewMatrix
            out.easeAmount=0
            itemName.innerHTML=MATH.doGrammar(shops[out.currentShop].items[shops[out.currentShop].currentIndex].name)
            itemDesc.innerHTML=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].desc
            
            itemCostSVG.innerHTML=''
            
            let cost=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].cost
            
            for(let i in cost){
                
                let c=cost[i].split(' ')
                
                itemCostSVG.innerHTML+=itemSVGCode[c[1]].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','x'+(c[0].length<6?MATH.addCommas(c[0]):MATH.abvNumber(c[0]))).replaceAll('TEXTCOLORDEPENDINGONIFENOUGHITEMS',c[1]==='honey'&&player.honey<Number(c[0])||c[1]!=='honey'&&items[c[1]].amount<Number(c[0])?'rgb(255,0,0)':'rgb(255,255,255)')
            }
        
        }
        rightShopButton.onclick=function(){
            
            shops[out.currentShop].currentIndex=(shops[out.currentShop].currentIndex+1)%shops[out.currentShop].items.length
            out.viewMatrixToChange=shops[out.currentShop].items[shops[out.currentShop].currentIndex].viewMatrix
            out.easeAmount=0
            itemName.innerHTML=MATH.doGrammar(shops[out.currentShop].items[shops[out.currentShop].currentIndex].name)
            itemDesc.innerHTML=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].desc
            
            itemCostSVG.innerHTML=''
        
            let cost=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].cost
            
            for(let i in cost){
                
                let c=cost[i].split(' ')
                
                itemCostSVG.innerHTML+=itemSVGCode[c[1]].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','x'+(c[0].length<6?MATH.addCommas(c[0]):MATH.abvNumber(c[0]))).replaceAll('TEXTCOLORDEPENDINGONIFENOUGHITEMS',c[1]==='honey'&&player.honey<Number(c[0])||c[1]!=='honey'&&items[c[1]].amount<Number(c[0])?'rgb(255,0,0)':'rgb(255,255,255)')
            }
            
        }
        actionWarning.onclick=function(){
            
            out.currentShop=undefined
            out.viewMatrixToChange=undefined
            shopUI.style.display='none'
        }
        
        purchaseButton.onclick=function(){
            
            if(shops[out.currentShop].items[shops[out.currentShop].currentIndex].owned){
                
                out.currentGear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot]=shops[out.currentShop].items[shops[out.currentShop].currentIndex].name
                out.updateGear()
                return
            }
            
            let cost=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].cost
            
            for(let i in cost){
                
                let c=cost[i].split(' ')
                
                if(c[1]==='honey'&&player.honey<Number(c[0])||c[1]!=='honey'&&items[c[1]].amount<Number(c[0])){
                    
                    return
                }
            }
            
            for(let i in cost){
                
                let c=cost[i].split(' ')
                
                if(c[1]==='honey'){
                    
                    player.honey-=Number(c[0])
                    
                } else {
                    
                    items[c[1]].amount-=Number(c[0])
                }
            }
            
            shops[out.currentShop].items[shops[out.currentShop].currentIndex].owned=true
            out.currentGear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot]=shops[out.currentShop].items[shops[out.currentShop].currentIndex].name
            out.updateInventory()
            out.updateGear()
        }
    }
    
    out.health=100
    out.respawnTimer=3
    out.dead=false
    
    out.respawn=function(){
        
        out.health=100
        out.dead=false
        out.body.position.x=10
        out.body.position.y=0
        out.body.position.z=0
        out.endAntChallenge()
    }
    
    out.attacked=[]
    
    out.messages=[]
    
    out.beeHighlightMesh=new Mesh(true)
    
    out.statsStringLastUpdate=0
    out.statsString=''
    
    out.itemDragging=''
    out.beequipDragging=''
    
    out.updateInventory=function(){
        
        for(let i in items){
            
            if(items[i].amount===0){
                
                items[i].svg.style.display='none'
                
            } else {
                
                items[i].svg.style.display='inline'
                items[i].amountText.textContent='x'+items[i].amount
            }
            
            for(let j in hotbarSlots){
                
                if(hotbarSlots[j].itemType===i){
                    
                    hotbarSlots[j].innerHTML=itemSVGCode[hotbarSlots[j].itemType].replaceAll('AMOUNTININVENTORY',items[hotbarSlots[j].itemType].amount).replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','').replace('translate(0px,7px)','translate(-2px,2px)').replace('scale(0.77,0.77)','scale(0.5,0.5)')
                }
            }
        }
    }
    
    out.addItem=function(item,amount){
        
        items[item].amount+=amount
        out.updateInventory()
    }
    
    out.updateInventory()
    
    out.hiveBalloon={pollen:0,size:0,displaySize:0,maxPollen:0,blessing:0,deflateTimer:0}
    
    out.updateHiveBalloon=function(){
        
        if(!out.hiveBalloon.pollen){
            
            if(out.hiveBalloon.maxPollen&&!player.converting){
                
                player.addEffect('balloonBlessing',undefined,player.hiveBalloon.blessing)
                player.addMessage('The hive balloon granted x'+player.hiveBalloon.blessing+' balloon blessing!')
                player.hiveBalloon.maxPollen=0
            }
            
            out.hiveBalloon.size=0
            out.hiveBalloon.displaySize=0
            return
        }
        
        out.hiveBalloon.deflateTimer-=dt
        
        if(out.hiveBalloon.deflateTimer<=0){
            
            out.hiveBalloon.deflateTimer=10
            out.hiveBalloon.pollen=Math.round(out.hiveBalloon.pollen)
            
            let f=out.hiveBalloon.pollen/out.capacity
            
            f*=0.00075
            out.hiveBalloon.pollen-=out.hiveBalloon.pollen*f
        }
        
        out.hiveBalloon.pollen=Math.round(out.hiveBalloon.pollen)
        
        let p=out.hiveBalloon.pollen.toString()
        out.hiveBalloon.size=((Math.pow(out.hiveBalloon.pollen,1/7)*2-2)/20)+0.5
        
        out.hiveBalloon.displaySize+=(out.hiveBalloon.size-out.hiveBalloon.displaySize)*0.015
        
        meshes.explosions.instanceData.push(out.hivePos[0]+1.5,out.hivePos[1]-1.5+out.hiveBalloon.displaySize*0.5,out.hivePos[2]+3,0,0,0.6*player.isNight,0.75,out.hiveBalloon.displaySize,1.05)
            
        meshes.cylinder_explosions.instanceData.push(out.hivePos[0]+1.5,out.hivePos[1]-2.5,out.hivePos[2]+3,player.isNight,player.isNight,player.isNight,1,0.05,40)
        
        textRenderer.addSingle(p,[out.hivePos[0]+1.5,out.hivePos[1]-1.6+out.hiveBalloon.displaySize*0.5,out.hivePos[2]+3],COLORS.whiteArr,-1)
        
        p=Math.round(out.hiveBalloon.maxPollen).toString()
        
        out.hiveBalloon.blessing=Math.max(Math.ceil(Math.pow(out.hiveBalloon.maxPollen,1/7)*2-4),1)
        
        textRenderer.addSingle('Blessing x'+out.hiveBalloon.blessing,[out.hivePos[0]+1.5,out.hivePos[1]-1.4+out.hiveBalloon.displaySize*0.5,out.hivePos[2]+3],[0,100,255],-1,true,false)
    }
    
    out.toolRot=0
    out.toolMatrix=new Float32Array(16)
    out.toolMesh=new Mesh(false)
    out.toolUses=0
    out.toolCooldown=0
    
    out.sprinklers=[new Sprinkler()]
    out.sprinklerMesh=new Mesh(true)
    out.sprinklerMesh.setBuffers()
    out.currentSprinkler=0
    
    out.hive=[[]]
    out.hivePos=[-1.625+10,1.5,-7.5]
    
    triggers.hive={
        
        minX:out.hivePos[0]-1,
        maxX:out.hivePos[0]+4.5,
        minY:-5,
        maxY:7,
        minZ:out.hivePos[2]-1,
        maxZ:out.hivePos[2]+4.5,
        
    }
    
    out.hiveMesh=new Mesh(true)
    
    out.addSlot=function(bee,gifted=true){
        
        if(out.hive[out.hive.length-1].length<5){
            
            out.hive[out.hive.length-1].push({type:bee,level:1,bond:0,gifted:gifted})
            
        } else {
            
            out.hive.push([])
            out.hive[out.hive.length-1].push({type:bee,level:1,bond:0,gifted:gifted})
        }
    }
    
    out.effects=[]
    
    out.addEffect=function(type,amplify,refresh,setAmount,addAmount){
        
        if(amplify){
            
            let found
            
            for(let i in out.effects){
                
                if(out.effects[i].type===type){
                    
                    found=i
                    break
                }
            }
            
            if(found!==undefined){
                
                out.effects[found].cooldown=Math.min(effects[type].maxCooldown,effects[type].maxCooldown*amplify+out.effects[found].cooldown+dt)
                
                
                return
            }
            
            out.effects.push({
                
                cooldown:effects[type].maxCooldown*amplify,
                type:type,
                amount:1,
            })
            
        } else {
            
            let found
            
            for(let i in out.effects){
                
                if(out.effects[i].type===type){
                    
                    found=i
                    break
                }
            }
            
            if(found!==undefined){
                
                if(refresh){
                    
                    out.effects[found].amount=Math.min(Math.max(out.effects[found].amount,refresh),effects[type].maxAmount)
                    
                } else {
                    
                    out.effects[found].amount=Math.min(setAmount??out.effects[found].amount+(addAmount||1),effects[type].maxAmount)
                    
                }
                
                out.effects[found].cooldown=effects[type].maxCooldown
                
                return
            }
            
            out.effects.push({
                
                cooldown:effects[type].maxCooldown,
                type:type,
                amount:refresh?refresh:setAmount??(addAmount||1),
            })
        }
        
        effects[type].svg.style.display='inline'
    }
    
    out.computeStats=function(){
        
        for(let i=out.effects.length;i--;){
            
            if(effects[out.effects[i].type].isPassive){
                
                effects[out.effects[i].type].svg.style.display='none'
                out.effects.splice(i,1)
            }
        }
        
        for(let i in out.precomputedStats){
            
            out.defaultStats[i]=out.precomputedStats[i]
        }
        
        out.defaultStats.capacityMultiplier=1
        
        out.defaultStats.convertTotal=0
        out.defaultStats.attackTotal=0
        
        let giftedTypes=[]
        
        out.bubbleBonus=1
        out.flameBonus=1
        out.ownsCrimsonBee=false
        out.ownsCobaltBee=false
        out.cloudBoostAmount=1.25
        out.beeColorAmounts={r:0,b:0,w:0}
        
        for(let i in objects.bees){

            out.beeColorAmounts[beeInfo[objects.bees[i].type].color[0]]++
            
            out.defaultStats.convertTotal+=objects.bees[i].convertAmount

            out.defaultStats.attackTotal+=objects.bees[i].attack
            
            if(objects.bees[i].gifted&&giftedTypes.indexOf(objects.bees[i].type)<0){
                
                giftedTypes.push(objects.bees[i].type)
                
                if(beeInfo[objects.bees[i].type].color==='blue'){
                    out.bubbleBonus+=0.1
                }
            }
            
            if(beeInfo[objects.bees[i].type].color==='red'){
                
                out.flameBonus+=objects.bees[i].gifted?0.08:0.04
            }
            
            if(objects.bees[i].type==='crimson'){
                
                out.ownsCrimsonBee=true
            }
            
            if(objects.bees[i].type==='cobalt'){
                
                out.ownsCobaltBee=true
            }
            
            if(objects.bees[i].type==='windy'&&objects.bees[i].gifted){
                
                out.cloudBoostAmount=1.5
            }
            
            if(player.hive[objects.bees[i].hiveY][objects.bees[i].hiveX].beequip){
                
                let stats=player.hive[objects.bees[i].hiveY][objects.bees[i].hiveX].beequip.stats.player
                
                stats=stats.split(',')
                
                for(let i in stats){
                    
                    let str=stats[i]
                    
                    if(str[0]==='*'){

                        player.defaultStats[str.substring(str.indexOf(' ')+1,str.indexOf('('))]*=Number(str.substr(1,str.indexOf(' ')-1))+Number(str.substr(str.indexOf('(')+2,str.length).replace(')',''))
                        
                    } else {
                        
                        player.defaultStats[str.substring(str.indexOf(' ')+1,str.indexOf('('))]+=Number(str.substr(1,str.indexOf(' ')-1))+Number(str.substr(str.indexOf('(')+2,str.length).replace(')',''))
                        
                    }
                }
            }
        }
        
        for(let i in giftedTypes){
            
            let b=beeInfo[giftedTypes[i]].giftedHiveBonus
            
            if(b.oper==='+'){
                
                let s=b.stat.split(',')
                
                for(let j in s){
                    
                    out.defaultStats[s[j]]+=b.num
                }
                
            } else {
                
                let s=b.stat.split(',')
                
                for(let j in s){
                    
                    out.defaultStats[s[j]]*=b.num
                }
            }
        }
        
        for(let i in out.effects){
            
            if(effects[out.effects[i].type].isPassive){
                
                effects[out.effects[i].type].svg.style.display='none'
                out.effects.splice(i,1)
            }
        }
        
        for(let i in out.currentGear){
            
            if(i==='tool') continue
            
            if(i.indexOf('Amulet')>-1){
                
                let stats=out.currentGear[i]
                
                stats=stats.split(',')
                
                for(let i in stats){
                    
                    let str=stats[i]
                    
                    if(str[0]==='*'){
                        
                        out.defaultStats[str.substr(str.indexOf(' ')+1,str.length)]*=Number(str.substr(1,str.indexOf(' ')-1))
                        
                    } else if(str[0]==='+'){
                        
                        out.defaultStats[str.substr(str.indexOf(' ')+1,str.length)]+=Number(str.substr(1,str.indexOf(' ')-1))
                        
                    } else {
                        
                        out.addEffect(str.split(' ')[1])
                        out.defaultStats.capacityMultiplier*=1.25
                    }
                }
                
            } else if(i!=='beequips'){
                
                if(gear[i][out.currentGear[i]].applyStats)
                gear[i][out.currentGear[i]].applyStats(out.defaultStats,out)
                
            }
            
        }
        
        out.defaultStats.capacity*=out.defaultStats.capacityMultiplier
    }
    
    out.currentGear={
        
        tool:'shovel',
        boots:'none',
        belt:'none',
        backpack:'pouch',
        mask:'none',
        leftGuard:'none',
        rightGuard:'none',
        glider:'glider',
        beequips:[]
    }
    
    out.generateBeequip=function(type){
        
        let p=beequips[type].potentials[(Math.random()*beequips[type].potentials.length)|0],st=beequips[type].generateStats(p)

        out.currentGear.beequips.push({type:type,bee:null,stats:st,id:out.currentGear.beequips.length,potential:p,waxes:[]})
        
        out.updateBeequipPage()
    }
    
    out.beequipLookingAt=false
    
    out.updateBeequipPage=function(){
        
        out.beequipPageHTML=''
        
        if(out.beequipLookingAt===false){
            
            for(let i in out.currentGear.beequips){
                
                out.beequipPageHTML+=beequips[out.currentGear.beequips[i].type].svgCode.replaceAll('#ID',out.currentGear.beequips[i].id)
                
            }
            
        } else {
            
            let c=beequips[out.currentGear.beequips[out.beequipLookingAt].type].svgCode.split('</text>')
            
            c=c[c.length-1]
            
            let d=beequips[out.currentGear.beequips[out.beequipLookingAt].type].svgCode.split('<text'),_d='',hd
            
            
            for(let i in d){
                
                if(d[i].indexOf('</text>')>-1){
                    
                    if(!hd){
                        
                        hd=true
                        continue
                    }
                    
                    _d+=d[i].substr(d[i].indexOf('>')+1,d[i].indexOf('<'))+' '
                    
                }
            }
            
            let s=out.currentGear.beequips[out.beequipLookingAt].stats.bee.split(',')
            let stats=''
            
            if(out.currentGear.beequips[out.beequipLookingAt].stats.bee.length){
                
                s.sort()
                
                for(let i in s){
                    
                    let toAdd=s[i].replace('*','x')
                    
                    toAdd=toAdd.substr(0,toAdd.indexOf(' ')+1)+MATH.doGrammar(toAdd.substring(toAdd.indexOf(' ')+1,toAdd.indexOf('(')))+toAdd.substring(toAdd.indexOf('('),toAdd.length)
                    
                    stats+="<p style='color:"+(Number(toAdd.substr(1,toAdd.indexOf(' ')))<1?'rgb(200,0,0)':'rgb(20,160,20)')+";font-size:14px;margin-top:-10px'>"+toAdd+"</p>"
                    
                }
            }
            
            s=out.currentGear.beequips[out.beequipLookingAt].stats.player.split(',')
            
            if(out.currentGear.beequips[out.beequipLookingAt].stats.player.length){
                
                stats+="<br><p style='color:rgb(227, 194, 7);font-size:14px;margin-top:-10px'>[Hive Bonus]</p>"
                
                s.sort()
                
                for(let i in s){
                    
                    let toAdd=s[i].replace('*','x')
                    
                    toAdd=toAdd.substr(0,toAdd.indexOf(' ')+1)+MATH.doGrammar(toAdd.substring(toAdd.indexOf(' ')+1,toAdd.indexOf('(')))+toAdd.substring(toAdd.indexOf('('),toAdd.length)
                    
                    stats+="<p style='color:rgb(227, 194, 7);font-size:14px;margin-top:-10px'>"+toAdd+"</p>"
                    
                }
            }

            let waxesCode=[]

            for(let i=0;i<5;i++){

                let w=out.currentGear.beequips[out.beequipLookingAt].waxes[i]

                waxesCode.push(w?itemSVGCode[w].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','').replace('translate(0px,7px)','translate(-9px,-1px)').replace('scale(0.77,0.77)','scale(0.6,0.6)'):'')
            }

            
            out.beequipPageHTML+="<div onmousedown='window.selectBeequip()' style='position:fixed;left:5px;top:250px;background-color:rgb(240, 196, 0);border:2px solid black;border-radius:4px;text-align:center;width:90px;height:20px;cursor:pointer;'><svg style='margin:0px;width:100px;height:20px'><text x='30' y='16' style='color:black;font-family:cursive;font-size:17px'>Equip</text></svg></div><div onmousedown='window.deleteBeequip()' style='position:fixed;top:250px;background-color:rgb(240, 0, 0);border:2px solid black;border-radius:4px;left:105px;text-align:center;width:90px;height:20px;cursor:pointer;'><svg style='margin:0px;width:100px;height:20px'><text x='20' y='16' style='color:black;font-family:cursive;font-size:17px'>Delete</text></svg></div><svg style='position:fixed;border-radius:10px;background-color:rgb(240,240,240);width:75px;height:75px;margin-top:28px'>"+c+"<div onmousedown='window.exitBeequipLooking()' style='position:fixed;background-color:rgb(240,0,0);border:2px solid black;border-radius:4px;text-align:center;font-size:19px;font-family:trebuchet ms;width:20px;height:20px;cursor:pointer;'><svg style='margin:0px;width:20px;height:20px'><path stroke='black' stroke-width='2' d='M5 4L15 16M15 4L5 16'></path></svg></div><div style='position:fixed;background-color:rgb(240,240,240);border-radius:10px;text-align:center;font-size:19px;font-family:trebuchet ms;margin-left:28px;width:172px;padding-bottom:2px;'>"+MATH.doGrammar(out.currentGear.beequips[out.beequipLookingAt].type.replaceAll('candycane','candyCane'))+"</div><div style='position:fixed;background-color:rgb(240,240,240);margin-left:80px;margin-top:29px;border-radius:10px;font-size:13px;padding-top:0px;font-family:trebuchet ms;width:113px;padding-left:7px;padding-top:3px;padding-bottom:3px;'>Level: "+beequips[out.currentGear.beequips[out.beequipLookingAt].type].level+"</div><div style='position:fixed;background-color:rgb(240,240,240);margin-left:80px;margin-top:55px;border-radius:10px;padding-left:7px;padding-top:3px;padding-bottom:3px;font-size:13px;font-family:trebuchet ms;width:113px;'>Color: "+MATH.doGrammar(beequips[out.currentGear.beequips[out.beequipLookingAt].type].color)+"</div><div style='position:fixed;background-color:rgb(240,240,240);margin-left:80px;margin-top:81px;border-radius:10px;padding-left:7px;padding-top:3px;padding-bottom:3px;font-size:13px;font-family:trebuchet ms;width:113px;'>Potential: "+out.currentGear.beequips[out.beequipLookingAt].potential+"</div><svg style='postition:fixed;left:0px;top:107px;width:20px;height:20px'><path stroke='black' stroke-width='2' d='M5 4L15 16M15 4L5 16'></path></svg><div style='background-color:rgb(240,240,240);margin-left:2px;margin-top:112px;border-radius:9px;padding-left:7px;padding-top:3px;padding-bottom:3px;width:30px;height:30px;'>"+waxesCode[0]+"</div><div style='background-color:rgb(240,240,240);margin-left:42px;margin-top:-36px;border-radius:9px;padding-left:7px;padding-top:3px;padding-bottom:3px;width:30px;height:30px;'>"+waxesCode[1]+"</div><div style='background-color:rgb(240,240,240);margin-left:82px;margin-top:-36px;border-radius:9px;padding-left:7px;padding-top:3px;padding-bottom:3px;width:30px;height:30px;'>"+waxesCode[2]+"</div><div style='background-color:rgb(240,240,240);margin-left:122px;margin-top:-36px;border-radius:9px;padding-left:7px;padding-top:3px;padding-bottom:3px;width:30px;height:30px;'>"+waxesCode[3]+"</div><div style='background-color:rgb(240,240,240);margin-left:162px;margin-top:-36px;border-radius:9px;padding-left:7px;padding-top:3px;padding-bottom:3px;width:30px;height:30px;'>"+waxesCode[4]+"</div><div style='background-color:rgb(240,240,240);margin-left:0px;margin-top:5px;border-radius:10px;padding-left:7px;padding-top:3px;padding-bottom:3px;font-size:12px;font-family:trebuchet ms;width:193px;'>"+_d+beequips[out.currentGear.beequips[out.beequipLookingAt].type].reqStr+stats.replaceAll('(+0)','')+(beequips[out.currentGear.beequips[out.beequipLookingAt].type].extraAbility?'<br><p style="font-size:15px">+Ability: '+MATH.doGrammar(beequips[out.currentGear.beequips[out.beequipLookingAt].type].extraAbility.split('_')[1])+'</p>':'')+"</div>"
            
        }
    }
    
    out.generateBeequip('candycane')
    out.generateBeequip('boombox')
    out.generateBeequip('pencil')

    out.updateBeesPage=function(){

        pages[2].innerHTML=''

        for(let i in beeInfo){

            let div=document.createElement('div'),img=document.createElement('canvas'),text=document.createElement('div')
            div.style.width='195px'
            div.style.height='70px'
            div.style.marginTop='3px'
            div.style.borderRadius='5px'
            div.style.backgroundColor=beeInfo[i].color==='red'?'rgb(255,0,0,0.5)':beeInfo[i].color==='blue'?'rgb(0,0,255,0.5)':'rgb(255,255,255,0.5)'

            img.width=70
            img.height=70
            img.style.borderTopLeftRadius='5px'
            img.style.borderBottomLeftRadius='5px'

            let img_ctx=img.getContext('2d')

            img_ctx.drawImage(beeCanvas,beeInfo[i].u*2048,beeInfo[i].v*2048,128,128,0,0,70,70)

            text.innerHTML="<p style='margin-left:70px;margin-top:-70px;font-family:trebuchet ms;font-size:17px;text-align:center'>"+MATH.doGrammar(i)+" Bee</p>"+"<p style='margin-left:73px;margin-top:-14px;font-family:trebuchet ms;font-size:9px;text-align:center;width:122px'>"+beeInfo[i].description+"</p>"

            div.appendChild(img)
            div.appendChild(text)

            pages[2].appendChild(div)
        }
    }
    
    out.updateGear=function(){
        
        out.computeStats()

        out.toolMesh.setMeshFromFunction(function(box,a,cylinder,sphere,applyFinalRotation,c,star){
            
            gear.tool[out.currentGear.tool].mesh(box,cylinder,sphere,star,applyFinalRotation)
        })

        out.toolMesh.setBuffers()
        
        playerMesh.setMeshFromFunction(function(box,a,cylinder,sphere,applyFinalRotation,c,star){
            
            box(0,0,0,0.5,1,0.5,false,[1.45,1.45,1])
            
            for(let i in out.currentGear){
                
                if(i==='tool') continue

                if(i.indexOf('Amulet')<0&&i!=='beequips'){
                    
                    if(i==='glider'||i==='parachute'){
                        
                        if(player.isGliding)
                            gear[i][out.currentGear[i]].mesh(box,cylinder,sphere,star,applyFinalRotation)
                            
                    } else {
                        
                        gear[i][out.currentGear[i]].mesh(box,cylinder,sphere,star,applyFinalRotation)
                    }
                    
                } else if(i!=='beequips'){
                    
                    gear[i].mesh(box,cylinder,sphere,star)
                    
                }
            }
            
        })
        
        playerMesh.setBuffers()
    }
    
    out.updateHive=function(){
        
        out.hiveMesh.setMeshFromFunction(function(box,hiveSlot,useless1,useless2,useless3,giftedRing){
            
            for(let i in objects.bees){
                
                for(let j in objects.bees[i].trails){
                    
                    objects.bees[i].trails[j].splice=true
                }
            }
            
            objects.bees=[]
            
            for(let i in raycastWorld.bodies){
                
                raycastWorld.removeBody(raycastWorld.bodies[i])
            }
            
            for(let y=0;y<out.hive.length;y++){
                
                for(let x=0;x<out.hive[y].length;x++){
                    
                    hiveSlot(out.hivePos[0]+x*0.8,out.hivePos[1]+y*0.8-2.25,out.hivePos[2],0.35,0.35,out.hive[y][x].type,out.hive[y][x].gifted)
                    
                    if(out.hive[y][x].type!==null){
                        
                        if(out.hive[y][x].gifted)
                            giftedRing(out.hivePos[0]+x*0.8,out.hivePos[1]+y*0.8-2.25,out.hivePos[2]-0.2,0.45,0.45,out.hive[y][x].type)
                        
                        let _b=new Bee([out.hivePos[0]+x*0.8,out.hivePos[1]+y*0.8-2.25,out.hivePos[2]],out.hive[y][x].type,out.hive[y][x].level,out.hive[y][x].gifted,x,y,out.hive[y][x].mutation)
                        
                        out.hive[y][x].bee=_b
                        objects.bees.push(_b)
                        
                    }
                    
                    let b=new CANNON.Body({
                        
                        position:new CANNON.Vec3(player.hivePos[0]+x*0.8,player.hivePos[1]+y*0.8-2.25,player.hivePos[2]-0.2),
                        shape:new CANNON.Box(new CANNON.Vec3(0.4,0.4,0.1)),
                        mass:0,
                    })
                    
                    b.hiveIndex=[x,y]
                    
                    raycastWorld.addBody(b)
                }
            }
            
            out.computeStats()
        })
        
        out.hiveMesh.setBuffers()
    }
    
    out.resetStats=function(){
        
        for(let i in out.defaultStats){
            
            out[i]=out.defaultStats[i]
        }
    }
    
    out.resetStats()
    
    out.sensitivity=0.005
    out.yaw=0
    out.pitch=0
    out.friction=20
    out.grounded=false
    out.cameraDir=[]
    out.zoom=11
    out.lookDir=[0,1]
    out.lookQuat=[0,1,0,0]
    out.rotQuat=[0,1,0,0]
    out.shiftLock=false
    out.flowerIn={}
    out._flowerIn={}
    out.pollen=0
    out.honey=0
    
    out.cameraRaycastPoint=new CANNON.Vec3()
    out.cameraRaycastResult=new CANNON.RaycastResult()
    out.cameraRaycastFilter={collisionFilterMask:STATIC_PHYSICS_GROUP}
    
    out.viewMatrix=new Float32Array(16)
    out.modelMatrix=new Float32Array(16)
    
    out.body=new CANNON.Body({
        
        shape:new CANNON.Box(new CANNON.Vec3(0.25,0.5,0.25)),
        position:new CANNON.Vec3(10,0,0),
        mass:5,
        fixedRotation:true,
        collisionFilterGroup:PLAYER_PHYSICS_GROUP,
        collisionFilterMask:STATIC_PHYSICS_GROUP,
    })
    
    out.body.addEventListener('collide',function(e){
        
        if(Math.abs(e.contact.ni.y)>0.2){
            
            out.grounded=true
        }
    })
    
    world.addBody(out.body)
    
    out.setProjectionMatrix=function(fov,aspect,zn,zf){
        
        let f=Math.tan(Math.PI*0.5-fov*MATH.HALF_TO_RAD)
        
        let rangeInv=1.0/(zn-zf)
        out.projectionMatrix=new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(zn+zf)*rangeInv,-1,0,0,zn*zf*rangeInv*2,0])
        
    }
    
    out.fov=75
    out.setProjectionMatrix(out.fov,aspect,0.1,500)
    
    out.updateUI=function(){
        
        out.pollen=Math.round(Math.max(out.pollen,0))
        out.capacity=Math.round(out.capacity)
        out.honey=Math.round(out.honey)
        
        pollenAmount2.textContent=pollenAmount.textContent=MATH.addCommas((out.pollen).toString())+'/'+MATH.addCommas(player.capacity.toString())
        honeyAmount2.textContent=honeyAmount.textContent=MATH.addCommas((out.honey).toString())
        
        if(user.keys.c&&out.pollen){
            
            textRenderer.add(out.pollen,[player.body.position.x,player.body.position.y+1,player.body.position.z],COLORS.honey,1,'⇆')
            out.honey+=out.pollen
            out.pollen=0
        }
        
        let p=Math.min(out.pollen/out.capacity,1)
        
        capacityBar.setAttribute('width',p*196)
        capacityBar.style.fill='rgb('+p*255*1.5+','+(1-p)*255*1.5+',0)'
        out.health=Math.min(out.health+dt*2.5,100)
        
        if(out.health<=0){
            
            if(!out.dead){
                
                out.dead=true
                out.respawnTimer=3
                out.deadBodyPos=out.body.position.clone()
            }
            
            out.respawnTimer-=dt
            out.health=-10000
            
            out.body.velocity.setZero()
            user.keys={}
            out.body.position.copy(out.deadBodyPos)
            
            if(out.respawnTimer<=0){
                
                out.respawn()
            }
            
            ctx.fillStyle='rgb(225,0,0,0.4)'
            ctx.fillRect(0,0,width,height)
        }
        
        healthBar.setAttribute('width',out.health*0.72)
        healthBar.style.fill='rgb('+(100-out.health)*3.75+','+out.health*3.75+',0)'
        
        if(user.clickedKeys.r){
            
            out.sprinklers[out.currentSprinkler].set(player.fieldIn,player.flowerIn.x,player.flowerIn.z)
            out.currentSprinkler=(out.currentSprinkler+1)%(out.sprinklers.length)
            
            out.sprinklerMesh.setMeshFromFunction(function(box,a,cylinder){
                
                for(let i in out.sprinklers){
                    
                    let s=out.sprinklers[i]
                    
                    if(s.field){
                        
                        let x=s.x+fieldInfo[s.field].x,
                            y=fieldInfo[s.field].y+0.5,
                            z=s.z+fieldInfo[s.field].z
                        
                        cylinder(x,y+0.25,z,0.15,2.5,10,0.9,0.9,0.5,1,90,0,0)
                        cylinder(x,y+1.5,z,0.2,0.15,10,1,1,0.5,1,90,0,0)
                        box(x,y+0.7,z,0.9,0.9,0.35,false,[0.2,10,10],false,false)
                        cylinder(x+0.4,y+1.1,z,0.25,0.35,10,0.2,10,10,1,0,0,0,0.25,false)
                        cylinder(x-0.4,y+1.1,z,0.25,0.35,10,0.2,10,10,1,0,0,0,0.25,false)
                        cylinder(x,y+0.7,z,0.3,0.375,10,0.5,0.5,0.5,1,0,0,0,0.25,false)
                        cylinder(x,y+0.7,z,0.1,0.5,10,0.2,10,10,1,0,0,0,0.1,false)
                        
                    }
                }
            })
            
            out.sprinklerMesh.setBuffers()
        }
        
        if(out.fieldIn&&user.keys.g){
            
            updateFlower(out.fieldIn,out.flowerIn.x,out.flowerIn.z,function(f){f.goo=1;},false,true,true)
            
        }
        
        if(out.itemDragging||out.beequipDragging){
            
            ctx.textAlign='end'
            ctx.font='bold 20px arial'
            ctx.fillStyle='rgb(255,255,255)'
            ctx.strokeStyle='rgb(0,0,0)'
            ctx.lineWidth=4
            ctx.strokeText(MATH.doGrammar(out.itemDragging||out.beequipDragging.type),user.mouseX,user.mouseY)
            ctx.fillText(MATH.doGrammar(out.itemDragging||out.beequipDragging.type),user.mouseX,user.mouseY)
            ctx.textAlign='center'
        }
        
        if(currentPage===1){
            
            pages[1].innerHTML=``
            
            for(let i in out.quests){
                
                pages[1].innerHTML+=`<div style='background-color:${out.quests[i].completed?"rgb(0,"+(Math.sin(TIME*5)*20+215)+",0)":"rgb(240,240,240)"};font-size:17px;text-align:center;margin-top:-16px;border-radius:3px;'><p style='margin-bottom:5px'>${out.quests[i].name}</p>${(function(){
                    
                    let s='',isCompleted=true
                    
                    for(let j in out.quests[i].req){
                        
                        if((out.stats[out.quests[i].req[j][0]]-out.quests[i].req[j][2])/out.quests[i].req[j][1]>=1){
                            
                            out.quests[i].req[j][3]=true
                            
                        } else {
                            
                            isCompleted=false
                        }

                        let c=MATH.doStatGrammar(out.quests[i].req[j][0])+' '+MATH.addCommas(out.quests[i].req[j][1].toString())+' '+(out.quests[i].req[j][1]>1&&MATH.doStatGrammar(out.quests[i].req[j][0])==='Defeat'?MATH.doPlural(MATH.doGrammar(out.quests[i].req[j][0])):MATH.doGrammar(out.quests[i].req[j][0]))+'<br>('+(MATH.constrain((out.stats[out.quests[i].req[j][0]]-out.quests[i].req[j][2])/out.quests[i].req[j][1],0,1)*100).toFixed(0)

                        s+="<div style='border-radius:3px;width:190px;margin-top:0px;margin-bottom:5px;background-color:rgb(255,0,0);color:black;font-family:calibri;font-size:13px;margin-left:5px;position:relative;'><div style='position:absolute;left:0px;top:0px;border-radius:2px;right:"+(190-Math.min(((out.stats[out.quests[i].req[j][0]]-out.quests[i].req[j][2])/out.quests[i].req[j][1])*190,190))+"px;bottom:0px;background-color:rgb(0,250,0);'></div><div style='position:absolute;left:0px;top:0px;border-radius:2px;right:0px;bottom:0px'>"+c+"%)</div><u style='color:rgb(0,0,0,0)'>"+c+"</u></div>"
                        
                    }
                    
                    out.quests[i].completed=isCompleted
                    NPCs[out.quests[i].NPC].activeQuest=!isCompleted
                    
                    return s+'<p style="font-size:2px"><br></p>'
                    
                })()}</div>`
            }
        }
        
        if(currentPage===3&&TIME-player.statsStringLastUpdate>0.5){

            player.statsStringLastUpdate=TIME
            player.statString='<br>FPS: '+(1/dt).toFixed(2)+'<br>Delta Time: '+dt.toFixed(4)+'<br><br>Convert Rate: '+Math.round(player.convertRate*100)+'%<br>Red Pollen: '+Math.round(player.redPollen*100)+'%<br>Blue Pollen: '+Math.round(player.bluePollen*100)+'%<br>White Pollen: '+Math.round(player.whitePollen*100)+'%<br>Walk Speed: '+player.walkSpeed.toFixed(1)+'<br>Jump Power: '+player.jumpPower.toFixed(1)+'<br>Instant Red Conversion: '+Math.round(player.instantRedConversion*100)+'%<br>Instant Blue Conversion: '+Math.round(player.instantBlueConversion*100)+'%<br>Instant White Conversion: '+Math.round(player.instantWhiteConversion*100)+'%<br>Instant Flame Conversion: '+Math.round(player.instantFlameConversion*100)+'%<br>Critical Chance: '+Math.round(player.criticalChance*100)+'%<br>Critical Power: '+Math.round(player.criticalPower*100)+'%<br>Super-Crit Chance: '+Math.round(player.superCritChance*100)+'%<br>Super-Crit Power: '+Math.round(player.superCritPower*100)+'%<br>Goo: '+Math.round(player.goo*100)+'%<br>Flame Pollen: '+Math.round(player.flamePollen*100)+'%<br>Bubble Pollen: '+Math.round(player.bubblePollen*100)+'%<br>Pollen From Tools: '+Math.round(player.pollenFromTools*100)+'%<br>Pollen From Bees: '+Math.round(player.pollenFromBees*100)+'%<br>White Bomb Pollen: '+Math.round(player.whiteBombPollen*100)+'%<br>Red Bomb Pollen: '+Math.round(player.redBombPollen*100)+'%<br>Blue Bomb Pollen: '+Math.round(player.blueBombPollen*100)+'%<br>White Bee Attack: '+player.whiteBeeAttack+'<br>Blue Bee Attack: '+player.blueBeeAttack+'<br>Red Bee Attack: '+player.redBeeAttack+'<br>Bee Attack Multiplier: '+Math.round(player.beeAttack*100)+'%<br>Honey From Tokens: '+Math.round(player.honeyFromTokens*100)+'%<br>Red Bee Ability Rate: '+Math.round(player.redBeeAbilityRate*100)+'%<br>Blue Bee Ability Rate: '+Math.round(player.blueBeeAbilityRate*100)+'%<br>White Bee Ability Rate: '+Math.round(player.whiteBeeAbilityRate*100)+'%<br>Bee Movespeed: '+Math.round(player.beeSpeed*100)+'%<br>Bee Energy: '+Math.round(player.beeEnergy*100)+'%<br>Honey At Hive: '+Math.round(player.honeyAtHive*100)+'%<br>Honey Per Pollen: '+Math.round(player.honeyPerPollen*100)+'%<br>Loot Luck: '+Math.round(player.lootLuck*100)+'%<br>Red Field Capacity: '+Math.round(player.redFieldCapacity*100)+'%<br>White Field Capacity: '+Math.round(player.whiteFieldCapacity*100)+'%<br>Blue Field Capacity: '+Math.round(player.blueFieldCapacity*100)+'%<br>Ability Duplication Chance: '+Math.round(player.abilityDuplicationChance*100+(player.drives.maxed?1:0))+'%<br><br>Convert Total: '+Math.round(player.convertTotal)+'<br>Attack Total: '+Math.round(player.attackTotal)
            
            pages[3].innerHTML='<div style="cursor:pointer;background-color:rgb(170,170,170);font-size:15px;border-radius:3px;color:'+(player.setting_enablePollenText?'rgb(0,170,0)':'rgb(220,0,0)')+'" id="togglePollenText">Pollen Text: '+(player.setting_enablePollenText?'On':'Off')+'</div>'+'<div style="cursor:pointer;margin-top:5px;background-color:rgb(170,170,170);font-size:15px;border-radius:3px;color:'+(player.setting_enablePollenAbv?'rgb(0,170,0)':'rgb(220,0,0)')+'" id="togglePollenAbv">Abbreviate Pollen: '+(player.setting_enablePollenAbv?'On':'Off')+'</div>'+player.statString
            
            document.getElementById('togglePollenText').addEventListener('click',function(){
                
                player.setting_enablePollenText=!player.setting_enablePollenText
                
                pages[3].innerHTML='<div style="cursor:pointer;background-color:rgb(170,170,170);font-size:15px;border-radius:3px;color:'+(player.setting_enablePollenText?'rgb(0,170,0)':'rgb(220,0,0)')+'" id="togglePollenText">Pollen Text: '+(player.setting_enablePollenText?'On':'Off')+'</div>'+'<div style="cursor:pointer;margin-top:5px;background-color:rgb(170,170,170);font-size:15px;border-radius:3px;color:'+(player.setting_enablePollenAbv?'rgb(0,170,0)':'rgb(220,0,0)')+'" id="togglePollenAbv">Abbreviate Pollen: '+(player.setting_enablePollenAbv?'On':'Off')+'</div>'+player.statString
                
            })
            
            document.getElementById('togglePollenAbv').addEventListener('click',function(){
                
                player.setting_enablePollenAbv=!player.setting_enablePollenAbv
                
                pages[3].innerHTML='<div style="cursor:pointer;background-color:rgb(170,170,170);font-size:15px;border-radius:3px;color:'+(player.setting_enablePollenText?'rgb(0,170,0)':'rgb(220,0,0)')+'" id="togglePollenText">Pollen Text: '+(player.setting_enablePollenText?'On':'Off')+'</div>'+'<div style="cursor:pointer;margin-top:5px;background-color:rgb(170,170,170);font-size:15px;border-radius:3px;color:'+(player.setting_enablePollenAbv?'rgb(0,170,0)':'rgb(220,0,0)')+'" id="togglePollenAbv">Abbreviate Pollen: '+(player.setting_enablePollenAbv?'On':'Off')+'</div>'+player.statString
                
            })
        }
        
        if(currentPage===4){
            
            pages[4].innerHTML=player.beequipPageHTML
        }
        
        for(let i=out.messages.length;i--;){
            
            let m=out.messages[i]
            
            m.life-=dt
            
            ctx.font=m.size+'px arial'
            ctx.fillStyle=m.color+m.life+')'
            ctx.fillRect(width-250,height-24-(i*22),244,20)
            ctx.fillStyle='rgb(255,255,255,'+m.life+')'
            ctx.fillText(m.message,width-125,height-13-(i*22))
            
            if(m.life<=0){
                
                out.messages.splice(i,1)
            }
        }
        
        if(!player.fieldIn){
            
            if(!player.currentNPC){
                
                for(let i in NPCs){
                    
                    if(triggers[i+'_NPC'].colliding&&!NPCs[i].activeQuest){
                        
                        actionWarning.style.display='block'
                        actionName.innerHTML='Talk To '+MATH.doGrammar(i)
                        
                        actionWarning.onclick=function(){
                            
                            player.onStartChat(i)
                        }
                        
                        if(user.clickedKeys.e){
                            
                            player.onStartChat(i)
                        }
                    }
                }
            }
            
            if(!player.currentShop){
                
                for(let i in shops){
                    
                    if(triggers[i+'_shop'].colliding&&!out.currentShop){
                        
                        actionWarning.style.display='block'
                        actionName.innerHTML=shops[i].message
                        
                        actionWarning.onclick=function(){
                            
                            player.currentShop=i
                            player.onStartShop()
                        }
                        
                        if(user.clickedKeys.e){
                            
                            player.currentShop=i
                            player.onStartShop()
                        }
                    }
                }
                
            } else {
                
                actionWarning.style.display='block'
                actionName.innerHTML='Leave Shop'
                
                let cost=gear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot][shops[out.currentShop].items[shops[out.currentShop].currentIndex].name].cost,canBuy=true
                
                for(let j in cost){
                    
                    let c=cost[j].split(' ')
                    
                    if(c[1]==='honey'&&player.honey<Number(c[0])||c[1]!=='honey'&&items[c[1]].amount<Number(c[0])){
                        
                        canBuy=false
                    }
                }
                
                purchaseButton.innerHTML=shops[out.currentShop].items[shops[out.currentShop].currentIndex].owned?out.currentGear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot]===shops[out.currentShop].items[shops[out.currentShop].currentIndex].name?'Equipped':'Equip':canBuy?'Purchase':'Not Enough'
                purchaseButton.style.backgroundColor=shops[out.currentShop].items[shops[out.currentShop].currentIndex].owned?out.currentGear[shops[out.currentShop].items[shops[out.currentShop].currentIndex].slot]===shops[out.currentShop].items[shops[out.currentShop].currentIndex].name?'rgb(100,200,100)':'rgb(0,200,0)':canBuy?'rgb(0,200,0)':'rgb(225,0,0)'
                
                if(user.clickedKeys.e){
                    
                    out.currentShop=undefined
                    out.viewMatrixToChange=undefined
                    shopUI.style.display='none'
                }
            }
        }
        
        if(out.passivePopupTimer<=0){
            
            passiveActivationPopup.style.display='none'
            
        } else {
            
            out.passivePopupTimer-=dt
            let p=[player.body.position.x,player.body.position.y+1.75,player.body.position.z,1]
            
            vec4.transformMat4(p,p,out.viewMatrix)
            
            p[0]/=p[3]
            p[1]/=p[3]
            
            p[0]+=1
            p[1]+=1
            
            p[0]*=half_width
            p[1]*=half_height
            
            passiveActivationPopup.style.marginLeft=(p[0]-15)+'px'
            passiveActivationPopup.style.marginTop=(height-p[1])+'px'
            
        }
        
        if(player.beePopup){
            
            document.exitPointerLock()
            player.pointerLocked=false
            
            let bee=player.beePopup.type
            
            ctx.translate(half_width+40,half_height+20)
            ctx.scale(Math.min(1,(TIME-player.beePopup.time)*10),Math.min(1,(TIME-player.beePopup.time)*10))
            ctx.fillStyle=player.beePopup.gifted?'rgb('+((Math.sin(TIME*2)+0.85)*70)+','+((Math.cos(TIME*2.5)+0.85)*127)+','+((Math.sin(TIME*2+3.14)+0.85)*100)+')':'rgb(166, 166, 51)'
            ctx.fillRect(-127,-177,245,330)
            ctx.fillStyle='rgb(255,255,150)'
            ctx.fillRect(-125,-175,240,30)
            ctx.fillRect(-125,40,240,110)
            
            ctx.fillStyle=[beeInfo[bee].color]
            ctx.fillRect(-125,10,240,25)
            
            if(user.mouseX>half_width+40-125&&user.mouseX<half_width-125+30+40&&user.mouseY>half_height-175+20&&user.mouseY<half_height-175+30+20){
                
                ctx.fillStyle='rgb(180,0,0)'
                
                if(user.mouseClicked||user.keys.j){
                    
                    player.beePopup=false
                }
                
            } else {
                
                ctx.fillStyle='rgb(255,0,0)'
            }
            
            ctx.fillRect(-125,-175,30,30)
            ctx.strokeStyle='rgb(0,0,0)'
            ctx.lineWidth=2
            ctx.beginPath()
            ctx.moveTo(-120,-170)
            ctx.lineTo(-120+20,-170+20)
            ctx.moveTo(-120+20,-170)
            ctx.lineTo(-120,-170+20)
            ctx.stroke()
            ctx.lineWidth=1.5
            
            ctx.fillStyle={common:'rgb(255,255,255)',rare:'rgb(200,200,200)',epic:'rgb(255,220,0)',legendary:'rgb(0,200,255)',mythic:'rgb(255, 0, 255)',event:'rgb(100,230,0)'}[beeInfo[bee].rarity]
            ctx.font='bold 27px arial'
            ctx.fillText((player.beePopup.gifted?'Gifted ':'')+MATH.doGrammar(bee+'Bee')+'!'.repeat({common:1,rare:1,epic:2,legendary:3,mythic:4,event:5}[beeInfo[bee].rarity]),0,-120)
            ctx.strokeText((player.beePopup.gifted?'Gifted ':'')+MATH.doGrammar(bee+'Bee')+'!'.repeat({common:1,rare:1,epic:2,legendary:3,mythic:4,event:5}[beeInfo[bee].rarity]),0,-120)
            
            ctx.font='bold 13px arial'
            ctx.fillStyle='black'
            ctx.textAlign='default'
            ctx.fillText(player.beePopup.message,-40,-160)
            ctx.textAlign='center'
            ctx.font='bold 16px arial'
            
            let d=beeInfo[bee].description.split(' '),m=0,t='',c=0
            
            for(let i in d){
                
                let met=ctx.measureText(d[i])
                
                m+=Math.abs(met.actualBoundingBoxLeft)+Math.abs(met.actualBoundingBoxRight)
                
                t+=d[i]+' '
                
                if(m>150){
                    
                    m=0
                    ctx.fillText(t,0,c*20+60)
                    t=''
                    c++
                }
            }
            
            ctx.fillText(t,0,c*20+60)
            
            ctx.font='bold 17px arial'
            ctx.fillText(MATH.doGrammar(beeInfo[bee].color)+'     '+MATH.doGrammar(beeInfo[bee].rarity),0,23)
            
            ctx.rotate(Math.cos(TIME*5)*0.1)
            ctx.drawImage(beeCanvas,beeInfo[bee].u*2048,beeInfo[bee].v*2048,128,128,-45,-95+Math.sin(TIME*2)*7,90,90)
            
            ctx.setTransform(1,0,0,1,0,0)
        }
        
        out.sunSwitchTimer-=dt
        
        if(out.sunSwitchTimer<=0){
            
            if(out.isNight<0.9){

                out.targetLight=1
                out.sunSwitchTimer=4*60
                
            } else {
                
                out.targetLight=NIGHT_DARKNESS
                out.sunSwitchTimer=1.5*60
            }

            UPDATE_MAP_MESH()
        }
        
        if(out.isNight!==out.targetLight){
            
            out.isNight=MATH.constrain(out.isNight+(dt/15)*Math.sign(out.targetLight-out.isNight),NIGHT_DARKNESS,1)
            
            vec3.scale(out.skyColor,[0.4,0.6,1],MATH.map(out.isNight,NIGHT_DARKNESS,1,0,1))
            
            gl.useProgram(staticGeometryProgram)
            gl.uniform1f(glCache.static_isNight,out.isNight)
            gl.useProgram(dynamicGeometryProgram)
            gl.uniform1f(glCache.dynamic_isNight,out.isNight)
            gl.useProgram(tokenGeometryProgram)
            gl.uniform1f(glCache.token_isNight,out.isNight)
            gl.useProgram(flowerGeometryProgram)
            gl.uniform1f(glCache.flower_isNight,out.isNight)
            gl.useProgram(beeGeometryProgram)
            gl.uniform1f(glCache.bee_isNight,out.isNight)
            gl.useProgram(mobRendererProgram)
            gl.uniform1f(glCache.mob_isNight,out.isNight)
            gl.useProgram(trailRendererProgram)
            gl.uniform1f(glCache.trail_isNight,out.isNight)
        }

        if(player.isCrafting&&document.getElementById('blenderMenu').style.display==='block'){

            let p=MATH.constrain((player.isCrafting.time-TIME)/player.isCrafting.waitTime,0,1),a=(player.isCrafting.amount*(1-p))|0,n=Math.ceil(p*player.isCrafting.amount*0.25)

            document.getElementById('blenderName').innerHTML="Crafting...<div style='position:fixed;left:50%;top:175%;transform:translate(-50%,-50%);width:200px;height:25px;border-radius:2px;border:1.5px solid black;background-color:rgb(150,0,0)'><div style='height:25px;width:"+(200-p*200)+"px;background-color:rgb(0,200,0)'></div><p style='color:white;font-size:16px;position:fixed;left:50%;top:-20%;transform:translate(-50%,-50%)'>"+MATH.doTime(Math.max(player.isCrafting.time-TIME,0))+"</p><p style='color:white;font-size:20px;position:fixed;left:-40%;top:200%;transform:translate(-50%,-50%)'>"+MATH.addCommas(a+'')+" / "+MATH.addCommas(player.isCrafting.amount+'')+"</p></div>"

            document.getElementById('blenderSpeed').innerHTML='Speed Up for '+n+(n===1?' ticket':' Tickets')

            if(!n)
                document.getElementById('blenderEnd').style.backgroundColor='rgb(0,200,0)'
            else
                document.getElementById('blenderEnd').style.backgroundColor='rgb(200,0,0)'
            
            
            if(items.ticket.amount<n)
                document.getElementById('blenderSpeed').style.backgroundColor='rgb(230, 193, 99)'
            else
                document.getElementById('blenderSpeed').style.backgroundColor='rgb(255,190,0)'

            document.getElementById('blenderEnd').onclick=function(){

                items[player.isCrafting.item].amount+=a
                player.stats.itemsUsingTheBlender+=a

                if(a)
                    player.addMessage('+'+MATH.addCommas(a+'')+' '+(a>1?MATH.doPlural(MATH.doGrammar(player.isCrafting.item)):MATH.doGrammar(player.isCrafting.item))+' (from Blender)')

                for(let i in blenderRecipes){

                    let b=blenderRecipes[i]

                    if(b.item===player.isCrafting.item){

                        for(let j in b.req){

                            let f=player.isCrafting.amount-a

                            items[b.req[j][0]].amount+=b.req[j][1]*f

                            if(f)
                                player.addMessage('+'+MATH.addCommas((b.req[j][1]*f)+'')+' '+(f>1?MATH.doPlural(MATH.doGrammar(b.req[j][0])):MATH.doGrammar(b.req[j][0]))+' (from Blender Refund)')
                        }

                        break
                    }
                }

                player.isCrafting=false
                player.updateInventory()
                document.getElementById('blenderX').onclick()
            }
        
            document.getElementById('blenderSpeed').onclick=function(){

                if(items.ticket.amount<n) return

                items.ticket.amount-=n
                player.addMessage('-'+MATH.addCommas(n+'')+(n===1?' Ticket':' Tickets'))
                items[player.isCrafting.item].amount+=player.isCrafting.amount
                player.addMessage('+'+MATH.addCommas(player.isCrafting.amount+'')+' '+(player.isCrafting.amount>1?MATH.doPlural(MATH.doGrammar(player.isCrafting.item)):MATH.doGrammar(player.isCrafting.item))+' (from Blender)')
                player.stats.itemsUsingTheBlender+=player.isCrafting.amount
                player.isCrafting=false
                player.updateInventory()
                document.getElementById('blenderX').onclick()
            }
        }
    }

    out.updateBlenderMenu=function(){

        if(player.isCrafting){

            document.getElementById('blenderMenu').style.display='block'
            document.getElementById('blenderTitle').style.display='none'
            document.getElementById('leftBlenderButton').style.display='none'
            document.getElementById('rightBlenderButton').style.display='none'
            document.getElementById('blenderIndex').style.display='none'
            document.getElementById('blenderCraft').style.display='none'
            document.getElementById('blenderCraftAmount').style.display='none'
            document.getElementById('blenderReq').style.display='none'
            document.getElementById('blenderEnd').style.display='block'
            document.getElementById('blenderSpeed').style.display='block'

            return
        }
        
        document.getElementById('leftBlenderButton').style.display='block'
        document.getElementById('rightBlenderButton').style.display='block'
        document.getElementById('blenderIndex').style.display='block'
        document.getElementById('blenderTitle').style.display='block'
        document.getElementById('blenderCraft').style.display='block'
        document.getElementById('blenderCraftAmount').style.display='block'
        document.getElementById('blenderReq').style.display='block'
        document.getElementById('blenderEnd').style.display='none'
        document.getElementById('blenderSpeed').style.display='none'

        document.getElementById('blenderMenu').style.display='block'
        document.getElementById('blenderTitle').innerHTML='What do you want to craft?'
        document.getElementById('blenderX').onclick=function(){

            document.getElementById('blenderMenu').style.display='none'
        }
        document.getElementById('leftBlenderButton').onclick=function(){

            player.blenderIndex=((player.blenderIndex+blenderRecipes.length-1)%blenderRecipes.length)
            out.updateBlenderMenu()
        }
        document.getElementById('rightBlenderButton').onclick=function(){

            player.blenderIndex=(player.blenderIndex+1)%blenderRecipes.length
            out.updateBlenderMenu()
        }
        document.getElementById('blenderIndex').innerHTML=(player.blenderIndex+1)+' / '+blenderRecipes.length

        let item=blenderRecipes[player.blenderIndex].item

        document.getElementById('blenderName').innerHTML=MATH.doGrammar(item)+'<p style="position:fixed;font-size:13px;left:50%;top:120%;transform:translate(-50%,-50%)">'+itemSVGCode[item+'_description']
        +'</p></div>'

        document.getElementById('blenderItem').innerHTML=itemSVGCode[item].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','').replace('translate(0px,7px)','translate(-2px,2px)').replace('scale(0.77,0.77)','scale(0.5,0.5)')
        document.getElementById('blenderItem').style.transform='translate(70px,50px) scale(3,3)'

        document.getElementById('blenderReq').innerHTML=''

        for(let i in blenderRecipes[player.blenderIndex].req){

            let r=blenderRecipes[player.blenderIndex].req[i]

            document.getElementById('blenderReq').innerHTML+="<div style='position:fixed;left:75%;top:20px;transform:translate(-50%,-50%) translate("+((i-blenderRecipes[player.blenderIndex].req.length*0.5+0.5)*90)+"px,0px) scale(1.75,1.75)'>"+itemSVGCode[r[0]].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','').replace('translate(0px,7px)','translate(-2px,2px)').replace('scale(0.77,0.77)','scale(0.5,0.5)')+'<p style="position:fixed;font-size:8px;left:20px;top:20px">x'+r[1]+'</p></div>'
        }

        let f=function(){
            
            let maximumCanCraft=Infinity

            for(let i in blenderRecipes[player.blenderIndex].req){

                let r=blenderRecipes[player.blenderIndex].req[i]
                maximumCanCraft=Math.min(maximumCanCraft,(items[r[0]].amount/r[1])|0)
            }

            document.getElementById('blenderCraftAmount').value=MATH.constrain(document.getElementById('blenderCraftAmount').value,maximumCanCraft?1:0,maximumCanCraft)

            if(!Number(document.getElementById('blenderCraftAmount').value)){

                document.getElementById('blenderCraft').style.backgroundColor='rgb(50,120,50)'
                document.getElementById('blenderCraft').onclick=function(){}

            } else {

                document.getElementById('blenderCraft').style.backgroundColor='rgb(0,170,0)'
                document.getElementById('blenderCraft').onclick=function(){

                    let am=Number(document.getElementById('blenderCraftAmount').value),waitTime=30*am

                    player.isCrafting={time:TIME+waitTime,waitTime:waitTime,item:item,amount:am}

                    for(let i in blenderRecipes){

                        let b=blenderRecipes[i]

                        if(b.item===player.isCrafting.item){

                            for(let j in b.req){

                                items[b.req[j][0]].amount-=b.req[j][1]*am

                                player.addMessage('-'+MATH.addCommas((b.req[j][1]*am)+'')+' '+(am>1?MATH.doPlural(MATH.doGrammar(b.req[j][0])):MATH.doGrammar(b.req[j][0])))
                            }

                            break
                        }
                    }

                    out.updateInventory()
                    out.updateBlenderMenu()
                }           
            }

            document.getElementById('blenderReq').innerHTML=''

            let num=Number(document.getElementById('blenderCraftAmount').value)

            for(let i in blenderRecipes[player.blenderIndex].req){

                let r=blenderRecipes[player.blenderIndex].req[i]

                document.getElementById('blenderReq').innerHTML+="<div style='position:fixed;left:75%;top:20px;transform:translate(-50%,-50%) translate("+((i-blenderRecipes[player.blenderIndex].req.length*0.5+0.5)*90)+"px,0px) scale(1.75,1.75)'>"+itemSVGCode[r[0]].replaceAll('AMOUNTININVENTORY','').replaceAll('AMOUNTOFITEMREQUIREDTOCRAFT','').replace('translate(0px,7px)','translate(-2px,2px)').replace('scale(0.77,0.77)','scale(0.5,0.5)')+'<p style="position:fixed;font-size:8px;left:20px;top:20px">x'+MATH.addCommas((r[1]*(num?num:1))+'')+'</p></div>'
            }
        }
        f()
        document.getElementById('blenderMenu').onmousemove=document.getElementById('blenderCraftAmount').onchange=f

    }
    
    out.addMessage=function(m,color=[30,70,255]){
        
        ctx.textAlign='center'
        ctx.textBaseline='middle'
        ctx.font='16px arial'
        let met=ctx.measureText(m)
        
        met=Math.abs(met.actualBoundingBoxLeft)+Math.abs(met.actualBoundingBoxRight)
        
        let s=1
        
        if(met>232){
            
            s=232/met
        }
        
        if(   false&&    m.indexOf('(from')>-1){
            
            let i=m.indexOf('(from')+6,f=m.substr(i,m.length).replace(')',''),v=m.indexOf('+')+1,vx=m.indexOf(' '),dis=m.substr(v,vx).replaceAll(',','')-1,found=false
            
            for(let i in out.messages){
                
                let t=out.messages[i]
                
                if(t.message.indexOf(f)>-1){
                    
                    found=true
                    
                    let _v=t.message.indexOf('+')+1,_vx=t.message.indexOf(' '),dat=t.message.substr(_v,_vx).replaceAll(',','')-1
                    t.message=t.message.substr(0,_v)+MATH.addCommas((dis+dat)+'')+' (from '+f+')'
                    t.life=3
                    
                    break
                }
            }
            
            if(!found){
                
                out.messages=[{message:m,color:'rgb('+color[0]+','+color[1]+','+color[2]+',',size:s*16,life:3},...out.messages]
            }
            
        } else {
            
            out.messages=[{message:m,color:'rgb('+color[0]+','+color[1]+','+color[2]+',',size:s*16,life:3},...out.messages]
            
        }
    }
    
    out.bodyDir=[]
    
    out.updateCamera=function(){
        
        if(user.clickedKeys.shift){
            
            out.shiftLock=!out.shiftLock
        }
        
        if(out.shiftLock){
            
            MATH.xRotate(MATH.yRotate(out.viewMatrix,out.cosYaw,out.sinYaw),out.cosPitch,out.sinPitch)
            
            out.cameraDir[0]=out.viewMatrix[2]
            out.cameraDir[1]=out.viewMatrix[6]
            out.cameraDir[2]=out.viewMatrix[10]
            
            out.cameraRaycastPoint.set(player.body.position.x+out.cameraDir[0]*out.zoom,player.body.position.y+0.35+out.cameraDir[1]*out.zoom,player.body.position.z+out.cameraDir[2]*out.zoom)
            
            world.raycastClosest(out.body.position,out.cameraRaycastPoint,out.cameraRaycastFilter,out.cameraRaycastResult)
            
            let d=out.cameraRaycastResult.distance<0?out.zoom:out.cameraRaycastResult.distance
            
            out.lookDir=[-out.cameraDir[0],-out.cameraDir[2]]
            
            let normalizedCamDir=vec2.normalize([],out.lookDir)
            
            MATH.translate(out.viewMatrix,-player.body.position.x-out.cameraDir[0]*d+normalizedCamDir[1],-player.body.position.y-0.35-out.cameraDir[1]*d,-player.body.position.z-out.cameraDir[2]*d-normalizedCamDir[0])
            
            MATH.mult(out.viewMatrix,out.projectionMatrix,out.viewMatrix)
            
            out.playerAngle=Math.atan2(-out.cameraDir[0],-out.cameraDir[2])
            
            quat.setAxisAngle(out.rotQuat,MATH.Y_AXIS,out.playerAngle)
            
            vec3.transformQuat(out.bodyDir,MATH.Z,out.rotQuat)
            
            mat4.fromQuat(out.modelMatrix,out.rotQuat)
            
            out.modelMatrix[12]=player.body.position.x
            out.modelMatrix[13]=player.body.position.y
            out.modelMatrix[14]=player.body.position.z
            
        } else {
            
            MATH.xRotate(MATH.yRotate(out.viewMatrix,out.cosYaw,out.sinYaw),out.cosPitch,out.sinPitch)
            
            out.cameraDir[0]=out.viewMatrix[2]
            out.cameraDir[1]=out.viewMatrix[6]
            out.cameraDir[2]=out.viewMatrix[10]
            
            out.cameraRaycastPoint.set(player.body.position.x+out.cameraDir[0]*out.zoom,player.body.position.y+0.35+out.cameraDir[1]*out.zoom,player.body.position.z+out.cameraDir[2]*out.zoom)
            
            world.raycastClosest(out.body.position,out.cameraRaycastPoint,out.cameraRaycastFilter,out.cameraRaycastResult)
            
            let d=out.cameraRaycastResult.distance<0?out.zoom:out.cameraRaycastResult.distance
            
            MATH.translate(out.viewMatrix,-player.body.position.x-out.cameraDir[0]*d,-player.body.position.y-0.35-out.cameraDir[1]*d,-player.body.position.z-out.cameraDir[2]*d)
            MATH.mult(out.viewMatrix,out.projectionMatrix,out.viewMatrix)
            
            vec2.normalize(out.lookDir,[out.body.velocity.x,out.body.velocity.z])
            
            out.playerAngle=Math.atan2(out.lookDir[0],out.lookDir[1])
            
            quat.setAxisAngle(out.lookQuat,MATH.Y_AXIS,out.playerAngle)
            
            if(!out.currentNPC){
                
                if(user.keys.w||user.keys.s||user.keys.a||user.keys.d)
                    quat.slerp(out.rotQuat,out.rotQuat,out.lookQuat,dt*6.5)
            }
            
            mat4.fromQuat(out.modelMatrix,out.rotQuat)
            
            vec3.transformQuat(out.bodyDir,MATH.Z,out.rotQuat)
            
            out.modelMatrix[12]=player.body.position.x
            out.modelMatrix[13]=player.body.position.y
            out.modelMatrix[14]=player.body.position.z
        }
        
        out.toolRot+=dt*10
        
        mat4.copy(out.toolMatrix,out.modelMatrix)
        mat4.rotateX(out.toolMatrix,out.toolMatrix,Math.max(0,(-Math.abs(out.toolRot-2)+2)*MATH.QUATER_PI))
        
        if(out.viewMatrixToChange){
            
            out.easeAmount+=(1-out.easeAmount)*dt*5
            MATH.lerpMatrix(out.viewMatrixCopy,out.viewMatrixToChange,out.easeAmount)
            out.viewMatrix=out.viewMatrixCopy.slice()
        }
    }
    
    out.updatePhysics=function(){
        
        out.cosYaw=Math.cos(out.yaw)
        out.sinYaw=Math.sin(out.yaw)
        out.cosPitch=Math.cos(out.pitch)
        out.sinPitch=Math.sin(out.pitch)
        
        let s=dt*out.walkSpeed,cdir=out.cosYaw,sdir=out.sinYaw
        
        if(!out.currentNPC&&!out.currentShop&&!out.removeAirFrictionUntilGrounded&&!out.isGliding){
            
            let dx=0,dz=0,c=0
            
            if(user.keys.d){
                
                dx=cdir
                dz=sdir
                c=1
            }
            
            if(user.keys.w){
                
                dx+=sdir
                dz-=cdir
                c++
            }
            
            if(user.keys.a){
                
                dx-=cdir
                dz-=sdir
                c++
            }
            
            if(user.keys.s){
                
                dx-=sdir
                dz+=cdir
                c++
            }
            
            if(c>1){
                
                dx*=0.707106781
                dz*=0.707106781
                
            }
            
            out.body.velocity.x+=dx*s
            out.body.velocity.z+=dz*s

        } else if(out.isGliding){
            
            cdir*=0.7
            sdir*=0.7
            
            if(user.keys.d){
                
                out.bodyDir[0]+=cdir
                out.bodyDir[2]+=sdir
            }
            
            if(user.keys.w){
                
                out.bodyDir[0]+=sdir
                out.bodyDir[2]-=cdir
            }
            
            if(user.keys.a){
                
                out.bodyDir[0]-=cdir
                out.bodyDir[2]-=sdir
            }
            
            if(user.keys.s){
                
                out.bodyDir[0]-=sdir
                out.bodyDir[2]+=cdir
            }
            
            vec3.normalize(out.bodyDir,out.bodyDir)
            
            out.body.velocity.x=out.bodyDir[0]*out.gliderSpeed
            out.body.velocity.z=out.bodyDir[2]*out.gliderSpeed
            out.body.velocity.y=out.gliderFall
        }
        
        if(out.grounded){
            
            if(out.isGliding){
                
                out.isGliding=false
                out.updateGear()
            }
            
            out.removeAirFrictionUntilGrounded=false
            
            if(user.keys[' ']){
                
                out.grounded=false
                out.body.velocity.y=out.jumpPower
            }
            
            out.body.velocity.x/=dt*out.friction+1
            out.body.velocity.z/=dt*out.friction+1
            
        } else if(!out.removeAirFrictionUntilGrounded){
            
            out.body.position.y+=0.001

            out.body.velocity.x/=dt*out.friction+1
            out.body.velocity.z/=dt*out.friction+1
        }
        
        if((out.body.velocity.y<5||out.removeAirFrictionUntilGrounded)&&user.clickedKeys[' ']){
            
            if(!out.isGliding){
                
                out.isGliding=true
                out.grounded=false
                out.removeAirFrictionUntilGrounded=false
                
            } else {
                
                out.isGliding=false
            }
            
            out.updateGear()
        }
        
        if(out.pollen||out.hiveBalloon.pollen){
            
            out.stopConverting=false
        }
        
        out.converting=out.convertingBalloon=triggers.hive.colliding&&!out.stopConverting
        
        if(triggers.hive.colliding){
            
            player.radioactiveParticleTimer-=dt
            
            for(let y=0;y<player.hive.length;y++){
                
                for(let x=0;x<player.hive[y].length;x++){
                    
                    if(player.hive[y][x].type){
                        
                        let c=COLORS.whiteArr,m=player.hive[y][x].bee.mutation
                        
                        if(m){
                            
                            c=({maxEnergy:[100,170,255],attack:[255,20,20],gatherAmount:[100,255,100],convertAmount:COLORS.honey,abilityRate:[255,100,255]})[m.stat]
                        }
                        
                        textRenderer.addSingle(player.hive[y][x].level.toString(),[player.hivePos[0]+x*0.8-0.25,player.hivePos[1]+y*0.8-2.5,player.hivePos[2]+0.1],c,-1.5)
                        
                    }
                    
                    if(player.hive[y][x].beequip){
                        
                        textRenderer.addDecal([player.hivePos[0]+x*0.8+0,player.hivePos[1]+y*0.8-2.25,player.hivePos[2]+0.1],player.hive[y][x].beequip.type,[-1.3,-1.3])
                        
                    }
                        
                    if(player.hive[y][x].radioactive>0){
                        
                        player.hive[y][x].radioactive-=dt
                        
                        textRenderer.addDecal([player.hivePos[0]+x*0.8+0.25,player.hivePos[1]+y*0.8-2.5,player.hivePos[2]+0.1],'radioactive',[1.3,1.3])
                        
                        if(player.radioactiveParticleTimer<=0){
                            
                            player.radioactiveParticleTimer=1
                            
                            ParticleRenderer.add({x:player.hivePos[0]+x*0.8,y:player.hivePos[1]+y*0.8-2.25,z:player.hivePos[2]+0.1,vx:MATH.random(-0.15,0.15),vy:MATH.random(-0.15,0.15),vz:0,grav:0,size:250,col:[0,1,0],life:2,rotVel:MATH.random(-3,3),alpha:0.5})
                            
                        }
                    }
                }
            }
        }
        
    }
    
    out.updateFields=function(){
        
        player.fieldIn=null
        
        for(let i in fieldInfo){

            fieldInfo[i].degration-=dt*0.00027777777
            fieldInfo[i].corruption=MATH.constrain(fieldInfo[i].corruption-dt*0.6,0,100)
            
            updateFlower(i,MATH.random(0,fieldInfo[i].width)|0,MATH.random(0,fieldInfo[i].length)|0,function(f){
                
                f.height+=0.05
                f.goo=Math.max(f.goo-0.25,0)
                f.pollinationTimer-=0.075
                
                if(f.pollinationTimer<=0){
                    
                    f.pollinationTimer=1
                    f.level=Math.max(f.ogLevel,f.level-1)
                }
                
                if(TIME-fieldInfo[i].haze.start<30&&TIME-fieldInfo[i].haze.delay>0.07){
                    
                    fieldInfo[i].haze.delay=TIME
                    
                    if(f.level<5){
                        
                        f.level++
                        f.pollinationTimer=1
                        
                    } else {
                        
                        f.height=1
                    }
                    
                    for(let j=0;j<6;j++){
                        
                        ParticleRenderer.add({x:f.x+fieldInfo[i].x,y:fieldInfo[i].y+0.5,z:f.z+fieldInfo[i].z,vx:MATH.random(-1,1),vy:Math.random()*2,vz:MATH.random(-1,1),grav:-3,size:100,col:[1,1,MATH.random(0.6,1)],life:1,rotVel:MATH.random(-3,3),alpha:2})
                    }
                    
                } else {
                    
                    if(TIME-fieldInfo[i].haze.start>30){
                        
                        fieldInfo[i].haze={}
                    }
                }
                
            },true,true,true)
            
            if(!player.fieldIn){

                let x=(Math.round(player.body.position.x-fieldInfo[i].x)),
                    z=(Math.round(player.body.position.z-fieldInfo[i].z))
                
                if(x>=0&&x<fieldInfo[i].width&&z>=0&&z<fieldInfo[i].length&&Math.abs(player.body.position.y-fieldInfo[i].y)<2){
                    
                    player.fieldIn=i
                    player.flowerIn.x=x
                    player.flowerIn.z=z
                    
                    if(fieldInfo[i].corruption|0)
                    player.addEffect('corruption',false,false,fieldInfo[i].corruption|0)
                }
            }
        }
        
        if(player.fieldIn&&(player._flowerIn.x!==player.flowerIn.x||player._flowerIn.z!==player.flowerIn.z)){
            
            collectPollen({x:player.flowerIn.x,z:player.flowerIn.z,pattern:[[0,0]],amount:player.movementCollection,stackOffset:0.4,yOffset:1,gooTrail:out.currentGear.boots==='gummyBoots'})
            
            player._flowerIn={...player.flowerIn}
        }
        
        out.toolCooldown-=dt
        
        if(gear.tool[out.currentGear.tool].particles) gear.tool[out.currentGear.tool].particles()
        
        if((user.keys.j||user.mousePressed)&&out.toolCooldown<=0){
            out.toolUses++
            
            let arr=[]
            
            if(out.fieldIn){
                
                let p=[],a=out.playerAngle
                
                if(gear.tool[out.currentGear.tool].computeDirection===undefined){
                    
                    for(let i in gear.tool[out.currentGear.tool].collectPattern){
                        
                        p.push(gear.tool[out.currentGear.tool].collectPattern[i].slice())
                    }
                    
                    if(Math.abs(a)>MATH.PI_SUB_QUATER){
                        
                        
                    } else if(Math.abs(a)<MATH.QUATER_PI){
                        
                        for(let i in p){
                            
                            p[i][1]=-p[i][1]
                        }
                        
                    } else if(MATH.HALF_PI-a>MATH.QUATER_PI){
                        
                        for(let i in p){
                            
                            p[i]=[p[i][1],-p[i][0]]
                        }
                        
                    } else if(MATH.HALF_PI-a<MATH.QUATER_PI){
                        
                        for(let i in p){
                            
                            p[i]=[-p[i][1],p[i][0]]
                        }
                    }
                    
                } else {
                    
                    p=gear.tool[out.currentGear.tool].collectPattern
                }
                
                arr=p.slice()
                
                collectPollen({x:player.flowerIn.x,z:player.flowerIn.z,pattern:p,amount:gear.tool[out.currentGear.tool].collectAmount,yOffset:1.5,stackHeight:0.75,isGummyBaller:out.currentGear.tool==='gummyBaller',multiplier:player.pollenFromTools})
                
            }
            
            if(gear.tool[out.currentGear.tool].ability) gear.tool[out.currentGear.tool].ability(arr)
            
            out.toolCooldown=gear.tool[out.currentGear.tool].cooldown/player.collectorSpeed
            out.toolRot=0
        }
        
        for(let i in out.sprinklers){
            
            out.sprinklers[i].update()
        }
        
        for(let i=objects.flames.length;i--;){
            
            if(objects.flames[i].update()){
                
                objects.flames[i].die(i)
            }
        }
    }
    
    return out
    
})({})

function computeSceneViewMatrix(x,y,z,yaw,pitch){
    
    let m=new Float32Array(16)
    
    let cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch)
    
    MATH.xRotate(MATH.yRotate(m,cy,sy),cp,sp)
    
    MATH.translate(m,-x,-y,-z)
    
    MATH.mult(m,player.projectionMatrix,m)
    
    return m
}

NPCs={
    
    //choice in dialouge
    // ['ask me a math question',[['2 + 3',function(){NPCs.blackBear.dialogue.push('','5! :D');NPCs.blackBear.dialogueIndex++}],['9 + 10',function(){NPCs.blackBear.dialogue.push('','21! :D');NPCs.blackBear.dialogueIndex++}]]]

    blackBear:{
        
        viewMatrix:[24,2,0.5,MATH.HALF_PI,-0.25],
        exclaimPos:[29,0.5,0.5],
        dialogueIndex:0,
        dialogue:window.dialogue_blackBear(player,items,NPCs),
        mesh:new Mesh(),
        meshParams:{x:0.5,y:0,z:-31.5,r:1,s:1.2,texture:{face:{u:0,v:0},torso:{texture:false,u:0,v:0.5},extremities:{u:0,v:0}}}
    },
    
    polarBear:{
        
        repeatable:true,
        viewMatrix:[-1.5,24.5,60,Math.PI,-0.25],
        exclaimPos:[-1.5,22.5,66],
        dialogueIndex:0,
        dialogue:[],
        mesh:new Mesh(),
        meshParams:{x:1.5,y:22,z:-68,r:2,s:1.2,texture:{face:{u:1,v:0},torso:{texture:false,u:1,v:0},extremities:{u:0,v:0}}}
    },

    roboBear:{
        
        repeatable:true,
        viewMatrix:[53.5-5,7,40,MATH.HALF_PI,-0.25],
        exclaimPos:[53.5,5.5,40],
        dialogueIndex:0,
        dialogue:[],
        mesh:new Mesh(),
        meshParams:{x:40,y:5,z:-55,r:1,s:1.2,texture:{face:{u:3,v:0},torso:{texture:false,u:3.1,v:0.5},extremities:{u:0,v:0}}}
    },

    pandaBear:{
        
        viewMatrix:[-37,8.5,39.5,Math.PI,-0.25],
        exclaimPos:[-37,7.5,45.5],
        dialogueIndex:0,
        dialogue:window.dialogue_pandaBear(player,items,NPCs),
        mesh:new Mesh(),
        meshParams:{x:37,y:7,z:-47.5,r:2,s:1.2,texture:{face:{u:4,v:0},torso:{texture:false,u:4,v:0.8},extremities:{u:0.3,v:0.5}}}
    },
}

for(let i in NPCs){
    
    NPCs[i].viewMatrix=computeSceneViewMatrix(...NPCs[i].viewMatrix)
}

let shops={
    
    cool:{
        
        // items:[{

        //     name:'gummyMask',
        //     slot:'mask',
        //     viewMatrix:[25,1,10,-Math.PI,-0.4],
        // },{
            
        //     name:'diamondMask',
        //     slot:'mask',
        //     viewMatrix:[20,1,10,-Math.PI,-0.4],
        // },{
            
        //     name:'demonMask',
        //     slot:'mask',
        //     viewMatrix:[15,1,10,-Math.PI,-0.4],
        // },{
            
        //     name:'coconutCanister',
        //     slot:'backpack',
        //     viewMatrix:[10,1,10,-Math.PI,-0.4],
        // }],
        
        items:[],
        currentIndex:0,message:'Explore Cool Shop'
    },
}

shopGearMesh.setMeshFromFunction(function(box,a,cylinder,sphere,applyFinalRotation,c,star){

    let num=0

    for(let i in gear){

        if(i.indexOf('Amulet')>-1||i==='glider') continue

        for(let j in gear[i]){

            if(j==='none') continue

            shops.cool.items.push({name:j,slot:i,viewMatrix:[25-(num%10)*4,1,10+((num/10)|0)*6,-Math.PI,-0.4]})
            mat4.fromRotationTranslation(shopGearMesh.matrix,quat.fromEuler([],0,i==='backpack'?0:180,0),[25-(num%10)*4,-0.5,13+((num/10)|0)*6])
            
            gear[i][j].mesh(box,cylinder,sphere,star,applyFinalRotation)

            num++

        }
    }
})

shopGearMesh.setBuffers()

for(let i in shops){
    
    for(let j in shops[i].items){
        
        shops[i].items[j].viewMatrix=computeSceneViewMatrix(...shops[i].items[j].viewMatrix)
    }
}

let user=(function(out){
    
    out.mouseX=0
    out.mouseY=0
    out.mousePressed=false
    out.mouseClicked=false
    
    out.keys={}
    out.clickedKeys={}
    
    uiCanvas.onmousedown=function(e){
        
        out.mousePressed=true
        
        if(player.itemDragging||player.beequipDragging){
            
            if(player.canUseItem||player.itemDragging&&!items[player.itemDragging].canUseOnSlot){
                
                if(player.beequipDragging){
                    
                    if(player.currentGear.beequips[player.beequipLookingAt].bee&&player.hive[player.currentGear.beequips[player.beequipLookingAt].bee[1]][player.currentGear.beequips[player.beequipLookingAt].bee[0]].beequip===player.beequipDragging){
                        
                        player.hive[player.currentGear.beequips[player.beequipLookingAt].bee[1]][player.currentGear.beequips[player.beequipLookingAt].bee[0]].beequip=null
                        
                    }
                    
                    player.hive[player.hiveIndex[1]][player.hiveIndex[0]].beequip=player.beequipDragging
                    player.currentGear.beequips[player.beequipLookingAt].bee=player.hiveIndex
                    player.beequipDragging=false
                    player.updateHive()
                    
                } else {
                    
                    if(TIME-items[player.itemDragging].cooldown>items[player.itemDragging].maxCooldown){
                        
                        player.stats[player.itemDragging]++
                        items[player.itemDragging].use()
                        items[player.itemDragging].cooldown=TIME
                        
                        player.updateInventory()
                        
                    } else {
                        
                        player.addMessage('Item is on a cooldown of '+MATH.doTime(items[player.itemDragging].maxCooldown-(TIME-items[player.itemDragging].cooldown))+'!',COLORS.redArr)
                    }
                    
                    player.itemDragging=false
                }
            }
            
        } else {
            
            if(!player.pointerLocked)
                uiCanvas.requestPointerLock()
        }
        
    }
    
    uiCanvas.onmouseup=function(e){
        
        out.mousePressed=false
        out.mouseClicked=true
    }
    
    uiCanvas.onmousemove=function(e){
        
        out.mouseX=e.x
        out.mouseY=e.y
        
        if(player.pointerLocked){
            
            player.yaw+=e.movementX*player.sensitivity
            player.pitch=MATH.constrain(player.pitch-e.movementY*player.sensitivity,-MATH.HALF_PI,MATH.HALF_PI)
        }
    }
    
    document.onkeydown=function(e){
        
        out.keys[e.key.toLowerCase()]=true
        out.clickedKeys[e.key.toLowerCase()]=true
    }
    
    document.onkeyup=function(e){
        
        out.keys[e.key.toLowerCase()]=false
        
        if('123456'.indexOf(e.key)>-1){
            
            let n=Number(e.key)-1
            
            if(hotbarSlots[n].itemType){
                
                if(TIME-items[hotbarSlots[n].itemType].cooldown>items[hotbarSlots[n].itemType].maxCooldown){
                    
                    player.stats[hotbarSlots[n].itemType]++
                    items[hotbarSlots[n].itemType].use()
                    items[hotbarSlots[n].itemType].cooldown=TIME
                    player.updateInventory()
                    
                } else {
                    
                    player.addMessage('Item is on a cooldown of '+MATH.doTime(items[hotbarSlots[n].itemType].maxCooldown-(TIME-items[hotbarSlots[n].itemType].cooldown))+'!',COLORS.redArr)
                }
            }
        }

        if(e.key==='e'&&player.currentNPC&&TIME-player.eKeyDialoguePress>0.75){
            
            dialogueBox.onclick()
        }
    }
    
    uiCanvas.oncontextmenu=function(e){
        
        e.preventDefault()
    }
    
    uiCanvas.onwheel=function(e){
        
        e.preventDefault()
        player.zoom=MATH.constrain(player.zoom+e.deltaY*0.01,5,20)
    }
    
    out.update=function(){
        
        out.clickedKeys={}
        out.mouseClicked=false
    }
    
    return out
    
})({})

let textRenderer=(function(out){
    
    out.data=[]
    out.decals=[]
    
    out.decalUV={
        
        radioactive:[0,0],
        rect:[128/1024,0],
        flower:[128*2/1024,0],
        glow:[128*3/1024,0],
        candycane:[128*4/1024,0],
        boombox:[128*5/1024,0],
        pencil:[128*6/1024,0],
        exclaim:[128*7/1024,0],
        lightrays:[128*0/1024,128/1024],
        circle:[128*1/1024,128/1024],
        arc:[128*2/1024,128/1024],
        smiley:[128*3/1024,128/1024]
    }
    
    out.instanceData=[]
    out.decal_instanceData=[]
    
    out.instanceBuffer=gl.createBuffer()
    out.vertBuffer=gl.createBuffer()
    out.indexBuffer=gl.createBuffer()
    out.decal_vertBuffer=gl.createBuffer()
    out.decal_indexBuffer=gl.createBuffer()
    
    let w=0.09,h=0.105,fx=0.002,fy=-0.8955
    
    let v=[
        
        -w,-h,fx,fy,
        w,-h,w+fx,fy,
        w,h,w+fx,-h/(600/512)+fy,
        -w,h,fx,-h/(600/512)+fy
        
    ],i=[0,1,2,2,3,0],eps=2/1024
    
    gl.bindBuffer(gl.ARRAY_BUFFER,out.vertBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(v),gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,out.indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(i),gl.STATIC_DRAW)
    
    out.indexAmount=i.length
    
    v=[
        
        -0.5,-0.5,0+eps,0+eps,
        0.5,-0.5,(128/1024)-eps,0+eps,
        0.5,0.5,(128/1024)-eps,(128/1024)-eps,
        -0.5,0.5,0+eps,(128/1024)-eps
    ]
    
    gl.bindBuffer(gl.ARRAY_BUFFER,out.decal_vertBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(v),gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,out.decal_indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(i),gl.STATIC_DRAW)
    
    out.decal_indexAmount=i.length
    
    let charUV={
        
        0:[0,0],
        1:[0.1,0],
        2:[0.2,0],
        3:[0.3,0],
        4:[0.4,0],
        5:[0.5,0],
        6:[0.59,0],
        7:[0.7,0],
        8:[0.79,0],
        9:[0.89,0],
        '+':[0.002,0.13],
        '-':[0.002,0.13],
        '⇆':[0.1,0.14],
        ',':[0.2075,0.14],
        '/':[0.3,0.13],
        '.':[0.2075,0.14],
        '-':[0.4,0.13],
        ':':[0.5,0.13],
        '(':[0.6,0.13],
        ')':[0.68,0.13],
        '%':[0.79,0.12],
        '.':[0.885,0.13],
        a:[0,0.25],
        b:[0.1,0.25],
        c:[0.2,0.25],
        d:[0.3,0.25],
        e:[0.4,0.25],
        f:[0.5,0.25],
        g:[0.6,0.26],
        h:[0.69,0.25],
        i:[0.81,0.25],
        j:[0.9,0.25],
        k:[0.025,0.375],
        l:[0.11,0.375],
        m:[0.2,0.375],
        n:[0.31,0.375],
        o:[0.4,0.375],
        p:[0.5,0.375],
        q:[0.6,0.375],
        r:[0.7,0.375],
        s:[0.8,0.375],
        t:[0.9,0.375],
        u:[0.02,0.5],
        v:[0.108,0.5],
        w:[0.2,0.5],
        x:[0.305,0.5],
        y:[0.4,0.5],
        z:[0.5,0.5],
        A:[0,0.625],
        B:[0.1,0.625],
        C:[0.2,0.625],
        D:[0.3,0.625],
        E:[0.4,0.625],
        F:[0.5,0.625],
        G:[0.6,0.625],
        H:[0.7,0.625],
        I:[0.8,0.625],
        J:[0.9,0.625],
        K:[0.01,0.75],
        L:[0.1,0.75],
        M:[0.2,0.75],
        N:[0.3,0.75],
        O:[0.4,0.75],
        P:[0.5,0.75],
        Q:[0.6,0.75],
        R:[0.7,0.75],
        S:[0.8,0.75],
        T:[0.9,0.75],
        U:[0.02,0.875],
        V:[0.1,0.875],
        W:[0.2,0.875],
        X:[0.3,0.875],
        Y:[0.4,0.875],
        Z:[0.5,0.875],
        ' ':[0.7,0.875],
        
    }
    
    out.add=function(message,pos,color,critType,prefix='+',scale=1,addCommas=true){
    
        let m,s
        
        message=message.toString()
        
        if(addCommas){
            
            if(player.setting_enablePollenAbv){
                
                s=(message.length*0.25+1.5)*scale
                m=prefix+MATH.abvNumber(message)
                
            } else {
                
                m=prefix+MATH.addCommas(message)
                s=(m.length*0.2+1.5)*scale
            }
            
        } else {
            
            m=message.toString()
            s=scale
        }
        
        for(let i=0;i<m.length;i++){
            
            out.data.push({
                
                critType:critType,
                life:1,
                uv:charUV[m[i]],
                pos:pos,
                col:[color[0]*MATH.INV_255,color[1]*MATH.INV_255,color[2]*MATH.INV_255],
                offset:[(i-((m.length-1)*0.5))*0.135,0],
                size:s
            })
        }
        
    }
    
    out.addSingle=function(message,pos,color,scale=1,splitCommas=true,addCommas=true,offx=0,offy=0){
        let m=message
        
        if(splitCommas){
            
            m=message.split('/')
            
            if(m.length>1){
                
                m=MATH.abvNumber(m[0])+'/'+MATH.abvNumber(m[1]),s
            } else {
                
                m=addCommas?MATH.addCommas(m[0]):m[0]
            }
        }
        
        if(scale>0){
            
            s=(m.length*0.2+1.5)*scale
            
        } else {
            
            s=-scale
        }
        
        for(let i=0;i<m.length;i++){
            
            out.instanceData.push(pos[0],pos[1],pos[2],(i-((m.length-1)*0.5))*(!splitCommas?0.135:0.145)+offx,offy,charUV[m[i]][0],charUV[m[i]][1],color[0]*MATH.INV_255,color[1]*MATH.INV_255,color[2]*MATH.INV_255,s,s,0)
            
        }
        
    }
    
    out.ctxData=[]
    
    out.addCTX=function(message,pos,color,scale){
        
        out.ctxData.push({message:message,pos:pos,color:'rgb('+color[0]+','+color[1]+','+color[2]+')',scale:scale})
    }
    
    out.addDecal=function(pos,type,size,rot=0){
        
        out.drawDecals=true
        out.decal_instanceData.push(...pos,0,0,...out.decalUV[type],1,1,1,...size,rot)
    }
    
    out.addDecalRaw=function(){
        
        out.drawDecals=true
        out.decal_instanceData.push(...arguments)
    }
    
    out.render=function(dt,SIN_TIME){
        
        gl.useProgram(textRendererProgram)
        gl.uniformMatrix4fv(glCache.text_viewMatrix,gl.FALSE,player.viewMatrix)
        
        if(out.drawDecals){
            
            gl.bindTexture(gl.TEXTURE_2D,textures.decals)
            
            gl.bindBuffer(gl.ARRAY_BUFFER,out.decal_vertBuffer)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,out.decal_indexBuffer)
            gl.vertexAttribPointer(glCache.text_vertPos,2,gl.FLOAT,gl.FALSE,16,0)
            gl.vertexAttribPointer(glCache.text_vertUV,2,gl.FLOAT,gl.FALSE,16,8)
            gl.bindBuffer(gl.ARRAY_BUFFER,out.instanceBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(out.decal_instanceData),gl.DYNAMIC_DRAW)
            gl.vertexAttribPointer(glCache.text_instanceOrigin,3,gl.FLOAT,gl.FALSE,52,0)
            gl.vertexAttribDivisor(glCache.text_instanceOrigin,1)
            gl.vertexAttribPointer(glCache.text_instanceOffset,2,gl.FLOAT,gl.FALSE,52,12)
            gl.vertexAttribDivisor(glCache.text_instanceOffset,1)
            gl.vertexAttribPointer(glCache.text_instanceUV,2,gl.FLOAT,gl.FALSE,52,20)
            gl.vertexAttribDivisor(glCache.text_instanceUV,1)
            gl.vertexAttribPointer(glCache.text_instanceColor,3,gl.FLOAT,gl.FALSE,52,28)
            gl.vertexAttribDivisor(glCache.text_instanceColor,1)
            gl.vertexAttribPointer(glCache.text_instanceInfo,3,gl.FLOAT,gl.FALSE,52,40)
            gl.vertexAttribDivisor(glCache.text_instanceInfo,1)
            gl.drawElementsInstanced(gl.TRIANGLES,out.decal_indexAmount,gl.UNSIGNED_SHORT,0,out.decal_instanceData.length*MATH.INV_13)
            
            out.decal_instanceData=[]
            out.drawDecals=false
            
        } else {
            
            gl.vertexAttribDivisor(glCache.text_instanceOrigin,1)
            gl.vertexAttribDivisor(glCache.text_instanceOffset,1)
            gl.vertexAttribDivisor(glCache.text_instanceUV,1)
            gl.vertexAttribDivisor(glCache.text_instanceColor,1)
            gl.vertexAttribDivisor(glCache.text_instanceInfo,1)
        }
        
        let t=SIN_TIME*0.5+0.5,_t=t
        
        for(let i=out.data.length;i--;){
            
            let d=out.data[i],s=d.size*Math.min(d.life*7,1)
            
            d.life-=dt
            
            if(d.critType===1){
                
                out.instanceData.push(d.pos[0],d.pos[1],d.pos[2],d.offset[0],d.offset[1],d.uv[0],d.uv[1],d.col[0]*t,MATH.lerp(1,d.col[1],t),d.col[2]*t,s,s,SIN_TIME*0.4)
                
            } else if(d.critType===2){
                
                out.instanceData.push(d.pos[0],d.pos[1],d.pos[2],d.offset[0],d.offset[1],d.uv[0],d.uv[1],MATH.lerp(0.7,d.col[0],_t),d.col[1]*_t,MATH.lerp(0.7,d.col[2],_t),s,s,SIN_TIME*0.4)
                
            } else {
                
                out.instanceData.push(d.pos[0],d.pos[1],d.pos[2],d.offset[0],d.offset[1],d.uv[0],d.uv[1],d.col[0],d.col[1],d.col[2],s,s,0)
            }
            
            if(d.life<=0){
                
                out.data.splice(i,1)
            }
        }
        
        gl.bindTexture(gl.TEXTURE_2D,textures.text)
        gl.bindBuffer(gl.ARRAY_BUFFER,out.vertBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,out.indexBuffer)
        gl.vertexAttribPointer(glCache.text_vertPos,2,gl.FLOAT,gl.FALSE,16,0)
        gl.vertexAttribPointer(glCache.text_vertUV,2,gl.FLOAT,gl.FALSE,16,8)
        gl.bindBuffer(gl.ARRAY_BUFFER,out.instanceBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(out.instanceData),gl.DYNAMIC_DRAW)
        gl.vertexAttribPointer(glCache.text_instanceOrigin,3,gl.FLOAT,gl.FALSE,52,0)
        gl.vertexAttribPointer(glCache.text_instanceOffset,2,gl.FLOAT,gl.FALSE,52,12)
        gl.vertexAttribPointer(glCache.text_instanceUV,2,gl.FLOAT,gl.FALSE,52,20)
        gl.vertexAttribPointer(glCache.text_instanceColor,3,gl.FLOAT,gl.FALSE,52,28)
        gl.vertexAttribPointer(glCache.text_instanceInfo,3,gl.FLOAT,gl.FALSE,52,40)
        gl.drawElementsInstanced(gl.TRIANGLES,out.indexAmount,gl.UNSIGNED_SHORT,0,out.instanceData.length*MATH.INV_13)
        
        gl.vertexAttribDivisor(glCache.text_instanceOrigin,0)
        gl.vertexAttribDivisor(glCache.text_instanceOffset,0)
        gl.vertexAttribDivisor(glCache.text_instanceUV,0)
        gl.vertexAttribDivisor(glCache.text_instanceColor,0)
        gl.vertexAttribDivisor(glCache.text_instanceInfo,0)
        
        out.instanceData=[]
    }
    
    out.draw=function(){
        
        if(!out.ctxData.length){return}
        
        ctx.strokeStyle='rgb(0,0,0)'
        ctx.fillStyle='rgb(255,255,255)'
        ctx.lineWidth=4
        
        for(let i=out.ctxData.length;i--;){
            
            let t=out.ctxData[i]
            
            let p=vec4.transformMat4([],[...t.pos,1],player.viewMatrix)
            
            p[0]/=p[3]
            p[1]/=p[3]
            
            if(p[2]>0){
                
                ctx.lineWidth=t.scale*0.2/p[2]
                ctx.font=(t.scale/p[2])+'px arial'
                ctx.strokeText(t.message,p[0]*half_width+half_width,height-(p[1]*half_height+half_height))
                ctx.fillText(t.message,p[0]*half_width+half_width,height-(p[1]*half_height+half_height))
            }
        }
        
        out.ctxData=[]
    }
    
    
    return out
    
})({})

let ParticleRenderer=(function(out){
    
    out.particles=[]
    out.vertBuffer=gl.createBuffer()
    out.verts=[]
    
    out.add=function(params){
        
        params.rot=params.rot!==undefined?params.rot:Math.random()*MATH.TWO_PI
        params.lifespan=params.life
        out.particles.push(params)
    }
    
    out.render=function(){
        
        if(!out.particles.length) return
        
        out.verts=[]
        
        for(let i=out.particles.length;i--;){
            
            let d=out.particles[i]
            d.vy+=d.grav*dt
            d.x+=d.vx*dt
            d.y+=d.vy*dt
            d.z+=d.vz*dt
            d.rot+=d.rotVel*dt
            d.life-=dt
            d.col[3]=d.life*d.alpha/d.lifespan
            
            
            out.verts.push(d.x,d.y,d.z,d.col[0],d.col[1],d.col[2],d.col[3],d.size,d.rot)
            
            if(d.life<=0){
                
                out.particles.splice(i,1)
            }
        }
        
        gl.useProgram(particleRendererProgram)
        gl.uniformMatrix4fv(glCache.particle_viewMatrix,gl.FALSE,player.viewMatrix)
    
        gl.bindBuffer(gl.ARRAY_BUFFER,out.vertBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(out.verts),gl.DYNAMIC_DRAW)
        gl.vertexAttribPointer(glCache.particle_vertPos,3,gl.FLOAT,gl.FALSE,36,0)
        gl.vertexAttribPointer(glCache.particle_vertColor,4,gl.FLOAT,gl.FALSE,36,12)
        gl.vertexAttribPointer(glCache.particle_vertSize,1,gl.FLOAT,gl.FALSE,36,28)
        gl.vertexAttribPointer(glCache.particle_vertRot,1,gl.FLOAT,gl.FALSE,36,32)
        gl.drawArrays(gl.POINTS,0,out.verts.length/9)
        
    }
    
    return out
    
})({})

let TrailRenderer=(function(out){
    
    out.trails=[]
    out.constantTrails=[]
    
    out.constantTrailVertBuffer=gl.createBuffer()
    out.constantTrailIndexBuffer=gl.createBuffer()
    
    out.regenerateConstantTrails=function(){
        
        let _verts=[],_index=[],l=0
        
        for(let i in out.constantTrails){
            
            out.constantTrails[i].meshOffsetIndex=l*2*7
            l+=out.constantTrails[i].length
            
            let vl=(_verts.length/7)
            _verts.push(...out.constantTrails[i].verts)
            _index.push(...out.constantTrails[i].index.map(x=>x+=vl))
        }
        
        out.constantTrailVerts=new Float32Array(_verts)
        out.constantTrailIndex=new Uint16Array(_index)
        
        gl.bindBuffer(gl.ARRAY_BUFFER,out.constantTrailVertBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,out.constantTrailVerts,gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,out.constantTrailIndexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,out.constantTrailIndex,gl.STATIC_DRAW)
    }
    
    out.Trail=function(params){
        
        out.trails.push(this)
        this.length=params.length
        this.size=params.size
        this.pos=[]
        this.color=params.color
        this.fadeTo=params.fadeTo
        this.triangle=params.triangle
        this.vertical=params.vertical
        this.skipFrame=params.skipFrame||1
        this.skipAdd=params.skipAdd||1
        
        for(let i=0;i<this.length;i++){
            
            this.pos.push([])
        }
        
        this.vertBuffer=gl.createBuffer()
        this.indexBuffer=gl.createBuffer()
        this.verts=new Float32Array(this.length*2*7)
        this.index=new Uint16Array((this.length-1)*12)
        
        for(let i=0,j=0;i<(this.length-1)*12;i+=12,j+=2){
            
            this.index[i]=0+j
            this.index[i+1]=1+j
            this.index[i+2]=2+j
            this.index[i+3]=2+j
            this.index[i+4]=3+j
            this.index[i+5]=1+j
            this.index[i+6]=2+j
            this.index[i+7]=1+j
            this.index[i+8]=0+j
            this.index[i+9]=1+j
            this.index[i+10]=3+j
            this.index[i+11]=2+j
            
        }
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.index,gl.STATIC_DRAW)
        
        this.addPos=function(pos){
            
            if(frameCount%this.skipAdd===0){
                
                this.pos.push(pos)
                if(this.pos.length>=this.length) this.pos.shift()
                this.recomputeMeshThisFrame=true
            }
        }
        
        let cacheArr=[]
        
        this.render=function(){
            
            if(this.recomputeMeshThisFrame&&frameCount%this.skipFrame===0){
                
                if(this.vertical){
                    
                    for(let i=0;i<this.pos.length;i++){
                        
                        let x1,y1,z1,x2,y2,z2,t=(i/this.length),size=this.triangle?this.size*t:this.size,r1,g1,b1,a1,r2,g2,b2,a2
                        
                        if(this.fadeTo){
                            
                            r1=MATH.lerp(this.fadeTo[0],this.color[0],t)
                            g1=MATH.lerp(this.fadeTo[1],this.color[1],t)
                            b1=MATH.lerp(this.fadeTo[2],this.color[2],t)
                            a1=MATH.lerp(this.fadeTo[3],this.color[3],t)
                            r2=r1
                            g2=g1
                            b2=b1
                            a2=a1
                            
                        } else {
                            
                            r1=this.color[0]
                            g1=this.color[1]
                            b1=this.color[2]
                            a1=this.color[3]
                            r2=r1
                            g2=g1
                            b2=b1
                            a2=a1
                        }
                        
                        this.verts[i*14]=this.pos[i][0]
                        this.verts[i*14+1]=this.pos[i][1]+size
                        this.verts[i*14+2]=this.pos[i][2]
                        this.verts[i*14+3]=r1
                        this.verts[i*14+4]=g1
                        this.verts[i*14+5]=b1
                        this.verts[i*14+6]=a1
                        
                        this.verts[i*14+7]=this.pos[i][0]
                        this.verts[i*14+8]=this.pos[i][1]-size
                        this.verts[i*14+9]=this.pos[i][2]
                        this.verts[i*14+10]=r2
                        this.verts[i*14+11]=g2
                        this.verts[i*14+12]=b2
                        this.verts[i*14+13]=a2
                        
                    }
                    
                } else {
                    
                    for(let i=0;i<this.pos.length;i++){
                    
                    let x1,y1,z1,x2,y2,z2,t=(i/this.length),size=this.triangle?this.size*t:this.size,r1,g1,b1,a1,r2,g2,b2,a2
                    
                    if(this.fadeTo){
                        
                        r1=MATH.lerp(this.fadeTo[0],this.color[0],t)
                        g1=MATH.lerp(this.fadeTo[1],this.color[1],t)
                        b1=MATH.lerp(this.fadeTo[2],this.color[2],t)
                        a1=MATH.lerp(this.fadeTo[3],this.color[3],t)
                        r2=r1
                        g2=g1
                        b2=b1
                        a2=a1
                        
                    } else {
                        
                        r1=this.color[0]
                        g1=this.color[1]
                        b1=this.color[2]
                        a1=this.color[3]
                        r2=r1
                        g2=g1
                        b2=b1
                        a2=a1
                    }
                    
                    if(i===0){
                        
                        let dir=vec3.sub([],this.pos[i+1],this.pos[i])
                        dir=[dir[2],0,-dir[0]]
                        vec3.normalize(dir,dir)
                        vec3.scale(dir,dir,size)
                        
                        x1=dir[0]+this.pos[i][0]
                        y1=dir[1]+this.pos[i][1]
                        z1=dir[2]+this.pos[i][2]
                        x2=-dir[0]+this.pos[i][0]
                        y2=-dir[1]+this.pos[i][1]
                        z2=-dir[2]+this.pos[i][2]
                        
                    } else if(i===this.pos.length-1){
                        
                        let dir=vec3.sub([],this.pos[i],this.pos[i-1])
                        dir=[dir[2],0,-dir[0]]
                        vec3.normalize(dir,dir)
                        vec3.scale(dir,dir,size)
                        
                        x1=dir[0]+this.pos[i][0]
                        y1=dir[1]+this.pos[i][1]
                        z1=dir[2]+this.pos[i][2]
                        x2=-dir[0]+this.pos[i][0]
                        y2=-dir[1]+this.pos[i][1]
                        z2=-dir[2]+this.pos[i][2]
                        
                    } else {
                        
                        let dir1=vec3.sub([],this.pos[i],this.pos[i-1])
                        let dir2=vec3.sub([],this.pos[i+1],this.pos[i])
                        vec3.normalize(dir1,dir1)
                        vec3.normalize(dir2,dir2)
                        
                        vec3.add(dir1,dir1,dir2)
                        
                        dir1=[dir1[2],0,-dir1[0]]
                        vec3.normalize(dir1,dir1)
                        vec3.scale(dir1,dir1,size)
                        
                        x1=dir1[0]+this.pos[i][0]
                        y1=dir1[1]+this.pos[i][1]
                        z1=dir1[2]+this.pos[i][2]
                        x2=-dir1[0]+this.pos[i][0]
                        y2=-dir1[1]+this.pos[i][1]
                        z2=-dir1[2]+this.pos[i][2]
                    }
                    
                    this.verts[i*14]=x1
                    this.verts[i*14+1]=y1
                    this.verts[i*14+2]=z1
                    this.verts[i*14+3]=r1
                    this.verts[i*14+4]=g1
                    this.verts[i*14+5]=b1
                    this.verts[i*14+6]=a1
                    
                    this.verts[i*14+7]=x2
                    this.verts[i*14+8]=y2
                    this.verts[i*14+9]=z2
                    this.verts[i*14+10]=r2
                    this.verts[i*14+11]=g2
                    this.verts[i*14+12]=b2
                    this.verts[i*14+13]=a2
                    
                }
                }
            }
            
            this.recomputeMeshThisFrame=false
            
            gl.bindBuffer(gl.ARRAY_BUFFER,this.vertBuffer)
            gl.bufferData(gl.ARRAY_BUFFER,this.verts,gl.DYNAMIC_DRAW)
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer)
            gl.vertexAttribPointer(glCache.trail_vertPos,3,gl.FLOAT,gl.FALSE,28,0)
            gl.vertexAttribPointer(glCache.trail_vertColor,4,gl.FLOAT,gl.FALSE,28,12)
            gl.drawElements(gl.TRIANGLES,this.index.length,gl.UNSIGNED_SHORT,0)
            
        }
        
    }
    
    out.ConstantTrail=function(params){
        
        this.length=params.length
        this.size=params.size
        this.pos=[]
        this.color=params.color
        this.fadeTo=params.fadeTo
        this.triangle=params.triangle
        this.vertical=params.vertical
        this.skipFrame=params.skipFrame||1
        this.skipAdd=params.skipAdd||1
        
        this.verts=new Float32Array(this.length*2*7)
        this.index=[]
        
        for(let i=0;i<this.length;i++){
            
            this.pos.push([])
        }
        
        for(let i=0,j=0;i<(this.length-1)*12;i+=12,j+=2){
            
            this.index[i]=0+j
            this.index[i+1]=1+j
            this.index[i+2]=2+j
            this.index[i+3]=2+j
            this.index[i+4]=3+j
            this.index[i+5]=1+j
            this.index[i+6]=2+j
            this.index[i+7]=1+j
            this.index[i+8]=0+j
            this.index[i+9]=1+j
            this.index[i+10]=3+j
            this.index[i+11]=2+j
        }
        
        this.addPos=function(pos){
            
            if(frameCount%this.skipAdd===0){
                
                this.pos.push(pos)
                if(this.pos.length>=this.length) this.pos.shift()
                this.recomputeMeshThisFrame=true
            }
        }
        
        let cacheArr=[]
        
        this.render=function(){
            
            if(this.recomputeMeshThisFrame&&frameCount%this.skipFrame===0){
                
                if(this.vertical){
                    
                    for(let i=0;i<this.pos.length;i++){
                        
                        let x1,y1,z1,x2,y2,z2,t=(i/this.length),size=this.triangle?this.size*t:this.size,r1,g1,b1,a1,r2,g2,b2,a2
                        
                        if(this.fadeTo){
                            
                            r1=MATH.lerp(this.fadeTo[0],this.color[0],t)
                            g1=MATH.lerp(this.fadeTo[1],this.color[1],t)
                            b1=MATH.lerp(this.fadeTo[2],this.color[2],t)
                            a1=MATH.lerp(this.fadeTo[3],this.color[3],t)
                            r2=r1
                            g2=g1
                            b2=b1
                            a2=a1
                            
                        } else {
                            
                            r1=this.color[0]
                            g1=this.color[1]
                            b1=this.color[2]
                            a1=this.color[3]
                            r2=r1
                            g2=g1
                            b2=b1
                            a2=a1
                        }
                        
                        out.constantTrailVerts[i*14+this.meshOffsetIndex]=this.pos[i][0]
                        out.constantTrailVerts[i*14+1+this.meshOffsetIndex]=this.pos[i][1]+size
                        out.constantTrailVerts[i*14+2+this.meshOffsetIndex]=this.pos[i][2]
                        out.constantTrailVerts[i*14+3+this.meshOffsetIndex]=r1
                        out.constantTrailVerts[i*14+4+this.meshOffsetIndex]=g1
                        out.constantTrailVerts[i*14+5+this.meshOffsetIndex]=b1
                        out.constantTrailVerts[i*14+6+this.meshOffsetIndex]=a1
                        
                        out.constantTrailVerts[i*14+7+this.meshOffsetIndex]=this.pos[i][0]
                        out.constantTrailVerts[i*14+8+this.meshOffsetIndex]=this.pos[i][1]-size
                        out.constantTrailVerts[i*14+9+this.meshOffsetIndex]=this.pos[i][2]
                        out.constantTrailVerts[i*14+10+this.meshOffsetIndex]=r2
                        out.constantTrailVerts[i*14+11+this.meshOffsetIndex]=g2
                        out.constantTrailVerts[i*14+12+this.meshOffsetIndex]=b2
                        out.constantTrailVerts[i*14+13+this.meshOffsetIndex]=a2
                        
                    }
                    
                } else {
                    
                    for(let i=0;i<this.pos.length;i++){
                    
                    let x1,y1,z1,x2,y2,z2,t=(i/this.length),size=this.triangle?this.size*t:this.size,r1,g1,b1,a1,r2,g2,b2,a2
                    
                    if(this.fadeTo){
                        
                        r1=MATH.lerp(this.fadeTo[0],this.color[0],t)
                        g1=MATH.lerp(this.fadeTo[1],this.color[1],t)
                        b1=MATH.lerp(this.fadeTo[2],this.color[2],t)
                        a1=MATH.lerp(this.fadeTo[3],this.color[3],t)
                        r2=r1
                        g2=g1
                        b2=b1
                        a2=a1
                        
                    } else {
                        
                        r1=this.color[0]
                        g1=this.color[1]
                        b1=this.color[2]
                        a1=this.color[3]
                        r2=r1
                        g2=g1
                        b2=b1
                        a2=a1
                    }
                    
                    if(i===0){
                        
                        let dir=vec3.sub([],this.pos[i+1],this.pos[i])
                        dir=[dir[2],0,-dir[0]]
                        vec3.normalize(dir,dir)
                        vec3.scale(dir,dir,size)
                        
                        x1=dir[0]+this.pos[i][0]
                        y1=dir[1]+this.pos[i][1]
                        z1=dir[2]+this.pos[i][2]
                        x2=-dir[0]+this.pos[i][0]
                        y2=-dir[1]+this.pos[i][1]
                        z2=-dir[2]+this.pos[i][2]
                        
                    } else if(i===this.pos.length-1){
                        
                        let dir=vec3.sub([],this.pos[i],this.pos[i-1])
                        dir=[dir[2],0,-dir[0]]
                        vec3.normalize(dir,dir)
                        vec3.scale(dir,dir,size)
                        
                        x1=dir[0]+this.pos[i][0]
                        y1=dir[1]+this.pos[i][1]
                        z1=dir[2]+this.pos[i][2]
                        x2=-dir[0]+this.pos[i][0]
                        y2=-dir[1]+this.pos[i][1]
                        z2=-dir[2]+this.pos[i][2]
                        
                    } else {
                        
                        let dir1=vec3.sub([],this.pos[i],this.pos[i-1])
                        let dir2=vec3.sub([],this.pos[i+1],this.pos[i])
                        vec3.normalize(dir1,dir1)
                        vec3.normalize(dir2,dir2)
                        
                        vec3.add(dir1,dir1,dir2)
                        
                        dir1=[dir1[2],0,-dir1[0]]
                        vec3.normalize(dir1,dir1)
                        vec3.scale(dir1,dir1,size)
                        
                        x1=dir1[0]+this.pos[i][0]
                        y1=dir1[1]+this.pos[i][1]
                        z1=dir1[2]+this.pos[i][2]
                        x2=-dir1[0]+this.pos[i][0]
                        y2=-dir1[1]+this.pos[i][1]
                        z2=-dir1[2]+this.pos[i][2]
                    }
                    
                    out.constantTrailVerts[i*14+this.meshOffsetIndex]=x1
                    out.constantTrailVerts[i*14+1+this.meshOffsetIndex]=y1
                    out.constantTrailVerts[i*14+2+this.meshOffsetIndex]=z1
                    out.constantTrailVerts[i*14+3+this.meshOffsetIndex]=r1
                    out.constantTrailVerts[i*14+4+this.meshOffsetIndex]=g1
                    out.constantTrailVerts[i*14+5+this.meshOffsetIndex]=b1
                    out.constantTrailVerts[i*14+6+this.meshOffsetIndex]=a1
                    
                    out.constantTrailVerts[i*14+7+this.meshOffsetIndex]=x2
                    out.constantTrailVerts[i*14+8+this.meshOffsetIndex]=y2
                    out.constantTrailVerts[i*14+9+this.meshOffsetIndex]=z2
                    out.constantTrailVerts[i*14+10+this.meshOffsetIndex]=r2
                    out.constantTrailVerts[i*14+11+this.meshOffsetIndex]=g2
                    out.constantTrailVerts[i*14+12+this.meshOffsetIndex]=b2
                    out.constantTrailVerts[i*14+13+this.meshOffsetIndex]=a2
                    
                }
                }
            }
            
            this.recomputeMeshThisFrame=false
        }
        
        out.constantTrails.push(this)
        out.regenerateConstantTrails()
        
        return this
    }
    
    let T1=new out.ConstantTrail({length:15,size:0.2,triangle:true,color:[1,1,1,1]})
    let T2=new out.ConstantTrail({length:15,size:0.2,triangle:true,color:[1,1,1,1]})
    let T3=new out.ConstantTrail({length:12,size:0.1,triangle:true,color:[1,0,0,1]})
    let T4=new out.ConstantTrail({length:12,size:0.1,triangle:true,color:[0,0,1,1]})
    
    out.render=function(){
        
        if(player.currentGear.leftGuard==='crimsonGuard'){
            
            T1.addPos([player.body.position.x+player.bodyDir[2]*0.65,player.body.position.y,player.body.position.z-player.bodyDir[0]*0.65])
            
            T3.addPos([player.body.position.x+player.bodyDir[2]*0.6,player.body.position.y+0.175,player.body.position.z-player.bodyDir[0]*0.6])
        }
        
        if(player.currentGear.rightGuard==='cobaltGuard'){
            
            T2.addPos([player.body.position.x-player.bodyDir[2]*0.65,player.body.position.y,player.body.position.z+player.bodyDir[0]*0.65])
            
            T4.addPos([player.body.position.x-player.bodyDir[2]*0.6,player.body.position.y+0.175,player.body.position.z+player.bodyDir[0]*0.6])
            
        }
        
        gl.useProgram(trailRendererProgram)
        gl.uniformMatrix4fv(glCache.trail_viewMatrix,gl.FALSE,player.viewMatrix)
        
        for(let i in out.trails){
            
            out.trails[i].render()
            
            if(out.trails[i].splice){
                
                out.trails.splice(i,1)
            }
        }
        
        for(let i in out.constantTrails){
            
            out.constantTrails[i].render()
            
            if(out.constantTrails[i].splice){
                
                out.constantTrails.splice(i,1)
                out.regenerateConstantTrails()
            }
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER,out.constantTrailVertBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,out.constantTrailVerts,gl.DYNAMIC_DRAW)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,out.constantTrailIndexBuffer)
        gl.vertexAttribPointer(glCache.trail_vertPos,3,gl.FLOAT,gl.FALSE,28,0)
        gl.vertexAttribPointer(glCache.trail_vertColor,4,gl.FLOAT,gl.FALSE,28,12)
        gl.drawElements(gl.TRIANGLES,out.constantTrailIndex.length,gl.UNSIGNED_SHORT,0)
        
    }
    
    return out
    
})({})

let fieldInfo={}

class Token {
    
    constructor(life,pos,type,funcParams,backupFunc){
        
        this.funcParams=funcParams
        this.backupFunc=backupFunc?effects[type].backupFunc:null
        this.life=life*player.tokenLifespan*1.5
        this.pos=pos
        this.type=type
        this.rotation=Math.random()*MATH.TWO_PI
        this.func=effects[type].svg?false:effects[type].func
        this.canBeLinked=effects[type].canBeLinked===undefined||effects[type].canBeLinked
        
        if(Math.random()<(player.drives.maxed?player.abilityDuplicationChance+0.01:player.abilityDuplicationChance)&&!backupFunc&&player.fieldIn&&funcParams){
            
            let p,fp=funcParams,x=(Math.random()*fieldInfo[fp.field].width)|0,z=(Math.random()*fieldInfo[fp.field].length)|0
            
            fp.x=x
            fp.z=z
            
            p=[fieldInfo[fp.field].x+x,pos[1],fieldInfo[fp.field].z+z]
            
            objects.tokens.push(new DupedToken(life*((funcParams.bee.level-1)*0.1+2),p,type,fp))
            
            objects.mobs.push(new GlitchEffect(player.fieldIn,3))
            
        }
    }
    
    die(index){
        
        objects.tokens.splice(index,1)
    }
    
    collect(){
        
        if(!this.collected){
            
            this.collected=true
            this.life=0.75
            player.stats.abilityTokens++
            
            if(effects[this.type].statsToAddTo){
                
                for(let i in effects[this.type].statsToAddTo){
                    
                    player.stats[effects[this.type].statsToAddTo[i]]++
                }

                if(effects[this.type].statsToAddTo.indexOf(this.type+'Tokens')<0)
                    player.stats[this.type+'Tokens']++
            }
            
            if(this.func){
                
                if(this.backupFunc){
                    
                    this.bee=this.funcParams.bee
                    this.backupFunc(this)
                    
                } else {
                    
                    this.func(this.funcParams)
                }
                
            } else {
                
                player.addEffect(this.type)
            }
            
            if(effects[this.type].sound){
                
                effects[this.type].sound()
            }
        }
    }
    
    update(){
        
        this.life-=dt
        
        if(this.collected){
            
            this.pos[1]+=(this.pos[1]+5-this.pos[1])*dt
            this.rotation+=dt*20
            
            meshes.tokens.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.rotation,effects[this.type].u,effects[this.type].v,this.life*5,1)
            
        } else {
            
            this.rotation+=dt*2.6
            
            meshes.tokens.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.rotation,effects[this.type].u,effects[this.type].v,this.life*0.3,1)
            
            if(Math.abs(this.pos[0]-player.body.position.x)+Math.abs(this.pos[1]-player.body.position.y)+Math.abs(this.pos[2]-player.body.position.z)<1.75){
                
                this.collect()
            }
        }
        
        return this.life<=0
    }
}

class LootToken {
    
    constructor(life,pos,type,amount,canBeLinked=false,source){
        
        this.life=life
        this.pos=pos
        this.type=type
        this.amount=Math.abs(amount)
        this.rotation=Math.random()*MATH.TWO_PI
        this.canBeLinked=canBeLinked
        this.from=source
        
        if(this.type==='honey'){
            
            this.u=128*3/2048
            this.v=128*4/2048
            
        } else {
            
            this.u=items[this.type].u
            this.v=items[this.type].v
        }
    }
    
    die(index){
        
        objects.tokens.splice(index,1)
    }
    
    collect(){
        
        if(!this.collected){
            
            this.collected=true
            this.life=0.75
            
            player.stats[this.type+'Tokens']++
            player.stats['tokensFrom'+this.from+'s']++
            
            if(this.type==='honey'){
                
                this.amount=Math.round(player.honeyFromTokens*this.amount)
                player.honey+=this.amount
                if(player.setting_enablePollenText)
                    textRenderer.add(this.amount+'',[player.body.position.x,player.body.position.y+2,player.body.position.z],COLORS.honey,0,'+')
                player.addMessage('+'+MATH.addCommas(this.amount+'')+' Honey'+(this.from?' (from '+this.from+')':''))
                player.stats.honeyTokens++
                
            } else {
                
                player.addItem(this.type,this.amount)
                player.addMessage('+'+MATH.addCommas(this.amount+'')+' '+(this.amount>1?MATH.doPlural(MATH.doGrammar(this.type)):MATH.doGrammar(this.type)+(this.from?' (from '+this.from+')':'')))
            }
        }
    }
    
    update(){
        
        this.life-=dt+dt
        
        if(this.collected){
            
            this.pos[1]+=(this.pos[1]+5-this.pos[1])*dt
            this.rotation+=dt*20
            
            meshes.tokens.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.rotation,this.u,this.v,this.life*5,1)
            
        } else {
            
            this.rotation+=dt*2.6
            
            meshes.tokens.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.rotation,this.u,this.v,this.life*0.3,1)
            
            if(Math.abs(this.pos[0]-player.body.position.x)+Math.abs(this.pos[1]-player.body.position.y)+Math.abs(this.pos[2]-player.body.position.z)<1.75){
                
                this.collect()
            }
        }
        
        return this.life<=0
    }
}

class DupedToken {
    
    constructor(life,pos,type,funcParams){
        
        if(Math.random()<(0.1+player.drives.glitched*0.001)||type==='glitch'||type==='mapCorruption'){
            
            type='smiley'
        }
        
        this.funcParams=funcParams
        this.life=life*player.tokenLifespan*1.5
        this.pos=pos
        this.type=type
        this.rotation=Math.random()*MATH.TWO_PI
        this.func=effects[type].svg?false:effects[type].func
        this.canBeLinked=effects[type].canBeLinked===undefined||effects[type].canBeLinked
        
        this.activationTimer=0
        this.pos[1]+=3.5
    }
    
    die(index){
        
        objects.tokens.splice(index,1)
    }
    
    collect(){
        
        if(!this.collected){
            
            this.collected=true
            this.life=0.75
            player.stats.abilityTokens++
            
            if(effects[this.type].statsToAddTo){
                
                for(let i in effects[this.type].statsToAddTo){
                    
                    player.stats[effects[this.type].statsToAddTo[i]]++
                }
            }
            
            if(this.func){
                
                this.func(this.funcParams)
                
            } else {
                
                player.addEffect(this.type)
            }
            
            if(effects[this.type].sound){
                
                effects[this.type].sound()
            }
        }
    }
    
    update(){
        
        this.life-=dt
        
        if(this.collected){
            
            textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.smiley,1,0,0.85,-3,-3,0)
            
        } else {
            
            textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.circle,0.1,0.1,0.1,3,3,0)
            
            textRenderer.addDecalRaw(this.pos[0],this.pos[1],this.pos[2],0,0,...textRenderer.decalUV.arc,1,1,1,-3,-3,MATH.dupedTokenLoadingArcRotation(this.activationTimer))
            
            this.rotation+=dt*2.6
            
            meshes.tokens.instanceData.push(this.pos[0],this.pos[1],this.pos[2],this.rotation,effects[this.type].u,effects[this.type].v,this.life*0.15,1.5)
            
            if(Math.abs(this.pos[0]-player.body.position.x)+Math.abs(this.pos[1]-3.5-player.body.position.y)+Math.abs(this.pos[2]-player.body.position.z)<3.5){
                
                this.activationTimer+=dt
                
            } else {
                
                this.activationTimer=Math.max(this.activationTimer-dt,0)
            }
            
            if(this.activationTimer>=1){
                
                this.collect()
            }
        }
        
        return this.life<=0
    }
}

meshes.token={}
meshes.token.vertBuffer=gl.createBuffer()
meshes.token.indexBuffer=gl.createBuffer()
let verts=[],index=[]

let s=25,r=0.5
for(let i=0,inc=MATH.TWO_PI/s;i<MATH.TWO_PI;i+=inc){
    
    let s=Math.sin(i),c=Math.cos(i),texSize=128/2048
    
    verts.push(s*r,c*r,0.05,(s*0.495+0.5)*texSize,(-c*0.495+0.5)*texSize,
                s*r,c*r,-0.05,(s*0.495+0.5)*texSize,(-c*0.495+0.5)*texSize)
    
}

let vl=verts.length/5

for(let i=0;i<s*2;i+=2){
    
    index.push((i+2)%vl,(i+1)%vl,i%vl,(i+1)%vl,(i+2)%vl,(i+3)%vl)
}

for(let i=1;i<s-1;i++){
    
    index.push((i+1)*2,i*2,0)
    index.push(1,i*2+1,(i+1)*2+1)
}


gl.bindBuffer(gl.ARRAY_BUFFER,meshes.token.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.token.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.token.indexAmount=index.length

function b(x,y,z,w,h,l,r,g,b,rx,ry,rz,sx,sy,sz){
    
    let v=[
        
        [-0.5*w,0.5*h,-0.5*l],
        [-0.5*w,0.5*h,0.5*l],
        [0.5*w,0.5*h,0.5*l],
        [0.5*w,0.5*h,-0.5*l],
        [-0.5*w,-0.5*h,-0.5*l],
        [-0.5*w,-0.5*h,0.5*l],
        [0.5*w,-0.5*h,0.5*l],
        [0.5*w,-0.5*h,-0.5*l]
    ],s1=1,s2=0.95,s3=0.9,s4=0.85,s5=0.92,s6=0.87
    
    let q
    
    if(rx){q=quat.fromEuler([],rx,ry,rz)}
    
    for(let i in v){
        
        if(rx){
            
            vec3.transformQuat(v[i],v[i],q)
        }
        
        if(sx){
            
            vec3.mul(v[i],v[i],[sx,sy,sz])
        }
        
        vec3.add(v[i],v[i],[x,y,z])
    }
    
    vl=verts.length/6
    
    verts.push(
        
        v[0][0],v[0][1],v[0][2],r*s1,g*s1,b*s1,
        v[1][0],v[1][1],v[1][2],r*s1,g*s1,b*s1,
        v[2][0],v[2][1],v[2][2],r*s1,g*s1,b*s1,
        v[3][0],v[3][1],v[3][2],r*s1,g*s1,b*s1,
        
        v[1][0],v[1][1],v[1][2],r*s2,g*s2,b*s2,
        v[2][0],v[2][1],v[2][2],r*s2,g*s2,b*s2,
        v[5][0],v[5][1],v[5][2],r*s2,g*s2,b*s2,
        v[6][0],v[6][1],v[6][2],r*s2,g*s2,b*s2,
        
        v[0][0],v[0][1],v[0][2],r*s3,g*s3,b*s3,
        v[3][0],v[3][1],v[3][2],r*s3,g*s3,b*s3,
        v[4][0],v[4][1],v[4][2],r*s3,g*s3,b*s3,
        v[7][0],v[7][1],v[7][2],r*s3,g*s3,b*s3,
        
        v[2][0],v[2][1],v[2][2],r*s4,g*s4,b*s4,
        v[3][0],v[3][1],v[3][2],r*s4,g*s4,b*s4,
        v[6][0],v[6][1],v[6][2],r*s4,g*s4,b*s4,
        v[7][0],v[7][1],v[7][2],r*s4,g*s4,b*s4,
        
        v[0][0],v[0][1],v[0][2],r*s5,g*s5,b*s5,
        v[1][0],v[1][1],v[1][2],r*s5,g*s5,b*s5,
        v[4][0],v[4][1],v[4][2],r*s5,g*s5,b*s5,
        v[5][0],v[5][1],v[5][2],r*s5,g*s5,b*s5,
        
        v[4][0],v[4][1],v[4][2],r*s6,g*s6,b*s6,
        v[5][0],v[5][1],v[5][2],r*s6,g*s6,b*s6,
        v[6][0],v[6][1],v[6][2],r*s6,g*s6,b*s6,
        v[7][0],v[7][1],v[7][2],r*s6,g*s6,b*s6,
    )
    
    index.push(
        
        0+vl,1+vl,2+vl,
        0+vl,2+vl,3+vl,
        5+vl,6+vl,7+vl,
        6+vl,5+vl,4+vl,
        8+vl,9+vl,10+vl,
        11+vl,10+vl,9+vl,
        14+vl,13+vl,12+vl,
        13+vl,14+vl,15+vl,
        18+vl,17+vl,16+vl,
        17+vl,18+vl,19+vl,
        22+vl,21+vl,20+vl,
        23+vl,22+vl,20+vl,
        
        24+vl,25+vl,26+vl,
        26+vl,25+vl,24+vl,
        24+vl,26+vl,27+vl,
        27+vl,26+vl,24+vl
    )
}

function star(innerRad,outerRad,thickness,depth,r,g,b,la=0.75,lb=0.25,x=0,y=0,z=0){
    
    innerRad*=0.8
    let _verts=[],_index=[],pos=[],vs=[],ix=[],j=0
    
    for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/10){
        
        let r=(j++)%2===0?outerRad:innerRad
        
        pos.push([Math.sin(i)*r,Math.cos(i)*r,-thickness])
    }
    
    j=0
    
    for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI/10){
        
        let r=(j++)%2===0?outerRad:innerRad
        
        pos.push([Math.sin(i)*r,Math.cos(i)*r,thickness])
    }
    
    pos.push([0,0,-depth],[0,0,depth])
    
    vs.push(0,1,20,1,2,20,2,3,20,3,4,20,4,5,20,5,6,20,6,7,20,7,8,20,8,9,20,9,0,20,11,10,21,12,11,21,13,12,21,14,13,21,15,14,21,16,15,21,17,16,21,18,17,21,19,18,21,10,19,21,9,10,0)
    
    ix.push(2,1,0,5,4,3,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62)
    
    for(let i=0;i<10;i++){
        
        vs.push(0+i,10+i,1+i,11+i,1+i,10+i)
        ix.push(i*6,i*6+1,i*6+2,i*6+3,i*6+4,i*6+5)
    }
    
    for(let i=63;i<ix.length;i++){
        
        ix[i]+=63
    }
    
    for(let i in vs){
        
        vs[i]=[pos[vs[i]][0]+x,pos[vs[i]][1]+y,pos[vs[i]][2]+z]
    }
    
    _index=ix
    
    let findNorm=(a,b,c)=>{
        
        a=vs[a]
        b=vs[b]
        c=vs[c]
        
        let n=vec3.cross([],[a[0]-b[0],a[1]-b[1],a[2]-b[2]],[a[0]-c[0],a[1]-c[1],a[2]-c[2]])
        
        return vec3.normalize(n,n)
    }
    
    for(let i=0;i<_index.length;i+=3){
        
        let i1=_index[i],i2=_index[i+1],i3=_index[i+2],shade=vec3.dot([0.035,0.175,0.053],findNorm(i1,i2,i3))*la+lb
        
        verts.push(...vs[i1],r*shade,g*shade,b*shade,...vs[i2],r*shade,g*shade,b*shade,...vs[i3],r*shade,g*shade,b*shade)
    }
    
    index.push(..._index)
}

function c(x,y,z,rad,hei,sides,r,g,b,rx,ry,rz,r2,bottom=true,top=true,shading=true){
    
    let rad2=r2??rad,vl=verts.length/6,_verts=[],_index=[]
    
    if(shading){
        
        for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
            
            let t1=t-inc*0.5,t2=t+inc*0.5
            _verts.push(
                Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r*(Math.cos(t1)*0.1+0.9),g*(Math.cos(t1)*0.1+0.9),b*(Math.cos(t1)*0.1+0.9),
                Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r*(Math.cos(t1)*0.1+0.9),g*(Math.cos(t1)*0.1+0.9),b*(Math.cos(t1)*0.1+0.9),
                Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r*(Math.cos(t2)*0.1+0.9),g*(Math.cos(t2)*0.1+0.9),b*(Math.cos(t2)*0.1+0.9),
                Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r*(Math.cos(t2)*0.1+0.9),g*(Math.cos(t2)*0.1+0.9),b*(Math.cos(t2)*0.1+0.9))
            
            let _vl=_verts.length/6
            _index.push(_vl,_vl+1,_vl+2,_vl+3,_vl+2,_vl+1)
        }
        
    } else {
        
        for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
            
            let t1=t-inc*0.5,t2=t+inc*0.5
            _verts.push(
                Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r,g,b,
                Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r,g,b,
                Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r,g,b,
                Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r,g,b)
            
            let _vl=_verts.length/6
            _index.push(_vl,_vl+1,_vl+2,_vl+3,_vl+2,_vl+1)
        }
    }
    
    let _v=_verts.length/6
    
    for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
        
        let t1=t-inc*0.5,t2=t+inc*0.5
        _verts.push(
            Math.cos(t1)*rad,Math.sin(t1)*rad,hei*0.5,r,g,b,
            Math.cos(t2)*rad,Math.sin(t2)*rad,hei*0.5,r,g,b)
    }
    
    for(let l=_verts.length/6,i=_v;i<l-3&&top;i++){
        
        _index.push(_v,i,i+1)
    }
    
    _v=_verts.length/6
    for(let t=0,inc=MATH.TWO_PI/sides;t<=MATH.TWO_PI;t+=inc){
        
        let t1=t-inc*0.5,t2=t+inc*0.5
        _verts.push(
            
            Math.cos(t1)*rad2,Math.sin(t1)*rad2,-hei*0.5,r,g,b,
            Math.cos(t2)*rad2,Math.sin(t2)*rad2,-hei*0.5,r,g,b)
    }
    for(let l=_verts.length/6,i=_v;i<l&&bottom;i++){
        
        _index.push(i,i-1,_v)
    }
    
    for(let i in _index){
        
        _index[i]+=vl
    }
    
    index.push(..._index)
    
    let rotQuat=quat.fromEuler([],rx,ry,rz)
    
    for(let i=0;i<_verts.length;i+=6){
        
        if(rx){
            
            let rotated=vec3.transformQuat([],[_verts[i],_verts[i+1],_verts[i+2]],rotQuat)
            _verts[i]=rotated[0]+x
            _verts[i+1]=rotated[1]+y
            _verts[i+2]=rotated[2]+z
            
        } else {
            
            _verts[i]+=x
            _verts[i+1]+=y
            _verts[i+2]+=z
        }
    }
    
    verts.push(..._verts)
}

meshes.explosion={}
meshes.explosion.vertBuffer=gl.createBuffer()
meshes.explosion.indexBuffer=gl.createBuffer()
verts=MATH.icosphere(3)
index=verts.index
verts=verts.verts

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.explosion.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.explosion.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.explosion.indexAmount=index.length

meshes.cylinder_explosion={}
meshes.cylinder_explosion.vertBuffer=gl.createBuffer()
meshes.cylinder_explosion.indexBuffer=gl.createBuffer()
verts=[]
index=[]

for(let i=0,inc=MATH.TWO_PI/s;i<MATH.TWO_PI;i+=inc){
    
    let s=Math.sin(i),c=Math.cos(i),texSize=128/1024
    
    verts.push(s*0.5,0.5,c*0.5,
                s*0.5,-0.5,c*0.5)
    
}

vl=verts.length/3

for(let i=0;i<s*2;i+=2){
    
    index.push((i+2)%vl,(i+1)%vl,i%vl,(i+1)%vl,(i+2)%vl,(i+3)%vl)
}

for(let i=1;i<s-1;i++){
    
    index.push((i+1)*2,i*2,0)
    index.push(1,i*2+1,(i+1)*2+1)
}

index.reverse()

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cylinder_explosion.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cylinder_explosion.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.cylinder_explosion.indexAmount=index.length


meshes.bee={}
meshes.bee.vertBuffer=gl.createBuffer()
meshes.bee.indexBuffer=gl.createBuffer()
verts=[]
index=[]

let w=0.4,h=0.4,l=0.6

let v=[
    
    [-0.5*w,0.5*h,-0.5*l],
    [-0.5*w,0.5*h,0.5*l],
    [0.5*w,0.5*h,0.5*l],
    [0.5*w,0.5*h,-0.5*l],
    [-0.5*w,-0.5*h,-0.5*l],
    [-0.5*w,-0.5*h,0.5*l],
    [0.5*w,-0.5*h,0.5*l],
    [0.5*w,-0.5*h,-0.5*l]
]

w=128/2048,e=1/2048
h=w
l=w

verts.push(
    
    v[0][0],v[0][1],v[0][2],0,l+w,1,0,
    v[1][0],v[1][1],v[1][2],0,0+w,1,0,
    v[2][0],v[2][1],v[2][2],w,0+w,1,0,
    v[3][0],v[3][1],v[3][2],w,l+w,1,0,
    
    v[1][0],v[1][1],v[1][2],0,0,0.85,0,
    v[2][0],v[2][1],v[2][2],w,0,0.85,0,
    v[5][0],v[5][1],v[5][2],0,h,0.85,0,
    v[6][0],v[6][1],v[6][2],w,h,0.85,0,
    
    v[0][0],v[0][1],v[0][2],e,w+w-e,0.9,0,
    v[3][0],v[3][1],v[3][2],e,w+w-e,0.9,0,
    v[4][0],v[4][1],v[4][2],e,w+w-e,0.9,0,
    v[7][0],v[7][1],v[7][2],e,w+w-e,0.9,0,
    
    v[2][0],v[2][1],v[2][2],0,0+w,0.75,0,
    v[3][0],v[3][1],v[3][2],0,h+w,0.75,0,
    v[6][0],v[6][1],v[6][2],w,0+w,0.75,0,
    v[7][0],v[7][1],v[7][2],w,h+w,0.75,0,
    
    v[0][0],v[0][1],v[0][2],0,h+w,0.8,0,
    v[1][0],v[1][1],v[1][2],0,0+w,0.8,0,
    v[4][0],v[4][1],v[4][2],w,h+w,0.8,0,
    v[5][0],v[5][1],v[5][2],w,0+w,0.8,0,
    
    v[4][0],v[4][1],v[4][2],0,l+w,0.95,0,
    v[5][0],v[5][1],v[5][2],0,0+w,0.95,0,
    v[6][0],v[6][1],v[6][2],w,0+w,0.95,0,
    v[7][0],v[7][1],v[7][2],w,l+w,0.95,0,
    
    -0.6,0,v[0][2]*0.6,0,0,0,0,
    0.6,0,v[0][2]*0.6,0,0,0,0,
    0.6,0,v[0][2]*-0.6,0,0,0,0,
    -0.6,0,v[0][2]*-0.6,0,0,0,0,
    
)

index.push(
    
    0,1,2,
    0,2,3,
    5,6,7,
    6,5,4,
    8,9,10,
    11,10,9,
    14,13,12,
    13,14,15,
    18,17,16,
    17,18,19,
    22,21,20,
    23,22,20,
    
    24,25,26,
    26,25,24,
    24,26,27,
    27,26,24
)


_b(-0.085,0.05,0,0.05,0.5,0.5,0.01,0.01,1,0,0,20)
_c(-0.085*2,0.3,0.2,0.075,0.275*0.5,6,0.05,0.01,1,90,0,180)
_c(-0.085*2,0.3,-0.2,0.075,0.275*0.5,6,0.05,0.01,1,90,0,180)
_c(-0.085*2,0.3,0,0.05,0.275,6,0.01,0.01,1,90,0,0)

_b(-0.2,0,0.285,0.2*1.414,0.2*1.414,0.025,0.01,0.07,2,0,0,45)
_b(0.2,0,0.285,0.2*1.414,0.2*1.414,0.025,0.01,0.07,2,0,0,45)

_c(0,0.195,0.05,0.175,0.05,10,0.01,0.09,3)
_c(0,0.35,0.05,0,0.25,10,128*0.5/2048,128*0.5/2048,3,0,0,0,0.2)
_b(0,0.6,0.05,0.095,0.095,0.095,0.01,0.09,3)

_c(0.075,0.185,-0.35,0.075,0.2,8,-0.04,0.01,4,-10,0,0)
_c(-0.075,0.185,-0.35,0.075,0.2,8,-0.04,0.01,4,-10,0,0)

_b(0,0.25,-0.35,0.05,0.55,0.075,0.01,0.01,5,-25,0,0)
_b(0,0.4,-0.5,0.05,0.2,0.075,0.01,0.01,5,20,0,0)

_b(0,0,-0.3,0.5,0.5,0.075,0.01,0.01,6,0,0,15)
_b(0,0,-0.3,0.5,0.5,0.075,0.01,0.01,6,0,0,45)
_b(0,0,-0.3,0.5,0.5,0.075,0.01,0.01,6,0,0,75)

fluff(-0.05,0.2,0.25,0,0.15)
fluff(0.06,0.2,0.17,0,0.15)
fluff(0.08,0.2,0,0,0.12)
fluff(0,0.2,-0.2,0,0.15)
fluff(-0.05,0.2,0.25,90,0.15)
fluff(0.06,0.2,0.17,90,0.15)
fluff(0.08,0.2,0,90,0.12)
fluff(0,0.2,-0.2,90,0.15)
fluff(-0.05,0.2,0.25,-90,0.15)
fluff(0.06,0.2,0.17,-90,0.15)
fluff(0.08,0.2,0,-90,0.12)
fluff(0,0.2,-0.2,-90,0.15)
fluff(-0.05,0.2,0.25,180,0.15)
fluff(0.06,0.2,0.17,180,0.15)
fluff(0.08,0.2,0,180,0.12)
fluff(0,0.2,-0.2,45,0.15)
fluff(-0.05,0.2,0.25,-45,0.15)
fluff(0.06,0.2,0.17,120,0.15)
fluff(0.08,0.2,0,-120,0.12)
fluff(0,0.2,-0.2,120,0.15)
fluff(-0.05,0.2,0.25,45,0.15)
fluff(0.06,0.2,0.17,-120,0.15)
fluff(0.08,0.2,0,-45,0.12)

_b(0,0.15,0,0.15,0.35,0.35,0.01,0.09,8,45,0,0)

_b(0,0.1,0,0.45,0.3,0.4,0.1,-0.025,9)
_b(0,0.2,0.175,0.45,0.1,0.4,0.1,-0.025,9)
_b(0.2,0.1,0.175,0.05,0.3,0.4,0.1,-0.025,9)
_b(-0.2,0.1,0.175,0.05,0.3,0.4,0.1,-0.025,9)
_b(0.065,0.245,0.075,0.05,0.05,0.55,0.01,0.09,9)
_b(-0.065,0.245,0.075,0.05,0.05,0.55,0.01,0.09,9)

_b(0.124,0.2,0.2495,0.115,0.115,0.1,0.0001,0.0001,10,0,0,45)
_b(-0.124,0.2,0.2495,0.115,0.115,0.1,0.0001,0.0001,10,0,0,45)
_b(0,0.1,-0.42,0.075,0.075,0.4,0.01,0.01,10,45,0,0)

_b(-0.175,0.2,0.225,0.07,0.3,0.07,0.01,0.09,11,0,0,35)
_b(0.175,0.2,0.225,0.07,0.3,0.07,0.01,0.09,11,0,0,-35)

_b(0,0.3,0,0.2,0.2,0.25,0.37,0.09,12)
_c(0,0.3,0.225,0.1,0.05,8,0.37,0.09,12,90,0,180)
_c(0,0.3,0.1,0.05,0.1,6,0.37,0.09,12,90,0,180)
_b(0.05,0.35,-0.2,0.06,0.06,0.25,0.37,0.09,12,-10,0,0)
_b(-0.05,0.35,-0.2,0.06,0.06,0.25,0.37,0.09,12,-10,0,0)

_b(0,0,0.125,0.55,0.55,0.2,0.4,-0.18,13)
_b(0,0,0.125,0.55,0.55,0.2,0.4,-0.18,13)

_c(0,0.175,0.125,0.16,0.05,10,0.1,-0.13,14)
_c(0,0.22,0.125,0.1,0.05,10,0.01,0.09,14)
_c(0,0.3375,0.125,0.1,0.0675,10,0.1,-0.13,14)

_c(0,0.35,0.175,0,0.25,10,0.1,-0.13,15,0,0,0,0.075)
_c(0,0.275,-0.1,0,0.25,10,0.1,-0.13,15,-30,0,0,0.075)
_c(0,0.2,-0.3,0,0.25,10,0.1,-0.13,15,-45,0,0,0.075)

_c(0.2,0.2,0.3-0.05+0.01,0.1,0.05,10,0.01,0.01,16,-90,0,0,0.1,0.85)
_c(-0.2,0.2,0.3-0.05+0.01,0.1,0.05,10,0.01,0.01,16,-90,0,0,0.1,0.85)

_c(0.275,0.04,0.15,0.2,0.02,10,0.01,0.09,17,0,0,-60,0.2,0.9)
_c(-0.275,0.04,0.15,0.2,0.02,10,0.01,0.09,17,0,0,60,0.2,0.9)

_b(0,0.175,-0.4*0.5-0.025,0.375+0.1,0.2,0.4*0.5+0.05,0.03,0.09,18)
_b(0,0.175,0.4*0.5+0.025,0.375+0.1,0.2,0.4*0.5+0.05,0.03,0.09,18)
_b(0,0.175,0,0.375+0.1,0.2,0.4*0.5,0.01,0.01,18)
_c(0,0.2+0.1+0.02,0,0.13,0.04,4,0.001,0.001,18,0,45,0,0.05)
_c(0,0.2+0.1+0.04,0,0.05,0.04,4,0.001,0.001,18,0,0,0,0.13)

_b(0.2+0.025,0,0.21,0.05,0.45,0.25,0.01,0.09,19,0,0,0,1.25)
_b(-0.2-0.025,0,0.21,0.05,0.45,0.25,0.01,0.09,19,0,0,0,1.25)
_b(0,0.2+0.025,0.21,0.45,0.05,0.25,0.01,0.09,19,0,0,0,1.25)
_b(0,-0.2-0.025+0.01,0.21,0.45,0.05,0.25,0.01,0.09,19,0,0,0,1.25)
_c(0,0.2+0.05,0.2,0.075,0.02,10,0.01,0.12,19,0,0,0)
_c(0,0.2+0.1,0.2,0.02,0.1,10,0.01,0.12,19,0,0,0)
_b(0,0.2+0.1+0.1,0.2,0.1,0.1,0.1,0.01,0.08,19,0,0,0,100)

function fluff(x,y,z,r,s){
    
    let shade=MATH.random(0.7,0.9),v=[[x+s,y,z],[x-s,y,z],[x,y+s*0.8,z-s]],vl=verts.length/7
    
    for(let i in v){
        
        vec3.rotateZ(v[i],v[i],[0,0,0],r*0.017)
    }
    
    verts.push(
        
        v[0][0],v[0][1],v[0][2],0.01,0.01,shade,7,
        v[1][0],v[1][1],v[1][2],0.01,0.01,shade,7,
        v[2][0],v[2][1],v[2][2],0.01,0.01,shade,7
    )
    
    index.push(vl,vl+1,vl+2,vl+2,vl+1,vl)
}

function _b(x,y,z,w,h,l,uvcolx,uvcoly,id,rx=0,ry=0,rz=0,shade){
    
    shade=shade??1

    let v=[
        
        [-0.5*w,0.5*h,-0.5*l],
        [-0.5*w,0.5*h,0.5*l],
        [0.5*w,0.5*h,0.5*l],
        [0.5*w,0.5*h,-0.5*l],
        [-0.5*w,-0.5*h,-0.5*l],
        [-0.5*w,-0.5*h,0.5*l],
        [0.5*w,-0.5*h,0.5*l],
        [0.5*w,-0.5*h,-0.5*l]
    ]
    
    let q=quat.fromEuler([],rx,ry,rz)
    
    for(let i in v){
        
        vec3.transformQuat(v[i],v[i],q)
        vec3.add(v[i],v[i],[x,y,z])
    }
    
    
    let vl=verts.length/7
    
    verts.push(
        
        v[0][0],v[0][1],v[0][2],uvcolx,uvcoly,1*shade,id,
        v[1][0],v[1][1],v[1][2],uvcolx,uvcoly,1*shade,id,
        v[2][0],v[2][1],v[2][2],uvcolx,uvcoly,1*shade,id,
        v[3][0],v[3][1],v[3][2],uvcolx,uvcoly,1*shade,id,
        
        v[1][0],v[1][1],v[1][2],uvcolx,uvcoly,0.85*shade,id,
        v[2][0],v[2][1],v[2][2],uvcolx,uvcoly,0.85*shade,id,
        v[5][0],v[5][1],v[5][2],uvcolx,uvcoly,0.85*shade,id,
        v[6][0],v[6][1],v[6][2],uvcolx,uvcoly,0.85*shade,id,
        
        v[0][0],v[0][1],v[0][2],uvcolx,uvcoly,0.9*shade,id,
        v[3][0],v[3][1],v[3][2],uvcolx,uvcoly,0.9*shade,id,
        v[4][0],v[4][1],v[4][2],uvcolx,uvcoly,0.9*shade,id,
        v[7][0],v[7][1],v[7][2],uvcolx,uvcoly,0.9*shade,id,
        
        v[2][0],v[2][1],v[2][2],uvcolx,uvcoly,0.75*shade,id,
        v[3][0],v[3][1],v[3][2],uvcolx,uvcoly,0.75*shade,id,
        v[6][0],v[6][1],v[6][2],uvcolx,uvcoly,0.75*shade,id,
        v[7][0],v[7][1],v[7][2],uvcolx,uvcoly,0.75*shade,id,
        
        v[0][0],v[0][1],v[0][2],uvcolx,uvcoly,0.8*shade,id,
        v[1][0],v[1][1],v[1][2],uvcolx,uvcoly,0.8*shade,id,
        v[4][0],v[4][1],v[4][2],uvcolx,uvcoly,0.8*shade,id,
        v[5][0],v[5][1],v[5][2],uvcolx,uvcoly,0.8*shade,id,
        
        v[4][0],v[4][1],v[4][2],uvcolx,uvcoly,0.95*shade,id,
        v[5][0],v[5][1],v[5][2],uvcolx,uvcoly,0.95*shade,id,
        v[6][0],v[6][1],v[6][2],uvcolx,uvcoly,0.95*shade,id,
        v[7][0],v[7][1],v[7][2],uvcolx,uvcoly,0.95*shade,id
    )
    
    let ind=[0,1,2,
        0,2,3,
        5,6,7,
        6,5,4,
        8,9,10,
        11,10,9,
        14,13,12,
        13,14,15,
        18,17,16,
        17,18,19,
        22,21,20,
        23,22,20
    ]
    
    for(let i in ind){
        
        ind[i]+=vl
    }
    
    index.push(...ind)

}

function _c(x,y,z,r,h,s,uvcolx,uvcoly,id,rx=0,ry=0,rz=0,r2,shade){
    
    let si=verts.length,vl=si/7
    r2=r2??r
    
    for(let i=0,inc=MATH.TWO_PI/s;i<MATH.TWO_PI;i+=inc){
        
        let s=Math.sin(i),c=Math.cos(i)
        
        verts.push(s*r,h,c*r,uvcolx,uvcoly,shade?shade:c*0.2+0.8,id,
                    s*r2,-h,c*r2,uvcolx,uvcoly,shade?shade:c*0.25+0.75,id)
        
    }
    
    let q=quat.fromEuler([],rx,ry,rz)
    
    for(let i=si;i<verts.length;i+=7){
        
        let v=[]
        let r=vec3.transformQuat(v,[verts[i],verts[i+1],verts[i+2]],q)
        let m=vec3.add(v,v,[x,y,z])
        
        verts[i]=v[0]
        verts[i+1]=v[1]
        verts[i+2]=v[2]
        
    }
    
    let _vl=s*2
    
    let ind=[]
    
    for(let i=0;i<s*2;i+=2){
        
        ind.push((i+2)%_vl,i+1,i,(i+3)%_vl,i+1,(i+2)%_vl)
    }
    
    for(let i=1;i<s-1;i++){
        
        ind.push((i+1)*2,i*2,0)
        ind.push(1,i*2+1,(i+1)*2+1)
    }
    
    for(let i in ind){
        
        ind[i]+=vl
    }
    
    ind.reverse()
    index.push(...ind)
    
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.bee.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.bee.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.bee.indexAmount=index.length

meshes.frog={}
meshes.frog.vertBuffer=gl.createBuffer()
meshes.frog.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0.25,0,1,0.5,1.5,0.1,0.8,0.3,30,0,0)
b(0,-0.17,-0.28,1.05,0.6,1.6,0.8,0.8,0.4,30,0,0)
b(0.5,-0.5,-0.2,0.75,0.4,1.3,0.1,0.8,0.3,0.00001,-20,0)
b(-0.5,-0.5,-0.2,0.75,0.4,1.3,0.1,0.8,0.3,0.00001,20,0)
c(-0.5,0.75,-0.35,0.25,0.45,9,0.1,0.8,0.3,30,20,0,0.25,true,true)
c(0.5,0.75,-0.35,0.25,0.45,9,0.1,0.8,0.3,30,-20,0,0.25,true,true)
c(0.5,0.77,-0.42,0.2,0.4,9,1,1,1,30,-20,0,0.2,true,false)
c(-0.5,0.77,-0.42,0.2,0.4,9,1,1,1,30,20,0,0.2,true,false)
b(-0.475,0.77,-0.42,0.15,0.225,0.5,0.05,0.4,0.175,30,20,10)
b(0.475,0.77,-0.42,0.15,0.225,0.5,0.05,0.4,0.175,30,-20,-10)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.frog.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.frog.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.frog.indexAmount=index.length

meshes.giftedFrog={}
meshes.giftedFrog.vertBuffer=gl.createBuffer()
meshes.giftedFrog.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.2,0.4,0.05,0.05,5,5,0,0.75,0.25,0,0.4,-0.4)

for(let i=0;i<verts.length;i+=6){
    
    let a=vec3.rotateX([],[verts[i],verts[i+1],verts[i+2]],[0,1,0],MATH.TO_RAD*-60)
    
    verts[i]=a[0]
    verts[i+1]=a[1]
    verts[i+2]=a[2]
}

b(0,0.25,0,1,0.5,1.5,0.3,0.4,0.8,30,0,0)
b(0,-0.17,-0.28,1.05,0.6,1.6,0.3*1.35,0.4*1.35,0.8*1.35,30,0,0)
b(0.5,-0.5,-0.2,0.75,0.4,1.3,0.3,0.4,0.8,0.00001,-20,0)
b(-0.5,-0.5,-0.2,0.75,0.4,1.3,0.3,0.4,0.8,0.00001,20,0)
c(-0.5,0.75,-0.35,0.25,0.45,9,0.3,0.4,0.8,30,20,0,0.25,true,true)
c(0.5,0.75,-0.35,0.25,0.45,9,0.3,0.4,0.8,30,-20,0,0.25,true,true)
c(0.5,0.77,-0.42,0.2,0.4,9,1,1,1,30,-20,0,0.2,true,false)
c(-0.5,0.77,-0.42,0.2,0.4,9,1,1,1,30,20,0,0.2,true,false)
b(-0.475,0.77,-0.42,0.15,0.225,0.5,0.05,0.15,0.4,30,20,10)
b(0.475,0.77,-0.42,0.15,0.225,0.5,0.05,0.15,0.4,30,-20,-10)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.giftedFrog.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.giftedFrog.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.giftedFrog.indexAmount=index.length

meshes.rhinoBeetle={}
meshes.rhinoBeetle.vertBuffer=gl.createBuffer()
meshes.rhinoBeetle.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,0.025,0.025,0.4)
b(-0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.rhinoBeetle.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.rhinoBeetle.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.rhinoBeetle.indexAmount=index.length

meshes.ladybug={}
meshes.ladybug.vertBuffer=gl.createBuffer()
meshes.ladybug.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,0.7,0,0)
b(-0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.ladybug.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.ladybug.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.ladybug.indexAmount=index.length

meshes.spider={}
meshes.spider.vertBuffer=gl.createBuffer()
meshes.spider.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,-0.6*1.3,0.6*1.3,0.6*1.3,0.6*1.3,0.05,0.05,0.05)
b(0,0,-0.1*1.3,0.75*1.3,0.75*1.3,0.6*1.3,0.05,0.05,0.05)
b(0,0,0.8*1.3,1*1.3,0.9*1.3,1.25*1.3,0.05,0.05,0.05)

b(0.75-0.2,0.3,-0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-35)
b(1.6-0.2,0.375,-0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,45)
b(-0.75+0.2,0.3,-0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,35)
b(-1.6+0.2,0.375,-0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-45)

b(0.75,0.3,0,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-35)
b(1.6,0.375,0,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,45)
b(-0.75,0.3,0,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,35)
b(-1.6,0.375,0,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-45)

b(0.75+0.3,0.3+0.15,0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-35)
b(1.6+0.3,0.375+0.15,0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,45)
b(-0.75-0.3,0.3+0.15,0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,35)
b(-1.6-0.3,0.375+0.15,0.7,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-45)

b(0.75+0.3,0.3+0.3,1.5,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-35)
b(1.6+0.3,0.375+0.3,1.5,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,45)
b(-0.75-0.3,0.3+0.3,1.5,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,35)
b(-1.6-0.3,0.375+0.3,1.5,0.2,1.5,0.2,0.05,0.05,0.05,0.0001,0,-45)

b(0.25,0.2,-0.9*1.3,0.1,0.1,0.15,0.7,0,0)
b(-0.25,0.2,-0.9*1.3,0.1,0.1,0.15,0.7,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.spider.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.spider.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.spider.indexAmount=index.length

meshes.werewolf={}
meshes.werewolf.vertBuffer=gl.createBuffer()
meshes.werewolf.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(-0.3,2.2,-0.05,0.1,0.1,1,0.05,0.05,0.05)
b(0.3,2.2,-0.05,0.1,0.1,1,0.05,0.05,0.05)
b(0.2,2.3,-0.05,0.2,0.075,1,0.05,0.05,0.05,0.001,0,30)
b(-0.2,2.3,-0.05,0.2,0.075,1,0.05,0.05,0.05,0.001,0,-30)
b(0,2,0,1,1,1,0.35,0.35,0.35)
b(0,1,0.675,1.75,1.75,0.8,0.35,0.35,0.35,-15,0,0)
b(0.5,0,0.5,0.5,1.3,0.5,0.35,0.35,0.35,25,0,0)
b(-0.5,0,0.5,0.5,1.3,0.5,0.35,0.35,0.35,25,0,0)
b(0.5,-0.7,0.3,0.5,0.75,0.5,0.35,0.35,0.35)
b(-0.5,-0.7,0.3,0.5,0.75,0.5,0.35,0.35,0.35)
b(1,1.25,0.25,1.3,0.5,0.5,0.35,0.35,0.35,0.001,45,-20)
b(1.3,1.1,-0.5,1.3,0.5,0.5,0.35,0.35,0.35,0.001,-85,-20)
b(-1,1.25,0.25,1.3,0.5,0.5,0.35,0.35,0.35,0.001,-45,20)
b(-1.3,1.1,-0.5,1.3,0.5,0.5,0.35,0.35,0.35,0.001,85,20)
b(0,1.8,-0.25,0.3,0.3,1,0.35,0.35,0.35,0.001,0,45)
b(0,1.8,-0.35,0.25,0.25,1,0.15,0.15,0.15,0.001,0,45)
b(0.4,2.45,-0.3,0.5,0.5,0.2,0.35,0.35,0.35,0.001,0,45)
b(-0.4,2.45,-0.3,0.5,0.5,0.2,0.35,0.35,0.35,0.001,0,45)
b(0.4,2.45,-0.35,0.4,0.4,0.2,0.15,0.15,0.15,0.001,0,45)
b(-0.4,2.45,-0.35,0.4,0.4,0.2,0.15,0.15,0.15,0.001,0,45)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.werewolf.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.werewolf.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.werewolf.indexAmount=index.length

meshes.mantis={}
meshes.mantis.vertBuffer=gl.createBuffer()
meshes.mantis.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,1,0,0.75,2.5,0.75,0.1*0.75,0.7*0.75,0.2*0.75,165,0,0)
b(0.275,0.25,-0.5,0.2,1.5,0.2,0.1*0.75,0.7*0.75,0.2*0.75,215,0,0)
b(0.275,0.25,-1.2,0.2,1.5,0.2,0.1*0.75,0.7*0.75,0.2*0.75,155,0,0)
b(0.275,0.45,-2,0.2,1.5,0.2,0.1*0.75,0.7*0.75,0.2*0.75,235,0,0)
b(-0.275,0.25,-0.5,0.2,1.5,0.2,0.1*0.75,0.7*0.75,0.2*0.75,215,0,0)
b(-0.275,0.25,-1.2,0.2,1.5,0.2,0.1*0.75,0.7*0.75,0.2*0.75,155,0,0)
b(-0.275,0.45,-2,0.2,1.5,0.2,0.1*0.75,0.7*0.75,0.2*0.75,235,0,0)

b(-0.5,0.45,0,0.2,1.6,0.2,0.1*0.75,0.7*0.75,0.2*0.75,0.001,0,-40)
b(0.5,0.45,0,0.2,1.6,0.2,0.1*0.75,0.7*0.75,0.2*0.75,0.001,0,40)

b(-0.3,2.15,-0.7,0.2,0.2,0.2,0.2,0.5,0.5)
b(0.3,2.15,-0.7,0.2,0.2,0.2,0.2,0.5,0.5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.mantis.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.mantis.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.mantis.indexAmount=index.length

meshes.scorpion={}
meshes.scorpion.vertBuffer=gl.createBuffer()
meshes.scorpion.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,0.8,1.5,0.8,0.1,0.1)
b(0.3,0.25,-0.75,0.15,0.15,0.15,0.05,0.05,0.05)
b(-0.3,0.25,-0.75,0.15,0.15,0.15,0.05,0.05,0.05)
b(0.5,-0.25,-1,0.3,0.3,1,0.8,0.1,0.1,0.001,-30,0)
b(0.65,-0.25,-1.85,0.3,0.3,1,0.8,0.1,0.1,0.001,10,0)
b(-0.5,-0.25,-1,0.3,0.3,1,0.8,0.1,0.1,0.001,30,0)
b(-0.65,-0.25,-1.85,0.3,0.3,1,0.8,0.1,0.1,0.001,-10,0)
b(0,0.5,1,0.3,0.3,1.5,0.8,0.1,0.1,-45,0,0)
b(0,1.4,1.2,0.3,0.3,1.5,0.8,0.1,0.1,-115,0,0)
b(-0.2,1.9,0.9,0.4,0.3,0.6,0.8,0.1,0.1,-45,35,-35)
b(0.2,1.9,0.9,0.4,0.3,0.6,0.8,0.1,0.1,-45,-35,35)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.scorpion.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.scorpion.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.scorpion.indexAmount=index.length

meshes.kingBeetle={}
meshes.kingBeetle.vertBuffer=gl.createBuffer()
meshes.kingBeetle.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,10,0,0)
b(-0.3,0.65,-0.8,0.1,0.1,1,10,10,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,10,10,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0,10,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0,10,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0,10,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0,10,0,0.00001,0,30)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.kingBeetle.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.kingBeetle.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.kingBeetle.indexAmount=index.length

meshes.mechsquito={}
meshes.mechsquito.vertBuffer=gl.createBuffer()
meshes.mechsquito.indexBuffer=gl.createBuffer()
verts=[]
index=[]

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=1.1
    _s.verts[i+1]*=1.1
    _s.verts[i+2]*=1.1
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],0.1,0.1,0.1)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=0.45
    _s.verts[i+1]*=0.45
    _s.verts[i+2]*=0.45
    
    _s.verts[i]-=0.2
    _s.verts[i+1]+=0.15
    _s.verts[i+2]-=0.35

    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],10,0,0)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=0.45
    _s.verts[i+1]*=0.45
    _s.verts[i+2]*=0.45
    
    _s.verts[i]+=0.2
    _s.verts[i+1]+=0.15
    _s.verts[i+2]-=0.35

    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],10,0,0)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

b(0,-0.1,-0.6,0.1,0.1,1,0.12,0.12,0.12,-5,0,45)

c(0.7,0,0.7,0.6,0.1,10,0,10,0,90,0,0)
c(-0.7,0,0.7,0.6,0.1,10,0,10,0,90,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.mechsquito.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.mechsquito.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.mechsquito.indexAmount=index.length

meshes.megaMechsquito={}
meshes.megaMechsquito.vertBuffer=gl.createBuffer()
meshes.megaMechsquito.indexBuffer=gl.createBuffer()
verts=[]
index=[]

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=1.1
    _s.verts[i+1]*=1.1
    _s.verts[i+2]*=1.1
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],0.1,0.1,0.1)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2]+0.75,0.1,0.1,0.1)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2]+0.75*2,0.1,0.1,0.1)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=0.45
    _s.verts[i+1]*=0.45
    _s.verts[i+2]*=0.45
    
    _s.verts[i]-=0.2
    _s.verts[i+1]+=0.15
    _s.verts[i+2]-=0.35

    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],10,0,0)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=0.45
    _s.verts[i+1]*=0.45
    _s.verts[i+2]*=0.45
    
    _s.verts[i]+=0.2
    _s.verts[i+1]+=0.15
    _s.verts[i+2]-=0.35

    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],10,0,0)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

b(0,-0.1,-0.6,0.1,0.1,1,0.12,0.12,0.12,-5,0,45)

b(0.4,0.4,-0.15,0.1,1,0.1,0.12,0.12,0.12,35,45,0)
b(-0.4,0.4,-0.15,0.1,1,0.1,0.12,0.12,0.12,35,-45,0)

c(0.75,0,0.75,0.7,0.1,10,0,10,0,90,0,0)
c(-0.75,0,0.75,0.7,0.1,10,0,10,0,90,0,0)

c(0,0,0.75*2,0.7,0.2,10,0.2,0.2,0.2)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.megaMechsquito.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.megaMechsquito.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.megaMechsquito.indexAmount=index.length

meshes.cogmower={}
meshes.cogmower.vertBuffer=gl.createBuffer()
meshes.cogmower.indexBuffer=gl.createBuffer()
verts=[]
index=[]

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=1.75
    _s.verts[i+1]*=1.75
    _s.verts[i+2]*=1.75
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],0.85,0.85,0.9)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

c(0,0,0,1.15,0.2,10,10,0,0,90,0,0)
c(0,0,0,1.05,0.35,10,0.5,0.7,0.7,90,0,0)

b(0,0,0,2.75,0.35,0.5,0.5,0.75,0.8,0.001,0,0)
b(0,0,0,2.75,0.35,0.5,0.5,0.75,0.8,0.001,60,0)
b(0,0,0,2.75,0.35,0.5,0.5,0.75,0.8,0.001,120,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cogmower.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cogmower.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.cogmower.indexAmount=index.length

meshes.goldenCogmower={}
meshes.goldenCogmower.vertBuffer=gl.createBuffer()
meshes.goldenCogmower.indexBuffer=gl.createBuffer()
verts=[]
index=[]

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=1.75
    _s.verts[i+1]*=1.75
    _s.verts[i+2]*=1.75
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],0.9,0.85,0.2)
}

for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

c(0,0,0,1.15,0.2,10,10,10,0,90,0,0)
c(0,0,0,1.05,0.35,10,0.75,0.7,0.1,90,0,0)

b(0,0,0,2.75,0.35,0.5,0.75,0.7,0.1,0.001,0,0)
b(0,0,0,2.75,0.35,0.5,0.75,0.7,0.1,0.001,60,0)
b(0,0,0,2.75,0.35,0.5,0.75,0.7,0.1,0.001,120,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.goldenCogmower.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.goldenCogmower.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.goldenCogmower.indexAmount=index.length

meshes.cogTurret={}
meshes.cogTurret.vertBuffer=gl.createBuffer()
meshes.cogTurret.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,1.2,0.25,6,0.4*0.95,0.4*0.95,0.45*0.95,0.001,0,30)
b(0,0,0,2.75,0.6,0.25,0.4,0.4,0.45,0.001,0,0)
b(0,0,0,2.75,0.6,0.25,0.4,0.4,0.45,0.001,0,60)
b(0,0,0,2.75,0.6,0.25,0.4,0.4,0.45,0.001,0,120)

c(0,0,0,1.2,0.4,6,0.4*0.95,0.4*0.95,0.45*0.95,0.001,90,0)
b(0,0,0,0.4,2.75,0.6,0.4,0.4,0.45,0.001,0,0)
b(0,0,0,0.4,2.75,0.6,0.4,0.4,0.45,60,0,0)
b(0,0,0,0.4,2.75,0.6,0.4,0.4,0.45,120,0,0)

c(0,-0.5,0,0.75,2,10,0.7,0.7,0.7,90,0,0)
c(0,-0.25,0,0.8,0.25,10,0.9,0.9,0.9,90,0,0)
c(0,0.15,0,0.8,0.25,10,0.9,0.9,0.9,90,0,0)

c(-0.4,0.15,0.2,0.1,0.7,10,10,0,0,0.001,120,0)
c(-0.4,0.15,-0.2,0.1,0.7,10,10,0,0,0.001,60,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cogTurret.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cogTurret.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.cogTurret.indexAmount=index.length

meshes.cog={}
meshes.cog.vertBuffer=gl.createBuffer()
meshes.cog.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,1.05,1.5,10,10,0,0,90,0,0)
b(0,0,0,2.75,1.5,0.5,10,0,0,0.001,0,0)
b(0,0,0,2.75,1.5,0.5,10,0,0,0.001,60,0)
b(0,0,0,2.75,1.5,0.5,10,0,0,0.001,120,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cog.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cog.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.cog.indexAmount=index.length

meshes.mondoChick={}
meshes.mondoChick.vertBuffer=gl.createBuffer()
meshes.mondoChick.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0.85,0,1.2,0.5,10,0.9,0.9,0.9,-90,0,0,1.5,true,true,true)
c(0,0.85+0.5,0,0.7,0.5,10,0.9,0.9,0.9,-90,0,0,1.2,true,true,true)
c(0,0.85+1-0.15,0,0.2,0.2,10,0.9,0.9,0.9,-90,0,0,0.7,true,true,true)

for(let i=0;i<verts.length;i+=6){
    
    let _t=vec3.rotateX([],[verts[i],verts[i+1],verts[i+2]],MATH.ORIGIN,0.3)
    
    verts[i]=_t[0]
    verts[i+1]=_t[1]
    verts[i+2]=_t[2]
}

c(0,-0.85,0,1.5,0.5,10,0.9,0.9,0.9,-90,0,0,1.2,true,true,true)
c(0,-0.85-0.5,0,1.2,0.5,10,0.9,0.9,0.9,-90,0,0,0.7,true,true,true)
c(0,-0.85-1+0.15,0,0.7,0.2,10,0.8,0.8,0.8,-90,0,0,0.2,true,true,true)

for(let i=0;i<verts.length;i+=6){
    
    verts[i]*=1.2
    verts[i+1]*=1.2
    verts[i+2]*=1.2
}

c(0,0.075,-0.8,0.15,0.4,10,1,0.5,0,0.001,90,0)

b(0,0,0,1.5,1.5,1.5,1,1,0.6,15,0,0)
b(0.9,0,0,0.2,0.5,0.75,1.2,0,0,15,20,0)
b(-0.9,0,0,0.2,0.5,0.75,0,0,1.2,15,-20,0)
b(0.5,-2,-0.4,1,0.1,2,1,0.5,0.1,0.001,-30,0)
b(-0.5,-2,-0.4,1,0.1,2,1,0.5,0.1,0.001,30,0)

_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=0.175
    _s.verts[i+1]*=0.175
    _s.verts[i+2]*=0.175
    _s.verts[i+2]-=0.7
    _s.verts[i+1]+=0.4
    _s.verts[i]+=0.3
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],0,0,0)
}


for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}
_s=MATH.icosphere(1)
_vl=verts.length/6

for(let i=0;i<_s.verts.length;i+=3){
    
    _s.verts[i]*=0.175
    _s.verts[i+1]*=0.175
    _s.verts[i+2]*=0.175
    _s.verts[i+2]-=0.7
    _s.verts[i+1]+=0.4
    _s.verts[i]-=0.3
    
    verts.push(_s.verts[i],_s.verts[i+1],_s.verts[i+2],0,0,0)
}


for(let i in _s.index){
    
    index.push(_s.index[i]+_vl)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.mondoChick.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.mondoChick.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.mondoChick.indexAmount=index.length

meshes.ant={}
meshes.ant.vertBuffer=gl.createBuffer()
meshes.ant.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,0.05,0.05,0.05)
b(-0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.ant.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.ant.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.ant.indexAmount=index.length

meshes.armyAnt={}
meshes.armyAnt.vertBuffer=gl.createBuffer()
meshes.armyAnt.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,0.05,0.05,0.05)
b(-0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)
c(0,0.6,-0.25,0.45,0.3,10,0,0.7,0,-90,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.armyAnt.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.armyAnt.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.armyAnt.indexAmount=index.length

meshes.flyingAnt={}
meshes.flyingAnt.vertBuffer=gl.createBuffer()
meshes.flyingAnt.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,0.05,0.05,0.05)
b(-0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,0,0,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0,0,0,0.00001,0,30)

b(-0.2,0.5,0.35,0.95,0.05,1.25,0.5,0.6,0.8,0.00001,-40,0)
b(0.2,0.5,0.35,0.95,0.05,1.25,0.5,0.6,0.8,0.00001,40,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.flyingAnt.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.flyingAnt.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.flyingAnt.indexAmount=index.length

meshes.fireAnt={}
meshes.fireAnt.vertBuffer=gl.createBuffer()
meshes.fireAnt.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1,1,1.25,1,0.05,0.05)
b(-0.3,0.65,-0.8,0.1,0.1,1,0.8,0,0,30,45,0)
b(0.3,0.65,-0.8,0.1,0.1,1,0.8,0,0,30,-45,0)
b(0.65,-0.5,0.4,0.7,0.1,0.1,0.8,0,0,0.00001,0,-30)
b(0.65,-0.5,-0.4,0.7,0.1,0.1,0.8,0,0,0.00001,0,-30)
b(-0.65,-0.5,0.4,0.7,0.1,0.1,0.8,0,0,0.00001,0,30)
b(-0.65,-0.5,-0.4,0.7,0.1,0.1,0.8,0,0,0.00001,0,30)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.fireAnt.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.fireAnt.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.fireAnt.indexAmount=index.length

meshes.petalShuriken={}
meshes.petalShuriken.vertBuffer=gl.createBuffer()
meshes.petalShuriken.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,-0.6,0.8,0.05,0.8,0.8,0.8,0.8,360,45,0,0.75,1,1)
b(0,0,0.6,0.8,0.05,0.8,0.8,0.8,0.8,360,45,0,0.75,1,1)
b(-0.6,0,0,0.8,0.05,0.8,0.8,0.8,0.8,360,45,0,1,1,0.75)
b(0.6,0,0,0.8,0.05,0.8,0.8,0.8,0.8,360,45,0,1,1,0.75)
b(0,0,0,0.6,0.075,0.6,0.9,0.7,0)
b(0,0,0,0.6,0.075,0.6,0.9,0.7,0,360,45,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.petalShuriken.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.petalShuriken.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.petalShuriken.indexAmount=index.length

meshes.lawnMower={}
meshes.lawnMower.vertBuffer=gl.createBuffer()
meshes.lawnMower.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,4,1,3,0.8,0.1,0.1)
b(0,0,0,4*0.75,2.5,3*0.75,0.5,0.5,0.5)
b(-3,1.5,1.25,3,0.2,0.2,0.6,0.6,0.6,0.00001,0,-50)
b(-3,1.5,-1.25,3,0.2,0.2,0.6,0.6,0.6,0.00001,0,-50)
b(-3-Math.cos(-50*MATH.TO_RAD)*1.5,1.5-Math.sin(-50*MATH.TO_RAD)*1.5,0,0.2,0.2,1.25*2,0.6,0.6,0.6,0.00001,0,-50)


gl.bindBuffer(gl.ARRAY_BUFFER,meshes.lawnMower.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.lawnMower.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.lawnMower.indexAmount=index.length

meshes.lawnMowerWarning={}
meshes.lawnMowerWarning.vertBuffer=gl.createBuffer()
meshes.lawnMowerWarning.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,0.51,5.01,(10/3)+0.01,100,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.lawnMowerWarning.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.lawnMowerWarning.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.lawnMowerWarning.indexAmount=index.length

meshes.popStar={}
meshes.popStar.vertBuffer=gl.createBuffer()
meshes.popStar.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.75,1.3,0.15,0.45,0.5,1.5,3)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.popStar.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.popStar.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.popStar.indexAmount=index.length

meshes.scorchingStar={}
meshes.scorchingStar.vertBuffer=gl.createBuffer()
meshes.scorchingStar.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.75,1.3,0.15,0.45,0.9,0,0,0,1)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.scorchingStar.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.scorchingStar.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.scorchingStar.indexAmount=index.length

meshes.gummyStar={}
meshes.gummyStar.vertBuffer=gl.createBuffer()
meshes.gummyStar.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.75,1.3,0.15,0.45,0,0,0,0,1)

let _a=[],_c1=[0.1,1,0.5],_c2=[1,0.2,1]

for(let i=0;i<verts.length;i+=6){
    
    vec3.lerp(_a,_c1,_c2,verts[i]*0.5+0.5)
    verts[i+3]=_a[0]
    verts[i+4]=_a[1]
    verts[i+5]=_a[2]
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.gummyStar.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.gummyStar.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.gummyStar.indexAmount=index.length

meshes.starSaw={}
meshes.starSaw.vertBuffer=gl.createBuffer()
meshes.starSaw.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.75,1.3,0.15,0.25,1,1,1,0.2,0.8)

for(let i=0;i<verts.length;i+=6){
    
    let a=vec3.rotateX([],[verts[i],verts[i+1],verts[i+2]],MATH.ORIGIN,MATH.HALF_PI)
    
    verts[i]=a[0]
    verts[i+1]=a[1]
    verts[i+2]=a[2]
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.starSaw.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.starSaw.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.starSaw.indexAmount=index.length

meshes.guidingStar={}
meshes.guidingStar.vertBuffer=gl.createBuffer()
meshes.guidingStar.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.75,1.3,0.075,0.2,3.5,1.75,0)

for(let i=0;i<verts.length;i+=6){
    
    let a=vec3.rotateX([],[verts[i],verts[i+1],verts[i+2]],MATH.ORIGIN,MATH.HALF_PI*0.75)
    
    verts[i]=a[0]
    verts[i+1]=a[1]
    verts[i+2]=a[2]
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.guidingStar.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.guidingStar.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.guidingStar.indexAmount=index.length

meshes.levitatingStarShower={}
meshes.levitatingStarShower.vertBuffer=gl.createBuffer()
meshes.levitatingStarShower.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.75,1.3,0.15,0.15,100,100,2)

for(let i=0;i<verts.length;i+=6){
    
    let a=vec3.rotateX([],[verts[i],verts[i+1],verts[i+2]],MATH.ORIGIN,-MATH.HALF_PI)
    
    verts[i]=a[0]
    verts[i+1]=a[1]
    verts[i+2]=a[2]
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.levitatingStarShower.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.levitatingStarShower.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.levitatingStarShower.indexAmount=index.length

meshes.fallingStar={}
meshes.fallingStar.vertBuffer=gl.createBuffer()
meshes.fallingStar.indexBuffer=gl.createBuffer()
verts=[]
index=[]

star(0.6,1,0.05,0.15,100,100,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.fallingStar.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.fallingStar.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.fallingStar.indexAmount=index.length

meshes.wave={}
meshes.wave.vertBuffer=gl.createBuffer()
meshes.wave.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,1,0,1,0.1,1,0.2,0.4,1,30,0,0)
b(0,0.5,0.4,1,0.3,1,0.2,0.4,1,60,0,0)
b(0,-0.1,0.6,1,0.5,1,0.2,0.4,1,80,0,0)
b(0,-0.8,0.6,1,0.7,1.3,0.2,0.4,1,90,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.wave.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.wave.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.wave.indexAmount=index.length

meshes.gummyBall={}
meshes.gummyBall.vertBuffer=gl.createBuffer()
meshes.gummyBall.indexBuffer=gl.createBuffer()
verts=[]
index=[]

let ___m=MATH.icosphere(2),__m=___m.verts

for(let i=0;i<__m.length;i+=3){
    
    let d=(vec3.dot([__m[i],__m[i+1],__m[i+2]],lightDir)+1)*0.9
    verts.push(__m[i],__m[i+1],__m[i+2],d,0.2*d,d)
}

index.push(...___m.index)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.gummyBall.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.gummyBall.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.gummyBall.indexAmount=index.length

meshes.drainingDiamond={}
meshes.drainingDiamond.vertBuffer=gl.createBuffer()
meshes.drainingDiamond.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,1,1.25,10,0.3,0.7,1,-90,0,0,0,true,false)
c(0,0.875,0,0.6,0.5,10,0.3,0.7,1,-90,0,0,1,false,true)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.drainingDiamond.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.drainingDiamond.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.drainingDiamond.indexAmount=index.length

meshes.shiningDiamond={}
meshes.shiningDiamond.vertBuffer=gl.createBuffer()
meshes.shiningDiamond.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,1,1.25,10,100,100,100,-90,0,0,0,true,false,false)
c(0,0.875,0,0.6,0.5,10,100,100,100,-90,0,0,1,false,true,false)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.shiningDiamond.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.shiningDiamond.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.shiningDiamond.indexAmount=index.length

meshes.tornado={}
meshes.tornado.vertBuffer=gl.createBuffer()
meshes.tornado.indexBuffer=gl.createBuffer()
verts=[]
index=[]

for(let i=7;i>=0;i--){
    
    c(Math.sin(i*0.5),i,Math.cos(i*0.5),i*0.5+1,1,10,0.7,0.7,0.7,-90,0,0,i*0.5+1,true,true)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.tornado.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.tornado.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.tornado.indexAmount=index.length

meshes.tornado_red={}
meshes.tornado_red.vertBuffer=gl.createBuffer()
meshes.tornado_red.indexBuffer=gl.createBuffer()
verts=[]
index=[]

for(let i=7;i>=0;i--){
    
    c(Math.sin(i*0.5),i,Math.cos(i*0.5),i*0.5+1,1,10,1,0.05,0.05,-90,0,0,i*0.5+1,true,true)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.tornado_red.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.tornado_red.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.tornado_red.indexAmount=index.length

meshes.scratch={}
meshes.scratch.vertBuffer=gl.createBuffer()
meshes.scratch.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(-2,1,-0.5,0.75,0.75,3,0.7,0.7,0.7,0,0,0)
b(-2,0.5,1,0.75,1.75,0.75,0.7,0.7,0.7,0,0,0)
b(2,1,-0.5,0.75,0.75,3,0.7,0.7,0.7,0,0,0)
b(2,0.5,1,0.75,1.75,0.75,0.7,0.7,0.7,0,0,0)
b(0,1,-0.5,0.75,0.75,3,0.7,0.7,0.7,0,0,0)
b(0,0.5,1,0.75,1.75,0.75,0.7,0.7,0.7,0,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.scratch.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.scratch.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.scratch.indexAmount=index.length

meshes.goldenRakeScratch={}
meshes.goldenRakeScratch.vertBuffer=gl.createBuffer()
meshes.goldenRakeScratch.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(-2,1,-1.5,0.75,0.75,5,1,1,0.35,0,0,0)
b(-2,0.5,1,0.75,1.75,0.75,1.1,1.1,0.35,0,0,0)
b(2,1,-1.5,0.75,0.75,5,1.1,1.1,0.35,0,0,0)
b(2,0.5,1,0.75,1.75,0.75,1.1,1.1,0.35,0,0,0)
b(0,1,-1.5,0.75,0.75,5,1.1,1.1,0.35,0,0,0)
b(0,0.5,1,0.75,1.75,0.75,1.1,1.1,0.35,0,0,0)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.goldenRakeScratch.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.goldenRakeScratch.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.goldenRakeScratch.indexAmount=index.length

meshes.paperPlanter={}
meshes.paperPlanter.vertBuffer=gl.createBuffer()
meshes.paperPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0,0,1.1,3,1.1,1,0.7,0.3)
b(0,0,0,1,3.05,1,1*0.35,0.7*0.35,0.3*0.35)
b(0.275,0.7,0,0.85,0.1,1.11,1*0.6,0.7*0.6,0.3*0.6,0.001,0,45)
b(-0.275,0.7,0,0.85,0.1,1.11,1*0.6,0.7*0.6,0.3*0.6,0.001,0,-45)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.paperPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.paperPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.paperPlanter.indexAmount=index.length

meshes.candyPlanter={}
meshes.candyPlanter.vertBuffer=gl.createBuffer()
meshes.candyPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,0.75,1,10,1,0.4,1,-90,0,0,0.45,true,true,true)
c(0,0.6+0.2,0,0.75,0.8,10,1,0.4,1,-90,0,0,0.75,true,true,true)
c(0,0.75+0.25,0,0.89,0.4,10,1,0.4,1,-90,0,0,0.89,true,true,true)
c(0,0.76+0.25,0,0.65,0.4,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

c(0,0.2,0,0.7,0.1,10,1,1,1,-90,0,0,0.7,true,true,true)
c(0,0.45,0,0.8,0.1,10,1,1,1,-90,0,0,0.8,true,true,true)
c(0,0.7,0,0.8,0.1,10,1,1,1,-90,0,0,0.8,true,true,true)

for(let i=0,co=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.1,co++){

    c(Math.sin(i)*0.87,1,Math.cos(i)*0.87,0.1,0.1,10,...([[0.9,0.9,0],[0,0.9,0],[0,0,0.9],[0.9,0,0]][co%4]),0.001,i*MATH.TO_DEG,0,0.1,true,true,true)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.candyPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.candyPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.candyPlanter.indexAmount=index.length

meshes.plasticPlanter={}
meshes.plasticPlanter.vertBuffer=gl.createBuffer()
meshes.plasticPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,0.75,1,10,1,0.8,0.4,-90,0,0,0.45,true,true,true)
c(0,0.6+0.2,0,0.75,0.8,10,1,0.8,0.4,-90,0,0,0.75,true,true,true)
c(0,0.75+0.25,0,0.89,0.4,10,1,0.8,0.4,-90,0,0,0.89,true,true,true)
c(0,0.76+0.25,0,0.65,0.4,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.plasticPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.plasticPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.plasticPlanter.indexAmount=index.length

meshes.pesticidePlanter={}
meshes.pesticidePlanter.vertBuffer=gl.createBuffer()
meshes.pesticidePlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,-0.375,0,0.8,0.75,10,0,0.65,0,-90,0,0,0.35,true,true,true)
c(0,0.375,0,0.35,0.75,10,0,0.65,0,-90,0,0,0.8,true,true,true)

c(0,-0.375+0.375+0.375,0,0.7,0.75,10,0,0.65,0,-90,0,0,0.3,true,true,true)
c(0,0.375+0.375+0.375,0,0.3,0.75,10,0,0.65,0,-90,0,0,0.7,true,true,true)

c(0,0.375+0.375,0,0.25,1.51,10,0.9,0.9,0,0,0,0,0.25,true,true,true)
c(0,0.375+0.375,0,0.25,1.51,10,0.9,0.9,0,0.001,90,0,0.25,true,true,true)

c(0,0.375+0.375,0,0.075,1.515,10,0,0,0,0,0,0,0.075,true,true,true)
c(0,0.375+0.375,0,0.075,1.515,10,0,0,0,0.001,90,0,0.075,true,true,true)

c(0,0.375+0.375+0.15,0,0.05,1.515,10,0,0,0,0,0,0,0.05,true,true,true)
c(0,0.375+0.375+0.15,0,0.05,1.515,10,0,0,0,0.001,90,0,0.05,true,true,true)

c(0.15,0.375+0.375-0.085,0,0.05,1.515,10,0,0,0,0,0,0,0.05,true,true,true)
c(0,0.375+0.375-0.085,0.15,0.05,1.515,10,0,0,0,0.001,90,0,0.05,true,true,true)
c(-0.15,0.375+0.375-0.085,0,0.05,1.515,10,0,0,0,0,0,0,0.05,true,true,true)
c(0,0.375+0.375-0.05,-0.15,0.05,1.515,10,0,0,0,0.001,90,0,0.05,true,true,true)

c(0,0,0,0.27,3.1,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.27,true,true,true)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.pesticidePlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.pesticidePlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.pesticidePlanter.indexAmount=index.length

meshes.redClayPlanter={}
meshes.redClayPlanter.vertBuffer=gl.createBuffer()
meshes.redClayPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,0.75,1,10,0.75,0,0,-90,0,0,0.5,true,true,true)
c(0,0.6+0.2,0,0.75,0.8,10,0.75,0,0,-90,0,0,0.75,true,true,true)
c(0,0.75+0.25,0,0.89,0.4,10,0.75,0,0,-90,0,0,0.89,true,true,true)
c(0,0.76+0.25,0,0.65,0.4,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.1){

    c(Math.sin(i)*0.725,0.5,Math.cos(i)*0.725,0.075,0.1,10,0.4,0,0,0.001,i*MATH.TO_DEG,0,0.1,true,true,true)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.redClayPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.redClayPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.redClayPlanter.indexAmount=index.length

meshes.blueClayPlanter={}
meshes.blueClayPlanter.vertBuffer=gl.createBuffer()
meshes.blueClayPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,0.75,1,10,0,0,0.75,-90,0,0,0.5,true,true,true)
c(0,0.6+0.2,0,0.75,0.8,10,0,0,0.75,-90,0,0,0.75,true,true,true)
c(0,0.75+0.25,0,0.89,0.4,10,0,0,0.75,-90,0,0,0.89,true,true,true)
c(0,0.76+0.25,0,0.65,0.4,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.1){

    c(Math.sin(i)*0.725,0.5,Math.cos(i)*0.725,0.075,0.1,10,0,0,0.4,0.001,i*MATH.TO_DEG,0,0.1,true,true,true)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.blueClayPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.blueClayPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.blueClayPlanter.indexAmount=index.length

meshes.tackyPlanter={}
meshes.tackyPlanter.vertBuffer=gl.createBuffer()
meshes.tackyPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

let _ico=MATH.icosphere(1)

for(let i=0;i<_ico.verts.length;i+=3){

    verts.push(_ico.verts[i]*1.75,_ico.verts[i+1]*1.75+0.25,_ico.verts[i+2]*1.75,0.4*(_ico.verts[i+1]*0.2+0.8),1.1*(_ico.verts[i+1]*0.2+0.8),0.4*(_ico.verts[i+1]*0.2+0.8))
}

index.push(..._ico.index)

c(0,0.75+0.25,0,0.825,0.4,10,0.8,0.8,0.8,-90,0,0,0.825,true,true,true)
c(0,0.76+0.25,0,0.65,0.4,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

c(0,0.25,0,0.92,0.1,10,0.1,0.1,0.8,45,0,0,0.92,true,true,true)
c(0,0.25,0,0.92,0.1,10,0.8,0.4,0.1,-45,0,0,0.92,true,true,true)

c(0,0.25,0,0.92,0.1,10,0.1,0.1,0.8,45,0,90,0.92,true,true,true)
c(0,0.25,0,0.92,0.1,10,0.8,0.4,0.1,-45,0,90,0.92,true,true,true)

for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.2){

    c(Math.sin(i)*0.88,0.25,Math.cos(i)*0.88,0.15,0.1,10,0.75,0,0,0.001,i*MATH.TO_DEG,0,0.1,true,true,true)
}

for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.2){
    
    b(Math.sin(i)*0.825,1,Math.cos(i)*0.825,0.3,0.4,0.1,0.8,0.8,0,0.01,i*MATH.TO_DEG,0)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.tackyPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.tackyPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.tackyPlanter.indexAmount=index.length

meshes.petalPlanter={}
meshes.petalPlanter.vertBuffer=gl.createBuffer()
meshes.petalPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

for(let i=0;i<_ico.verts.length;i+=3){

    verts.push(_ico.verts[i]*1.75,_ico.verts[i+1]*1.75+0.25,_ico.verts[i+2]*1.75,1*(_ico.verts[i+1]*0.2+0.8),1*(_ico.verts[i+1]*0.2+0.8),0.5*(_ico.verts[i+1]*0.2+0.8))
}

for(let i=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.166667){
    
    b(Math.sin(i)*0.925,1,Math.cos(i)*0.925,1,0.1,0.85,0.85,0.85,0.85,45,i*MATH.TO_DEG,0)
}

index.push(..._ico.index)

c(0,0.75+0.25,0,0.825,0.4,10,0.8,0.8,0.8,-90,0,0,0.825,true,true,true)
c(0,0.76+0.25,0,0.65,0.4,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

for(let i=0,co=0;i<MATH.TWO_PI;i+=MATH.TWO_PI*0.25,co++){

    c(Math.sin(i)*0.875,0.25,Math.cos(i)*0.875,0.25,0.1,10,...([[0.9,0.9,0],[0,0.9,0]][co%2]),0.001,i*MATH.TO_DEG,0,0.25,true,true,true)
}

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.petalPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.petalPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.petalPlanter.indexAmount=index.length

meshes.plentyPlanter={}
meshes.plentyPlanter.vertBuffer=gl.createBuffer()
meshes.plentyPlanter.indexBuffer=gl.createBuffer()
verts=[]
index=[]

for(let i=0;i<_ico.verts.length;i+=3){

    verts.push(_ico.verts[i]*1.75,_ico.verts[i+1]*1.75+1.5,_ico.verts[i+2]*1.75,1*(_ico.verts[i+1]*0.2+0.8),0.75*(_ico.verts[i+1]*0.2+0.8),0.1*(_ico.verts[i+1]*0.2+0.8))
}

index.push(..._ico.index)

c(0,-0.2,0,0.3,0.6,9,1,0.75,0.1,-90,0,0,0.6,true,true,true)
c(0,1,0,0.2,2,9,1,0.75,0.1,-90,0,0,0.3,true,true,true)

c(0,0.75+1.5,0,0.8,0.3,10,0.1,0.425,0.8,-90,0,0,0.8,true,true,true)
c(0,0.76+1.5,0,0.65,0.3,10,1*0.35,0.7*0.35,0.3*0.35,-90,0,0,0.65,true,true,true)

b(0,1.5-0.25,0,2.25,0.15,0.15,1,0.75,0.1)
b(0,1.5+0.25,0,2.25,0.15,0.15,1,0.75,0.1)
b(2.25*0.5-0.15*0.5,1.5,0,0.15,0.4,0.15,1,0.75,0.1)
b(-2.25*0.5+0.15*0.5,1.5,0,0.15,0.5,0.15,1,0.75,0.1)

c(0,1.5,0.05,1.9*0.5,0.1,10,0.9,0,0,-90,0,-10,1.9*0.5,true,true,true)
c(0,1.5,-0.05,1.9*0.5,0.1,10,0,0,0.9,-90,0,10,1.9*0.5,true,true,true)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.plentyPlanter.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.plentyPlanter.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.plentyPlanter.indexAmount=index.length

meshes.spike={}
meshes.spike.vertBuffer=gl.createBuffer()
meshes.spike.indexBuffer=gl.createBuffer()
verts=[]
index=[]

c(0,0,0,0,5*2,10,0.8,0.8,0.8,-90,0,0,0.35*2,true,true,true)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.spike.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.spike.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.spike.indexAmount=index.length

meshes.basicSprout={}
meshes.basicSprout.vertBuffer=gl.createBuffer()
meshes.basicSprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,0.1,0.5,0.1)
b(-0.1,1+1,0,0.4,1,0.4,0.1,0.5,0.1,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,0.1,0.5,0.1,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,0.1,0.5,0.1,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.basicSprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.basicSprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.basicSprout.indexAmount=index.length

meshes.rareSprout={}
meshes.rareSprout.vertBuffer=gl.createBuffer()
meshes.rareSprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,0.6,0.6,0.6)
b(-0.1,1+1,0,0.4,1,0.4,0.6,0.6,0.6,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,0.6,0.6,0.6,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,0.6,0.6,0.6,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.rareSprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.rareSprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.rareSprout.indexAmount=index.length

meshes.epicSprout={}
meshes.epicSprout.vertBuffer=gl.createBuffer()
meshes.epicSprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,1*0.9,0.85*0.9,0)
b(-0.1,1+1,0,0.4,1,0.4,1*0.9,0.85*0.9,0,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,1*0.9,0.85*0.9,0,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,1*0.9,0.85*0.9,0,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.epicSprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.epicSprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.epicSprout.indexAmount=index.length

meshes.legendarySprout={}
meshes.legendarySprout.vertBuffer=gl.createBuffer()
meshes.legendarySprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,0,0.7,0.9)
b(-0.1,1+1,0,0.4,1,0.4,0,0.7,0.9,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,0,0.7,0.9,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,0,0.7,0.9,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.legendarySprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.legendarySprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.legendarySprout.indexAmount=index.length

meshes.supremeSprout={}
meshes.supremeSprout.vertBuffer=gl.createBuffer()
meshes.supremeSprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,0,10,0)
b(-0.1,1+1,0,0.4,1,0.4,0,10,0,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,0,10,0,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,0,10,0,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.supremeSprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.supremeSprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.supremeSprout.indexAmount=index.length

meshes.gummySprout={}
meshes.gummySprout.vertBuffer=gl.createBuffer()
meshes.gummySprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,1,0.4,1)
b(-0.1,1+1,0,0.4,1,0.4,1,0.4,1,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,1,0.4,1,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,1,0.4,1,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.gummySprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.gummySprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.gummySprout.indexAmount=index.length

meshes.moonSprout={}
meshes.moonSprout.vertBuffer=gl.createBuffer()
meshes.moonSprout.indexBuffer=gl.createBuffer()
verts=[]
index=[]

b(0,0+0.5,0,0.5,2,0.5,0.7,0.9,100)
b(-0.1,1+1,0,0.4,1,0.4,0.7,0.9,100,0.01,32,8)
b(-0.5,1.5+1,1,1.5,0.2,1.5,0.7,0.9,100,0.01,32,-15)
b(0,1.5+1,-1.25,1.75,0.2,1.75,0.7,0.9,100,0.01,35,5)

gl.bindBuffer(gl.ARRAY_BUFFER,meshes.moonSprout.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(verts),gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.moonSprout.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(index),gl.STATIC_DRAW)

meshes.moonSprout.indexAmount=index.length


player.createdMesh=window.mapMesh

let mesh=new Mesh(true)

function UPDATE_MAP_MESH(){
    
    mesh.setMeshFromFunction(function(box,a,cylinder,sphere,d,e,star){
        
        let f=Object.constructor('box','a','cylinder','sphere','d','e','star',player.createdMesh.replaceAll('WALL','['+(0.3*(player.targetLight<0.9?0:1)+','+(0.7*(player.targetLight<0.9?0:1))+','+(1.2*(player.targetLight<0.9?0:1))+']')))
        
        f(box,a,cylinder,sphere,d,e,star)
    })

    mesh.setBuffers()
}

UPDATE_MAP_MESH()

let flowers={},texSize=256/1024,texOffset=-1/1024

verts=[]
index=[]

let id=0

function addFlower(field,x,z){
    
    if(!flowers[field][z]) flowers[field][z]=[]
    
    let y=fieldInfo[field].y,c=fieldInfo[field].getColor(),l=fieldInfo[field].getLevel()
    
    flowers[field][z][x]={
        
        x:x,z:z,
        color:c,
        level:l,
        ogLevel:l,
        height:1,
        id:id++,
        y:y,
        goo:0,
        gooColor:noise(x*0.2+fieldInfo[field].x*10,z*0.2+fieldInfo[field].z*10)<0.499?-1:1,
        pollinationTimer:1
    }
    
    let vl=verts.length/8
    
    let h=flowers[field][z][x].height*0.5,tx,ty,lvl=flowers[field][z][x].level,g=flowers[field][z][x].goo*flowers[field][z][x].gooColor
    
    switch(flowers[field][z][x].color){
        
        case 'red':if(lvl===1){tx=0;ty=0;}else if(lvl===2){tx=256*3/1024;ty=0;}else if(lvl===3){tx=256*2/1024;ty=256/1024}else if(lvl===4){tx=256/1024;ty=256*2/1024}else if(lvl>=5){tx=0;ty=256*3/1024}break
        
        case 'blue':if(lvl===1){tx=256/1024;ty=0;}else if(lvl===2){tx=0;ty=256/1024}else if(lvl===3){tx=256*3/1024;ty=256/1024}else if(lvl===4){tx=256*2/1024;ty=256*2/1024}else if(lvl>=5){tx=256/1024;ty=256*3/1024}break
        
        case 'white':if(lvl===1){tx=256*2/1024;ty=0;}else if(lvl===2){tx=256/1024;ty=256/1024}else if(lvl===3){tx=0;ty=256*2/1024}else if(lvl===4){tx=256*3/1024;ty=256*2/1024}else if(lvl>=5){tx=256*2/1024;ty=256*3/1024}break
    }
    
    x+=fieldInfo[field].x
    z+=fieldInfo[field].z
    
    verts.push(
        
        x-0.5,y+h,z-0.5,texOffset+tx,texOffset+ty,1,1,g,
        x+0.5,y+h,z-0.5,texSize+tx,texOffset+ty,1,1,g,
        x+0.5,y+h,z+0.5,texSize+tx,texSize+ty,1,1,g,
        x-0.5,y+h,z+0.5,texOffset+tx,texSize+ty,1,1,g,
        
        x-0.5,y,z-0.5,0,0,1,-10000,0,
        x+0.5,y,z-0.5,0,0,1,-10000,0,
        x+0.5,y,z+0.5,0,0,1,-10000,0,
        x-0.5,y,z+0.5,0,0,1,-10000,0
    )
    
    index.push(vl+2,vl+1,vl,vl+3,vl+2,vl,vl+6,vl+5,vl+2,vl+7,vl+6,vl+2,vl+1,vl+5,vl+4,vl,vl+1,vl+4,vl+3,vl+7,vl+2,vl+4,vl+3,vl,vl+3,vl+4,vl+7,vl+1,vl+2,vl+5)
}

function updateFlower(field,x,z,func,updateHeight,updateGoo,updatePollination){
    
    func(flowers[field][z][x])
    
    flowers[field][z][x].height=MATH.constrain(flowers[field][z][x].height,0,1)
    
    let i=flowers[field][z][x].id*64

    UPDATE_FLOWER_MESH=true
    
    if(updateHeight){
        
        let newHeight=flowers[field][z][x].y+Math.max(flowers[field][z][x].height*0.5,0.05)
        
        flowers.mesh.verts[i+1]=newHeight
        flowers.mesh.verts[i+9]=newHeight
        flowers.mesh.verts[i+17]=newHeight
        flowers.mesh.verts[i+25]=newHeight
        
        newHeight=Math.max(flowers[field][z][x].height,0)
        
        flowers.mesh.verts[i+5]=newHeight
        flowers.mesh.verts[i+13]=newHeight
        flowers.mesh.verts[i+21]=newHeight
        flowers.mesh.verts[i+29]=newHeight
    }
    
    if(updateGoo){
        
        let g=flowers[field][z][x].goo*flowers[field][z][x].gooColor*0.7
        
        flowers.mesh.verts[i+7]=g
        flowers.mesh.verts[i+15]=g
        flowers.mesh.verts[i+23]=g
        flowers.mesh.verts[i+31]=g
    }
    
    if(updatePollination){
        
        let tx,ty,lvl=flowers[field][z][x].level
        
        switch(flowers[field][z][x].color){
        
            case 'red':if(lvl===1){tx=0;ty=0;}else if(lvl===2){tx=256*3/1024;ty=0;}else if(lvl===3){tx=256*2/1024;ty=256/1024}else if(lvl===4){tx=256/1024;ty=256*2/1024}else if(lvl>=5){tx=0;ty=256*3/1024}break
            
            case 'blue':if(lvl===1){tx=256/1024;ty=0;}else if(lvl===2){tx=0;ty=256/1024}else if(lvl===3){tx=256*3/1024;ty=256/1024}else if(lvl===4){tx=256*2/1024;ty=256*2/1024}else if(lvl>=5){tx=256/1024;ty=256*3/1024}break
            
            case 'white':if(lvl===1){tx=256*2/1024;ty=0;}else if(lvl===2){tx=256/1024;ty=256/1024}else if(lvl===3){tx=0;ty=256*2/1024}else if(lvl===4){tx=256*3/1024;ty=256*2/1024}else if(lvl>=5){tx=256*2/1024;ty=256*3/1024}break
        }
        
        flowers.mesh.verts[i+3]=texOffset+tx
        flowers.mesh.verts[i+4]=texOffset+ty
        flowers.mesh.verts[i+11]=texSize+tx
        flowers.mesh.verts[i+12]=texOffset+ty
        flowers.mesh.verts[i+19]=texSize+tx
        flowers.mesh.verts[i+20]=texSize+ty
        flowers.mesh.verts[i+27]=texOffset+tx
        flowers.mesh.verts[i+28]=texSize+ty
    }
}

function collectPollen(params){
    
    if(player.pollen>=player.capacity||params.pattern.length<1){return 0}
    
    let f=fieldInfo[params.field||player.fieldIn],x=params.x,z=params.z,total={r:0,b:0,w:0},stackHeight=params.stackHeight||0.425,crit={r:params.alwaysCrit||Math.random()<player.criticalChance?(Math.random()<player.superCritChance?2:1):0,b:params.alwaysCrit||Math.random()<player.criticalChance?(Math.random()<player.superCritChance?2:1):0,w:params.alwaysCrit||Math.random()<player.criticalChance?(Math.random()<player.superCritChance?2:1):0},amount=typeof params.amount==='number'?{r:params.amount,b:params.amount,w:params.amount}:params.amount,pattern=params.pattern,balloon={r:0,b:0,w:0},multiplier=params.multiplier?typeof params.multiplier==='number'?{r:params.multiplier,b:params.multiplier,w:params.multiplier}:params.multiplier:{r:1,b:1,w:1},totalHoney=0,totalGoo=0,yOffset=params.yOffset||2
    
    multiplier.r*=player.redPollen*(crit.r===0?1:crit.r===1?player.criticalPower:player.criticalPower*player.superCritPower)
    multiplier.b*=player.bluePollen*(crit.b===0?1:crit.b===1?player.criticalPower:player.criticalPower*player.superCritPower)
    multiplier.w*=player.whitePollen*(crit.w===0?1:crit.w===1?player.criticalPower:player.criticalPower*player.superCritPower)
    
    for(let i in pattern){
        
        let p=pattern[i]
        
        let _x=x+p[0],_z=z+p[1]
        
        if(_x>=0&&_x<f.width&&_z>=0&&_z<f.length){
            
            updateFlower(params.field||player.fieldIn,_x,_z,function(f){
                
                let amountToCollect=Math.min(amount[f.color[0]],f.height*100),amp=amountToCollect*0.01
                
                f.height-=Math.min(params.depleteAll?f.height:amp/((f.level-1)*0.2+1),f.height)
                
                amountToCollect*=multiplier[f.color[0]]
                amountToCollect*=f.level
                
                if(f.goo){
                    
                    amountToCollect*=player.goo
                    totalGoo+=amountToCollect
                    
                    if(params.isGummyBaller){
                        
                        player.addEffect('gummyBall',(f.goo*0.45)/180)
                        f.goo*=0.5
                    }
                }
                
                if(params.replenish) f.height+=params.replenish
                if(params.gooTrail) f.goo=1
                
                if(f.balloon){
                    
                    amountToCollect*=f.color==='blue'?1.25:1.1
                    f.balloon.pollen+=f.balloon.golden?amountToCollect*1.15:amountToCollect
                    
                } else {
                    
                    total[f.color[0]]+=amountToCollect
                }
                
            },true,params.gooTrail||params.isGummyBaller,false)
        }
    }
    
    total.r=Math.round(total.r)
    total.b=Math.round(total.b)
    total.w=Math.round(total.w)
    balloon.r=Math.round(balloon.r)
    balloon.b=Math.round(balloon.b)
    balloon.w=Math.round(balloon.w)
    totalGoo=Math.round(totalGoo)
    
    if(player.setting_enablePollenText){
        
        let stack=[]
        
        if(total.w||balloon.w)stack.push({c:'white',v:total.w+balloon.w})
        if(total.r||balloon.r)stack.push({c:'red',v:total.r+balloon.r})
        if(total.b||balloon.b)stack.push({c:'blue',v:total.b+balloon.b})
        
        if(stack[1]&&stack[0].v>stack[1].v){
            
            let n=stack[0]
            stack[0]=stack[1]
            stack[1]=n
        }
        
        if(stack[2]&&stack[0].v>stack[2].v){
            
            let n=stack[0]
            stack[0]=stack[2]
            stack[2]=n
        }
        
        if(stack[1]&&stack[2]&&stack[1].v>stack[2].v){
            
            let n=stack[1]
            stack[1]=stack[2]
            stack[2]=n
        }
        
        for(let i in stack){
            
            textRenderer.add(stack[i].v,params.otherPos?[params.otherPos[0],params.otherPos[1]+yOffset+stackHeight*i,params.otherPos[2]]:[f.x+x,f.y+yOffset+stackHeight*i+((stack[i].v+'').length*0.3),f.z+z],COLORS[stack[i].c+'Arr'],crit[stack[i].c[0]])
            
        }
    }
    
    let instantConversion={r:params.instantConversion?(player.instantRedConversion-1)*params.instantConversion+1:player.instantRedConversion,b:params.instantConversion?(player.instantBlueConversion-1)*params.instantConversion+1:player.instantBlueConversion,w:params.instantConversion?(player.instantWhiteConversion-1)*params.instantConversion+1:player.instantWhiteConversion}
    
    instantConversion.r=crit.r===2?1:instantConversion.r
    instantConversion.w=crit.w===2?1:instantConversion.w
    instantConversion.b=crit.b===2?1:instantConversion.b
    
    totalHoney=(total.r*instantConversion.r)+(total.b*instantConversion.b)+(total.w*instantConversion.w)

    player.pollen=Math.min(player.pollen+Math.ceil(total.w+total.r+total.b-totalHoney),player.capacity)

    totalHoney=Math.ceil((totalHoney+(totalGoo*0.1))*player.honeyPerPollen)
    
    player.honey+=totalHoney

    if(totalHoney&&player.setting_enablePollenText){
        
        textRenderer.add(totalHoney,[player.body.position.x,player.body.position.y+yOffset*0.8+0.4+Math.random()*0.75,player.body.position.z],COLORS.honey,0,'+',0.85)
    }
    
    player.stats.redPollen+=total.r+balloon.r
    player.stats.bluePollen+=total.b+balloon.b
    player.stats.whitePollen+=total.w+balloon.w
    player.stats.goo+=totalGoo
    
    let totalCollected=total.r+total.b+total.w+balloon.r+balloon.b+balloon.w
    
    player.stats['pollenFrom'+(params.field||player.fieldIn)]+=totalCollected
    player.stats.pollen+=totalCollected
    
    return totalCollected
}

function createField(name,x,y,z,w,l,c,_l,generalColorComp,nectarType){
    
    player.stats['pollenFrom'+name]=0
    
    fieldInfo[name]={x:x,y:y,z:z,width:w,length:l,getColor:c,getLevel:_l,haze:{},generalColorComp:generalColorComp,nectarType:nectarType+'Nectar',degration:0,corruption:0}
    
    flowers[name]=[]
    
    for(let x=0;x<w;x++){
        
        for(let z=0;z<l;z++){
            
            addFlower(name,x,z)
        }
    }
}


createField('CoconutField',25,12.5,-39.5,17,14,function(){
    
    let c=Math.random()
    
    return Math.random()<0.1?Math.random()<0.4?'blue':'red':'white'
    
},function(){
    
    return 3
},{w:0.9,b:0.04,r:0.06},'refreshing')

createField('PepperPatch',61,20.5,-44,15,15,function(){
    
    let c=Math.random()
    
    return Math.random()<0.1?'white':'red'
    
},function(){
    
    return 3
},{b:0,r:0.9,w:0.1},'invigorating')

createField('RoseField',31,2,31.5,19,13,function(){
    
    let c=Math.random()
    
    return Math.random()<0.12?'white':'red'
    
},function(){
    
    return Math.random()<0.5?3:Math.random()<0.12?1:2
},{r:0.88,w:0.12,b:0},'motivating')

createField('PineTreeForest',31,12.5,74,15,19,function(){
    
    let c=Math.random()
    
    return Math.random()<0.1?'white':'blue'
    
},function(){
    
    return Math.random()<0.46?3:Math.random()<0.6?1:2
},{w:0.1,b:0.9,r:0},'comforting')

createField('PumpkinPatch',4,12.5,76.5,18,12,function(){
    
    let c=Math.random()
    
    return Math.random()<0.57?'white':Math.random()<0.52?'red':'blue'
    
},function(){
    
    return Math.random()<0.76?3:2
},{w:0.57,r:(1-0.57)*0.52,b:(1-0.57)*0.48},'satisfying')

createField('CactusField',4,12.5,63.5,18,11,function(){
    
    let c=Math.random()
    
    return Math.random()<0.06?'white':Math.random()<0.58?'blue':'red'
    
},function(){
    
    return Math.random()<0.56?3:2
},{w:0.06,b:(1-0.06)*0.58,r:(1-0.06)*0.42},'invigorating')

createField('MountainTopField',-35,33,73,15,15,function(){
    
    let c=Math.random()
    
    return Math.random()<0.5?'red':'blue'
    
},function(){
    
    return 3
},{r:0.5,b:0.5,w:0},'invigorating')

createField('SunflowerField',15.5,-1.5,16,11,18,function(){
    
    let c=Math.random()
    
    return Math.random()>0.7?Math.random()<0.4?'blue':'red':'white'
    
},function(){
    
    return Math.random()<0.1?2:1
},{w:0.7,b:0.15,r:0.15},'satisfying')

createField('MushroomField',-6,-1.5,29,19,13,function(){
    
    let c=Math.random()
    
    return Math.random()<0.69?'red':'white'
    
},function(){
    
    return Math.random()<0.9?1:2
},{w:0.31,b:0,r:0.69},'motivating')

createField('StrawberryField',7.5,2,47,15,15,function(){
    
    let c=Math.random()
    
    return Math.random()<0.69?'red':'white'
    
},function(){
    
    return Math.random()<0.04?3:Math.random()<0.8?2:1
},{w:0.31,b:0,r:0.69},'refreshing')

createField('SpiderField',-20,2,47.5,19,14,function(){
    
    let c=Math.random()
    
    return 'white'
    
},function(){
    
    return Math.random()<0.8?2:Math.random()<0.5?3:1
},{w:1,b:0,r:0},'motivating')

createField('BambooField',-52,2,50,21,13,function(){
    
    let c=Math.random()
    
    return Math.random()<0.25?'white':'blue'
    
},function(){
    
    return Math.random()<0.75?2:Math.random()<0.25?3:1
},{w:0.25,b:0.75,r:0}),'comforting'

createField('PineapplePatch',-71.5,12.5,78,19,15,function(){
    
    let c=Math.random()
    
    return Math.random()<0.89?'white':Math.random()>0.56?'blue':'red'
    
},function(){
    
    return Math.random()<0.5?2:Math.random()<0.38?1:3
},{w:0.89,b:0.05,r:0.06},'satisfying')

createField('StumpField',-102,16,75,15,15,function(){
    
    let c=Math.random()
    
    return Math.random()<0.8?'blue':Math.random()>0.2?'white':'red'
    
},function(){
    
    return 3
},{w:0.15,b:0.8,r:0.05},'motivating')

createField('BlueFlowerField',-55,-1.5,29,24,13,function(){
    
    let c=Math.random()
    
    return Math.random()<0.69?'blue':'white'
    
},function(){
    
    return Math.random()<0.89?1:2
},{w:0.31,r:0,b:0.69},'refreshing')

createField('CloverField',-50,4,8.5,18,18,function(){
    
    let c=Math.random()
    
    return Math.random()<0.32?'white':Math.random()<0.5?'blue':'red'
    
},function(){
    
    return Math.random()<0.51?1:2
},{w:0.32,r:0.34,b:0.34},'invigorating')

createField('DandelionField',-15,-1.5,7,19,13,function(){
    
    let c=Math.random()
    
    return Math.random()<0.85?'white':Math.random()<0.366?'blue':'red'
    
},function(){
    
    return Math.random()<0.871?1:2
},{w:0.85,r:0.05,b:0.1},'comforting')

createField('AntField',-29.5,5.5,-59,18,12,function(){
    
    let c=Math.random()
    
    return Math.random()<0.333333?'white':Math.random()<0.5?'blue':'red'
    
},function(){
    
    return 1
},{w:0.33333,r:0.33333,b:0.33333})


flowers.mesh={}
flowers.mesh.vertBuffer=gl.createBuffer()
flowers.mesh.indexBuffer=gl.createBuffer()
flowers.mesh.verts=verts
flowers.mesh.index=index
flowers.mesh.indexAmount=index.length

gl.bindBuffer(gl.ARRAY_BUFFER,flowers.mesh.vertBuffer)
gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(flowers.mesh.verts),gl.DYNAMIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,flowers.mesh.indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,Uint16Array.from(flowers.mesh.index),gl.DYNAMIC_DRAW)

for(let i=0;i<25;i++)
player.addSlot(null)

player.addSlot('vicious')
player.addSlot('bear')
player.addSlot('puppy')
player.addSlot('festive')
player.addSlot('digital')
player.addSlot('buoyant')
player.addSlot('buoyant')
player.addSlot('buoyant')
player.addSlot('buoyant')
player.addSlot('buoyant')
player.addSlot('buoyant')

player.updateHive()
player.updateGear()

let ct=0
for(let i in items){
    
    if(i.indexOf('Planter')>-1) continue

    objects.tokens.push(new LootToken(10000,[(ct%9)-2,-1,(-7+((ct/9)|0))],i,1000000))
    
    ct++
}

objects.tokens.push(new LootToken(10000,[0,1,0],'honey',100000000000000))

player.pointerLocked=false

document.addEventListener('pointerlockchange',function(e){
    
    player.pointerLocked=!player.pointerLocked
    
},false)

ctx.textAlign='center'
ctx.textBaseline='middle'

//bamb
objects.mobs.push(new BugMob([-50,3,61],{minX:-52,maxX:-52+21,minZ:50,maxZ:50+13,minY:1,maxY:7},2,15,'rhinoBeetle'))
objects.mobs.push(new BugMob([-33,3,61],{minX:-52,maxX:-52+21,minZ:50,maxZ:50+13,minY:1,maxY:7},3,18,'rhinoBeetle'))

//bluf
objects.mobs.push(new BugMob([-55+22,-0.5,29+11],{minX:-55,maxX:-55+24,minZ:29,maxZ:29+13,minY:-2,maxY:5},1,8,'rhinoBeetle'))

//clov
objects.mobs.push(new BugMob([-50+17,5,9.5],{minX:-50,maxX:-50+18,minZ:8.5,maxZ:8.5+18,minY:3,maxY:8},2,12,'rhinoBeetle'))
objects.mobs.push(new BugMob([-53,5,9.5+15],{minX:-50,maxX:-50+18,minZ:8.5,maxZ:8.5+18,minY:3,maxY:8},2,10,'ladybug'))

//pineap
objects.mobs.push(new BugMob([-71.5+17,13.5,78+9],{minX:-71.5,maxX:-71.5+19,minZ:78,maxZ:78+15,minY:11.5,maxY:18},5,20,'rhinoBeetle'))
objects.mobs.push(new BugMob([-71.5+19*0.5,13.5,78+14],{minX:-71.5,maxX:-71.5+19,minZ:78,maxZ:78+15,minY:11.5,maxY:18},4,25,'mantis'))

//straw
objects.mobs.push(new BugMob([7.5+1,3,47+14],{minX:7.5,maxX:7.5+15,minZ:47,maxZ:47+15,minY:1,maxY:6},2,10,'ladybug'))
objects.mobs.push(new BugMob([7.5+14,3,47+1],{minX:7.5,maxX:7.5+15,minZ:47,maxZ:47+15,minY:1,maxY:6},3,12,'ladybug'))

//mush
objects.mobs.push(new BugMob([-6+11,-0.5,29+12],{minX:-6,maxX:-6+19,minZ:29,maxZ:29+13,minY:-2,maxY:4},1,6,'ladybug'))

//spi
objects.mobs.push(new BugMob([-20+19*0.5,2.75,47.5+15],{minX:-20,maxX:-20+19,minZ:47.5,maxZ:47.5+14,minY:-0,maxY:6},4,25,'spider'))


objects.mobs.push(new BugMob([4,12.5+1,(63.5+76.5+12)*0.5],{minX:4,maxX:4+31+15,minZ:63.5,maxZ:76.5+12,minY:11,maxY:15},6,75,'werewolf'))

//pine
objects.mobs.push(new BugMob([31+14,13.5,75],{minX:31,maxX:31+15,minZ:74,maxZ:74+19,minY:11,maxY:15},5,35,'mantis'))
objects.mobs.push(new BugMob([31+14,13.5,74+18],{minX:31,maxX:31+15,minZ:74,maxZ:74+19,minY:11,maxY:15},6,45,'mantis'))

//rose
objects.mobs.push(new BugMob([30+19,2.75,32.5],{minX:31,maxX:31+19,minZ:31.5,maxZ:31.5+13,minY:0,maxY:6},5,35,'scorpion'))
objects.mobs.push(new BugMob([32,2.75,30.5+13],{minX:31,maxX:31+19,minZ:31.5,maxZ:31.5+13,minY:0,maxY:6},5,35,'scorpion'))

objects.mobs.push(new BugMob([-53+25*0.5,-0.75,8.5],{minX:-55,maxX:-53+25,minZ:6.5,maxZ:6.5+20,minY:-10,maxY:3.5},7,2500,'kingBeetle'))


if(window.thisProgramIsInFullScreen){
    
    document.getElementById('UIBar').style.display='none'
    document.getElementById('honeyAndPollenAmount').style.display='none'
    document.getElementById('abilityUI').style.display='none'

} else {

    document.getElementById('meshCreator').style.display='none'
}

document.getElementById('runMeshStr').onclick=function(){
    
    if(!window.thisProgramIsInFullScreen){
        
        let copyText=document.getElementById('meshStr')
        copyText.select()
        document.execCommand('copy')
        copyText.setSelectionRange(0,0)
        document.getElementById('meshCreator').style.display='none'
        return
    }
    
    player.createdMesh=document.getElementById('meshStr').value
    
    UPDATE_MAP_MESH()
    
    mesh.setBuffers()
    
    let copyText=document.getElementById('meshStr')
    copyText.select()
    document.execCommand('copy')
    copyText.setSelectionRange(0,0)
}

document.getElementById('meshStr').value=player.createdMesh

player.updateHive()
player.addEffect('tabbyLove',false,false,1000)

window.functionToRunOnBeequipClick=function(id){
    
    player.beequipLookingAt=id
    player.updateBeequipPage()
}

window.exitBeequipLooking=function(id){
    
    player.beequipLookingAt=false
    player.updateBeequipPage()
}

window.selectBeequip=function(){
    
    for(let i in player.currentGear.beequips){
        
        if(player.currentGear.beequips[i].id===player.beequipLookingAt){

            player.beequipDragging=player.currentGear.beequips[i]
        }
    }
    
    player.updateBeequipPage()
}

window.unselectBeequip=function(){
    
    player.beequipDragging=false
    player.updateBeequipPage()
}

window.deleteBeequip=function(){
    
    if(player.currentGear.beequips[player.beequipLookingAt].bee){

        player.hive[player.currentGear.beequips[player.beequipLookingAt].bee[1]][player.currentGear.beequips[player.beequipLookingAt].bee[0]].beequip=null
        
    }
    
    player.currentGear.beequips.splice(player.beequipLookingAt,1)
    
    for(let i in player.currentGear.beequips){
        
        player.currentGear.beequips[i].id=Number(i)
    }
    
    player.beequipDragging=false
    player.beequipLookingAt=false
    player.updateBeequipPage()
    player.updateHive()
}

objects.mobs.push(new MondoChick('MountainTopField',7))

// objects.mobs.push(new RogueViciousBee('DandelionField',MATH.random(1,13)|0))
// objects.mobs.push(new Cloud('DandelionField',2,2,60,true))

objects.mobs.push(new Mechsquito('DandelionField',1,false))
objects.mobs.push(new Cogmower('DandelionField',1,false))
objects.mobs.push(new Mechsquito('DandelionField',1,true))
objects.mobs.push(new Cogmower('DandelionField',1,true))

objects.mobs.push(new CogTurret('DandelionField',1,3))
objects.mobs.push(new CogTurret('DandelionField',1,1))


function loop(now){
    
    if(!then){
        
        now=window.performance.now()
        then=now
        
        ctx.textAlign='center'
        ctx.textBaseline='middle'
    }
    
    dt=MATH.constrain((now-then)*0.001,0.01,0.1)

    TIME+=dt
    frameCount++
    BEE_COLLECT=Math.sin(TIME*15)*0.25
    BEE_FLY=Math.sin(TIME*35)*0.1
    
    actionWarning.style.display='none'
    
    player.resetStats()
    
    for(let k in effects){
        
        let playerHas
        
        for(let j in player.effects){
            
            if(player.effects[j].type===k){
                
                playerHas=j
                break
            }
        }
        
        if(!playerHas) continue
        
        let i=playerHas
        
        if(effects[player.effects[i].type].isPassive){
            
            let e=effects[player.effects[i].type]
            
            e.currentCooldown-=dt
            
            if(e.currentCooldown>0){
                
                e.amount.textContent=(e.currentCooldown|0)+'s'
                effects[player.effects[i].type].cooldown.setAttribute('height',30)
                e.currentVal=0
                e.startVal=player.stats[e.triggerType]
                
            } else {
                
                effects[player.effects[i].type].cooldown.setAttribute('height',0)
                e.currentVal=player.stats[e.triggerType]-e.startVal
                e.amount.textContent=e.currentVal
                
                if(e.currentVal>=e.triggerVal){
                    
                    e.currentCooldown=e.maxCooldown
                    e.activate()
                    passiveActivationPopup.style.display='block'
                    player.passivePopupTimer=2
                    
                    let s=document.getElementById('abilityUI').innerHTML
                    s=s.split('</svg>')
                    
                    for(let e in s){
                        
                        if(s[e].indexOf(player.effects[i].type)>-1){
                            
                            s=s[e]
                            break
                        }
                    }
                    
                    let tb=s.indexOf('<text'),te=s.indexOf('</text>')
                    
                    passiveActivationPopup.innerHTML=s.substr(0,tb)+s.substr(te+5,s.length)+'</svg>'
                }
            }
            
        } else {
            
            player.effects[i].cooldown-=dt
            
            if(effects[player.effects[i].type].hideAmount!==true){

                effects[player.effects[i].type].amount.textContent=player.effects[i].amount>1?'x'+player.effects[i].amount:''
                
                if(effects[player.effects[i].type].amountFromCooldown){
                    
                    player.effects[i].amount=player.effects[i].cooldown/effects[player.effects[i].type].maxCooldown
                    
                    effects[player.effects[i].type].amount.textContent=((player.effects[i].amount*100+1)|0)+'%'
                    
                }

            } else if(effects[player.effects[i].type].amountFromCooldown){
                
                player.effects[i].amount=player.effects[i].cooldown/effects[player.effects[i].type].maxCooldown
                
            }
            
            effects[player.effects[i].type].cooldown.setAttribute('height',(30-player.effects[i].cooldown*30/effects[player.effects[i].type].maxCooldown)||30)
            
            effects[player.effects[i].type].update(player.effects[i].amount,player)
            
            if(player.effects[i].cooldown<=0){
                
                effects[player.effects[i].type].svg.style.display='none'
                
                player.effects.splice(i,1)
            }
        }
    }
    
    player.convertTotal*=player.convertRate
    player.attackTotal=(player.attackTotal+(player.beeColorAmounts.r*player.redBeeAttack)+(player.beeColorAmounts.b*player.blueBeeAttack)+(player.beeColorAmounts.w*player.whiteBeeAttack))*player.beeAttack
    
    if(player.fieldIn){
        
        player.capacity*=(player.redFieldCapacity-1)*fieldInfo[player.fieldIn].generalColorComp.r+1
        player.capacity*=(player.blueFieldCapacity-1)*fieldInfo[player.fieldIn].generalColorComp.b+1
        player.capacity*=(player.whiteFieldCapacity-1)*fieldInfo[player.fieldIn].generalColorComp.w+1
    }
    
    for(let i=objects.marks.length;i--;){
        
        if(objects.marks[i].update()){
            
            objects.marks[i].die(i)
        }
    }
    
    for(let i in triggers){
        
        triggers[i].colliding=player.body.position.x>triggers[i].minX&&player.body.position.x<triggers[i].maxX&&player.body.position.y>triggers[i].minY&&player.body.position.y<triggers[i].maxY&&player.body.position.z>triggers[i].minZ&&player.body.position.z<triggers[i].maxZ
        
        if(triggers[i].colliding&&triggers[i].contactFunc){

            triggers[i].contactFunc(player)
            continue
        }

        if(triggers[i].isMachine){
            
            if(triggers[i].colliding){
                
                actionWarning.style.display='block'

                let useReq=triggers[i].requirements?triggers[i].requirements(player):false

                if(!useReq){

                    actionName.innerHTML=triggers[i].message
                    actionName.style.backgroundColor='rgb(30,70,255,0.8)'
                    document.getElementById('actionEButton').style.display='block'
                    
                    if(user.clickedKeys.e){
                        
                        triggers[i].func(player)
                    }

                } else {
                    
                    actionName.innerHTML=useReq
                    actionName.style.backgroundColor='rgb(255,0,0,0.6)'
                    document.getElementById('actionEButton').style.display='none'
                }

            } else if(actionName.innerHTML===triggers[i].message){
                actionName.style.display='block'
                
            }
        }
    }
    
    gl.clearColor(...player.skyColor,1)
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    
    player.updatePhysics()
    world.step(dt)
    player.updateCamera()
    
    gl.useProgram(dynamicGeometryProgram)
    gl.uniformMatrix4fv(glCache.dynamic_viewMatrix,gl.FALSE,player.viewMatrix)
    
    gl.uniformMatrix4fv(glCache.dynamic_modelMatrix,gl.FALSE,MATH.IDENTITY_MATRIX)
    shopGearMesh.render()
    
    gl.uniformMatrix4fv(glCache.dynamic_modelMatrix,gl.FALSE,player.modelMatrix)
    playerMesh.render()
    
    gl.uniformMatrix4fv(glCache.dynamic_modelMatrix,gl.FALSE,player.toolMatrix)
    player.toolMesh.render()
    
    gl.bindTexture(gl.TEXTURE_2D,textures.flowers)
    gl.useProgram(flowerGeometryProgram)
    
    gl.uniformMatrix4fv(glCache.flower_viewMatrix,gl.FALSE,player.viewMatrix)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,flowers.mesh.vertBuffer)

    if(UPDATE_FLOWER_MESH)
        gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(flowers.mesh.verts),gl.DYNAMIC_DRAW)

    UPDATE_FLOWER_MESH=false
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,flowers.mesh.indexBuffer)
    gl.vertexAttribPointer(glCache.flower_vertPos,3,gl.FLOAT,gl.FALSE,32,0)
    gl.vertexAttribPointer(glCache.flower_vertUV,4,gl.FLOAT,gl.FALSE,32,12)
    gl.vertexAttribPointer(glCache.flower_vertGoo,1,gl.FLOAT,gl.FALSE,32,28)
    
    gl.drawElements(gl.TRIANGLES,flowers.mesh.indexAmount,gl.UNSIGNED_SHORT,0)
    
    gl.bindTexture(gl.TEXTURE_2D,textures.default)
    gl.useProgram(staticGeometryProgram)
    gl.uniformMatrix4fv(glCache.static_viewMatrix,gl.FALSE,player.viewMatrix)
    mesh.render()
    
    if(player.itemDragging&&items[player.itemDragging].canUseOnSlot||player.beequipDragging){
        
        let x=(user.mouseX/half_width)-1,y=((height-user.mouseY)/half_height)-1,z=1
        let v=player.viewMatrix,mat=[v[0],v[1],v[2],v[4],v[5],v[6],v[8],v[9],v[10]]
        mat3.invert(mat,mat)
        let dir=vec3.transformMat3([],[x,y,z],mat)
        vec3.normalize(dir,dir)
        let d=[player.cameraDir[0]*player.zoom,player.cameraDir[1]*player.zoom,player.cameraDir[2]*player.zoom]
        x=player.body.position.x+d[0]+dir[0]*8
        y=player.body.position.y+0.35+d[1]+dir[1]*8
        z=player.body.position.z+d[2]+dir[2]*8
        let result=new CANNON.RaycastResult()
        d[0]+=player.body.position.x
        d[1]+=player.body.position.y+0.35
        d[2]+=player.body.position.z
        raycastWorld.raycastClosest(new CANNON.Vec3(...d),new CANNON.Vec3(d[0]+dir[0]*10000,d[1]+dir[1]*10000,d[2]+dir[2]*10000),{},result)
        x=result.hitPointWorld.x
        y=result.hitPointWorld.y
        z=result.hitPointWorld.z
        
        if(result.body){
            
            player.hiveIndex=result.body.hiveIndex.slice()
            player.canUseItem=true
            
        } else {
            
            player.canUseItem=false
            player.hiveIndex=false
        }
        
        if(player.canUseItem){
            
            player.beeHighlightMesh.setMeshFromFunction(function(box){
                
                if(player.itemDragging&&items[player.itemDragging].canUseOnSlot(player.hive[player.hiveIndex[1]][player.hiveIndex[0]])||player.beequipDragging&&beequips[player.beequipDragging.type].canUseOnSlot(player.hive[player.hiveIndex[1]][player.hiveIndex[0]])){
                    
                    box(player.hivePos[0]+player.hiveIndex[0]*0.8,player.hivePos[1]+player.hiveIndex[1]*0.8-2.25,player.hivePos[2]-0.2,0.8,0.8,0.1,false,[0,100,0],false,false)
                    
                } else {
                    
                    player.canUseItem=false
                    box(player.hivePos[0]+player.hiveIndex[0]*0.8,player.hivePos[1]+player.hiveIndex[1]*0.8-2.25,player.hivePos[2]-0.2,0.8,0.8,0.1,false,[100,0,0],false,false)
                }
            })
            
            
        } else {
            
            player.beeHighlightMesh.setMeshFromFunction(function(){})
        }
        
        player.beeHighlightMesh.setBuffers()
        player.beeHighlightMesh.render()
    }
    
    for(let i=objects.triangulates.length;i--;){
        
        if(objects.triangulates[i].update()){
            
            objects.triangulates[i].die(i)
        }
    }
    
    player.sprinklerMesh.render()
    
    gl.bindTexture(gl.TEXTURE_2D,textures.bear)
    
    let minDist=Infinity,minNPC
    
    for(let i in NPCs){
        
        if(!NPCs[i].computedMesh){
            
            minDist=-1
            minNPC=i
            NPCs[i].computedMesh=true
            break
        }
        
        let d=Math.abs(player.body.position.x-triggers[i+'_NPC'].minX)+Math.abs(player.body.position.y-triggers[i+'_NPC'].minY)+Math.abs(player.body.position.z-triggers[i+'_NPC'].minZ)
        
        if(minDist>d){
            
            minDist=d
            minNPC=i
        }
        
        NPCs[i].mesh.render()
    }
    
    if(minDist<75){
        
        if(minDist<50&&!NPCs[minNPC].activeQuest){
            
            textRenderer.addDecalRaw(...NPCs[minNPC].exclaimPos,0,0,...textRenderer.decalUV['exclaim'],1,1,1,5,4,Math.PI)
        }
        
        if(frameCount%2||minDist<0){
            
            NPCs[minNPC].mesh.setMeshFromFunction(function(box,a,cylinder,sphere,d,e,star,limbBox,limbCylinder){
                
                let x=NPCs[minNPC].meshParams.x,y=NPCs[minNPC].meshParams.y,z=NPCs[minNPC].meshParams.z,r=NPCs[minNPC].meshParams.r,s=NPCs[minNPC].meshParams.s,t=TIME,t1=Math.sin(t*2.1)*5-0.5
                
                limbBox(r,x,y+Math.cos(t1*MATH.TO_RAD*2)*s*0.6,z+Math.sin(t1*MATH.TO_RAD*2)*s*0.6,1.1*s,0.9*s,0.6*s,[t1*2,0,0],NPCs[minNPC].meshParams.texture.torso.u*128/1024,NPCs[minNPC].meshParams.texture.torso.v*128/1024,NPCs[minNPC].meshParams.texture.torso.texture)
                limbBox(r,x,y+Math.cos(t1*MATH.TO_RAD*2.75)*s*1.65,z+Math.sin(t1*MATH.TO_RAD*2.75)*s*1.65,1.2*s,1.15*s,0.6*s,[t1*4,0,0],NPCs[minNPC].meshParams.texture.face.u*128/1024,NPCs[minNPC].meshParams.texture.face.v*128/1024,true)
                limbBox(r,x,y,z,1.1*s,0.25*s,0.6*s,[t1,0,0],NPCs[minNPC].meshParams.texture.torso.u*128/1024,NPCs[minNPC].meshParams.texture.torso.v*128/1024)
                limbBox(r,x+s/1.25,y-Math.cos(t1*MATH.TO_RAD*3.5*2)*s*0.65+s*1.15,z-Math.sin(t1*MATH.TO_RAD*3.5*2)*s*0.2,0.5*s,1.15*s,0.5*s,[t1*3.5*2,0,9],(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                s/=1.25
                limbBox(r,x-0.35*s,y-0.55*s,z+0.1*s,0.55*s*1.25,0.6*s*1.25,0.55*s*1.25,[t1*1.25-10,0,-5],(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                limbBox(r,x-0.42*s,y-1.15*s,z+0.1*s,0.55*s*1.25,0.6*s*1.25,0.55*s*1.25,[10-t1*0.5,0,-5],(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                limbBox(r,x+0.35*s,y-0.55*s,z+0.1*s,0.55*s*1.25,0.6*s*1.25,0.55*s*1.25,[t1*1.25-10,0,5],(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                limbBox(r,x+0.42*s,y-1.15*s,z+0.1*s,0.55*s*1.25,0.6*s*1.25,0.55*s*1.25,[10-t1*0.5,0,5],(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                s*=1.25
                limbCylinder(r,x-0.6*s,y+Math.cos(t1*MATH.TO_RAD*3)*s*2.2,z+Math.sin(t1*MATH.TO_RAD*3)*s*2.2,0.3*s,0.65*s,10,0.9,0.9,0.9,1,t1*4,0,0,(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                limbCylinder(r,x+0.6*s,y+Math.cos(t1*MATH.TO_RAD*3)*s*2.2,z+Math.sin(t1*MATH.TO_RAD*3)*s*2.2,0.3*s,0.65*s,10,0.9,0.9,0.9,1,t1*4,0,0,(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                t1=Math.sin(t*2.1+0.5)*5-0.5
                limbBox(r,x-1*s/1.25,y-Math.cos(t1*MATH.TO_RAD*3.5*2)*s*0.65+s*1.15,z-Math.sin(t1*MATH.TO_RAD*3.5*2)*s*0.2,0.5*s,1.15*s,0.5*s,[t1*3.5*2,0,-9],(NPCs[minNPC].meshParams.texture.face.u+NPCs[minNPC].meshParams.texture.extremities.u)*128/1024,(NPCs[minNPC].meshParams.texture.face.v+NPCs[minNPC].meshParams.texture.extremities.v)*128/1024)
                
            })
            
            NPCs[minNPC].mesh.setBuffers()
        }
    }
    
    gl.bindTexture(gl.TEXTURE_2D,textures.bees)
    player.hiveMesh.render()
    
    player.updateFields()
    
    gl.useProgram(beeGeometryProgram)
    
    gl.uniformMatrix4fv(glCache.bee_viewMatrix,gl.FALSE,player.viewMatrix)
    
    for(let i in objects.bees){
        
        objects.bees[i].update()
    }
    
    for(let i in objects.tempBees){
        
        if(objects.tempBees[i].update()){
            
            for(let j in objects.tempBees[i].trails){
                
                objects.tempBees[i].trails[j].splice=true
            }
            
            objects.tempBees.splice(i,1)
        }
    }
    
    let amountOfBeesInBeeLine=0
    
    for(let i in beeInfo){
        
        let t=i
        
        meshes.bees.instanceData.push((amountOfBeesInBeeLine%14)+13,1.5,-5+((amountOfBeesInBeeLine/14)|0)*1.5,i==='baby'||i==='tadpole'?0.65:1,0,0,1,0,beeInfo[t].u,beeInfo[t].v,beeInfo[t].meshPartId)

        meshes.bees.instanceData.push((amountOfBeesInBeeLine%14)+13,0,-5+((amountOfBeesInBeeLine/14)|0)*1.5,i==='baby'||i==='tadpole'?0.65:1,0,0,1,0,beeInfo[t].u,beeInfo[t].v+GIFTED_BEE_TEXTURE_OFFSET,beeInfo[t].meshPartId)

        textRenderer.addSingle(i,[(amountOfBeesInBeeLine%14)+13,2,-5+((amountOfBeesInBeeLine/14)|0)*1.5],COLORS.whiteArr,-1,false,false)

        amountOfBeesInBeeLine+=2
    }
    
    gl.bindTexture(gl.TEXTURE_2D,textures.bees)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.bee.vertBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.bee.indexBuffer)
    gl.vertexAttribPointer(glCache.bee_vertPos,3,gl.FLOAT,gl.FLASE,28,0)
    gl.vertexAttribPointer(glCache.bee_vertUV,4,gl.FLOAT,gl.FLASE,28,12)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.bees.instanceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(meshes.bees.instanceData),gl.DYNAMIC_DRAW)
    
    gl.vertexAttribPointer(glCache.bee_instancePos,4,gl.FLOAT,gl.FLASE,44,0)
    gl.vertexAttribDivisor(glCache.bee_instancePos,1)
    gl.vertexAttribPointer(glCache.bee_instanceRotation,4,gl.FLOAT,gl.FLASE,44,16)
    gl.vertexAttribDivisor(glCache.bee_instanceRotation,1)
    gl.vertexAttribPointer(glCache.bee_instanceUV,3,gl.FLOAT,gl.FLASE,44,32)
    gl.vertexAttribDivisor(glCache.bee_instanceUV,1)
    
    gl.drawElementsInstanced(gl.TRIANGLES,meshes.bee.indexAmount,gl.UNSIGNED_SHORT,0,meshes.bees.instanceData.length*MATH.INV_11)
    
    gl.vertexAttribDivisor(glCache.bee_instancePos,0)
    gl.vertexAttribDivisor(glCache.bee_instanceRotation,0)
    gl.vertexAttribDivisor(glCache.bee_instanceUV,0)

    meshes.bees.instanceData=[]
    
    gl.useProgram(tokenGeometryProgram)
    
    gl.uniformMatrix4fv(glCache.token_viewMatrix,gl.FALSE,player.viewMatrix)
    
    for(let i=objects.tokens.length;i--;){
        
        if(objects.tokens[i].update(dt)){
            
            objects.tokens[i].die(i)
        }
    }
    
    gl.bindTexture(gl.TEXTURE_2D,textures.effects)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.token.vertBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.token.indexBuffer)
    gl.vertexAttribPointer(glCache.token_vertPos,3,gl.FLOAT,gl.FLASE,20,0)
    gl.vertexAttribPointer(glCache.token_vertUV,2,gl.FLOAT,gl.FLASE,20,12)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.tokens.instanceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(meshes.tokens.instanceData),gl.DYNAMIC_DRAW)
    
    gl.vertexAttribPointer(glCache.token_instancePos,4,gl.FLOAT,gl.FALSE,32,0)
    gl.vertexAttribDivisor(glCache.token_instancePos,1)
    gl.vertexAttribPointer(glCache.token_instanceUV,4,gl.FLOAT,gl.FALSE,32,16)
    gl.vertexAttribDivisor(glCache.token_instanceUV,1)
    
    gl.drawElementsInstanced(gl.TRIANGLES,meshes.token.indexAmount,gl.UNSIGNED_SHORT,0,meshes.tokens.instanceData.length*0.125)
    
    gl.vertexAttribDivisor(glCache.token_instancePos,0)
    gl.vertexAttribDivisor(glCache.token_instanceUV,0)
    meshes.tokens.instanceData=[]
    
    gl.depthMask(false)
    
    ParticleRenderer.render()
    
    TrailRenderer.render()
    
    gl.depthMask(true)
    
    gl.useProgram(mobRendererProgram)
    gl.uniformMatrix4fv(glCache.mob_viewMatrix,gl.FALSE,player.viewMatrix)
    
    if(user.keys.o){

        TIME+=dt*50

        player.roboChallenge={timer:3*60,page:'bee',beesPerRound:2,beesPicked:0,activeBees:[],scene:'bee',rerollCost:10,activeUpgrades:[]}
        player.updateRoboUI()

        for(let i in objects.planters){

            objects.planters[i].growth+=dt*500
        }
    }

    if(user.clickedKeys.l){

        UPDATE_MAP_MESH()
    }
    
    player.attacked=[]
    
    for(let i=objects.mobs.length;i--;){
        
        if(objects.mobs[i].update()){
            
            objects.mobs[i].die(i)
        }
    }

    for(let i=objects.planters.length;i--;){
        
        if(objects.planters[i].update()){
            
            objects.planters[i].die(i)
        }
    }

    gl.useProgram(explosionRendererProgram)
    
    gl.uniformMatrix4fv(glCache.explosion_viewMatrix,gl.FALSE,player.viewMatrix)
    
    for(let i=objects.bubbles.length;i--;){
        
        if(objects.bubbles[i].update()){
            
            objects.bubbles[i].die(i)
        }
    }

    for(let i=objects.explosions.length;i--;){
        
        if(objects.explosions[i].update()){
            
            objects.explosions[i].die(i)
        }
    }
    
    for(let i=objects.balloons.length;i--;){
        
        if(objects.balloons[i].update()){
            
            objects.balloons[i].die(i)
        }
    }
    
    for(let i=objects.targets.length;i--;){
        
        if(objects.targets[i].update()){
            
            objects.targets[i].die(i)
        }
    }
    
    for(let i=objects.fuzzBombs.length;i--;){
        
        if(objects.fuzzBombs[i].update()){
            
            objects.fuzzBombs[i].die(i)
        }
    }
    
    player.updateHiveBalloon()
    player.updateAntChallenge()
    player.updateRoboChallenge()
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cylinder_explosion.vertBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.cylinder_explosion.indexBuffer)
    gl.vertexAttribPointer(glCache.explosion_vertPos,3,gl.FLOAT,gl.FLASE,12,0)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.cylinder_explosions.instanceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(meshes.cylinder_explosions.instanceData),gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(glCache.explosion_instancePos,3,gl.FLOAT,gl.FLASE,36,0)
    gl.vertexAttribDivisor(glCache.explosion_instancePos,1)
    gl.vertexAttribPointer(glCache.explosion_instanceColor,4,gl.FLOAT,gl.FLASE,36,12)
    gl.vertexAttribDivisor(glCache.explosion_instanceColor,1)
    gl.vertexAttribPointer(glCache.explosion_instanceScale,2,gl.FLOAT,gl.FLASE,36,28)
    gl.vertexAttribDivisor(glCache.explosion_instanceScale,1)
    gl.drawElementsInstanced(gl.TRIANGLES,meshes.cylinder_explosion.indexAmount,gl.UNSIGNED_SHORT,0,meshes.cylinder_explosions.instanceData.length*MATH.INV_9)
    
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.explosion.vertBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,meshes.explosion.indexBuffer)
    gl.vertexAttribPointer(glCache.explosion_vertPos,3,gl.FLOAT,gl.FLASE,12,0)
    gl.bindBuffer(gl.ARRAY_BUFFER,meshes.explosions.instanceBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,Float32Array.from(meshes.explosions.instanceData),gl.DYNAMIC_DRAW)
    gl.vertexAttribPointer(glCache.explosion_instancePos,3,gl.FLOAT,gl.FLASE,36,0)
    gl.vertexAttribPointer(glCache.explosion_instanceColor,4,gl.FLOAT,gl.FLASE,36,12)
    gl.vertexAttribPointer(glCache.explosion_instanceScale,2,gl.FLOAT,gl.FLASE,36,28)
    gl.drawElementsInstanced(gl.TRIANGLES,meshes.explosion.indexAmount,gl.UNSIGNED_SHORT,0,meshes.explosions.instanceData.length*MATH.INV_9)
    
    gl.vertexAttribDivisor(glCache.explosion_instancePos,0)
    gl.vertexAttribDivisor(glCache.explosion_instanceColor,0)
    gl.vertexAttribDivisor(glCache.explosion_instanceScale,0)
    
    meshes.explosions.instanceData=[]
    meshes.cylinder_explosions.instanceData=[]
    
    gl.disable(gl.DEPTH_TEST)
    textRenderer.render(dt,Math.sin(TIME*20))
    gl.enable(gl.DEPTH_TEST)
    
    ctx.drawImage(gl.canvas,0,0)
    
    textRenderer.draw()
    
    player.updateUI()
    
    if(user.clickedKeys.h){
        
        player.addEffect('haste')
        player.addEffect('focus')
        player.addEffect('melody')
        player.addEffect('bombCombo')
        player.addEffect('flameHeat',0.05)
    }
    
    user.update()

    then=now
    
    window.parent.raf=window.requestAnimationFrame(loop)
}

if(window.parent.raf){
    
    window.cancelAnimationFrame(window.parent.raf)
}

function noFullScreen(){
    
    document.getElementById('useFullscreen').style.display='none'
    loop()
}

document.getElementById('noFullScreen').addEventListener('click',noFullScreen)

if(window.thisProgramIsInFullScreen){
    
    noFullScreen()
}
}

//<script>

console.log=0
