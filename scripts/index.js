//check for suggestions, else open the app
if ($k.UA.short==='IE' && $k.UA.version<9 || $k.UA.short==='O' && $k.UA.version<10.5 ||
	$k.UA.short==='FF' && $k.UA.version<4 || $k.UA.short==='CH' && $k.UA.version<4 ||
	$k.UA.short==='S' && $k.UA.version<4 || ($k.UA.short!=='IE' && $k.UA.short!=='O' && $k.UA.short!=='FF' && $k.UA.short!=='CH' && $k.UA.short!=='S')) {
	$k('#suggestions').css('padding', '0px');
	$k('#outdated-browser').css('display', 'block');
}
else {

	//used for scrolling, body if webkit and html else
	body=(($k.UA.short==='CH' || $k.UA.short==='S') ? $k('body')[0] : $k('html')[0]);
	bodyWidth=$k('#layer-bg')[0].width;
	windowWidth=window.innerWidth;

	//used for layer toggling
	layer=1;

	//quick access
	elev=$k('#elev')[0];
	
	$k('#loader').css('display', 'table-cell');

	//iterations from animations
	iterations={
		elev: 0,
		wave: 0,
		tutorial: 0
	};
	waving=true;
	tutorial=true;
	elevImageSet=false;

	//list of image sources
	imgs=[
		'imgs/elev/elev-profil-v.png',
		'imgs/arrows.png',
		'imgs/elev/elev-wave-v.png',
		'imgs/lever.png',
		'imgs/Sageata.png',
		
	];
	$k('.init').on('click', askForName, false);
	
	//preload resources
	preload();
}

function preload() {
	var a, i, str;
	function loadedImg() {
		imgs.remove(this);
		var nrlimg=imgs.len-imgs.length;
		$k('#bar').css('width', Math.round(100*nrlimg/imgs.len)+'%');
		$k('#bar')[0].innerHTML=Math.round(100*nrlimg/imgs.len)+'%';
		if (imgs.length===0) {
			askForName();
		}
	}
	imgs.push($k('#layer-bg')[0]);
	imgs.len=imgs.length;
	for (i=0; i<imgs.length; i++) {
		if (typeof imgs[i]==='string') {
			a=new Image();
			str=imgs[i];
			a.src=str;
			imgs[i]=a;
		}
		$k(imgs[i]).on('load', loadedImg, false);
	}
}
function askForName() {
	$k('#loader').css('display', 'none');
	$k('#name').css('display', 'table-cell');
	$k('#name-check').on('click', nameCheck, false);
	$k('#name-input').on('keyup', function (ev) {
		if (ev.keyCode===13) {
			nameCheck();
		}
	}, false);
}
function nameCheck() {
	var val=$k('#name-input')[0].value, sel, i;
	if (val!=='') {
		sel=$k('.nu');
		for (i=0; i<sel.length; i++) {
			sel[i].innerHTML=val;
		}
		init();
	}
}
function init() {
	
	//hide the suggestions
	$k('#suggestions').css('z-index', '-1');
	
	//show scrollbar
	$k('body, html, #suggestions').css('overflow-x', 'scroll');
	
	//start layer toggling
	$k('#lever').on('click', toggleLayers, false);
	
	//add keyboard+ events
	$k(window).on('keydown', function (event) {
		event.preventDefault();
		window.keydown=event.keyCode;
	}, false);
	$k(window).on('keyup', function () {
		window.keydown=false;
	}, false);
	$k('.tg-tut').on('click', toggleTutorial, false);
	$k('.skip').on('click', toggleTutorial, false);
	$k('.next').on('click', turnTutorialPage, false);
	
	//start updating the scene
	interval=setInterval(update, 40);
}
function turnTutorialPage() {
	var a=$k('#tutorial>div').css('display', 'none');
	if (a[iterations.tutorial+1]) {
		a[iterations.tutorial+1].style.display='block';
	}
	iterations.tutorial++;
}
function toggleTutorial() {
	if (tutorial) {
		$k('#tutorial>*').css('display', 'none');
		tutorial=false;
	}
	else {
		
		//show balloon
		$k('#lever-arrow').css('display', 'block');
		$k('#tutorial>div:first-of-type').css('display', 'block');
		iterations.tutorial=0;
		
		//make him wave
		elev.style.backgroundImage='url(imgs/elev/elev-wave-v.png)';
		iterations.wave=0;
		waving=true;
		elevImageSet=false;
		tutorial=true;
	}
}
function wave() {
	if (iterations.wave<46) {
		elev.style.backgroundPosition='0px '+iterations.wave*351+'px';
		iterations.wave++;
	}
	else {
		waving=false;
	}
}
function toggleLayers() {
	if (layer===1) {
		$k('#lever').css('background-position', '0px 167px');
		$k('#layer-back')[0].className='pos2';
		layer=2;
	}
	else {
		$k('#lever').css('background-position', '0px 0px');
		$k('#layer-back')[0].className='pos1';
		layer=1;
	}
};

//move the elev
function moveRight() {
	windowWidth=window.innerWidth;
	iterations.elev++;
	if (iterations.elev>28) {
		iterations.elev=0;
	}
	body.scrollLeft+=30;
	if (body.scrollLeft<(bodyWidth-windowWidth)) {
		elev.style.backgroundPosition='0px '+iterations.elev*350+'px';
	}
	else {
		standGround();
	}
	elev.className='';
}
function moveLeft() {
	iterations.elev++;
	if (iterations.elev>28) {
		iterations.elev=0;
	}
	body.scrollLeft-=30;
	if (body.scrollLeft>0) {
		elev.style.backgroundPosition='0px '+iterations.elev*350+'px';
	}
	else {
		standGround();
	}
	elev.className='flipped';
}
function standGround() {
	iterations.elev=0;
	elev.style.backgroundPosition='0px 0px';
}

//update all
function update() {
	bodyWidth=$k('#layer-bg')[0].width;
	$k('#layer1').css('width', bodyWidth+'px');
	if (waving) {
		wave();
	}
	else {
		if (!elevImageSet) {
			elev.style.backgroundImage='url(imgs/elev/elev-profil-v.png)';
			elevImageSet=true;
		}
		if (window.keydown===39) {
			moveRight();
		}
		else if (window.keydown===37) {
			moveLeft();
		}
		else {
			standGround();
		}
	}
}