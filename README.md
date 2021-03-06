## 👀 비블리 (유튜브 클론) 회고록💭

- 사용 기술
- 프로젝트 시작
- 추가적인 기능
- 배포

---

### 프로젝트 시작

프로젝트 진행과 프로그래밍에 있어서, 전반적인 상을 익히기 위해  
처음으로 가진 풀스택 프로젝트(?) 라고 부르고 싶지만, 뜯어보고 관찰하는 것으로 <br>
시작한 프로그램이라 보는 게 적합할 겁니다.

#### 이 프로젝트를 시작한 이유 ?

처음 접했을 때 깃헙이나, 깃헙의 호스팅
<br>
기능에 의존하지 않고, 자체 서버를 배포할 수 있다는 말에 혹해서 시작하였습니다.

배움을 통해 마주한 새로운 기술을 하나의 퍼즐조각으로
실제 웹에선 어떤 식으로 적용할지 생각하며
유저와 브라우저, 그리고 서버간의 춤에 직접
간섭할 수 있었던 점이 흥미로웠습니다.

#### 프로젝트 진행 시 염두에 둔 것

> "생각만 하지 말고 찾아 보아라"
>
> > "잘 하는 아이 옆자리에 앉으면 너 또한 나아지리"

저는 코딩에 있어서 잘 하는 아이 옆자리에 앉는 것이란, 최대한 많은
<br>
코딩 작품을 감상하고, 리뷰하고, '왜'라는 질문을 던지는 것이라 생각했습니다.
<br>
때문에 프로젝트를 진행하는 동안 유튜브 포함 많은 관련 사이트의 구조를
<br>
열어보고, 관찰하며, '왜 이렇게 썼을까?' '이렇게 디자인한 목적이 뭐지'
<br>
라는 질문을 염두에 두고 거기서 발견한 장점을 가져오며 만들었습니다.

### 사용 기술

#### FrontEnd

<p>
<img src="./read_src/tech_icon/html5.png" width="75" height="75"/>
<img src="./read_src/tech_icon/css3.png" width="75" height="75"/>
<img src="./read_src/tech_icon/es6.png" width="75" height="75"/>
<img src="./read_src/tech_icon/pug.png" width="75" height="75"/>
<img src="./read_src/tech_icon/js.png" width="75" height="75"/>
</p>

#### BackEnd

<img src="./read_src/tech_icon/nodejs.png" width="75" height="75"/>

#### DataBase

<img src="./read_src/tech_icon/mongodb.png" width="75" height="75"/>

### 추가적인 기능

<details>
<summary>Drag & Drop Video UPLoad</summary>

#### Drag & Drop Video UPLoad

리액트 수업으로 넘아가기 전, 바닐라 JS로 가능한 한 모든 인터렉티브한 부분을 구현해 보고, 기반을 다지기 위해 만들어본 추가적인 기능입니다.

#### Before, 구현 중 마주한 문제 ?

파일 리더를 통해 원하는 html element 안에 fileURL이 들어간 비디오 태그를 집어넣어 drop된 비디오를 보여주는 방식으로 구현해 보았습니다.
<br>
비디오를 원하는 구역에 불러왔을 지라도, 원래 비디오 데이터를 받을 수 있는 요소는 form에 있는 input이었기 때문에, 파일 드롭 후 제출 버튼 클릭 시, 데이터 베이스에 올라가지 않는 경우가 발생했습니다.

#### After, 이 문제를 고친 방법은 ?

비디오 파일을 읽어올 때, input element와 JS event dataTrasfer의 files 속성을 이용해, 파일 로딩 시 input 값을 부여하는 것으로, 이 문제가 발생하지 않도록 수정하였습니다.

<details>
<summary>적용 사진 보기</summary>

<img src="./read_src/screen_shot/videoDrop_sreen.gif" width="600"/>

</details>

</details>
<details>
<summary>++Video Captions UPLoad</summary>

#### Video Captions UPLoad

비디오를 업로드 하기 위한 사이트 인지라, 자막 업로드 기능이 없을 시, 비디오 시청이 매우 불편할 것 같아 만들어본 기능입니다.

<details>
<summary>소스 코드 보기</summary>

#### ./src/controllers/videoController.js

```
const { _id } = req.session.user;
    const { video, thumb, captions } = req.files;
    const { title, description, hashtags } = req.body;
    const isHeroku = process.env.NODE_ENV === "production";
    try{
        const newVideo = await Video.create({
            title,
            description,
            createdAt: new Date(Date.now()).toLocaleDateString(),
            hashtags: Video.formatHashtags(hashtags),
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl: isHeroku ? Video.changePathFormula(thumb[0].location) : Video.changePathFormula(thumb[0].path),
            captionsUrl: captions ? (isHeroku ? captions[0].location : captions[0].path ) : "",
            owner: _id,
        });
```

</details>

#### Before, 구현 중 발견한 문제점 ?

자막 url을 저장할 때, rep.files.captions 가 null 인 경우, 자막 업로드에 실패하는 에러를 발견했습니다.

#### After, 이 문제를 해결한 방법은 ?

업로드 전, 선택된 자막 파일이 있는 지 묻는 if문을 통해, 선택된 파일이 있을 시 파일 경로를 저장하고, 없을 시 공백으로 두어 해결하였습니다.

</details>
<details>
<summary>Kakao, Twitter, Google, Github 간편 로그인</summary>

#### Kakao, Twitter, Google, Github 소셜 간편 로그인

- 아직 작성 중... 💨

</details>
<details>
<summary>실시간 댓글++ && 좋아요 && 구독</summary>

#### 실시간 댓글++ && 좋아요 && 구독

- 아직 작성 중... 💨

</details>
<details>
<summary>Switch Themes</summary>

#### Switch Themes

- 아직 작성 중... 💨

</details>

### 배포

#### 배포 링크

<a href="https://bibley.herokuapp.com/">https://bibley.herokuapp.com/</a>

### 프로젝트 기간

2022.03.07 ~ 2022.05.28
<br>
2개월 22일
