가장중요 ***
현재 로그인성공시 main.html로 넘어가게 되어있는데, 경로 수정해줘야함
현재 main.html은 login페이지와 같은 경로에 있음 ==> 지워야함




강의실에서 서버 실행시 해야할거 **
1. controller의 주소 @CrossOrigin 확인 \
	@CrossOrigin(origins = "http://127.0.0.1:5555")
2. 프론트의 호출 주소 확인 
	fetch("http://??:8080/api/login",

3. 만약 파일 위치가 바뀐다 
	그냥 프론트 파일들(html css js) html에 연결되는 경로만 확인해주면될듯





실행법 **
1. sts실행 ( 백엔드부터 실행시켜주는게 좋다고 함)

2. nodeJs로 라이브서버 실행 
npx live-server --port=5555
	컨트롤러에서 5555로 정했으면 npx live-server --port=5555  [ @CrossOrigin(origins = "http://127.0.0.1:5555") ]

** 실행시 @CrossOrigin로 호출한 주소와 같은 주소로 접속
	@CrossOrigin(origins = "http://127.0.0.1:5555") 으로 설정했으면 
	http://127.0.0.1:5555/br_oplogin.html 로 접속



추가 ** 
로그인 페이지 하나만 있어도 될거같은데 둘중 하나 지우고 login.html로 수정하고
h2 내용을 로그인 페이지 이런식으로 바꿔도가장중요 ***
현재 로그인성공시 main.html로 넘어가게 되어있는데, 경로 수정해줘야함
현재 main.html은 login페이지와 같은 경로에 있음 ==> 지워야함




강의실에서 서버 실행시 해야할거 **
1. controller의 주소 @CrossOrigin 확인 \
	@CrossOrigin(origins = "http://127.0.0.1:5555")
2. 프론트의 호출 주소 확인 
	fetch("http://??:8080/api/login",

3. 만약 파일 위치가 바뀐다 
	그냥 프론트 파일들(html css js) html에 연결되는 경로만 확인해주면될듯





실행법 **
1. sts실행 ( 백엔드부터 실행시켜주는게 좋다고 함)

2. nodeJs로 라이브서버 실행 
npx live-server --port=5555
	컨트롤러에서 5555로 정했으면 npx live-server --port=5555  [ @CrossOrigin(origins = "http://127.0.0.1:5555") ]

** 실행시 @CrossOrigin로 호출한 주소와 같은 주소로 접속
	@CrossOrigin(origins = "http://127.0.0.1:5555") 으로 설정했으면 
	http://127.0.0.1:5555/br_oplogin.html 로 접속



추가 ** 
로그인 페이지 하나만 있어도 될거같은데 둘중 하나 지우고 login.html로 수정하고
h2 내용을 관리 페이지 이런식으로 바꿔도 되지 않을까요 
시작화면이 두개라서 이상해요 그냥 
다른팀처럼 하나로 해도될듯
어짜피 두개 h2에 쓰여있는 말만다르지 코드는 100% 똑같아요요
