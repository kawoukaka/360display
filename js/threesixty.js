
$(document).ready(function () {
	
	var c,
		ctx,
		picXNum,
		picYNum,
		loadedpicX=0,
		loadedpicY=0,

		currentNum=0,

		numberOfImg,
		imgFolder,

		progress,

		laneList = [],
		imgReList = [],

		playInterval = 20,
		ready,
		deltaX = 0,
		deltaY = 0,
		monitorStartTime = 0,
		monitorInt = 10,
		ticker = 0,
		speedMultiplier = 5,
		mouseStartXposition,
		mouseSEndXposition,
		mouseStartYposition,
		mouseSEndYposition,
		indx=0,
		indy=0,
		endCol=0,
		currentCol=0,
		totalCols = 0,
		endRow=0,
		currentRow=0,
		totalRows = 0,
		timer,
		countTime = 0,
		totalSize = 0;
		//cloudURLPath="http://res.cloudinary.com/diiseuaat/image/upload/",
		//cloudURLUserPath="v1446938651/test/",
		//urlParameters_small="c_scale,q_80,w_600/",

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
	
	
	initSetting();
    
	function initSetting()
	{
		timer=setTimeout(countDownloadTime(),1000);
		$('#leftArrow').hide();
		$('#rightArrow').hide();
		$('#upArrow').hide();
		$('#downArrow').hide();
		
	}
	function getSizeOfImage(file)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('HEAD', file, true);
		xhr.onreadystatechange = function(){
		  if ( xhr.readyState == 4 ) {
		    if ( xhr.status == 200 ) {
		       totalSize += parseInt(xhr.getResponseHeader('Content-Length'));
		      
		    } else {
		       console.log("error");
		    }
		  }
		};
		xhr.send(null);
	}
	function countDownloadTime()
	{
		countTime++;
	}
	$('#apply' ).click(function() {
		
		//progressbar.hide();
		
		totalCols = $("#numImages option:selected").val();
		var i = 0;
		$(':checkbox:checked').each(function(i){
			laneList[i] = $(this).val();
        });
		totalRows = laneList.length;

        init("images");
    });
    $('#reset' ).click(function() {
    	location.reload();
		
    });
	function init(_folder)
	{
		imgFolder= _folder;

		c = document.getElementById('myCanvas');
		ctx = c.getContext('2d');
		
		document.body.style.margin ="0";
		document.body.style.padding ="0";
		document.body.style.overflow = "hidden"; //canvas is a few pixels taller than innerHeight… (?)			
		
		$('#leftArrow').hide();
		$('#rightArrow').hide();
		$('#upArrow').hide();
		$('#downArrow').hide();
		buildProgress();
		
		loadImages();
	}
	function buildProgress(){
			progressbar.height(30);
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
	function loadImages()
	{
		for(var i=0;i<totalRows;i++)
		{
				for(var j=0;j<totalCols;j++)
				{
					var img = new Image();
					img.width = 600;
					img.height = 600;
					img.listId = totalCols*i + j;
					img.src = imgFolder + "/" + laneList[i] + "_" + j + ".jpg";
					img.onload = function(){
						if(this.listId != (totalRows * totalCols -1))
						{
							imgReList[this.listId] = this;
							progressbar.progressbar( "value", Math.floor(this.listId/totalRows * totalCols*100));
							progressLabel.text("加载了：" +  Math.floor(this.listId/totalRows * totalCols*100) + "%" );
							getSizeOfImage(this.src);
							console.log(this.listId,totalRows * totalCols);
						}
						else
						{
							play();
							clearTimeout(timer);
							//progressbar.hide()
							progressbar.progressbar( "value",0);
							progressLabel.text("下载用时" + countTime + "秒 || 下载了" + Math.floor(totalSize/1024) + "KB文件");
							$('#leftArrow').hide();
							$('#rightArrow').hide();
							$('#upArrow').hide();
							$('#downArrow').hide();
						}
						
					}
				}
			}
	}
	

	
	
	function play()
	{
		stop();
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('mousedown', onMouseDown, false);
		document.addEventListener('mouseup', onMouseUp, false);
		document.addEventListener('touchstart', onTouchStart, false);
		document.addEventListener('touchmove', onTouchMove, false);
		document.addEventListener('touchend', onTouchEnd, false);
		

	}	

	function stop()
	{
		document.removeEventListener('mousemove', onMouseMove, true);
		document.removeEventListener('mousedown', onMouseDown, true);
		document.removeEventListener('mouseup', onMouseUp, true);
		document.removeEventListener('touchstart', onTouchStart, true);
		document.removeEventListener('touchmove', onTouchMove, true);
		document.removeEventListener('touchend', onTouchEnd, true);
		if (playInterval) {
			clearInterval(playInterval);
			playInterval = null;
		}
	}
	function getPointerEvent(e) {
		return e.touches ? e.touches[0] : e;
	};
	function onTouchStart(e){
		
		e.preventDefault();
		mouseStartXposition = getPointerEvent(e).pageX;
		mouseStartYposition = getPointerEvent(e).pageY;
		ready = true;
	}
	
	
	function onTouchMove(e){
		e.preventDefault();
		trackPointer(e);
	}
	
	
	function onTouchEnd(e){
		e.preventDefault();
		ready = false;
	}

	function onMouseUp(e)
	{
		ready = false;
	}
	
	function onMouseDown(e)
	{
		e.preventDefault();
		mouseStartXposition = getPointerEvent(e).pageX;
		mouseStartYposition = getPointerEvent(e).pageY;
		
		ready = true;
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
			var frameEasingX = endCol < currentCol ? Math.floor((endCol - currentCol) * 0.1) : Math.ceil((endCol - currentCol) * 0.1);
			
			currentCol += frameEasingX;
			
			indx = getNormalizedCurrentXFrame();

			showImage(indx + indy * totalCols);
			
		} else {
					
			window.clearInterval(ticker);
			ticker = 0;
		}
	}
	function getNormalizedCurrentXFrame() {
		var c = -Math.ceil(currentCol % totalCols);
		if (c < 0) c += (totalCols - 1);
		return c;
	}
	
	function trackPointer(e) {
		if(ready)
		{
			var nddY,angle;
			mouseEndXposition = getPointerEvent(e).pageX;
			
			mouseEndYposition = getPointerEvent(e).pageY;
			
			if(monitorStartTime < new Date().getTime() - monitorInt) {
				

				deltaX = mouseEndXposition - mouseStartXposition;
				deltaY = mouseEndYposition - mouseStartYposition;

				endCol = currentCol + Math.ceil((totalCols - 1) * speedMultiplier * (deltaX / document.body.clientWidth));

				nddY = deltaY / 600;

				angle = Math.PI / 2;

			    var sn = Math.sin(angle);
			    var cs = Math.cos(angle);
			    var y = nddY * sn + nddY * cs;
			    currentRow += totalRows * y;
			   

			  	indy = Math.floor(Math.min(currentRow, totalRows));
			    indy = Math.floor(Math.max(currentRow, 0));
			    
				refresh();
				
				showImage(indx + indy * totalCols);
				monitorStartTime = new Date().getTime();
				
				mouseStartXposition = getPointerEvent(e).pageX;
				mouseStartYposition = getPointerEvent(e).pageY;
				
			}
	
			
			
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
				if(img && img.complete !== false)
				{
					ctx.clearRect(0, 0, img.width, img.height);
					ctx.width = img.width;
					ctx.height = img.height;
					ctx.drawImage(img, 0, 0);
				}
		}
		
	}

});
