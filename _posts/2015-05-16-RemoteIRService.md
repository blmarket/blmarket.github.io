---
layout: post
title:  "Released RemoteIRService 0.1.0"
date:   2014-05-16 23:23:23
categories: remoteir release android
---

[Project Homepage](https://github.com/blmarket/RemoteIRService)

### Abstract

이 프로젝트는 ir blaster 기능을 제공하는 맛폰에서, ir blaster 기능을 REST API를 통해 제공하는 것을 목표로 한다.

### Requirements

맛폰은 다음 조건을 만족해야 한다.

* ir blaster 기능이 있는 녀석 - 갤노트3,4 갤S4,5,6 등이 지원하는 것으로 알고 있다.

### Features

* basic remote : remote control에 필요한 수준의 기능을 충분히 제공한다. (차마 충실하게 제공한다고는 못하겠다)
* multi device : REST API만을 제공하기 때문에, 어떤 장비에서도 맛폰에 접속해서 신호를 보낼 수 있다. 즉, 맛폰을 거실 적당한 위치에 두기만 하면, 어디서도 간단하게 집안의 A/V 장비들을 조작할 수 있게 된다.

### How to use?

프로젝트의 홈페이지를 참조하면 간단한 사용방법에 대해 알 수 있고, 여기서는 기술적 이야기보다는 뭐가 필요한지에 대해 더 설명해보도록 하겠다.

자기가 사용하는 장비의 리모트 신호에 대해 알아야 요청을 만들어 보낼 수 있다. 신호가 어떻게 생성되어 전송되는지에 대해서는 [삼성전자의 설명 문서](http://developer.samsung.com/technical-doc/view.do;jsessionid=rnY0VXbJvB8Cd141K2QXnfdDcvxJLpJ2HPvK9Qrdg004z3vj1Cnl!404960129?v=T000000125)를 참조하면 좋다. 장비의 리모트 신호를 얻는 방법은 여러가지가 있는데

* 저자(twitter @blmarket)에게 직접 문의한다 - 이런저런 신호를 나에게 맞게 변환해 두었다. 용량과 혹시나 있을 수 있는 저작권 문제로 public 공개는 하지 못할것 같은데...
* [다음 guide](http://stackoverflow.com/questions/20244337/consumerirmanager-api-19)를 따라한다.
* 신호를 직접 캡쳐한다 - ir LED가 있으면 audio input을 이용해서 간단하게 오실로스코프 비스무레하게 작동하게 만들 수 있고, 그걸 활용해서 신호 table을 직접 만들 수도 있다. 여러모로 힘들고 괴로운 작업이 되겠지만... 인터넷 상에서 신호 table을 구할 수 없다면 이게 유일한 방법이겠지;;

### Why this project?

리모콘은 언제나 골칫거리였다.

* 여러 개의 장비를 조작해야 할 때 - 여러 개의 리모콘이 필요하며, 그것들 각각을 조작해야 한다.
* 찾기 힘들다 - 때때로 리모콘은 찾기 어려운 곳에 있는 경우가 있어, 번거롭다.

그래서 나온 사업 아이디어가 '스마트 리모콘'이다. 소프트웨어로 제어 가능한 리모콘을 제공하는 것인데, 대략 현재 나와있는 것들은 다음과 같다.

* 맛폰의 audio output을 활용, ir 신호를 발신하는 부가장비를 활용하는 방법 - irdroid 등
* 아예 새 하드웨어를 도입하는 방법 - logitech harmony
* 맛폰에서 ir blaster를 제공하는 것들 - 삼성, HTC의 일부 맛폰들
  * 하드웨어만 제공되는 셈이므로, 소프트웨어 쪽은 전국시대인 상황.

위에 나열한 것들을 각각 조금씩 사용해본 적이 있는데,

* audio output을 활용하는 것은 별도의 증폭 장치를 사용하지 않는 한, 신호가 약해서 제대로 사용하기는 어렵다.
* harmony의 경우, 어쨌든 리모콘 형식의 장비를 사용해야 하는데, 대부분의 버튼 mapping은 이미 정해져 있고, customizable한 버튼은 몇개 되지 않아서 아쉽다.
* 맛폰의 ir blaster를 사용하는 것으로 peel 이라는 앱을 사용해 봤는데, tv remote와 tv 방송의 time table을 통합한 형태의 앱으로, 방송중인 프로그램을 보여주고 선택하면 자동으로 채널 이동을 제공하는 등 여러모로 꽤나 잘 만든 앱이라는 느낌이었다. 하지만 이 앱의 경우, tv guide쪽으로 너무 발전했다고 해야 하나... 보다 저수준의 제어 기능은 잘 제공하지 않았다. 그리고 무엇보다... 맛폰 화면 보면서 방송 선택하고 싶지가 않았다.

그래서 여튼 간단하게 해볼 요량으로 이 프로젝트를 시작했다. 실제로는 이거 만드는 것보다 ir 신호 수집하는게 더 어려웠다.
