
$(document).ready(function () {
	
	var c,
		ctx,
		picXNum,
		picYNum,
		loadedpicX=0,
		loadedpicY=0,
		currentNum=0,
		currentReNum=0,
		numberOfImg,
		imgFolder,
		reimgFolder,
		progress,
		imgList = [],
		imgReList = [],
		smallDistanceImageXArr =[],
		smallDistanceImageYArr =[],
		playInterval = 20,

		progressDiam		="110",		// progress diameter
		progressFontFamily	="Helvetica, Arial, sans-serif",
		progressFontSize	= "0.7em",
		progressBgColor		="#000000",
		progressFgColor		= "#FFFFFF",
		progressMode		= "circle",		// can be: circle, bar, none
		progressHeight		= "5px",		// if progressMode == "bar"
		progressShowImages	= true;			// display images while loaded	
	
	init(50,9,"images","resizeImages");

	function init(_picXNum,_picYNum,_folder,_refolder)
	{
		picXNum = _picXNum;
		picYNum = _picYNum;
		imgFolder= _folder;
		reimgFolder=_refolder;
		c = document.getElementById('myCanvas');
		ctx = c.getContext('2d');
		document.body.appendChild(c);
		document.body.style.margin ="0";
		document.body.style.padding ="0";
		document.body.style.overflow = "hidden"; //canvas is a few pixels taller than innerHeight… (?)			
		
		buildProgress();
		var t;
		var i;
		var j;
		for(i=0;i<picYNum;i++)
		{
			for(j=0;j<picXNum;j++)
			{
				
				loadReNext(i,j);
				loadNext(i,j);
			}
		}

		for(i=0;i<picYNum;i++)
		{
			for(j=0;j<picXNum;j++)
			{
				loadNext(i,j);
			}
		}
		for(t=0;t<picXNum;t++)
		{
			smallDistanceImageXArr.push(t*screen.width/picXNum);
		}
		for(t=0;t<picYNum;t++)
		{
			smallDistanceImageYArr.push(t*screen.height/picYNum);
		}
		
	}
	function buildProgress(){

			progress = document.createElement('div');
			progress.id = "progress";
			progress.style.width = progressDiam + "px";
	    	progress.style.height = progressDiam + "px";
	    	progress.style.lineHeight = progressDiam + "px";
	    	progress.style.textAlign = "center";
	    	progress.style.color = progressFgColor;
	    	progress.style.backgroundColor = progressBgColor;
	    	progress.style.borderRadius = progressDiam / 2 + "px";
	    	progress.style.position = "fixed";
	    	progress.style.left = "50%";
	    	progress.style.top = "50%";
	    	progress.style.marginTop = - progressDiam / 2 + "px";
	    	progress.style.marginLeft = - progressDiam / 2 + "px";
	    	progress.style.fontFamily = progressFontFamily;
	    	progress.style.fontSize = progressFontSize;
	    	progress.style.zIndex = 1000;
	    	progress.update = function(num){
	    		var t = picXNum * picYNum;
				progress.innerHTML = currentReNum + "/" + t;
	    	}
			document.body.appendChild(progress);
		}
	function loadReNext(loadedpicX,loadedpicY){
		currentReNum++;
		if (currentReNum < (picXNum * picYNum)) 
		{		
			var img = new Image();
			img.width = 1000;
			img.height = 1000;
			img.listId = currentReNum;
			
			img.src = reimgFolder+ "/" + loadedpicX + "_" + loadedpicY + ".jpg";

			img.onload = function(){
				imgReList[this.listId] = this;
				play();
				if (progress) progress.update(currentReNum);
			}		
		} else if (currentReNum == (picXNum*picYNum)){ 

			if (progress) {
				document.body.removeChild(progress);
				progress = null;
			}
			currentReNum = picXNum*picYNum - 1;	
		}	
	}

	function loadNext(loadedpicX,loadedpicY)
	{
		
		
		if (currentNum < (picXNum * picYNum)) 
		{		
			currentNum++;
			var img = new Image();
			
			img.src = imgFolder+ "/" + loadedpicX + "_" + loadedpicY + ".jpg";

			img.onload = function(){
				if(currentNum<(picXNum * picYNum)) 
					imgReList[currentNum].src = this.src;
				
			}		
		} 

	}

	// function setPlayMode(mode){
	// 	stop();
	// 	config.playMode = mode;
	// }
	
	function play()
	{
		stop();
		document.addEventListener('mousemove', onMouseMove, false);
		document.ontouchmove = function(e){
			onMouseMove(e.touches[0]);
			return false;
		}

	}	

	function stop()
	{
		document.removeEventListener('mousemove', onMouseMove);
		if (playInterval) {
			clearInterval(playInterval);
			playInterval == null;
		}
	}

	function onMouseMove(e)
	{
		mouseXposition = e.pageX;
		mouseYposition = e.pageY;
		var i;
		var indx=0;
		var indy=0;

		for(i=0;i<smallDistanceImageXArr.length;i++)
			{
				if(i+1<smallDistanceImageXArr.length)
				{
					if(mouseXposition > smallDistanceImageXArr[i] && mouseXposition< smallDistanceImageXArr[i+1])
					{
						indx = i;
							
					}
				}

			}
			
		for(i=0;i<smallDistanceImageYArr.length;i++)
			{
				if(i+1<smallDistanceImageYArr.length)
				{
					if(mouseYposition > smallDistanceImageYArr[i] && mouseYposition< smallDistanceImageYArr[i+1])
					{
						indy = i;
					}

				}
			}
		if(mouseXposition < 0 )
		{
			indx = 0;
		}
		if(mouseXposition > smallDistanceImageXArr[length-1])
		{
			indx = smallDistanceImageXArr[length-1];
		}
		if(mouseYposition < 0 )
		{
			indy = 0;
		}
		if(mouseYposition > smallDistanceImageYArr[length-1])
		{
			indy = smallDistanceImageYArr[length-1];
		}		
		console.log(mouseYposition,indx + indy * 50);
		showImage(indx + indy * 50);
		
	}

	function showImage(id)
	{
		if (id >= 0 && id < imgReList.length){
			console.log("id",id);
			var img = imgReList[id];

			ctx.width = img.width;
			ctx.height = img.height;
			ctx.drawImage(img, 0, 0);
		}
		
	}

});