window.addEventListener("load", () => {
	const canvas = document.querySelector("#canvas");
	const clearButton = document.querySelector("#clear");
	const saveButton = document.querySelector("#savePic");
	const imgSource = document.querySelector("#exampleFormControlFile1");
	const output = document.querySelector("#output");
	const ctx = canvas.getContext('2d');

	const img = new Image();
	// img.src = "assets/images/IMG_1427.JPG";

	imgSource.addEventListener('change', (e) => {
		console.log(imgSource);
		console.log(e);
		var reader = new FileReader();
		reader.onload = function (e) {
			img.src = e.target.result;
		}
		reader.readAsDataURL(e.target.files[0]);
		$('#drawmodal').modal({"backdrop":"static"});
	});

	img.onload = () => {
		const [img_scaled_width, img_scaled_height] = drawImageToScale(img, ctx);
		canvas.width = img_scaled_width;
		canvas.height = img_scaled_height;
		window.addEventListener('resize', drawImageToScale(img,ctx));
	}

	// eventListeners
	canvas.addEventListener("mousedown", startPosition);
	canvas.addEventListener("mouseup", endPosition);
	canvas.addEventListener("mousemove", draw);
	canvas.addEventListener("touchstart", startPosition);
	canvas.addEventListener("touchend", endPosition);
	canvas.addEventListener("touchmove", draw);

	let painting = false;
	let imgsize;

	function startPosition(e){
		painting = true;
		draw(e);
	}

	function endPosition(){
		painting = false;
		ctx.beginPath();
	}

	function draw(e){
		if (!painting)
			return;
		ctx.lineWidth = 10;
		ctx.lineCap = 'round';
		ctx.strokeStyle = "#000000";

		let pos;
		if(e.type.match(/touch/)){
			pos = getpos(canvas,e.changedTouches[0].clientX,e.changedTouches[0].clientY);
		}else{
			pos = getpos(canvas, e.clientX , e.clientY);
		}


		ctx.lineTo(pos.x, pos.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(pos.x, pos.y);
	}

	function getpos(canvas,x,y) {
		var rect = canvas.getBoundingClientRect();
		return {
		  x: x - rect.left,
		  y: y - rect.top
		};
	}

	clearButton.addEventListener('click', () => clearCanvas(img, ctx, canvas.width, canvas.height));
	saveButton.addEventListener('click', () => saveCanvas(canvas,output));
	// blackButton.addEventListener('click', () => );
	// whiteButton.addEventListener('click', () => ctx.strokeStyle = "#ffffff");

});

function drawImageToScale(img, ctx){
	const img_width = 300;
	const scaleFactor = img_width / img.width;
	const img_height = img.height * scaleFactor;
	ctx.drawImage(img, 0 , 0, img_width, img_height);
	return [img_width, img_height];
}

function clearCanvas(img, ctx, img_scaled_width, img_scaled_height){
	ctx.clearRect(0, 0, img_scaled_width, img_scaled_height);
	drawImageToScale(img,ctx);
}

function saveCanvas(canvas , outputDOM){
	let base64 = canvas.toDataURL();
	outputDOM.src = base64;
	$('#drawmodal').modal('hide');
}
