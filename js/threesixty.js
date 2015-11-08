
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
		ready,
		deltaX = 0,
		monitorStartTime = 0,
		monitorInt = 10,
		ticker = 0,
		speedMultiplier = 5,
		monitorStartTime = 0,
		mouseStartXposition,
		mouseSEndXposition,
		mouseYposition,
		indx=0,
		indy=0,
		endCol=0,
		currentCol=0,
		totalCols = 0,

		cloudURLPath="http://res.cloudinary.com/diiseuaat/image/upload/",
		cloudURLUserPath="v1446938651/test/",
		urlParameters_small="c_scale,q_80,w_600/",

		progressbar = $( "#progress" ),
      	progressLabel = $( ".progress-label" ),

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
		totalCols = _picXNum;
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
		
		buildProgress();

		// for(t=0;t<picXNum;t++)
		// {
		// 	smallDistanceImageXArr.push(parseInt(c.getBoundingClientRect().left) + t*c.width/picXNum);
		// }
		for(t=0;t<picYNum;t++)
		{
			smallDistanceImageYArr.push(200 + t*c.height/picYNum);
		}
		
		loadFirstImage();
		
	}
	function buildProgress(){
			
			$('#progress').height(30);
			progressbar.progressbar({
		      value: false,
		      change: function() {
		        progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		      },
		      complete: function() {
		        progressLabel.text( "Complete!" );
		      }
		    });
			
		}
	function loadFirstImage()
	{
		var img = new Image();
		img.width = 600;
		img.height = 600;
		img.listId = currentFirstRNum;
		img.src = cloudURLPath + urlParameters_small + cloudURLUserPath + "/0_0.jpg";
		
		img.onload = function(){
			imgReList[currentFirstRNum] = img;
			ctx.width = img.width;
			ctx.height = img.height;
			ctx.drawImage(img, 0, 0);

			// $.ajax({ url: 'compressingFirstGroup.php',
			// 	type: 'post',
			// 	success: function(data) {
				
			// 		if(data!="skip")
			// 		{
			// 			firstRoundNum = data;
			// 			//progressbar.progressbar( "value", Math.floor(currentFirstRNum/firstRoundNum*100));
			// 			progressLabel.text( progressbar.progressbar(Math.floor(currentFirstRNum/firstRoundNum*100)) + "%" );
			// 			//if (progress) progress.update("低精图加载：",currentFirstRNum,firstRoundNum);

						loadFirstRound(0);
			// 		}
			// 		else
			// 		{
						
				// 	}


					
				// }
				
			//});
		};
	}
	function loadAllReImages()
	{
		for(var i=0;i<9;i++)
		{
			for(var j=0;j<50;j++)
			{
				var img = new Image();
				img.width = 600;
				img.height = 60;
				img.listId = 50*i + j;
				img.src = cloudURLPath + urlParameters_small + cloudURLUserPath + i + "_" + j + ".jpg";
				img.onload = function(){
					if(this.listId != 449)
					{
						imgReList[this.listId] = this;

						progressLabel.text( Math.floor(this.listId/449*100) + "%" );
					}
					else
					{
						$('#progress').hide();
						// var t;
						// var k;
						// for(t=0;t<9;t++)
						// {
						// 	for(k=0;k<50;k++)
						// 	{
						// 		var img = new Image();
						// 		img.width = 600;
						// 		img.height = 600;
						// 		img.src = "images/" + t + "_" + k + ".jpg";
						// 		img.listId = 50*t + k;
						// 		img.onload = function(){
									
						// 			imgReList[this.listId]= this;
						// 			if (progress) progress.update("高精图加载：",this.listId,imgReList.length);
									

						// 		};
								
						// 	}
						// }
						// if (progress) {
						// 				document.body.removeChild(progress);
						// 				progress = null;
						// 			}
						
						
					}
					play();
				}
			}
		}
	}
	function loadFirstRound(roundNum){
		if(roundNum!=0)
		{
			firstRoundNum=roundNum;
		}
		currentFirstRNum++;
			
		if (currentFirstRNum < firstRoundNum) 
		{		

			var img = new Image();
			img.width = 600;
			img.height = 600;
			img.listId = currentFirstRNum;
			
			img.src = cloudURLPath + urlParameters_small + cloudURLUserPath + "/0_" + currentFirstRNum + ".jpg";
			
			img.onload = function(){
				imgReList[this.listId] = this;
				progressLabel.text( Math.floor(currentFirstRNum/firstRoundNum) + "%" );
				loadFirstRound(roundNum);

				play();
				
				

				

			};		
		} else if (currentFirstRNum == firstRoundNum){ 
			// $.ajax({ url: 'compressingSecondGroup.php',
			// 		type: 'post',
			// 		success: function(data) {
			// 				if(data!="skip")
			// 				{
			// 					var picX= data.substr(2,data.length-2);
			// 					var picY = data.substr(0,1);
			// 					SecondRoundNum = picX * picY;

			// 					loadSecondRound(0);
			// 				}
			// 				else
			// 				{
								loadSecondRound(400);
							// }
						}			

			currentFirstRNum = firstRoundNum - 1;	
			
			
		}	
	}	
	function loadSecondRound(roundNum){
		
		if(roundNum !=0)
		{
			SecondRoundNum = roundNum;
		}	
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
			img.width = 600;
			img.height = 600;
			img.listId = currentFirstRNum + currentSecondRNum;
			if(SecondRoundPicY<9)
				img.src = reimgFolder+ "/" + SecondRoundPicY + "_" + SecondRoundPicX + ".jpg";
			
			img.onload = function(){
				imgReList[this.listId] = this;

				loadSecondRound(roundNum);
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
				
				if (progress) progress.update("高精图加载：",currentNum,picXNum * picYNum);
				

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
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.ontouchmove = function(e){
			onMouseMove(e.touches[0]);
			return false;
		};

	}	

	function stop()
	{
		document.removeEventListener('mousemove', onMouseMove, true);
		document.removeEventListener('mousedown', onMouseDown, true);
		document.removeEventListener('mouseup', onMouseUp, true);
		if (playInterval) {
			clearInterval(playInterval);
			playInterval = null;
		}
	}
	function onMouseUp(e)
	{
		ready = false;
	}
	
	function onMouseDown(e)
	{
		ready = true;

		e.preventDefault();
		mouseStartXposition = e.pageX;
	}
	function refresh () {

		if (ticker === 0) {

			ticker = self.setInterval(render, Math.round(1000 / 60));
		}
	}
	function render()
	{
		if(currentCol !== endCol)
		{	
			var frameEasing = endCol < currentCol ? Math.floor((endCol - currentCol) * 0.1) : Math.ceil((endCol - currentCol) * 0.1);
			
			currentCol += frameEasing;

			indx = getNormalizedCurrentFrame();

			showImage(indx + indy * 50);
			
		} else {
					
			window.clearInterval(ticker);
			ticker = 0;
		}
	}
	function getNormalizedCurrentFrame() {
		var c = -Math.ceil(currentCol % totalCols);
		if (c < 0) c += (totalCols - 1);
		return c;
	}
	function trackPointer(e) {
		if(ready)
		{

			mouseEndXposition = e.pageX;
			mouseYposition = e.clientY;
			
			if(monitorStartTime < new Date().getTime() - monitorInt) {
				var i;
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

				deltaX = mouseEndXposition - mouseStartXposition;
				
				endCol = currentCol + Math.ceil((totalCols - 1) * speedMultiplier * (deltaX / document.body.clientWidth));

				refresh();

				
				

				monitorStartTime = new Date().getTime();
				
				mouseStartXposition = e.pageX;

				
			}
	
			
			// for(i=0;i<smallDistanceImageXArr.length;i++)
			// 	{
			// 		if(i+1<smallDistanceImageXArr.length)
			// 		{
			// 			if(mouseXposition > smallDistanceImageXArr[i] && mouseXposition< smallDistanceImageXArr[i+1])
			// 			{

			// 				indx = i;
			// 			}
			// 		}

			// 	}
			
			
		}
	}
	function onMouseMove(e)
	{
		
		e.preventDefault();
		trackPointer(e);
		
		
	}

	function showImage(id)
	{
		if (id >= 0 && id < imgReList.length){
			var img = imgReList[id];
<<<<<<< HEAD

=======
	
>>>>>>> origin/master
			ctx.width = img.width;
			ctx.height = img.height;
			ctx.drawImage(img, 0, 0);
		}
		
	}

});
