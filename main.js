// Copyright (c) 2022 qianjunakasumi <i@qianjunakasumi.ren>
//                    qianjunakasumi <qianjunakasumi@outlook.com>
//                    [qianjunakasumi] 千橘雫霞(https://github.com/qianjunakasumi)
//
//      This Source Code Form is subject to the terms of the Mozilla Public
//      License, v. 2.0. If a copy of the MPL was not distributed with this
//      file, You can obtain one at http://mozilla.org/MPL/2.0/.

// ==UserScript==
// @name         升学e网通播放器之马卡龙
// @namespace    ren.qianjunakasumi
// @version      1.0.2
// @author       qianjunakasumi
// @description  升学e网通视频播放器小组件
// @source       https://github.com/qianjunakasumi/EWTPlayerMacaron
// @updateURL    https://github.com/qianjunakasumi/EWTPlayerMacaron/blob/main/main.js
// @downloadURL  https://github.com/qianjunakasumi/EWTPlayerMacaron/blob/main/main.js
// @supportURL   https://github.com/qianjunakasumi/EWTPlayerMacaron/issues/new/choose
// @match        web.ewt360.com/site-study/*
// @grant        GM_addStyle
// @run-at       document-video
// ==/UserScript==

let fox = false;

function player() {
    return document.getElementsByClassName('ccH5playerBox')[0];
}

function video() {
    if (fox) {
        return document.getElementsByTagName('video')[1];
    }
    return document.getElementsByTagName('video')[0];
}

function addCuteFox() {
    if (fox) {
        return;
    }
    let f = document.createElement('video');
    f.style.display = 'none';
    player().insertBefore(f, video());
    fox = true;
}

const PLAYBACKRATE = {
    data: 10,
    add: () => {
        if (PLAYBACKRATE.data === 160) {
            return;
        }
        PLAYBACKRATE.data++;
        PLAYBACKRATE.set();
    },
    subtract: () => {
        if (PLAYBACKRATE.data === 1) {
            return;
        }
        PLAYBACKRATE.data--;
        PLAYBACKRATE.set();
    },
    set: () => {
        addCuteFox();
        video().playbackRate = PLAYBACKRATE.data / 10
    },
    get: () => video().playbackRate,
};

let KEYC = false;
let KEYV = false;

function keyUp(e) {
    switch (e.keyCode) {
        case 67:
        case 86:
            PLAYBACKRATE.set();
            KEYC = false;
            KEYV = false;
    }
}

function keyDown(e) {
    switch (e.keyCode) {
        case 90:
            PLAYBACKRATE.subtract();
            BAR.display('倍数- x' + PLAYBACKRATE.get());
            break;
        case 88:
            PLAYBACKRATE.add();
            BAR.display('倍数+ x' + PLAYBACKRATE.get());
            break;
        case 67:
            BAR.display('正速回放');
            if (KEYC) {
                return;
            }
            video().currentTime -= 5;
            video().playbackRate = 1;
            KEYC = true;
            break;
        case  86:
            BAR.display('正速播放');
            if (KEYV) {
                return;
            }
            video().playbackRate = 1;
            KEYC = true;
            break;
        case 80:
            video().requestPictureInPicture();
            break;
    }
}

const BAR = {
    visible: false,
    instance: null,
    timer: null,
    _init: () => {
        let b = document.createElement('div');
        b.id = 'qianjuewtplayermacaron';
        b.classList.add('ccH5FadeOut');
        BAR.instance = b;
        player().appendChild(b);
    },
    display: c => {
        if (!document.getElementById('qianjuewtplayermacaron')) {
            BAR._init(c);
        }
        if (BAR.visible) {
            BAR.instance.innerText = c;
            BAR.resetTimer();
            return;
        }

        BAR.instance.innerText = c;
        BAR.instance.classList.replace('ccH5FadeOut', 'ccH5FadeIn');
        BAR.visible = true;
        BAR.hidden();
    },
    hidden: () => {
        BAR.timer = setTimeout(() => {
            BAR.instance.classList.replace('ccH5FadeIn', 'ccH5FadeOut');
            BAR.visible = false;
        }, 1500);
    },
    resetTimer: () => {
        clearTimeout(BAR.timer);
        BAR.hidden();
    },
};

(function () {
    'use strict';
    GM_addStyle(`
#qianjuewtplayermacaron {
    position: absolute;
    padding: .6rem;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    background: rgba(0,0,0,.6);
    line-height: normal;
    font-size: 1.4em;
    font-weight: bolder;
}
`);

    document.addEventListener('keyup', keyUp, false);
    document.addEventListener('keydown', keyDown, false);
})();
