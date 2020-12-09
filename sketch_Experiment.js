// sketch.js




//--------------------------------------------
//変数設定
//--------------------------------------------
//小説の名前
var novelTitle;

//画面サイズとフレームレートの変数
var Width; //iPhone8は414
var Height; //iPhone8は736
var screenMargin = 10; //文節が表示されない画面枠マージンの値
var screenMarginRL = 13;
var screenMarginTB = 50;
var fR = 60;

//タイトル表示の変数
var titleXY = 5;
var autherXY = 5;
var titleSize = 20;
var titleWidth = 0;
var novelNumber = 0;
var novelInfo = [
    ['デューク', '江國香織', 'duke.txt'],
    ['スイート・ラバーズ', '江國香織', 'natsu.txt']
];

//BGMの変数
var bgm;
var bgmSwitch = 1;　//BGMを再生タイミングに使用する

//小説の文節を格納する配列
var phrase;
//小説の文節の数を格納する変数
var phraseNumber;
//句読点を格納する変数
var punctuation = [];
var punctuationUpper = [];
var punctuationLower = [];
var punctuationInner = [];
var punctuationSwitch = [];
var punctuationSwitchSub = [];
var punctuationUpperCovSwitch = [];
var punctuationLowerCovSwitch = [];
var punctuationInnerSwitch = [];
var punctuationLineSwitch = [];
var punctuationPosition = [];
var punctuationLine;
//テキストの表示位置の座標を格納する変数
var phraseX;
var phraseY;
//文節の表示位置が適切か判断するための計算の結果を格納する変数
//縦読み用
var checkXVertical;
var checkYVertical;
var confirmXVertical;
var confirmYVertical;
//横読み用
var checkXHorizontal;
var checkYHorizontal;
var confirmXHorizontal;
var confirmYHorizontal;

//文字の移動距離を格納する変数
var moveLength = 30;
var moveLengthPerFrame;

//文字の表示時間を格納する変数
var duration = 3.5;
var opacityDuration = 4; //これを大きくする表示まで・消えるまでの時間が早くなる
//文字の表示タイミングの制御に使用する変数
var phraseBeginning; //文節が表示され始めた瞬間の時間を記録する変数
var phraseTime; //文節が表示されている瞬間の時間を記録する変数
var switchForphraseBeginning; //phraseBeginningの記録のために使うスイッチのための変数

//テキスト設定の変数
var myFont = "Sawarabi Mincho";
var tHeight; //テキストの高さを格納する変数
var tWidth; //テキストの幅を格納する変数
var fontSize; //fontSizeを格納するはいれつ
var fontSizeRange = [14, 20, 25, 40, 60, 100]; //fontSizeのレンジ
var opacity; //透明度を格納する配列
var expandTextRandom;  //背景にExpandTextを表示するかの確率を決める配列
var mean = 0;
var sd = 0.4;
//縦横切り替えのためのスイッチ
var vhChange = 0;
var vhSwitch = [];
//モーションなしセンター配置にする際のスイッチ
var placeInCenterSwitch = [];

var letterSpace = 0;
//var fontSizeMin = 30;
//var fontSizeMax = 150;

//縦読みのための改行を入れるコードで使用する変数
var slicedPhrase;
var slicedPhrase1;
var stickedPhrase = '';
var realLetterLengthForVertical; //改行を入れたのちの縦書きの文字数

//ENTERを押すごとに文字が出てくるために、順番を記録する変数
var textOrder = 0; //順番を記録
var textSwitch;　//textOrderの値が増えた時に、Phrase表示に切り替えるためのスイッチの配列

//ローディング時間を短縮するためのタイムリミットに使う変数
var timeLimit;
var timeLimitEnd;
var timeLimitSwitch;
var timeLimitSeconds = 3;  //この時間が経過するまではランダムなfontSizeを左が続ける
var fontSizeAfterTimelimit = 12; //timeLimitSeconds秒だけ経過したのちはこのフォントサイズで固定

//setupが完了したことを示す変数
var setupFinish;

//------------------ProgressBarで使用する変数------------------
var progressbarHeight = 1.5;
var progressbarY = 40;  //ProgressBarが画面下からどれくらいの距離に表示されるか
var paragraphDistance = 3; //プログレスバーのパラグラフ間の距離
var paragraphCounter = 0; //文節の数を数える
var noWordPosition = []; //パラグラフの区切り（文字の入っていない行の番号）を格納する配列

var paragraph = []; //パラグラフ内の文章を全て格納する配列

var totalWordCounts = 0; //小説内の全ての文字数を格納する変数

//ProgressBarでBarの位置座標や長さを格納する変数
var paragraphRectWidth = [];
var paragraphRectHeight = [];

var paragraphRectX = [];
var paragraphRectY = [];
var paragraphRectXAdds = [];
var progressBarSwitch = 0;

var whiteSpaceWidth = 4;
var whiteSpaceRandom = [];
var rectColor = [];
var rectColorSwitch = 0;
var rectOpacity = [];

//-----------------タッチ判定でする変数------------------
var touchMoment = 0;
var whileTouching = 0;

//セリフ「」だけにボックスを表示するためのスイッチ・変数
var covBoxSwitch = 0;
var covBox = [];


//--------------------------------------------
//初期設定
//--------------------------------------------
function preload() {

    //phraseに小説文を代入
    novelTitle = novelInfo[novelNumber][2];
    phrase = loadStrings('novel/' + novelTitle);
    //BGMを読み込み
    bgm = loadSound('material/duke.mp3');

}

function setup() {

    getAudioContext().suspend();
    bgm.loop();

    //画面サイズとフレームレートの設定
    Width = windowWidth;
    Height = windowHeight;
    createCanvas(Width, Height);
    frameRate(fR);

    // Textの設定
    textAlign(LEFT, TOP);

    //小説タイトルの長さを計測
    titleWidth = novelInfo[novelNumber][0].length * titleSize;

    //文節の数を計測
    phraseNumber = phrase.length;


    //------------------------配列を宣言------------------------
    //配列を作成
    //テキストに関する値格納する配列
    fontSize = new Array(phraseNumber);
    opacity = new Array(phraseNumber);

    phraseX = new Array(phraseNumber); //文節表示位置を格納する配列
    phraseY = new Array(phraseNumber); //文節表示位置を格納する配列

    expandTextRandom = new Array(phraseNumber);

    textSwitch = new Array(phraseNumber);
    vhSwitch = new Array(phraseNumber); //縦横切り替えのためのスイッチ

    placeInCenterSwitch = new Array(phraseNumber); //縦横切り替えのためのスイッチ

    phraseTime = new Array(phraseNumber); //文節が表示されている瞬間の時間を記録する配列
    phraseBeginning = new Array(phraseNumber); //文節が初めて表示された瞬間の値を格納する配列
    switchForphraseBeginning = new Array(phraseNumber); //文節が初めて表示された瞬間のみphraseBeginningが値を記録するためのスイッチ

    slicedPhrase = new Array(100); //縦書きにするために文節を一文字づつ分割した値を格納する配列
    realLetterLengthForVertical = new Array(phraseNumber); //縦書きに変換したのちに、改行を除いた文字数を格納する配列

    moveLengthPerFrame = moveLength / (fR * duration); //単位時間ごとの文字移動スピードを計算

    //文節表示位置が画面外に出ないか確認するための値を格納する配列
    checkXVertical = new Array(phraseNumber);
    checkYVertical = new Array(phraseNumber);
    checkXHorizontal = new Array(phraseNumber);
    checkYHorizontal = new Array(phraseNumber);
    confirmXVertical = new Array(phraseNumber);
    confirmYVertical = new Array(phraseNumber);
    confirmXHorizontal = new Array(phraseNumber);
    confirmYHorizontal = new Array(phraseNumber);

    //読み込み時間のタイムリミットの時間を格納する配列
    timeLimit = new Array(phraseNumber);
    timeLimitEnd = new Array(phraseNumber);
    timeLimitSwitch = new Array(phraseNumber);

    punctuation = new Array(phraseNumber);
    punctuationSwitch = new Array(phraseNumber);
    punctuationSwitchSub = new Array(phraseNumber);
    punctuationInnerSwitch = new Array(phraseNumber);
    punctuationUpperCovSwitch = new Array(phraseNumber);
    punctuationLowerCovSwitch = new Array(phraseNumber);
    punctuationLineSwitch = new Array(phraseNumber);

    punctuationUpper = new Array(phraseNumber);
    punctuationLower = new Array(phraseNumber);
    punctuationInner = new Array(phraseNumber);
    punctuationLine = new Array(phraseNumber);

    //セリフ括弧にだけボックスを表示するための配列
    covBox = new Array(phraseNumber);


    //------------------------ProgressBarを作成するためのコード------------------------
    //progressbarY = windowHeight - progressbarHeight - screenMargin;
    //空欄の行を検索（小説の最終行には必ず「空欄の行を入れる！！！！！」
    for (let i = 0; i < phraseNumber; i++) {
        //小説全体の文字量
        totalWordCounts = totalWordCounts + phrase[i].length;
        if (phrase[i] === '') {
            paragraphCounter++;
            noWordPosition[paragraphCounter - 1] = i;
        }
    }
    //空欄の行から次の空欄の行までの文節の文章をParagraph[]に格納するためのコード
    for (let t = 0; t < paragraphCounter; t++) {
        paragraph[t] = '';
        if (t === 0) {
            for (let s = 0; s < noWordPosition[t]; s++) {
                paragraph[t] = paragraph[t] + phrase[s];
            }
        } else {
            for (let s = noWordPosition[t - 1] + 1; s < noWordPosition[t]; s++) {
                paragraph[t] = paragraph[t] + phrase[s];
            }
        }
    }
    //パラグラフの長方形の辺の長さを求める
    for (let i = 0; i < paragraphCounter; i++) {
        //パラグラフバーの縦横の長さを計算
        //paragraphRectWidth[i] = Math.round((Width - paragraphDistance * (paragraphCounter - 1) - screenMargin - 100) * paragraph[i].length / totalWordCounts);
        //paragraphRectWidth[i] = (Width - paragraphDistance * (paragraphCounter - 1) - titleWidth - titleXY * 2 - 20 * 2) * paragraph[i].length / totalWordCounts;
        paragraphRectWidth[i] = (Width - paragraphDistance * (paragraphCounter - 1) - screenMarginRL * 3) * paragraph[i].length / totalWordCounts;
        paragraphRectHeight[i] = progressbarHeight;

        //パラグラフバーを表示する座標を計算
        paragraphRectXAdds[i] = 0;
        paragraphRectX[i] = 0;

        if (i !== 0) {
            for (let p = 1; p < i + 1; p++) {
                paragraphRectXAdds[i] = paragraphRectXAdds[i] + paragraphRectWidth[p - 1];
            }
        }

        paragraphRectX[i] = screenMarginRL + paragraphRectXAdds[i] + i * paragraphDistance;
        paragraphRectY[i] = progressbarY;

        //ホワイトスペース（バーの左側のとこ）の高さをランダムに決定するコード
        whiteSpaceRandom[i] = 0;
        whiteSpaceRandom[i] = random(3, paragraphRectHeight[i] - 3);

        //barの初期値カラーを代入
        rectColor[i] = 230;

        //
        rectOpacity[i] = 100;

    }



    //---------------一文づつ縦横を変えるためのコード---------------
    /*
    for (var s = 0; s < phraseNumber; s++) {

        slicedPhrase1 = split(phrase[s], '');

        if (vhChange === 0) {
            vhSwitch[s] = 0;
        } else {
            vhSwitch[s] = 1;
        }

        //文末の。を取り出すためのコード
        if (slicedPhrase1[slicedPhrase1.length - 1] === '。') {
            vhChange = 1 - vhChange;
        }
    }
    */
    //---------------ランダムに縦横を変えるためのコード---------------
    for (let s = 0; s < phraseNumber; s++) {
        vhChange = random(0, 1);

        if (vhChange < 0.5) {
            vhSwitch[s] = 0;
        } else {
            vhSwitch[s] = 1;
        }
    }
    //---------------台詞だけにボックスを表示するためのコード---------------
    for (var s = 0; s < phraseNumber; s++) {

        slicedPhrase1 = split(phrase[s], '');

        for (var t = 0; t < slicedPhrase1.length; t++) {
            if (slicedPhrase1[t] === '「') {
                covBoxSwitch = 1;
            }
            if (covBoxSwitch === 1) {
                covBox[s] = 1;
            }
            if (slicedPhrase1[t] === '」') {
                covBoxSwitch = 0;
            }
        }
    }




    //--------------------------------初期設定を開始する--------------------------------
    for (let i = 0; i < phraseNumber; i++) {

        //テキストを大きくするかを決める乱数を格納する
        expandTextRandom[i] = abs(randomGaussian(mean, sd));

        //テキストがセンターに配置されるかどうか決める
        placeInCenterSwitch[i] = abs(randomGaussian(mean, sd));

        //透明度を0にする
        opacity[i] = 0;
        //位置phraseX phraseYの初期値を代入
        phraseX[i] = 0;
        phraseY[i] = 0;
        //check変数の初期値を代入
        checkXVertical[i] = 0;
        checkYVertical[i] = 0;
        checkXHorizontal[i] = 0;
        checkYHorizontal[i] = 0;
        // confirmに初期値0を代入（横書き・縦書きで奇数偶数それぞれ使用しない配列には1を代入
        //if (i % 2 === 0)
        if (vhSwitch[i] === 0) {
            confirmXHorizontal[i] = 0;
            confirmYHorizontal[i] = 0;
        } else {
            confirmXHorizontal[i] = 1;
            confirmYHorizontal[i] = 1;
        }
        //if (i % 2 !== 0) 
        if (vhSwitch[i] === 1) {
            confirmXVertical[i] = 0;
            confirmYVertical[i] = 0;
        } else {
            confirmXVertical[i] = 1;
            confirmYVertical[i] = 1;
        }


        //textSwitchを全てオフに
        textSwitch[i] = 0;
        //phraseBeginning時間を記録するスイッチをすべてオフに
        switchForphraseBeginning[i] = 1;
        //読み込み時間のタイムリミットを開始するスイッチをオフに
        timeLimitSwitch[i] = 1;

        punctuation[i] = '';
        punctuationSwitch[i] = 0;
        punctuationSwitchSub[i] = 0;
        punctuationPosition[i] = 0;
        punctuationUpperCovSwitch[i] = 0;
        punctuationLowerCovSwitch[i] = 0;
        punctuationInnerSwitch[i] = 0;
        punctuationLineSwitch[i] = 0;
        punctuationUpper[i] = [];
        punctuationLower[i] = [];
        punctuationInner[i] = [];
        punctuationLine[i] = [];



        //---------------奇数行の文節を縦書きに変換するためのコード---------------
        //if (i % 2 !== 0) 
        if (vhSwitch[i] === 1) {
            slicedPhrase = split(phrase[i], '');

            //句読点を取り出すためのコード（文末のもの）
            if (slicedPhrase[slicedPhrase.length - 1] === '、' || slicedPhrase[slicedPhrase.length - 1] === '。') {
                if (slicedPhrase[slicedPhrase.length - 1] === '。') {
                    punctuationSwitchSub[i] = 1;
                }
                punctuation[i] = slicedPhrase[slicedPhrase.length - 1];
                punctuationSwitch[i] = 1;
                slicedPhrase.pop();
            }

            //「」を取り出すためのコード
            for (let t = 0; t < slicedPhrase.length; t++) {
                if (slicedPhrase[t] === '「') {
                    punctuationUpper[i][t] = slicedPhrase[t];
                    slicedPhrase[t] = '　';
                    punctuationUpperCovSwitch[i] = 2;
                }
                if (slicedPhrase[t] === '」') {
                    punctuationLower[i][t] = slicedPhrase[t];
                    slicedPhrase[t] = '　';
                    punctuationLowerCovSwitch[i] = 3;
                }
            }

            //句読点を取り出すためのコード（文中のもの）  
            for (let t = 0; t < slicedPhrase.length - 1; t++) {
                if (slicedPhrase[t] === '、' || slicedPhrase[t] === '。') {
                    punctuationInner[i][t] = slicedPhrase[t];
                    slicedPhrase[t] = '　'
                    punctuationInnerSwitch[i] = 4;
                } else {
                    punctuationInner[i][t] = '';
                }
            }

            //'ー''='（文中のもの）  
            for (let t = 0; t < slicedPhrase.length - 1; t++) {
                if (slicedPhrase[t] === 'ー' || slicedPhrase[t] === '＝') {
                    punctuationLine[i][t] = slicedPhrase[t];
                    slicedPhrase[t] = '　'
                    punctuationLineSwitch[i] = 5;
                } else {
                    punctuationLine[i][t] = '';
                }
            }


            //一文字づつの間に改行をいれる処理
            for (let t = 0; t < slicedPhrase.length; t++) {
                if (t !== slicedPhrase.length - 1) {
                    slicedPhrase[t] = slicedPhrase[t] + '\n';
                }
                stickedPhrase = stickedPhrase + slicedPhrase[t];
            }
            phrase[i] = stickedPhrase;
            stickedPhrase = '';
            //縦書きの行の改行を文字数にカウントしないための計算
            realLetterLengthForVertical[i] = phrase[i].length - (phrase[i].length - 1) / 2;
        } else {
            slicedPhrase = split(phrase[i], '');

            //句読点を取り出すためのコード（文末のもの）
            if (slicedPhrase[slicedPhrase.length - 1] === '、' || slicedPhrase[slicedPhrase.length - 1] === '。') {
                punctuationSwitch[i] = 1;
            }
        }


        //---------------フォントサイズ・表示位置を決定するコード---------------
        while (confirmXHorizontal[i] === 0 || confirmYHorizontal[i] === 0 || confirmXVertical[i] === 0 || confirmYVertical[i] === 0) {

            //if (i % 2 === 0) 
            if (vhSwitch[i] === 0) {
                if (confirmXHorizontal[i] === 0 || confirmYHorizontal[i] === 0) {

                    if (timeLimitSwitch[i] === 1) {
                        timeLimit[i] = millis();
                        timeLimitSwitch[i] = 0;
                    }
                    timeLimitEnd[i] = millis();

                    if (timeLimitEnd[i] - timeLimit[i] < timeLimitSeconds * 1000) {
                        fontSize[i] = random(fontSizeRange);
                    } else {
                        fontSize[i] = fontSizeAfterTimelimit;
                    }

                    textFont(myFont, fontSize[i]);
                    if (phrase[i].length !== 0) {
                        tHeight = textAscent() + textDescent();
                        tWidth = textWidth(str(phrase[i].charAt(0)));
                        textLeading(fontSize[i]);

                        phraseX[i] = random(screenMarginRL, Width);
                        checkXHorizontal[i] = phraseX[i] + (tWidth * phrase[i].length + 2) + moveLength + screenMarginRL;
                        phraseY[i] = random(screenMarginTB, Height);
                        checkYHorizontal[i] = phraseY[i] + tHeight + 2 + screenMarginTB;

                    }
                    if (checkXHorizontal[i] < Width && checkYHorizontal[i] < Height) {
                        confirmXHorizontal[i] = 1;
                        confirmYHorizontal[i] = 1;
                    }
                }
            }

            //if (i % 2 !== 0) 
            if (vhSwitch[i] === 1) {


                if (confirmXVertical[i] === 0 || confirmYVertical[i] === 0) {

                    if (timeLimitSwitch[i] === 1) {
                        timeLimit[i] = millis();
                        timeLimitSwitch[i] = 0;
                    }
                    timeLimitEnd[i] = millis();

                    if (timeLimitEnd[i] - timeLimit[i] < timeLimitSeconds * 1000) {
                        fontSize[i] = random(fontSizeRange);
                    } else {
                        fontSize[i] = fontSizeAfterTimelimit;
                    }

                    textFont(myFont, fontSize[i]);
                    if (realLetterLengthForVertical[i] !== 0) {
                        //テキストのサイズを求める
                        tHeight = textAscent() + textDescent();
                        tWidth = textWidth(str(phrase[i].charAt(0)));
                        textLeading(fontSize[i]);

                        //文の開始位置の値を計算
                        phraseX[i] = random(screenMarginRL, Width);
                        checkXVertical[i] = phraseX[i] + (tWidth + 2) + screenMarginRL;
                        phraseY[i] = random(screenMarginTB, Height);
                        checkYVertical[i] = phraseY[i] + ((tWidth + letterSpace) * realLetterLengthForVertical[i] + 2) + moveLength + screenMarginTB;

                    }
                    //文章の開始位置が画面外にはみ出さない値か検証
                    if (checkXVertical[i] < Width && checkYVertical[i] < Height) {
                        confirmXVertical[i] = 1;
                        confirmYVertical[i] = 1;
                    }
                }
            }

        }

    }
    setupFinish = 1;
}





//--------------------------------------------
//描画
//--------------------------------------------
function draw() {

    background(255);
    smooth();

    //-------------------------------タイトルを表示-------------------------------
    fill(0);
    textSize(titleSize);
    text(novelInfo[novelNumber][0], titleXY, titleXY);
    textSize(12.5);
    text(novelInfo[novelNumber][1], autherXY + titleWidth + 15, autherXY + 5);
    //noFill();
    //stroke(10);
    //rect(0, 0, 100, screenMargin);

    //-------------------------------タッチされたか判別-------------------------------
    /*
        if (touches.length > 0) {
            if (whileTouching === 0) {
                touchMoment = 1;
                whileTouching = 1 - whileTouching;
            }
        } else if (touches.length === 0) {
            whileTouching = 0;
        }
    
        if (touchMoment === 1) {
            
                textSwitch[textOrder] = 1;
                textOrder = textOrder + 1;
    
                progressBarSwitch = 1;
                rectColorSwitch = 1;
            
                touchMoment = 0;
    
        }
    */
    //-------------------------------文章を表示していくコード-------------------------------
    for (let i = 0; i < phraseNumber; i++) {
        //print(realLetterLengthForVertical[9]);
        //print(punctuationInnerSwitch[i]);

        if (setupFinish === 1) {

            if (textSwitch[i] === 1) {

                //BGMを再生
                if (bgmSwitch === 1 && textSwitch[0] === 1) {
                    bgm.loop();
                    bgmSwitch = 0;
                }

                if (switchForphraseBeginning[i] === 1) {
                    phraseBeginning[i] = millis();
                    switchForphraseBeginning[i] = 2;
                }
                phraseTime[i] = millis();

                //透明度を時間差で変える
                if (phraseBeginning[i] <= phraseTime[i] && phraseTime[i] < phraseBeginning[i] + (duration * 1000)) {
                    // 透明度を時間差で変える
                    if (phraseTime[i] < (phraseBeginning[i] + 1000 * duration * (1 / opacityDuration))) {
                        opacity[i] = opacity[i] + 255 / (fR * duration * (1 / opacityDuration));
                    } else if (phraseBeginning[i] + (1000 * duration * (1 / opacityDuration)) < phraseTime[i] && phraseTime[i] < phraseBeginning[i] + (1000 * duration * ((opacityDuration - 1) / opacityDuration))) {
                        opacity[i] = 255;
                    } else {
                        opacity[i] = opacity[i] - 255 / (fR * duration * (1 / opacityDuration));
                    }
                } else if (phraseTime[i] > phraseBeginning[i] + (duration * 1000)) {
                    //durationを経過したらテキストを非表示（Switchをオフに）
                    textSwitch[i] = 0;
                }

                fill(0, opacity[i]);
                textFont(myFont, fontSize[i]);
                tHeight = textAscent() + textDescent();
                tWidth = textWidth(str(phrase[i].charAt(0)));
                textLeading(fontSize[i]);

                //偶数行目のコード
                if (vhSwitch[i] === 0) {
                    if (phrase[i].length != 0) {


                        //大きい文字エフェクトを入れるかどうか
                        if (expandTextRandom[i] > 0.8 && covBox[i] !== 1) {
                            textFont(myFont, fontSize[i] * 4);
                            tHeight = textAscent() + textDescent();
                            tWidth = textWidth(str(phrase[i].charAt(0)));
                            textLeading(fontSize[i]);
                            fill(240, opacity[i])
                            text(phrase[i], phraseX[i] - tWidth/2, phraseY[i] - tWidth*3/8, tWidth * phrase[i].length + 2, tHeight + 2);
                            fill(0, opacity[i]);
                        } else {
                            fill(150, opacity[i]);
                        }
                        

                        textFont(myFont, fontSize[i]);
                        tHeight = textAscent() + textDescent();
                        tWidth = textWidth(str(phrase[i].charAt(0)));
                        textLeading(fontSize[i]);

                        //コメントボックスを表示するコード
                         if (covBox[i] === 1) {

                            //phraseX[i] = Width / 2 - (tWidth * phrase[i].length) / 2;
                            //phraseY[i] = height / 2 - tWidth / 2;
                            fill(255, opacity[i]);
                            stroke(150, opacity[i]);
                            strokeWeight(0.5);
                            if (punctuationSwitch[i] === 0) {
                                rect(phraseX[i] - tWidth/1.7, phraseY[i] - tWidth*0.8, tWidth * phrase[i].length + tWidth, tHeight + tWidth);
                            } else {
                                rect(phraseX[i] - tWidth/1.7, phraseY[i] - tWidth*0.8, tWidth * phrase[i].length + tWidth, tHeight + tWidth);
                            }
                            noStroke();
                            fill(150, opacity[i]);
                            //textAlign(CENTER, CENTER);
                        }


                        //テキストを表示するコード
                        fill(150, opacity[i]);
                        text(phrase[i], phraseX[i], phraseY[i], tWidth * phrase[i].length + 2, tHeight + 2);
                        textAlign(LEFT, TOP);

                        //テキストを動かすためのコード
                        phraseX[i] = phraseX[i] + moveLengthPerFrame;

                        //rect(phraseX[i], phraseY[i], tWidth*phrase[i].length + 2, tHeight);
                    }

                    //奇数行目のコード
                } else if (vhSwitch[i] === 1) {
                    if (phrase[i].length != 0) {

                        //テキスト情報の取得
                        textFont(myFont, fontSize[i]);
                        tHeight = textAscent() + textDescent();
                        tWidth = textWidth(str(phrase[i].charAt(0)));
                        textLeading(fontSize[i]);

                        
                        //コメントボックスを表示するコード
                        if (covBox[i] === 1) {
                            //phraseX[i] = Width / 2 - tWidth / 2;
                            //phraseY[i] = Height / 2 - (tWidth * realLetterLengthForVertical[i]) / 2;
                            fill(255, opacity[i]);
                            stroke(150, opacity[i]);
                            strokeWeight(0.5);
                            if (punctuationSwitch[i] === 0) {
                                rect(phraseX[i] - tWidth, phraseY[i] - tWidth / 2, tWidth + tWidth*2, tWidth * realLetterLengthForVertical[i] + tWidth);
                            } else {
                                rect(phraseX[i] - tWidth, phraseY[i] - tWidth / 1.5, tWidth + tWidth*2, tWidth * realLetterLengthForVertical[i] + tWidth * 2);
                            }
                            noStroke();
                            fill(150, opacity[i]);
                            //textAlign(CENTER, CENTER);
                        }
                        


                        //大きな文字を表示する際のコード
                        if (expandTextRandom[i] > 0.8 && covBox[i] !== 1) {
                            textFont(myFont, fontSize[i] * 4);
                            tHeight = textAscent() + textDescent();
                            tWidth = textWidth(str(phrase[i].charAt(0)));
                            textLeading(fontSize[i] * 4);
                            fill(240, opacity[i])

                            //大文字の文節を表示する
                            text(phrase[i], phraseX[i] - tWidth*3/7, phraseY[i] - tWidth/2, tWidth + 2, (tWidth + 2) * realLetterLengthForVertical[i] + 2);

                            //句読点のためのコード
                            //。、のとき
                            if (punctuationSwitch[i] === 1) {
                                punctuationPosition[i] = tWidth * (realLetterLengthForVertical[i] - 0.5);
                                text(punctuation[i], phraseX[i] + tWidth * 2 / 3, phraseY[i] + punctuationPosition[i], tWidth + 10, tWidth + 10);
                            }
                            //「のとき
                            if (punctuationUpperCovSwitch[i] === 2) {
                                for (var s = 0; s < phrase[i].length; s++) {
                                    text(punctuationUpper[i][s], phraseX[i] - tWidth * 0.75, phraseY[i] + (s + 0.65) * tWidth * 3 / 4, tWidth + 10, tWidth + 10);
                                }
                            }
                            // 」のとき
                            if (punctuationLowerCovSwitch[i] === 3) {
                                for (var s = 0; s < phrase[i].length; s++) {
                                    text(punctuationLower[i][s], phraseX[i] + tWidth * 0.75, phraseY[i] + (s - 0.65) * tWidth, tWidth + 10, tWidth + 10);
                                }
                            }

                            //文中の。、
                            if (punctuationInnerSwitch[i] === 4) {
                                for (var s = 0; s < phrase[i].length; s++) {
                                    if (punctuationInner[i][s] === '、' || punctuationInner[i][s] === '。') {
                                        text(punctuationInner[i][s], phraseX[i] + tWidth * 2 / 3, phraseY[i] + (s - 0.3) * tWidth, tWidth + 10, tWidth + 10);
                                    }
                                }
                            }

                            //文中の'ー''＝'
                            if (punctuationLineSwitch[i] === 5) {
                                for (var s = 0; s < phrase[i].length; s++) {
                                    if (punctuationLine[i][s] === 'ー' || punctuationLine[i][s] === '＝') {
                                        print('helloooooooooo');
                                        push();
                                        //translate(phraseX[i] + tWidth/2 , phraseY[i] + s * tWidth - tWidth/2);
                                        translate(phraseX[i] + tWidth * 1.01, phraseY[i] + (s - 0.2) * tWidth);
                                        //translate(100, 100);
                                        rotate(PI * 3 / 2);
                                        text(punctuationLine[i][s], -tWidth, -tWidth, tWidth + 10, tWidth + 10);
                                        //text(punctuationLine[i][s], phraseX[i] , phraseY[i] + s*tWidth - tWidth, tWidth + 10, tWidth + 10);
                                        pop();
                                    }
                                }
                            }

                            fill(0, opacity[i]);
                        } else {
                            fill(150, opacity[i])
                        }

                        //文節を表示するためのコード
                        textFont(myFont, fontSize[i]);
                        tHeight = textAscent() + textDescent();
                        tWidth = textWidth(str(phrase[i].charAt(0)));
                        textLeading(fontSize[i]);

                        fill(150, opacity[i]);
                        text(phrase[i], phraseX[i], phraseY[i], tWidth + 5, (tWidth + 2) * realLetterLengthForVertical[i] + 5);
                        
                         //テキストを動かすためのコード
                        phraseY[i] = phraseY[i] + moveLengthPerFrame;

                        //句読点のためのコード
                        //。、のとき
                        if (punctuationSwitch[i] === 1) {
                            punctuationPosition[i] = tWidth * (realLetterLengthForVertical[i] - 0.5);
                            text(punctuation[i], phraseX[i] + tWidth * 2 / 3, phraseY[i] + punctuationPosition[i], tWidth + 10, tWidth + 10);
                        }
                        //「のとき
                        if (punctuationUpperCovSwitch[i] === 2) {
                            for (let s = 0; s < phrase[i].length; s++) {
                                text(punctuationUpper[i][s], phraseX[i] - tWidth * 0.75, phraseY[i] + (s + 0.65) * tWidth * 3 / 4, tWidth + 10, tWidth + 10);
                            }
                        }

                        //」のとき
                        if (punctuationLowerCovSwitch[i] === 3) {
                            for (let s = 0; s < phrase[i].length; s++) {
                                text(punctuationLower[i][s], phraseX[i] + tWidth * 0.75, phraseY[i] + (s - 0.65) * tWidth, tWidth + 10, tWidth + 10);
                            }
                        }

                        //文中の。、
                        if (punctuationInnerSwitch[i] === 4) {
                            for (let s = 0; s < phrase[i].length; s++) {
                                if (punctuationInner[i][s] === '、' || punctuationInner[i][s] === '。') {
                                    text(punctuationInner[i][s], phraseX[i] + tWidth * 2 / 3, phraseY[i] + (s - 0.3) * tWidth, tWidth + 10, tWidth + 10);
                                }
                            }
                        }
                        //文中の'ー''＝'
                        if (punctuationLineSwitch[i] === 5) {
                            for (let s = 0; s < phrase[i].length; s++) {
                                if (punctuationLine[i][s] === 'ー' || punctuationLine[i][s] === '＝') {
                                    print('helloooooooooo');
                                    push();
                                    //translate(phraseX[i] + tWidth/2 , phraseY[i] + s * tWidth - tWidth/2);
                                    translate(phraseX[i] + tWidth * 0.8, phraseY[i] + (s + 0.25) * tWidth);
                                    //translate(100, 100);
                                    rotate(PI * 3 / 2);
                                    text(punctuationLine[i][s], -tWidth, -tWidth, tWidth + 10, tWidth + 10);
                                    //text(punctuationLine[i][s], phraseX[i] , phraseY[i] + s*tWidth - tWidth, tWidth + 10, tWidth + 10);
                                    pop();
                                }
                            }
                        }
                        //rect(phraseX[i], phraseY[i], tWidth + 1, (tHeight+letterSpace)*phrase[i].length);
                    }

                }
            }
        }
    }
    

    //-------------------------------ProgressBarを表示するコード-------------------------------
    //if (progressBarSwitch === 1) {
    for (let i = 0; i < paragraphCounter; i++) {

        if (i === 0) {
            if (0 <= textOrder && textOrder <= noWordPosition[i]) {
                if (/*keyCode === ENTER &&*/ rectColorSwitch === 1) {
                    //rectColor[i] = rectColor[i] + (50 / (noWordPosition[i] + 1));
                    rectColor[i] = 150;
                    rectColorSwitch = 0;
                }
            } else if (noWordPosition[i] <= textOrder) {
                rectColor[i] = 230;
            }
        } else {
            if (noWordPosition[i - 1] + 1 <= textOrder && textOrder <= noWordPosition[i]) {
                if (/*keyCode === ENTER &&*/ rectColorSwitch == 1) {
                    //rectColor[i] = rectColor[i] + (50 / (noWordPosition[i] - noWordPosition[i - 1]));
                    rectColor[i] = 150;
                    rectColorSwitch = 0;
                }
            } else if (noWordPosition[i] <= textOrder) {
                rectColor[i] = 230;

            }
        }

        fill(rectColor[i]);
        noStroke();
        rect(paragraphRectX[i], paragraphRectY[i], paragraphRectWidth[i], paragraphRectHeight[i]);
    }
}





function touchStarted() {

    if (setupFinish === 1) {

        textSwitch[textOrder] = 1;
        textOrder = textOrder + 1;

        progressBarSwitch = 1;
        rectColorSwitch = 1;
    }
    if (bgmSwitch === 1) {
        userStartAudio();
        bgmSwitch = 0;
    }
}




// do this prevent default touch interaction
function mousePressed() {
    return false;
}

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});


