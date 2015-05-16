---
title: Node v0.10 streaming
layout: post
---

### Head first example

당신의 Express app이 제공하는 모든 경로에 대해 설명하는 문서를 작성하고 싶었다.
그러기 위해서 먼저 그 경로들을 뽑아내는 함수를 만들려고 했다.
처음 생각해서 만든 코드는 다음과 같다.

{% highlight coffee %}
routes = require('./routes').routes

fetchList = (onItem, callback) ->
  fake_app = {}
  attach_method = (method_name) ->
    fake_app[method_name] = (url) ->
      onItem method_name, url

  attach_method(method) for method in [ 'get', 'post', 'delete', 'put', 'all', 'options' ]

  routes fake_app
  callback null

fetchList(
  (method, url) ->
    console.log method, url
  (err) ->
    throw err if err
    process.exit()
)
{% endhighlight %}

근데 일단 콜백 함수를 두 종류로 만들어 관리해야 하는 것도 마음에 안들었고, 원래 알고 있던

node의 stream이랑 하는 일이 너무 비슷해 보여서 이럴바에는 stream으로 구현하기로 맘먹었다.

### Node의 stream

[새 stream에 대한 설명](http://blog.nodejs.org/2012/12/20/streams2/)을 보면 알겠지만, .10의
stream은 이전 버전과 달리 pause를 구현해야만 한다. 간단히 생각해서, 한강에 홍수가 날것 같으면
팔당댐을 막아 흘려보내는 수량을 조절하듯이, node의 stream에서도, 받는 녀석이 제때제때 처리하지
못하면 보내는 녀석을 막아 중간에 생기는 버퍼의 최대 크기를 조절해주는 것이다.

허나 예전 버전에서는 꼭 pause 함수를 구현할 필요가 없었기 때문에(라이브러리가 그것을 강제하지
않았다) 때로 버퍼가 넘쳐 서버에 메모리 부하를 주는 경우도 있었다. 간단히 말해, 한강이 넘쳐서
물난리가 났다고 생각해라.

### 그런데...

node의 stream은 기본적으로 binary buffer이다. 즉 위 예제의 javascript object를 stream에 
실어 보내려면 먼저 JSON등을 이용해서 serialize를 해서 보내고 받고 해야 한다는 것인데... 
너무 비효율적이란 생각이 들었다.

### 혹시 대안은?

Stream 문서를 다시 찬찬히 읽어보다가 objectMode란 플래그를 발견했다. 혹시?
[설명을 발견한 문서](http://blog.strongloop.com/practical-examples-of-the-new-node-js-streams-api/)
에 따르면 이건 그냥 stream을 임의 chunk 대신 line by line으로 처리할 수 있게 해주는 녀석이라 한다.

사실 streaming이 javascript object를 처리해줬으면 더 좋았겠지만, 실상 이녀석은 성능이 중요한
녀석도 아니고, 설혹 성능이 중요하다 하더라도 object를 직접 넘기는 과정에서 어차피 cloning을
했어야 하는 것이니만큼, 그냥 JSON을 중간에 한번 거쳐도 무방하다고 생각된다.

### v0.10 stream의 head first example

무의미한 스트링을 계속 쏟아내는 stream을 만들어봤다.

{% highlight coffee %}
stream = require 'stream'
routes = require('./routes').routes

class APIListReader extends stream.Readable
  _read: ->
    setImmediate => # 보통 stream은 async하게 작동한다.
      chunk = JSON.stringify({a:1})
      while @push(chunk, 'utf-8')
        1 # keep pushing

reader = new APIListReader {
  highWaterMark: 16384
}
reader.on 'readable', ->
  console.log reader.read()
{% endhighlight %}

실행해보니 대충 원하는 대로 나온다. 

setImmediate를 쓰지 않으면 stream이 sync 모드로 작동하면서 call stack이 
폭발하는 문제가 있긴 하지만 node의 문제이고 워낙 변태같은 사용 사례이니 
패스하자.

### 병신같지만 작동하는 다음 버전

우리가 미리 만들어놓은 routes 함수는 당연빠따 streaming을 지원하지 않으므로,
예전 버전이나 마찬가지로 구현해야 한다 `-_-;;`... 에잇 포기 streaming은
걍 다음에 쓰도록 하자.
