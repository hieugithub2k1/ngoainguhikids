const divRoot = document.getElementById('root');

const html = `
 <div class="container">
        <h2 class="title_ipa">Learn IPA</h2>
        <div class="table">
        <div id="ipa">
            <div class="vowels">
                <div class="left">
                    <span>S</span>
                    <span>L</span>
                    <span>E</span>
                    <span>W</span>
                    <span>O</span>
                    <span>V</span>
                </div>
                <div class="right">
                    <div class="monophthongs">
                        <div class="row title">
                            <span>monophthongs</span>
                        </div>
                        <div class="row">
                            <div class="box" data-id="1">
                                <span>1</span>
                                <p>i:</p>
                                <p>sh<u>ee</u>p</p>
                            </div>
                            <div class="box" data-id="2">
                                <span>2</span>
                                <p>ɪ</p>
                                <p>sh<u>i</u>p</p>
                            </div>
                            <div class="box" data-id="3">
                                <span>3</span>
                                <p>ʊ</p>
                                <p>g<u>oo</u>d</p>
                            </div>
                            <div class="box" data-id="4">
                                <span>4</span>
                                <p>u:</p>
                                <p>sh<u>oo</u>t</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="box" data-id="7">
                                <span>7</span>
                                <p>e</p>
                                <p>b<u>e</u>d</p>
                            </div>
                            <div class="box" data-id="8">
                                <span>8</span>
                                <p>ə</p>
                                <p>teach<u>er</u></p>
                            </div>
                            <div class="box" data-id="9">
                                <span>9</span>
                                <p>ɜ:</p>
                                <p>b<u>ir</u>d</p>
                            </div>
                            <div class="box" data-id="10">
                                <span>10</span>
                                <p>ɔ:</p>
                                <p>d<u>oo</u>r</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="box" data-id="14">
                                <span>14</span>
                                <p>æ</p>
                                <p>c<u>a</u>t</p>
                            </div>
                            <div class="box" data-id="15">
                                <span>15</span>
                                <p>ʌ</p>
                                <p><u>u</u>p</p>
                            </div>
                            <div class="box" data-id="16">
                                <span>16</span>
                                <p>ɑ:</p>
                                <p>f<u>a</u>r</p>
                            </div>
                            <div class="box" data-id="17">
                                <span>17</span>
                                <p>ɒ</p>
                                <p><u>o</u>n</p>
                            </div>
                        </div>
                    </div>
                    <div class="dipthongs">
                        <div class="row title">
                            <span>dipthongs</span>
                        </div>
                        <div class="row">
                            <div class="box" data-id="5">
                                <span>5</span>
                                <p>ɪə</p>
                                <p>h<u>ere</u></p>
                            </div>
                            <div class="box" data-id="6">
                                <span>6</span>
                                <p>eɪ</p>
                                <p>w<u>ai</u>t</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="box" data-id="11">
                                <span>11</span>
                                <p>ʊə</p>
                                <p>t<u>ou</u>rist</p>
                            </div>
                            <div class="box" data-id="12">
                                <span>12</span>
                                <p>ɔɪ</p>
                                <p>b<u>o</u>y</p>
                            </div>
                            <div class="box" data-id="13">
                                <span>13</span>
                                <p>əʊ</p>
                                <p>sh<u>ow</u></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="box" data-id="18">
                                <span>18</span>
                                <p>eə</p>
                                <p>h<u>air</u></p>
                            </div>
                            <div class="box" data-id="19">
                                <span>19</span>
                                <p>aɪ</p>
                                <p>m<u>y</u></p>
                            </div>
                            <div class="box" data-id="20">
                                <span>20</span>
                                <p>aʊ</p>
                                <p>c<u>ow</u></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="consonants">
                <div class="left">
                    <span>S</span>
                    <span>T</span>
                    <span>N</span>
                    <span>A</span>
                    <span>N</span>
                    <span>O</span>
                    <span>S</span>
                    <span>N</span>
                    <span>O</span>
                    <span>C</span>
                </div>
                <div class="right">
                    <div class="monophthongs">
                        <div class="row">
                            <div class="box" data-id="21">
                                <span>21</span>
                                <p>p</p>
                                <p><u>p</u>ea</p>
                            </div>
                            <div class="box" data-id="22">
                                <span>22</span>
                                <p>b</p>
                                <p><u>b</u>oat</p>
                            </div>
                            <div class="box" data-id="23">
                                <span>23</span>
                                <p>t</p>
                                <p><u>t</u>ea</p>
                            </div>
                            <div class="box" data-id="24">
                                <span>24</span>
                                <p>d</p>
                                <p><u>d</u>og</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="box" data-id="29">
                                <span>29</span>
                                <p>f</p>
                                <p><u>f</u>ly</p>
                            </div>
                            <div class="box" data-id="30">
                                <span>30</span>
                                <p>v</p>
                                <p><u>v</u>ideo</p>
                            </div>
                            <div class="box" data-id="31">
                                <span>31</span>
                                <p>θ</p>
                                <p><u>th</u>ink</p>
                            </div>
                            <div class="box" data-id="32">
                                <span>32</span>
                                <p>ð</p>
                                <p><u>th</u>is</p>
                            </div>
                        </div>
                        <div class="row row-end">
                            <div class="box" data-id="37">
                                <span>37</span>
                                <p>m</p>
                                <p><u>m</u>an</p>
                            </div>
                            <div class="box" data-id="38">
                                <span>38</span>
                                <p>n</p>
                                <p><u>n</u>ow</p>
                            </div>
                            <div class="box" data-id="39">
                                <span>39</span>
                                <p>ŋ</p>
                                <p>si<u>ng</u></p>
                            </div>
                            <div class="box" data-id="40">
                                <span>40</span>
                                <p>h</p>
                                <p><u>h</u>at</p>
                            </div>
                        </div>
                    </div>
                    <div class="dipthongs">
                        <div class="row">
                            <div class="box" data-id="25">
                                <span>25</span>
                                <p>tʃ</p>
                                <p><u>ch</u>eese</p>
                            </div>
                            <div class="box" data-id="26">
                                <span>26</span>
                                <p>dʒ</p>
                                <p><u>J</u>une</p>
                            </div>
                            <div class="box" data-id="27">
                                <span>27</span>
                                <p>k</p>
                                <p><u>c</u>ar</p>
                            </div>
                            <div class="box" data-id="28">
                                <span>28</span>
                                <p>g</p>
                                <p><u>g</u>o</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="box" data-id="33">
                                <span>33</span>
                                <p>s</p>
                                <p><u>s</u>ee</p>
                            </div>
                            <div class="box" data-id="34">
                                <span>34</span>
                                <p>z</p>
                                <p><u>z</u>oo</p>
                            </div>
                            <div class="box" data-id="35">
                                <span>35</span>
                                <p>ʃ</p>
                                <p><u>sh</u>all</p>
                            </div>
                            <div class="box" data-id="36">
                                <span>36</span>
                                <p>ʒ</p>
                                <p>televi<u>si</u>on</p>
                            </div>
                        </div>
                        <div class="row row-end">
                            <div class="box" data-id="41">
                                <span>41</span>
                                <p>l</p>
                                <p><u>l</u>ove</p>
                            </div>
                            <div class="box" data-id="42">
                                <span>42</span>
                                <p>r</p>
                                <p><u>r</u>ed</p>
                            </div>
                            <div class="box" data-id="43">
                                <span>43</span>
                                <p>w</p>
                                <p><u>w</u>et</p>
                            </div>
                            <div class="box" data-id="44">
                                <span>44</span>
                                <p>j</p>
                                <p><u>y</u>es</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <div class="content">
            <div class="text">
                Click vào các ô để nghe âm thanh
            </div>
        </div>

    </div>
`;

divRoot.innerHTML = html;

const IPAS = [];
let check = true;

let indexCurent = null;
let idCurent = null;
let audio = null;
let isRender = true;

fetch('public/js/ipa.json')
    .then(response => response.json())
    .then(data => {
        IPAS.push(...data);
        check = false;
    });

const boxes = document.querySelectorAll('.table #ipa .box');
boxes.forEach(box => box.addEventListener('click', hanldClick));

function hanldClick(e) {
    if (check) return;
    const box = e.currentTarget;
    let id = box.getAttribute('data-id');
    id = parseInt(id);
    if (id == idCurent) {
        if (audio.paused) {
            audio.play();
        }else{
            audio.pause();
            audio.play();
        }
        return;
    };
    let ipaName = box.querySelector('p').innerText;
    indexCurent = id - 1;
    renderIPA(id, ipaName);
}

function renderIPA(id, ipaName) {
    if (audio && !audio.paused) {
        audio.pause();
    }
    idCurent = id;
    const ipa = IPAS[indexCurent];
        const content = document.querySelector('.content');
        emptyElement(content);
        const div1 = audioComponent(ipaName, ipa.url_sound);
        content.appendChild(div1);
        const div2 = document.createElement('div');
        div2.classList.add('div2');
        const ul = document.createElement('ul');
        ul.classList.add('ul_description');
        const li = ipa.description.map(item => `<li>${item}</li>`).join('');
        ul.innerHTML = li;
        div2.appendChild(ul);
        content.appendChild(div2);
        audio = div1.querySelector('audio');
        audio.play();
        isRender = false;
}

function audioComponent(ipaName, url_sound) {
    const div = document.createElement('div');
    div.classList.add('div1');
    div.innerHTML = `
    <div class="ipa">
        <span class="ipaName"> ${ipaName} </span>
    </div>
    <audio controls>
        <source class="url_sound" src="public/sounds_ipa/${url_sound}" type="audio/mpeg">
    </audio>
    `;
    return div;
}

function emptyElement(Element) {
    while (Element.firstChild) {
        Element.removeChild(Element.firstChild);
    }
}