let sendbutton;
let messages;

window.onload = ()=>{
    sendbutton = document.querySelector('#messageSend');
    messages = document.querySelector('#chatArea');

    sendbutton.addEventListener('click', function(){
        //버튼 id messageSend에 click 등록 및 그에 따른 반응 등록
        let inputArea = document.querySelector('input');
        let inputdata =inputArea.value;
        messages.value += "You : " + inputArea.value +"\n";
        inputArea.value='';
        sendMessage('/simplechatBot', inputdata)
      });
}

function sendMessage(url, data){
  let jsonData = JSON.stringify({'message':data});  //Json 변환

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-type', "application/json");  // content-type을 설정하고 데이터 송신
  xhr.send(jsonData); 
  
  xhr.addEventListener('load', function(){   // 데이터 수신에 대한 결과 출력
    let result = JSON.parse(xhr.responseText);
    messages.value += "Bot : " + result['result']+"\n";
  });
}