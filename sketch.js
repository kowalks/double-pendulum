function preload() {
//	refresh = loadImage('refresh.png');
}

function setup() {
	createCanvas(1000, 1000);
	controls = createGraphics(100, 100);
	pixelDensity(1);
	pendulum = createGraphics(500, 500);
	pendulum.translate(250, 50);
	frameRate(60);
	plot = createGraphics(500, 250);

	energia = createGraphics(500, 260);

	sliderr1 = createSlider(10, 200, 100);
	sliderr2 = createSlider(10, 200, 100);
	sliderm1 = createSlider(1, 20, 10);
	sliderm2 = createSlider(1, 20, 10);
	slidera1 = createSlider(0, 180, 10);
	slidera2 = createSlider(0, 360, 10);
	sliderg = createSlider(0, 50, 10);
	smallAngle = createButton('Ângulos pequenos');
	largeAngle = createButton('Ângulos grandes');
}

let PI = 3.14159265;

let r1 = 1; let r2 = 1; let m1 = 10; let m2 = 10;
let a1 = 10 * PI / 180; let a2 = 10 * PI / 180;
let a1_v = 0; let a2_v = 0; let a1_a = 0; let a2_a = 0;
let g = 10;
let timestep = 1/60000;
let line1 = [];
let line2 = [];

let cin = [];
let pot = [];
let energyscale = 5;
let veloscale = 5;

function draw() {
	background(255);
	stroke(0);
	strokeWeight(2);

	draw_param();
		for (let i = 0; i < 1000; i++)
			update_pendulum();
	draw_pendulum();
	draw_plot();
	draw_energia();

	//image(refresh, 10, 10, 30, 30);
}

function draw_plot() {
	plot.strokeWeight(1);
	line1.unshift(a1_v);
	line2.unshift(a2_v);
	veloscale = 75/max(max(line1), max(line2));
	if (line1.length > 500){
		line1.pop();
		line2.pop();
	}

	plot.background(255);
	plot.beginShape();
	plot.noFill();
	plot.stroke(10, 100, 100);
	for (let i = 0; i < line1.length; i++)
		plot.vertex(i+40, -veloscale*line1[i]+100);
	plot.endShape();

	plot.beginShape();
	plot.noFill();
	plot.stroke(100, 10, 100);
	for (let i = 0; i < line2.length; i++)
		plot.vertex(i+40, -veloscale*line2[i]+100);
	plot.endShape();

	plot.line(40,10,40,190);
	plot.line(40,100,530, 100);
	plot.fill(10,100,100);
	plot.ellipse(50,200,10,10);
	plot.fill(100,10,100);
	plot.ellipse(50,225,10,10);
	plot.fill(0);
	plot.noStroke();
	plot.text('Massa superior (m1)', 60,205);
	plot.text('Massa inferior (m2)', 60,230);
	plot.text('Velocidade angular ( rad/s ) x Tempo ( s )', 150, 20);
	plot.text((75/veloscale).toPrecision(2), 10, 30);
	plot.text('0.00', 10, 100);
	plot.stroke(0);
	plot.line(38,25,42,25);
	for (let i = 1; i < 8; i++)
		plot.line(40+60*i,98,40+60*i,102);
	image(plot, 500, 0);
}

function draw_energia() {
	energia.strokeWeight(1);
	
	cin.unshift((0.5*m1*a1_v*a1_v*r1*r1 + 0.5*m2*(r1*r1*a1_v*a1_v+r2*r2*a2_v*a2_v+2*r1*r2*a1_v*a2_v*cos(a1-a2))));
	pot.unshift((m1*g*(r1+r2-r1*cos(a1)) + m2*g*(r1+r2-r1*cos(a1)-r2*cos(a2)) - m1*g*r2));
	energyscale = 150/max(max(cin), max(pot));
	if (cin.length > 500){
		cin.pop();
		pot.pop();
	}

	energia.background(255);
	energia.beginShape();
	energia.noFill();
	energia.stroke(10, 100, 100);
	for (let i = 0; i < cin.length; i++) {
		// i+100 é para deslocar 100 unidades p direita
		// wave[i]+100 é pra deslocar 100 unidades p cima
		energia.vertex(i+40, 190-energyscale*cin[i]);
	}
	energia.endShape();

	energia.beginShape();
	energia.noFill();
	energia.stroke(100, 10, 100);
	for (let i = 0; i < pot.length; i++) {
		// i+100 é para deslocar 100 unidades p direita
		// wave[i]+100 é pra deslocar 100 unidades p cima
		energia.vertex(i+40, 190-energyscale*pot[i]);
	}
	energia.endShape();

	energia.beginShape();
	energia.noFill();
	energia.stroke(100, 100, 10);
	for (let i = 0; i < pot.length; i++) {
		// i+100 é para deslocar 100 unidades p direita
		// wave[i]+100 é pra deslocar 100 unidades p cima
		energia.vertex(i+40, 190-energyscale*(pot[i] + cin[i]));
	}
	energia.endShape();
	
	energia.stroke(100);
	energia.line(40,10,40,190);
	energia.line(40,190,530, 190);
	energia.fill(10,100,100);
	energia.ellipse(50,205,10,10);
	energia.fill(100,10,100);
	energia.ellipse(50,225,10,10);
	energia.fill(100,100,10);
	energia.ellipse(50,245,10,10);
	energia.fill(0);
	energia.noStroke();
	energia.text('Energia cinética', 60,210);
	energia.text('Energia potencial', 60,230);
	energia.text('Energia mecânica', 60, 250);
	energia.text('Energia ( J ) x Tempo ( s )', 200, 20);
	energia.text((150/energyscale).toPrecision(3),10,30);
	energia.text('0.00', 10, 190);
	energia.stroke(0);
	energia.line(38,25,42,25);
	for (let i = 1; i < 8; i++)
		energia.line(40+60*i,188,40+60*i,192);
	image(energia, 500, 250);
}


function draw_param() {
	strokeWeight(0);
	sliderr1.position(10, 510);
	sliderr2.position(10, 540);
	sliderm1.position(300, 510);
	sliderm2.position(300, 540);
	slidera1.position(10, 570);
	slidera2.position(10, 600);
	sliderg.position(300, 570);
	sliderr1.input(refresh_pendulum);
	sliderr2.input(refresh_pendulum);
	sliderm1.input(refresh_pendulum);
	sliderm2.input(refresh_pendulum);
	slidera1.input(refresh_pendulum);
	slidera2.input(refresh_pendulum);
	sliderg.input(refresh_pendulum);
	text('r1 (cm): ' + sliderr1.value(), sliderr1.x + sliderr1.width + 20, sliderr1.y+13)
	text('r2 (cm): ' + sliderr2.value(), sliderr2.x + sliderr2.width + 20, sliderr2.y+13)
	text('m1 (kg): ' + sliderm1.value(), sliderm1.x + sliderm1.width + 20, sliderm1.y+13)
	text('m2 (kg): ' + sliderm2.value(), sliderm2.x + sliderm2.width + 20, sliderm2.y+13)
	text('a1 (graus): ' + slidera1.value(), slidera1.x + slidera1.width + 20, slidera1.y+13)
	text('a2 (graus): ' + slidera2.value(), slidera2.x + slidera2.width + 20, slidera2.y+13)
	text('g (m/s^2): ' + sliderg.value(), sliderg.x + sliderg.width + 20, sliderg.y+13);
	
	smallAngle.position(600, 560);
	smallAngle.mousePressed(smallAngles);
	largeAngle.position(800,560);
	largeAngle.mousePressed(largeAngles);
}

function draw_pendulum() {
	pendulum.background(255);
	let pendulumscale = 150;
	let x1 = r1 * sin(a1);
	let y1 = r1 * cos(a1);
	let x2 = x1 + r2 * sin(a2);
	let y2 = y1 + r2 * cos(a2);

	pendulum.stroke(0)
	pendulum.line(0, 0, pendulumscale*x1, pendulumscale*y1);
	pendulum.line(pendulumscale*x1, pendulumscale*y1, pendulumscale*x2, pendulumscale*y2);
	pendulum.fill(0);
	pendulum.ellipse(pendulumscale*x1, pendulumscale*y1, m1, m1);
	pendulum.ellipse(pendulumscale*x2, pendulumscale*y2, m2, m2);

	image(pendulum, 0, 0, 500, 500);
}

function update_pendulum() {
	a1_a = (-g * (2 * m1 + m2) * sin(a1) - m2 * g * sin(a1 - 2 * a2) - 2 * sin(a1 - a2) * m2 * (a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2))) / (r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2)));
	a2_a = (2 * sin(a1 - a2) * (a1_v * a1_v * r1 * (m1 + m2) + g * (m1 + m2) * cos(a1) + a2_v * a2_v * r2 * m2 * cos(a1 - a2))) / (r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2)));
	a1_v += a1_a*timestep;
	a2_v += a2_a*timestep;
	a1 += a1_v*timestep;
	a2 += a2_v*timestep;
}

function smallAngles() {
	slidera1.value(10);
	slidera2.value(10);
	refresh_pendulum();
}

function largeAngles() {
	slidera1.value(60);
	slidera2.value(120);
	refresh_pendulum();
}

function refresh_pendulum() {
	r1 = sliderr1.value() / 100;
	r2 = sliderr2.value() / 100;
	m1 = sliderm1.value();
	m2 = sliderm2.value();
	a1 = slidera1.value() * PI / 180;
	a2 = slidera2.value() * PI / 180;
	g = sliderg.value();
	a1_v = 0;
	a2_v = 0;
	a1_a = 0;
	a2_a = 0;
	cin = [];
	pot = [];
	line1=[];
	line2=[];
}

/*
// adiciona 300*a1_v para o começo do array wave
wavev1.unshift(300*a1_v);
	
// desenha uma linha conectando os pontos da wave
// isso serve pra linha do gráfico ficar "contínua"
beginShape();
noFill();
for (let i = 0; i < wavev1.length; i++) {
	// i+100 é para deslocar 100 unidades p direita
	// wave[i]+100 é pra deslocar 100 unidades p cima
	vertex(i+100, wavev1[i]+100);
}
endShape();

// para apagar o "final" do gráfico que não é mais visível
if (wavev1.length > 400) {
	wavev1.pop();
} */
