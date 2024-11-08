<!--

//----------------------------------------------------------------------------------------------------
// Глобальные переменные для меню миниатюр
//----------------------------------------------------------------------------------------------------

const wallpaper_name = 'album_folder/img/wallpaper.png'; //путь и имя фонового изображения
const thumb_folder = 'album_folder/photo/thumbs/';       // папка с миниатюрами
const photo_folder = 'album_folder/photo/';              // папка с фотографиями

const amount_photo = 82 //количество фотографий
var loaded_thumb = 10;   //последняя загруженная фотография

var prev_thumb = '000';  //предыдущая миниатюра

var show_tab = 0;        //видимая плашка

var window_width;  //ширина окна браузера
var window_height; //высота окна браузера

//----------------------------------------------------------------------------------------------------
// Вспомогательные функции (общие для проекта)
//----------------------------------------------------------------------------------------------------

//Высота и ширина окна браузера

function window_size(option)
{
    if (option == 'width')
    {
        if (window.innerWidth) return window.innerWidth;
        if (document.body.clientWidth) return document.body.clientWidth;
    }
    if (option == 'height')
    {
        if (window.innerHeight) return window.innerHeight;
        if (document.body.clientHeight) return document.body.clientHeight;
    }
}

//Свойство элемента по id

function get_property(elem_id, option)
{
    const elem_rect = document.getElementById(elem_id).getBoundingClientRect();

    const get_prop = elem_rect[option];
    return get_prop;
}

//Преобразование номера миниатюры в строку для формирования ID

function string_id(numb_val)
{
    var new_id = '00' + numb_val;

    if (numb_val >= 10) new_id = new_id.substring(1);
    if (numb_val >= 100) new_id = new_id.substring(1);

    return new_id;
}

//Преобразование строки из ID в номер миниатюры

function numeric_id(id_val)
{
    var new_num = parseInt(id_val);

    if (new_num == Number.NaN) new_num = 0;

    return new_num;
}

//----------------------------------------------------------------------------------------------------
// Загрузка страницы - функции для onload
//----------------------------------------------------------------------------------------------------

//Запуск функций при изменении размеров окна браузера

window.onresize = () => {set_tabs(); photo_size(); decor_style()};

//Предварительная загрузка фона и заставки фотоальбома

function preload_images()
{
    if (document.images)
    {
        var images = {};

        images['wallpaper'] = new Image();
        images['photocover'] = new Image();

        images['wallpaper'].src = wallpaper_name;
        images['photocover'].src = photo_folder + prev_thumb + '.png';

        document.getElementsByTagName('body')[0].src = images['wallpaper'].src;
        document.getElementById('photo0').src = images['photocover'].src;
    }
}

// Задание положения, прозрачности и видимости сдвоенным элементам tab

function set_tabs()
{
    const hide_tab = -1 * (show_tab - 1);

    document.getElementById('upper_tab' + show_tab).style.top = '30px';
    document.getElementById('upper_tab' + show_tab).style.opacity = 1;
    document.getElementById('upper_tab' + show_tab).style.visibility = 'visible';

    document.getElementById('upper_tab' + hide_tab).style.top = '-100px';
    document.getElementById('upper_tab' + hide_tab).style.opacity = 0;
    document.getElementById('upper_tab' + hide_tab).style.visibility = 'hidden';

    document.getElementById('lower_tab' + show_tab).style.left = '250px';
    document.getElementById('lower_tab' + show_tab).style.opacity = 1;
    document.getElementById('lower_tab' + show_tab).style.visibility = 'visible';

    document.getElementById('lower_tab' + hide_tab).style.left = '200px';
    document.getElementById('lower_tab' + hide_tab).style.opacity = 0;
    document.getElementById('lower_tab' + hide_tab).style.visibility = 'hidden';
}

// Задание размера photo0 и photo1, а также положения lower_tab0 и lower_tab1 в зависимости от размера окна браузера

function photo_size()
{
    window_width = window_size('width');
    window_height = window_size('height');

    const photo_height = window_height <= 220 ? 10 : window_height - 220;
    const lowertab_top = photo_height + 140;

    document.getElementById('lower_tab0').style.top = lowertab_top + 'px';
    document.getElementById('lower_tab1').style.top = lowertab_top + 'px';

    document.getElementById('photo0').style.height = photo_height + 'px';
    document.getElementById('photo1').style.height = photo_height + 'px';

    const photo_ref = document.getElementById('photo1')

    const last_sym = photo_ref.src.length - 3;
    const image_src = photo_ref.src.substr(last_sym);

    photo_ref.style.visibility = image_src == 'png' ? 'visible' : 'hidden';

    tab_text(prev_thumb, 'static');
}

function decor_style()
{
    const body_ref = document.getElementById('wallcont');
 
	const dec_height = Math.floor(window_height * dec_rate);
	const dec_width = Math.floor(img_width * dec_height / img_height);

    const ver_pos = window_height - ver_offset - dec_height;
    const hor_pos = window_width - hor_offset - dec_width;

    var wall_style = 'background-position: ' + hor_pos + 'px ' + ver_pos + 'px, top left;\nbackground-size: ' + dec_width + 'px ' + dec_height +'px, auto;';

    body_ref.style = wall_style;
}

//----------------------------------------------------------------------------------------------------
// Меню миниатюр
//----------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------
// Функция для формирования полосы миниатюр
//----------------------------------------------------------------------------------------------------

//Создание массива из <div><img /></div> для размещения миниатюр

function create_thumbs(total_thumb)
{
    var thumb_html = '';

    for(n = 1; n <= total_thumb; n++)
    {
        var thumb_id = string_id(n);
        thumb_html += '<div class = "thumbnail"><img src = "#" alt = "Фото - ' + n + '" class = "thumbnail" id = "thumb' + thumb_id + '" /></div>\n';
    }
    document.getElementById("scroll_bar").innerHTML = thumb_html;
}

//----------------------------------------------------------------------------------------------------
// Функции для загрузки миниатюр
//----------------------------------------------------------------------------------------------------

//Загрузка миниатюр

function load_thumbs(first_thumb, thumb_count)
{
    const last_thumb = first_thumb + thumb_count - 1;

    for(n = first_thumb; n <= last_thumb; n++)
    {
        const  thumb_id = string_id(n);
        document.getElementById('thumb' + thumb_id).src = thumb_folder + thumb_id + '.png';
    }

    verify_load(first_thumb, thumb_count);
}

//Проверка и ожидание загрузки диапазона миниатюр

function verify_load(first_thumb, thumb_count)
{
    const last_thumb = first_thumb + thumb_count - 1;

    var loaded = 0;
    var n = first_thumb - 1;

    while(loaded < thumb_count)
    {
        n < last_thumb ? n++ : n = first_thumb;

        const thumb_id = string_id(n);
        document.getElementById('thumb' + thumb_id).complete = loaded++;
    }
}

//Подсчет количества отображаемых миниатюр и загрузка недостающих

function thumbs_load(offset_top)
{
    if (loaded_thumb >= amount_photo + 1) return;

    const last_id = string_id(loaded_thumb);
    const last_bottom = get_property('thumb' + last_id, 'bottom') + offset_top;

    if (last_bottom >= window_height) return;

    var ghost_amount = ghost_count(window_height, last_bottom);

    const load_start = loaded_thumb + 1;
    const load_amount = ghost_amount - loaded_thumb + 1;

    loaded_thumb += load_amount;

    load_thumbs(load_start, load_amount);
}

//Подсчет количества недостающих миниатюр

function ghost_count(browser, loaded_but)
{
    const ghost_height = 120;

    var ghost_top = 0;
    var ghost_bottom = loaded_but;

    for(n = loaded_thumb; n <= amount_photo; n++)
    {
        ghost_top = ghost_bottom + 20;
        ghost_bottom = ghost_top + ghost_height;

        if (ghost_bottom >= browser) break;
    }

    return n;
}

//----------------------------------------------------------------------------------------------------
// Основные функции
//----------------------------------------------------------------------------------------------------

//Id выбранной миниатюры и вызов thumb_align

function thumb_click()
{
    var target = event.target;
    var thumb_id = target['id'];

    if (target.tagName != 'IMG') return;

    thumb_align(thumb_id.substring(5));
}

//Расчет расстония от выбранной миниатюры до центра окна (по вертикали) и запуск уравляющей функции

function thumb_align(thumb_id)
{
    if (thumb_id == '000') return;

    const half_browser =  window_height / 2;

    const current_top = get_property('thumb' + thumb_id, 'top');
    const middle_top = Math.floor(half_browser) - 60;

    const offset_top = middle_top - current_top;

    thumb_animation(offset_top);
    photo_control(thumb_id);
}

//Переделы прокрутки полосы с миниатюрами и параметры для CSS-анимации

function thumb_animation(offset_top)
{
    const scroll_top = get_property('scroll_bar', 'top');
    const scroll_bot = get_property('scroll_bar', 'bottom');

    const pos_offset = scroll_top + offset_top;                       //предел при перемещении вниз (для первой миниаютры)
    const neg_offset = scroll_bot + offset_top - window_height + 10; //предел при перемещении вверх (для последней миниаютры)

    if (offset_top > 0)
    {
        if (pos_offset >= 0) offset_top = -scroll_top;
    }

    if (offset_top < 0)
    {
        thumbs_load(offset_top);
        if (neg_offset <= 0) offset_top = window_height - scroll_bot - 10;
    }

    document.getElementById('scroll_bar').style.top = String(scroll_top + offset_top) + 'px';
}

//----------------------------------------------------------------------------------------------------
// Крупное фото
//----------------------------------------------------------------------------------------------------

//Управляющая функция

function photo_control(thumb_id)
{
    tab_text(thumb_id, 'animate');

    upper_CSS('hide');
    upper_CSS('show');

    lower_CSS('hide');
    lower_CSS('show');

    put_photo(thumb_id);

    photo_pos();
    setTimeout(photo_ani, 500);

    show_tab = -1 * (show_tab - 1);
}

//Формирование надписей и установка видимости элементов upper_tab и lower_tab

function tab_text(thumb_id, option)
{
    const tab_mode =  option == 'static' ? show_tab : -1 * (show_tab - 1);

    const photo_index = numeric_id(thumb_id);

    const upper_txt = photolist[photo_index][0];
    const lower_txt = photolist[photo_index][1];

    //Загрузка надписей и установка свойств невидимым элементам

    document.getElementById('upper_text' + tab_mode).innerHTML = upper_txt;
    document.getElementById('lower_text' + tab_mode).innerHTML = lower_txt;

    const upper_ref = document.getElementById('upper_tab' + tab_mode);
    const lower_ref = document.getElementById('lower_tab' + tab_mode);

    upper_txt == '' ? upper_ref.style.visibility = 'hidden' : upper_ref.style.visibility = 'visible';
    lower_txt == '' ? lower_ref.style.visibility = 'hidden' : lower_ref.style.visibility = 'visible';
}

//Изменение CSS свойств upper_plate для анимации

function upper_CSS(option)
{
    const curr_elem = show_tab;
    const next_elem = -1 * (show_tab - 1);

    if (option == 'hide')
    {
        var upper_top = -100;
        var upper_opacity = 0;

        var upper_ref = document.getElementById('upper_tab' + curr_elem);
    }

    if (option == 'show')
    {
        var upper_top = 30;
        var upper_opacity = 1;

        var upper_ref = document.getElementById('upper_tab' + next_elem);
    }

    upper_ref.style.top = upper_top + 'px';
    upper_ref.style.opacity = upper_opacity;
}

//Изменение CSS свойств lower_plate для анимации

function lower_CSS(option)
{
    const curr_elem = show_tab;
    const next_elem = -1 * (show_tab - 1);

    if (option == 'hide')
    {
        var lower_left = 200;
        var lower_opacity = 0;

        var lower_ref = document.getElementById('lower_tab' + curr_elem);
    }

    if (option == 'show')
    {
        var lower_left = 250;
        var lower_opacity = 1;

        var lower_ref = document.getElementById('lower_tab' + next_elem);
    }

    lower_ref.style.left = lower_left + 'px';
    lower_ref.style.opacity = lower_opacity;
}

//Предварительная загрузка изображений и устанока thumb_id в указанный контейнер

function put_photo(thumb_id)
{
    var photo = {};

    photo['curr'] = new Image();
    photo['next'] = new Image();

    photo['curr'].src = photo_folder + prev_thumb + '.png';
    photo['next'].src = photo_folder + thumb_id + '.png';

    document.getElementById('photo0').src = photo['curr'].src;
    document.getElementById('photo1').src = photo['next'].src;
	
    put_verify(thumb_id);
}

//Проверка что все изображения загружены, а если необходимо ожидание загрузки изображений

function put_verify(thumb_id)
{
    var loaded = 0;

    do
    {
        document.getElementById('photo0').complete = loaded++;
        document.getElementById('photo1').complete = loaded++;
    }
    while(loaded < 2);

    prev_thumb = thumb_id;

}

//Исходное положение изображенний для анимации

function photo_pos()
{
    document.getElementById('photo0').style.transition = '';

    document.getElementById('photo1').style.visibility = 'visible';
    document.getElementById('photo0').style.visibility = 'visible';

    document.getElementById('photo1').style.left = '250px';
    document.getElementById('photo0').style.left = '250px';
    document.getElementById('photo0').style.opacity = 1;

}

//Анимация смены изображения

function photo_ani()
{
    const left_bound = get_bound();

    document.getElementById('photo0').style.transition = 'left 1000ms, opacity 1000ms';

    document.getElementById('photo1').style.zIndex = 1;
    document.getElementById('photo0').style.zIndex = 2;

    document.getElementById('photo0').style.left = left_bound + 'px';
    document.getElementById('photo0').style.opacity = 0;
}

//Вычисление точки остановки анимации

function get_bound()
{
    const photo_width = Math.round(get_property('photo1', 'width'), 1);
    const back_width = Math.round(get_property('photo0', 'width'), 1);

    var nor_bound = window_width - 330 - back_width;
    var erm_bound = 350;

    const bound = (nor_bound > 350 || photo_width > back_width * 1.5) ? nor_bound : erm_bound;

    // photo_width > back_width происходит в ситуации когда широкое фото
    // должно заменить узкое, узкое фото при трансформации должно пройти по длинному варианту
    // коэффициент 1,5 позволяет убедиться в том что фото действительно намного уже нового

    return bound;
}

//----------------------------------------------------------------------------------------------------
// Информация для печати миниатюр
//----------------------------------------------------------------------------------------------------

var arrow_name = 'album_folder/img/pointer_blue.png';        //путь и имя изображения cтрелки
var print_path = 'Ural\\album_folder\\photo\\'; //начало пути к папке для печати фото

//Вывод информации о фото

function show_info()
{
    const half_height =  window_height / 2;

    const arrow =
    {
        ref : document.getElementById('path_arrow'),
        top : half_height + 150,
        left : info_pos()
    };

    const folder =
    {
        ref : document.getElementById('path_tab'),
        top : arrow.top + 96,
        left : arrow.left + 177
    };

    arrow.ref.src = arrow_name;
    arrow.ref.style.top = arrow.top + 'px';
    arrow.ref.style.left = arrow.left + 'px';

    folder.ref.style.top = folder.top + 'px';
    folder.ref.style.left = folder.left + 'px';

    arrow.ref.style.visibility = 'visible';
    folder.ref.style.visibility = 'visible';
}

//Заполнение info_tab текстом и определение позиции левого края стрелки

function info_pos()
{
    const photo_id = document.elementFromPoint(255, window_height / 2)['id'];

    const print = print_path  + prev_thumb + '.tif';
    document.getElementById('path_text').innerHTML = print;

    var photo_end = get_property(photo_id, 'right');
    const tab_width = get_property('path_tab', 'width');

    if (photo_end + tab_width +  137 > window_width) photo_end = window_width - tab_width - 137;

    return photo_end - 50;
}

//Скрытие информации

function hide_info()
{
    document.getElementById('path_arrow').style.visibility = 'hidden';
    document.getElementById('path_tab').style.visibility = 'hidden';
}

//----------------------------------------------------------------------------------------------------
//Меню слайд-шоу
//----------------------------------------------------------------------------------------------------

//Глобальные переменные и массивы для опций слайд-шоу

var roll_open  = false; //переменная указывающая открыто ли меню опциий слайд-шоу

var showtime = [[5000, 10000, 20000, 30000, 40000, 60000, 180000, 300000, 600000],
                ['5 сек.', '10 сек.', '20 сек.', '30 сек.', '40 сек.', '1 мин.', '3 мин.', '5 мин.', '10 мин.']]; //время показа слайда

var showindex = 0; //текущий элемент в массиве showtime

var by_button = false; //следующий слайд по нажатию кнопки
var loop_show = false; //циклический показ


//Задание начальных параметров для анимации раскрытия меню

function rollover(slide_id)
{
    const slide_obj = document.getElementById(slide_id);

    if (slide_obj.style.top == '334px') {start_animation(slide_id, -18);}
    if (slide_obj.style.top == '161px') {start_animation(slide_id, 18);}
}

//Анимация раскрытия меню на основе параметров из rollover

function start_animation(slide_id, slide_steps)
{
    //Константы для параметров анимации

    const pri = slide_steps > 0 ? 0 : 1;
    const sec = slide_steps > 0 ? 1 : 0;

    slide_steps = Math.abs(slide_steps);

    const slide =
        {
            reference : document.getElementById(slide_id).style,
            position: [161, 334],
            opacity: [0.6, 0],
            options: [0, 2]

        };

    const pos_change =(slide.position[sec] - slide.position[pri]) / (slide_steps); //сдвиг sl_button за однин шаг
    const opa_change = opaque_step(pos_change, slide.opacity[pri], slide.opacity[sec]); //величины изменения прозрачности за однин шаг

    //Переменные для анимации свойств

    var nextrequest; //продолжение/прерывание анимации

    var button_pos = +slide.position[pri]; //позиция sl_button
    var opaque_val = +slide.opacity[sec];  //прозрачность option_n
    var option_num = slide.options[pri];  //текцщий option_n у которого надо изменять прозрачность

    n = 0; //счетчик шагов

    requestAnimationFrame(show_hide); //запуск первого кадра

    function show_hide()
    {
        nextrequest = ++n == slide_steps ? false : true;

        if (pri == 0 && opaque_val >= slide.opacity[pri]) {option_num++; opaque_val = slide.opacity[sec];}
        if (pri == 1 && opaque_val <= slide.opacity[pri]) {option_num--; opaque_val = slide.opacity[sec];}

        button_pos += pos_change;
        opaque_val += opa_change[option_num];

        //Корректировка срабатывает на последнем шаге

        if (pri == 0 && !nextrequest) option_num = 2, opaque_val = 0.6, roll_open = true;
        if (pri == 1 && !nextrequest) option_num = 0, opaque_val = 0, roll_open = false;

        slide.reference.top = button_pos + 'px';
        document.getElementById('option_' + option_num).style.opacity = opaque_val;

        if (nextrequest == true) requestAnimationFrame(show_hide);
    }
}

//Формирование массива шага изменения прозрачности для option_0 ... option_2

function opaque_step(pos_step, opa_max, opa_min)
{
    const abs_step = Math.abs(pos_step);
    var opaque = new Array(3);

    for (n = 0; n < 3; n++)
    {
        var cur_height = get_property('option_' + n, 'height')
        var step_count = Math.round(cur_height / abs_step);

        opaque[n] = +((opa_max - opa_min) / (step_count)).toFixed(3);
    }
    return opaque;
}

//Изменеие CSS правил sl_header/sl_button и header_text/button_text при нажатии на кнопки

function sl_style(text_id, opt)
{
    if (roll_open == false) return;
	
	const key_id = 'sl_' + text_id.substring(0, 6);

    const key_ref = document.getElementById(key_id);
    const txt_ref = document.getElementById(text_id);

    key_ref.style = sl_key(key_id, opt);
    txt_ref.style = sl_text(key_id, opt);
}

//CSS правила для sl_header/sl_button

function sl_key(key_id, opt)
{
    var key_stl;

    if (key_id == 'sl_header') var gen_opt = 0;
    if (key_id == 'sl_button') {var gen_opt = 1; key_stl = 'top :' + get_property(key_id, 'top') + 'px;\n';}

    if (opt == 'press')
    {
        if (gen_opt == 0) key_stl = 'top : 115px;\nright: 34px;\nheight: 45px;\nwidth: 292px;';
        if (gen_opt == 1) key_stl += 'right: 34px;\nheight: 46px;\nwidth: 292px;';
    }

    if (opt == 'release')
    {
        if (gen_opt == 0) key_stl = 'top : 110px;\nright: 30px;\nheight: 50px;\nwidth: 300px;';
        if (gen_opt == 1) key_stl += 'right: 30px;\nheight: 50px;\nwidth: 300px;';
    }

    return key_stl;
}

//CSS правила для header_text/button_text

function sl_text(key_id, opt)
{
    var text_stl;

    if (key_id == 'sl_header') var gen_opt = 0;
    if (key_id == 'sl_button') var gen_opt = 1;

    if (opt == 'press')
    {
        text_stl = ';\nfont-size: 16px;\nmargin-left: 20px;\nmargin-right: 20px;\ncolor: #FFFFFF;';

        if (gen_opt == 0) text_stl = 'nmargin-top: 15px;\nmargin-bottom: 15px' + text_stl;
        if (gen_opt == 1) text_stl = 'margin-top: 12px;\nmargin-bottom: 18px' + text_stl;
    }

    if (opt == 'release')
    {
        text_stl = 'font-size: 17px;\nmargin-left: 20px;\nmargin-right: 20px;\nmargin-top: 15px;\nmargin-bottom: 15px;\ncolor: #F0F0F0;';
    }

    return text_stl;
}

//Изменение текста на кнопке времени и значения указателя на элемент массива showtime

function time_change(caption_id)
{
	if (roll_open == false) return;
	
    showindex == 8 ? showindex = 0: showindex++;
    document.getElementById(caption_id).innerHTML = 'Время показа ' + showtime[1][showindex]
}

//Изменеие CSS правил option_0 для эмуляции button

function sim_button(button_id, text_id)
{
	if (roll_open == false) return;
	
    const key_ref = document.getElementById(button_id);
    const txt_ref = document.getElementById(text_id);

    if (key_ref.offsetWidth == 292)
    {
        key_ref.style = 'right: 30px;\ntop : 161px;\nheight: 50px;\nwidth: 300px;\nbackground: #000;\nopacity: 0.6;';
        txt_ref.style = 'font-size: 17px;\nmargin-left: 20px;\nmargin-right: 20px;\nmargin-top: 15px;\nmargin-bottom: 15px;\ncolor: #F0F0F0;';

        return;
    }

    if (key_ref.offsetWidth == 300)
    {
        key_ref.style = 'right: 34px;\ntop : 161px;\nheight: 50px;\nwidth: 292px;\nbackground: #0064F0;\nopacity: 0.6;';
        txt_ref.style = 'font-size: 16px;\nmargin-left: 20px;\nmargin-right: 20px;\nmargin-top: 16px;\nmargin-bottom: 14px;\ncolor: #FFFFFF;';
    }
}

//Изменеие CSS правил option_1 и option_2 для эмуляции toggle button, а также установка значений переменных параметров

function tog_button(button_id, text_id)
{
	if (roll_open == false) return;
	
    const key_ref = document.getElementById(button_id);
    const txt_ref = document.getElementById(text_id);

    const key_width = key_ref.offsetWidth;

    key_ref.style = tog_key(button_id, key_width);
    txt_ref.style = tog_text(button_id, key_width);

    tog_state(button_id,key_width);
}

//Изменеие CSS правил для изображения кнопок

function tog_key(button_id, btn_width)
{
	var key_stl;

    if (btn_width == 292) key_stl = ';\nright: 30px;\nwidth: 300px;\nbackground: #000;\nopacity: 0.6;';
    if (btn_width == 300) key_stl = ';\nright: 34px;\nwidth: 292px;\nbackground: #0064F0;\nopacity: 0.6;';

    if (button_id == 'option_1')
    {
        const option_top = get_property('option_1','top');

        if (option_top == 212) key_stl = 'top : 213px;\nheight: 70' + key_stl;
        if (option_top == 213) key_stl = 'top : 212px;\nheight: 70' + key_stl;
    }

    if (button_id == 'option_2') key_stl = 'top : 283px;\nheight: 50' + key_stl;

    return key_stl;
}

//Изменеие CSS правил для изменения вида надписей на кнопоках

function tog_text(button_id, btn_width)
{
	var txt_stl;

    if (btn_width == 292) txt_stl = 'font-size: 17px;\nmargin-left: 20px;\nmargin-right: 20px;\nmargin-top: 15px;\nmargin-bottom: 15px;\ncolor: #F0F0F0;';
    if (btn_width == 300) txt_stl = 'font-size: 16px;\nmargin-left: 20px;\nmargin-right: 20px;\nmargin-top: 16px;\nmargin-bottom: 14px;\ncolor: #FFFFFF;';

    return txt_stl;
}

//Запись значений глобальных переменных в зависимости от состояния кнопок

function tog_state(button_id, btn_width)
{
    const option_number = +button_id.substring(7);
    const option_state = btn_width == 300 ? true : false;

    if (option_number == 1) by_button = option_state;
    if (option_number == 2) loop_show = option_state;
}

//-->