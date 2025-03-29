// jatekterulet
let game_area;
// jatekterulet szelessege, hosszusaga
let ga_width, ga_height;

// ellenseg
let enemy;
// tomb az ellensegnek
let enemy_array = [];
// a megjelenitendo ellenseg kezdo x koordinataja
let start_ex = 100;
// a megjelenitendo ellenseg kezdo y koordinataja
let start_ey = 100;
// a megjelenitendo ellenseg vég ys koordinataja
let end_ey = 500;
// megjelenitendo ellenseg szama
let enemy_num = 10;
// az ellenseg szelessege
let offset_x = (end_ey - start_ey) / enemy_num;

// urhajp
let defender;
// az urhajo szelessege, magassaga
let def_width = offset_x, def_height;
// az urhajo elmozdulasanak merteke
let move_step = def_width / 2;

// ismetlodo fuggveny
let mov_int;

$(document).ready(function () {
    game_area= $('#gamearea');
    defender = $('<img src="def.png" id="defender">');
    enemy = $('<img src="enemy.png">');

    // urhajo hozzaadasa a jatekterhez
    game_area.append(defender);
    // a jatekter szelessegenek lekerdezese
    ga_width = parseInt(game_area.css('width'));
    // a jatekter magassaganak lekerdezese
    ga_height = parseInt(game_area.css('height'));


});