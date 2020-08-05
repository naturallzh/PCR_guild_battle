function globalInit() {
	if (!localStorage.getItem('showBgAnime')) {
		localStorage.setItem('showBgAnime','1');
	}
	if (localStorage.getItem('showBgAnime')==='1') {
		getEl('bg-anime').style.display = 'block';
	}
	else {
		getEl('bg-anime').style.display = 'none';
	}
}
globalInit();

function getEl(id) {
	return document.getElementById(id);
}

function addClass(el, classList) {
	for (let i=0;i<classList.length;i++) {
		el.classList.add(classList[i]);
	}
}

function removeClass(el, classList) {
	for (let i=0;i<classList.length;i++) {
		el.classList.remove(classList[i]);
	}
}

function addZero(num) {
	num = parseInt(num);
	if (num<10) {return '0'+num}
	else {return ''+num}
}
function removeZero(num) {
	return ''+parseInt(num);
}
function checkPosInt(num) {
	if (num==parseInt(num)) {
		num = parseInt(num);
	}
	else {return false}
	let flag = true;
	flag = flag && num>0;
	return flag;
}

function calcCombineRes (remainH, damageA, damageB) {
	const ansArr = ['--','--']
	let flag = checkPosInt(remainH) && checkPosInt(damageA) && checkPosInt(damageB);
	if (flag) {
		remainH = parseInt(remainH);
		damageA = parseInt(damageA);
		damageB = parseInt(damageB);
	}
	else {return ansArr}
	flag = flag && (remainH < damageA+damageB);
	flag = flag && (remainH > damageA) && (remainH > damageB);
	if (flag) {
		let num1 = Math.ceil(100 - ((remainH-damageA) / damageB) * 90);
		if (num1>90) {num1=90}
		let num2 = Math.ceil(100 - ((remainH-damageB) / damageA) * 90);
		if (num2>90) {num2=90}
		return [num1+'',num2+''];
	}
	else {return ansArr}
}
