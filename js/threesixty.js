
$(document).ready(function () {
	
	var c,
		ctx,
		picXNum,
		picYNum,
		loadedpicX=0,
		loadedpicY=0,
		firstRoundNum = 0,
		SecondRoundNum =0,
		SecondRoundPicX = 0,
		SecondRoundPicY = 0,
		currentNum=0,
		currentFirstRNum=0,
		currentSecondRNum=0,
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
		
		var t;
		

		for(t=0;t<picXNum;t++)
		{
			smallDistanceImageXArr.push(t*window.innerWidth/picXNum);
		}
		for(t=0;t<picYNum;t++)
		{
			smallDistanceImageYArr.push(300+t*window.innerHeight/picYNum);
		}
		loadFirstImage();
		
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
	    	progress.style.top = "10%";
	    	progress.style.marginTop = - progressDiam / 2 + "px";
	    	progress.style.marginLeft = - progressDiam / 2 + "px";
	    	progress.style.fontFamily = progressFontFamily;
	    	progress.style.fontSize = progressFontSize;
	    	progress.style.zIndex = 1000;
	    	progress.update = function(message,num,totalnum){
	    		
				progress.innerHTML = message + Math.floor(num/totalnum*100) + "%";
				
	    	};
			document.body.appendChild(progress);
		}
	function loadFirstImage()
	{
		var img = new Image();
		img.width = 1000;
		img.height = 1000;
		img.listId = currentFirstRNum;
		img.src = reimgFolder+ "/0_0.jpg";
		
		img.onload = function(){
			imgReList[currentFirstRNum] = img;
			ctx.width = img.width;
			ctx.height = img.height;
			ctx.drawImage(img, 0, 0);

			$.ajax({ url: 'compressingFirstGroup.php',
				type: 'post',
				success: function(data) {
					buildProgress();
					firstRoundNum = data;
					
					if (progress) progress.update("第一段加载：",currentFirstRNum,firstRoundNum);

					loadFirstRound();

					$.ajax({ url: 'compressingSecondGroup.php',
					type: 'post',
					success: function(data) {
							var picX= data.substr(2,data.length-2);
							var picY = data.substr(0,1);
							SecondRoundNum = picX * picY;

							loadSecondRound();
						}
					});
				}
				
			});
		};
	}
	function loadFirstRound(){

		currentFirstRNum++;
			
		if (currentFirstRNum < firstRoundNum) 
		{		

			var img = new Image();
			img.width = 1000;
			img.height = 1000;
			img.listId = currentFirstRNum;
			
			img.src = reimgFolder+ "/0_" + currentFirstRNum + ".jpg";
			
			img.onload = function(){
				imgReList[this.listId] = this;
				if (progress) progress.update("第一段加载：",currentFirstRNum,firstRoundNum);
				loadFirstRound();

				play();
				
				

				

			};		
		} else if (currentFirstRNum == firstRoundNum){ 

			

			//currentFirstRNum = firstRoundNum - 1;	
			
			
		}	
	}	
	function loadSecondRound(){
		
		if(SecondRoundPicY<9)
		{

			if(SecondRoundPicX<49)
			{
				SecondRoundPicX++;
			}
			else
			{
				SecondRoundPicX=0;
				SecondRoundPicY++;
			}
		}
		
		currentSecondRNum++;
		if (currentSecondRNum < SecondRoundNum) 
		{		
			var img = new Image();
			img.width = 1000;
			img.height = 1000;
			img.listId = currentFirstRNum + currentSecondRNum;
			if(SecondRoundPicY<9)
				img.src = reimgFolder+ "/" + SecondRoundPicY + "_" + SecondRoundPicX + ".jpg";
			
			img.onload = function(){
				imgReList[this.listId] = this;

				loadSecondRound();
				//play();
				if (progress) progress.update("第二段加载：",parseInt(currentFirstRNum) + parseInt(currentSecondRNum),parseInt(firstRoundNum) + parseInt(SecondRoundNum));
				
			};		
		} else if (currentSecondRNum == SecondRoundNum){ 

			
			//currentSecondRNum = SecondRoundNum - 1;	

			
			var i;
			var j;
			for(i=0;i<9;i++)
			{
				for(j=0;j<50;j++)
				{
					loadNext(i,j);
				}
			}
			
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

				if (progress) progress.update("第三段加载：",currentNum,picXNum * picYNum);
				

			};		
		} 
		
		if(currentNum == (picXNum * picYNum-1))
		{
			if (progress) {
				document.body.removeChild(progress);
				progress = null;
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
		};

	}	

	function stop()
	{
		document.removeEventListener('mousemove', onMouseMove);
		if (playInterval) {
			clearInterval(playInterval);
			playInterval = null;
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

		showImage(indx + indy * 50);
		
	}

	function showImage(id)
	{
		if (id >= 0 && id < imgReList.length){
			var img = imgReList[id];

			ctx.width = img.width;
			ctx.height = img.height;
			ctx.drawImage(img, 0, 0);
		}
		
	}

});
